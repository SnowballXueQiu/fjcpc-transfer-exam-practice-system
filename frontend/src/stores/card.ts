// src/stores/card.ts

import { defineStore } from 'pinia'

export const useCardStore = defineStore('card', {
    state: () => ({
        showLoginCard: false,
        showAuthCard: false,
        mobileShowPanel: false
    }),
    actions: {
        isViewContainerOn(): Boolean {
            return this.showLoginCard || this.showAuthCard
        }
    }
})
