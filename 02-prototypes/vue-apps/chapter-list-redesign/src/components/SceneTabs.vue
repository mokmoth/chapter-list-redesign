<template>
  <div class="scene-tabs" :class="{ 'is-embedded': embedded }">
    <!-- 全部资源 Tab (固定在最左侧) -->
    <button
      class="tab-item all-resources-tab fixed-tab"
      :class="{ 'active': store.isAllResourcesOpen }"
      @click="handleAllResourcesClick"
    >
      <LayoutGrid :size="16" class="tab-icon" />
      <span class="tab-label">全部</span>
    </button>

    <!-- 分隔线 (固定) -->
    <div class="vertical-divider"></div>

    <!-- 滚动区域：场景 Tab -->
    <div class="scroll-wrapper">
      <div class="scroll-container">
        <button
          v-for="tab in store.sceneTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ 'active': store.currentTab === tab.key && !store.isAllResourcesOpen }"
          @click="handleTabClick(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="!embedded && store.currentTab === tab.key && !store.isAllResourcesOpen" class="indicator"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutGrid } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { SceneType } from '@/types'

defineProps<{
  embedded?: boolean
}>()

const store = useChapterStore()

function handleTabClick(tab: SceneType) {
  store.switchTab(tab)
}

function handleAllResourcesClick() {
  store.toggleAllResources(true)
}
</script>

<style lang="scss" scoped>
.scene-tabs {
  display: inline-flex; // 改为 inline-flex 以便在父容器中居中
  align-items: center;
  background: $bg-white;
  overflow: hidden; 
  max-width: 100%; // 防止溢出
  
  // 滚动包装器
  .scroll-wrapper {
    flex: 0 1 auto; // 允许收缩，但不强制撑开
    overflow: hidden;
    min-width: 0;
  }

  // 滚动容器
  .scroll-container {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  // 默认模式（非嵌入）
  &:not(.is-embedded) {
    border-bottom: 1px solid $border-color;
    padding: 0 $spacing-xxl;
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%; // 默认模式下可能需要撑满
    display: flex; // 恢复 flex
  }
  
  // 嵌入模式
  &.is-embedded {
    background: transparent;
    padding: 0;
    
    .scroll-container {
      padding: 0 $spacing-xs;
      
      // 空间不足时减少间距
      @include small-mobile {
        padding: 0 2px;
        gap: 2px;
      }
    }
    
    .tab-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: $spacing-sm $spacing-xl;
      font-size: $font-size-md;
      color: $text-secondary;
      border-radius: $radius-pill;
      white-space: nowrap;
      transition: all $transition-fast;
      flex-shrink: 0;
      
      @include tiny-mobile {
        padding: $spacing-sm $spacing-lg;
        font-size: $font-size-sm;
      }
      
      // 空间不足时进一步压缩 padding
      @include small-mobile {
        padding: 4px 8px;
        font-size: 13px;
        gap: 4px;
      }
      
      &.active {
        background: transparent;
        color: $primary;
        font-weight: $font-weight-bold;
      }

      &:not(.active):hover {
        background: $bg-secondary;
      }

      .tab-icon {
        flex-shrink: 0;
      }
    }

    // 固定 Tab 样式
    .fixed-tab {
      margin-left: $spacing-xs;

      @include small-mobile {
        margin-left: 2px;
      }

      // 特殊样式：全部资源 Tab - outline pill when active
      &.all-resources-tab {
        font-weight: $font-weight-medium;
        border: 1.5px solid transparent;
        border-radius: $radius-pill;

        &.active {
          background: transparent;
          border-color: $text-primary;
          color: $text-primary;
          font-weight: $font-weight-bold;
        }
      }
    }
  }
}

.vertical-divider {
  width: 1px;
  height: 16px;
  background: $border-color;
  margin: 0 $spacing-xs;
  flex-shrink: 0;
  
  @include small-mobile {
    margin: 0 4px;
  }
}

.tab-label {
  display: block;
}
</style>
