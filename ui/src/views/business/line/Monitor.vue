<template>
  <div class="monitor-container">
    <div class="toolbar">
      <div class="left">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <plus-outlined />
            新增线路
          </a-button>
          <a-button @click="handleRefresh">
            <reload-outlined />
            刷新
          </a-button>
        </a-space>
      </div>
      <div class="right">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="请输入关键字搜索"
          style="width: 200px"
          @search="handleSearch"
        />
      </div>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" v-if="filteredLines.length">
        <a-col :xs="24" :lg="12" v-for="line in filteredLines" :key="line.id">
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
                <a-popconfirm
                  title="确定要删除该线路吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(line.id)"
                >
                  <DeleteOutlined class="action-icon danger" />
                </a-popconfirm>
              </a-space>
            </template>
          </StatisticCard>
        </a-col>
      </a-row>

      <a-empty
        v-else
        :description="'无匹配数据'"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      >
        <template #extra>
          <a-button v-if="searchKeyword" @click="clearSearch"
            >清除搜索</a-button
          >
        </template>
      </a-empty>
    </a-spin>

    <EditLineModal
      v-model:visible="editModalVisible"
      :line-data="currentLine"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import StatisticCard from '@/components/business/StatisticCard/index.vue'
import EditLineModal from './components/EditLineModal.vue'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import type { ChartConfig } from '@/components/business/StatisticCard/index.vue'
import { Empty, message } from 'ant-design-vue'

const lines = ref<LineData[]>([])
const loading = ref(false)
const editModalVisible = ref(false)
const currentLine = ref<LineData | null>(null)
const searchKeyword = ref('')

const filteredLines = computed(() => {
  if (!searchKeyword.value) return lines.value

  const keyword = searchKeyword.value.toLowerCase()
  return lines.value.filter(
    (line) =>
      line.name.toLowerCase().includes(keyword) ||
      line.description?.toLowerCase().includes(keyword) ||
      line.vlan?.toString().includes(keyword)
  )
})

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
      data: line.throughputMonitoring || [],
      unit: 'Mbps',
      color: '#1890ff', // 吞吐量保持固定颜色
    },
    {
      title: '延迟',
      data: line.latencyMonitoring || [],
      unit: 'ms',
      color: getLatencyColor, // 使用函数动态计算颜色
    },
    {
      title: '丢包率',
      data: line.packetLossMonitoring || [],
      unit: '%',
      color: getPacketLossColor, // 使用函数动态计算颜色
    },
    {
      title: '抖动',
      data: line.jitterMonitoring || [],
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
    loading.value = true
    await lineMonitorApi.deleteLine(id)
    await fetchLines()
    message.success('删除线路成功')
  } catch (error) {
    console.error('删除线路失败:', error)
    message.error('删除线路失败')
  } finally {
    loading.value = false
  }
}

const handleEditSuccess = async () => {
  editModalVisible.value = false
  currentLine.value = null
  await fetchLines()
}

const handleAdd = () => {
  currentLine.value = null // 清空当前线路数据，表示新增
  editModalVisible.value = true
}

const handleRefresh = () => {
  fetchLines()
}

const handleSearch = (value: string) => {
  searchKeyword.value = value
}

const clearSearch = () => {
  searchKeyword.value = ''
}

onMounted(fetchLines)
</script>

<style scoped>
.monitor-container {
  padding: 24px;
  min-width: 800px;
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
