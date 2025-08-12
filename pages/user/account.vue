<template>
  <UTabs
    variant="pill"
    orientation="vertical"
    :items="items"
    class="w-full max-w-[1040px] items-start gap-8 grow"
    :ui="{
      list: 'flex-1 shadow-main border rounded bg-(--bg-secondary)',
      content: 'flex-4 h-full',
      trigger: 'w-full cursor-pointer',
      indicator: 'rounded'
    }"
  >
    <template #account v-if="authUser">
      <div class="relative w-full h-fit border rounded shadow-main bg-(--bg-secondary) overflow-hidden">
        <!-- Header Background -->
        <div class="w-full h-32 bg-gradient-to-t from-sky-500 to-indigo-500"></div>
        
        <!-- Avatar and User Info -->
        <div class="relative px-6 py-4">
          <!-- Avatar -->
          <div class="absolute -top-12 left-6">
            <UAvatar
              :src="`http://localhost:8055/assets/${authUser.avatar}`"
              class="h-24 w-24 ring-4 ring-white "
              fit="cover"
              alt="User avatar"
            />
          </div>
          
          <!-- User Info Section -->
          <div class="mt-16 space-y-4">
            <!-- Name and Username -->
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">
                  {{ authUser.first_name }} {{ authUser.last_name }}
                </h2>
                <p class="text-sm text-gray-500">
                  @solnyshko
                </p>
              </div>
              <UButton
                label="Редактировать профиль"
                color="neutral"
                variant="outline"
                size="sm"
                class="hover:bg-gray-100"
              />
            </div>
            
            <!-- Bio -->
            <p class="text-gray-600 text-sm max-w-lg">
              Расскажите о себе...
            </p>
            
            <!-- Stats -->
            <div class="flex gap-6 text-sm text-gray-500">
              <div>
                <span class="font-medium text-gray-900">100</span> постов
              </div>
              <div>
                <span class="font-medium text-gray-900">1</span> подписчиков
              </div>
              <div>
                <span class="font-medium text-gray-900">10</span> подписок
              </div>
            </div>
          </div>
        </div>
        
        <!-- Responsive Adjustments -->
        <div class="px-6 py-4 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="h-4 w-4" />
              <span>{{ authUser.email || 'email@example.com' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
              <span>Губкин</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="h-4 w-4" />
              <span>Регистрация: 12.07.2025</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #posts="{ item }">
      <div class="flex flex-col gap-8">
        <Post v-for="post in data" class="border h-fit w-full" :post="post" />
      </div>
    </template>
    <template #new-post="{ item }">
      <div class="flex flex-row gap-4">
        <UForm :schema="schema" :state="state" class="space-y-4 w-96">
          <UFormField name="title" label="Заголовок">
            <UInput v-model="state.title" placeholder="Enter title" />
          </UFormField>
          <UFormField name="description" label="Описание">
            <UTextarea v-model="state.description" placeholder="Enter description" :rows="4" />
          </UFormField>
          <UFormField name="image" label="Изображения" description="JPG, GIF or PNG. 2MB Max.">
            <UFileUpload v-model="state.image" multiple accept="image/*" class="min-h-48" />
          </UFormField>
          <UButton label="Создать" color="neutral" @click="onSubmit" />
        </UForm>
      </div>
    </template>
  </UTabs>
</template>

<script lang="ts" setup>
import { createItem, readUserPermissions, uploadFiles } from '@directus/sdk';
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui'
import * as z from 'zod'
import authenticatedGlobal from '~/middleware/authenticated.global';

definePageMeta({
  name: "Аккаунт",
  middleware: [authenticatedGlobal],
  requiresAuth: true,
});

const { $directus, $isAuthenticated, $readItems } = useNuxtApp()
const authUser = await $isAuthenticated()
const toast = useToast()

const state = reactive<{
  title: string
  description: string
  image: File[]
}>({
  title: '',
  description: '',
  image: []
})


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

const { data, error } = await useAsyncData('user_post', async () => {
  try {
    return await $directus.request(
      $readItems('posts', {
        fields: ['id', 'title', 'description', 'images', 'likes', 'user_created', "images.*", "user_created.first_name", "user_created.last_name"],
        filter: {
          user_created: {
            id: {
              _eq: authUser.id
            }
          }
        }
      })
    )
  } catch (error) {
    console.error(error)
  }
})

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
  image: z
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

const onSubmit = async () => {
  try {
    // Проверяем права на создание постов
    const canCreatePosts = await $directus.request(
      readUserPermissions()
    );
    console.log(canCreatePosts)
    if (!canCreatePosts) {
      throw new Error('У вас нет прав на создание постов');
    }

    // 1. Загружаем изображения
    const uploadedImages = await Promise.all(
      state.image.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await $directus.request(
          uploadFiles(formData, {
            folder: 'posts',
            title: file.name,
          })
        );

        return response.id;
      })
    );

    // 2. Создаем пост с привязкой к изображениям
    const newPost = await $directus.request(
      createItem('posts', {
        title: state.title,
        description: state.description,
        user_created: authUser.id,
        likes: 0,
      })
    );

    // Затем создаем связи с файлами
    await Promise.all(
      uploadedImages.map(fileId =>
        $directus.request(
          createItem('posts_files', {
            posts_id: newPost.id,
            directus_files_id: fileId
          })
        )
      )
    );

    // 3. Очищаем форму и показываем уведомление
    state.title = '';
    state.description = '';
    state.image = [];

    toast.add({
      title: 'Успех!',
      description: 'Пост успешно создан',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });

    // 4. Обновляем список постов
    await refreshNuxtData('user_post');

  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    toast.add({
      title: 'Ошибка',
      description: error.message || 'Не удалось создать пост',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  }
}
</script>