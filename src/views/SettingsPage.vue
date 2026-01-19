<template>
  <div class="settings-page">
    <!-- 顶部导航栏 -->
    <header class="settings-header">
      <button class="back-btn" @click="handleBack" aria-label="返回">
        <ChevronLeft :size="24" />
      </button>
      <h1 class="header-title">设置</h1>
      <div class="header-spacer"></div>
    </header>
    
    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 复习学习顺序 -->
      <section class="settings-section">
        <h2 class="section-title">复习学习顺序</h2>
        <p class="section-desc">在复习场景下点击知识点卡片时的学习顺序</p>
        
        <div class="option-group">
          <label 
            class="option-item"
            :class="{ 'is-selected': store.appSettings.reviewLearningMode === 'quiz-first' }"
          >
            <input 
              type="radio" 
              name="reviewMode" 
              value="quiz-first"
              :checked="store.appSettings.reviewLearningMode === 'quiz-first'"
              @change="updateSetting('reviewLearningMode', 'quiz-first')"
            />
            <span class="radio-custom"></span>
            <div class="option-content">
              <span class="option-label">先做题后看视频</span>
              <span class="option-hint">推荐：先检测掌握程度，针对薄弱点看视频</span>
            </div>
            <span class="recommend-tag">推荐</span>
          </label>
          
          <label 
            class="option-item"
            :class="{ 'is-selected': store.appSettings.reviewLearningMode === 'video-first' }"
          >
            <input 
              type="radio" 
              name="reviewMode" 
              value="video-first"
              :checked="store.appSettings.reviewLearningMode === 'video-first'"
              @change="updateSetting('reviewLearningMode', 'video-first')"
            />
            <span class="radio-custom"></span>
            <div class="option-content">
              <span class="option-label">先看视频后做题</span>
              <span class="option-hint">先复习知识点，再做题巩固</span>
            </div>
          </label>
          
          <label 
            class="option-item"
            :class="{ 'is-selected': store.appSettings.reviewLearningMode === 'ask-every-time' }"
          >
            <input 
              type="radio" 
              name="reviewMode" 
              value="ask-every-time"
              :checked="store.appSettings.reviewLearningMode === 'ask-every-time'"
              @change="updateSetting('reviewLearningMode', 'ask-every-time')"
            />
            <span class="radio-custom"></span>
            <div class="option-content">
              <span class="option-label">每次选择</span>
              <span class="option-hint">每次点击时弹出选择</span>
            </div>
          </label>
        </div>
      </section>
      
      <!-- 默认场景选择 -->
      <section class="settings-section">
        <h2 class="section-title">默认场景选择</h2>
        <p class="section-desc">进入章节列表页面时默认选中的场景</p>
        
        <div class="option-group">
          <label 
            class="option-item"
            :class="{ 'is-selected': store.appSettings.defaultSceneTab === 'all' }"
          >
            <input 
              type="radio" 
              name="defaultScene" 
              value="all"
              :checked="store.appSettings.defaultSceneTab === 'all'"
              @change="updateSetting('defaultSceneTab', 'all')"
            />
            <span class="radio-custom"></span>
            <div class="option-content">
              <span class="option-label">全部</span>
              <span class="option-hint">每次进入都显示全部资源</span>
            </div>
          </label>
          
          <label 
            class="option-item"
            :class="{ 'is-selected': store.appSettings.defaultSceneTab === 'last-selected' }"
          >
            <input 
              type="radio" 
              name="defaultScene" 
              value="last-selected"
              :checked="store.appSettings.defaultSceneTab === 'last-selected'"
              @change="updateSetting('defaultSceneTab', 'last-selected')"
            />
            <span class="radio-custom"></span>
            <div class="option-content">
              <span class="option-label">上次选择</span>
              <span class="option-hint">记住上次选择的场景</span>
            </div>
          </label>
        </div>
      </section>
      
      <!-- 同步刷题难度 -->
      <section class="settings-section">
        <h2 class="section-title">同步刷题默认难度</h2>
        <p class="section-desc">同步刷题时默认包含的难度级别（可多选）</p>
        
        <div class="option-group checkbox-group">
          <label 
            class="option-item checkbox-item"
            :class="{ 'is-selected': store.appSettings.practiceDifficulties.includes('basic') }"
          >
            <input 
              type="checkbox" 
              value="basic"
              :checked="store.appSettings.practiceDifficulties.includes('basic')"
              @change="toggleDifficulty('basic')"
            />
            <span class="checkbox-custom">
              <Check v-if="store.appSettings.practiceDifficulties.includes('basic')" :size="14" />
            </span>
            <div class="option-content">
              <span class="option-label">基础</span>
              <span class="option-hint">适合打牢基础</span>
            </div>
            <span class="difficulty-indicator basic"></span>
          </label>
          
          <label 
            class="option-item checkbox-item"
            :class="{ 'is-selected': store.appSettings.practiceDifficulties.includes('medium') }"
          >
            <input 
              type="checkbox" 
              value="medium"
              :checked="store.appSettings.practiceDifficulties.includes('medium')"
              @change="toggleDifficulty('medium')"
            />
            <span class="checkbox-custom">
              <Check v-if="store.appSettings.practiceDifficulties.includes('medium')" :size="14" />
            </span>
            <div class="option-content">
              <span class="option-label">中等</span>
              <span class="option-hint">适合巩固提升</span>
            </div>
            <span class="difficulty-indicator medium"></span>
          </label>
          
          <label 
            class="option-item checkbox-item"
            :class="{ 'is-selected': store.appSettings.practiceDifficulties.includes('hard') }"
          >
            <input 
              type="checkbox" 
              value="hard"
              :checked="store.appSettings.practiceDifficulties.includes('hard')"
              @change="toggleDifficulty('hard')"
            />
            <span class="checkbox-custom">
              <Check v-if="store.appSettings.practiceDifficulties.includes('hard')" :size="14" />
            </span>
            <div class="option-content">
              <span class="option-label">困难</span>
              <span class="option-hint">适合挑战拔高</span>
            </div>
            <span class="difficulty-indicator hard"></span>
          </label>
        </div>
      </section>
      
      <!-- 底部提示 -->
      <div class="settings-footer">
        <p class="auto-save-hint">
          <Check :size="14" />
          <span>设置自动保存</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Check } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { AppSettings, DifficultyLevel } from '@/stores/chapter'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const store = useChapterStore()

