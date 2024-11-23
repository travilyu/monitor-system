<template>
  <a-input-search
    v-model:value="searchValue"
    :placeholder="placeholder"
    :loading="loading"
    :enter-button="enterButton"
    @search="handleSearch"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  placeholder?: string
  loading?: boolean
  enterButton?: boolean | string
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索内容',
  loading: false,
  enterButton: true,
  debounce: 300,
})

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'change', value: string): void
}>()

const searchValue = ref('')

let timer: NodeJS.Timeout | null = null

const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (props.debounce) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      emit('change', value)
    }, props.debounce)
  } else {
    emit('change', value)
  }
}

const handleSearch = (value: string) => {
  emit('search', value)
}

watch(
  () => searchValue.value,
  (newVal) => {
    handleChange({ target: { value: newVal } } as unknown as Event)
  }
)
</script>
