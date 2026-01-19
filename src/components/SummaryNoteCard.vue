<template>
  <div class="summary-note-card" @click="handleClick">
    <div class="card-icon">
      <StickyNote :size="24" />
    </div>
    <div class="card-content">
      <div class="card-title">{{ resource.title }}</div>
      <div class="card-meta">
        <span class="note-count">{{ resource.noteCount || 0 }} 条笔记</span>
        <span class="divider">·</span>
        <span class="tag">AI 总结</span>
      </div>
    </div>
    <div class="card-badge">
      <Sparkles :size="14" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { StickyNote, Sparkles } from 'lucide-vue-next'
import type { Resource } from '@/types'

defineProps<{
  resource: Resource
}>()

function handleClick() {
  alert('总结类笔记（原型占位）\nAI 自动生成的知识点总结')
}
</script>

<style lang="scss" scoped>
.summary-note-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg $spacing-xl;
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
  border: 1px solid rgba(#22C55E, 0.2);
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  position: relative;
  
  &:hover {
    border-color: #22C55E;
    box-shadow: 0 4px 12px rgba(#22C55E, 0.15);
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
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
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
  
  .tag {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    background: rgba(#22C55E, 0.1);
    color: #16A34A;
    border-radius: $radius-sm;
    font-weight: $font-weight-medium;
  }
}

.card-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  border-radius: 50%;
  color: $bg-white;
  box-shadow: 0 2px 8px rgba(#F59E0B, 0.4);
}
</style>

