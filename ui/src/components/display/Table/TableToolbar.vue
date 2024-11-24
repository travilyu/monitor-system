<template>
  <div class="table-toolbar">
    <div class="left">
      <a-space>
        <a-button v-if="showAdd" type="primary" @click="handleAction('add')">
          <template #icon>
            <plus-outlined />
          </template>
          新增
        </a-button>

        <a-button v-if="showRefresh" @click="handleAction('refresh')">
          <template #icon>
            <reload-outlined />
          </template>
          刷新
        </a-button>
      </a-space>
    </div>

    <div class="right">
      <a-input-search
        v-if="showSearch"
        v-model:value="searchText"
        placeholder="请输入搜索内容"
        @input="debouncedSearch"
        style="width: 200px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { debounce } from 'lodash-es'

interface Props {
  showAdd?: boolean
  showRefresh?: boolean
  showSearch?: boolean
  debounceTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  showAdd: true,
  showRefresh: true,
  showSearch: true,
  debounceTime: 300,
})

const emit = defineEmits<{
  (e: 'action', type: string, ...args: any[]): void
}>()

const searchText = ref('')

const handleAction = (type: string) => {
  emit('action', type)
}

const handleSearch = (value: string) => {
  emit('action', 'search', value)
}

const debouncedSearch = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value
  handleSearch(value)
}, props.debounceTime)

// 组件卸载时取消未执行的防抖函数
onUnmounted(() => {
  debouncedSearch.cancel()
})
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
}
</style>
