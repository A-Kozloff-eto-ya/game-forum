<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

// type Schema = InferType<typeof schema>

// const toast = useToast()
const authStore = useAuthStore()

const router = useRouter();
const errorMsg = ref(null);

const state = reactive({
	email: '',
	password: ''
})

const schema = object({
	email: string().email('Invalid email').required('Required'),
	password: string()
		.min(8, 'Must be at least 8 characters')
		.required('Required')
})

const loginUser = async () => {
	try {
		await authStore.login(state.email, state.password);
		errorMsg.value = null;
		// toast.add({ title: 'Вход', description: 'Вы вошли в свою учетную запись', color: 'primary' })
		router.push("/posts");
	} catch (error: any) {
		errorMsg.value = error.message || "Ошибка входа";
		// toast.add({ title: 'Error', description: `${errorMsg.value}`, color: 'primary' })
	}
};


// const login = async () => {
// 	try {
// 		errorMsg.value = null
// 		await $directus.login(state.email, state.password)
// 		router.push('/posts') // Redirect to /posts
// 		toast.add({ title: 'Вход', description: 'Вы вошли в свою учетную запись', color: 'primary' })
// 	} catch (error) {
// 		errorMsg.value = error.message || 'An unexpected error occurred'
// 		toast.add({ title: 'Error', description: 'The form has been submitted.', color: 'primary' })
// 	}
// }
</script>

<template>
	<div>
		<div class="shadow-main border rounded p-4 bg-(--bg-secondary) flex flex-row gap-16">
			<UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="loginUser">
				<UFormField label="Email" name="email">
					<UInput v-model="state.email" />
				</UFormField>

				<UFormField label="Password" name="password">
					<UInput v-model="state.password" type="password" />
				</UFormField>

				<UButton type="submit">
					Submit
				</UButton>
			</UForm>
			<div class="flex items-center justify-center grow">
				<Icon name="meteor-icons:gamepad-modern" class="text-8xl" />
			</div>
		</div>
	</div>
</template>