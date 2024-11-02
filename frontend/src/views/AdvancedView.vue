<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

import { get, post, getPublicKey } from '@/api/api'
import { sm2Encrypt } from '@/utils/crypto'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useQuestionStore } from '@/stores/question'
import { useCardStore } from '@/stores/card'
import { useNotifyStore } from '@/stores/notify'

const authStore = useAuthStore()
const userStore = useUserStore()
const questionStore = useQuestionStore()
const cardStore = useCardStore()
const notifyStore = useNotifyStore()

const userSettingMap: Record<number, string> = {
    0: 'user_main_profession_subject', // 专业课科目
    1: 'auto_sync_data', // 自动同步数据
    2: 'auto_save_progress', // 自动更新进度
    3: 'auto_star_question', // 自动保存错题
    4: 'show_user_stat' // 允许向其他人展示做题进度
}

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

const formatTimestamp = (timestamp: string): string => {
    return dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
}

const resetPassword = () => {
    cardStore.closeAllCard()
    cardStore.showAuthCard = true
}

const isLoadProfessionSubject = ref<boolean>(false)
const isAddProfessionSubjectSuccess = ref<boolean>(false)
const addProfessionSubjectStatus = ref<string>('无')

const addSubjectRequestType = ref<string>('add')
const addSubjectCourse = ref<number>(2)
const addSubjectSubject = ref<number>()
const addSubjectProfessionId = ref<string>('')
const addSubjectProfessionName = ref<string>('')
const addSubjectIdNumber = ref<string>('')

const addProfessionSubject = async () => {
    isLoadProfessionSubject.value = false
    addProfessionSubjectStatus.value = '加载中'

    if (addSubjectSubject.value || addSubjectProfessionId.value === '' || addSubjectProfessionName.value === '' || addSubjectIdNumber.value === '') {
        addProfessionSubjectStatus.value = '数据不能为空'
        return
    }

    const publicKey: string | null = await getPublicKey()

    if (publicKey !== null) {
        const token = authStore.readToken()
        const encryptedIdNumber = sm2Encrypt(addSubjectIdNumber.value, publicKey)

        const params = {
            request_type: addSubjectRequestType.value,
            course: addSubjectCourse.value,
            subject: addSubjectSubject.value,
            profession_id: addSubjectProfessionId.value,
            profession_name: addSubjectProfessionName.value,
            id_number: encryptedIdNumber
        }

        const response: any = await post('/admin/request', params, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.data.code === 200) {
            isAddProfessionSubjectSuccess.value = true
            isLoadProfessionSubject.value = false
            addProfessionSubjectStatus.value = `添加成功`
        } else {
            isAddProfessionSubjectSuccess.value = false
            isLoadProfessionSubject.value = false
            addProfessionSubjectStatus.value = `${response.data.data.message}（${response.data.data.type}）`
        }
    } else {
        notifyStore.addMessage('failed', '无法获取公钥')
    }
}

const crawlCourse = ref<number>(1)
const crawlSubject = ref<number>()
const crawlStatus = ref<string>('无')

