<template>
  <div class="logo-area">
    <img :src="logoUrl" alt="Logo" :class="{ collapsed: collapsed }" />
    <h1 v-show="!collapsed" class="logo-title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  collapsed?: boolean
  logoUrl?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
  title: '管理系统',
})
</script>

<style scoped>
.logo-area {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.logo-area img {
  height: 32px;
  width: 32px;
  margin-right: 12px;
  transition: margin 0.3s;
}

.logo-area img.collapsed {
  margin-right: 0;
}

.logo-title {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s;
}
</style>
