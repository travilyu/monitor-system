import { ref, reactive, h } from 'vue'
import { message, Tag } from 'ant-design-vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'
import { analysisApi } from '@/api/modules/analysis'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import type {
  AnalysisTableItem,
  AnalysisFormState,
  AnalysisState,
} from '@/types/analysis'

export function useAnalysisPage() {
  const state = reactive<AnalysisState>({
    loading: false,
    drawer: {
      visible: false,
      title: '',
      initialValues: {},
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  })

  const lineMap = ref<Map<string, { name: string; description?: string }>>(
    new Map()
  )

  const loadLineInfo = async () => {
    try {
      const options = await lineMonitorApi.getLineOptions()
      options.forEach((option) => {
        lineMap.value.set(option.value, {
          name: option.label,
          description: option.description,
        })
      })
    } catch (error) {
      console.error('加载线路信息失败:', error)
    }
  }

  const columns: ColumnType[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
    },
    {
      title: '测试类型',
      dataIndex: 'testType',
      key: 'testType',
      width: 120,
    },
    {
      title: '探测报文数',
      dataIndex: 'probeCount',
      key: 'probeCount',
      width: 100,
    },
    {
      title: '间隔(ms)',
      dataIndex: 'interval',
      key: 'interval',
      width: 100,
    },
    {
      title: '重试次数',
      dataIndex: 'maxRetries',
      key: 'maxRetries',
      width: 100,
    },
    {
      title: '超时时间(s)',
      dataIndex: 'timeout',
      key: 'timeout',
      width: 100,
    },
    {
      title: '目标地址',
      dataIndex: 'destIp',
      key: 'destIp',
      width: 140,
    },
    {
      title: '下一跳地址',
      dataIndex: 'nextHopAddress',
      key: 'nextHopAddress',
      width: 140,
      customRender: ({ text }: { text: string }) => text || '--',
    },
    {
      title: '源地址',
      dataIndex: 'sourceIp',
      key: 'sourceIp',
      width: 140,
      customRender: ({ text }: { text: string }) => text || '--',
    },
    {
      title: '绑定线路',
      dataIndex: 'lineUuid',
      key: 'lineUuid',
      width: 120,
      customRender: ({ text }: { text: string }) => {
        if (!text) return '--'
        const lineInfo = lineMap.value.get(text)
        return lineInfo ? lineInfo.name : '--'
      },
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      customRender: ({ text }: { text: string }) => {
        return text ? new Date(text).toLocaleString() : '-'
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      customRender: ({ text }: { text: 'active' | 'inactive' }) => {
        const status: Record<
          'active' | 'inactive',
          { text: string; status: 'success' | 'error' }
        > = {
          active: { text: '运行中', status: 'success' },
          inactive: { text: '已停止', status: 'error' },
        }
        const statusInfo = status[text] || { text, status: 'default' }
        return h(Tag, { color: statusInfo.status }, () => statusInfo.text)
      },
    },
  ]

  const tableData = ref<AnalysisTableItem[]>([])

  const tableOperations: {
    key: string
    label: string
    type?: 'link' | 'primary' | 'default' | 'danger'
  }[] = [
    {
      key: 'edit',
      label: '编辑',
      type: 'link',
    },
    {
      key: 'delete',
      label: '删除',
      type: 'link',
    },
  ]

  const loadTableData = async () => {
    state.loading = true
    try {
      if (lineMap.value.size === 0) {
        await loadLineInfo()
      }

      const { items, total } = await analysisApi.getList({
        page: state.pagination.current,
        pageSize: state.pagination.pageSize,
      })
      tableData.value = items
      state.pagination.total = total
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      state.loading = false
    }
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    state.pagination.current = pagination.current || 1
    state.pagination.pageSize = pagination.pageSize || 10
    loadTableData()
  }

  const handleTableOperation = async (
    key: string,
    record: AnalysisTableItem
  ) => {
    if (key === 'edit') {
      state.drawer.title = '编辑分析'
      state.drawer.initialValues = record
      state.drawer.visible = true
    } else if (key === 'delete') {
      try {
        await analysisApi.delete(record.id)
        message.success('删除成功')
        loadTableData()
      } catch {
        message.error('删除失败')
      }
    }
  }

  const handleToolbarAction = (action: string) => {
    if (action === 'add') {
      state.drawer.title = '新建分析'
      state.drawer.initialValues = {}
      state.drawer.visible = true
    } else if (action === 'refresh') {
      loadTableData()
    }
  }

  const handleDrawerSubmit = async (values: AnalysisFormState) => {
    try {
      if (state.drawer.initialValues.id) {
        await analysisApi.update(state.drawer.initialValues.id, values)
      } else {
        await analysisApi.create(values)
      }
      message.success('保存成功')
      state.drawer.visible = false
      loadTableData()
    } catch {
      message.error('保存失败')
    }
  }

  return {
    state,
    columns,
    tableData,
    tableOperations,
    loadTableData,
    handleTableChange,
    handleTableOperation,
    handleToolbarAction,
    handleDrawerSubmit,
    scroll: { x: 1500 },
  }
}
