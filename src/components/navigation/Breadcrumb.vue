<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.title">
      <router-link v-if="item.path && !item.isLast" :to="item.path">
        {{ item.title }}
      </router-link>
      <span v-else>{{ item.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbItems } from '@/config/menu'

const route = useRoute()
const breadcrumbItems = computed(() => getBreadcrumbItems(route.path))
</script>

<style scoped>
.breadcrumb {
  margin-left: 8px;
}
</style>
