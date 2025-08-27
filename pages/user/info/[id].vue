<script setup lang="ts">
definePageMeta({
	validate: async (route) => {
		// Check if the id is made up of digits
		return typeof route.params.id === 'string'
	}
})

const postsStore = usePostsStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()
const subscriptionsStore = useSubscriptionsStore()
const route = useRoute()

// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id)

await Promise.all(
	[postsStore.fetchPosts(route.params.id.toString()),
	usersStore.fetchUser(route.params.id.toString()),
	]
)

onMounted(async () => {
	await postsStore.fetchPosts(route.params.id.toString()),
		await usersStore.fetchUser(route.params.id.toString())
	if (usersStore.user && usersStore.user.id) {
		await subscriptionsStore.getUserSubscribers(usersStore.user.id)
	}
})
// subscriptionsStore.getUserSubscribers(usersStore.user.id)

const like = async (post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.likePost(authStore.user.id, post_id)
		await postsStore.fetchPosts()
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}

const unlike = async (post_id: string) => {
	if (authStore.user && authStore.user.id) {
		await postsStore.unlikePost(post_id)
		await postsStore.fetchPosts()
	} else {
		console.log('Только авторизованные пользователи могут лайкать посты')
	}
}
</script>

<template>
	<div class="flex flex-col w-full max-w-[1040px] gap-8">
		<div class="relative w-full h-fit border rounded shadow-main bg-(--bg-secondary) overflow-hidden">
			<!-- Header Background -->
			<div class="w-full h-32 bg-gradient-to-t from-sky-500 to-indigo-500"></div>

			<!-- Avatar and User Info -->
			<div class="relative px-6 py-4">
				<!-- Avatar -->
				<div class="absolute -top-16 left-6">
					<UAvatar :src="`http://localhost:8055/assets/${usersStore.user.avatar}`"
						class="h-32 w-32 ring-4 ring-white " fit="cover" alt="User avatar" />
				</div>

				<!-- User Info Section -->
				<div class="mt-16 space-y-4">
					<!-- Name and Username -->
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-2xl font-semibold text-gray-900">
								{{ usersStore.user.first_name }} {{ usersStore.user.last_name }}
							</h2>
							<p class="text-sm text-gray-500">
								@{{ usersStore.user.username }}
							</p>
						</div>
						<UButton label="Отписаться"
							v-if="subscriptionsStore.userSubscribers.some(subs => subs.subscriber.id === authStore.user.id)"
							color="neutral" variant="outline" size="sm" class="hover:bg-gray-100 cursor-pointer"
							@click="subscriptionsStore.deleteSubscription(authStore.user?.id, usersStore.user.id)" />
						<UButton label="Подписаться" v-else color="neutral" variant="outline" size="sm"
							class="hover:bg-gray-100 cursor-pointer"
							@click="subscriptionsStore.createSubscription(authStore.user?.id, usersStore.user.id)" />
					</div>

					<!-- Bio -->
					<p class="text-gray-600 text-sm max-w-lg">
						Расскажите о себе...
					</p>

					<!-- Stats -->
					<div class="flex gap-6 text-sm text-gray-500">
						<div>
							<span class="font-medium text-gray-900">1</span> <span class="cursor-pointer">постов</span>
						</div>
						<div>
							<span class="font-medium text-gray-900 cursor-pointer">{{
								subscriptionsStore.userSubscribers.length }}</span>
							<span class="cursor-pointer">подписчиков</span>
						</div>
						<div>
							<span class="font-medium text-gray-900 cursor-pointer">{{
								subscriptionsStore.userSubscribedTo.length }}</span> <span
								class="cursor-pointer">подписок</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Responsive Adjustments -->
			<div class="px-6 py-4 border-t border-gray-100">
				<div class="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
					<div class="flex items-center gap-2">
						<UIcon name="i-lucide-mail" class="h-4 w-4" />
						<span>{{ usersStore.user.email || 'email@example.com' }}</span>
					</div>
					<div class="flex items-center gap-2">
						<UIcon name="i-lucide-map-pin" class="h-4 w-4" />
						<span>Губкин</span>
					</div>
					<div class="flex items-center gap-2">
						<UIcon name="i-lucide-calendar" class="h-4 w-4" />
						<span>Регистрация: 12.07.2025</span>
					</div>
					<!-- <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="h-4 w-4" />
              <span>Был в сети: {{ authUser.last_access }}</span>
            </div> -->
				</div>
			</div>
		</div>
		<!-- <pre>{{ route.params.id }}</pre>
		<pre>{{ postsStore.posts }}</pre> -->
		<div v-if="postsStore.posts && authStore.user" class="flex flex-row gap-8">
			<div class="flex flex-col gap-8 flex-4">
				<Post v-for="post in postsStore.posts" class="border h-fit w-full" :post="post"
					:user_id="authStore.user.id" @like="(e) => like(e)" @unlike="(e) => unlike(e)" />
			</div>
			<div class="shadow-main flex-2 border h-20 w-full">INFO</div>
		</div>
	</div>
</template>