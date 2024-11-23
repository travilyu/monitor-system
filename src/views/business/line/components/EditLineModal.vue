<template>
  <SlideDrawer
    v-model="isVisible"
    title="编辑线路"
    @ok="handleOk"
    @close="handleClose"
  >
    <a-form :model="formState" :rules="rules" ref="formRef">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
      <a-form-item label="VLAN" name="vlan">
        <a-input-number v-model:value="formState.vlan" />
      </a-form-item>
      <a-form-item label="带宽(Mbps)" name="bandwidth">
        <a-input-number v-model:value="formState.bandwidth" />
      </a-form-item>
    </a-form>
  </SlideDrawer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'

const props = defineProps<{
  visible: boolean
  lineData: LineData | null
}>()

const emit = defineEmits(['update:visible', 'success'])
const loading = ref(false)
const formRef = ref()
const isVisible = ref(false)

const formState = ref({
  name: '',
  description: '',
  vlan: 0,
  bandwidth: 0,
})

// 使用 watchEffect 简化监听逻辑
watchEffect(() => {
  isVisible.value = props.visible
})

watchEffect(() => {
  if (props.lineData) {
    formState.value = { ...props.lineData }
  }
})

// 监听本地 isVisible 的变化来通知父组件
watchEffect(() => {
  emit('update:visible', isVisible.value)
})

const handleOk = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await lineMonitorApi.updateLine(props.lineData!.id, formState.value)
    emit('success')
    isVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  isVisible.value = false
}

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  vlan: [{ required: true, message: '请输入VLAN', trigger: 'blur' }],
  bandwidth: [{ required: true, message: '请输入带宽', trigger: 'blur' }],
}
</script>
