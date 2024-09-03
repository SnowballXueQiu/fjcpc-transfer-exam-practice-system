<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<template>
    <div class="page-container-slide page-about">
        <div class="page-about-github">
            <div class="page-about-github__name">FJCPC Transfer Practice System</div>
            <div class="page-about-github__desc">给需要转轨考的朋友准备的喵</div>
            <div class="page-about-github__info">
                <div class="page-about-github__version">v3.0.0</div>
                <div class="page-about-github__links">
                    <a
                        class="page-about-github__link"
                        href="https://github.com/AurLemon/fjcpc-transfer-practice-system"
                    >
                        <img src="../assets/images/logo/GitHub_logo.svg" />
                    </a>
                    <a class="page-about-github__link" href="https://www.cnblogs.com/AurLemon">
                        <img src="../assets/images/logo/AurLemon_logo.jpg" />
                    </a>
                </div>
            </div>
        </div>
        <div class="page-about-content">
            <div class="page-about-block">
                <h2>技术</h2>
                <p class="tech-logos">
                    <img class="tech-logo" src="../assets/images/logo/Vuejs_logo.svg" />
                    <img class="tech-logo" src="../assets/images/logo/Nestjs_logo.svg" />
                </p>
                <p>
                    前端以 Vue.js 3 为基础进行开发，配合 SCSS、TypeScript、Pinia
                    等工具辅助开发。后端采用 Nest.js + SQLite。
                </p>
            </div>
            <div class="page-about-block">
                <h2>背景</h2>
                <p>
                    本人是船政学院2021级的“3+2”学生，2024年4月底时在转轨考的练习系统刷题时，无意中发现这个练习系统的设计很，简朴，就想着自己在这个系统题库的基础上再建一个给同学刷题用的，顺便练一下自己的能力，于是就这么做下去了。
                </p>
                <p>
                    后面在班群里面发给同学后，也是给大家用到了，后面也慢慢修改了一些内容就这样下去了。虽然转轨考试很简单，通过率还是很高的，也十分感谢我班里同学们的支持！！！我班上叫计大，所以这个项目的标题就叫这个了，虽然代码里面没有用到这个名字嘻嘻。除了刷题以外还有看题目的功能（带答案），就直接看看题目也挺好的！
                </p>
                <p>
                    在考试结束后，自己打算花时间用新技术重构一下，顺便加点功能。Node.js
                    是我没接触过的技术，于是就这么开始下一版开发了。
                </p>
            </div>
        </div>
        <div class="page-about-footer"></div>
    </div>
</template>

<style lang="scss" scoped>
.page-about {
    padding: 1.5rem !important;
    overflow: auto;
}

.page-about-github {
    text-align: center;
    margin: 2rem 0 6rem 0;

    .page-about-github__name {
        font-size: 32px;
        font-weight: 600;
    }

    .page-about-github__desc {
        color: var(--color-base--subtle);
        font-size: 14px;
    }

    .page-about-github__info {
        $img-value-length: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 0.75rem;

        .page-about-github__version {
            font-size: 14px;
            font-family: 'JetBrains Mono';
            padding: 2px 4px;
            border-radius: 4px;
            background: var(--color-surface-2);
        }

        .page-about-github__links {
            display: flex;
            gap: 0.5rem;

            img {
                display: block;
                width: $img-value-length;
                height: $img-value-length;
                border-radius: 50%;
                user-select: none;
            }
        }
    }
}

.page-about-content {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;

    .page-about-block {
        h2 {
            color: var(--color-base--subtle);
        }

        p {
            font-size: 14px;
            margin-top: 0.5rem !important;
        }

        p:first-of-type {
            margin-top: 0.75rem;
        }

        h2,
        p {
            margin: 0;
        }

        .tech-logos {
            display: flex;
            gap: 1rem;

            .tech-logo {
                $img-value-length: 54px;
                display: block;
                width: $img-value-length;
                height: $img-value-length;
                user-select: none;
            }
        }
    }
}
</style>
