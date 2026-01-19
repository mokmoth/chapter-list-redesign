<template>
  <div class="guide-card" @click="handleClick">
    <div class="card-icon">
      <FileText :size="24" />
    </div>
    <div class="card-content">
      <div class="card-title">{{ resource.title }}</div>
      <div class="card-meta">
        <span class="page-count">{{ resource.pageCount || 0 }} 页</span>
        <span class="divider">·</span>
        <span class="tag">PDF学案</span>
      </div>
    </div>
    <div class="card-action">
      <Download :size="18" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Download } from 'lucide-vue-next'
import type { Resource } from '@/types'

defineProps<{
  resource: Resource
}>()

function handleClick() {
  alert('学案下载功能（原型占位）\n下载后可在"我的下载"中查看')
}
</script>

<style lang="scss" scoped>
.guide-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg $spacing-xl;
  background: $bg-white;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    border-color: $secondary;
    box-shadow: $shadow-card;
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
  background: linear-gradient(135deg, #E8F4FD 0%, #D1E9FA 100%);
  border-radius: $radius-md;
  color: $secondary;
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
    padding: 2px 6px;
    background: $bg-secondary;
    border-radius: $radius-sm;
  }
}

.card-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  border-radius: 50%;
  color: $text-secondary;
  flex-shrink: 0;
  transition: all $transition-fast;
  
  .guide-card:hover & {
    background: $secondary;
    color: $bg-white;
  }
}
</style>

