import { defineStore } from 'pinia';
import type { Subscription } from '~/types/subscription';

export const useSubscriptionsStore = defineStore('subscriptions', {
    state: () => ({
        userSubscribers: [] as {subscriber: {id: string}}[],
        userSubscribedTo: [] as {subscribed_to: {id: string}}[],
        error: null as string | null,
    }),
    actions: {
        async getUserSubscribers(user_id: string) {
            const { $getUserSubscribers } = useNuxtApp();
            try {
                this.userSubscribers = await $getUserSubscribers(user_id);
                this.error = null;
                console.log('PostsStore: подписки получены:', this.userSubscribers);
            } catch (error: any) {
                this.error = error.message || 'Ошибка загрузки подписок';
                this.userSubscribers = [];
            }
        },
        async getUserSubscribedTo(user_id: string) {
            const { $getUserSubscribedTo } = useNuxtApp();
            try {
                this.userSubscribedTo = await $getUserSubscribedTo(user_id);
                this.error = null;
                console.log('PostsStore: подписки получены:', this.userSubscribedTo);
            } catch (error: any) {
                this.error = error.message || 'Ошибка загрузки подписок';
                this.userSubscribedTo = [];
            }
        },
        async createSubscription(user_id: string, subscribed_to_id: string) {
            const { $subscribe } = useNuxtApp();
            try {
                const result = await $subscribe(user_id, subscribed_to_id);
                this.error = null;
                console.log('Подписка создана', result);
                await this.getUserSubscribers(subscribed_to_id)
            } catch (error: any) {
                this.error = error.message || 'ошибка создания подписки';
                console.error('Ошибка:', error);
            }
        },
        async deleteSubscription(user_id: string, subscribed_to_id: string) {
            const { $unsubscribe } = useNuxtApp();
            try {
                const result = await $unsubscribe(user_id, subscribed_to_id);
                this.error = null;
                console.log('Подписка создана', result);
                await this.getUserSubscribers(subscribed_to_id)
            } catch (error: any) {
                this.error = error.message || 'ошибка создания подписки';
                console.error('Ошибка:', error);
            }
        },
    },
    getters: {
        userSubscriptionsIds(state) {
            return state.userSubscribedTo.map(sub => sub.subscribed_to.id)
        }
    },

    hydrate(state, initialState) {
        console.log('PostsStore: Гидратация, initialState=', initialState);
        state.userSubscribedTo = initialState.userSubscribedTo;
        state.userSubscribers = initialState.userSubscribers;
        state.error = initialState.error;
    },
});