<template>
  <a-space>
    <template v-for="op in operations" :key="op.key">
      <template v-if="op.key === 'edit'">
        <EditOutlined
          class="action-icon"
          style="color: #1890ff"
          @click="handleOperation(op.key)"
        />
      </template>
      <template v-else-if="op.key === 'delete'">
        <a-popconfirm
          title="确定要删除该条记录吗？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleOperation(op.key)"
        >
          <DeleteOutlined class="action-icon" style="color: #ff4d4f" />
        </a-popconfirm>
      </template>
      <template v-else>
        <a-button
          :type="op.type || 'link'"
          size="small"
          @click="handleOperation(op.key)"
        >
          {{ op.label }}
        </a-button>
      </template>
    </template>
  </a-space>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

export interface Operation {
  key: string
  label: string
  type?: 'link' | 'primary' | 'default' | 'danger'
}

interface Props {
  operations?: Operation[]
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
