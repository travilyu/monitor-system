<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    class="side-nav"
  >
    <LogoArea :collapsed="collapsed" />
    <MenuTree :menu-items="MENU_ITEMS" />
  </a-layout-sider>
</template>

<script setup lang="ts">
import LogoArea from './LogoArea.vue'
import MenuTree from './MenuTree.vue'
import { MENU_ITEMS } from '@/config/menu'

defineProps<{
  collapsed: boolean
}>()
</script>

<style scoped>
.side-nav {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
</style>
