<template>
  <div class="h-auto max-w-[1000px] w-full bg-(--bg-secondary) border rounded shadow-main flex flex-col gap-4 p-4">
    <div class="text-2xl">{{ props.post.title }}</div>
    <div class="text-base">{{ props.post.description }}</div>
    <div v-if="props.post.images" class="grid  overflow-hidden grid-cols-3 grid-rows-3 gap-1">
      <div v-for="image in props.post.images" class=" h-full w-full">
        <NuxtImg quality="20" loading="lazy" :src="`http://localhost:8055/assets/${image.directus_files_id}`"
          class="rounded" />
      </div>
      <!-- <UCarousel ref="carousel" v-slot="{ item }" arrows
        :items="props.post.images.map(image => image.directus_files_id)" :prev="{ onClick: onClickPrev }"
        :next="{ onClick: onClickNext }" class="w-full max-w-xs mx-auto" @select="onSelect">
        <pre>{{ item }}</pre>
        <NuxtImg provider="directus" :src="item" height="512" fit="inside" quality="20"
          :modifiers="{ withoutEnlargement: 'true' }" />
      </UCarousel>

      <div class="flex gap-1 justify-between pt-4 max-w-xs mx-auto">
        <div v-for="(item, index) in props.post.images.map(image => image.directus_files_id)" :key="index"
          class="size-11 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }" @click="select(index)">
          <NuxtImg provider="directus" :src="item" height="512" fit="inside" quality="20"
            :modifiers="{ withoutEnlargement: 'true' }" />
        </div>
      </div> -->
    </div>
    <div class="flex flex-row gap-4 justify-between items-center">
      <!-- <UIcon name="ic:sharp-favorite" class="size-7 text-red-500 cursor-pointer" /> -->
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="ic:sharp-favorite-border" class="size-7 text-red-500 cursor-pointer" />
        <UBadge color="neutral">{{ props.post.likes }}</UBadge>
      </div>
      <div class="flex flex-row gap-4 justify-between items-center">
        <UBadge color="neutral">{{ props.post.user_created.first_name }} {{ props.post.user_created.last_name }}
        </UBadge>
        <UAvatar src="https://github.com/benjamincanac.png" />
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

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carousel.value?.emblaApi?.scrollTo(index)
}
</script>

<style></style>