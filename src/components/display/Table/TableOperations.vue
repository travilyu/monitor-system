<template>
  <a-space>
    <template v-for="op in operations" :key="op.key">
      <a-button
        :type="op.type || 'link'"
        size="small"
        @click="handleOperation(op.key)"
      >
        {{ op.label }}
      </a-button>
    </template>
  </a-space>
</template>

<script setup lang="ts">
interface Operation {
  key: string
  label: string
  type?: 'link' | 'primary' | 'default' | 'danger'
}

interface Props {
  operations: Operation[]
  record: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'operation', key: string, record: any): void
}>()

const handleOperation = (key: string) => {
  emit('operation', key, props.record)
}
</script>
