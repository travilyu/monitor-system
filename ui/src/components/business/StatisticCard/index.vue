<template>
  <a-card :loading="loading" :bordered="false" class="statistic-card">
    <template #title>
      <div class="card-title">
        <a-tooltip v-if="description">
          <template #title>{{ description }}</template>
          <span class="title-text">{{ title }}</span>
        </a-tooltip>
        <span v-else class="title-text">{{ title }}</span>
        <a-tag
          :color="status === 'success' ? 'success' : 'error'"
          v-if="status"
        >
          {{ status === 'success' ? '正常' : '异常' }}
        </a-tag>
      </div>
    </template>
    <template #extra>
      <slot name="extra" />
    </template>

    <div class="card-content">
      <!-- 基础信息部分 -->
      <div class="basic-info">
        <LabelValue label="VLAN" :value="vlan" />
        <LabelValue label="带宽" :value="bandwidth" unit="Mbps" />
        <LabelValue
          v-if="qualityAnalysisPolicy"
          label="质量分析策略"
          :value="qualityAnalysisPolicy"
          :link="qualityAnalysisPolicy"
        />
      </div>

      <!-- 监控图表部分 -->
      <div v-if="charts && charts.length" class="charts-container">
        <ChartRow
          v-for="(chart, index) in charts"
          :key="index"
          :title="chart.title"
          :data="chart.data"
          :unit="chart.unit"
          :color="chart.color"
          :loading="loading"
        />
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import ChartRow from './ChartRow.vue'
import LabelValue from './LabelValue.vue'
import type { TimeSeriesData } from '@/types/lineMonitor'

export interface ChartConfig {
  title: string
  data: TimeSeriesData[]
  unit?: string
  color?: string | ((value: number) => string)
}

interface Props {
  title: string
  description?: string
  vlan: number
  bandwidth: number
  loading?: boolean
  charts?: ChartConfig[]
  status?: 'success' | 'error'
  qualityAnalysisPolicy?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  charts: () => [],
})
</script>

<style scoped>
.statistic-card {
  border-radius: 8px;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08),
    0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.04);
}

.statistic-card:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08),
    0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.title-text {
  cursor: help;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.charts-container {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 16px;
}

:deep(.ant-card-head) {
  min-height: 48px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.ant-card-body) {
  padding: 24px;
}
</style>
