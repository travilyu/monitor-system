<template>
  <a-layout class="main-content">
    <HeaderNav
      :collapsed="collapsed"
      @toggle-collapsed="$emit('toggle-collapsed')"
    />
    <a-layout-content class="content-wrapper">
      <div class="scrollable-content">
        <router-view />
      </div>
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  position: relative;
}

.scrollable-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 24px;
  overflow-y: auto;
  background: #f0f2f5;
}
</style>
