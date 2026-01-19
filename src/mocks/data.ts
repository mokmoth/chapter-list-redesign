// ============================================
// Mock 数据 - 多学科支持
// ============================================

import type { Chapter, Resource, UserProgress, GuideContent, TextbookConfig, SubjectType } from '@/types'

// ============================================
// 教材配置
// ============================================

export const textbookConfigs: TextbookConfig[] = [
  {
    id: 'math_rj_7b',
    subject: '数学',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '数学 人教版七年级下册'
  },
  {
    id: 'english_rj_7b',
    subject: '英语',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '英语 人教版七年级下册'
  },
  {
    id: 'chinese_rj_7b',
    subject: '语文',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '语文 人教版七年级下册'
  },
  // 新增：历史（文科代表）
  {
    id: 'history_tb_8a',
    subject: '历史',
    version: '统编版',
    grade: '八年级',
    semester: '上册',
    displayName: '历史 统编版八年级上册'
  },
  // 新增：物理（理科代表）
  {
    id: 'physics_rj_8a',
    subject: '物理',
    version: '人教版',
    grade: '八年级',
    semester: '上册',
    displayName: '物理 人教版八年级上册'
  }
]

// ============================================
// 学习方法指南（按学科）
// ============================================

export const guideContentBySubject: Record<SubjectType, GuideContent> = {
  '数学': {
    preview: '预习建议：重点关注概念定义和公式推导，尝试自己画图理解几何关系。',
    review: '复习建议：总结定理的应用条件，多做典型例题加深理解。',
    extra: '加餐建议：挑战综合题，尝试用多种方法解决同一问题。',
    all: '课程特点：本章重点在于培养几何直观能力和逻辑推理能力，从基础概念到复杂证明层层递进。'
  },
  '英语': {
    preview: '预习建议：先预习单词，了解课文大意，标记不理解的句子。',
    review: '复习建议：背诵重点句型，整理语法知识点，多听多读。',
    extra: '加餐建议：拓展阅读同主题文章，积累地道表达。',
    all: '课程特点：以天气话题为核心，通过对话和阅读全面提升听说读写能力，掌握现在进行时的用法。'
  },
  '语文': {
    preview: '预习建议：朗读课文，了解作者背景，标注生字词。',
    review: '复习建议：梳理文章结构，积累优美语句，理解作者情感。',
    extra: '加餐建议：拓展阅读相关作品，练习写作技巧。',
    all: '课程特点：精选经典回忆性散文，引导学生体会作者情感，学习叙事手法和描写技巧。'
  },
  '历史': {
    preview: '预习建议：了解历史背景，梳理时间线，关注重要人物和事件。',
    review: '复习建议：对比分析历史事件的因果关系，总结历史规律。',
    extra: '加餐建议：阅读历史文献，拓展视野。',
    all: '课程特点：通过对新中国成立初期重大历史事件的学习，培养唯物史观和家国情怀。'
  },
  '地理': {
    preview: '预习建议：结合地图理解地理概念，关注区位特征。',
    review: '复习建议：总结地理规律，多看图分析。',
    extra: '加餐建议：关注时事地理，理论联系实际。',
    all: '课程特点：强调地图技能的运用，结合实际案例分析地理现象，培养综合思维。'
  },
  '政治': {
    preview: '预习建议：了解基本概念，关注时事热点。',
    review: '复习建议：梳理知识框架，多做主观题练习。',
    extra: '加餐建议：分析案例，提升综合运用能力。',
    all: '课程特点：结合社会热点和生活实际，深入浅出地讲解政治概念，提升法治意识。'
  },
  '物理': {
    preview: '预习建议：关注物理现象和概念定义，理解公式推导。',
    review: '复习建议：总结公式应用条件，多做计算题。',
    extra: '加餐建议：挑战综合实验题。',
    all: '课程特点：以实验为基础，从生活现象入手，引导学生探索声学奥秘，培养科学探究精神。'
  },
  '化学': {
    preview: '预习建议：预习化学方程式，了解反应原理。',
    review: '复习建议：总结物质性质，多做实验题。',
    extra: '加餐建议：拓展有机化学知识。',
    all: '课程特点：注重实验探究和微观分析，帮助学生建立化学基本观念，掌握物质变化规律。'
  },
  '生物': {
    preview: '预习建议：了解生物概念，关注图表信息。',
    review: '复习建议：梳理知识网络，多做图表分析题。',
    extra: '加餐建议：关注生物科技前沿。',
    all: '课程特点：图文并茂，理论联系实际，帮助学生构建完整的生物知识体系，关注生命科学发展。'
  }
}

