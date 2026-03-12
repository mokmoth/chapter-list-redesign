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
        <span class="subsection-pin-icon">&#9678;</span>
        <span class="subsection-title">{{ subsection.title }}</span>
        <span class="subsection-ai-badge">AI总结</span>
      </div>
      
      <!-- 资源卡片列表（支持 practice+guide 并排布局） -->
      <div class="resource-cards">
        <template v-for="(row, idx) in getLayoutRows(subsection.resources)" :key="'row-' + idx">
          <!-- 单卡片行（100% 宽度） -->
          <component
            v-if="row.type === 'single'"
            :is="getCardComponent(row.resource.type)"
            :resource="row.resource"
            @request-learning-mode="handleRequestLearningMode"
            @request-content-choice="openContentChoice"
          />
          <!-- 并排行（各 50% 宽度） -->
          <div v-else class="resource-pair-row">
            <component
              v-for="res in row.resources"
              :key="res.id"
              :is="getCardComponent(res.type)"
              :resource="res"
            />
          </div>
        </template>
      </div>
    </div>
    
    <!-- 章节底部导航（上一章/下一章） -->
    <ChapterFooter />

    <!-- 底部安全区 -->
    <div class="bottom-safe-area"></div>

    <!-- 学习模式选择弹窗 -->
    <LearningModeModal
      :visible="isLearningModeModalVisible"
      :resource-title="pendingResource?.title"
      @close="closeLearningModeModal"
      @confirm="handleLearningModeConfirm"
    />

    <!-- 学习内容选择弹窗（视频/练习/笔记） -->
    <ContentChoiceModal
      :visible="isContentChoiceVisible"
      :resource-title="contentChoiceResource?.title ?? ''"
      :has-note="contentChoiceResource?.isContainNote ?? false"
      @close="closeContentChoice"
      @select="handleContentChoice"
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
import ChapterFooter from './ChapterFooter.vue'
import ContentChoiceModal from './ContentChoiceModal.vue'
import type { ContentChoice } from './ContentChoiceModal.vue'
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

// 学习内容选择弹窗状态 (ContentChoiceModal)
const isContentChoiceVisible = ref(false)
const contentChoiceResource = ref<Resource | null>(null)

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
 * 布局行类型：单卡片 or 并排对（practice + guide）
 */
type LayoutRow =
  | { type: 'single'; resource: Resource }
  | { type: 'pair'; resources: readonly [Resource, Resource] }

/**
 * 判断两个相邻资源是否构成 practice + guide 配对
 */
function isPracticeGuidePair(a: Resource, b: Resource): boolean {
  const types = new Set([a.type, b.type])
  return types.has('practice') && types.has('guide')
}

/**
 * 将资源数组预处理为"布局行"
 * 相邻的 practice + guide 合并为一个并排行（各占 50%），其余为单卡片行
 */
function getLayoutRows(resources: Resource[]): LayoutRow[] {
  const rows: LayoutRow[] = []
  let i = 0
  while (i < resources.length) {
    const current = resources[i]
    const next = resources[i + 1]
    if (next && isPracticeGuidePair(current, next)) {
      rows.push({ type: 'pair', resources: [current, next] })
      i += 2
    } else {
      rows.push({ type: 'single', resource: current })
      i += 1
    }
  }
  return rows
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
 * 打开学习内容选择弹窗（ContentChoiceModal）
 * 当用户点击已有观看进度的视频资源时触发
 */
function openContentChoice(resource: Resource) {
  contentChoiceResource.value = resource
  isContentChoiceVisible.value = true
}

/**
 * 关闭学习内容选择弹窗
 */
function closeContentChoice() {
  isContentChoiceVisible.value = false
  contentChoiceResource.value = null
}

/**
 * 处理学习内容选择
 */
function handleContentChoice(choice: ContentChoice) {
  if (!contentChoiceResource.value) return
  const resource = contentChoiceResource.value

  const actionMap: Record<ContentChoice, string> = {
    video: `继续看视频：${resource.title}\n\n从上次断点继续播放`,
    practice: `做补充练习：${resource.title}\n\n开始该知识点的课后习题`,
    note: `查看课堂笔记：${resource.title}\n\n打开该知识点的课堂笔记`
  }

  alert(actionMap[choice])
  closeContentChoice()
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
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-xxl;
  background: $bg-white;
  border-bottom: 1px solid $border-color;

  .subsection-pin-icon {
    font-size: $font-size-md;
    color: $primary;
    flex-shrink: 0;
    line-height: 1;
  }

  .subsection-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    flex: 1;
  }

  .subsection-ai-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 2px 8px;
    background: linear-gradient(135deg, #845EFF 0%, #518AFF 100%);
    color: $bg-white;
    font-size: 10px;
    font-weight: $font-weight-bold;
    border-radius: $radius-pill;
    flex-shrink: 0;
    letter-spacing: 0.3px;
    line-height: 1.4;
    cursor: pointer;
    transition: opacity $transition-fast;

    &:active {
      opacity: 0.8;
    }
  }
}

