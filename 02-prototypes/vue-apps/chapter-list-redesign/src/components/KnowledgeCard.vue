<template>
  <div 
    class="knowledge-card"
    :class="{ 'is-locked': isLocked }"
    @click="handleClick"
  >
    <!-- VIP 角标（优先级：badge-lock > NEW > badge-unlocked） -->
    <div v-if="showBadge" class="badge" :class="badgeClass">
      <Crown v-if="isLocked || resource.isTrial" :size="10" />
      <span>{{ badgeText }}</span>
    </div>
    
    <!-- 封面图 -->
    <div class="cover">
      <div class="cover-placeholder">
        <PlayCircle :size="24" />
      </div>
      <!-- 时长标签 (pill style with clock icon) -->
      <span v-if="resource.duration" class="duration-tag">
        <Clock :size="10" />
        {{ resource.duration }}分钟
      </span>
    </div>
    
    <!-- 内容区 -->
    <div class="content">
      <!-- 标题行 (含 NEW 徽标) -->
      <div class="title-row">
        <h3 class="title">{{ resource.title }}</h3>
        <NewBadge
          v-if="showNewBadge"
          :id="resource.id"
          :first-publish-at="resource.firstPublishAt"
          size="resource"
        />
      </div>

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
      
      <!-- 双进度行 (视频 + 习题) -->
      <div class="dual-progress">
        <!-- 视频进度 -->
        <div class="progress-item">
          <span class="progress-label video-label">视频</span>
          <div class="segment-bar">
            <span
              v-for="i in videoTotalSegments"
              :key="'v'+i"
              class="segment"
              :class="{ 'filled': i <= videoFilledSegments, 'video-seg': true }"
            ></span>
          </div>
          <Info :size="12" class="progress-action-icon video-action" />
        </div>
        <!-- 习题进度 -->
        <div v-if="resource.questionCount" class="progress-item">
          <span class="progress-label quiz-label">习题</span>
          <div class="segment-bar">
            <span
              v-for="i in quizTotalSegments"
              :key="'q'+i"
              class="segment"
              :class="{ 'filled': i <= quizFilledSegments, 'quiz-seg': true }"
            ></span>
          </div>
          <CheckCircle2 :size="12" class="progress-action-icon quiz-action" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlayCircle, Crown, Star, Info, CheckCircle2, Clock } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import NewBadge from './NewBadge.vue'
import type { Resource } from '@/types'

const props = defineProps<{
  resource: Resource
}>()

const emit = defineEmits<{
  (e: 'request-learning-mode', resource: Resource): void
  (e: 'request-content-choice', resource: Resource): void
}>()

const store = useChapterStore()

// 是否锁定
const isLocked = computed(() => !props.resource.isFree && !store.isVip)

// 是否为新内容（与 NewBadge 组件逻辑一致）
const isNew = computed(() => {
  if (!props.resource.firstPublishAt) return false
  return store.isNewContent({
    id: props.resource.id,
    firstPublishAt: props.resource.firstPublishAt
  })
})

// 进度信息
const progress = computed(() => store.getProgress(props.resource.id))

// 视频进度百分比
const videoProgressPercent = computed(() => {
  if (!progress.value) return 0
  return progress.value.percentage
})

// Segment-based progress
const videoTotalSegments = computed(() => 10)
const videoFilledSegments = computed(() => {
  return Math.round(videoProgressPercent.value / 10)
})

const quizTotalSegments = computed(() => 10)
const quizFilledSegments = computed(() => {
  return Math.round(quizProgressPercent.value / 10)
})

// 习题进度百分比 (simulate: derive from video progress and question count)
const quizProgressPercent = computed(() => {
  if (!props.resource.questionCount) return 0
  if (!progress.value) return 0
  // Simulated: quiz progress trails video progress slightly
  const videoPercent = progress.value.percentage
  if (videoPercent === 100) return 100
  return Math.max(0, Math.round(videoPercent * 0.6))
})

// 是否显示角标
// 优先级规则：badge-lock > NEW > badge-unlocked
// 当为 badge-unlocked 且内容是 NEW 时，隐藏已解锁角标，让 NEW 展示
const showBadge = computed(() => {
  if (props.resource.isFree) return false
  // badge-unlocked 场景：如果是新内容，NEW 优先展示，隐藏已解锁角标
  const wouldBeUnlocked = !isLocked.value && !props.resource.isTrial
  if (wouldBeUnlocked && isNew.value) return false
  return true
})

// 是否显示 NEW 徽标
// 优先级规则：badge-lock 优先于 NEW，锁定时不显示 NEW
const showNewBadge = computed(() => {
  if (isLocked.value && !props.resource.isTrial) return false
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
  if (isLocked.value) return '会员'
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
  
  // 非复习场景：如果视频有播放进度，弹出内容选择弹窗
  if (videoProgressPercent.value > 0 && videoProgressPercent.value < 100) {
    emit('request-content-choice', props.resource)
    return
  }

  // 无进度或已完成，直接进入学习
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
    background: $error;
    color: $bg-white;
  }
  
  &.badge-unlocked {
    background: $bg-secondary;
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
  width: 120px;
  height: 75px;
  border-radius: $radius-lg;
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
    left: 4px;
    background: rgba(0, 0, 0, 0.6);
    color: $bg-white;
    font-size: 9px;
    padding: 2px 8px;
    border-radius: $radius-pill;
    display: flex;
    align-items: center;
    gap: 3px;
    line-height: 1.4;
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

.title-row {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;

  // 当存在角标时，为标题行右侧留出空间，避免 NEW 徽标与角标重叠
  .knowledge-card:has(.badge) & {
    padding-right: 55px;
  }
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
  flex: 1;
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
    color: #D4D2DC;
    
    &.filled {
      color: $primary;
      fill: $primary;
    }
  }
}

// 双进度区域
.dual-progress {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-top: auto;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.progress-label {
  font-size: $font-size-xxxs;
  font-weight: $font-weight-medium;
  flex-shrink: 0;
  width: 24px;

  &.video-label {
    color: $primary;
  }

  &.quiz-label {
    color: $success;
  }
}

.segment-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
}

.segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: $bg-secondary;
  transition: background $transition-fast;

  &.filled.video-seg {
    background: $primary;
  }

  &.filled.quiz-seg {
    background: $success;
  }
}

.progress-action-icon {
  flex-shrink: 0;

  &.video-action {
    color: $text-tertiary;
  }

  &.quiz-action {
    color: $text-tertiary;
  }
}
</style>


