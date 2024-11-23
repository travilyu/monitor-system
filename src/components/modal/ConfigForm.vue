<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
  >
    <template v-for="field in fields" :key="field.name">
      <a-form-item
        :name="field.name"
        :label="field.label"
        :rules="field.rules || rules[field.name]"
      >
        <component
          :is="getFieldComponent(field.type)"
          v-model:value="formState[field.name]"
          v-bind="field.props || {}"
        />
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'

interface FormField {
  name: string
  label: string
  type: 'input' | 'select' | 'datePicker' | 'switch' | string
  rules?: any[]
  props?: Record<string, any>
}

interface Props {
  fields: FormField[]
  initialValues?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
})

const formRef = ref<FormInstance>()
const formState = reactive({ ...props.initialValues })
const rules = reactive({})

const getFieldComponent = (type: string) => {
  const componentMap = {
    input: 'a-input',
    select: 'a-select',
    datePicker: 'a-date-picker',
    switch: 'a-switch',
  }
  return componentMap[type as keyof typeof componentMap] || 'a-input'
}

defineExpose({
  formRef,
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  getFieldsValue: () => formState,
})
</script>
