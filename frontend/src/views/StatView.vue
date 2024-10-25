<script lang="ts">
import { defineComponent } from 'vue'
import * as echarts from 'echarts/core'

export default defineComponent({
    name: 'StatView'
})
</script>

<template>
    <div class="page-container-slide page-stat">
        <div class="page-container-title">统计</div>
        <div class="page-stat-charts">
            <div class="page-stat-charts__draw"></div>
            <div class="page-stat-charts__title">每日完成题量</div>
        </div>
        <div class="page-stat-list"></div>
    </div>
</template>

<style lang="scss" scoped></style>
