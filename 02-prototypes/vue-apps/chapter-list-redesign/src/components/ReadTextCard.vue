<template>
  <div class="read-text-card" @click="handleClick">
    <div class="card-icon">
      <BookOpen :size="24" />
    </div>
    <div class="card-content">
      <div class="card-title">{{ resource.title }}</div>
      <div class="card-meta">
        <span class="paragraph-count">{{ resource.paragraphCount || 0 }} 段</span>
        <span class="divider">·</span>
        <span class="time">约 {{ resource.estimatedTime || 5 }} 分钟</span>
      </div>
    </div>
    <div class="card-action">
      <Mic :size="18" />
      <span>开始朗读</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Mic } from 'lucide-vue-next'
import type { Resource } from '@/types'

defineProps<{
  resource: Resource
}>()

function handleClick() {
  alert('读课文功能（原型占位）\nAI 将引导您完成课文朗读练习')
}
</script>

<style lang="scss" scoped>
.read-text-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg $spacing-xl;
  background: linear-gradient(135deg, #FFF1E3 0%, #FFF9E0 100%);
  border: 1px solid rgba($primary, 0.2);
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    border-color: $primary;
    box-shadow: 0 4px 12px rgba($primary, 0.15);
  }
  
  &:active {
    transform: scale(0.99);
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
  border-radius: $radius-md;
  color: $bg-white;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: $spacing-xs;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-xxs;
  color: $text-tertiary;
  
  .divider {
    color: $border-color;
  }
}

.card-action {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  background: $primary;
  color: $bg-white;
  border-radius: $radius-pill;
  font-size: $font-size-xxs;
  font-weight: $font-weight-medium;
  flex-shrink: 0;
  transition: all $transition-fast;
  
  &:hover {
    background: darken($primary, 8%);
  }
}
</style>