const crawlQuestion = async () => {
    crawlStatus.value = `加载中`

    if (!crawlSubject.value && crawlCourse.value == 2) {
        crawlStatus.value = `需要选择专业课科目`
        return
    }

    const token = authStore.readToken()

    let params: { course: number; subject?: number } = {
        course: crawlCourse.value
    }

    if (crawlCourse.value === 2 && crawlSubject.value) {
        params.subject = crawlSubject.value
    }

    const response: any = await post('/admin/crawl', params, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (response.data.code === 200) {
        crawlStatus.value = `成功（耗时 ${(response.data.data.elapsed_time / 1000).toFixed(2)} 秒）`
    } else {
        crawlStatus.value = `请求失败`
    }
}
</script>

<template>
    <div class="page-container-slide page-advanced">
        <div class="page-container-title">设置</div>
        <div class="page-advanced-user" v-if="userStore.login.isLogged && !userStore.login.refreshing">
            <div class="page-advanced-user__info">
                <div class="page-advanced-user__wrapper">
                    <div class="page-advanced-user__name">{{ userStore.profile.name }}</div>
                    <div class="page-advanced-user__id">{{ userStore.profile.id_number }}</div>
                </div>
                <div class="page-advanced-user__uuid">{{ userStore.profile.uuid }}</div>
            </div>
            <div class="page-advanced-user__tags">
                <div class="page-advanced-user__regdate page-advanced-user__tag">
                    注册时间
                    <span class="data">{{ formatTimestamp(userStore.profile.reg_date) }}</span>
                </div>
                <div class="page-advanced-user__lastlogin page-advanced-user__tag">
                    上次登录
                    <span class="data">{{ formatTimestamp(userStore.profile.last_login) }}</span>
                </div>
                <div class="page-advanced-user__resetpw page-advanced-user__tag" @click="resetPassword">重置密码</div>
            </div>
        </div>
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
            <div class="page-advanced-basic__setting">
                <div class="page-advanced-basic__button material-icons" @click="changeSetting(1, !userStore.setting.auto_sync_data)">
                    {{ userStore.setting.auto_sync_data ? 'check_circle' : 'check_circle_outline' }}
                </div>
                <div class="page-advanced-basic__title">自动对齐数据</div>
                <div class="page-advanced-basic__desc">如果勾选，当本地的做题进度比服务器数据多的时候，会合并同步本地和远程的数据到服务器。</div>
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
        <div class="page-advanced-server" v-if="userStore.login.isLogged && !userStore.login.refreshing && userStore.profile.permission >= 10">
            <div class="page-advanced-server__addsubject">
                <div class="page-advanced-server__title">增加专业课</div>
                <div class="page-advanced-server__form">
                    <div class="page-advanced-server__input">
                        <input type="text" placeholder="专业课的课程 ID" v-model="addSubjectSubject" />
                        <input type="text" placeholder="专业课的英文名称" v-model="addSubjectProfessionId" />
                        <input type="text" placeholder="专业课的中文名称" v-model="addSubjectProfessionName" />
                        <input type="text" placeholder="该专业课获取题目的身份证" v-model="addSubjectIdNumber" />
                    </div>
                    <button @click="addProfessionSubject">确定</button>
                </div>
                <div class="page-advanced-server__info">
                    <span class="material-icons">terminal</span>
                    {{ addProfessionSubjectStatus }}
                </div>
            </div>
            <div class="page-advanced-server__crawl">
                <div class="page-advanced-server__title">爬取题目</div>
                <div class="page-advanced-server__form">
                    <div class="page-advanced-server__input">
                        <div class="course-selection">
                            <label class="course-option">
                                <input type="radio" name="course-option" :value="1" v-model="crawlCourse" />
                                文化课
                            </label>
                            <label class="course-option">
                                <input type="radio" name="course-option" :value="2" v-model="crawlCourse" />
                                专业课
                            </label>
                        </div>
                        <div class="subject-selection" v-if="crawlCourse === 2">
                            <label class="subject-option" v-for="subject in questionStore.questionInfo.profession_lesson" :key="subject.subject">
                                <input type="radio" name="subject-option" :value="subject.subject" v-model="crawlSubject" />
                                {{ subject.name }}
                            </label>
                        </div>
                    </div>
                    <button @click="crawlQuestion">确定</button>
                </div>
                <div class="page-advanced-server__info">
                    <span class="material-icons">terminal</span>
                    {{ crawlStatus }}
                </div>
            </div>
        </div>
        <div class="page-advanced-statement" v-if="questionStore.questionInfo.git_info.repo_commit !== ''">
            <div class="status" v-if="questionStore.questionInfo.git_info.recent_commit === 'both'">
                <span class="material-icons">done</span>
                当前项目的本地仓库的进度与远程仓库一致。
            </div>
            <div class="status" v-else-if="questionStore.questionInfo.git_info.recent_commit === 'repo'">
                <span class="material-icons">warning</span>
                当前项目已滞后，需要部署项目的人员更新项目。
            </div>
            <div class="status" v-else>
                <span class="material-icons">refresh</span>
                当前项目进度不属于远程仓库。
            </div>
            <div class="context">
                项目仓库最新提交记录为
                <span class="commit">
                    <a :href="`https://github.com/AurLemon/fjcpc-transfer-exam-practice-system/commit/${questionStore.questionInfo.git_info.repo_commit}`">
                        {{ questionStore.questionInfo.git_info.repo_commit }}
                    </a>
                </span>
                ，当前运行项目的提交记录为
                <span class="commit">{{ questionStore.questionInfo.git_info.current_commit }}</span
                >。
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-advanced {
    $value-page-gap: 3rem;
    overflow-y: auto;

    .page-advanced-user {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: $value-page-gap;

        .page-advanced-user__info {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0.75rem 0 1.5rem 0;

            .page-advanced-user__wrapper {
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .page-advanced-user__name {
                font-weight: 600;
            }

            .page-advanced-user__id {
                font-size: 20px;
            }

            .page-advanced-user__uuid {
                color: var(--color-surface-4);
                font-size: 14px;
                font-family: 'JetBrains Mono';
                text-align: center;
                word-break: break-all;
            }
        }

        .page-advanced-user__tags {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            color: var(--color-base--subtle);
            font-size: 12px;

            .page-advanced-user__tag {
                background: var(--background-color-primary--hover);
                padding: 2px 10px;
                border-radius: 16px;

                .data {
                    font-weight: 600;
                }
            }

            .page-advanced-user__resetpw {
                background: var(--border-color-base);
                transition: 150ms;
                user-select: none;
                cursor: pointer;

                &:hover {
                    color: var(--color-surface-0);
                    background: var(--color-primary);
                }

                &:active {
                    transform: scale(0.85);
                }
            }
        }
    }

    .page-advanced-basic {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: $value-page-gap * 1.75;

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

    .page-advanced-server {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.75rem;
        border: 1px solid var(--border-color-base--darker);
        border-radius: 16px;
        margin-bottom: 1.5rem;

        .page-advanced-server__title {
            color: var(--color-base--subtle);
            font-size: 12px;
            text-align: center;
            margin-bottom: 0.5rem;
        }

        .page-advanced-server__form {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .page-advanced-server__input {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;

            input {
                margin: 0;
                border-color: var(--border-color-base);
            }

            label {
                display: flex;
                align-items: center;
                gap: 2px;
                color: var(--color-base--subtle);
                font-size: 12px;
            }
        }

        button {
            flex: 0 0 80px;
            height: fit-content;
            border-color: transparent;
            background: var(--background-color-primary--active);
            transition: 150ms;
            user-select: none;
            cursor: pointer;

            &:hover {
                color: var(--color-surface-0);
                background: var(--color-primary);
            }
        }

        .page-advanced-server__info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-base);
            font-size: 12px;
            margin: 2px 0.25rem;

            .material-icons {
                color: var(--color-base);
                font-size: 16px;
            }
        }

        .page-advanced-server__crawl {
            .page-advanced-server__input {
                display: flex;
                align-items: center;
                gap: 1.5rem;

                .course-selection,
                .subject-selection {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
            }
        }
    }

    .page-advanced-statement {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        color: var(--color-surface-4);
        font-size: 12px;

        .status {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--color-base--subtle);
            font-size: 14px;
            font-weight: 600;

            .material-icons {
                font-size: 18px;
            }
        }

        .context {
            word-break: break-all;
        }

        .commit {
            color: hsla(var(--color-primary__h), var(--color-primary__s), var(--color-primary__l), 0.7);
            margin: 0 4px;

            a {
                color: hsla(var(--color-primary__h), var(--color-primary__s), var(--color-primary__l), 0.7);
                text-decoration: none;

                &:hover {
                    color: hsla(var(--color-primary__h), var(--color-primary__s), var(--color-primary__l), 0.9);
                }
            }
        }
    }
}
</style>
