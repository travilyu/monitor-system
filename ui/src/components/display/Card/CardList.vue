<template>
  <div class="card-list">
    <a-row :gutter="[16, 16]">
      <a-col
        v-for="(item, index) in items"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="6"
      >
        <BaseCard
          :loading="loading"
          :hoverable="true"
          @click="handleCardClick(item)"
        >
          <slot name="item" :item="item">
            {{ item }}
          </slot>
        </BaseCard>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue'

interface Props {
  items: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'select', item: any): void
}>()

const handleCardClick = (item: any) => {
  emit('select', item)
}
</script>

<style scoped>
.card-list {
  width: 100%;
}
</style>
