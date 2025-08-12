<script setup lang="ts">
import { object, string, type InferType } from 'yup'

const { $directus, $registerUser } = useNuxtApp()

const email = ref('')
const password = ref('')
const result = ref(false)

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

const register = async () => {
	try {
		await $directus.request($registerUser(state.email, state.password))
		result.value = true
		password.value = ''
	} catch (error) {
		console.error(error)
		result.value = false
		password.value = ''
	}
}
</script>

<template>
	<div class="shadow-main border rounded p-4 bg-(--bg-secondary) flex flex-row gap-16">
		<UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="register">
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
<!-- <template>
	<form @submit.prevent="register">
		<h1>Register</h1>
		<div v-if="result">
			<p>Successfully registered</p>
		</div>
		<div>
			<input required type="text" v-model="email" name="email" placeholder="Email" />
		</div>
		<div>
			<input required type="password" v-model="password" name="password" placeholder="Password" />
		</div>
		<button type="submit">Register</button>
	</form>
</template> -->
