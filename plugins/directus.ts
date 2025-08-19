import {
  createDirectus,
  rest,
  authentication,
  readMe,
  registerUser,
  readItems,
  createItem,
  updateItem,
  deleteItem,
  refresh,
  type AuthenticationStorage,
  type DirectusClient,
  readUser,
  uploadFiles,
} from '@directus/sdk';
import type { DirectusSchema } from '~/directus.d.ts';
import type { CreatePost, UserPost } from '~/types/post';
import type { User } from '~/types/user';

interface DirectusPlugin {
  directus: DirectusClient<DirectusSchema>;
  registerUser: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<User | false>;
  refreshToken: () => Promise<void>;
  getPosts: (user_id?: string) => Promise<UserPost[]>;
  createPost: (data: Partial<CreatePost>, files: File[]) => Promise<UserPost>;
  updatePost: (id: string, data: Partial<UserPost>) => Promise<UserPost>;
  deletePost: (id: string) => Promise<void>;
  getAccessToken: () => string | undefined;
  [key: string]: unknown;
}

declare module '#app' {
  interface NuxtApp {
    $directus: DirectusPlugin['directus'];
    $registerUser: DirectusPlugin['registerUser'];
    $login: DirectusPlugin['login'];
    $logout: DirectusPlugin['logout'];
    $isAuthenticated: DirectusPlugin['isAuthenticated'];
    $refreshToken: DirectusPlugin['refreshToken'];
    $getPosts: DirectusPlugin['getPosts'];
    $createPost: DirectusPlugin['createPost'];
    $updatePost: DirectusPlugin['updatePost'];
    $deletePost: DirectusPlugin['deletePost'];
    $getAccessToken: DirectusPlugin['getAccessToken'];
  }
}

