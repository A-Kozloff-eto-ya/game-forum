<template>
  <UContainer>
    <!-- Hero Section -->
    <section class="py-16 md:py-24 text-center">
      <UCard class="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div class="p-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Добро пожаловать на Игровой Форум</h1>
          <p class="text-lg md:text-xl mb-6">
            Ваш центр для обсуждения любимых игр, обмена опытом и общения с единомышленниками!
          </p>
          <UButton to="/register" color="primary" size="lg" class="mt-4">
            Присоединиться сейчас
          </UButton>
        </div>
      </UCard>
    </section>

    <!-- About Section -->
    <section class="py-12">
      <h2 class="text-3xl md:text-4xl font-semibold text-center mb-8">О проекте</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UCard class="bg-gray-50 dark:bg-gray-800">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">Наша миссия</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Мы стремимся создать пространство, где геймеры со всего мира могут делиться своими идеями, обсуждать новинки игровой индустрии и находить друзей.
            </p>
          </div>
        </UCard>
        <UCard class="bg-gray-50 dark:bg-gray-800">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">Сообщество</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Присоединяйтесь к тысячам игроков, участвуйте в обсуждениях, создавайте темы и станьте частью нашего растущего сообщества.
            </p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gray-100 dark:bg-gray-900">
      <h2 class="text-3xl md:text-4xl font-semibold text-center mb-8">Почему выбирают нас?</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="feature in features" :key="feature.title" class="bg-white dark:bg-gray-800">
          <div class="p-6 text-center">
            <UIcon :name="feature.icon" class="text-4xl text-primary mb-4" />
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 text-center">
      <UCard class="max-w-2xl mx-auto bg-primary text-white">
        <div class="p-8">
          <h2 class="text-3xl font-semibold mb-4">Готовы стать частью сообщества?</h2>
          <p class="mb-6">Зарегистрируйтесь сегодня и начните обсуждать любимые игры!</p>
          <UButton to="/register" color="white" variant="outline" size="lg">
            Создать аккаунт
          </UButton>
        </div>
      </UCard>
    </section>
  </UContainer>
</template>

<script setup>
const features = [
  {
    title: 'Активное сообщество',
    description: 'Общайтесь с геймерами со всего мира и делитесь своим опытом.',
    icon: 'i-heroicons-users'
  },
  {
    title: 'Удобный интерфейс',
    description: 'Интуитивно понятный дизайн для комфортного использования на любом устройстве.',
    icon: 'i-heroicons-device-phone-mobile'
  },
  {
    title: 'Регулярные обновления',
    description: 'Новинки игровой индустрии, конкурсы и события для участников.',
    icon: 'i-heroicons-sparkles'
  }
]
</script>

<style scoped>
/* Дополнительные стили для улучшения адаптивности */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.75rem;
  }
}
</style>

<script lang="ts" setup>

</script>

<style></style>