<template>
  <div class="loading-wrapper">
    <a-spin :spinning="loading" :tip="tip" :size="size" :delay="delay">
      <slot />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  tip?: string
  size?: 'small' | 'default' | 'large'
  delay?: number
}

withDefaults(defineProps<Props>(), {
  tip: '加载中...',
  size: 'default',
  delay: 0,
})
</script>

<style scoped>
.loading-wrapper {
  width: 100%;
  height: 100%;
}
</style>