// 兼容旧代码的默认指南
export const guideContent: GuideContent = guideContentBySubject['数学']

// ============================================
// 数学学科 Mock 数据
// ============================================

const mathResources_7_1_1: Resource[] = [
  {
    id: 'math_v_7_1_1_1',
    type: 'video',
    title: '相交线的基本概念',
    tags: ['数学', '几何'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 8,
    questionCount: 5,
    category: '概念课',
    valueTag: '必看',
    difficulty: 1
  },
  {
    id: 'math_v_7_1_1_2',
    type: 'video',
    title: '对顶角的性质与应用',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 10,
    questionCount: 6,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'math_guide_7_1_1',
    type: 'guide',
    title: '相交线学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 4,
    subject: '数学'
  },
  {
    id: 'math_note_7_1_1',
    type: 'summary_note',
    title: '相交线知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 8,
    subject: '数学'
  },
  {
    id: 'math_practice_7_1_1',
    type: 'practice',
    title: '相交线同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '7.1.1 相交线',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 8
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'math_hook_7_1_1',
    type: 'premium_hook',
    title: '相交线培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '几何证明专项',
    duration: 15,
    questionCount: 8,
    difficulty: 2
  }
]

const mathResources_7_1_2: Resource[] = [
  {
    id: 'math_v_7_1_2_1',
    type: 'video',
    title: '邻补角的定义与识别',
    tags: ['数学', '几何'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 7,
    questionCount: 4,
    category: '概念课',
    valueTag: '新中考',
    difficulty: 1
  },
  {
    id: 'math_v_7_1_2_2',
    type: 'video',
    title: '邻补角的性质证明',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 5,
    category: '解题课',
    difficulty: 2,
    isTrial: true
  },
  {
    id: 'math_guide_7_1_2',
    type: 'guide',
    title: '邻补角学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 3,
    subject: '数学'
  },
  {
    id: 'math_note_7_1_2',
    type: 'summary_note',
    title: '邻补角公式总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 5,
    subject: '数学'
  },
  {
    id: 'math_practice_7_1_2',
    type: 'practice',
    title: '邻补角同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '7.1.2 邻补角',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 20,
    completedCount: 5
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'math_hook_7_1_2',
    type: 'premium_hook',
    title: '邻补角培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '拔高',
    targetCourse: '角度计算专项',
    duration: 12,
    questionCount: 6,
    difficulty: 3
  }
]

const mathResources_7_2_1: Resource[] = [
  {
    id: 'math_v_7_2_1_1',
    type: 'video',
    title: '平行线的三种判定方法',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 15,
    questionCount: 8,
    category: '概念课',
    valueTag: '考点',
    difficulty: 2
  },
  {
    id: 'math_v_7_2_1_2',
    type: 'video',
    title: '同位角相等判定平行',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 10,
    questionCount: 5,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'math_guide_7_2_1',
    type: 'guide',
    title: '平行线判定学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 5,
    subject: '数学'
  },
  {
    id: 'math_note_7_2_1',
    type: 'summary_note',
    title: '平行线判定定理总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 10,
    subject: '数学'
  },
  {
    id: 'math_practice_7_2_1',
    type: 'practice',
    title: '平行线判定同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '7.2.1 平行线的判定',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 30,
    completedCount: 12
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'math_hook_7_2_1',
    type: 'premium_hook',
    title: '平行线判定培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '几何证明专项',
    duration: 15,
    questionCount: 8,
    difficulty: 2
  }
]

const mathResources_7_2_2: Resource[] = [
  {
    id: 'math_v_7_2_2_1',
    type: 'video',
    title: '平行线的性质定理',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 6,
    category: '概念课',
    valueTag: '考点',
    difficulty: 2
  },
  {
    id: 'math_v_7_2_2_2',
    type: 'video',
    title: '平行线性质的应用',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 14,
    questionCount: 7,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 3
  },
  {
    id: 'math_guide_7_2_2',
    type: 'guide',
    title: '平行线性质学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 4,
    subject: '数学'
  },
  {
    id: 'math_practice_7_2_2',
    type: 'practice',
    title: '平行线性质同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '7.2.2 平行线的性质',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 28,
    completedCount: 0
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'math_hook_7_2_2',
    type: 'premium_hook',
    title: '平行线性质培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '拔高',
    targetCourse: '几何综合提升',
    duration: 12,
    questionCount: 6,
    difficulty: 3
  }
]

export const mathChapters: Chapter[] = [
  {
    id: 'math_ch_7',
    title: '第七章 相交线与平行线',
    level: 'chapter',
    progress: { completed: 8, total: 25 },
    isExpanded: true,
    children: [
      {
        id: 'math_sec_7_1',
        title: '7.1 相交线',
        level: 'section',
        progress: { completed: 3, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_7_1_1',
            title: '7.1.1 相交线',
            level: 'subsection',
            resources: mathResources_7_1_1
          },
          {
            id: 'math_sub_7_1_2',
            title: '7.1.2 邻补角',
            level: 'subsection',
            resources: mathResources_7_1_2
          }
        ]
      },
      {
        id: 'math_sec_7_2',
        title: '7.2 平行线及其判定',
        level: 'section',
        progress: { completed: 4, total: 12 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_7_2_1',
            title: '7.2.1 平行线的判定',
            level: 'subsection',
            resources: mathResources_7_2_1
          },
          {
            id: 'math_sub_7_2_2',
            title: '7.2.2 平行线的性质',
            level: 'subsection',
            resources: mathResources_7_2_2
          }
        ]
      }
    ]
  }
]

