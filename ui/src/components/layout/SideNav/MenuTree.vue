<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    theme="dark"
  >
    <template v-for="item in menuItems" :key="item.key">
      <template v-if="item.children?.length">
        <a-sub-menu :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <template #title>{{ item.label }}</template>
          <a-menu-item
            v-for="child in item.children"
            :key="child.key"
            @click="handleMenuClick(child)"
          >
            <template #icon>
              <component :is="child.icon" />
            </template>
            {{ child.label }}
          </a-menu-item>
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item :key="item.key" @click="handleMenuClick(item)">
          <template #icon>
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MenuItem } from '@/config/menu'
import { DEFAULT_OPEN_KEYS } from '@/config/menu'

interface Props {
  menuItems: MenuItem[]
}

const props = defineProps<Props>()
const router = useRouter()

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>(DEFAULT_OPEN_KEYS)

const handleMenuClick = (item: MenuItem) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>
