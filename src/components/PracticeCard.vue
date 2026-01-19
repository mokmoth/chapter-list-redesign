<template>
  <div 
    class="practice-card"
    @click="handleClick"
  >
    <!-- 图标区 -->
    <div class="icon-area">
      <div class="icon-bg">
        <!-- 试卷 SVG 图标 -->
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" stroke-width="2"/>
          <line x1="10" y1="10" x2="22" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="10" y1="15" x2="22" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="10" y1="20" x2="18" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="icon-label">同步刷题</span>
    </div>
    
    <!-- 内容区 -->
    <div class="content">
      <!-- 标题 -->
      <h3 class="title">{{ displayTitle }}</h3>
      
      <!-- 难度信息 -->
      <div class="difficulty-row">
        <span class="difficulty-label">包含难度：</span>
        <span class="difficulty-values">{{ difficultyText }}</span>
      </div>
      
      <!-- 进度 -->
      <div class="progress-row">
        <div class="progress-bar">
          <div class="fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
        <span class="progress-text">{{ progressText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Resource } from '@/types'

const props = defineProps<{
  resource: Resource
}>()

// 显示标题
const displayTitle = computed(() => {
  return props.resource.subsectionTitle || props.resource.title
})

// 难度文字
const difficultyText = computed(() => {
  if (props.resource.difficultyLevels && props.resource.difficultyLevels.length > 0) {
    return props.resource.difficultyLevels.join(' ')
  }
  return '基础 中等'
})

// 进度百分比
const progressPercent = computed(() => {
  const completed = props.resource.completedCount || 0
  const total = props.resource.totalCount || 1
  return Math.round((completed / total) * 100)
})

// 进度文字
const progressText = computed(() => {
  const completed = props.resource.completedCount || 0
  const total = props.resource.totalCount || 0
  return `${completed}/${total}题`
})

function handleClick() {
  alert(`进入刷题：${displayTitle.value}`)
}
</script>

<style lang="scss" scoped>
.practice-card {
  display: flex;
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  gap: $spacing-xl;
  box-shadow: $shadow-card;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all $transition-fast;
  
  &:active {
    transform: scale(0.98);
    background: $bg-secondary;
  }
}

// 图标区
.icon-area {
  width: 100px;
  height: 60px;
  background: $secondary-bg;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-xxs;
  flex-shrink: 0;
  color: $secondary;
  
  .icon-bg {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-label {
    font-size: $font-size-xxxs;
    font-weight: $font-weight-medium;
  }
}

// 内容区
.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.difficulty-row {
  font-size: $font-size-xxs;
  color: $text-secondary;
  
  .difficulty-label {
    color: $text-tertiary;
  }
  
  .difficulty-values {
    color: $text-secondary;
  }
}

.progress-row {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: auto;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: $border-color;
  border-radius: 2px;
  overflow: hidden;
  
  .fill {
    height: 100%;
    background: $secondary;
    transition: width $transition-normal ease;
  }
}

.progress-text {
  font-size: $font-size-xxs;
  color: $text-tertiary;
  flex-shrink: 0;
}
</style>


