<script setup lang="ts">
const { $logout, $isAuth, $user } = useNuxtApp()
const user = $user
const route = useRoute()
</script>

<template>
  <div class="flex flex-col h-[100vh] items-center justify-between gap-8 overflow-y-scroll">
    <AppHeader>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4 h-full">
          <div class="flex flex-row justify-between items-center w-full gap-4 sticky top-4">
            <NuxtLink to="/">
              <div class="border flex items-center justify-center rounded h-[50px] w-[100px]">LOGO</div>
            </NuxtLink>
            <div class="rounded flex flex-row items-center justify-end gap-4 w-full">
              <ColorModeButton />
              <NuxtLink v-if="!$isAuth && route.path !== '/login'" to="/login">
                <UButton class="cursor-pointer rounded">Войти</UButton>
              </NuxtLink>
              <div v-else-if="$isAuth" class="flex flex-row gap-4">
                <UButton class="cursor-pointer rounded" @click="$logout()">Выйти</UButton>
                <NuxtLink to="/account">
                  <UAvatar :src="`http://localhost:8055/assets/${user.avatar}`" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppHeader>
    <slot />
    <AppFooter>
      <div class="rounded  h-[50px] w-full">FOTTER</div>
    </AppFooter>
  </div>
</template>