<template>
  <div class="function-bar">
    <!-- 场景 Tabs（左侧） -->
    <div class="left-group">
      <SceneTabs :embedded="true" />
    </div>
    
    <!-- 快捷入口 (自动靠右) -->
    <div class="quick-actions">
      <!-- 桌面端展示全部 -->
      <button class="action-btn desktop-only" @click="handleMindMapClick">
        <Network :size="18" class="action-icon" />
        <span class="action-label">思维导图</span>
        <span v-if="store.chapterStats.mindMapCount" class="badge">{{ store.chapterStats.mindMapCount }}</span>
      </button>
      
      <button class="action-btn desktop-only" @click="handleErrorBookClick">
        <BookX :size="18" class="action-icon" />
        <span class="action-label">错题本</span>
        <span v-if="store.chapterStats.errorBookCount" class="badge">{{ store.chapterStats.errorBookCount }}</span>
      </button>
      
      <button class="action-btn desktop-only" @click="handleFavoriteClick">
        <Star :size="18" class="action-icon" />
        <span class="action-label">收藏</span>
      </button>
      
      <button class="action-btn desktop-only" @click="handleSettingsClick">
        <Settings :size="18" class="action-icon" />
        <span class="action-label">设置</span>
      </button>
      
      <!-- 移动端更多菜单 -->
      <div class="more-menu-wrapper mobile-only">
        <button class="action-btn menu-toggle-btn" @click="toggleMoreMenu">
          <Menu :size="18" />
        </button>
        
        <!-- 下拉菜单 -->
        <Transition name="dropdown">
          <div v-if="isMoreMenuOpen" class="more-menu">
            <button class="menu-item" @click="handleMindMapClick">
              <Network :size="16" />
              <span>思维导图</span>
              <span v-if="store.chapterStats.mindMapCount" class="menu-badge">{{ store.chapterStats.mindMapCount }}</span>
            </button>
            <button class="menu-item" @click="handleErrorBookClick">
              <BookX :size="16" />
              <span>错题本</span>
              <span v-if="store.chapterStats.errorBookCount" class="menu-badge error">{{ store.chapterStats.errorBookCount }}</span>
            </button>
            <button class="menu-item" @click="handleFavoriteClick">
              <Star :size="16" />
              <span>收藏</span>
            </button>
            <div class="menu-divider"></div>
            <button class="menu-item" @click="handleSettingsClick">
              <Settings :size="16" />
              <span>设置</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
  
  <!-- 点击外部关闭更多菜单 -->
  <div 
    v-if="isMoreMenuOpen" 
    class="menu-overlay"
    @click="closeMoreMenu"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Network, BookX, Star, Menu, Settings } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import SceneTabs from './SceneTabs.vue'

const emit = defineEmits<{
  (e: 'open-settings'): void
}>()

const store = useChapterStore()

// 更多菜单状态
const isMoreMenuOpen = ref(false)

// 更多菜单
function toggleMoreMenu() {
  isMoreMenuOpen.value = !isMoreMenuOpen.value
}

function closeMoreMenu() {
  isMoreMenuOpen.value = false
}

function handleMindMapClick() {
  closeMoreMenu()
  alert(`思维导图（原型占位）\n本章共 ${store.chapterStats.mindMapCount} 个思维导图`)
}

function handleErrorBookClick() {
  closeMoreMenu()
  alert(`错题本（原型占位）\n本章共 ${store.chapterStats.errorBookCount} 道错题`)
}

function handleFavoriteClick() {
  closeMoreMenu()
  alert('收藏功能（原型占位）')
}

function handleSettingsClick() {
  closeMoreMenu()
  emit('open-settings')
}
</script>

<style lang="scss" scoped>
.function-bar {
  display: flex;
  align-items: center;
  justify-content: space-between; // 左右分布
  height: $function-bar-height;
  padding: 0 $spacing-xl;
  border-bottom: 1px solid $bg-secondary;
  background: $bg-white;
}

// 左侧区域
.left-group {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

// 快捷入口
.quick-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  background: transparent;
  border-radius: $radius-md;
  font-size: $font-size-xs;
  color: $text-tertiary;
  cursor: pointer;
  transition: all $transition-fast;
  
  .action-icon {
    color: $text-secondary;
  }
  
  &:hover {
    background: $bg-secondary;
    color: $text-primary;
    
    .action-icon {
      color: $text-primary;
    }
  }
  
  &:active {
    background: darken($bg-secondary, 3%);
  }
  
  .action-label {
    color: $text-secondary;
  }
  
  // 弱化的徽章样式
  .badge {
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    background: $bg-secondary;
    color: $text-tertiary;
    border-radius: $radius-pill;
    font-size: 10px;
    font-weight: $font-weight-medium;
    border: 1px solid $border-color;
  }
}

.menu-toggle-btn {
  background: $text-primary;
  color: $bg-white;
  border-radius: $radius-md;
  padding: $spacing-xs;

  &:hover {
    background: lighten($text-primary, 10%);
    color: $bg-white;

    .action-icon {
      color: $bg-white;
    }
  }
}

// 桌面端显示，移动端隐藏
.desktop-only {
  display: flex;
  
  @include small-mobile {
    display: none;
  }
}

// 移动端显示，桌面端隐藏
.mobile-only {
  display: none;
  
  @include small-mobile {
    display: block;
  }
}

// 更多菜单
.more-menu-wrapper {
  position: relative;
}

.more-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: $bg-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-dropdown;
  padding: $spacing-sm 0;
  z-index: 100;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  width: 100%;
  padding: $spacing-lg $spacing-xxl;
  font-size: $font-size-sm;
  color: $text-primary;
  cursor: pointer;
  transition: background $transition-fast;
  
  &:hover {
    background: $bg-secondary;
  }
  
  .menu-badge {
    margin-left: auto;
    font-size: $font-size-xxs;
    color: $text-tertiary;
    
    &.error {
      color: #FA5A65;
    }
  }
}

.menu-divider {
  height: 1px;
  background: $border-color;
  margin: $spacing-sm 0;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

// 下拉动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
