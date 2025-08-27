<template>
  <UCard class="w-full flex flex-col justify-between shadow-main rounded ring-0 bg-(--bg-secondary)"
    :ui="{ header: 'flex flex-row justify-between' }">
    <template #header>
      <div class="flex flex-col gap-4">
        <div class="text-2xl">{{ props.post.title }}</div>
        <div class="text-base">{{ props.post.description }}</div>
      </div>
      <slot name="deleteButton" />
    </template>

    <div v-if="props.post.files && props.post.files.length === 1" class="w-full grow aspect-square">
      <PostImage v-for="image in props.post.files" :image_id="image.directus_files_id" />
    </div>

    <div v-if="props.post.files && props.post.files.length === 2" class="grow grid grid-cols-2 gap-2">
      <PostImage v-for="image in props.post.files" :image_id="image.directus_files_id" />
    </div>

    <div v-if="props.post.files && props.post.files.length === 3" class="grow grid grid-cols-3 gap-2">
      <PostImage v-for="image in props.post.files.slice(0, 1)" :image_id="image.directus_files_id"
        class="col-span-2 row-span-2" />
      <div class="col-span-1 row-span-2 flex flex-col gap-2">
        <PostImage v-for="image in props.post.files.slice(1, 3)" :image_id="image.directus_files_id" />
      </div>
    </div>

    <div v-if="props.post.files && props.post.files.length === 4" class="grow grid grid-cols-2 grid-rows-2 gap-2">
      <PostImage v-for="image in props.post.files" :image_id="image.directus_files_id" class="col-span-1 row-span-1" />
    </div>

    <div v-if="props.post.files && props.post.files.length === 5" class="grow grid grid-cols-3 gap-2">
      <div class="grid grid-cols-2 gap-2 col-span-3">
        <PostImage v-for="image in props.post.files.slice(0, 2)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
      <div class="grid grid-cols-3 gap-2 col-span-3">
        <PostImage v-for="image in props.post.files.slice(2, 5)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
    </div>

    <div v-if="props.post.files && props.post.files.length === 6" class="grow grid grid-cols-4 gap-2">
      <div class="grid grid-cols-2 gap-2 col-span-4">
        <PostImage v-for="image in props.post.files.slice(0, 2)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
      <div class="grid grid-cols-4 gap-2 col-span-4">
        <PostImage v-for="image in props.post.files.slice(2, 6)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
    </div>

    <div v-if="props.post.files && props.post.files.length === 7" class="grow grid grid-cols-3 gap-2">
      <div class="grid grid-cols-3 gap-2 col-span-3">
        <PostImage v-for="image in props.post.files.slice(0, 3)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
      <div class="grid grid-cols-4 gap-2 col-span-3">
        <PostImage v-for="image in props.post.files.slice(3, 7)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
    </div>

    <div v-if="props.post.files && props.post.files.length === 8" class="grow grid grid-cols-4 gap-2">
      <div class="grid grid-cols-2 gap-2 col-span-4 row-start-1">
        <PostImage v-for="image in props.post.files.slice(0, 2)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
      <div class="grid grid-cols-6 gap-2 col-span-4 row-start-2">
        <PostImage v-for="image in props.post.files.slice(2, 8)" :image_id="image.directus_files_id"
          class="col-span-1 row-span-1" />
      </div>
    </div>

    <div v-if="props.post.files && props.post.files.length === 9" class="grow grid grid-cols-3 grid-rows-3 gap-2">
      <PostImage v-for="image in props.post.files" :image_id="image.directus_files_id" class="col-span-1 row-span-1" />
    </div>
    <template #footer>
      <div class="flex flex-row gap-4 justify-between items-center">
        <div class="flex flex-row gap-2 items-center">
          <UIcon v-if="isLiked" name="ic:sharp-favorite" class="size-7 text-red-500 cursor-pointer" @click="unlike" />
          <UIcon v-if="!isLiked" name="ic:sharp-favorite-border" class="size-7 text-red-500 cursor-pointer"
            @click="like" />

          <UBadge color="neutral">{{ props.post.likes.length }}</UBadge>
        </div>
        <div v-if="props.post.user_created" class="flex flex-row gap-4 justify-between items-center">
          <UBadge color="neutral" class="cursor-pointer" @click="clickPostAuthor">@{{ props.post.user_created.username
            }}
          </UBadge>
          <NuxtImg provider="directus" :src="props.post.user_created.avatar" class="h-8 rounded-full" fit="cover"
            quality="20" />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserPost } from '../types/post';

interface PostProps {
  post: UserPost
  user_id: string
}

const props = defineProps<PostProps>();
const emit = defineEmits<{
  (e: 'like', id: string): void
  (e: 'unlike', id: string): void
}>()


const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value
})

const clickPostAuthor = () => {
  navigateTo(`/user/info/${props.post.user_created?.id}`)
}

const isLiked = ref<boolean>(false);
const checkLikeStatus = async () => {
  if (!props.user_id) return;

  try {
    const response = await $fetch('/api/check-like', {
      method: 'POST',
      body: {
        postId: props.post.id,
        userId: props.user_id
      }
    });
    isLiked.value = response.isLiked;
    console.log(response)
  } catch (error) {
    console.error('Ошибка при проверке лайка:', error);
  }
};

onMounted(() => {
  checkLikeStatus();
});

onUpdated(() => {
  checkLikeStatus()
})

const like = () => {
  { emit('like', props.post.id) }

}

const unlike = () => {
  { emit('unlike', props.post.id) }

}
</script>

<style></style>