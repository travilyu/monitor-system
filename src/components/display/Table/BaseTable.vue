<template>
  <div class="base-table">
    <TableToolbar v-bind="toolbarProps" @action="handleToolbarAction" />

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

interface Props {
  columns: any[]
  dataSource: any[]
  loading?: boolean
  pagination?: TableProps['pagination']
  toolbarProps?: any
  operations?: Array<{
    key: string
    label: string
    type?: 'link' | 'primary' | 'default' | 'danger'
  }>
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
</style>
