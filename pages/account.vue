<template>
  <!-- <div class="flex flex-row gap-8 w-full grow max-w-[1040px]">
  </div> -->
  <UTabs variant="pill" orientation="vertical" :items="items" class="w-full max-w-[1040px] items-start gap-8 grow" :ui="{
    list: 'flex-1 shadow-main border rounded bg-(--bg-secondary)', content: 'flex-4 h-full', trigger: 'w-full cursor-pointer', indicator: 'rounded'
  }">
    <template #account="{ item }">
      <div class="rounded relative w-full border overflow-hidden shadow-main h-full">
        <div class="h-45 w-45 absolute p-4 top-8">
          <UAvatar :src="`http://localhost:8055/assets/${item.user.avatar}`" class="h-full w-full" fit="cover" />
        </div>
        <div class="w-full max-h-[140px] h-full bg-linear-to-t from-sky-500 to-indigo-500"></div>
        <div class="mt-16 p-4 text-2xl">{{ item.user.first_name }} {{ item.user.last_name }}</div>
      </div>
    </template>
    <template #posts="{ item }">
      <div class="flex flex-col gap-8">
        <Post v-for="post in data" class="border h-fit w-full" :post="post" />
      </div>
    </template>
  </UTabs>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import authenticatedGlobal from '~/middleware/authenticated.global';

definePageMeta({
  name: "Аккаунт",
  middleware: [authenticatedGlobal],
  requiresAuth: true,
});

const { $directus, $isAuthenticated, $readItems } = useNuxtApp()
const authUser = await $isAuthenticated()

const items = [
  {
    label: 'Аккаунт',
    slot: 'account' as const,
    icon: 'i-lucide-user',
    user: authUser
  },
  {
    label: 'Посты',
    slot: 'posts' as const,
    icon: 'i-lucide-lock',
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
</script>

<style></style>