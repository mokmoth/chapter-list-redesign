import type { SubjectType, TabConfig } from '@/types'

// ============================================
// 场景 Tab 配置
// 基于 scene-card-map.json（初中学段）
// ============================================

/**
 * 理科解题型：预习 / 解题指导 / 刷题
 * 适用：初中/高中 数学、物理、化学
 */
export const SCIENCE_PROBLEM_TABS: TabConfig[] = [
  { key: 'preview', label: '预习' },
  { key: 'problem_solving', label: '解题指导' },
  { key: 'drill', label: '刷题' }
]

/**
 * 语言文科型：预习 / 复习 / 日常积累
 * 适用：初中/高中 语文、英语
 */
export const LANGUAGE_TABS: TabConfig[] = [
  { key: 'preview', label: '预习' },
  { key: 'review', label: '复习' },
  { key: 'accumulation', label: '日常积累' }
]

/**
 * 理科基础型：预习 / 复习
 * 适用：初中 生物、地理（场景较少的学科）
 */
export const SCIENCE_BASIC_TABS: TabConfig[] = [
  { key: 'preview', label: '预习' },
  { key: 'review', label: '复习' }
]

/**
 * 历史/道法型（当前暂未上线筛选）：预习 / 复习
 * 适用：初中 历史、道法/政治（spec 中 enabled: false，保留基础功能）
 */
export const HISTORY_TABS: TabConfig[] = [
  { key: 'preview', label: '预习' },
  { key: 'review', label: '复习' }
]

// 保留旧变量名兼容（逐步移除）
export const DEFAULT_SCENE_TABS = SCIENCE_PROBLEM_TABS

export const SCENE_CONFIG: Record<SubjectType, TabConfig[]> = {
  // 理科解题型
  '数学': SCIENCE_PROBLEM_TABS,
  '物理': SCIENCE_PROBLEM_TABS,
  '化学': SCIENCE_PROBLEM_TABS,

  // 语言文科型
  '语文': LANGUAGE_TABS,
  '英语': LANGUAGE_TABS,

  // 理科基础型
  '生物': SCIENCE_BASIC_TABS,
  '地理': SCIENCE_BASIC_TABS,

  // 暂未上线筛选（保留基础预习/复习）
  '历史': HISTORY_TABS,
  '政治': HISTORY_TABS
}
