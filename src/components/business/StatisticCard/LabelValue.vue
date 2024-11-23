<template>
  <div class="label-value">
    <div class="label">{{ label }}</div>
    <div class="value">
      <template v-if="link">
        <a :href="link" class="link-value">{{ value }}</a>
      </template>
      <template v-else>
        {{ value }}
      </template>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit?: string
  link?: string
}>()
</script>

<style scoped>
.label-value {
  margin-bottom: 12px;
}

.label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.5;
}

.value {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
}

.link-value {
  color: #1890ff;
  transition: color 0.3s;
  text-decoration: none;
}

.link-value:hover {
  color: #40a9ff;
}

.unit {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
}
</style>
