<template>
  <div class="resource-list-container" ref="containerRef">
    <!-- 学习方法指南 (所有模式均显示) -->
    <LearningGuide />
    
    <!-- 空状态 -->
    <div v-if="filteredSubsections.length === 0" class="empty-state">
      <FileQuestion :size="48" />
      <span>当前场景暂无资源</span>
    </div>
    
    <!-- 资源列表（按小节分组） -->
    <div 
      v-for="subsection in filteredSubsections"
      :key="subsection.id"
      :id="`subsection-${subsection.id}`"
      class="subsection-group"
    >
      <!-- 小节标题 -->
      <div class="subsection-header">
        <span class="subsection-title">{{ subsection.title }}</span>
      </div>
      
      <!-- 资源卡片列表 -->
      <div class="resource-cards">
        <component
          v-for="resource in subsection.resources"
          :key="resource.id"
          :is="getCardComponent(resource.type)"
          :resource="resource"
          @request-learning-mode="handleRequestLearningMode"
        />
      </div>
    </div>
    
    <!-- 底部安全区 -->
    <div class="bottom-safe-area"></div>
    
    <!-- 学习模式选择弹窗 -->
    <LearningModeModal
      :visible="isLearningModeModalVisible"
      :resource-title="pendingResource?.title"
      @close="closeLearningModeModal"
      @confirm="handleLearningModeConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, markRaw, type Component } from 'vue'
import { FileQuestion } from 'lucide-vue-next'
import { useChapterStore } from '@/stores/chapter'
import type { Chapter, Resource } from '@/types'

// 导入卡片组件
import LearningGuide from './LearningGuide.vue'
import KnowledgeCard from './KnowledgeCard.vue'
import PracticeCard from './PracticeCard.vue'
import GuideCard from './GuideCard.vue'
import ReadTextCard from './ReadTextCard.vue'
import SummaryNoteCard from './SummaryNoteCard.vue'
import PremiumHookCard from './PremiumHookCard.vue'
import LearningModeModal from './LearningModeModal.vue'
import type { LearningMode } from './LearningModeModal.vue'

const props = withDefaults(defineProps<{
  mode?: 'scene' | 'all'
}>(), {
  mode: 'scene'
})

const store = useChapterStore()
const containerRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 学习模式弹窗状态
const isLearningModeModalVisible = ref(false)
const pendingResource = ref<Resource | null>(null)

// 组件映射（精简版）
const componentMap: Record<string, Component> = {
  'video': markRaw(KnowledgeCard),
  'practice': markRaw(PracticeCard),
  'guide': markRaw(GuideCard),
  'read_text': markRaw(ReadTextCard),
  'summary_note': markRaw(SummaryNoteCard),
  'premium_hook': markRaw(PremiumHookCard)
}

/**
 * 获取资源对应的卡片组件
 */
function getCardComponent(type: string): Component {
  return componentMap[type] || markRaw(KnowledgeCard)
}

/**
 * 处理知识点卡片请求学习模式选择
 */
function handleRequestLearningMode(resource: Resource) {
  pendingResource.value = resource
  isLearningModeModalVisible.value = true
}

/**
 * 关闭学习模式弹窗
 */
function closeLearningModeModal() {
  isLearningModeModalVisible.value = false
  pendingResource.value = null
}

/**
 * 处理学习模式确认
 */
function handleLearningModeConfirm(mode: LearningMode) {
  if (!pendingResource.value) return
  
  const resource = pendingResource.value
  
  if (mode === 'quiz-first') {
    alert(`进入学习（先做题后看视频）：${resource.title}\n\n将先进入随堂检测，完成后再观看视频`)
  } else {
    alert(`进入学习（先看视频后做题）：${resource.title}\n\n将先观看视频，完成后再做随堂检测`)
  }
  
  closeLearningModeModal()
}

/**
 * 过滤后的小节列表
 */
const filteredSubsections = computed(() => {
  return store.allSubsections.map(sub => {
    const resources = sub.resources?.filter((res: Resource) => {
      // 1. 场景过滤
      if (props.mode === 'scene') {
        let sceneMatch = false
        if (!res.scenes || res.scenes.length === 0) {
          // 无场景标记的资源默认显示在 preview/review
          sceneMatch = store.currentTab === 'preview' || store.currentTab === 'review'
        } else {
          sceneMatch = res.scenes.includes(store.currentTab)
        }
        
        if (!sceneMatch) return false
      }
      
      // 2. 学科过滤：读课文仅文科显示
      if (res.type === 'read_text') {
        return store.isLiberalArts
      }
      
      return true
    }) || []

    return { ...sub, resources }
  }).filter(sub => sub.resources.length > 0) as Chapter[]
})

/**
 * 设置滚动观察者
 */
function setupObserver() {
  // 清理旧的观察者
  if (observer) {
    observer.disconnect()
    observer = null
  }
  
  if (!containerRef.value) return
  
  observer = new IntersectionObserver((entries) => {
    // 如果是点击触发的滚动，不执行观察者逻辑
    if (store.isScrollingByClick) return
    
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        const id = entry.target.id.replace('subsection-', '')
        store.selectNode(id)
      }
    })
  }, {
    root: containerRef.value,
    threshold: [0, 0.1, 0.2],
    rootMargin: '-10% 0px -85% 0px' // 关键：将感应区压缩在顶部
  })
  
  // 观察所有小节
  nextTick(() => {
    const subsections = containerRef.value?.querySelectorAll('.subsection-group')
    subsections?.forEach(el => observer?.observe(el))
  })
}

// 监听 Tab 切换，滚动到顶部并重新设置观察者
watch(() => store.currentTab, () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
    setupObserver()
  })
})

// 监听数据变化，重新设置观察者
watch(() => store.allSubsections, () => {
  nextTick(() => {
    setupObserver()
  })
}, { deep: true })

// 监听学科切换，滚动到顶部
watch(() => store.currentSubject, () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  })
})

onMounted(() => {
  nextTick(() => {
    setupObserver()
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.resource-list-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxxl * 2;
  color: $text-tertiary;
  gap: $spacing-xl;
  
  span {
    font-size: $font-size-sm;
  }
}

.subsection-group {
  margin-bottom: $spacing-xxl;
}

.subsection-header {
  padding: $spacing-lg $spacing-xxl;
  background: $bg-secondary;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 5;
  
  .subsection-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}

.resource-cards {
  padding: $spacing-xl $spacing-xxl;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.bottom-safe-area {
  height: 80px;
}
</style>
