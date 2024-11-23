<template>
  <div class="monitor-page">
    <BaseTable
      :columns="columns"
      :data-source="state.tableData"
      :loading="state.loading"
      :pagination="state.pagination"
      @change="handleTableChange"
    >
      <template #toolbar>
        <TableToolbar @action="handleToolbarAction" />
      </template>
    </BaseTable>

    <SlideDrawer
      v-model:visible="state.drawer.visible"
      :title="state.drawer.title"
      @ok="handleDrawerOk"
    >
      <ConfigForm
        ref="formRef"
        :fields="formFields"
        :initial-values="state.drawer.initialValues"
      />
    </SlideDrawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMonitorPage } from '@/composables/useMonitorPage'
import type { TableColumnType } from 'ant-design-vue'

// 表格列定义
const columns: TableColumnType[] = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
  },
]

// 表单字段定义
const formFields = [
  {
    name: 'name',
    label: '名称',
    type: 'input',
    rules: [{ required: true, message: '请输入名称' }],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    props: {
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
      ],
    },
  },
]

// 使用业务逻辑钩子
const {
  state,
  loadTableData,
  handleTableChange,
  handleToolbarAction,
  handleDrawerSubmit,
} = useMonitorPage()

// 抽屉确认
const handleDrawerOk = async () => {
  const values = await formRef.value?.validate()
  if (values) {
    await handleDrawerSubmit(values)
  }
}

// 初始化
onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.monitor-page {
  padding: 24px;
  background: #fff;
}
</style>
