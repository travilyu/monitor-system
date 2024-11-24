<template>
  <SlideDrawer
    :title="lineData ? '编辑线路' : '新增线路'"
    v-model="isVisible"
    @ok="handleOk"
    @close="handleClose"
  >
    <a-form
      :model="formState"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      layout="vertical"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
      <a-form-item label="VLAN" name="vlan">
        <a-input-number style="width: 100%" v-model:value="formState.vlan" />
      </a-form-item>
      <a-form-item label="带宽(Mbps)" name="bandwidth">
        <a-input-number
          style="width: 100%"
          v-model:value="formState.bandwidth"
        />
      </a-form-item>
    </a-form>
  </SlideDrawer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { LineData } from '@/types/lineMonitor'
import { lineMonitorApi } from '@/api/modules/lineMonitor'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import { message } from 'ant-design-vue'
const props = defineProps<{
  visible: boolean
  lineData: LineData | null
}>()

const emit = defineEmits(['update:visible', 'success'])
const loading = ref(false)
const formRef = ref()
const isVisible = ref(false)

// 只选取表单需要的字段
type FormState = Pick<LineData, 'name' | 'description' | 'vlan' | 'bandwidth'>

const initialFormState: FormState = {
  name: '',
  description: '',
  vlan: 0,
  bandwidth: 0,
}

const formState = ref<FormState>({ ...initialFormState })

watchEffect(() => {
  isVisible.value = props.visible
})

watchEffect(() => {
  formState.value = props.lineData
    ? {
        name: props.lineData.name,
        description: props.lineData.description,
        vlan: props.lineData.vlan,
        bandwidth: props.lineData.bandwidth,
      }
    : { ...initialFormState }
})

watchEffect(() => {
  emit('update:visible', isVisible.value)
})

const handleOk = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    if (props.lineData) {
      // 更新线路
      await lineMonitorApi.updateLine(props.lineData.id, formState.value)
      message.success('更新线路成功')
    } else {
      // 创建新线路，只传递表单字段
      await lineMonitorApi.createLine(formState.value)
      message.success('创建线路成功')
    }

    emit('success')
    isVisible.value = false
  } catch (error) {
    console.error(props.lineData ? '更新线路失败:' : '创建线路失败:', error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  isVisible.value = false
  formState.value = { ...initialFormState }
  formRef.value?.clearValidate()
}

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  vlan: [{ required: true, message: '请输入VLAN', trigger: 'blur' }],
  bandwidth: [{ required: true, message: '请输入带宽', trigger: 'blur' }],
}
</script>
