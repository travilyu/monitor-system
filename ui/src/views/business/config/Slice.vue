<template>
  <div class="slice-container">
    <BaseTable
      :columns="columns"
      :data-source="tableData"
      :loading="state.loading"
      :pagination="state.pagination"
      :operations="tableOperations"
      :toolbar-props="{
        showAdd: true,
        showRefresh: true,
        showSearch: true,
      }"
      :scroll="{ x: 1300 }"
      @change="handleTableChange"
      @operation="handleTableOperation"
      @toolbar-action="handleToolbarAction"
      @search="handleSearch"
    />

    <EditSliceModal
      v-model="state.drawer.visible"
      :title="state.drawer.title"
      :initial-values="state.drawer.initialValues"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/components/display/Table/BaseTable.vue'
import EditSliceModal from './components/EditSliceModal.vue'
import { useSlicePage } from '@/composables/useSlicePage'

const {
  state,
  columns,
  tableData,
  tableOperations,
  loadTableData,
  handleTableChange,
  handleTableOperation,
  handleToolbarAction,
  handleDrawerSubmit,
  handleSearch,
} = useSlicePage()

// 初始化加载数据
loadTableData()
</script>

<style scoped>
.slice-container {
  padding: 24px;
  background: #f0f2f5;
}
</style>
