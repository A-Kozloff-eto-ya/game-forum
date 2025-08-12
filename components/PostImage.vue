<template>
    <UModal v-model:open="open">
        <NuxtImg quality="20" loading="lazy" :src="`http://localhost:8055/assets/${props.image_id}`"
            class="rounded object-cover h-full w-full cursor-pointer" />
        <template #title></template>
        <template #description></template>
        <template #content>
            <NuxtImg quality="100" loading="lazy" :src="`http://localhost:8055/assets/${props.image_id}`"
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