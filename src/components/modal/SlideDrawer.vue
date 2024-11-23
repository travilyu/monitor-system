<template>
  <a-drawer
    :open="modelValue"
    :title="title"
    :width="width"
    :placement="placement"
    :class="{ 'centered-drawer': centered }"
    @update:open="updateModel"
    @close="handleClose"
  >
    <div class="drawer-content">
      <slot />
    </div>

    <template #footer v-if="showExtra">
      <div class="drawer-footer">
        <div class="footer-buttons">
          <a-space>
            <a-button @click="handleClose">取消</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
          </a-space>
        </div>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>()

interface Props {
  title?: string
  width?: number | string
  placement?: 'right' | 'left'
  showExtra?: boolean
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: 720,
  placement: 'right',
  showExtra: true,
  centered: true,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'ok'): void
}>()

const updateModel = (value: boolean) => {
  modelValue.value = value
}

const handleClose = () => {
  modelValue.value = false
  emit('close')
}

const handleOk = () => {
  emit('ok')
}
</script>

<style scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}

:deep(.ant-drawer-body) {
  padding: 24px 0;
  height: calc(100% - 110px);
  overflow-y: auto;
}

:deep(.ant-drawer-header) {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-drawer-footer) {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  padding: 16px 24px;
  background: #fff;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
}

.centered-drawer :deep(.ant-form-item) {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.centered-drawer :deep(.ant-form) {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

/* 美化滚动条 */
:deep(.ant-drawer-body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.ant-drawer-body::-webkit-scrollbar-thumb) {
  background: #ccc;
  border-radius: 3px;
}

:deep(.ant-drawer-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
</style>
