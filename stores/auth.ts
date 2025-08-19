import { defineStore } from 'pinia';
import type { User } from '~/types/user';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isAuthenticated: false,
        tokens: <{ expires: number, refresh_token: string, access_token: string }>{
            expires: 0,
            refresh_token: "",
            access_token: ""
        }
    }),
    actions: {
        async initAuth() {
            const { $isAuthenticated, $refreshToken } = useNuxtApp();
            let authUser = await $isAuthenticated();
            if (!authUser) {
                try {
                    await $refreshToken();
                    authUser = await $isAuthenticated();
                } catch (error) {
                    console.error('Ошибка рефреша токена:', error);
                }
            }
            this.user = authUser || null;
            this.isAuthenticated = !!authUser;
        },
        async login(email: string, password: string) {
            const { $login } = useNuxtApp();
            await $login(email, password);
            await this.initAuth();
        },
        async logout() {
            const { $logout } = useNuxtApp();
            await $logout();
            this.user = null;
            this.isAuthenticated = false;
        },
    },
    hydrate(state, initialState) {
        // Гидратация: синхронизирует состояние между SSR и клиентом
        state.user = initialState.user;
        state.isAuthenticated = initialState.isAuthenticated;
    },
});