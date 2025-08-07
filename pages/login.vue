<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = object({
	email: string().email('Invalid email').required('Required'),
	password: string()
		.min(8, 'Must be at least 8 characters')
		.required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
	email: '',
	password: ''
})

const { $directus } = useNuxtApp()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref(null)

const toast = useToast()

const login = async () => {
	try {
		errorMsg.value = null
		await $directus.login(state.email, state.password)
		router.push('/posts') // Redirect to /posts
		toast.add({ title: 'Вход', description: 'Вы вошли в свою учетную запись', color: 'primary' })
	} catch (error) {
		errorMsg.value = error.message || 'An unexpected error occurred'
		toast.add({ title: 'Error', description: 'The form has been submitted.', color: 'primary' })
	}
}
</script>
<template>
	<div class="shadow-main border rounded p-4 bg-(--bg-secondary) flex flex-row gap-16">
		<!-- <form @submit.prevent="login">
			<h1>Login</h1>
			<div v-if="errorMsg">
				<p>{{ errorMsg }}</p>
			</div>
			<div>
				<input required type="text" v-model="email" name="email" placeholder="Email" />
			</div>
			<div>
				<input required type="password" v-model="password" name="password" placeholder="Password" />
			</div>
			<button type="submit">Login</button>
		</form> -->
		<UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="login">
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
</template>