// ============================================
// Pinia Store - 章节列表页状态管理
// ============================================

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { Chapter, SceneType, UserProgress, TextbookConfig, SubjectType } from '@/types'
import { liberalArtsSubjects } from '@/types'
import { SCENE_CONFIG, DEFAULT_SCENE_TABS } from '@/constants/sceneConfig'
import { 
  textbookConfigs, 
  chaptersBySubject, 
  mockProgressMap, 
  guideContentBySubject,
  chapterLevelStats 
} from '@/mocks/data'

// ============ 设置相关类型 ============
export type ReviewLearningMode = 'quiz-first' | 'video-first' | 'ask-every-time'
export type DefaultSceneTab = 'all' | 'last-selected'
export type DifficultyLevel = 'basic' | 'medium' | 'hard'

export interface AppSettings {
  reviewLearningMode: ReviewLearningMode
  defaultSceneTab: DefaultSceneTab
  practiceDifficulties: DifficultyLevel[]
  lastSelectedTab: SceneType | 'all'
}

const DEFAULT_SETTINGS: AppSettings = {
  reviewLearningMode: 'ask-every-time',
  defaultSceneTab: 'all',
  practiceDifficulties: ['basic', 'medium', 'hard'],
  lastSelectedTab: 'preview'
}

export const useChapterStore = defineStore('chapter', () => {
  // ============ State ============
  
  /** 加载状态 */
  const loading = ref(false)
  
  /** 当前选中的场景 Tab */
  const currentTab = ref<SceneType>('preview')
  
  /** 章节数据 */
  const chapters = ref<Chapter[]>([])
  
  /** 当前选中的小节 ID */
  const selectedNodeId = ref('')
  
  /** 是否正在执行点击触发的滚动（防止联动冲突） */
  const isScrollingByClick = ref(false)
  
  /** 学习进度映射 */
  const progressMap = ref<Record<string, UserProgress>>({})
  
  /** VIP 状态 */
  const isVip = ref(false)
  
  /** 当前教材配置 */
  const currentTextbook = ref<TextbookConfig>(textbookConfigs[0])
  
  /** 可用教材列表 */
  const availableTextbooks = ref<TextbookConfig[]>(textbookConfigs)

  /** "全部资源"抽屉是否打开 */
  const isAllResourcesOpen = ref(false)

  /** 复习场景学习模式偏好 (旧版，保留兼容) */
  const reviewLearningMode = ref<'quiz-first' | 'video-first' | null>(null)
  
  /** 是否记住复习学习模式 (旧版，保留兼容) */
  const rememberReviewMode = ref(false)

  /** 应用设置 */
  const appSettings = reactive<AppSettings>(loadAppSettings())

  /** 是否首次访问（控制新手引导显示） */
  const isFirstVisit = ref(!localStorage.getItem('guide_completed'))

  /** 已读资源 ID 集合（用于 NEW 徽标判断） */
  const readResources = ref<Set<string>>(loadReadResources())

  // ============ Getters ============
  
  /**
   * 当前学科
   */
  const currentSubject = computed<SubjectType>(() => currentTextbook.value.subject)
  
  /**
   * 当前学科的场景 Tab 配置
   */
  const sceneTabs = computed(() => {
    return SCENE_CONFIG[currentSubject.value] || DEFAULT_SCENE_TABS
  })

  
  /**
   * 是否为英语学科（用于显示背单词入口）
   */
  const isEnglish = computed(() => currentSubject.value === '英语')
  
  /**
   * 是否为文科学科（用于显示读课文资源）
   */
  const isLiberalArts = computed(() => liberalArtsSubjects.includes(currentSubject.value))
  
  /**
   * 当前场景的学习方法指南内容
   */
  const currentGuide = computed(() => {
    const subjectGuide = guideContentBySubject[currentSubject.value]
    if (!subjectGuide) return ''
    
    // 如果全部资源模式开启，显示课程特点
    if (isAllResourcesOpen.value) {
      return subjectGuide.all || ''
    }
    
    return subjectGuide[currentTab.value] || ''
  })
  
  /**
   * 获取所有小节（用于滚动监听）
   */
  const allSubsections = computed(() => {
    const subsections: Chapter[] = []
    
    const collectSubsections = (items: Chapter[]) => {
      for (const item of items) {
        if (item.level === 'subsection') {
          subsections.push(item)
        }
        if (item.children) {
          collectSubsections(item.children)
        }
      }
    }
    
    collectSubsections(chapters.value)
    return subsections
  })
  
  /**
   * 当前章节标题
   */
  const currentChapterTitle = computed(() => {
    if (chapters.value.length > 0) {
      return chapters.value[0].title
    }
    return '加载中...'
  })
  
  /**
   * 章节级资源统计
   */
  const chapterStats = computed(() => {
    return chapterLevelStats[currentSubject.value] || {
      mindMapCount: 0,
      errorBookCount: 0,
      vocabWordCount: 0
    }
  })

  /**
   * 判断资源是否为新内容（NEW 徽标）
   * 规则：firstPublishAt 距今 ≤ 7 天 且用户未读
   */
  function isNewContent(item: { id: string; firstPublishAt?: string }): boolean {
    if (!item.firstPublishAt) return false
    if (readResources.value.has(item.id)) return false

    const publishDate = new Date(item.firstPublishAt)
    const now = new Date()
    const diffDays = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  /**
   * 当前章节的上一章/下一章（用于底部导航）
   */
  const adjacentChapters = computed(() => {
    const topLevelChapters = chapters.value.filter(c => c.level === 'chapter')

    // 找到当前选中小节所属的顶层章节
    const findParentChapter = (nodeId: string): string | null => {
      for (const chapter of topLevelChapters) {
        const isDescendant = (node: Chapter): boolean => {
          if (node.id === nodeId) return true
          return (node.children || []).some(child => isDescendant(child))
        }
        if (isDescendant(chapter)) return chapter.id
      }
      return null
    }

    const currentChapterId = findParentChapter(selectedNodeId.value)
    const currentIndex = topLevelChapters.findIndex(c => c.id === currentChapterId)

    return {
      prev: currentIndex > 0 ? topLevelChapters[currentIndex - 1] : null,
      next: currentIndex < topLevelChapters.length - 1 ? topLevelChapters[currentIndex + 1] : null
    }
  })

  // ============ Actions ============
  
  /**
   * 加载章节数据
   */
  async function fetchChapters() {
    loading.value = true
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据当前学科加载对应的章节数据
    const subjectChapters = chaptersBySubject[currentSubject.value]
    chapters.value = JSON.parse(JSON.stringify(subjectChapters || []))
    progressMap.value = { ...mockProgressMap }
    
    // 默认选中第一个小节
    selectedNodeId.value = ''
    if (allSubsections.value.length > 0) {
      selectedNodeId.value = allSubsections.value[0].id
    }
    
    loading.value = false
  }
  
  /**
   * 切换教材
   */
  async function switchTextbook(textbookId: string) {
    const textbook = availableTextbooks.value.find(t => t.id === textbookId)
    if (textbook && textbook.id !== currentTextbook.value.id) {
      currentTextbook.value = textbook

      // 切换学科后，若当前 Tab 不在新学科的场景列表中，重置为第一个 Tab
      const newTabs = SCENE_CONFIG[textbook.subject] || DEFAULT_SCENE_TABS
      const tabStillValid = newTabs.some(t => t.key === currentTab.value)
      if (!tabStillValid) {
        currentTab.value = newTabs[0].key
      }

      await fetchChapters()
    }
  }
  
  /**
   * 选中节点
   */
  function selectNode(id: string) {
    selectedNodeId.value = id
  }
  
  /**
   * 切换章节展开状态
   */
  function toggleExpand(chapterId: string) {
    const toggle = (items: Chapter[]): boolean => {
      for (const item of items) {
        if (item.id === chapterId) {
          item.isExpanded = !item.isExpanded
          return true
        }
        if (item.children && toggle(item.children)) {
          return true
        }
      }
      return false
    }
    
    toggle(chapters.value)
  }
  
  /**
   * 切换场景 Tab
   */
  async function switchTab(tab: SceneType) {
    if (currentTab.value === tab && !isAllResourcesOpen.value) return
    currentTab.value = tab
    isAllResourcesOpen.value = false // 切换 Tab 时自动关闭全部资源抽屉
  }
  
  /**
   * 解锁 VIP（模拟购买流程）
   */
  function unlockVip() {
    isVip.value = true
  }
  
  /**
   * 获取资源进度
   */
  function getProgress(resourceId: string): UserProgress | undefined {
    return progressMap.value[resourceId]
  }
  
  /**
   * 更新资源进度
   */
  function updateProgress(resourceId: string, percentage: number) {
    const status = percentage === 0 ? 'not_started' 
                 : percentage === 100 ? 'completed' 
                 : 'in_progress'
    
    progressMap.value[resourceId] = {
      nodeId: resourceId,
      status,
      percentage,
      lastUpdateTime: new Date().toISOString()
    }
  }
  
  /**
   * 设置滚动锁
   */
  function setScrollingByClick(value: boolean) {
    isScrollingByClick.value = value
  }

  /**
   * 切换"全部资源"抽屉状态
   */
  function toggleAllResources(isOpen: boolean) {
    isAllResourcesOpen.value = isOpen
  }

  /**
   * 从 localStorage 加载复习学习模式偏好
   */
  function loadReviewModePreference() {
    try {
      const saved = localStorage.getItem('reviewLearningMode')
      if (saved) {
        const { mode, remember } = JSON.parse(saved)
        reviewLearningMode.value = mode
        rememberReviewMode.value = remember
      }
    } catch (e) {
      console.warn('Failed to load review mode preference:', e)
    }
  }

  /**
   * 保存复习学习模式偏好
   */
  function saveReviewModePreference(mode: 'quiz-first' | 'video-first', remember: boolean) {
    reviewLearningMode.value = mode
    rememberReviewMode.value = remember
    
    if (remember) {
      localStorage.setItem('reviewLearningMode', JSON.stringify({ mode, remember }))
    } else {
      localStorage.removeItem('reviewLearningMode')
    }
  }

  /**
   * 检查是否需要显示学习模式选择弹窗
   * 返回 true 表示需要显示弹窗，false 表示可以直接按偏好进入
   */
  function shouldShowLearningModeModal(): boolean {
    // 使用新的设置系统
    return appSettings.reviewLearningMode === 'ask-every-time'
  }

  /**
   * 从 localStorage 加载应用设置
   */
  function loadAppSettings(): AppSettings {
    try {
      const saved = localStorage.getItem('appSettings')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to load app settings:', e)
    }
    return { ...DEFAULT_SETTINGS }
  }

  /**
   * 保存应用设置到 localStorage
   */
  function saveAppSettings() {
    try {
      localStorage.setItem('appSettings', JSON.stringify(appSettings))
    } catch (e) {
      console.warn('Failed to save app settings:', e)
    }
  }

  /**
   * 更新应用设置
   */
  function updateAppSettings(updates: Partial<AppSettings>) {
    Object.assign(appSettings, updates)
    saveAppSettings()
  }

  /**
   * 记录上次选择的 Tab
   */
  function recordLastSelectedTab(tab: SceneType | 'all') {
    appSettings.lastSelectedTab = tab
    saveAppSettings()
  }

  /**
   * 学习记录定位优先级链
   * 优先级：URL 参数 > 服务端 API > localStorage > 默认首章
   */
  async function restorePosition(urlParams?: { chapterId?: string; topicId?: string }) {
    // 优先级 1：URL 参数
    if (urlParams?.chapterId || urlParams?.topicId) {
      const targetId = urlParams.topicId || urlParams.chapterId || ''
      const found = allSubsections.value.find(s => s.id === targetId)
      if (found) {
        selectNode(targetId)
        return
      }
    }

    // 优先级 2：服务端 API（V5.x 阶段对接，当前跳过）
    // TODO: const serverPosition = await fetchLastPosition(currentTextbook.value)

    // 优先级 3：localStorage
    try {
      const textbookKey = `last_position_${currentTextbook.value.id}`
      const saved = localStorage.getItem(textbookKey)
      if (saved) {
        const { nodeId } = JSON.parse(saved)
        const found = allSubsections.value.find(s => s.id === nodeId)
        if (found) {
          selectNode(nodeId)
          return
        }
      }
    } catch {
      // 静默降级
    }

    // 优先级 4：默认首章第一个小节
    if (allSubsections.value.length > 0) {
      selectNode(allSubsections.value[0].id)
    }
  }

  /**
   * 标记资源为已读（用于 NEW 徽标判断）
   */
  function markAsRead(nodeId: string) {
    const updated = new Set(readResources.value)
    updated.add(nodeId)
    readResources.value = updated
    saveReadResources(updated)
  }

  /**
   * 完成新手引导
   */
  function completeGuide() {
    isFirstVisit.value = false
    localStorage.setItem('guide_completed', 'true')
  }

  /**
   * 从 localStorage 加载已读资源
   */
  function loadReadResources(): Set<string> {
    try {
      const saved = localStorage.getItem('read_resources')
      if (saved) {
        return new Set(JSON.parse(saved))
      }
    } catch {
      // 静默降级
    }
    return new Set()
  }

  /**
   * 保存已读资源到 localStorage
   */
  function saveReadResources(resources: Set<string>) {
    try {
      localStorage.setItem('read_resources', JSON.stringify([...resources]))
    } catch {
      // 静默降级
    }
  }

  // 初始化时加载偏好
  loadReviewModePreference()

  return {
    // State
    loading,
    currentTab,
    chapters,
    selectedNodeId,
    isScrollingByClick,
    progressMap,
    isVip,
    currentTextbook,
    availableTextbooks,
    isAllResourcesOpen,
    reviewLearningMode,
    rememberReviewMode,
    appSettings,
    isFirstVisit,
    readResources,

    // Getters
    currentSubject,
    sceneTabs,
    isEnglish,
    isLiberalArts,
    currentGuide,
    allSubsections,
    currentChapterTitle,
    chapterStats,
    adjacentChapters,

    // Actions
    fetchChapters,
    switchTextbook,
    selectNode,
    toggleExpand,
    switchTab,
    unlockVip,
    getProgress,
    updateProgress,
    setScrollingByClick,
    toggleAllResources,
    loadReviewModePreference,
    saveReviewModePreference,
    shouldShowLearningModeModal,
    updateAppSettings,
    recordLastSelectedTab,
    restorePosition,
    markAsRead,
    completeGuide,
    isNewContent
  }
})
