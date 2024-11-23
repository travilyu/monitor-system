<template>
  <div class="config-page">
    <CardList
      :items="configItems"
      :loading="loading"
      @select="handleCardSelect"
    >
      <template #item="{ item }">
        <a-descriptions :title="item.name" :column="1">
          <a-descriptions-item label="状态">
            {{ item.status }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ item.updateTime }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </CardList>

    <SlideDrawer
      v-model:visible="drawerVisible"
      :title="drawerTitle"
      @ok="handleDrawerOk"
    >
      <ConfigForm
        ref="formRef"
        :fields="formFields"
        :initial-values="formInitialValues"
      />
    </SlideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardList from '@/components/display/Card/CardList.vue'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import ConfigForm from '@/components/modal/ConfigForm.vue'

const loading = ref(false)
const configItems = ref([])
const drawerVisible = ref(false)
const drawerTitle = ref('')
const formRef = ref()
const formInitialValues = ref({})

const formFields = [
  {
    name: 'name',
    label: '配置名称',
    type: 'input',
    rules: [{ required: true, message: '请输入配置名称' }],
  },
  {
    name: 'value',
    label: '配置值',
    type: 'input',
    props: {
      type: 'textarea',
      rows: 4,
    },
  },
]

const handleCardSelect = (item: any) => {
  drawerTitle.value = '编辑配置'
  formInitialValues.value = { ...item }
  drawerVisible.value = true
}

const handleDrawerOk = async () => {
  try {
    await formRef.value?.validate()
    const values = formRef.value?.getFieldsValue()
    // TODO: 保存数据
    drawerVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.config-page {
  padding: 24px;
}
</style>
