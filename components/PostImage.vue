<template>
    <UModal v-model:open="open">
        <NuxtImg v-if="props.image_id" quality="20" loading="lazy" provider="directus"
            :src="`${props.image_id}?some_random_token`" class="rounded object-cover h-full w-full cursor-pointer" />
        <template #title></template>
        <template #description></template>
        <template #content>
            <NuxtImg v-if="props.image_id" quality="100" provider="directus" loading="lazy"
                :src="`${props.image_id}?some_random_token`"
                class="rounded object-cover h-full w-full max-h-[500px] max-w-[1000px]" />
        </template>
    </UModal>
</template>

<script lang="ts" setup>
interface PostProps {
    image_id: string
}

const props = defineProps<PostProps>();

const open = ref(false)
</script>

<style></style>