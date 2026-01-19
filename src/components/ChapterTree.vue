<template>
  <div class="chapter-tree">
    <div 
      v-for="item in chapters" 
      :key="item.id" 
      class="tree-node"
      :class="`level-${item.level}`"
    >
      <!-- 节点内容 -->
      <div 
        :id="`sidebar-node-${item.id}`"
        class="node-content"
        :class="{
          'is-selected': store.selectedNodeId === item.id,
          'is-section': item.level === 'section',
          'is-subsection': item.level === 'subsection',
          'is-chapter': item.level === 'chapter'
        }"
        @click.stop="handleNodeClick(item)"
      >
        <!-- 小节前的箭头占位 -->
        <span v-if="item.level === 'subsection'" class="arrow-placeholder">
          <ChevronRight :size="12" />
        </span>
        
        <!-- 标题 -->
        <span class="title">{{ item.title }}</span>
        
        <!-- 进度信息 -->
        <span 
          v-if="item.progress && item.level === 'section'" 
          class="progress"
        >
          {{ item.progress.completed }}/{{ item.progress.total }}
        </span>
      </div>
      
      <!-- 递归渲染子节点 -->
      <div 
        v-if="item.children && item.children.length" 
        class="node-children"
      >
        <ChapterTree 
          :chapters="item.children"
          @node-click="(id: string) => emit('node-click', id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { Chapter } from '@/types'

defineProps<{
  chapters: Chapter[]
}>()

const emit = defineEmits<{
  'node-click': [id: string]
}>()

const store = useChapterStore()

function handleNodeClick(item: Chapter) {
  // 只有小节可以点击
  if (item.level === 'subsection') {
    // 1. 开启滚动锁，防止观察者干扰
    store.setScrollingByClick(true)
    store.selectNode(item.id)
    
    // 2. 执行滚动
    const el = document.getElementById(`subsection-${item.id}`)
    const container = document.querySelector('.resource-list-container')
    
    if (el && container) {
      const targetTop = el.offsetTop - 16
      container.scrollTo({ top: targetTop, behavior: 'smooth' })
      
      // 3. 滚动结束后释放锁 (平滑滚动通常在 500ms 内结束)
      setTimeout(() => {
        store.setScrollingByClick(false)
      }, 600)
    } else {
      store.setScrollingByClick(false)
    }
    
    // 4. 通知父组件
    emit('node-click', item.id)
  }
}
</script>

<style lang="scss" scoped>
.chapter-tree {
  padding: 0 $spacing-xl;
}

.tree-node {
  // 章节层级样式
  &.level-chapter {
    margin-bottom: $spacing-md;
  }
}

.node-content {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-md;
  cursor: default;
  transition: all $transition-fast;
  gap: $spacing-xs;
  
  // 章节标题
  &.is-chapter {
    display: none; // 隐藏顶层章节标题，已在 sidebar-header 显示
  }
  
  // 大节标题
  &.is-section {
    font-weight: $font-weight-semibold;
    color: $text-primary;
    padding-top: $spacing-xl;
    padding-bottom: $spacing-xs;
    padding-left: $spacing-xl;
    cursor: default;
    
    .title {
      flex: 1;
      font-size: $font-size-md;
    }
    
    .progress {
      font-size: $font-size-xxs;
      color: $text-tertiary;
      font-weight: $font-weight-normal;
    }
  }
  
  // 小节标题
  &.is-subsection {
    padding-left: $spacing-xxxl;
    cursor: pointer;
    
    .title {
      font-size: $font-size-sm;
      color: $text-primary;
    }
    
    &:hover {
      background: #f5f5f5;
    }
    
    &:active {
      background: #f0f0f0;
    }
  }
  
  // 选中状态
  &.is-selected {
    background: $primary-light !important;
    
    .title {
      color: $primary;
      font-weight: $font-weight-semibold;
    }
    
    .arrow-placeholder {
      color: $primary;
    }
  }
}

.arrow-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: $text-tertiary;
  flex-shrink: 0;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-children {
  // 子节点容器
}
</style>
