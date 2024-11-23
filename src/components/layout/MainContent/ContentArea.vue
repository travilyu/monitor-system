<template>
  <div class="content-area">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// ContentArea 主要作为路由视图的容器
</script>

<style scoped>
.content-area {
  padding: 24px;
  background: #fff;
  min-height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
