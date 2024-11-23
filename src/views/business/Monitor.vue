<template>
  <div class="monitor-page">
    <BaseTable
      :columns="columns"
      :data-source="tableData"
      :loading="state.loading"
      :pagination="state.pagination"
      :operations="tableOperations"
      @change="handleTableChange"
      @operation="handleTableOperation"
    >
      <template #toolbar>
        <TableToolbar @action="handleToolbarAction" />
      </template>
    </BaseTable>

    <SlideDrawer
      v-model="state.drawer.visible"
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
import BaseTable from '@/components/table/TableWithActions.vue'
import TableToolbar from '@/components/display/Table/TableToolbar.vue'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import ConfigForm from '@/components/modal/ConfigForm.vue'

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

const {
  formRef,
  state,
  columns, // 从 useMonitorPage 中获取列定义
  tableData,
  tableOperations,
  loadTableData,
  handleTableChange,
  handleTableOperation,
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
