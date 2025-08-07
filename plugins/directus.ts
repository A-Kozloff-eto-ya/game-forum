import {
	createDirectus,
	rest,
	readItems,
	registerUser,
	authentication,
	readMe,
	refresh,
	type AuthenticationStorage
} from "@directus/sdk";

export default defineNuxtPlugin(() => {
	const toast = useToast()

	class NuxtCookieStorage {
		cookie = useCookie("directus-data");
		get() {
			return this.cookie.value;
		}
		set(data: any) {
			this.cookie.value = data;
		}
	}

	const storage = new NuxtCookieStorage() as AuthenticationStorage;
	const isAuth = ref(false)
	const user = ref(null)
	const directus = createDirectus<DirectusSchema>(
		"http://localhost:8055",
	)
		.with(authentication("cookie", { credentials: "include", storage }))
		.with(rest({ credentials: "include" }));

	const isAuthenticated = async () => {
		try {
			const me = await directus.request(readMe());
			user.value = me
			isAuth.value = true
			return me;
		} catch (error) {
			isAuth.value = false
			console.error(error)
			return false;
		}
	};

	const refreshToken = async () => {
		return directus.request(
			refresh('cookie')
		);
	};

	const logout = async () => {
		await directus.logout()
		toast.add({ title: 'Вы вышли из своей учетной записи', color: 'primary' })

		isAuth.value = false
		navigateTo('/login')
	}

	return {
		provide: { directus, readItems, registerUser, isAuthenticated, refreshToken, logout, isAuth, user },
	};
});
