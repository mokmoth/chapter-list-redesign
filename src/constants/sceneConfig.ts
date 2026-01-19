import type { SubjectType, TabConfig } from '@/types'

export const DEFAULT_SCENE_TABS: TabConfig[] = [
  { key: 'preview', label: '预习' },
  { key: 'review', label: '复习' },
  { key: 'extra', label: '加餐' }
]

export const LIBERAL_ARTS_SCENE_TABS: TabConfig[] = [
  { key: 'preview', label: '课前' },
  { key: 'review', label: '课后' },
  { key: 'extra', label: '拓展' }
]

export const SCENE_CONFIG: Record<SubjectType, TabConfig[]> = {
  '数学': DEFAULT_SCENE_TABS,
  '物理': DEFAULT_SCENE_TABS,
  '化学': DEFAULT_SCENE_TABS,
  '生物': DEFAULT_SCENE_TABS,
  '英语': LIBERAL_ARTS_SCENE_TABS,
  '语文': LIBERAL_ARTS_SCENE_TABS,
  '历史': LIBERAL_ARTS_SCENE_TABS,
  '地理': LIBERAL_ARTS_SCENE_TABS,
  '政治': LIBERAL_ARTS_SCENE_TABS
}
