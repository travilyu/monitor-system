<template>
  <div class="chart-wrapper">
    <div v-if="!data.length" class="no-data">
      <span class="no-data-text">暂无数据</span>
    </div>
    <div v-else ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { TinyArea } from '@antv/g2plot'

interface ChartData {
  timestamp: string
  value: number
}

interface Props {
  data: ChartData[]
  loading?: boolean
  color?: string
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  color: '#1890ff',
  unit: '',
})

const chartRef = ref<HTMLElement>()
let plot: TinyArea | null = null

const initChart = () => {
  if (!chartRef.value || !props.data.length) return

  const values = props.data.map((item) => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  plot = new TinyArea(chartRef.value, {
    height: 32,
    autoFit: true,
    data: values,
    smooth: true,
    areaStyle: {
      fill: `l(270) 0:${props.color}  1:${props.color}10`,
    },
    line: {
      color: props.color,
    },
    tooltip: {
      showMarkers: true,
      showCrosshairs: true,
      domStyles: {
        'g2-tooltip': {
          padding: '8px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '4px',
        },
      },
      customContent: (_name, items) => {
        if (!items?.length) return ''
        const index = Number(items[0].title)
        const dataItem = props.data[index]
        const value = dataItem.value.toFixed(2)
        const time = new Date(dataItem.timestamp).toLocaleString()
        return `
          <div>
            <div style="margin-bottom: 4px;font-size: 12px;color: #666">${time}</div>
            <div style="font-weight: 500">${value}${props.unit}</div>
          </div>
        `
      },
    },
  })

  plot.render()
}

watch(
  () => [props.data, props.color],
  () => {
    if (plot) {
      plot.destroy()
    }
    initChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (plot) {
    plot.destroy()
  }
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 4px;
}

.no-data-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
}
</style>
