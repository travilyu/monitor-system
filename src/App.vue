<template>
  <router-view />
</template>

<script setup lang="ts">
import BaseLayout from './components/layout/BaseLayout.vue'
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.loadUserInfo()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap');

#app {
  width: 100%;
  height: 100vh;
  font-family: 'Roboto Mono', DengXian, 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 设置全局字体 */
* {
  font-family: 'Roboto Mono', 'Microsoft YaHei', sans-serif;
}

/* 修复中文字体显示问题 */
:lang(zh) {
  font-family: 'Microsoft YaHei', 'Roboto Mono', sans-serif;
}
</style>
