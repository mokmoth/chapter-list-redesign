<template>
  <div 
    class="knowledge-card"
    :class="{ 'is-locked': isLocked }"
    @click="handleClick"
  >
    <!-- VIP 角标 -->
    <div v-if="showBadge" class="badge" :class="badgeClass">
      <Crown v-if="isLocked || resource.isTrial" :size="10" />
      <span>{{ badgeText }}</span>
    </div>
    
    <!-- 封面图 -->
    <div class="cover">
      <div class="cover-placeholder">
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
        <!-- 分类标签 -->
        <span v-if="resource.category" class="tag category-tag">
          {{ resource.category }}
        </span>
        <!-- 价值标签 -->
        <span v-if="resource.valueTag" class="tag value-tag">
          {{ resource.valueTag }}
        </span>
        <!-- 难度星星 -->
        <span v-if="resource.difficulty" class="difficulty">
          <Star 
            v-for="i in 3" 
            :key="i" 
            :size="10"
            :class="{ 'filled': i <= resource.difficulty }"
          />
        </span>
      </div>
      
      <!-- 元信息 -->
      <div class="meta-row">
        <span v-if="resource.questionCount" class="practice-info">
          <CheckCircle v-if="isPracticeCompleted" :size="12" class="check-icon completed" />
          <Circle v-else :size="12" class="check-icon incomplete" />
          <span>随堂检测 {{ resource.questionCount }}题</span>
        </span>
      </div>
      
      <!-- 进度条 -->
      <div v-if="progress && progress.percentage > 0" class="progress-row">
        <div class="progress-bar">
          <div class="fill" :style="{ width: `${progress.percentage}%` }"></div>
        </div>
        <span class="progress-text">
          <Play :size="12" />
          <span>{{ progress.percentage }}%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlayCircle, Crown, Star, Play, CheckCircle, Circle } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { Resource } from '@/types'

const props = defineProps<{
  resource: Resource
}>()

const emit = defineEmits<{
  (e: 'request-learning-mode', resource: Resource): void
}>()

const store = useChapterStore()

// 是否锁定
const isLocked = computed(() => !props.resource.isFree && !store.isVip)

// 进度信息
const progress = computed(() => store.getProgress(props.resource.id))

// 判断随堂检测是否完成
// 方案：如果视频进度100%，且存在题目，则认为习题已完成
const isPracticeCompleted = computed(() => {
  if (!props.resource.questionCount) return false
  if (!progress.value) return false
  return progress.value.percentage === 100
})

// 是否显示角标
const showBadge = computed(() => {
  if (props.resource.isFree) return false
  return true
})

// 角标样式类
const badgeClass = computed(() => {
  if (props.resource.isTrial) return 'badge-trial'
  if (isLocked.value) return 'badge-lock'
  return 'badge-unlocked'
})

// 角标文字
const badgeText = computed(() => {
  if (props.resource.isTrial) return '免费试看'
  if (isLocked.value) return 'VIP'
  return '已解锁'
})

function handleClick() {
  if (isLocked.value && !props.resource.isTrial) {
    if (confirm('该内容需要开通 VIP 才能观看，是否立即开通？')) {
      store.unlockVip()
    }
    return
  }
  
  // 复习场景特殊处理：根据设置决定学习方式
  if (store.currentTab === 'review') {
    const reviewMode = store.appSettings.reviewLearningMode
    
    // 如果设置为"每次选择"，显示弹窗
    if (reviewMode === 'ask-every-time') {
      emit('request-learning-mode', props.resource)
      return
    }
    
    // 否则直接按设置的模式进入
    if (reviewMode === 'quiz-first') {
      alert(`进入学习（先做题后看视频）：${props.resource.title}\n\n将先进入随堂检测，完成后再观看视频`)
    } else {
      alert(`进入学习（先看视频后做题）：${props.resource.title}\n\n将先观看视频，完成后再做随堂检测`)
    }
    return
  }
  
  // 非复习场景，直接进入学习
  alert(`进入学习：${props.resource.title}`)
}
</script>

<style lang="scss" scoped>
.knowledge-card {
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
  
  &.is-locked {
    background: $bg-tertiary;
  }
}

// 角标
.badge {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  border-radius: 0 $radius-xl 0 10px;
  font-size: $font-size-xxxs;
  font-weight: $font-weight-bold;
  
  &.badge-lock {
    background: $vip-gradient;
    color: $bg-white;
  }
  
  &.badge-unlocked {
    background: #F0F0F0;
    color: $text-tertiary;
    font-weight: $font-weight-medium;
    opacity: 0.8;
  }
  
  &.badge-trial {
    background: $primary;
    color: $bg-white;
  }
}

// 封面
.cover {
  width: 100px;
  height: 60px;
  border-radius: $radius-md;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: $secondary-bg;
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $secondary;
  }
  
  .duration-tag {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.6);
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
  
  &.category-tag {
    background: $secondary-light;
    color: $secondary;
  }
  
  &.value-tag {
    background: $primary-light;
    color: $primary;
  }
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 1px;
  
  :deep(svg) {
    color: #E0E0E0;
    
    &.filled {
      color: $primary;
      fill: $primary;
    }
  }
}

.meta-row {
  font-size: $font-size-xxs;
  color: $text-tertiary;
  
  .practice-info {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .check-icon {
      flex-shrink: 0;
      
      &.completed {
        color: $success;
      }
      
      &.incomplete {
        color: $text-tertiary;
        opacity: 0.5;
      }
    }
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
    background: $success;
    transition: width $transition-normal ease;
  }
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-xxs;
  color: $text-tertiary;
  flex-shrink: 0;
  
  svg {
    flex-shrink: 0;
    color: $text-tertiary;
  }
}
</style>


