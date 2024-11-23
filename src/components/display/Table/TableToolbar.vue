<template>
  <div class="table-toolbar">
    <div class="left">
      <a-space>
        <a-button v-if="showAdd" type="primary" @click="handleAction('add')">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>

        <a-button v-if="showRefresh" @click="handleAction('refresh')">
          <template #icon>
            <ReloadOutlined />
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
        @search="handleSearch"
        style="width: 200px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'

interface Props {
  showAdd?: boolean
  showRefresh?: boolean
  showSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAdd: true,
  showRefresh: true,
  showSearch: true,
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
