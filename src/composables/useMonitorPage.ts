import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { monitorApi } from '@/api/modules/monitor'
import type { MonitorItem } from '@/types/monitor'

// 表格列定义
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    searchable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    searchable: true,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
  },
] as const

// 从列定义中获取可搜索字段
const searchableFields = columns
  .filter((col) => col.searchable)
  .map((col) => col.dataIndex)

// 默认搜索匹配函数
const defaultSearchMatcher = (item: MonitorItem, keyword: string): boolean => {
  if (!keyword) return true
  const searchText = keyword.toLowerCase()

  return searchableFields.some((field) => {
    const value = item[field as keyof MonitorItem]
    return value && String(value).toLowerCase().includes(searchText)
  })
}

export function useMonitorPage(searchMatcher = defaultSearchMatcher) {
  const formRef = ref()
  const state = reactive({
    loading: false,
    rawTableData: [] as MonitorItem[],
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
      initialValues: {} as Partial<MonitorItem>,
    },
  })

  // 计算过滤后的表格数据
  const tableData = computed(() => {
    const filteredData = state.rawTableData.filter((item) =>
      searchMatcher(item, state.search.keyword)
    )

    state.pagination.total = filteredData.length
    const start = (state.pagination.current - 1) * state.pagination.pageSize
    const end = start + state.pagination.pageSize
    return filteredData.slice(start, end)
  })

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

  // 加载表格数据
  const loadTableData = async () => {
    state.loading = true
    try {
      const { items, total } = await monitorApi.getList({
        page: 1,
        pageSize: 1000, // 获取所有数据进行前端分页
      })
      state.rawTableData = items
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
  const handleTableOperation = async (key: string, record: MonitorItem) => {
    switch (key) {
      case 'edit':
        state.drawer.title = '编辑监控项'
        state.drawer.initialValues = { ...record }
        state.drawer.visible = true
        break
      case 'delete':
        try {
          if (record.id) {
            await monitorApi.delete(record.id)
            message.success('删除成功')
            loadTableData()
          }
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
        state.drawer.title = '新增监控项'
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
  const handleDrawerSubmit = async (values: MonitorItem) => {
    try {
      if (values.id) {
        await monitorApi.update(values.id, values)
        message.success('更新成功')
      } else {
        await monitorApi.create(values)
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
    columns, // 导出列定义
    tableData,
    tableOperations,
    loadTableData,
    handleTableChange,
    handleTableOperation,
    handleToolbarAction,
    handleDrawerSubmit,
  }
}