export default defineNuxtPlugin(() => {
  class NuxtCookieStorage {
    cookie = useCookie('directus-data', { maxAge: 60 * 60 * 24 * 7 });
    get() {
      console.log('Directus: Получение куки directus-data:', this.cookie.value);
      return this.cookie.value;
    }
    set(data: any) {
      console.log('Directus: Установка куки directus-data:', data);
      this.cookie.value = data;
    }
  }

  const storage = new NuxtCookieStorage() as AuthenticationStorage;

  const directus = createDirectus<DirectusSchema>('http://localhost:8055')
    .with(authentication('cookie', { credentials: 'include', storage }))
    .with(rest({ credentials: 'include' }));

  const isAuthenticated = async () => {
    try {
      console.log('Directus: Проверка аутентификации...');
      const me = await directus.request(readMe());
      console.log('Directus: Пользователь:', me);
      return me;
    } catch (error) {
      console.error('Directus: Ошибка аутентификации:', error);
      return false;
    }
  };

  const getAccessToken = () => {
    // Получаем данные из куки
    const directusData = storage.get();
    if (directusData && typeof directusData === 'object' && 'access_token' in directusData) {
      return directusData.access_token;
    }
    return undefined;
  };

  const login = async (email: string, password: string) => {
    console.log('Directus: Логин с email=', email);
    await directus.login(email, password, { mode: 'cookie' });
    console.log('Directus: Логин успешен');
  };

  const logout = async () => {
    console.log('Directus: Выход');
    await directus.logout();
    console.log('Directus: Выход успешен');
    navigateTo('/login');
  };

  const refreshToken = async () => {
    console.log('Directus: Рефреш токена...');
    await directus.request(refresh('cookie'));
    console.log('Directus: Токен обновлён');
  };

  const getPosts = async (user_id: string) => {
    try {
      console.log('Directus: Запрос постов...', user_id);
      const result = await directus.request(
        readItems('posts', {
          fields: ['id', 'title', 'description', { likes: ['id'] }, 'likes', { user_created: ['id', 'username', 'avatar'] }, { files: ['directus_files_id', 'id', 'posts_id'] }],
          filter: {
            user_created: {
              id: {
                _eq: user_id
              }
            }
          },
          // sort: ['-likes']
        })
      );
      console.log('Directus: Посты:', result);
      return result;
    } catch (error: any) {
      console.error('Directus: Ошибка getPosts:', error);
      if (error.status === 401) {
        console.log('Directus: 401, пробуем рефреш токена');
        await refreshToken();
        const result = await directus.request(
          readItems('posts', {
            fields: ['id', 'title', 'description', 'likes', { user_created: ['id', 'username', 'avatar'] }, { files: ['*', 'directus_files_id.id.*', 'id.*', 'posts_id.*'] }],
            filter: {
              user_created: {
                id: {
                  _eq: user_id
                }
              }
            }
          })
        );
        console.log('Directus: Посты после рефреша:', result);
        return result;
      }
      throw error;
    }
  };

  const createPost = async (data: Partial<CreatePost>, files: File[]) => {
    try {
      console.log('Directus: Создание поста:', data, files);
      const folderId = "b6c25aed-02ed-4545-b4d4-97d02c9d3dc1"; // ID папки для постов

      // 1. Загружаем все файлы
      const uploadedFileIds = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folderId); // Указываем ID папки

          const response = await directus.request(uploadFiles(formData));
          return response.id;
        })
      );
      console.log('Directus: Файлы загружены:', uploadedFileIds);

      // 2. Создаем сам пост
      const newPost = await directus.request(
        createItem('posts', {
          title: data.title,
          description: data.description,
        })
      );
      console.log('Directus: Пост создан:', newPost);

      // 3. Создаем связи между постом и файлами в M2M таблице posts_files
      await Promise.all(
        uploadedFileIds.map((fileId: string) =>
          directus.request(
            createItem('posts_files', {
              posts_id: newPost.id,
              directus_files_id: fileId
            })
          )
        )
      );
      console.log('Directus: Связи между постом и файлами созданы.');

      // 4. Возвращаем полный объект поста для обновления state
      const createdPost = await directus.request(
        readItems('posts', {
          fields: [
            'id',
            'title',
            'description',
            'likes',
            { user_created: ['id', 'username', 'avatar'] },
            { files: ['directus_files_id'] } // Запрашиваем ID файлов
          ],
          filter: { id: { _eq: newPost.id } }
        })
      );
      return createdPost[0];
    } catch (error) {
      console.error('Directus: Ошибка создания поста:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, data: Partial<UserPost>) => {
    console.log('Directus: Обновление поста:', id, data);
    const result = await directus.request(updateItem('posts', id, data));
    console.log('Directus: Пост обновлён:', result);
    return result;
  };

  const deletePost = async (id: string) => {
    console.log('Directus: Удаление поста:', id);
    await directus.request(deleteItem('posts', id));
    console.log('Directus: Пост удалён');
  };

  const getUserInfo = async (user_id: string) => {
    try {
      const user = await directus.request(readUser(user_id, { fields: ['id', 'avatar', 'username', 'subscribed', 'subscribers', 'email', 'first_name', 'last_name', 'description', 'last_access'] }));
      console.log('Directus: User info:', user);
      return user
    } catch (error) {
      throw error;
    }
  }

  const likePost = async (post_id: string, user_id: string) => {
    const like = await directus.request(
      createItem('posts_likes', {
        post_id: post_id,
        user_id: user_id
      })
    );
    console.log('Directus: лайк создан:', like);
  }

  const unlikePost = async (post_id: string) => {
    const likeForDelete = await directus.request(readItems('posts_likes', {
      filter: { post_id: { _eq: post_id } }
    }))
    const unlike = await directus.request(
      deleteItem('posts_likes', likeForDelete[0].id)
    );
    console.log('Directus: лайк удален:', unlike);
  }

  return {
    provide: {
      directus,
      registerUser,
      login,
      logout,
      isAuthenticated,
      refreshToken,
      getPosts,
      createPost,
      updatePost,
      deletePost,
      getUserInfo,
      getAccessToken,
      likePost,
      unlikePost
    },
  };
});