.resource-cards {
  padding: $spacing-xl $spacing-xxl;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.resource-pair-row {
  container-type: inline-size;
  container-name: pair-row;
  display: flex;
  gap: $spacing-lg;
  align-items: stretch;

  > :deep(*) {
    flex: 1;
    min-width: 0;
  }

  // ── PracticeCard 并排模式 ──
  // Grid 布局：图标与标题同行，进度/难度跨全宽
  > :deep(.practice-card) {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: $spacing-md;
    row-gap: $spacing-sm;
    align-items: center;
    align-content: start;
    padding: $spacing-lg;
    border: 1px solid $border-color;
    border-radius: $radius-lg;

    // 图标：40px 带紫色背景方块，与标题同行
    .icon-area {
      grid-row: 1;
      grid-column: 1;
      width: 40px;
      height: 40px;
      background: $secondary-bg;
      padding: 0;
      border-radius: $radius-md;
      flex-shrink: 0;

      .icon-bg svg {
        width: 22px;
        height: 22px;
      }

      .icon-label {
        display: none;
      }
    }

    // 内容区 display:contents 让子元素直接参与网格
    .content {
      display: contents;
    }

    // 标题行与图标同行，stretch 使其与图标等高
    .title-row {
      grid-row: 1;
      grid-column: 2;
      align-self: stretch;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    // "同步刷题" 作为主标题（大号加粗深色）
    .type-label {
      display: block;
      color: $text-primary;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1.2;

      &::after {
        content: none;
      }
    }

    // 小节标题作为副标题（小号浅色）
    .title {
      font-size: $font-size-xs;
      font-weight: $font-weight-normal;
      color: $text-secondary;
      line-height: 1.2;
    }

    // 难度条跨全宽，排在进度下方
    .difficulty-levels {
      grid-column: 1 / -1;
      order: 1;
      gap: $spacing-lg;
    }

    // 进度跨全宽
    .progress-display {
      grid-column: 1 / -1;

      .progress-current {
        font-size: 22px;
        font-weight: $font-weight-bold;
      }

      .progress-separator {
        font-size: $font-size-lg;
      }

      .progress-total {
        font-size: $font-size-lg;
      }
    }
  }

  // ── GuideCard 并排模式 ──
  // Grid 布局：图标与标题同行，元信息跨全宽
  > :deep(.guide-card) {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: $spacing-md;
    row-gap: $spacing-sm;
    align-items: center;
    align-content: start;
    padding: $spacing-lg;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;

    // 图标：40px 带蓝色背景方块，与标题同行
    .card-icon {
      grid-row: 1;
      grid-column: 1;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #EAF2FF 0%, #D8E7FF 100%);
      padding: 0;
      border-radius: $radius-md;
      flex-shrink: 0;
      align-self: center;
    }

    // 内容区 display:contents 让子元素直接参与网格
    .card-content {
      display: contents;
    }

    // 标题行与图标同行，stretch 使其与图标等高
    .card-title-row {
      grid-row: 1;
      grid-column: 2;
      display: flex;
      align-items: center;
      min-width: 0;
      gap: $spacing-sm;
      align-self: stretch;
    }

    // "学案" 作为主标题（大号加粗深色）
    .type-label {
      display: block;
      color: $text-primary;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1.2;

      &::after {
        content: none;
      }
    }

    // 资源标题作为副标题
    .card-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-normal;
      color: $text-secondary;
      line-height: 1.2;
      margin-bottom: 0;
    }

    // 元信息跨全宽
    .card-meta {
      grid-column: 1 / -1;

      .tag {
        padding: $spacing-xs $spacing-md;
        border: 1px solid $border-color;
        border-radius: $radius-pill;
        background: $bg-white;
        font-weight: $font-weight-medium;
        color: $text-secondary;
      }
    }

    .card-action {
      display: none;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tier 1: Compact — container ≤ 350px
  // iPhone SE (375px → ~343px pair-row) 及以下
  // 图标: 44/40px → 24px 内联徽标
  // 类型标题: 保留但缩小
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  @container pair-row (max-width: 350px) {
    gap: $spacing-md;

    // ── PracticeCard Tier 1 ──
    > :deep(.practice-card) {
      padding: $spacing-md;
      column-gap: $spacing-sm;
      row-gap: $spacing-xs;

      .icon-area {
        width: 24px;
        height: 24px;
        border-radius: $radius-sm;

        .icon-bg svg {
          width: 14px;
          height: 14px;
        }
      }

      .type-label {
        font-size: $font-size-md;
        font-weight: $font-weight-semibold;
      }

      .title {
        font-size: $font-size-xxs;
      }

      .difficulty-levels {
        gap: $spacing-md;
      }

      .difficulty-item {
        .difficulty-text {
          font-size: 9px;
        }

        .underline-seg {
          width: 10px;
        }
      }

      .progress-display {
        .progress-current {
          font-size: $font-size-xl;
        }

        .progress-separator {
          font-size: $font-size-md;
        }

        .progress-total {
          font-size: $font-size-md;
        }
      }
    }

    // ── GuideCard Tier 1 ──
    > :deep(.guide-card) {
      padding: $spacing-md;
      column-gap: $spacing-sm;
      row-gap: $spacing-xs;

      .card-icon {
        width: 24px;
        height: 24px;
        border-radius: $radius-sm;

        svg {
          width: 14px !important;
          height: 14px !important;
        }
      }

      .type-label {
        font-size: $font-size-md;
        font-weight: $font-weight-semibold;
      }

      .card-title {
        font-size: $font-size-xs;
      }

      .card-meta {
        .tag {
          padding: $spacing-xxs $spacing-xs;
          font-size: $font-size-xxxs;
        }
      }
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tier 2: Ultra-compact — container ≤ 300px
  // 320px 极窄视口 → ~288px pair-row
  // 类型标题: 隐藏，图标独立表意
  // 副标题: 提升为主标题
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  @container pair-row (max-width: 300px) {
    gap: $spacing-sm;

    // ── PracticeCard Tier 2 ──
    > :deep(.practice-card) {
      padding: $spacing-md $spacing-sm;
      column-gap: $spacing-xs;
      row-gap: $spacing-xxs;

      .icon-area {
        width: 20px;
        height: 20px;

        .icon-bg svg {
          width: 12px;
          height: 12px;
        }
      }

      // 隐藏类型标题 — 图标足以表意
      .type-label {
        display: none;
      }

      // 副标题提升为主标题
      .title {
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        color: $text-primary;
      }

      .difficulty-levels {
        gap: $spacing-sm;
      }

      .difficulty-item {
        .underline-seg {
          width: 8px;
          height: 2px;
        }
      }

      .progress-display {
        .progress-current {
          font-size: $font-size-lg;
        }

        .progress-separator {
          font-size: $font-size-sm;
        }

        .progress-total {
          font-size: $font-size-sm;
        }
      }
    }

    // ── GuideCard Tier 2 ──
    > :deep(.guide-card) {
      padding: $spacing-md $spacing-sm;
      column-gap: $spacing-xs;
      row-gap: $spacing-xxs;

      .card-icon {
        width: 20px;
        height: 20px;

        svg {
          width: 12px !important;
          height: 12px !important;
        }
      }

      // 隐藏类型标题 — 图标足以表意
      .type-label {
        display: none;
      }

      // 副标题提升为主标题
      .card-title {
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $text-primary;
      }

      .card-meta {
        font-size: $font-size-xxxs;

        .tag {
          padding: $spacing-xxs $spacing-xs;
          font-size: 9px;
        }
      }
    }
  }
}

.bottom-safe-area {
  height: 80px;
}
</style>
