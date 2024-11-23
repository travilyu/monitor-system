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
      @change="handleTableChange"
      @operation="handleTableOperation"
      @toolbar-action="handleToolbarAction"
    />

    <SlideDrawer
      v-model="state.drawer.visible"
      :title="state.drawer.title"
      @close="handleDrawerClose"
      @ok="handleDrawerOk"
    >
      <a-form
        ref="formRef"
        :model="state.drawer.initialValues"
        layout="vertical"
      >
        <a-form-item
          label="名称"
          name="name"
          :rules="[{ required: true, message: '请输入名称' }]"
        >
          <a-input v-model:value="state.drawer.initialValues.name" />
        </a-form-item>

        <a-form-item
          label="描述"
          name="description"
          :rules="[{ required: true, message: '请输入描述' }]"
        >
          <a-textarea
            v-model:value="state.drawer.initialValues.description"
            :rows="4"
          />
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-select v-model:value="state.drawer.initialValues.status">
            <a-select-option value="active">启用</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </SlideDrawer>
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/components/display/Table/BaseTable.vue'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import { useAnalysisPage } from '@/composables/useAnalysisPage'

const {
  formRef,
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

// 处理抽屉关闭
const handleDrawerClose = () => {
  state.drawer.visible = false
}

// 处理抽屉确认
const handleDrawerOk = async () => {
  try {
    const values = await formRef.value?.validateFields()
    if (values) {
      await handleDrawerSubmit({
        ...state.drawer.initialValues,
        ...values,
      })
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 初始化加载数据
loadTableData()
</script>

<style scoped>
.analysis-container {
  padding: 24px;
  background: #f0f2f5;
}
</style>
