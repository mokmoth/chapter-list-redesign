<template>
  <span v-if="isNew" class="new-badge" :class="sizeClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChapterStore } from '@/stores/chapter'

const props = withDefaults(defineProps<{
  /** 资源/节点 ID */
  id: string
  /** 首次发布时间 (ISO8601) */
  firstPublishAt?: string
  /** 显示尺寸：resource（卡片级）、dot（小节/章节级红点） */
  size?: 'resource' | 'dot'
}>(), {
  size: 'resource'
})

const store = useChapterStore()

const isNew = computed(() => {
  if (!props.firstPublishAt) return false
  return store.isNewContent({
    id: props.id,
    firstPublishAt: props.firstPublishAt
  })
})

const label = computed(() => {
  return props.size === 'dot' ? '' : 'NEW'
})

const sizeClass = computed(() => `new-badge--${props.size}`)
</script>

<style lang="scss" scoped>
.new-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--resource {
    padding: 2px 6px;
    background: $error;
    color: $bg-white;
    font-size: 10px;
    font-weight: $font-weight-bold;
    border-radius: $radius-pill;
    line-height: 1;
    letter-spacing: 0.5px;
  }

  &--dot {
    width: 8px;
    height: 8px;
    background: $error;
    border-radius: 50%;
  }
}
</style>
