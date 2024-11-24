<template>
  <div class="table-container">
    <div class="table-toolbar">
      <slot name="toolbar">
        <TableToolbar @action="handleToolbarAction" />
      </slot>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableOperations
            :record="record"
            :operations="defaultOperations"
            @operation="handleOperation"
          />
        </template>
        <slot v-else name="bodyCell" :column="column" :record="record" />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TableToolbar from '@/components/display/Table/TableToolbar.vue'
import TableOperations from '@/components/display/Table/TableOperations.vue'
import type { TableProps } from 'ant-design-vue'

interface Props {
  columns: TableProps['columns']
  dataSource: any[]
  loading?: boolean
  pagination?: TableProps['pagination']
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

const defaultOperations = computed(() => [
  { key: 'edit', label: '编辑', type: 'link' },
  { key: 'delete', label: '删除', type: 'link', danger: true },
])

const emit = defineEmits<{
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'operation', key: string, record: any): void
  (e: 'toolbar-action', action: string, ...args: any[]): void
}>()

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  emit('change', pagination, filters, sorter)
}

const handleOperation = (key: string, record: any) => {
  emit('operation', key, record)
}

const handleToolbarAction = (action: string, ...args: any[]) => {
  emit('toolbar-action', action, ...args)
}
</script>

<style scoped>
.table-container {
  width: 100%;
}

.table-toolbar {
  margin-bottom: 16px;
}
</style>
