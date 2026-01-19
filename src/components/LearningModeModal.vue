<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="handleClose" aria-label="关闭">
            <X :size="20" />
          </button>
          
          <!-- 标题 -->
          <div class="modal-header">
            <h2 class="modal-title">选择学习方式</h2>
            <p class="modal-subtitle">复习时建议先做题检测掌握程度，再针对性看视频</p>
          </div>
          
          <!-- 选项区域 -->
          <div class="options">
            <!-- 推荐选项：先做题后看视频 -->
            <button 
              class="option-card recommended"
              :class="{ 'selected': selectedMode === 'quiz-first' }"
              @click="selectMode('quiz-first')"
            >
              <div class="option-icon">
                <ClipboardCheck :size="24" />
              </div>
              <div class="option-content">
                <div class="option-title-row">
                  <span class="option-title">先做题后看视频</span>
                  <span class="recommend-badge">推荐</span>
                </div>
                <p class="option-desc">先检测掌握程度，针对薄弱点看视频</p>
              </div>
              <div class="check-indicator">
                <CheckCircle v-if="selectedMode === 'quiz-first'" :size="20" />
                <Circle v-else :size="20" />
              </div>
            </button>
            
            <!-- 普通选项：先看视频后做题 -->
            <button 
              class="option-card"
              :class="{ 'selected': selectedMode === 'video-first' }"
              @click="selectMode('video-first')"
            >
              <div class="option-icon">
                <PlayCircle :size="24" />
              </div>
              <div class="option-content">
                <span class="option-title">先看视频后做题</span>
                <p class="option-desc">先复习知识点，再做题巩固</p>
              </div>
              <div class="check-indicator">
                <CheckCircle v-if="selectedMode === 'video-first'" :size="20" />
                <Circle v-else :size="20" />
              </div>
            </button>
          </div>
          
          <!-- 底部区域 -->
          <div class="modal-footer">
            <!-- 设置提示 -->
            <p class="settings-hint">
              可在「设置」中修改默认学习方式
            </p>
            
            <!-- 确认按钮 -->
            <button 
              class="confirm-btn"
              :disabled="!selectedMode"
              @click="handleConfirm"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ClipboardCheck, PlayCircle, CheckCircle, Circle } from 'lucide-vue-next'

export type LearningMode = 'quiz-first' | 'video-first'

const props = defineProps<{
  visible: boolean
  resourceTitle?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', mode: LearningMode): void
}>()

// 选中的模式
const selectedMode = ref<LearningMode | null>(null)

// 当弹窗打开时，默认选中推荐选项
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    // 默认推荐选项
    selectedMode.value = 'quiz-first'
  }
})

function selectMode(mode: LearningMode) {
  selectedMode.value = mode
}

function handleClose() {
  emit('close')
}

function handleConfirm() {
  if (!selectedMode.value) return
  
  // 触发确认事件
  emit('confirm', selectedMode.value)
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-xxl;
}

.modal-container {
  background: $bg-white;
  border-radius: $radius-pill;
  width: 100%;
  max-width: 360px;
  padding: $spacing-xxl;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-tertiary;
  border-radius: $radius-md;
  transition: all $transition-fast;
  
  &:hover {
    background: $bg-secondary;
    color: $text-primary;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
  padding-right: $spacing-xxl; // 为关闭按钮留空间
}

.modal-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0 0 $spacing-sm 0;
}

.modal-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  margin-bottom: $spacing-xxl;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: $spacing-lg;
  padding: $spacing-xl;
  border: 2px solid $border-color;
  border-radius: $radius-xl;
  background: $bg-white;
  cursor: pointer;
  transition: all $transition-fast;
  text-align: left;
  
  &:hover:not(.selected) {
    border-color: #D0D0D0;
    background: $bg-secondary;
  }
  
  // 选中状态 - 醒目的橙色边框和背景
  &.selected {
    border-color: $primary;
    background: $primary-light;
    box-shadow: 0 0 0 1px $primary;
  }
  
  // 推荐选项未选中时 - 仅通过标签和图标区分，边框保持灰色
  &.recommended:not(.selected) {
    border-color: $border-color;
    background: $bg-white;
  }
}

.option-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  color: $text-secondary;
  border-radius: $radius-lg;
  flex-shrink: 0;
  transition: all $transition-fast;
  
  // 推荐选项的图标 - 始终保持橙色调
  .option-card.recommended & {
    background: $primary-light;
    color: $primary;
  }
  
  // 选中状态的图标 - 更饱和的颜色
  .option-card.selected & {
    background: $primary;
    color: $bg-white;
  }
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-title-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: 2px;
}

.option-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.recommend-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: $primary;
  color: $bg-white;
  font-size: $font-size-xxxs;
  font-weight: $font-weight-bold;
  border-radius: $radius-pill;
}

.option-desc {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin: 0;
  line-height: 1.4;
}

.check-indicator {
  flex-shrink: 0;
  color: $border-color;
  
  .option-card.selected & {
    color: $primary;
  }
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.settings-hint {
  font-size: $font-size-xs;
  color: $text-tertiary;
  text-align: center;
  margin: 0;
}

.confirm-btn {
  width: 100%;
  padding: $spacing-lg $spacing-xxl;
  background: $primary;
  color: $bg-white;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  border-radius: $radius-xl;
  transition: all $transition-fast;
  
  &:hover:not(:disabled) {
    background: darken($primary, 5%);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    background: $bg-secondary;
    color: $text-tertiary;
    cursor: not-allowed;
  }
}

// 动画
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
  
  .modal-container {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .modal-container {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
