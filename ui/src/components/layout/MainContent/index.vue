<template>
  <a-layout class="main-content">
    <HeaderNav
      :collapsed="collapsed"
      @toggle-collapsed="$emit('toggle-collapsed')"
    />
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import HeaderNav from './HeaderNav.vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-collapsed'): void
}>()
</script>

<style scoped>
.main-content {
  min-height: 100vh;
}

.content {
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
}
</style>