// ============================================
// 英语学科 Mock 数据
// ============================================

const englishResources_7_1: Resource[] = [
  {
    id: 'eng_v_7_1_1',
    type: 'video',
    title: 'Weather Vocabulary',
    tags: ['英语', '词汇'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 6,
    questionCount: 8,
    category: '概念课',
    difficulty: 1
  },
  {
    id: 'eng_v_7_1_2',
    type: 'video',
    title: 'Present Progressive Tense',
    tags: ['英语', '语法'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 10,
    questionCount: 10,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  {
    id: 'eng_guide_7_1',
    type: 'guide',
    title: 'Unit 7 学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 6,
    subject: '英语'
  },
  {
    id: 'eng_note_7_1',
    type: 'summary_note',
    title: '天气表达总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 12,
    subject: '英语'
  },
  {
    id: 'eng_practice_7_1',
    type: 'practice',
    title: 'Section A 同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: 'Section A',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 15
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'eng_hook_7_1',
    type: 'premium_hook',
    title: '现在进行时培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '语法专项突破',
    duration: 14,
    questionCount: 10,
    difficulty: 2
  }
]

const englishResources_7_2: Resource[] = [
  {
    id: 'eng_v_7_2_1',
    type: 'video',
    title: 'Describing Weather Conditions',
    tags: ['英语', '口语'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 8,
    questionCount: 6,
    category: '概念课',
    difficulty: 1
  },
  {
    id: 'eng_v_7_2_2',
    type: 'video',
    title: 'How Questions with Weather',
    tags: ['英语', '语法'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 8,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'eng_guide_7_2',
    type: 'guide',
    title: 'Section B 学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 5,
    subject: '英语'
  },
  // 修复：为 Section B 补充复习场景的笔记卡
  {
    id: 'eng_note_7_2',
    type: 'summary_note',
    title: '阅读理解答题技巧',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 8,
    subject: '英语'
  },
  {
    id: 'eng_practice_7_2',
    type: 'practice',
    title: 'Section B 同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: 'Section B',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 8
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'eng_hook_7_2',
    type: 'premium_hook',
    title: '阅读理解培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '阅读理解专项',
    duration: 16,
    questionCount: 8,
    difficulty: 2
  }
]

export const englishChapters: Chapter[] = [
  {
    id: 'eng_ch_7',
    title: "Unit 7 It's raining!",
    level: 'chapter',
    progress: { completed: 12, total: 20 },
    isExpanded: true,
    children: [
      {
        id: 'eng_sec_7_a',
        title: 'Section A',
        level: 'section',
        progress: { completed: 8, total: 10 },
        isExpanded: true,
        children: [
          {
            id: 'eng_sub_7_a_1',
            title: '1a-2d 天气词汇与对话',
            level: 'subsection',
            resources: englishResources_7_1
          }
        ]
      },
      {
        id: 'eng_sec_7_b',
        title: 'Section B',
        level: 'section',
        progress: { completed: 4, total: 10 },
        isExpanded: true,
        children: [
          {
            id: 'eng_sub_7_b_1',
            title: '1a-2c 阅读与写作',
            level: 'subsection',
            resources: englishResources_7_2
          }
        ]
      }
    ]
  }
]

// ============================================
// 语文学科 Mock 数据
// ============================================

const chineseResources_3_1: Resource[] = [
  {
    id: 'chn_v_3_1_1',
    type: 'video',
    title: '《从百草园到三味书屋》导读',
    tags: ['语文', '散文'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 10,
    questionCount: 5,
    category: '概念课',
    difficulty: 1
  },
  {
    id: 'chn_v_3_1_2',
    type: 'video',
    title: '鲁迅的童年记忆分析',
    tags: ['语文', '散文'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 15,
    questionCount: 6,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 2
  },
  {
    id: 'chn_read_3_1',
    type: 'read_text',
    title: '课文朗读：从百草园到三味书屋',
    tags: ['朗读'],
    isFree: true,
    scenes: ['preview'],
    paragraphCount: 12,
    estimatedTime: 8,
    subject: '语文'
  },
  {
    id: 'chn_guide_3_1',
    type: 'guide',
    title: '《从百草园到三味书屋》学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 6,
    subject: '语文'
  },
  {
    id: 'chn_note_3_1',
    type: 'summary_note',
    title: '鲁迅作品知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 15,
    subject: '语文'
  },
  {
    id: 'chn_practice_3_1',
    type: 'practice',
    title: '课文理解同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '《从百草园到三味书屋》',
    difficultyLevels: ['基础', '中等'],
    totalCount: 15,
    completedCount: 6
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'chn_hook_3_1',
    type: 'premium_hook',
    title: '散文阅读培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '现代文阅读专项',
    duration: 18,
    questionCount: 6,
    difficulty: 2
  }
]

const chineseResources_3_2: Resource[] = [
  {
    id: 'chn_v_3_2_1',
    type: 'video',
    title: '《爸爸的花儿落了》导读',
    tags: ['语文', '小说'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 8,
    questionCount: 4,
    category: '概念课',
    difficulty: 1
  },
  {
    id: 'chn_v_3_2_2',
    type: 'video',
    title: '林海音的叙事艺术',
    tags: ['语文', '小说'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 5,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'chn_read_3_2',
    type: 'read_text',
    title: '课文朗读：爸爸的花儿落了',
    tags: ['朗读'],
    isFree: true,
    scenes: ['preview'],
    paragraphCount: 18,
    estimatedTime: 10,
    subject: '语文'
  },
  {
    id: 'chn_guide_3_2',
    type: 'guide',
    title: '《爸爸的花儿落了》学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 5,
    subject: '语文'
  },
  {
    id: 'chn_note_3_2',
    type: 'summary_note',
    title: '叙事手法总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 10,
    subject: '语文'
  },
  {
    id: 'chn_practice_3_2',
    type: 'practice',
    title: '阅读理解同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '《爸爸的花儿落了》',
    difficultyLevels: ['基础', '中等'],
    totalCount: 18,
    completedCount: 3
  },
  // 新增：培优课钩子（加餐场景）
  {
    id: 'chn_hook_3_2',
    type: 'premium_hook',
    title: '叙事写作培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '拔高',
    targetCourse: '写作专项突破',
    duration: 20,
    questionCount: 5,
    difficulty: 3
  }
]

export const chineseChapters: Chapter[] = [
  {
    id: 'chn_ch_3',
    title: '第三单元 回忆性散文',
    level: 'chapter',
    progress: { completed: 6, total: 15 },
    isExpanded: true,
    children: [
      {
        id: 'chn_sec_3_1',
        title: '9 从百草园到三味书屋',
        level: 'section',
        progress: { completed: 4, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'chn_sub_3_1_1',
            title: '百草园的乐趣',
            level: 'subsection',
            resources: chineseResources_3_1
          }
        ]
      },
      {
        id: 'chn_sec_3_2',
        title: '10 爸爸的花儿落了',
        level: 'section',
        progress: { completed: 2, total: 7 },
        isExpanded: true,
        children: [
          {
            id: 'chn_sub_3_2_1',
            title: '成长的代价',
            level: 'subsection',
            resources: chineseResources_3_2
          }
        ]
      }
    ]
  }
]

// ============================================
// 历史学科 Mock 数据（文科代表）
// ============================================

const historyResources_1_1: Resource[] = [
  // 预习场景：读课文（文科特有）
  {
    id: 'his_read_1_1',
    type: 'read_text',
    title: '开国大典原文朗读',
    tags: ['朗读'],
    isFree: true,
    scenes: ['preview'],
    paragraphCount: 8,
    estimatedTime: 6,
    subject: '历史'
  },
  // 预习/复习场景：视频
  {
    id: 'his_v_1_1_1',
    type: 'video',
    title: '新中国成立的历史背景',
    tags: ['历史', '政治史'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 6,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  {
    id: 'his_v_1_1_2',
    type: 'video',
    title: '开国大典的历史意义',
    tags: ['历史', '政治史'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 15,
    questionCount: 8,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习场景：学案
  {
    id: 'his_guide_1_1',
    type: 'guide',
    title: '新中国成立学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 4,
    subject: '历史'
  },
  // 复习场景：笔记卡
  {
    id: 'his_note_1_1',
    type: 'summary_note',
    title: '新中国成立知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 12,
    subject: '历史'
  },
  // 加餐场景：同步刷题
  {
    id: 'his_practice_1_1',
    type: 'practice',
    title: '新中国成立同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '第1课 中华人民共和国成立',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 8
  },
  // 加餐场景：培优课钩子
  {
    id: 'his_hook_1_1',
    type: 'premium_hook',
    title: '建国史培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '中国近现代史专项',
    duration: 16,
    questionCount: 8,
    difficulty: 2
  }
]

const historyResources_1_2: Resource[] = [
  // 预习场景：读课文（文科特有）
  {
    id: 'his_read_1_2',
    type: 'read_text',
    title: '抗美援朝战争纪实朗读',
    tags: ['朗读'],
    isFree: true,
    scenes: ['preview'],
    paragraphCount: 10,
    estimatedTime: 8,
    subject: '历史'
  },
  // 预习/复习场景：视频
  {
    id: 'his_v_1_2_1',
    type: 'video',
    title: '抗美援朝的历史背景',
    tags: ['历史', '军事史'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 14,
    questionCount: 7,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  {
    id: 'his_v_1_2_2',
    type: 'video',
    title: '抗美援朝的伟大胜利',
    tags: ['历史', '军事史'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 16,
    questionCount: 9,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习场景：学案
  {
    id: 'his_guide_1_2',
    type: 'guide',
    title: '抗美援朝学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 5,
    subject: '历史'
  },
  // 复习场景：笔记卡
  {
    id: 'his_note_1_2',
    type: 'summary_note',
    title: '抗美援朝战争知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 15,
    subject: '历史'
  },
  // 加餐场景：同步刷题
  {
    id: 'his_practice_1_2',
    type: 'practice',
    title: '抗美援朝同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '第2课 抗美援朝',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 5
  },
  // 加餐场景：培优课钩子
  {
    id: 'his_hook_1_2',
    type: 'premium_hook',
    title: '新中国外交培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '拔高',
    targetCourse: '外交史专项突破',
    duration: 14,
    questionCount: 6,
    difficulty: 3
  }
]

export const historyChapters: Chapter[] = [
  {
    id: 'his_ch_1',
    title: '第一单元 中华人民共和国的成立和巩固',
    level: 'chapter',
    progress: { completed: 5, total: 18 },
    isExpanded: true,
    children: [
      {
        id: 'his_sec_1_1',
        title: '第1课 中华人民共和国成立',
        level: 'section',
        progress: { completed: 3, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'his_sub_1_1_1',
            title: '开国大典',
            level: 'subsection',
            resources: historyResources_1_1
          }
        ]
      },
      {
        id: 'his_sec_1_2',
        title: '第2课 抗美援朝',
        level: 'section',
        progress: { completed: 2, total: 10 },
        isExpanded: true,
        children: [
          {
            id: 'his_sub_1_2_1',
            title: '保家卫国',
            level: 'subsection',
            resources: historyResources_1_2
          }
        ]
      }
    ]
  }
]

// ============================================
// 物理学科 Mock 数据（理科代表）
// ============================================

const physicsResources_1_1: Resource[] = [
  // 预习/复习场景：视频
  {
    id: 'phy_v_1_1_1',
    type: 'video',
    title: '声音是怎样产生的',
    tags: ['物理', '声学'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 10,
    questionCount: 5,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  {
    id: 'phy_v_1_1_2',
    type: 'video',
    title: '声音的传播条件',
    tags: ['物理', '声学'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 12,
    questionCount: 6,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习场景：学案
  {
    id: 'phy_guide_1_1',
    type: 'guide',
    title: '声音产生与传播学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 4,
    subject: '物理'
  },
  // 复习场景：笔记卡
  {
    id: 'phy_note_1_1',
    type: 'summary_note',
    title: '声波传播知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 10,
    subject: '物理'
  },
  // 加餐场景：同步刷题
  {
    id: 'phy_practice_1_1',
    type: 'practice',
    title: '声音产生同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '1.1 声音的产生与传播',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 22,
    completedCount: 10
  },
  // 加餐场景：培优课钩子
  {
    id: 'phy_hook_1_1',
    type: 'premium_hook',
    title: '声学实验培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '重难点',
    targetCourse: '物理实验专项',
    duration: 18,
    questionCount: 7,
    difficulty: 2
  }
]

const physicsResources_1_2: Resource[] = [
  // 预习/复习场景：视频
  {
    id: 'phy_v_1_2_1',
    type: 'video',
    title: '声音的三要素',
    tags: ['物理', '声学'],
    isFree: true,
    scenes: ['preview', 'review'],
    duration: 11,
    questionCount: 6,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  {
    id: 'phy_v_1_2_2',
    type: 'video',
    title: '音调与频率的关系',
    tags: ['物理', '声学'],
    isFree: false,
    scenes: ['preview', 'review'],
    duration: 14,
    questionCount: 8,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习场景：学案
  {
    id: 'phy_guide_1_2',
    type: 'guide',
    title: '声音特性学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['review'],
    pageCount: 5,
    subject: '物理'
  },
  // 复习场景：笔记卡
  {
    id: 'phy_note_1_2',
    type: 'summary_note',
    title: '音调响度音色总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['review'],
    noteCount: 12,
    subject: '物理'
  },
  // 加餐场景：同步刷题
  {
    id: 'phy_practice_1_2',
    type: 'practice',
    title: '声音特性同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['extra'],
    subsectionTitle: '1.2 声音的特性',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 28,
    completedCount: 6
  },
  // 加餐场景：培优课钩子
  {
    id: 'phy_hook_1_2',
    type: 'premium_hook',
    title: '声学计算培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['extra'],
    hookType: '拔高',
    targetCourse: '物理计算专项',
    duration: 15,
    questionCount: 9,
    difficulty: 3
  }
]

export const physicsChapters: Chapter[] = [
  {
    id: 'phy_ch_1',
    title: '第一章 声现象',
    level: 'chapter',
    progress: { completed: 6, total: 16 },
    isExpanded: true,
    children: [
      {
        id: 'phy_sec_1_1',
        title: '1.1 声音的产生与传播',
        level: 'section',
        progress: { completed: 4, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'phy_sub_1_1_1',
            title: '声音的产生',
            level: 'subsection',
            resources: physicsResources_1_1
          }
        ]
      },
      {
        id: 'phy_sec_1_2',
        title: '1.2 声音的特性',
        level: 'section',
        progress: { completed: 2, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'phy_sub_1_2_1',
            title: '音调、响度和音色',
            level: 'subsection',
            resources: physicsResources_1_2
          }
        ]
      }
    ]
  }
]

// ============================================
// 统一数据访问接口
// ============================================

export const chaptersBySubject: Record<SubjectType, Chapter[]> = {
  '数学': mathChapters,
  '英语': englishChapters,
  '语文': chineseChapters,
  '历史': historyChapters,
  '地理': [], // 可扩展（结构与历史相同）
  '政治': [], // 可扩展（结构与历史相同）
  '物理': physicsChapters,
  '化学': [], // 可扩展（结构与物理相同）
  '生物': []  // 可扩展（结构与物理相同）
}

// 兼容旧代码
export const mockChapters = mathChapters

// ============================================
// 用户进度 Mock
// ============================================

export const mockProgressMap: Record<string, UserProgress> = {
  'math_v_7_1_1_1': { nodeId: 'math_v_7_1_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-30T10:00:00Z' },
  'math_v_7_1_1_2': { nodeId: 'math_v_7_1_1_2', status: 'in_progress', percentage: 45, lastUpdateTime: '2025-12-30T11:00:00Z' },
  'math_v_7_1_2_1': { nodeId: 'math_v_7_1_2_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-29T15:00:00Z' },
  'eng_v_7_1_1': { nodeId: 'eng_v_7_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-30T09:00:00Z' },
  'eng_v_7_1_2': { nodeId: 'eng_v_7_1_2', status: 'in_progress', percentage: 60, lastUpdateTime: '2025-12-30T10:00:00Z' },
  'chn_v_3_1_1': { nodeId: 'chn_v_3_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-28T14:00:00Z' },
  'chn_v_3_1_2': { nodeId: 'chn_v_3_1_2', status: 'in_progress', percentage: 30, lastUpdateTime: '2025-12-29T16:00:00Z' }
}

// ============================================
// 章节级资源统计
// ============================================

export const chapterLevelStats: Record<SubjectType, {
  mindMapCount: number
  errorBookCount: number
  vocabWordCount?: number
}> = {
  '数学': { mindMapCount: 2, errorBookCount: 15 },
  '英语': { mindMapCount: 1, errorBookCount: 8, vocabWordCount: 45 },
  '语文': { mindMapCount: 2, errorBookCount: 10 },
  '历史': { mindMapCount: 1, errorBookCount: 6 },
  '地理': { mindMapCount: 0, errorBookCount: 0 },
  '政治': { mindMapCount: 0, errorBookCount: 0 },
  '物理': { mindMapCount: 1, errorBookCount: 12 },
  '化学': { mindMapCount: 0, errorBookCount: 0 },
  '生物': { mindMapCount: 0, errorBookCount: 0 }
}
