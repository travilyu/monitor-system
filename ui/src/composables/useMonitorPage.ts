import { ref, computed } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import { message } from 'ant-design-vue'

export function useMonitorPage() {
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
    currentLine.value = null
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

  return {
    lines,
    loading,
    editModalVisible,
    currentLine,
    searchKeyword,
    filteredLines,
    fetchLines,
    handleEdit,
    handleDelete,
    handleEditSuccess,
    handleAdd,
    handleRefresh,
    handleSearch,
    clearSearch,
  }
}
