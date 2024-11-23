<template>
  <a-drawer
    v-model:visible="visible"
    :title="title"
    :width="width"
    :placement="placement"
    @close="handleClose"
  >
    <template #extra v-if="showExtra">
      <a-space>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" @click="handleOk"> 确定 </a-button>
      </a-space>
    </template>

    <slot />
  </a-drawer>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  width?: number | string
  placement?: 'right' | 'left'
  showExtra?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: 720,
  placement: 'right',
  showExtra: true,
})

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'close'): void
  (e: 'ok'): void
}>()

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleOk = () => {
  emit('ok')
}
</script>
