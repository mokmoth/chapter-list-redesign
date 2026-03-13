<template>
  <Teleport to="body">
    <Transition name="guide">
      <div v-if="visible" class="guide-overlay">
        <!-- 高亮区域（CSS clip-path 模拟，此处用遮罩方案） -->
        <div class="guide-mask" @click.self="handleNext">
          <!-- 步骤说明卡片 -->
          <div class="guide-card" :class="`guide-card--step-${currentStep}`">
            <!-- 步骤指示器 -->
            <div class="step-indicator">
              <span
                v-for="step in totalSteps"
                :key="step"
                class="step-dot"
                :class="{ 'step-dot--active': step === currentStep }"
              ></span>
            </div>

            <!-- 引导内容 -->
            <div class="guide-content">
              <component :is="stepIcon" :size="32" class="guide-icon" />
              <h3 class="guide-title">{{ stepTitle }}</h3>
              <p class="guide-desc">{{ stepDesc }}</p>
            </div>

            <!-- Lottie 手势动画占位 -->
            <div v-if="showGesture" class="gesture-placeholder">
              <MousePointerClick :size="36" class="gesture-icon" />
              <span class="gesture-hint">点击此处试试</span>
            </div>

            <!-- 操作按钮 -->
            <div class="guide-actions">
              <button class="skip-btn" @click="handleSkip">跳过</button>
              <button class="next-btn" @click="handleNext">
                {{ isLastStep ? '开始学习' : '下一步' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import { BookOpen, ListTree, PlayCircle, MousePointerClick } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const store = useChapterStore()

const totalSteps = 3
const currentStep = ref(1)
const showGesture = ref(false)

let gestureTimer: ReturnType<typeof setTimeout> | null = null

const steps = [
  {
    icon: markRaw(BookOpen),
    title: '选择你的教材',
    desc: '先选择你的教材版本，系统会自动加载对应内容'
  },
  {
    icon: markRaw(ListTree),
    title: '选择要学习的章节',
    desc: '在左侧目录中找到你要学习的章节'
  },
  {
    icon: markRaw(PlayCircle),
    title: '点击小节开始学习',
    desc: '点击资源卡片即可开始学习，支持视频、刷题等多种形式'
  }
]

const currentStepData = computed(() => steps[currentStep.value - 1])
const stepIcon = computed(() => currentStepData.value.icon)
const stepTitle = computed(() => currentStepData.value.title)
const stepDesc = computed(() => currentStepData.value.desc)
const isLastStep = computed(() => currentStep.value === totalSteps)

function startGestureTimer() {
  clearGestureTimer()
  showGesture.value = false
  gestureTimer = setTimeout(() => {
    showGesture.value = true
  }, 6000)
}

function clearGestureTimer() {
  if (gestureTimer) {
    clearTimeout(gestureTimer)
    gestureTimer = null
  }
}

function handleNext() {
  if (isLastStep.value) {
    completeGuide()
    return
  }
  currentStep.value += 1
  startGestureTimer()
}

function handleSkip() {
  completeGuide()
}

function completeGuide() {
  clearGestureTimer()
  store.completeGuide()
  emit('complete')
}

onMounted(() => {
  if (props.visible) {
    startGestureTimer()
  }
})

onUnmounted(() => {
  clearGestureTimer()
})
</script>

<style lang="scss" scoped>
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.guide-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl;
}

.guide-card {
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-xxl;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xxl;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $border-color;
  transition: all $transition-fast;

  &--active {
    width: 24px;
    border-radius: 4px;
    background: $primary;
  }
}

.guide-content {
  margin-bottom: $spacing-xxl;
}

.guide-icon {
  color: $primary;
  margin-bottom: $spacing-lg;
}

.guide-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0 0 $spacing-sm 0;
}

.guide-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;
}

.gesture-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xxl;
  animation: gesture-bounce 1.5s ease-in-out infinite;
}

.gesture-icon {
  color: $primary;
}

.gesture-hint {
  font-size: $font-size-xs;
  color: $text-tertiary;
}

@keyframes gesture-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.guide-actions {
  display: flex;
  gap: $spacing-lg;
}

.skip-btn {
  flex: 1;
  padding: $spacing-lg;
  background: $bg-secondary;
  color: $text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: darken($bg-secondary, 3%);
  }
}

.next-btn {
  flex: 2;
  padding: $spacing-lg;
  background: $primary;
  color: $bg-white;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: darken($primary, 5%);
  }

  &:active {
    transform: scale(0.98);
  }
}

// Animation — use :global() because Teleport moves DOM outside scoped tree
:global(.guide-enter-active),
:global(.guide-leave-active) {
  transition: opacity 0.3s ease;
}

:global(.guide-enter-from),
:global(.guide-leave-to) {
  opacity: 0;
}
</style>
