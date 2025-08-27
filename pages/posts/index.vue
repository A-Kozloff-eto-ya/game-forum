<script setup lang="ts">
import { usePostsStore } from '~/stores/posts';
import { useAuthStore } from '~/stores/auth';
import type { TabsItem } from '@nuxt/ui';

const postsStore = usePostsStore();
const authStore = useAuthStore()
const subscriptionsStore = useSubscriptionsStore()
// Загружаем посты при загрузке страницы ['9717da81-4c9b-4d60-8bb6-f38749d5d607', '8845603d-9a2a-40f6-b273-3b3c580e26cc']

await subscriptionsStore.getUserSubscribers(authStore.user?.id)
await postsStore.fetchPosts();
const postsSource = ref<string | number>()


const like = async (post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.likePost(authStore.user.id, post_id)
		if (postsSource.value === 'subscriptions') {
			await postsStore.fetchPosts(subscriptionsStore.userSubscriptionsIds);
		} else {
			await postsStore.fetchPosts()
		}
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}

const unlike = async (post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.unlikePost(post_id)
		if (postsSource.value === 'subscriptions') {
			await postsStore.fetchPosts(subscriptionsStore.userSubscriptionsIds);
		} else {
			await postsStore.fetchPosts()
		}
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}

const items = ref<TabsItem[]>([
	{
		label: 'Все',
		icon: 'i-lucide-gallery-vertical',
		value: 'all'
	},
	{
		label: 'Подписки',
		icon: 'i-lucide-bell-ring',
		value: 'subscriptions'
	}
])


const choosePostsSource = async (source: number | string) => {
	postsSource.value = source
	console.log(postsSource.value)
	if (postsSource.value === 'subscriptions') {
		await subscriptionsStore.getUserSubscribedTo(authStore.user.id)
		console.log(subscriptionsStore.userSubscriptionsIds)
		await postsStore.fetchPosts(subscriptionsStore.userSubscriptionsIds);
	} else {
		await postsStore.fetchPosts();
	}
}
</script>

<template>
	<div v-if="postsStore.posts && authStore.user"
		class="flex relative flex-row gap-8 max-w-[1040px] grow w-full overflow-y: auto">
		<div class="flex flex-col gap-8 w-full flex-5">
			<UButton label="Создать пост" class="w-full text-center" />
			<Post v-for="post in postsStore.posts" class="border h-fit w-full" :post="post" :key="post.id"
				:user_id="authStore.user.id" @like="(e) => like(e)" @unlike="(e) => unlike(e)" />
			<div v-if="postsStore.posts.length === 0" class="shadow-main p-4 w-full rounded border bg-(--bg-secondary)">
				У отслеживаемых вами авторов нет постов</div>

		</div>
		<div class="h-100vh  flex-2">
			<UTabs variant="pill" orientation="vertical" :items="items" :default-value="'all'"
				@update:model-value="(e: string | number) => choosePostsSource(e)" :content="false"
				class="w-full items-start gap-8 sticky top-28  z-10" :ui="{
					list: 'flex-1 shadow-main border rounded bg-(--bg-secondary)',
					trigger: 'w-full cursor-pointer',
					indicator: 'rounded'
				}">
			</UTabs>
		</div>
	</div>
</template>