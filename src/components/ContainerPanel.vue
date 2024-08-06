<script setup lang="ts">

</script>

<template>
    <div class="page-container-panel">
        <div class="container-panel-countdown">
            <div class="container-panel-header-countdown" id="total-countdown">
                <div class="container-panel-header-countdown__value">{{ totalCount }}</div>
                <div class="container-panel-header-countdown__label">题目总数</div>
            </div>
            <div class="container-panel-header-countdown" id="prof-countdown">
                <div class="container-panel-header-countdown__value">-</div>
                <div class="container-panel-header-countdown__label">专业课题目数</div>
            </div>
            <div class="container-panel-header-countdown" id="general-countdown">
                <div class="container-panel-header-countdown__value">-</div>
                <div class="container-panel-header-countdown__label">文化课题目数</div>
            </div>
            <div class="container-panel-header-countdown" id="exam-countdown">
                <div class="container-panel-header-countdown__value">-</div>
                <div class="container-panel-header-countdown__label">距离转轨考还有（天）</div>
            </div>
        </div>
        <div class="container-panel-status">
            <div class="container-panel-status__label" id="progress-sync-status"><span
                    class="container-panel-status__color"></span><span class="container-panel-status__text">-</span>
            </div>
            <div class="container-panel-status__progress" id="backend-status">
                <div class="container-panel-status__progressLabel">做题进度<span id="student-progress">-</span></div>
                <div class="container-panel-status__progressWrapper">
                    <div class="container-panel-status__progressScroll"></div>
                </div>
            </div>
        </div>
        <div class="container-panel-profile">
            <div class="container-panel-profile__greeting">-</div>
            <div class="container-panel-profile__inner">
                <div class="container-panel-profile__idnumber">-</div>
                <div class="container-panel-profile__buttons">
                    <div class="container-panel-profile__button container-panel-profile__edit">
                        <img src="../assets/images/icon_edit.svg">
                    </div>
                    <div class="container-panel-profile__button container-panel-profile__delete">
                        <img src="../assets/images/icon_delete.svg">
                    </div>
                    <div style="display: none;" class="container-panel-profile__button container-panel-profile__done">
                        <img src="../assets/images/icon_done.svg">
                    </div>
                </div>
            </div>
            <div class="container-panel-profile__detail">-</div>
        </div>
    </div>
</template>

<style scoped>
.page-container .page-container-panel {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    padding: 15px;
    border: 1px solid var(--border-color-base);
    border-radius: 10px;
    background: var(--color-surface-0);
    overflow-y: auto;
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__greeting {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__inner {
    position: relative;
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__idnumber {
    max-width: calc(100% - 32px);
    height: 26px;
    padding: 4px 2px;
    font-size: 14px;
    font-family: 'JetBrains Mono';
    outline-color: var(--color-primary);
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__buttons {
    display: flex;
    align-items: center;
    gap: calc(var(--gap-value) / 4);
    opacity: 0.1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transition: var(--transition-hover);
}

.page-container .page-container-panel:hover .container-panel-profile .container-panel-profile__buttons {
    opacity: 1;
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__button img {
    display: block;
    width: 28px;
    height: 28px;
    padding: 4px;
    border-radius: 50%;
    opacity: 0.7;
    transition: var(--transition-hover);
    user-select: none;
    -webkit-user-select: none;
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__button:hover img {
    background: rgba(0, 0, 0, .1);
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__button:active img {
    transform: scale(0.9);
}

.page-container .page-container-panel .container-panel-profile .container-panel-profile__detail {
    color: var(--color-surface-4);
    font-size: 12px;
    padding: 0 2px;
}

.page-container .page-container-panel .container-panel-profile {
    margin-top: 30px;
    margin-bottom: 10px;
    padding-top: 30px;
    border-top: 1px solid var(--border-color-base);
}

.page-container .page-container-panel .container-panel-countdown {
    display: flex;
    flex-direction: column;
    gap: var(--gap-value);
    margin-bottom: 3rem;
}

.page-container .page-container-panel .container-panel-countdown .container-panel-header-countdown {
    margin: 4px 12px;
}

.page-container .page-container-panel .container-panel-countdown .container-panel-header-countdown .container-panel-header-countdown__value {
    font-size: 42px;
    line-height: 1;
}

.page-container .page-container-panel .container-panel-countdown .container-panel-header-countdown .container-panel-header-countdown__label {
    color: var(--color-base--subtle);
    font-size: 14px;
    letter-spacing: 0.75px;
}

.page-container .page-container-panel .container-panel-status {
    margin-top: auto;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__label,
.page-container .page-container-panel .container-panel-status .container-panel-status__progress {
    color: var(--color-base--subtle);
    font-size: 12px;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__label .container-panel-status__color {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
}

.page-container .page-container-panel .container-panel-status #recent-operate-count.container-panel-status__label .container-panel-status__color {
    background: var(--color-primary);
}

.page-container .page-container-panel .container-panel-status #recent-operate-count.container-panel-status__label .container-panel-status__emphasized {
    color: var(--color-base);
    font-weight: 600;
    margin: 0 3px;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__progress {
    margin-top: 1rem;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__progressLabel {
    color: var(--color-surface-4);
}

.page-container .page-container-panel .container-panel-status .container-panel-status__progressLabel #student-progress {
    color: var(--color-base--emphasized);
    margin-left: 6px;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__progressWrapper {
    width: 100%;
    height: 8px;
    border-radius: 8px;
    background: var(--color-surface-3);
    overflow: hidden;
}

.page-container .page-container-panel .container-panel-status .container-panel-status__progressScroll {
    height: inherit;
    background: var(--color-primary);
    transition: var(--transition-hover);
}

@media screen and (max-width: 1000px) {
    .page-container .page-container-panel .container-panel-profile .container-panel-profile__buttons {
        opacity: 1;
    }

    .page-container .page-container-panel {
        height: 75%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background: var(--background-color-overlay--lighter);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 5;
        opacity: 0;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        transition: var(--transition-hover);
        transform: translate(calc(-100%), -16%);
        overflow-x: auto;
    }

    .page-container .mobile.page-container-panel {
        height: 80vh;
        max-height: 100%;
        opacity: 1;
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.05), 0px 2px 5px rgba(0, 0, 0, 0.05);
        transform: translate(calc(0% - 20px), -4%);
    }
}
</style>