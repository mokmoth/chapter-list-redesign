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
      <!-- 标题行 (含 NEW 徽标) -->
      <div class="title-row">
        <span class="type-label">同步刷题</span>
        <h3 class="title">{{ displayTitle }}</h3>
        <NewBadge
          :id="resource.id"
          :first-publish-at="resource.firstPublishAt"
          size="resource"
        />
      </div>
      
      <!-- 难度标签 with segmented underlines -->
      <div class="difficulty-levels">
        <div
          v-for="level in difficultyLevels"
          :key="level"
          class="difficulty-item"
          :class="difficultyPillClass(level)"
        >
          <span class="difficulty-text">{{ level }}</span>
          <div class="difficulty-underline">
            <span class="underline-seg"></span>
            <span class="underline-seg"></span>
            <span class="underline-seg"></span>
          </div>
        </div>
      </div>
      
      <!-- 进度显示 -->
      <div class="progress-display">
        <span class="progress-current">{{ resource.completedCount || 0 }}</span>
        <span class="progress-separator">/</span>
        <span class="progress-total">{{ resource.totalCount || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NewBadge from './NewBadge.vue'
import type { Resource } from '@/types'

const props = defineProps<{
  resource: Resource
}>()

// 显示标题
const displayTitle = computed(() => {
  return props.resource.subsectionTitle || props.resource.title
})

// 难度级别列表
const difficultyLevels = computed(() => {
  if (props.resource.difficultyLevels && props.resource.difficultyLevels.length > 0) {
    return props.resource.difficultyLevels
  }
  return ['简单', '中等', '困难']
})

// 根据难度级别返回样式类
function difficultyPillClass(level: string): string {
  const classMap: Record<string, string> = {
    '简单': 'pill-easy',
    '基础': 'pill-easy',
    '中等': 'pill-medium',
    '困难': 'pill-hard'
  }
  return classMap[level] || 'pill-easy'
}

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

.title-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.type-label {
  display: none;
}

.title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

// 难度标签 with segmented underlines
.difficulty-levels {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xxl;
}

.difficulty-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;

  .difficulty-text {
    font-size: $font-size-xxxs;
    font-weight: $font-weight-medium;
    color: $text-secondary;
  }

  .difficulty-underline {
    display: flex;
    gap: 2px;
  }

  .underline-seg {
    width: 12px;
    height: 3px;
    border-radius: 1.5px;
    background: $bg-secondary;
  }

  &.pill-easy .underline-seg {
    background: $success;
  }

  &.pill-medium .underline-seg {
    background: $primary;
  }

  &.pill-hard .underline-seg {
    background: $error;
  }
}

// 进度显示
.progress-display {
  font-size: $font-size-lg;
  margin-top: auto;

  .progress-current {
    color: $primary;
    font-weight: $font-weight-bold;
  }

  .progress-separator {
    color: $text-tertiary;
    margin: 0 1px;
  }

  .progress-total {
    color: $text-secondary;
    font-weight: $font-weight-medium;
  }
}
</style>


