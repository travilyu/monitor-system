<template>
  <div class="label-value">
    <a-tooltip v-if="label.length > 10" :title="label">
      <div class="label ellipsis">{{ label }}</div>
    </a-tooltip>
    <div v-else class="label">{{ label }}</div>

    <div class="value">
      <template v-if="link">
        <a-tooltip :title="value">
          <router-link :to="link" class="link-value ellipsis">
            {{ value }}
          </router-link>
        </a-tooltip>
      </template>
      <template v-else>
        <a-tooltip v-if="String(value).length > 10" :title="value">
          <span class="ellipsis">{{ value }}</span>
        </a-tooltip>
        <span v-else>{{ value }}</span>
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
  margin-bottom: 8px;
  width: 100%;
}

.label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.5;
}

.value {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
  display: flex;
  align-items: center;
}

.link-value {
  color: #1890ff;
  transition: color 0.3s;
  text-decoration: none;
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

.link-value:hover {
  color: #40a9ff;
}

.unit {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 4px;
  flex-shrink: 0;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* 确保 tooltip 内的文本可以换行 */
:deep(.ant-tooltip-inner) {
  word-wrap: break-word;
  word-break: break-all;
  max-width: 300px;
}
</style>
