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
          placeholder="请输入名称"
          class="w-full"
        />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入描述"
          :rows="2"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="识别方式"
        name="identifyType"
        :rules="[{ required: true, message: '请选择识别方式' }]"
      >
        <a-radio-group v-model:value="formState.identifyType">
          <a-radio value="IP_TUPLE">IP五元组</a-radio>
          <a-radio value="APPLICATION">应用</a-radio>
        </a-radio-group>
      </a-form-item>

      <template v-if="formState.identifyType === 'APPLICATION'">
        <a-form-item
          label="应用"
          name="applications"
          :rules="[{ required: true, message: '请选择应用' }]"
        >
          <a-select
            v-model:value="formState.applications"
            mode="multiple"
            placeholder="请选择应用"
            :options="applicationOptions"
            class="w-full"
          />
        </a-form-item>
      </template>

      <template v-else>
        <a-form-item
          label="源IP:端口"
          name="sourceIpPort"
          :rules="[
            { required: true, message: '请输入源IP/端口' },
            {
              // 192.168.1.2:8080
              pattern: /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})$/,
              message: '请输入正确的IP:端口格式',
            },
          ]"
        >
          <a-input
            v-model:value="formState.sourceIpPort"
            placeholder="请输入源IP:端口，如：192.168.1.1:8080"
            class="w-full"
          />
        </a-form-item>

        <a-form-item
          label="协议"
          name="protocol"
          :rules="[{ required: true, message: '请选择协议' }]"
        >
          <a-select
            v-model:value="formState.protocol"
            :options="protocolOptions"
            class="w-full"
            :custom-raw-enter="true"
            placeholder="请选择或输入协议"
          />
        </a-form-item>

        <a-form-item
          label="目的IP:端口"
          name="destIpPort"
          :rules="[
            { required: true, message: '请输入目的IP/端口' },
            {
              // 192.168.1.2:80
              pattern: /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})$/,
              message: '请输入正确的IP:端口格式',
            },
          ]"
        >
          <a-input
            v-model:value="formState.destIpPort"
            placeholder="请输入目的IP:端口，如：192.168.1.2:80"
            class="w-full"
          />
        </a-form-item>
      </template>

      <a-form-item
        label="转发带宽(Mbps)"
        name="bandwidth"
        :rules="[
          { required: true, message: '请输入转发带宽' },
          { type: 'number', min: 1, message: '带宽必须大于0' },
        ]"
      >
        <a-input-number
          v-model:value="formState.bandwidth"
          class="w-full"
          :min="1"
        />
      </a-form-item>

      <a-form-item
        label="优先级"
        name="priority"
        :rules="[
          { required: true, message: '请输入优先级' },
          { type: 'number', min: 1, max: 100, message: '优先级范围：1-100' },
        ]"
      >
        <a-input-number
          v-model:value="formState.priority"
          :min="1"
          :max="100"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="绑定线路"
        name="lineUuids"
        :rules="[{ required: true, message: '请选择绑定线路' }]"
      >
        <a-select
          v-model:value="formState.lineUuids"
          mode="multiple"
          placeholder="请选择绑定线路"
          :loading="loadingLines"
          :options="lineOptions"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        label="下一跳"
        name="nextHop"
        :rules="[
          { required: true, message: '请输入下一跳地址' },
          {
            pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
            message: '请输入正确的IP地址格式',
          },
        ]"
      >
        <a-input
          v-model:value="formState.nextHop"
          placeholder="请输入下一跳IP地址"
          class="w-full"
        />
      </a-form-item>
    </a-form>
  </SlideDrawer>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import SlideDrawer from '@/components/modal/SlideDrawer.vue'
import type { SliceFormState, SliceTableItem } from '@/types/slice'
import { lineMonitorApi } from '@/api/modules/lineMonitor'

const props = defineProps<{
  modelValue: boolean
  title: string
  initialValues?: Partial<SliceFormState>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', visible: boolean): void
  (e: 'submit', values: SliceFormState): void
}>()

const formRef = ref<FormInstance>()
const isVisible = ref(false)
const loadingLines = ref(false)
const lineOptions = ref<
  { label: string; value: string; description?: string }[]
>([])

// 预定义的应用选项
const applicationOptions = [
  { label: 'HTTP', value: 'HTTP' },
  { label: 'HTTPS', value: 'HTTPS' },
  { label: 'FTP', value: 'FTP' },
  { label: 'SSH', value: 'SSH' },
  { label: 'DNS', value: 'DNS' },
  { label: 'SMTP', value: 'SMTP' },
  { label: 'POP3', value: 'POP3' },
  { label: 'IMAP', value: 'IMAP' },
]

// 预定义的协议选项
const protocolOptions = [
  { label: 'TCP', value: 'TCP' },
  { label: 'UDP', value: 'UDP' },
  { label: 'ICMP', value: 'ICMP' },
]

const formState = ref<SliceFormState>({
  name: '',
  description: '',
  identifyType: 'IP_TUPLE',
  applications: [],
  sourceIpPort: '',
  protocol: 'TCP',
  destIpPort: '',
  bandwidth: 100,
  priority: 1,
  lineUuids: [],
  nextHop: '',
})

// 加载线路选项
const loadLineOptions = async () => {
  loadingLines.value = true
  try {
    const options = await lineMonitorApi.getLineOptions()
    lineOptions.value = options
  } catch (error) {
    console.error('Failed to load line options:', error)
  } finally {
    loadingLines.value = false
  }
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    isVisible.value = val
  }
)

// 监听 isVisible 变化
watch(
  () => isVisible.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

// 监听初始值变化
watch(
  () => props.initialValues,
  (values) => {
    if (values) {
      formState.value = {
        ...formState.value,
        ...values,
      }
    } else {
      formState.value = {
        name: '',
        description: '',
        identifyType: 'IP_TUPLE',
        applications: [],
        sourceIpPort: '',
        protocol: 'TCP',
        destIpPort: '',
        bandwidth: 100,
        priority: 1,
        lineUuids: [],
        nextHop: '',
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  isVisible.value = false
  formRef.value?.resetFields()
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', formState.value)
    handleClose()
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

onMounted(() => {
  loadLineOptions()
})
</script>
