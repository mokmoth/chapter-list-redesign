<template>
  <div class="learning-guide">
    <!-- 指南头部 -->
    <div class="guide-header" @click="toggleExpand">
      <div class="title">
        <Lightbulb :size="16" class="icon" />
        <span>学习方法</span>
      </div>
      <div class="action">
        <span>{{ isExpanded ? '收起' : '展开' }}</span>
        <ChevronDown 
          :size="14" 
          class="chevron"
          :class="{ 'is-expanded': isExpanded }"
        />
      </div>
    </div>
    
    <!-- 指南内容 -->
    <Transition name="expand">
      <div v-if="isExpanded" class="guide-content">
        {{ store.currentGuide }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lightbulb, ChevronDown } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'

const store = useChapterStore()
const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="scss" scoped>
.learning-guide {
  background: $primary-bg;
  border-radius: $radius-lg;
  margin: $spacing-xl $spacing-xxl;
  padding: 0 $spacing-xl;
  overflow: hidden;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg 0;
  cursor: pointer;
  user-select: none;
  
  .title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-weight: $font-weight-medium;
    color: #8C5A00;
    font-size: $font-size-sm;
    
    .icon {
      color: $primary;
    }
  }
  
  .action {
    display: flex;
    align-items: center;
    gap: $spacing-xxs;
    font-size: $font-size-xs;
    color: $text-tertiary;
    
    .chevron {
      transition: transform $transition-normal;
      
      &.is-expanded {
        transform: rotate(180deg);
      }
    }
  }
}

.guide-content {
  padding-bottom: $spacing-xl;
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.5;
}

// 展开/收起动画
.expand-enter-active,
.expand-leave-active {
  transition: all $transition-normal ease;
  max-height: 100px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
}
</style>


