<template>
  <a-card
    :loading="loading"
    :bordered="bordered"
    :hoverable="hoverable"
    v-bind="$attrs"
  >
    <template #title v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </template>

    <template #extra v-if="$slots.extra">
      <slot name="extra" />
    </template>

    <slot />

    <template #actions v-if="$slots.actions">
      <slot name="actions" />
    </template>
  </a-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  loading?: boolean
  bordered?: boolean
  hoverable?: boolean
}

defineProps<Props>()
</script>
