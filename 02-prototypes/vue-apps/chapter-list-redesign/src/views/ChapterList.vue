<template>
  <div class="page-container">
    <!-- 设置页面 -->
    <SettingsPage 
      v-if="currentView === 'settings'" 
      @back="closeSettings"
    />
    
    <!-- 章节列表主页面 -->
    <template v-else>
      <!-- 加载状态 -->
      <div v-if="store.loading" class="loading-state">
        <div class="spinner"></div>
        <span>正在加载...</span>
      </div>

      <!-- 主内容 -->
      <template v-else>
        <!-- 顶部区域 -->
        <div class="top-area">
          <!-- 全局头部（返回 + 学段学科 + 升级） -->
          <GlobalHeader />
          
          <!-- 功能栏（场景 Tabs + 快捷入口） -->
          <FunctionBar @open-settings="openSettings" />
        </div>

      <!-- 主布局区域 -->
      <div class="main-layout">
        <!-- 移动端拉手按钮 -->
        <button 
          class="mobile-toggle"
          @click="toggleSidebar"
          aria-label="切换目录"
        >
          <ChevronRight :size="16" />
        </button>

        <!-- 遮罩层 -->
        <div 
          v-if="isSidebarOpen" 
          class="sidebar-overlay"
          @click="closeSidebar"
        ></div>

        <!-- 侧边栏 -->
        <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
          <!-- 章节标题 -->
          <div class="sidebar-chapter-header">
            <span class="title">{{ store.currentChapterTitle }}</span>
            <button class="switch-btn" @click="handleSwitchTextbook">
              <RefreshCw :size="12" />
              <span>切换</span>
            </button>
          </div>
          
          <!-- 章节目录树 -->
          <div class="sidebar-tree-container">
            <ChapterTree 
              :chapters="store.chapters" 
              @node-click="handleTreeNodeClick"
            />
          </div>
          
          <!-- 背单词入口（仅英语学科） -->
          <div v-if="store.isEnglish" class="vocab-entry">
            <button class="vocab-btn" @click="handleVocabClick">
              <div class="vocab-icon">
                <BookA :size="18" />
              </div>
              <div class="vocab-content">
                <span class="vocab-title">背单词</span>
                <span class="vocab-meta">{{ store.chapterStats.vocabWordCount || 0 }} 词</span>
              </div>
              <ChevronRight :size="16" class="vocab-arrow" />
            </button>
          </div>
        </aside>

        <!-- 内容区域 -->
        <main class="content-area">
          <ResourceList 
            ref="resourceListRef"
            :mode="store.isAllResourcesOpen ? 'all' : 'scene'"
            @scroll-to-node="handleScrollToNode"
          />
        </main>
      </div>
      <!-- 新手引导 -->
      <FirstTimeGuide
        :visible="store.isFirstVisit"
        @complete="handleGuideComplete"
      />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { ChevronRight, RefreshCw, BookA } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import GlobalHeader from '@/components/GlobalHeader.vue'
import FunctionBar from '@/components/FunctionBar.vue'
import ChapterTree from '@/components/ChapterTree.vue'
import ResourceList from '@/components/ResourceList.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import FirstTimeGuide from '@/components/FirstTimeGuide.vue'

const store = useChapterStore()

// 当前视图状态
const currentView = ref<'list' | 'settings'>('list')

// 侧边栏状态（仅移动端有效）
const isSidebarOpen = ref(false)
const resourceListRef = ref<InstanceType<typeof ResourceList> | null>(null)

// 打开设置页面
function openSettings() {
  currentView.value = 'settings'
}

// 关闭设置页面
function closeSettings() {
  currentView.value = 'list'
}

// 切换侧边栏
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
function closeSidebar() {
  isSidebarOpen.value = false
}

