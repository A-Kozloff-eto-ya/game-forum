import { defineStore } from 'pinia';
import type { CreatePost, UserPost } from '~/types/post';
import { useAuthStore } from '~/stores/auth';

export const usePostsStore = defineStore('posts', {
    state: () => ({
        posts: [] as UserPost[],
        error: null as string | null,
    }),
    getters: {
        // Посты текущего пользователя
        userPosts(state) {
            const authStore = useAuthStore();
            if (!authStore.user) return [];
            return state.posts.filter(post => post.user_created.id === authStore.user?.id);
        },
    },
    actions: {
        async fetchPosts(user_id?: string) {
            const { $getPosts } = useNuxtApp();
            try {
                console.log('PostsStore: Загрузка постов...');
                this.posts = await $getPosts(user_id);
                this.error = null;
                console.log('PostsStore: Посты загружены:', this.posts);
            } catch (error: any) {
                this.error = error.message || 'Ошибка загрузки постов';
                console.error('PostsStore: Ошибка:', error);
                this.posts = [];
            }
        },
        async deletePost(postId: string) {
            const { $deletePost } = useNuxtApp();
            try {
                await $deletePost(postId);
                this.posts = this.posts.filter(post => post.id !== postId);
                this.error = null;
                console.log('PostsStore: Пост удалён:', postId);
            } catch (error: any) {
                this.error = error.message || 'Ошибка удаления поста';
                console.error('PostsStore: Ошибка удаления:', error);
            }
        },
        async createPost(data: CreatePost, files: File[]) {
            const { $createPost } = useNuxtApp();
            try {
                console.log('PostsStore: Попытка создания поста...');
                // Передаем данные и массив файлов в плагин
                console.log('store',files)
                const newPost = await $createPost(data, files);

                // Добавляем новый пост в начало массива
                this.posts.unshift(newPost);

                this.error = null;
                console.log('PostsStore: Пост успешно создан:', newPost);

                // Показываем toast-уведомление об успехе
                const toast = useToast();
                toast.add({
                    title: 'Успех!',
                    description: 'Пост успешно создан',
                    icon: 'i-heroicons-check-circle',
                });
            } catch (error: any) {
                this.error = error.message || 'Ошибка создания поста';
                console.error('PostsStore: Ошибка создания:', error);

                // Показываем toast-уведомление об ошибке
                const toast = useToast();
                toast.add({
                    title: 'Ошибка',
                    description: 'Не удалось создать пост',
                    icon: 'i-heroicons-exclamation-circle',
                });
            }
        },
        async likePost(user_id: string, post_id: string) {
            const { $likePost } = useNuxtApp();
            try {
                const like = await $likePost(post_id, user_id);
                console.log(like)
            } catch (error) {
                console.log(error)
            }
        },
         async unlikePost(post_id: string) {
            const { $unlikePost } = useNuxtApp();
            try {
                const unlike = await $unlikePost(post_id);
                console.log(unlike)
            } catch (error) {
                console.log(error)
            }
        }
    },
    hydrate(state, initialState) {
        console.log('PostsStore: Гидратация, initialState=', initialState);
        state.posts = initialState.posts;
        state.error = initialState.error;
    },
});