function handleBack() {
  emit('back')
}

function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
  store.updateAppSettings({ [key]: value })
}

function toggleDifficulty(difficulty: DifficultyLevel) {
  const current = [...store.appSettings.practiceDifficulties]
  const index = current.indexOf(difficulty)
  
  if (index > -1) {
    // 至少保留一个难度
    if (current.length > 1) {
      current.splice(index, 1)
    }
  } else {
    current.push(difficulty)
  }
  
  store.updateAppSettings({ practiceDifficulties: current })
}
</script>

<style lang="scss" scoped>
.settings-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-secondary;
}

.settings-header {
  display: flex;
  align-items: center;
  height: $header-height;
  padding: 0 $spacing-xl;
  background: $bg-white;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: $text-primary;
  border-radius: $radius-md;
  flex-shrink: 0;
  
  &:active {
    background: $bg-secondary;
  }
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0;
}

.header-spacer {
  width: 32px;
  flex-shrink: 0;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-xxl;
}

.settings-section {
  background: $bg-white;
  border-radius: $radius-xl;
  padding: $spacing-xxl;
  margin-bottom: $spacing-xxl;
}

.section-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 $spacing-xs 0;
}

.section-desc {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin: 0 0 $spacing-xl 0;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.option-item {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-lg;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  
  input[type="radio"],
  input[type="checkbox"] {
    display: none;
  }
  
  &:hover {
    border-color: #D0D0D0;
  }
  
  &.is-selected {
    border-color: $primary;
    background: rgba($primary, 0.02);
  }
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid $border-color;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  transition: all $transition-fast;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
    transition: transform $transition-fast;
  }
  
  .option-item.is-selected & {
    border-color: $primary;
    
    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid $border-color;
  border-radius: $radius-sm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  
  .option-item.is-selected & {
    border-color: $primary;
    background: $primary;
    color: $bg-white;
  }
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-label {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 2px;
}

.option-hint {
  display: block;
  font-size: $font-size-xxs;
  color: $text-tertiary;
}

.recommend-tag {
  padding: 2px 8px;
  background: $primary;
  color: $bg-white;
  font-size: $font-size-xxxs;
  font-weight: $font-weight-bold;
  border-radius: $radius-pill;
  flex-shrink: 0;
}

.difficulty-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  
  &.basic {
    background: $success;
  }
  
  &.medium {
    background: $warning;
  }
  
  &.hard {
    background: #EF4444;
  }
}

.settings-footer {
  padding: $spacing-xxl 0;
  text-align: center;
}

.auto-save-hint {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xs;
  color: $success;
  margin: 0;
}
</style>
