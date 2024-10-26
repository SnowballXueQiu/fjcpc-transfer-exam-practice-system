<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { useUserStore } from '@/stores/user'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])
const userStore = useUserStore()

interface ProgressData {
    pid: string
    course: number
    subject: number
    time: string
}

const dayProgressList = ref<ProgressData[]>([])

const isChartRender = ref<boolean>(true)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const renderCharts = () => {
    if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value)

        if (!dayProgressList.value || !dayProgressList.value.length || dayProgressList.value.every((item) => item.course === 0 && item.subject === 0)) {
            isChartRender.value = false
            return
        } else {
            isChartRender.value = true
        }

        const dataByDate: Record<string, number> = {}

        dayProgressList.value.forEach((progress) => {
            const date = new Date(Number(progress.time)).toISOString().split('T')[0]
            if (!dataByDate[date]) {
                dataByDate[date] = 0
            }
            dataByDate[date] += 1
        })

        const dates = Object.keys(dataByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        const counts = dates.map((date) => dataByDate[date])

        const fontFamilyBase =
            '"Inter", "MiSans Latin", "Helvetica Neue", "Helvetica", "Roboto", "BlinkMacSystemFont", "MiSans", "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif'

        const option = {
            grid: {
                top: 20,
                bottom: 10,
                left: 20,
                right: 20,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontFamily: fontFamilyBase,
                    fontSize: 14,
                    color: '#3e6274'
                }
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: '#3e6274',
                    fontFamily: fontFamilyBase
                }
            },
            yAxis: {
                type: 'value',
                splitNumber: 2,
                axisLine: { show: false },
                splitLine: { show: false },
                axisLabel: {
                    fontFamily: fontFamilyBase
                }
            },
            series: [
                {
                    name: '题量',
                    type: 'line',
                    data: counts,
                    lineStyle: { color: '#3791be' }
                }
            ]
        }
        chartInstance.setOption(option)
    }
}

const reloadCharts = async () => {
    isChartRender.value = true

    const res = await userStore.getAllProgress()
    dayProgressList.value = res
    renderCharts()
}

const calculateUserProgress = computed(() => {
    const userProgress = userStore.profile.user_progress
    return Number(((userProgress.current / userProgress.total) * 100).toFixed(2))
})

const getUserWrongCount = async () => {
    const folder = await userStore.getFolderContent('wrong')
    return folder.length
}

const userWrongCount = ref<number>(0)

onMounted(() => {
    const init = (async () => {
        const res = await userStore.getAllProgress()
        dayProgressList.value = res
        renderCharts()

        userWrongCount.value = await getUserWrongCount()
    })()

    const handleResize = () => {
        if (chartInstance) {
            chartInstance.resize()
        }
    }

    window.addEventListener('resize', handleResize)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
    })
})
</script>

<template>
    <div class="page-container-slide page-stat">
        <div class="page-container-title">统计</div>
        <div class="page-stat-info">
            <div class="page-stat-charts">
                <div class="page-stat-charts__title">每日完成题量</div>
                <div ref="chartRef" class="page-stat-charts__draw" v-if="isChartRender"></div>
                <div class="page-stat-charts__draw none" v-else>
                    <div class="icon">
                        <span class="material-icons">close</span>
                    </div>
                    <div class="text">
                        暂无数据
                        <span class="material-icons" @click="reloadCharts" v-tippy="{ content: '刷新' }">refresh</span>
                    </div>
                </div>
            </div>
            <div class="page-stat-grid">
                <div class="page-stat-data">
                    <div class="page-stat-data__item">
                        <div class="page-stat-data__label">进度</div>
                        <div class="page-stat-data__value">{{ calculateUserProgress }}%</div>
                    </div>
                    <div class="page-stat-data__item">
                        <div class="page-stat-data__label">题目数量</div>
                        <div class="page-stat-data__value">{{ userStore.profile.user_progress.current }} / {{ userStore.profile.user_progress.total }}</div>
                    </div>
                    <div class="page-stat-data__item">
                        <div class="page-stat-data__label">收藏数量</div>
                        <div class="page-stat-data__value">{{ userWrongCount }}</div>
                    </div>
                    <div class="page-stat-data__item">
                        <div class="page-stat-data__label">错误率</div>
                        <div class="page-stat-data__value">{{ ((userWrongCount / userStore.profile.user_progress.total) * 100).toFixed(2) }}%</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-stat-list">
            <div class="page-stat-list-filter">
                <div class="page-stat-list-filter__item"></div>
            </div>
            <div class="page-stat-list-item"></div>
        </div>
        <div class="page-stat-server"></div>
    </div>
</template>

<style lang="scss" scoped>
.page-stat {
    .page-stat-info {
        .page-stat-grid {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1.75rem;

            .page-stat-data {
                display: flex;
                flex-wrap: wrap;
                gap: 1.5rem;
                padding: 0 1rem;

                .page-stat-data__item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;

                    .page-stat-data__label {
                        color: var(--color-base--subtle);
                        font-size: 12px;
                        line-height: 1;
                    }

                    .page-stat-data__value {
                        font-size: 32px;
                        font-weight: 600;
                    }
                }
            }
        }

        .page-stat-charts {
            padding: 0.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border-color-base--darker);
            border-radius: 16px;

            .page-stat-charts__title {
                color: var(--color-base--subtle);
                font-size: 12px;
                text-align: center;
                margin-bottom: 0.25rem;
            }

            .page-stat-charts__draw {
                width: 100%;
                height: 120px;
                border-radius: 16px;

                &.none {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    gap: 4px;
                    color: var(--color-base--subtle);
                    font-size: 14px;
                    cursor: not-allowed;
                    user-select: none;

                    .icon .material-icons {
                        color: var(--color-base--subtle);
                        font-size: 42px;
                    }

                    .text {
                        display: flex;
                        align-items: center;
                        gap: 4px;

                        .material-icons {
                            color: var(--color-surface-4);
                            font-size: 16px;
                            padding: 4px;
                            border-radius: 50%;
                            cursor: pointer;
                            transition: 150ms;

                            &:hover {
                                background: var(--border-color-base);
                            }

                            &:active {
                                transform: scale(0.9);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
