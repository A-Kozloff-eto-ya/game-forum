<template>
  <div class="flex flex-col h-[100vh] relative items-center justify-between gap-8 overflow-y-auto">
    <AppHeader />
    <slot />
    <AppFooter>
      <div class="rounded  h-[50px] w-full">FOTTER</div>
    </AppFooter>
  </div>
</template>