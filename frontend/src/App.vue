<script setup lang="ts">
import PageHeader from './components/PageHeader.vue'
import PageContainer from './components/PageContainer.vue'
import PageFooter from './components/PageFooter.vue'
import NotifyContainer from './components/common/NotifyContainer.vue'

import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useQuestionStore } from '@/stores/question'

const authStore = useAuthStore()
const userStore = useUserStore()
const questionStore = useQuestionStore()

const init = (async () => {
    if (await userStore.readLogin()) {
        await Promise.all([authStore.getUserProfile(), userStore.fetchUserProgress(), userStore.fetchStarProgress()])
    }

    if (!userStore.login.isLogged) {
        userStore.setting = authStore.readUserSetting() || userStore.setting
    } else {
        await authStore.getUserSetting()
    }

    questionStore.getQuestionInfo(async () => {
        userStore.updateProgressCount()
    })
})()
</script>

<template>
    <PageHeader />
    <PageContainer />
    <PageFooter />
    <NotifyContainer />
</template>

<style lang="scss">
#app {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
}
</style>
