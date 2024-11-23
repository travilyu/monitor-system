<template>
  <a-layout class="base-layout">
    <SideNav v-model:collapsed="collapsed" />
    <a-layout :style="{ marginLeft: collapsed ? '80px' : '200px' }">
      <MainContent :collapsed="collapsed" @toggle-collapsed="toggleCollapsed" />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideNav from './SideNav/index.vue'
import MainContent from './MainContent/index.vue'

const collapsed = ref(false)

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.base-layout {
  min-height: 100vh;
}

:deep(.ant-layout-sider) {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
</style>
