export default defineNuxtRouteMiddleware(async (to, from) => {
	const { $isAuthenticated, $directus } = useNuxtApp();
	const authenticated = await $isAuthenticated();

	if (!authenticated && (to.path.startsWith("/login") || to.path.startsWith("/register"))) {
		return
	}

	// if (!authenticated) {
	// 	return navigateTo("/");
	// }

	if (authenticated && to.path === "/login") {
		return navigateTo("/posts");
	}
	return;
});
