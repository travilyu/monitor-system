<template>
  <SlideDrawer
    v-model="isVisible"
    :title="title"
    @close="handleClose"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" class="w-full">
      <a-form-item
        label="名称"
        name="name"
        :rules="[{ required: true, message: '请输入名称' }]"
      >
        <a-input
          v-model:value="formState.name"
          placeholder="请输入任务名称"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="测试类型"
        name="testType"
        :rules="[{ required: true, message: '请选择测试类型' }]"
      >
        <a-select
          v-model:value="formState.testType"
          placeholder="请选择测试类型"
          class="w-full"
        >
          <a-select-option value="ICMP-ECHO">ICMP-ECHO</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="周期内探测报文"
        name="probeCount"
        :rules="[
          { required: true, message: '请输入周期内探测报文数量' },
          { type: 'number', min: 10, max: 1024, message: '数值范围: 10-1024' },
        ]"
      >
        <a-input-number
          v-model:value="formState.probeCount"
          :min="10"
          :max="1024"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="间隔(ms)"
        name="interval"
        :rules="[
          { required: true, message: '请输入间隔时间' },
          {
            type: 'number',
            min: 100,
            max: 6000,
            message: '数值范围: 100-6000',
          },
        ]"
      >
        <a-input-number
          v-model:value="formState.interval"
          :min="100"
          :max="6000"
          class="w-full"
        />
      </a-form-item>

      <!-- 其他表单项... -->

      <a-form-item
        label="目的IP地址类型"
        name="ipType"
        :rules="[{ required: true, message: '请选择IP地址类型' }]"
      >
        <a-radio-group v-model:value="formState.ipType" class="w-full">
          <a-radio value="IPv4">IPv4</a-radio>
          <a-radio value="domain">域名</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="目的IP"
        name="destIp"
        :rules="[
          { required: true, message: '请输入目的IP' },
          {
            pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
            message: '请输入正确的IPv4地址格式',
          },
        ]"
      >
        <a-input
          v-model:value="formState.destIp"
          placeholder="请输入目的IP地址"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="绑定线路"
        name="lineId"
        :rules="[{ required: true, message: '请选择绑定线路' }]"
      >
        <a-select
          v-model:value="formState.lineId"
          placeholder="请选择绑定线路"
          class="w-full"
        >
          <a-select-option value="5G">5G线路</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </SlideDrawer>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue/es/form'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import type { AnalysisFormState } from '@/types/analysis'

const props = defineProps<{
  title: string
  initialValues?: Partial<AnalysisFormState>
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', values: AnalysisFormState): void
}>()

const formRef = ref<FormInstance>()
const isVisible = ref(false)
const formState = ref<AnalysisFormState>({
  name: '',
  testType: 'ICMP-ECHO',
  probeCount: 60,
  interval: 1000,
  maxRetries: 3,
  timeout: 1,
  jitterThreshold: 20,
  lossThreshold: 5,
  delayThreshold: 2000,
  ipType: 'IPv4',
  destIp: '',
  nextHopAddress: '',
  sourceIp: '',
  lineId: '5G',
})

// 监听 initialValues 变化
watch(
  () => props.initialValues,
  (newVal) => {
    if (newVal) {
      formState.value = {
        ...formState.value,
        ...newVal,
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  isVisible.value = false
  emit('close')
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', formState.value)
    isVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>
