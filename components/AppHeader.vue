<template>
  <div
    class="max-w-[1414px] w-full sticky top-0 z-100 h-fit shadow-main border border-t-0 bg-(--bg-secondary) transition duration-300 rounded-br p-4 rounded-bl">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 h-full">
        <div class="flex flex-row justify-between items-center w-full gap-4 sticky top-4">
          <NuxtLink to="/">
            <div class="border flex items-center justify-center rounded h-[50px] w-[100px]">LOGO</div>
          </NuxtLink>
          <div class="rounded flex flex-row items-center justify-end gap-4 w-full">
            <ClientOnly>
              <ColorModeButton />
            </ClientOnly>
            <UButton v-if="!authStore.isAuthenticated && !authStore.user" @click="goToLogin"
              class="cursor-pointer rounded">Войти</UButton>

            <div v-else-if="authStore.isAuthenticated && authStore.user" class="flex flex-row gap-4">
              <UButton class="cursor-pointer rounded" @click="authStore.logout">Выйти</UButton>
              <!-- <UAvatar :src="`http://localhost:8055/assets/${authStore.user.avatar}`" @click="goToProfile" /> -->
              <NuxtImg provider="directus" :src="authStore.user.avatar" class="h-8 rounded-full cursor-pointer" fit="cover"
                quality="20" @click="goToProfile" />

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const router = useRouter()

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};

const goToProfile = () => {
  router.push('/user/account');

}
</script>

<style></style>