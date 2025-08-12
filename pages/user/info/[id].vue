<script setup lang="ts">
import { readUser } from '@directus/sdk'

const route = useRoute()
const { $directus, $isAuthenticated, $readItems } = useNuxtApp()

// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id)

const { data, error } = await useAsyncData('user_info', async () => {
	if (route.params.id) {
		try {
			return await $directus.request(
				readUser(route.params.id, {
					fields: ["*"],
					// filter: {
					// 	id: {
					// 		_eq: route.params.id
					// 	}
					// }
				})
			)
		} catch (error) {
			console.error(error)
		}
	}
})
</script>

<template>
	<div>{{ data }}</div>
</template>