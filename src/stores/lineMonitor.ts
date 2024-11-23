import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'

export const useLineMonitorStore = defineStore('lineMonitor', () => {
  const lines = ref<LineData[]>([])
  const loading = ref(false)

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

  const deleteLine = async (id: string) => {
    try {
      await lineMonitorApi.deleteLine(id)
      await fetchLines()
    } catch (error) {
      console.error('删除线路失败:', error)
    }
  }

  const updateLine = async (id: string, data: Partial<LineData>) => {
    try {
      await lineMonitorApi.updateLine(id, data)
      await fetchLines()
    } catch (error) {
      console.error('更新线路失败:', error)
    }
  }

  return {
    lines,
    loading,
    fetchLines,
    deleteLine,
    updateLine,
  }
})