// 处理目录节点点击
function handleTreeNodeClick(_nodeId: string) {
  // 移动端关闭侧边栏
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

// 处理滚动到节点
function handleScrollToNode(_nodeId: string) {
  // 由 ResourceList 组件发出
}

// 切换教材
function handleSwitchTextbook() {
  alert('切换教材功能（原型占位）')
}

// 背单词
function handleVocabClick() {
  alert(`背单词功能（原型占位）\n本章共 ${store.chapterStats.vocabWordCount || 0} 个单词待背诵`)
}

// 新手引导完成
function handleGuideComplete() {
  // store.completeGuide() 已在 FirstTimeGuide 组件内部调用
}

// 监听选中节点变化，自动滚动侧边栏
watch(() => store.selectedNodeId, (newId) => {
  if (newId && !store.isScrollingByClick) {
    nextTick(() => {
      const el = document.getElementById(`sidebar-node-${newId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }
})

// 初始化
onMounted(() => {
  store.fetchChapters()
})
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-white;
  overflow: hidden;
}

// 加载状态
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  color: $text-tertiary;
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid $border-color;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

// 顶部区域
.top-area {
  background: $bg-white;
  z-index: 10;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

// 主布局
.main-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

// 移动端拉手按钮
.mobile-toggle {
  display: none;
  position: absolute;
  top: 61.8%;
  left: 0;
  transform: translateY(-50%);
  z-index: 20;
  width: 16px;
  height: 80px;
  background: rgba(255, 243, 229, 1);
  color: $text-primary;
  border: 1px solid rgba(186, 186, 186, 1);
  border-left: none;
  border-radius: 0 10px 10px 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-fast;
  
  @include mobile {
    display: flex;
  }
  
  &:active {
    width: 20px;
    background: rgba(255, 235, 210, 1);
  }
}

// 遮罩层
.sidebar-overlay {
  display: none;
  
  @include mobile {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $overlay;
    z-index: 25;
    touch-action: none;
    animation: fadeIn 0.2s ease;
  }
}

// 侧边栏
.sidebar {
  width: $sidebar-width;
  background: $bg-white;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  
  @include mobile {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform $transition-normal ease;
    width: 80%;
    max-width: 300px;
    box-shadow: $shadow-dropdown;
    
    &.is-open {
      transform: translateX(0);
    }
  }
}

// 侧边栏章节标题
.sidebar-chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-xl $spacing-xxl;
  background: $bg-secondary;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
  
  .title {
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin-right: $spacing-md;
  }
  
  .switch-btn {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-lg;
    background: $secondary;
    color: $bg-white;
    border-radius: 14px;
    font-size: $font-size-xxs;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity $transition-fast;
    
    &:hover {
      opacity: 0.9;
    }
    
    &:active {
      opacity: 0.8;
    }
  }
}

// 侧边栏目录容器
.sidebar-tree-container {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md 0;
  min-height: 0; // 关键：允许 flex 子项收缩
}

// 背单词入口（固定在底部）
.vocab-entry {
  flex-shrink: 0;
  padding: $spacing-lg $spacing-xxl;
  border-top: 1px solid $border-color;
  background: $bg-white;
}

.vocab-btn {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  width: 100%;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, #FFF9E0 0%, #FFD633 40%);
  border: 1px solid rgba(#FFD633, 0.3);
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(#FFD633, 0.2);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  // 高度受限时压缩样式
  @include phone-landscape {
    padding: $spacing-sm $spacing-md;
    gap: $spacing-sm;
  }
}

.vocab-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFD633 0%, #FEA345 100%);
  border-radius: $radius-md;
  color: $bg-white;
  flex-shrink: 0;
  
  @include phone-landscape {
    width: 28px;
    height: 28px;
  }
}

.vocab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  
  @include phone-landscape {
    flex-direction: row;
    align-items: center;
    gap: $spacing-sm;
  }
}

.vocab-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: #7A5000;
  
  @include phone-landscape {
    font-size: $font-size-xs;
  }
}

.vocab-meta {
  font-size: $font-size-xxs;
  color: #9A6800;
}

.vocab-arrow {
  color: #9A6800;
  flex-shrink: 0;
}

// 内容区域
.content-area {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: $bg-white;
  
  @include mobile {
    touch-action: pan-y;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
