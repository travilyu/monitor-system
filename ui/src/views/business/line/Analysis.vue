<template>
  <div class="analysis-container">
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
    />

    <EditAnalysisModal
      v-model="state.drawer.visible"
      :title="state.drawer.title"
      :initial-values="state.drawer.initialValues"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/components/display/Table/BaseTable.vue'
import EditAnalysisModal from './components/EditAnalysisModal.vue'
import { useAnalysisPage } from '@/composables/useAnalysisPage'

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
} = useAnalysisPage()

// 初始化加载数据
loadTableData()
</script>

<style scoped>
.analysis-container {
  padding: 24px;
  background: #f0f2f5;
}
</style>
