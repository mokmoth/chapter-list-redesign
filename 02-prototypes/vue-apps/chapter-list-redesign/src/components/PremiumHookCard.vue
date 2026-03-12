<template>
  <div 
    class="premium-hook-card"
    @click="handleClick"
  >
    <!-- 封面图（培优课风格：金黄色渐变） -->
    <div class="cover premium-cover">
      <div class="cover-content">
        <PlayCircle :size="24" />
      </div>
      <!-- 时长标签 -->
      <span v-if="resource.duration" class="duration-tag">
        {{ resource.duration }}分钟
      </span>
    </div>
    
    <!-- 内容区 -->
    <div class="content">
      <!-- 标题 -->
      <h3 class="title">{{ resource.title }}</h3>
      
      <!-- 标签行 -->
      <div class="tags-row">
        <!-- 分类标签（培优课风格） -->
        <span class="tag category-tag premium">
          {{ categoryText }}
        </span>
        <!-- 难度星星 -->
        <span class="difficulty">
          <Star 
            v-for="i in 3" 
            :key="i" 
            :size="10"
            :class="{ 'filled': i <= difficultyLevel }"
          />
        </span>
      </div>
      
      <!-- 元信息 -->
      <div class="meta-row">
        <span v-if="resource.questionCount">
          随堂检测 {{ resource.questionCount }}题
        </span>
        <span v-else>
          随堂检测 {{ defaultQuestionCount }}题
        </span>
      </div>
    </div>
    
    <!-- 去加购按钮 -->
    <button class="purchase-btn" @click.stop="handlePurchase">
      <Crown :size="12" />
      <span>去加购</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlayCircle, Star, Crown } from 'lucide-vue-next'
import type { Resource } from '@/types'

const props = defineProps<{
  resource: Resource
}>()

// 分类文字
const categoryText = computed(() => {
  // 根据钩子类型返回对应分类
  switch (props.resource.hookType) {
    case '重难点':
      return '解题课'
    case '拔高':
      return '总结课'
    case '竞赛':
      return '拓展课'
    default:
      return '解题课'
  }
})

// 难度等级（培优课默认 2-3 星）
const difficultyLevel = computed(() => {
  return props.resource.difficulty || 2
})

// 默认题目数量
const defaultQuestionCount = computed(() => {
  return Math.floor(Math.random() * 5) + 6 // 6-10 题
})

function handleClick() {
  console.log('点击培优课卡片:', props.resource.title)
}

function handlePurchase() {
  alert(`跳转到培优课购买页：${props.resource.targetCourse || props.resource.title}`)
}
</script>

<style lang="scss" scoped>
.premium-hook-card {
  display: flex;
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  gap: $spacing-xl;
  box-shadow: $shadow-card;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all $transition-fast;
  position: relative;
  
  &:active {
    transform: scale(0.98);
    background: $bg-secondary;
  }
}

// 培优课封面（金黄色渐变）
.cover {
  width: 100px;
  height: 60px;
  border-radius: $radius-md;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  
  &.premium-cover {
    background: linear-gradient(135deg, #FFD633 0%, #FEA345 100%);
  }
  
  .cover-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .duration-tag {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.5);
    color: $bg-white;
    font-size: 9px;
    padding: 2px 4px;
    border-radius: 2px;
  }
}

// 内容区
.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding-right: 60px; // 为按钮留空间
}

.title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.tag {
  font-size: $font-size-xxxs;
  padding: 2px 6px;
  border-radius: $radius-sm;
  
  &.category-tag.premium {
    // 培优课分类标签：橙色风格
    background: $primary-light;
    color: $primary;
    font-weight: $font-weight-medium;
  }
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 1px;
  
  :deep(svg) {
    color: #D4D2DC;
    
    &.filled {
      color: $primary;
      fill: $primary;
    }
  }
}

.meta-row {
  font-size: $font-size-xxs;
  color: $text-tertiary;
}

// 去加购按钮
.purchase-btn {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: $primary;
  border: none;
  border-radius: $radius-pill;
  font-size: $font-size-xxxs;
  font-weight: $font-weight-medium;
  color: $bg-white;
  cursor: pointer;
  transition: all $transition-fast;
  white-space: nowrap;
  
  &:hover {
    background: darken(#FEA345, 8%);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  :deep(svg) {
    flex-shrink: 0;
  }
}

// 响应式
@include mobile {
  .premium-hook-card {
    padding: $spacing-md;
    gap: $spacing-md;
  }
  
  .cover {
    width: 80px;
    height: 48px;
  }
  
  .content {
    padding-right: 50px;
  }
  
  .purchase-btn {
    padding: 3px 8px;
    font-size: 9px;
    top: $spacing-md;
    right: $spacing-md;
  }
}
</style>
