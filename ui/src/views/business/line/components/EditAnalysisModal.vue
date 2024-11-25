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
          { required: true, message: '请输入目的地址' },
          { validator: validateDestIp },
        ]"
      >
        <a-input
          v-model:value="formState.destIp"
          :placeholder="ipTypePlaceholder"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="下一跳地址"
        name="nextHopAddress"
        :rules="[
          { required: true, message: '请输入下一跳地址' },
          {
            pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
            message: '请输入正确的IPv4地址格式',
          },
          { validator: validateIpv4 },
        ]"
      >
        <a-input
          v-model:value="formState.nextHopAddress"
          placeholder="请输入下一跳地址"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="源地址"
        name="sourceIp"
        :rules="[
          {
            pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
            message: '请输入正确的IPv4地址格式',
          },
        ]"
      >
        <a-input
          v-model:value="formState.sourceIp"
          placeholder="请输入源地址（可选）"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="绑定线路"
        name="lineUuid"
        :rules="[{ required: true, message: '请选择绑定线路' }]"
      >
        <a-select
          v-model:value="formState.lineUuid"
          placeholder="请选择绑定线路"
          :loading="loadingLines"
          :options="lineOptions"
          show-search
          allowClear
          :filter-option="filterOption"
          class="w-full"
        >
          <template #option="{ label, value, description }">
            <a-space>
              <span>{{ label }}</span>
              <a-typography-text type="secondary" v-if="description">
                ({{ description }})
              </a-typography-text>
            </a-space>
          </template>
        </a-select>
      </a-form-item>
    </a-form>
  </SlideDrawer>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue/es/form'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import type { AnalysisFormState } from '@/types/analysis'
import { lineMonitorApi } from '@/api/modules/lineMonitor'

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
  lineUuid: undefined,
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

const loadingLines = ref(false)
const lineOptions = ref<
  { label: string; value: string; description?: string }[]
>([])

// 加载线路选项
const loadLineOptions = async () => {
  loadingLines.value = true
  try {
    lineOptions.value = await lineMonitorApi.getLineOptions()
  } catch (error) {
    console.error('加载线路列表失败:', error)
  } finally {
    loadingLines.value = false
  }
}

// 搜索过滤
const filterOption = (input: string, option: any) => {
  return (
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    (option.description || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

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

onMounted(() => {
  loadLineOptions()
})

// IP地址类型对应的提示文本
const ipTypePlaceholder = computed(() => {
  return formState.value.ipType === 'IPv4'
    ? '请输入IPv4地址，如：192.168.1.1'
    : '请输入域名，如：www.example.com'
})

// IP地址验证函数
const validateDestIp = async (_rule: any, value: string) => {
  if (!value) return

  if (formState.value.ipType === 'IPv4') {
    // IPv4地址验证
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipv4Regex.test(value)) {
      throw new Error('请输入正确的IPv4地址格式')
    }
    // 验证每个数字在0-255之间
    const parts = value.split('.')
    for (const part of parts) {
      const num = parseInt(part)
      if (num < 0 || num > 255) {
        throw new Error('IP地址的每个部分必须在0-255之间')
      }
    }
  } else {
    // 域名验证
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
    if (!domainRegex.test(value)) {
      throw new Error('请输入正确的域名格式')
    }
  }
}

// 缓存不同类型的地址值
const savedAddresses = ref({
  IPv4: '',
  domain: '',
})

// 监听IP类型变化，切换地址值
watch(
  () => formState.value.ipType,
  (newType: 'IPv4' | 'domain', oldType: 'IPv4' | 'domain') => {
    if (oldType) {
      // 保存当前值
      savedAddresses.value[oldType] = formState.value.destIp
    }
    // 恢复之前保存的值或清空
    formState.value.destIp = savedAddresses.value[newType] || ''
    // 重置验证状态
    formRef.value?.clearValidate('destIp')
  }
)

// 初始化时保存初始值
watch(
  () => props.initialValues,
  (newVal) => {
    if (newVal?.destIp && newVal?.ipType) {
      savedAddresses.value[newVal.ipType] = newVal.destIp
    }
  },
  { immediate: true }
)

// IPv4 地址验证函数
const validateIpv4 = async (_rule: any, value: string) => {
  if (!value) return

  // 验证每个数字在0-255之间
  const parts = value.split('.')
  for (const part of parts) {
    const num = parseInt(part)
    if (num < 0 || num > 255) {
      throw new Error('IP地址的每个部分必须在0-255之间')
    }
  }
}
</script>
