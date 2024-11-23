<template>
  <a-layout-header class="header-nav">
    <div class="header-left">
      <a-button
        class="trigger-btn"
        type="text"
        @click="$emit('toggle-collapsed')"
      >
        <MenuFoldOutlined v-if="collapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>
      <Breadcrumb />
    </div>
    <div class="header-right">
      <UserInfo />
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'
import UserInfo from '@/components/navigation/UserInfo.vue'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-collapsed'): void
}>()
</script>

<style scoped>
.header-nav {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger-btn {
  padding: 0 24px;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.header-right {
  padding-right: 24px;
}
</style>
