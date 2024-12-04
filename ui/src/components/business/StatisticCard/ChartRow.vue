<template>
  <div class="chart-row">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
      <span
        class="chart-value"
        v-if="latestValue !== null"
        :style="{ color: computedColor }"
      >
        {{ latestValue }}
        <span class="chart-unit" v-if="unit">{{ unit }}</span>
      </span>
    </div>
    <div class="chart-content">
      <ChartWrapper
        :data="data"
        :loading="loading"
        :color="computedColor"
        :unit="unit"
        :format="format"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartWrapper from './ChartWrapper.vue'
import { computed } from 'vue'

interface Props {
  title: string
  data: { timestamp: string; value: number }[]
  unit?: string
  loading?: boolean
  color?: string | ((value: number) => string)
  format?: ((value: number) => string)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  color: '#1890ff', // 默认蓝色
  format: ((value: number) => value.toFixed(2)),
})

const latestValue = computed(() => {
  if (!props.data || props.data.length === 0) return null
  return props.format(props.data[props.data.length - 1].value)
})

const computedColor = computed(() => {
  if (!latestValue.value)
    return typeof props.color === 'string' ? props.color : '#1890ff'
  return typeof props.color === 'function'
    ? props.color(Number(latestValue.value))
    : props.color
})
</script>

<style scoped>
.chart-row {
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chart-title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
}

.chart-value {
  font-size: 12px;
  font-weight: 500;
}

.chart-unit {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
}

.chart-content {
  height: 32px;
}
</style>
