export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initAuth();

  if (authStore.isAuthenticated && (to.path.startsWith('/login') || to.path.startsWith('/register'))) {
    return navigateTo('/posts');
  }

  if (to.path.startsWith('/login') || to.path.startsWith('/register')) {
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }  
});