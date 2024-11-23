<template>
  <div class="monitor-container">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12" v-for="line in lines" :key="line.id">
        <StatisticCard
          :title="line.name"
          :description="line.description"
          :vlan="line.vlan"
          :bandwidth="line.bandwidth"
          :loading="loading"
          :status="line.status"
          :charts="getLineCharts(line)"
          :quality-analysis-policy="line.qualityAnalysisPolicy"
        >
          <template #extra>
            <a-space>
              <EditOutlined class="action-icon" @click="handleEdit(line)" />
              <DeleteOutlined
                class="action-icon danger"
                @click="handleDelete(line.id)"
              />
            </a-space>
          </template>
        </StatisticCard>
      </a-col>
    </a-row>

    <EditLineModal
      v-model:visible="editModalVisible"
      :line-data="currentLine"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import StatisticCard from '@/components/business/StatisticCard/index.vue'
import EditLineModal from './components/EditLineModal.vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { ChartConfig } from '@/components/business/StatisticCard/index.vue'

const lines = ref<LineData[]>([])
const loading = ref(false)
const editModalVisible = ref(false)
const currentLine = ref<LineData | null>(null)

// 定义颜色函数
const getPacketLossColor = (value: number) => {
  if (value <= 1) return '#52c41a' // 绿色，表示正常
  if (value <= 3) return '#faad14' // 黄色，表示警告
  return '#ff4d4f' // 红色，表示严重
}

const getLatencyColor = (value: number) => {
  if (value <= 20) return '#52c41a' // 绿色，20ms以下
  if (value <= 50) return '#faad14' // 黄色，20-50ms
  return '#ff4d4f' // 红色，50ms以上
}

const fetchLines = async () => {
  loading.value = true
  try {
    const response = await lineMonitorApi.getLines()
    lines.value = response.data
  } catch (error) {
    console.error('获取线路数据失败:', error)
  } finally {
    loading.value = false
  }
}

// const formatBandwidth = (bps: number) => {
//   return (bps / 1000000).toFixed(2) // 转换为Mbps
// }

const getLineCharts = (line: LineData): ChartConfig[] => {
  return [
    {
      title: '吞吐量',
      data: line.throughputMonitoring,
      unit: 'Mbps',
      color: '#1890ff', // 吞吐量保持固定颜色
    },
    {
      title: '延迟',
      data: line.latencyMonitoring,
      unit: 'ms',
      color: getLatencyColor, // 使用函数动态计算颜色
    },
    {
      title: '丢包率',
      data: line.packetLossMonitoring,
      unit: '%',
      color: getPacketLossColor, // 使用函数动态计算颜色
    },
    {
      title: '抖动',
      data: line.jitterMonitoring,
      unit: 'ms',
      color: (value: number) => (value <= 5 ? '#52c41a' : '#ff4d4f'), // 内联函数也可以
    },
  ]
}

const handleEdit = (line: LineData) => {
  currentLine.value = line
  editModalVisible.value = true
}

const handleDelete = async (id: string) => {
  try {
    await lineMonitorApi.deleteLine(id)
    await fetchLines()
  } catch (error) {
    console.error('删除线路失败:', error)
  }
}

const handleEditSuccess = async () => {
  editModalVisible.value = false
  currentLine.value = null
  await fetchLines()
}

onMounted(fetchLines)
</script>

<style scoped>
.monitor-container {
  padding: 24px;
  min-width: 800px;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}

.action-icon:hover {
  color: #1890ff;
}

.action-icon.danger:hover {
  color: #ff4d4f;
}
</style>
