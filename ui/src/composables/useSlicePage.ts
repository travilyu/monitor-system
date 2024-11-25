import { ref, reactive, h } from 'vue'
import { message, Tag, Space } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'
import { sliceApi } from '@/api/modules/slice'
import type { SliceState, SliceTableItem, SliceFormState } from '@/types/slice'
import type { Operation } from '@/components/display/Table/TableOperations.vue'
import { lineMonitorApi } from '@/api/modules/lineMonitor'

export function useSlicePage() {
  const state = reactive<SliceState>({
    loading: false,
    drawer: {
      visible: false,
      title: '',
      initialValues: undefined,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  })

  const tableData = ref<SliceTableItem[]>([])

  // 缓存线路信息
  const lineMap = ref<Map<string, { name: string; description?: string }>>(
    new Map()
  )

  // 加载线路信息
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

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: '识别方式',
      dataIndex: 'identifyType',
      width: 100,
      customRender: ({ text }: { text: string }) =>
        text === 'IP_TUPLE' ? 'IP五元组' : '应用',
    },
    {
      title: '应用',
      dataIndex: 'applications',
      width: 200,
      customRender: ({ text }: { text: string[] }) => {
        if (!text?.length) return '--'
        return h(
          Space,
          { size: 4, wrap: true },
          {
            default: () =>
              text.map((app) => h(Tag, { key: app }, { default: () => app })),
          }
        )
      },
    },
    {
      title: '源IP/端口',
      dataIndex: 'sourceIpPort',
      width: 150,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      width: 100,
    },
    {
      title: '目的IP/端口',
      dataIndex: 'destIpPort',
      width: 150,
    },
    {
      title: '转发带宽(Mbps)',
      dataIndex: 'bandwidth',
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
    },
    {
      title: '绑定线路',
      dataIndex: 'lineUuids',
      width: 200,
      customRender: ({ text }: { text: string[] }) => {
        if (!text?.length) return '--'
        return h(
          Space,
          { size: 4, wrap: true },
          {
            default: () =>
              text.map((uuid) =>
                h(
                  Tag,
                  { key: uuid },
                  {
                    default: () => lineMap.value.get(uuid)?.name || uuid,
                  }
                )
              ),
          }
        )
      },
    },
    {
      title: '下一跳',
      dataIndex: 'nextHop',
      width: 120,
    },
  ]

  const tableOperations: Operation[] = [
    {
      key: 'edit',
      label: '编辑',
      type: 'link',
    },
    {
      key: 'delete',
      label: '删除',
      type: 'danger',
    },
  ]

  const loadTableData = async () => {
    state.loading = true
    try {
      // 确保线路信息已加载
      if (lineMap.value.size === 0) {
        await loadLineInfo()
      }

      const { items, total } = await sliceApi.getList({
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
    loadTableData()
  }

  const handleTableOperation = async (key: string, record: SliceTableItem) => {
    if (key === 'edit') {
      state.drawer.title = '编辑切片'
      state.drawer.initialValues = record
      state.drawer.visible = true
    } else if (key === 'delete') {
      try {
        await sliceApi.delete(record.uuid)
        message.success('删除成功')
        loadTableData()
      } catch (error) {
        message.error('删除失败')
      }
    }
  }

  const handleToolbarAction = (action: string) => {
    if (action === 'add') {
      state.drawer.title = '新增切片'
      state.drawer.initialValues = undefined
      state.drawer.visible = true
    } else if (action === 'refresh') {
      loadTableData()
    }
  }

  const handleDrawerSubmit = async (values: SliceFormState) => {
    try {
      if (state.drawer.initialValues?.id) {
        await sliceApi.update(state.drawer.initialValues.id, values)
        message.success('更新成功')
      } else {
        await sliceApi.create(values)
        message.success('创建成功')
      }
      state.drawer.visible = false
      loadTableData()
    } catch (error) {
      message.error('操作失败')
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
  }
}
