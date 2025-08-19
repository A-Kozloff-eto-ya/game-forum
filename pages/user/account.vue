<template>
  <UTabs variant="pill" orientation="vertical" :items="items" class="w-full max-w-[1414px] items-start gap-8 grow" :ui="{
    list: 'flex-1 shadow-main border rounded bg-(--bg-secondary)',
    content: 'flex-4 h-full',
    trigger: 'w-full cursor-pointer',
    indicator: 'rounded'
  }">
    <template #account v-if="authStore.user">
      <div class="relative w-full h-fit border rounded shadow-main bg-(--bg-secondary) overflow-hidden">
        <!-- Header Background -->
        <div class="w-full h-32 bg-gradient-to-t from-sky-500 to-indigo-500"></div>

        <!-- Avatar and User Info -->
        <div class="relative px-6 py-4">
          <!-- Avatar -->
          <div class="absolute -top-16 left-6">
            <UAvatar v-if="authStore.user.avatar" :src="`http://localhost:8055/assets/${authStore.user.avatar}`"
              class="h-32 w-32 ring-4 ring-white " fit="cover" alt="User avatar" />
            <UAvatar v-else class="h-32 w-32 ring-4 ring-white " fit="cover" alt="User avatar" />

          </div>

          <!-- User Info Section -->
          <div class="mt-16 space-y-4">
            <!-- Name and Username -->
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">
                  {{ authStore.user.first_name }} {{ authStore.user.last_name }}
                </h2>
                <p class="text-sm text-gray-500">
                  @{{ authStore.user.username }}
                </p>
              </div>
              <UButton label="Редактировать профиль" color="neutral" variant="outline" size="sm"
                class="hover:bg-gray-100" />
            </div>

            <!-- Bio -->
            <p class="text-gray-600 text-sm max-w-lg">
              Расскажите о себе...
            </p>

            <!-- Stats -->
            <div class="flex gap-6 text-sm text-gray-500">
              <div>
                <span class="font-medium text-gray-900">{{ postsStore.userPosts.length }}</span> <span
                  class="cursor-pointer">постов</span>
              </div>
              <div>
                <span class="font-medium text-gray-900 cursor-pointer">{{ authStore.user.subscribers?.length }}</span>
                <span class="cursor-pointer">подписчиков</span>
              </div>
              <div>
                <span class="font-medium text-gray-900 cursor-pointer">{{ authStore.user.subscribed ?
                  authStore.user.subscribed.length : 0 }}</span> <span class="cursor-pointer">подписок</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Responsive Adjustments -->
        <div class="px-6 py-4 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="h-4 w-4" />
              <span>{{ authStore.user.email || 'email@example.com' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
              <span>Губкин</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="h-4 w-4" />
              <span>Регистрация: 12.07.2025</span>
            </div>
            <!-- <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="h-4 w-4" />
              <span>Был в сети: {{ authUser.last_access }}</span>
            </div> -->
          </div>
        </div>
      </div>
    </template>
    <template #posts="{ item }">
      <div v-if="postsStore.userPosts.length > 0 && authStore.user" class="flex flex-col gap-8">
        <Post v-for="post in postsStore.userPosts" :user_id="authStore.user.id" class="border h-fit w-full" :post="post">
          <template #deleteButton>
            <UButton icon="i-lucide-trash-2" color="neutral" class="h-fit cursor-pointer"
              @click="postsStore.deletePost(post.id)" />
          </template>
        </Post>
      </div>
      <div v-else class="shadow-main p-4 w-full rounded border bg-(--bg-secondary)">У вас нет постов</div>
    </template>
    <template #new-post="{ item }">
      <div class="flex flex-row gap-8">
        <UCard
          class="max-w-[700px] border w-full flex flex-col flex-5 justify-between shadow-main rounded ring-0 bg-(--bg-secondary)"
          :ui="{ header: 'flex flex-row justify-between' }">
          <template #header>
            <div class="flex flex-col gap-4 w-full">
              <UInput v-model="state.title" placeholder="Заголовок поста" class="text-2xl "
                :ui="{ base: 'focus-visible:ring-1' }" />
              <UTextarea v-model="state.description" placeholder="Описание поста" class="text-base"
                :ui="{ base: 'focus-visible:ring-1' }" />
            </div>
            <slot name="publishButton" />
          </template>
          <UFileUpload v-model="state.files" icon="i-lucide-image" :multiple="true" label="Drop your images here"
            description="SVG, PNG, JPG or GIF (max. 2MB)" layout="grid" :interactive="false"
            class="min-h-48 grow rounded w-full" :ui="{ base: 'hover:border-black' }">
            <template #actions="{ open }">
              <UButton label="Select images" icon="i-lucide-upload" color="neutral" variant="outline"
                class="cursor-pointer" @click="open()" />
            </template>

            <template #files-top="{ open, files }">
              <div v-if="files?.length" class="mb-2 flex items-center justify-between">
                <p class="font-bold">Files ({{ files?.length }})</p>

                <UButton icon="i-lucide-plus" label="Add more" color="neutral" variant="outline" class="-my-2"
                  @click="open()" />
              </div>
            </template>

          </UFileUpload>

          <template #footer>
            <div class="flex flex-row gap-4 justify-between items-center">
              <!-- <UIcon name="ic:sharp-favorite" class="size-7 text-red-500 cursor-pointer" /> -->
              <div class="flex flex-row gap-2 items-center">
                <UIcon name="ic:sharp-favorite-border" class="size-7 text-red-500 cursor-pointer" />
                <UBadge color="neutral">123</UBadge>
              </div>
              <div v-if="authStore.user" class="flex flex-row gap-4 justify-between items-center">
                <UBadge color="neutral" class="cursor-pointer" >@{{
                  authStore.user.username
                  }}
                </UBadge>
                <!-- <UAvatar :src="https://github.com/benjamincanac.png" class="cursor-pointer" @click="clickPostAuthor" /> -->
                <!-- <UAvatar  :src="`http://localhost:8055/assets/${props.post.user_created.avatar}`" fit="cover" alt="User avatar"
            class="cursor-pointer" /> -->
                <NuxtImg provider="directus" :src="authStore.user.avatar" class="h-8 rounded-full" fit="cover"
                  quality="20" />
              </div>
            </div>
          </template>
        </UCard>
        <UCard class="rounded shadow-main h-fit w-full flex-1 border ring-0">
          <template #header>
            <p>Настройки поста</p>
            <slot name="publishButton" />
          </template>
          <UCheckbox v-model="state.isGallery" :label="state.isGallery ? 'Галерея' : 'Сетка'" />
          <UButton label="Создать пост" @click="submitPost"/>
        </UCard>
      </div>
    </template>
  </UTabs>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'
import * as z from 'zod'

const authStore = useAuthStore();
const postsStore = usePostsStore();

// Проверяем авторизацию
if (!authStore.isAuthenticated) {
  throw createError({ statusCode: 401, message: 'Не авторизовано', fatal: true });
}

// Загружаем посты, если ещё не загружены
if (!postsStore.posts.length) {
  await postsStore.fetchPosts(authStore.user?.id);
}

const toast = useToast()

const state = reactive<{
  title: string
  description: string
  files: File[]
  isGallery: boolean
}>({
  title: '',
  description: '',
  files: [],
  isGallery: false
})

watch(state, () => console.log(state))

const items = [
  {
    label: 'Аккаунт',
    slot: 'account' as const,
    icon: 'i-lucide-user',
  },
  {
    label: 'Посты',
    slot: 'posts' as const,
    icon: 'i-system-uicons-newspaper',
  },
  {
    label: 'Новый пост',
    slot: 'new-post' as const,
    icon: 'i-lucide-square-plus',
  }
] satisfies TabsItem[]

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Обновляем схему для массива файлов
const schema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  files: z
    .array(
      z.instanceof(File, {
        message: 'Please select an image file.'
      })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
        })
        .refine(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                  const meetsDimensions =
                    img.width >= MIN_DIMENSIONS.width &&
                    img.height >= MIN_DIMENSIONS.height &&
                    img.width <= MAX_DIMENSIONS.width &&
                    img.height <= MAX_DIMENSIONS.height
                  resolve(meetsDimensions)
                }
                img.src = e.target?.result as string
              }
              reader.readAsDataURL(file)
            }),
          {
            message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`
          }
        )
    )
    .min(1, { message: 'Please upload at least one image.' })
})

type Schema = z.output<typeof schema>

const submitPost = async () => {
    // Проверяем, есть ли файлы
    if (state.files.length === 0) {
        toast.add({
            title: 'Ошибка',
            description: 'Пожалуйста, добавьте хотя бы одно изображение.',
            icon: 'i-heroicons-exclamation-circle',
        });
        return;
    }
    console.log('submit',state.files)
    // Вызываем экшен createPost из Pinia Store
    await postsStore.createPost({
        title: state.title,
        description: state.description,
        isGallery: state.isGallery,
    }, state.files);
    
    // Если пост успешно создан, очищаем форму
    if (!postsStore.error) {
        state.title = '';
        state.description = '';
        state.files = [];
        state.isGallery = false;
    }
}

// const onSubmit = async () => {
//   try {
//     // Проверяем права на создание постов
//     const canCreatePosts = await $directus.request(
//       readUserPermissions()
//     );
//     console.log(canCreatePosts)
//     if (!canCreatePosts) {
//       throw new Error('У вас нет прав на создание постов');
//     }

//     // 1. Загружаем изображения
//     const uploadedImages = await Promise.all(
//       state.image.map(async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         const response = await $directus.request(
//           uploadFiles(formData, {
//             folder: 'posts',
//             title: file.name,
//           })
//         );

//         return response.id;
//       })
//     );

//     // 2. Создаем пост с привязкой к изображениям
//     const newPost = await $directus.request(
//       createItem('posts', {
//         title: state.title,
//         description: state.description,
//         user_created: authUser?.id,
//         likes: 0,
//       })
//     );

//     // Затем создаем связи с файлами
//     await Promise.all(
//       uploadedImages.map(fileId =>
//         $directus.request(
//           createItem('posts_files', {
//             posts_id: newPost.id,
//             directus_files_id: fileId
//           })
//         )
//       )
//     );

//     // 3. Очищаем форму и показываем уведомление
//     state.title = '';
//     state.description = '';
//     state.image = [];

//     toast.add({
//       title: 'Успех!',
//       description: 'Пост успешно создан',
//       icon: 'i-heroicons-check-circle',
//     });

//     // 4. Обновляем список постов
//     await refreshNuxtData('user_post');

//   } catch (error) {
//     console.error('Ошибка при создании поста:', error);
//     toast.add({
//       title: 'Ошибка',
//       description: 'Не удалось создать пост',
//       icon: 'i-heroicons-exclamation-circle',
//     });
//   }
// }

// const deletePost = async (id: string) => {
//   console.log(id)
//   try {
//     await $directus.request(
//       deleteItem('posts', id))
//     await refreshNuxtData('user_post');
//     toast.add({
//       title: 'Удаление',
//       description: "Вы удалили пост",
//     })
//   } catch (error) {
//     console.error(error)
//     toast.add({
//       title: 'Ошибка',
//       description: "Не удалось удалить пост",
//     })
//   }
// }
</script>