import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import type { User } from '~/types/user';

export const useUsersStore = defineStore('users', {
    state: () => ({
        user: {} as User,
        error: null as string | null,
    }),
    // getters: {
    //     // Посты текущего пользователя
    //     userPosts(state) {
    //         const authStore = useAuthStore();
    //         if (!authStore.user) return [];
    //         return state.posts.filter(post => post.user_created.id === authStore.user?.id);
    //     },
    // },
    actions: {
        async fetchUser(user_id: string) {
            const { $getUserInfo } = useNuxtApp();
            try {
                console.log('PostsStore: Загрузка информации о пользователе...');
                this.user = await $getUserInfo(user_id);
                this.error = null;
                console.log('PostsStore: Юзер получен:', this.user);
            } catch (error: any) {
                this.error = error.message || 'Ошибка загрузки юзера';
                console.error('PostsStore: Ошибка:', error);
                this.user = {};
            }
        },
    },
    hydrate(state, initialState) {
        console.log('PostsStore: Гидратация, initialState=', initialState);
        state.user = initialState.user;
        state.error = initialState.error;
    },
});