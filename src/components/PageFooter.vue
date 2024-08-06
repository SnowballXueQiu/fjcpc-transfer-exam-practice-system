<template>
    <footer class="page-footer">
        <div class="page-footer-project">
            <div class="page-footer-project__name"><span>AurLemon's Personal Practice Question Bank</span><span>for
                    FJCPC Transfer Exam</span></div>
            <div class="page-footer-project__link">
                <a href="https://beian.miit.gov.cn/" target="_blank"><img src="../assets/images/beian_miit.png"
                        width="16" height="16">闽ICP备2023007345号-1</a>
                <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank">
                    <img src="../assets/images/beian_mps.png" width="16" height="16">
                    闽公网安备35010202001677号
                </a>
                <a href="https://lemon.hydcraft.cn/stat" target="_blank">
                    <img src="../assets/images/favicon.png" width="16" height="16">
                    用户做题统计
                </a>
                <a href="https://appzb.fjcpc.edu.cn/kszx-test32/#/login" target="_blank">
                    <img src="../assets/images/logo_fjcpc.png" width="16" height="16">
                    船政刷题登录
                </a>
            </div>
        </div>
        <div class="page-footer-copyright">
            This project based on jQuery, coding and design by AurLemon (Lin Jun Le). © 2024 AurLemon under License MIT
            <br>
            工贸三年 谢谢教过我(们)的老师 特别是班主任/专业课/英语老师🌹 学生朽木 难以自雕 亦难自弃 愿工贸 春风育桃李 杏坛尽芳菲（除了教导队学生会）
        </div>
    </footer>
</template>

<style scoped>
.page-footer {
    color: var(--color-surface-4);
    font-size: 12px;
    max-width: var(--page-common-width);
    margin: 0 auto;
    margin-bottom: 2rem;
}

.page-footer .page-footer-copyright {
    text-align: center;
}

.page-footer .page-footer-project {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid var(--border-color-base);
}

.page-footer .page-footer-project__name {
    display: flex;
    flex-direction: column;
    color: var(--color-base);
    font-size: 16px;
    font-family: 'JetBrains Mono';
}

.page-footer .page-footer-project__link {
    display: flex;
    align-items: flex-end;
    gap: calc(var(--gap-value) / 6);
}

.page-footer .page-footer-project__link a {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--color-base--subtle);
    text-decoration: none;
    padding: 2px 6px;
    border-radius: 8px;
    transition: var(--transition-hover);
}

.page-footer .page-footer-project__link a:hover {
    background: var(--border-color-base);
}

.page-footer .page-footer-project__link a:active {
    transform: scale(0.98);
}

.page-footer .page-footer-project__link img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.page-footer .page-footer-project__name span:last-child {
    color: var(--color-surface-4);
    font-size: 14px;
}

@media screen and (max-width: 1000px) {
    .page-footer {
        margin: 0 1rem 3rem 1rem;
    }

    .page-footer .page-footer-project {
        padding-bottom: 0.75rem;
    }

    .page-footer .page-footer-project__name {
        margin: 10px;
    }

    .page-footer .page-footer-project__link {
        flex-wrap: wrap;
        gap: 0.75px;
    }
}
</style>