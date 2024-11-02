<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import { useCardStore } from '@/stores/card'
import { useNotifyStore } from '@/stores/notify'

const cardStore = useCardStore()
const notifyStore = useNotifyStore()

const openLoginCard = () => {
    cardStore.showLoginCard = true
}
</script>

<template>
    <div class="page-container-slide page-guide">
        <div class="page-guide-header">
            <div class="page-guide-text">
                <div class="page-guide-title">
                    非官方的、一个能<span class="emphasized" v-tippy="{ content: '主要功能哦宝宝' }">自己刷题看题</span>、有<span
                        class="emphasized"
                        v-tippy="{ content: '爬虫+数据去重' }"
                        >题库</span
                    >的第三方刷题系统
                </div>
                <div class="page-guide-subtitle">船政转轨考刷题系统</div>
            </div>
            <div class="page-guide-poster">
                <img src="@/assets/images/favicon.png" v-tippy="{ content: '致敬传奇主唱井芹仁菜' }" />
            </div>
        </div>
        <div class="page-guide-desc">
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">developer_board</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">谁弄得这个网站？</div>
                    <div class="page-guide-desc__subtitle">
                        当然是船政 3+2 的学生🌶，具体可以看关于页的小作文。做这个主要是刷一下项目经验，如果能帮到你很可太好了。
                    </div>
                </div>
            </div>
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">security</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">你这安全吗？</div>
                    <div class="page-guide-desc__subtitle">
                        尽量哦，不放心可以审查仓库源代码，数据库存储的都是 AES 加密后的姓名和身份证，登录传输的过程采用 SM2
                        算法加密后传输，重要的数据都是加密的。
                    </div>
                </div>
            </div>
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">animation</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">这里和船政什么区别？</div>
                    <div class="page-guide-desc__subtitle">
                        船政的只能一直做一套卷子，而且卷子的题目不是固定的，我这里把卷子的题目都爬下来了，想干嘛都行🤝。
                    </div>
                </div>
            </div>
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">login</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">一定要身份证登录吗？</div>
                    <div class="page-guide-desc__subtitle">
                        不登录也能做题，但是数据只保存在浏览器。只有船政的转轨系统有你了才能登录哦，没注册的会默认注册。担心身份证泄露的可以不登录。
                    </div>
                </div>
            </div>
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">widgets</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">专业课只有计算机吗？</div>
                    <div class="page-guide-desc__subtitle">
                        目前只有计算机应用技术，但是设计上给其他专业留好空间了，其他专业的想要获取题库的联系站长，下面有邮箱给我发个邮件。
                    </div>
                </div>
            </div>
            <div class="page-guide-desc__block">
                <div class="page-guide-desc__icon material-icons">code</div>
                <div class="page-guide-desc__text">
                    <div class="page-guide-desc__title">站点怎么弄得？</div>
                    <div class="page-guide-desc__subtitle">
                        自购服务器 + 个人域名 + 个人项目（前端 Vue，后端 Nest），本来考虑微服务的但是懒得再搬了，以后其他项目再弄吧。
                    </div>
                </div>
            </div>
        </div>
        <div class="page-guide-statement">
            <div class="material-icons">warning</div>
            <div class="context">网站还在测试中，有需要可联系开发者邮箱<span class="email">2115386831@qq.com</span>。</div>
        </div>
        <div class="page-guide-guide">
            <div class="page-guide-login">
                <div class="page-guide-guide__title">船政系统里有账号？可以登录看看</div>
                <div class="page-guide-guide__container">
                    <button @click="openLoginCard">打开登录面板</button>
                </div>
            </div>
            <div class="page-guide-links">
                <div class="page-guide-guide__title">没账号也能做，四处看看？</div>
                <div class="page-guide-guide__container">
                    <router-link to="/practice" class="page-guide-link">去刷题</router-link>
                    <router-link to="/view" class="page-guide-link">去看题</router-link>
                    <router-link to="/about" class="page-guide-link">看小作文</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/media_screen.scss' as screen;

.page-guide {
    display: flex;
    flex-direction: column;
    background: radial-gradient(ellipse at 5% 0%, rgb(57 157 191 / 6%) 0, transparent 75%),
        radial-gradient(ellipse at 60% 0%, rgb(15 121 145 / 6%) 0, transparent 75%);
    background-size: auto 35%;
    background-repeat: no-repeat;
    overflow-y: auto;

    .page-guide-header {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-top: 4.5rem;
        margin: 0 1.25rem;
        margin-bottom: 4rem;

        @include screen.media-screen(phone) {
            padding-top: 0;
            margin: 0;
            flex-direction: column-reverse;
        }

        .page-guide-text {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            max-width: 460px;

            .page-guide-title {
                font-size: 26px;
                font-weight: 400;
            }

            .page-guide-subtitle {
                color: var(--color-base--subtle);
                font-size: 14px;
            }

            .emphasized {
                color: transparent;
                font-weight: 800;
                margin: 0 6px;
                background-clip: text;
                background-image: linear-gradient(240deg, var(--color-primary) 30%, var(--color-base--subtle) 150%);
            }
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .page-guide-poster {
            position: absolute;
            top: 0;
            right: 0;
            height: 160px;
            padding: 0.5rem;
            border-radius: 50%;
            overflow: hidden;
            filter: brightness(1.05) drop-shadow(0 1px 4px var(--border-color-base--darker));
            user-select: none;
            cursor: pointer;
            transition: 250ms ease;

            @include screen.media-screen(phone) {
                width: 160px;
                position: static;
            }

            img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

            &:hover {
                transform: scale(1.05);
                background: var(--border-color-base);
            }

            &:active {
                transform: scale(0.98);
                transition-duration: 150ms;
            }
        }
    }

    .page-guide-desc {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
        margin: 2rem 1rem;

        @include screen.media-screen(phone) {
            grid-template-columns: repeat(1, 1fr);
        }

        .page-guide-desc__block {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .page-guide-desc__icon {
            color: var(--color-base--subtle);
            font-size: 42px;
            user-select: none;
        }

        .page-guide-desc__text {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            height: 100%;
        }

        .page-guide-desc__title {
            color: var(--color-base--emphasized);
            font-size: 16px;
        }

        .page-guide-desc__subtitle {
            color: var(--color-base--subtle);
            font-size: 12px;
        }
    }

    .page-guide-statement {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.25rem;
        color: var(--color-base--subtle);
        font-size: 12px;
        margin-bottom: 1rem;

        .material-icons {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
        }

        .email {
            font-weight: 600;
            margin: 0 2px;
            word-break: break-all;
        }
    }

    .page-guide-guide {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
        padding: 0.75rem 1.5rem;
        margin: 0 0.75rem;
        margin-top: auto;
        border-radius: 12px;
        background: var(--color-surface-2);

        .page-guide-guide__title {
            color: var(--color-base--subtle);
            font-size: 12px;
        }

        .page-guide-guide__container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .page-guide-links,
        .page-guide-login {
            display: flex;
            flex-direction: column;
            row-gap: 6px;
        }

        .page-guide-link,
        button {
            color: var(--color-surface-0);
            font-size: 14px;
            text-decoration: none;
            padding: 2px 10px;
            margin: 0;
            border: 1px solid var(--border-color-base);
            border-radius: 16px;
            background: var(--color-primary);
            cursor: pointer;
            transition: 250ms ease;

            &:hover {
                background: var(--color-base--subtle);
            }

            &:active {
                transform: scale(0.95);
            }
        }
    }
}
</style>
