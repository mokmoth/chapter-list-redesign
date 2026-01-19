// ============================================
// 类型定义 - 基于资源明细文档重构
// ============================================

/**
 * 场景类型
 */
export type SceneType = 'preview' | 'review' | 'extra'

/**
 * 学科类型
 */
export type SubjectType = '数学' | '英语' | '语文' | '历史' | '地理' | '政治' | '物理' | '化学' | '生物'

/**
 * 文科学科列表（用于读课文等资源过滤）
 */
export const liberalArtsSubjects: SubjectType[] = ['语文', '历史', '地理', '政治']

/**
 * 资源类型枚举（精简版）
 * 
 * 本次章节列表改版项目中使用的资源类型：
 * - video: 知识点视频 + 课后题（小节级）
 * - practice: 同步刷题（小节级）
 * - guide: 学案（小节级）
 * - read_text: 读课文（小节级，仅文科）
 * - summary_note: 总结类笔记（小节级）
 * - premium_hook: 培优课钩子（小节级，仅加餐场景）
 * - recite: 背单词（章节级，仅英语，左侧目录入口）
 * - mind_map: 思维导图（章节级，FunctionBar 入口）
 * - error_book: 错题本（章节级，FunctionBar 入口）
 */
export type ResourceType = 
  | 'video'           // 知识点视频 + 课后题
  | 'practice'        // 同步刷题
  | 'guide'           // 学案
  | 'read_text'       // 读课文（文科）
  | 'summary_note'    // 总结类笔记
  | 'premium_hook'    // 培优课钩子（仅加餐场景）
  | 'recite'          // 背单词（英语）
  | 'mind_map'        // 思维导图
  | 'error_book'      // 错题本

/**
 * 章节层级类型
 */
export type ChapterLevel = 'chapter' | 'section' | 'subsection'

/**
 * 学习进度状态
 */
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

/**
 * 课程分类
 */
export type CourseCategory = '概念课' | '解题课' | '实验课' | '总结课'

/**
 * 价值标签
 */
export type ValueTag = '新中考' | '重难点' | '易错点' | '考点' | '必看'

/**
 * 教材配置
 */
export interface TextbookConfig {
  id: string
  subject: SubjectType
  version: string       // 版本（如：人教版、北师大版）
  grade: string         // 年级（如：七年级）
  semester: string      // 学期（如：上册、下册）
  displayName: string   // 显示名称
}

/**
 * 资源接口
 */
export interface Resource {
  // 必填字段
  id: string
  type: ResourceType
  title: string
  tags: string[]
  isFree: boolean
  
  // 可选字段
  scenes?: SceneType[]           // 适用场景
  subject?: SubjectType          // 所属学科（用于学科特有资源过滤）
  
  // VIP 相关
  isTrial?: boolean              // 是否可试看
  
  // 视频相关
  duration?: number              // 时长(分钟)
  questionCount?: number         // 随堂检测题目数
  category?: CourseCategory      // 课程分类
  valueTag?: ValueTag            // 价值标签
  difficulty?: 1 | 2 | 3         // 难度等级
  coverUrl?: string              // 封面图 URL
  
  // 刷题相关
  completedCount?: number        // 已完成题数
  totalCount?: number            // 总题数
  difficultyLevels?: string[]    // ['基础', '中等', '困难']
  subsectionTitle?: string       // 小节标题
  
  // 学案相关
  pageCount?: number             // 页数
  downloadUrl?: string           // 下载链接
  
  // 读课文相关
  paragraphCount?: number        // 段落数
  estimatedTime?: number         // 预计用时（分钟）
  
  // 笔记相关
  noteCount?: number             // 笔记条数
  
  // 培优课钩子相关
  hookType?: '重难点' | '拔高' | '竞赛'  // 钩子类型
  targetCourse?: string          // 目标课程名称
}

/**
 * 章节接口
 */
export interface Chapter {
  id: string
  title: string
  level: ChapterLevel
  children?: Chapter[]
  resources?: Resource[]
  progress?: {
    completed: number
    total: number
  }
  isExpanded?: boolean
}

/**
 * 用户学习进度
 */
export interface UserProgress {
  nodeId: string
  status: ProgressStatus
  percentage: number  // 0-100
  lastUpdateTime: string  // ISO8601 格式
}

/**
 * Tab 配置
 */
export interface TabConfig {
  key: SceneType
  label: string
}

/**
 * 学习指南内容
 */
export interface GuideContent {
  preview: string
  review: string
  extra: string
  all?: string  // "全部"场景下的课程特点介绍
}

/**
 * 章节级资源入口（思维导图、错题本等）
 */
export interface ChapterLevelEntry {
  type: 'mind_map' | 'error_book' | 'recite'
  title: string
  icon: string
  count?: number       // 错题数量等
  isAvailable: boolean // 当前学科是否可用
}
