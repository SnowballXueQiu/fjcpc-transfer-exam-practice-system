<script lang="ts" setup>
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useQuestionStore } from '@/stores/question'

const authStore = useAuthStore()
const userStore = useUserStore()
const questionStore = useQuestionStore()

const isSaving = ref<[]>([])

const userSettingMap: Record<number, string> = {
    0: 'user_main_profession_subject', // 专业课科目
    1: 'auto_sync_data', // 自动同步数据
    2: 'auto_save_progress', // 自动更新进度
    3: 'auto_star_question', // 自动保存错题
    4: 'show_user_stat' // 允许向其他人展示做题进度
}

const changeLoadStatus = (mapIndex: number) => {}

const changeMainSubject = async (mainSubject: number): Promise<void> => {
    if (userStore.setting.user_main_profession_subject === mainSubject) return
    await authStore.saveUserSetting({ user_main_profession_subject: mainSubject })
}

const changeSetting = (mapIndex: number, value: any) => {
    if (userStore.login.isLogged && !userStore.login.refreshing) {
        const key = userSettingMap[mapIndex]
        authStore.saveUserSetting({ [key]: value })
    } else {
        userStore.setting[userSettingMap[mapIndex]] = value
        if (!authStore.readUserSetting()) {
            authStore.setUserSetting()
        }
        authStore.setUserSetting()
    }
}
</script>

<template>
    <div class="page-container-slide page-advanced">
        <div class="page-container-title">设置</div>
        <div class="page-advanced-user" v-if="userStore.login.isLogged && !userStore.login.refreshing"></div>
        <div class="page-advanced-basic">
            <div class="page-advanced-basic__mainsubject">
                <div class="page-advanced-basic__name">切换主专业课</div>
                <div
                    class="page-advanced-basic__subject"
                    v-for="subject in questionStore.questionInfo.profession_lesson"
                    :key="subject.subject"
                    :class="{ active: userStore.setting.user_main_profession_subject === subject.subject }"
                    @click="changeMainSubject(subject.subject)"
                >
                    <div class="id">{{ subject.subject }}</div>
                    {{ subject.name }}
                </div>
            </div>
            <div class="page-advanced-basic__setting" v-if="userStore.login.isLogged && !userStore.login.refreshing">
                <div class="page-advanced-basic__button material-icons" @click="changeSetting(4, !userStore.setting.show_user_stat)">
                    {{ userStore.setting.show_user_stat ? 'check_circle' : 'check_circle_outline' }}
                </div>
                <div class="page-advanced-basic__title">公开用户数据</div>
                <div class="page-advanced-basic__desc">如果勾选，你的数据会在统计页面被其它用户看到👁👁。</div>
            </div>
            <div class="page-advanced-basic__setting" v-if="userStore.login.isLogged && !userStore.login.refreshing">
                <div class="page-advanced-basic__button material-icons" @click="changeSetting(1, !userStore.setting.auto_sync_data)">
                    {{ userStore.setting.auto_sync_data ? 'check_circle' : 'check_circle_outline' }}
                </div>
                <div class="page-advanced-basic__title">自动同步数据</div>
                <div class="page-advanced-basic__desc">如果勾选，当本地数据和远程数据不一致的时候，会合并同步本地和远程的数据到服务器。</div>
            </div>
            <div class="page-advanced-basic__setting">
                <div class="page-advanced-basic__button material-icons" @click="changeSetting(2, !userStore.setting.auto_save_progress)">
                    {{ userStore.setting.auto_save_progress ? 'check_circle' : 'check_circle_outline' }}
                </div>
                <div class="page-advanced-basic__title">自动保存进度</div>
                <div class="page-advanced-basic__desc">如果勾选，做完一题后，这题会自动标记已完成。</div>
            </div>
            <div class="page-advanced-basic__setting">
                <div class="page-advanced-basic__button material-icons" @click="changeSetting(3, !userStore.setting.auto_star_question)">
                    {{ userStore.setting.auto_star_question ? 'check_circle' : 'check_circle_outline' }}
                </div>
                <div class="page-advanced-basic__title">自动收藏错题</div>
                <div class="page-advanced-basic__desc">如果勾选，做错一题后，这题会自动收藏至错题集。</div>
            </div>
        </div>
        <div class="page-advanced-server"></div>
    </div>
</template>

<style lang="scss" scoped>
.page-advanced {
    overflow-y: auto;

    .page-advanced-basic {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .page-advanced-basic__mainsubject {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 1.25rem;
            border-radius: 8px;
            background: var(--color-surface-2);
            margin-bottom: 0.5rem;

            .page-advanced-basic__name {
                flex: 0 0 100%;
                color: var(--color-base--subtle);
                font-size: 12px;
            }

            .page-advanced-basic__subject {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 2px;
                color: var(--color-base--subtle);
                font-size: 12px;
                text-align: center;
                width: 70px;
                height: 100%;
                padding: 0.5rem;
                background: var(--background-color-primary--active);
                border-radius: 8px;
                transition: 150ms;
                user-select: none;
                cursor: pointer;

                &.active {
                    color: var(--color-surface-0);
                    background: var(--color-primary);
                }

                .id {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--color-primary);
                    font-size: 8px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--color-surface-0);
                }

                &:hover {
                    background: var(--color-base--subtle);
                }
            }
        }

        .page-advanced-basic__setting {
            display: grid;
            grid-template-columns: 24px auto;
            column-gap: 0.25rem;

            .page-advanced-basic__button {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--color-primary);
                font-size: 20px;
                padding: 3px;
                border-radius: 50%;
                transition: 150ms;
                user-select: none;
                cursor: pointer;

                &:hover {
                    background: var(--border-color-base);
                }

                &:active {
                    transform: scale(0.85);
                }
            }

            .page-advanced-basic__title {
                display: flex;
                align-items: center;
                color: var(--color-base--subtle);
                letter-spacing: 0.75px;
            }

            .page-advanced-basic__desc {
                grid-column: 2;
                color: var(--color-surface-4);
                font-size: 12px;
                line-height: 1;
            }
        }
    }
}
</style>
