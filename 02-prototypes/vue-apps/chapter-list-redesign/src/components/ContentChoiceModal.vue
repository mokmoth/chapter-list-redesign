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
            <h2 class="modal-title">选择学习内容</h2>
            <p class="modal-subtitle">{{ resourceTitle }}</p>
          </div>

          <!-- 选项区域 -->
          <div class="options">
            <!-- 继续看视频 -->
            <button class="option-card" @click="handleSelect('video')">
              <div class="option-icon option-icon--video">
                <PlayCircle :size="28" />
              </div>
              <div class="option-content">
                <span class="option-title">继续看视频</span>
                <p class="option-desc">从上次断点继续播放</p>
              </div>
              <ChevronRight :size="18" class="option-arrow" />
            </button>

            <!-- 做补充练习 -->
            <button class="option-card" @click="handleSelect('practice')">
              <div class="option-icon option-icon--practice">
                <FileText :size="28" />
              </div>
              <div class="option-content">
                <span class="option-title">做补充练习</span>
                <p class="option-desc">做该知识点的课后习题</p>
              </div>
              <ChevronRight :size="18" class="option-arrow" />
            </button>

            <!-- 看课堂笔记（仅 isContainNote 时显示） -->
            <button
              v-if="hasNote"
              class="option-card"
              @click="handleSelect('note')"
            >
              <div class="option-icon option-icon--note">
                <BookOpen :size="28" />
              </div>
              <div class="option-content">
                <span class="option-title">看课堂笔记</span>
                <p class="option-desc">查看该知识点的课堂笔记</p>
              </div>
              <ChevronRight :size="18" class="option-arrow" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, PlayCircle, FileText, BookOpen, ChevronRight } from 'lucide-vue-next'

export type ContentChoice = 'video' | 'practice' | 'note'

defineProps<{
  visible: boolean
  resourceTitle: string
  hasNote: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', choice: ContentChoice): void
}>()

function handleClose() {
  emit('close')
}

function handleSelect(choice: ContentChoice) {
  emit('select', choice)
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
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding: 0;

  @media (min-width: 768px) {
    align-items: center;
    padding: $spacing-xxl;
  }
}

.modal-container {
  background: $bg-white;
  border-radius: $radius-xl $radius-xl 0 0;
  width: 100%;
  max-width: 400px;
  padding: $spacing-xxl;
  position: relative;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.15);

  @media (min-width: 768px) {
    border-radius: $radius-xl;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
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
  padding-right: $spacing-xxl;
}

.modal-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin: 0 0 $spacing-xs 0;
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
  gap: $spacing-md;
}

.option-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-xl;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  background: $bg-white;
  cursor: pointer;
  transition: all $transition-fast;
  text-align: left;

  &:hover {
    border-color: $primary;
    background: $primary-light;
  }

  &:active {
    transform: scale(0.98);
  }
}

.option-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  flex-shrink: 0;

  &--video {
    background: rgba($primary, 0.1);
    color: $primary;
  }

  &--practice {
    background: rgba($success, 0.15);
    color: $success;
  }

  &--note {
    background: rgba(#845EFF, 0.1);
    color: #845EFF;
  }
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-title {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-bottom: 2px;
}

.option-desc {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin: 0;
}

.option-arrow {
  flex-shrink: 0;
  color: $text-tertiary;
}

// Animation — use :global() because Teleport moves DOM outside scoped tree
:global(.modal-enter-active),
:global(.modal-leave-active) {
  transition: opacity 0.2s ease;

  .modal-container {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

:global(.modal-enter-from),
:global(.modal-leave-to) {
  opacity: 0;

  .modal-container {
    transform: translateY(20px);
    opacity: 0;

    @media (min-width: 768px) {
      transform: scale(0.95);
    }
  }
}
</style>
