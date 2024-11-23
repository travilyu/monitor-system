<template>
  <div class="table-container">
    <div class="table-actions">
      <slot name="actions">
        <a-space>
          <a-button type="primary" @click="$emit('add')">新增</a-button>
          <a-button @click="$emit('refresh')">刷新</a-button>
          <a-input-search
            v-model:value="searchText"
            placeholder="请输入搜索内容"
            @search="$emit('search', searchText)"
          />
        </a-space>
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
          <TableActionButtons
            :record="record"
            @edit="$emit('edit', record)"
            @delete="$emit('delete', record)"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TableActionButtons from './TableActionButtons.vue'

const searchText = ref('')

defineProps<{
  columns: any[]
  dataSource: any[]
  loading?: boolean
  pagination?: any
}>()

defineEmits<{
  (e: 'add'): void
  (e: 'refresh'): void
  (e: 'search', value: string): void
  (e: 'edit', record: any): void
  (e: 'delete', record: any): void
  (e: 'change', pagination: any): void
}>()

const handleTableChange = (pag: any) => {
  emit('change', pag)
}
</script>
