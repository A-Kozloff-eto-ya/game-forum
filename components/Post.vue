<template>
  <div class="h-auto max-w-[700px] w-full bg-(--bg-secondary) border rounded shadow-main flex flex-col gap-4 p-4">

    <div class="text-2xl">{{ props.post.title }}</div>
    <div class="text-base">{{ props.post.description }}</div>
    <div class="">
      <div v-if="props.post.images.length === 1" class="w-full aspect-square">
        <PostImage v-for="image in props.post.images" :image_id="image.directus_files_id" />
      </div>

      <div v-else-if="props.post.images.length === 2" class="grid grid-cols-2 gap-2">
        <PostImage v-for="image in props.post.images" :image_id="image.directus_files_id" />
      </div>

      <div v-else-if="props.post.images.length === 3" class="grid grid-cols-3 gap-2">
        <PostImage v-for="image in props.post.images.slice(0, 1)" :image_id="image.directus_files_id"
          class="col-span-2 row-span-2" />
        <div class="col-span-1 row-span-2 flex flex-col gap-2">
          <PostImage v-for="image in props.post.images.slice(1, 3)" :image_id="image.directus_files_id" />
        </div>
      </div>

      <div v-else-if="props.post.images.length === 4" class="grid grid-cols-2 gap-2">
        <PostImage v-for="image in props.post.images.slice(0, 1)" :image_id="image.directus_files_id"
          class="col-span-2 row-span-2" />
      </div>

      <div v-else-if="props.post.images.length === 5" class="grid grid-cols-3 gap-2">
        <div class="grid grid-cols-2 gap-2 col-span-3">
          <PostImage v-for="image in props.post.images.slice(0, 2)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
        <div class="grid grid-cols-3 gap-2 col-span-3">
          <PostImage v-for="image in props.post.images.slice(2, 5)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
      </div>

      <div v-else-if="props.post.images.length === 6" class="grid grid-cols-4 gap-2">
        <div class="grid grid-cols-2 gap-2 col-span-4">
          <PostImage v-for="image in props.post.images.slice(0, 2)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
        <div class="grid grid-cols-4 gap-2 col-span-4">
          <PostImage v-for="image in props.post.images.slice(2, 6)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
      </div>

      <div v-else-if="props.post.images.length === 7" class="grid grid-cols-3 gap-2">
        <div class="grid grid-cols-3 gap-2 col-span-3">
          <PostImage v-for="image in props.post.images.slice(0, 3)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
        <div class="grid grid-cols-4 gap-2 col-span-3">
          <PostImage v-for="image in props.post.images.slice(3, 7)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
      </div>

      <div v-else-if="props.post.images.length === 8" class="grid grid-cols-4 gap-2">
        <div class="grid grid-cols-2 gap-2 col-span-4 row-start-1">
          <PostImage v-for="image in props.post.images.slice(0, 2)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
        <div class="grid grid-cols-6 gap-2 col-span-4 row-start-2">
          <PostImage v-for="image in props.post.images.slice(2, 8)" :image_id="image.directus_files_id"
            class="col-span-1 row-span-1" />
        </div>
      </div>

      <div v-else-if="props.post.images.length === 9" class="grid grid-cols-3 grid-rows-3 gap-2">
        <PostImage v-for="image in props.post.images" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
    </div>
    <div class="flex flex-row gap-4 justify-between items-center">
      <!-- <UIcon name="ic:sharp-favorite" class="size-7 text-red-500 cursor-pointer" /> -->
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="ic:sharp-favorite-border" class="size-7 text-red-500 cursor-pointer" />
        <UBadge color="neutral">{{ props.post.likes }}</UBadge>
      </div>
      <div v-if="props.post.user_created" class="flex flex-row gap-4 justify-between items-center">
        <UBadge color="neutral" class="cursor-pointer" @click="clickPostAuthor">{{ props.post.user_created.first_name }}
          {{ props.post.user_created.last_name }}
        </UBadge>
        <UAvatar src="https://github.com/benjamincanac.png" class="cursor-pointer" @click="clickPostAuthor" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserPost } from '../types/post';


interface PostProps {
  post: UserPost
}

const props = defineProps<PostProps>();

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value
})

const clickPostAuthor = () => {
  navigateTo(`/user/info/${props.post.user_created?.id}`)
}
</script>

<style></style>