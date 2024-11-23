import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { api } from '@/api/modules/analysis'
import type { AnalysisItem } from '@/types/analysis'

// 表格列定义
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    searchable: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    searchable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
  },
] as const

// 表格操作定义
const tableOperations = [
  {
    key: 'edit',
    label: '编辑',
    type: 'link',
  },
  {
    key: 'delete',
    label: '删除',
    type: 'link',
    danger: true,
  },
]

export function useAnalysisPage() {
  const formRef = ref()
  const state = reactive({
    loading: false,
    rawTableData: [] as AnalysisItem[],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    search: {
      keyword: '',
    },
    drawer: {
      visible: false,
      title: '',
      initialValues: {} as Partial<AnalysisItem>,
    },
  })

  // 计算过滤后的表格数据
  const tableData = computed(() => {
    const start = (state.pagination.current - 1) * state.pagination.pageSize
    const end = start + state.pagination.pageSize
    return state.rawTableData.slice(start, end)
  })

  // 加载表格数据
  const loadTableData = async () => {
    state.loading = true
    try {
      const data = await api.getList()
      state.rawTableData = data.items
      state.pagination.total = data.total
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      state.loading = false
    }
  }

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    state.pagination.current = pagination.current
    state.pagination.pageSize = pagination.pageSize
  }

  // 处理表格操作
  const handleTableOperation = async (key: string, record: AnalysisItem) => {
    switch (key) {
      case 'edit':
        state.drawer.title = '编辑分析'
        state.drawer.initialValues = { ...record }
        state.drawer.visible = true
        break
      case 'delete':
        try {
          await lineApi.analysis.delete(record.id!)
          message.success('删除成功')
          loadTableData()
        } catch (error) {
          message.error('删除失败')
        }
        break
    }
  }

  // 处理工具栏操作
  const handleToolbarAction = (action: string, ...args: any[]) => {
    switch (action) {
      case 'add':
        state.drawer.title = '新增分析'
        state.drawer.initialValues = {}
        state.drawer.visible = true
        break
      case 'refresh':
        state.search.keyword = ''
        state.pagination.current = 1
        loadTableData()
        break
      case 'search':
        state.search.keyword = args[0]
        state.pagination.current = 1
        break
    }
  }

  // 处理抽屉提交
  const handleDrawerSubmit = async (values: AnalysisItem) => {
    try {
      if (values.id) {
        await lineApi.analysis.update(values.id, values)
        message.success('更新成功')
      } else {
        await lineApi.analysis.create(values)
        message.success('创建成功')
      }
      state.drawer.visible = false
      loadTableData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  return {
    formRef,
    state,
    columns,
    tableData,
    tableOperations,
    loadTableData,
    handleTableChange,
    handleTableOperation,
    handleToolbarAction,
    handleDrawerSubmit,
  }
}
