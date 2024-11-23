<template>
  <a-space :size="size">
    <template v-for="button in buttons" :key="button.key">
      <a-button
        :type="button.type"
        :danger="button.danger"
        :loading="loading && button.key === loadingKey"
        @click="handleClick(button)"
      >
        <template #icon v-if="button.icon">
          <component :is="button.icon" />
        </template>
        {{ button.label }}
      </a-button>
    </template>
  </a-space>
</template>

<script setup lang="ts">
interface Button {
  key: string
  label: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  icon?: any
}

interface Props {
  buttons: Button[]
  loading?: boolean
  loadingKey?: string
  size?: number | 'small' | 'middle' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 'middle',
})

const emit = defineEmits<{
  (e: 'click', key: string): void
}>()

const handleClick = (button: Button) => {
  emit('click', button.key)
}
</script>
