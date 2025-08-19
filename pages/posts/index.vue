<script setup lang="ts">
import { usePostsStore } from '~/stores/posts';
import { useAuthStore } from '~/stores/auth';

const postsStore = usePostsStore();
const authStore = useAuthStore()
// Загружаем посты при загрузке страницы
await postsStore.fetchPosts();

const like = async(post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.likePost(authStore.user.id, post_id)
		await postsStore.fetchPosts()
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}

const unlike = async(post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.unlikePost(post_id)
		await postsStore.fetchPosts()
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}

</script>

<template>
	<div v-if="postsStore.posts && authStore.user" class="flex flex-col gap-8 max-w-[1040px] items-center w-full">
		<Post v-for="post in postsStore.posts" class="border h-fit w-full" :post="post" :key="post.id"
			:user_id="authStore.user.id" @like="(e) => like(e)" @unlike="(e) => unlike(e)" />
		<!-- <pre>{{ postsStore.posts }}</pre> -->
	</div>
</template>