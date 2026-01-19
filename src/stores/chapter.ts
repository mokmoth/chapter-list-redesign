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
    
    return subjectGuide[currentTab.value]
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
    
    // Getters
    currentSubject,
    sceneTabs,
    isEnglish,
    isLiberalArts,
    currentGuide,
    allSubsections,
    currentChapterTitle,
    chapterStats,
    
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
    recordLastSelectedTab
  }
})
