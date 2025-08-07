export default defineNuxtRouteMiddleware(async (to, from) => {
	const { $isAuthenticated, $directus } = useNuxtApp();
	const authenticated = await $isAuthenticated();
	// Login and register pages are not protected
	if (!authenticated && (to.path.startsWith("/login") || to.path.startsWith("/register"))) {
		return
	}

	if (!authenticated) {
		return navigateTo("/login");
	}

	if (authenticated && to.path === "/login") {
		return navigateTo("/posts");
	}
	return;
});
