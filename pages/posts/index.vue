<script setup lang="ts">
const { $directus, $readItems, $logout, $isAuthenticated } = useNuxtApp()
import { deleteItem } from '@directus/sdk'
const deleteSuccessful = ref(false)

const { data, error } = await useAsyncData('post', async () => {
	try {
		return await $directus.request(
			$readItems('posts', {
				fields: ['id', 'title', 'description', 'images', 'likes', 'user_created', "images.*", "user_created.first_name", "user_created.last_name", "user_created.id"]
			})
		)
	} catch (error) {
		console.error(error)
	}
})

const authUser = await $isAuthenticated()
if (authUser === false) {
	throw new Error('Not authenticated')
}

const deletePost = async (id: number | string) => {
	try {
		await $directus.request(
			deleteItem('posts', id)
		)
		data.value = data.value?.filter(post => post.id !== id)
		deleteSuccessful.value = true
	} catch (error) {
		console.error(error)
	}
}
</script>
<template>
	<div v-if="data" class="flex flex-col gap-8">
		<Post v-for="post in data" class="border h-fit w-full" :post="post" />
		 <!-- <pre>{{ data }}</pre> -->
	</div>
</template>