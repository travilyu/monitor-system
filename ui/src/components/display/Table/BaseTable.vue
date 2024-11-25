<template>
  <div class="base-table">
    <TableToolbar v-bind="toolbarProps" @action="handleToolbarAction" />

    <a-table
      :columns="mergedColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="scroll"
      class="compact-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <TableOperations
            :record="record"
            :operations="operations"
            @operation="handleOperation"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TableToolbar from './TableToolbar.vue'
import TableOperations from './TableOperations.vue'
import type { TableProps } from 'ant-design-vue'
import type { Operation } from './TableOperations.vue'

interface Props {
  columns: any[]
  dataSource: any[]
  loading?: boolean
  pagination?: TableProps['pagination']
  toolbarProps?: any
  operations?: Operation[]
  scroll?: { x?: number | string }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pagination: () => ({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  }),
})

const emit = defineEmits<{
  (e: 'change', pagination: any): void
  (e: 'operation', key: string, record: any): void
  (e: 'toolbar-action', action: string, ...args: any[]): void
}>()

// 添加操作列
const mergedColumns = computed(() => {
  if (!props.operations?.length) {
    return props.columns
  }

  return [
    ...props.columns,
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 120,
    },
  ]
})

const handleTableChange = (pag: any) => {
  emit('change', pag)
}

const handleOperation = (key: string, record: any) => {
  emit('operation', key, record)
}

const handleToolbarAction = (action: string, ...args: any[]) => {
  emit('toolbar-action', action, ...args)
}
</script>

<style scoped>
.base-table {
  background: #fff;
  padding: 24px;
}

:deep(.compact-table) {
  /* 调整表格行高 */
  .ant-table-thead > tr > th {
    padding: 8px 16px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-table-tbody > tr > td {
    padding: 8px 16px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.65);
  }

  /* 调整表头背景色，使其更柔和 */
  .ant-table-thead > tr > th {
    background: #fafafa;
  }
}
</style>
