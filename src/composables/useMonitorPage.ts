import { ref, reactive } from 'vue'
import type { Ref } from 'vue'
import { message } from 'ant-design-vue'
import { monitorApi } from '@/api/modules/monitor'
import type { MonitorItem, MonitorParams } from '@/types/monitor'

export interface MonitorPageState {
  loading: boolean
  tableData: MonitorItem[]
  pagination: {
    total: number
    current: number
    pageSize: number
  }
  drawer: {
    visible: boolean
    title: string
    initialValues: Partial<MonitorItem>
  }
}

export function useMonitorPage() {
  // 状态定义
  const state = reactive<MonitorPageState>({
    loading: false,
    tableData: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    drawer: {
      visible: false,
      title: '',
      initialValues: {},
    },
  })

  // 表单引用
  const formRef: Ref<any> = ref(null)

  // 数据加载
  const loadTableData = async (params: MonitorParams = {}) => {
    state.loading = true
    try {
      const { items, total } = await monitorApi.getList({
        page: state.pagination.current,
        pageSize: state.pagination.pageSize,
        ...params,
      })
      state.tableData = items
      state.pagination.total = total
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      state.loading = false
    }
  }

  // 表格操作
  const handleTableChange = async (pag: any) => {
    state.pagination.current = pag.current
    state.pagination.pageSize = pag.pageSize
    await loadTableData()
  }

  // 工具栏操作
  const handleToolbarAction = async (action: string, value?: any) => {
    switch (action) {
      case 'add':
        state.drawer = {
          visible: true,
          title: '新增监控',
          initialValues: {},
        }
        break
      case 'refresh':
        await loadTableData()
        break
      case 'search':
        state.pagination.current = 1
        await loadTableData({ keyword: value })
        break
    }
  }

  // 抽屉表单操作
  const handleDrawerSubmit = async (values: MonitorItem) => {
    state.loading = true
    try {
      if (values.id) {
        await monitorApi.update(values.id, values)
      } else {
        await monitorApi.create(values)
      }
      message.success('保存成功')
      state.drawer.visible = false
      await loadTableData()
    } catch (error) {
      message.error('保存失败')
    } finally {
      state.loading = false
    }
  }

  return {
    state,
    formRef,
    loadTableData,
    handleTableChange,
    handleToolbarAction,
    handleDrawerSubmit,
  }
}
