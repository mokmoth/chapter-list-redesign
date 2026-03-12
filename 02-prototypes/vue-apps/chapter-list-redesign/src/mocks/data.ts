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
    stageId: 2,       // 初中
    subjectId: 2,     // 数学
    publisherId: 2,   // 人教版
    semesterId: 2,    // 下册
    subject: '数学',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '数学 人教版七年级下册'
  },
  {
    id: 'english_rj_7b',
    stageId: 2,       // 初中
    subjectId: 3,     // 英语
    publisherId: 2,   // 人教版
    semesterId: 2,    // 下册
    subject: '英语',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '英语 人教版七年级下册'
  },
  {
    id: 'chinese_rj_7b',
    stageId: 2,       // 初中
    subjectId: 4,     // 语文
    publisherId: 2,   // 人教版
    semesterId: 2,    // 下册
    subject: '语文',
    version: '人教版',
    grade: '七年级',
    semester: '下册',
    displayName: '语文 人教版七年级下册'
  },
  // 新增：历史（文科代表）
  {
    id: 'history_tb_8a',
    stageId: 2,       // 初中
    subjectId: 7,     // 历史
    publisherId: 1,   // 统编版
    semesterId: 1,    // 上册
    subject: '历史',
    version: '统编版',
    grade: '八年级',
    semester: '上册',
    displayName: '历史 统编版八年级上册'
  },
  // 新增：物理（理科代表）
  {
    id: 'physics_rj_8a',
    stageId: 2,       // 初中
    subjectId: 5,     // 物理
    publisherId: 2,   // 人教版
    semesterId: 1,    // 上册
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
  // 理科解题型：预习 / 解题指导 / 刷题
  '数学': {
    preview: '预习建议：重点关注概念定义和公式推导，尝试自己画图理解几何关系。',
    problem_solving: '解题指导：学习典型解题方法，掌握常见题型的解题步骤和技巧。',
    drill: '刷题建议：从基础题入手，逐步挑战中等和困难题目，注意错题整理。',
    all: '课程特点：本章重点在于培养几何直观能力和逻辑推理能力，从基础概念到复杂证明层层递进。'
  },
  '物理': {
    preview: '预习建议：关注物理现象和概念定义，理解公式推导。',
    problem_solving: '解题指导：掌握物理解题的分析方法，学会画受力图和过程分析。',
    drill: '刷题建议：多做实验分析题和计算题，注意单位换算。',
    all: '课程特点：以实验为基础，从生活现象入手，引导学生探索声学奥秘，培养科学探究精神。'
  },
  '化学': {
    preview: '预习建议：预习化学方程式，了解反应原理。',
    problem_solving: '解题指导：掌握化学计算方法，学会分析实验现象与结论。',
    drill: '刷题建议：多做推断题和实验题，注意总结反应规律。',
    all: '课程特点：注重实验探究和微观分析，帮助学生建立化学基本观念，掌握物质变化规律。'
  },
  // 语言文科型：预习 / 复习 / 日常积累
  '语文': {
    preview: '预习建议：朗读课文，了解作者背景，标注生字词，浏览学案和笔记卡。',
    review: '复习建议：梳理文章结构，积累优美语句，完成同步练习巩固理解。',
    accumulation: '日常积累：观看拓展视频，积累文学常识和写作素材。',
    all: '课程特点：精选经典回忆性散文，引导学生体会作者情感，学习叙事手法和描写技巧。'
  },
  '英语': {
    preview: '预习建议：先预习单词，了解课文大意，浏览学案标记不理解的句子。',
    review: '复习建议：背诵重点句型，整理语法知识点，完成同步练习。',
    accumulation: '日常积累：观看拓展视频，每日背单词，积累地道表达。',
    all: '课程特点：以天气话题为核心，通过对话和阅读全面提升听说读写能力，掌握现在进行时的用法。'
  },
  // 理科基础型：预习 / 复习
  '生物': {
    preview: '预习建议：了解生物概念，关注图表信息，尝试做基础练习。',
    review: '复习建议：梳理知识网络，完成中等难度以上的练习题。',
    all: '课程特点：图文并茂，理论联系实际，帮助学生构建完整的生物知识体系，关注生命科学发展。'
  },
  '地理': {
    preview: '预习建议：结合地图理解地理概念，关注区位特征。',
    review: '复习建议：总结地理规律，完成同步练习，多看图分析。',
    all: '课程特点：强调地图技能的运用，结合实际案例分析地理现象，培养综合思维。'
  },
  // 暂未上线筛选
  '历史': {
    preview: '预习建议：了解历史背景，梳理时间线，关注重要人物和事件。',
    review: '复习建议：对比分析历史事件的因果关系，完成同步练习。',
    all: '课程特点：通过对新中国成立初期重大历史事件的学习，培养唯物史观和家国情怀。'
  },
  '政治': {
    preview: '预习建议：了解基本概念，关注时事热点。',
    review: '复习建议：梳理知识框架，多做主观题练习。',
    all: '课程特点：结合社会热点和生活实际，深入浅出地讲解政治概念，提升法治意识。'
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
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 8,
    questionCount: 5,
    category: '概念课',
    valueTag: '必看',
    difficulty: 1,
    firstPublishAt: '2026-03-08T10:00:00Z',
    isContainNote: true,
    videoTimepoint: 180
  },
  {
    id: 'math_v_7_1_1_2',
    type: 'video',
    title: '对顶角的性质与应用',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 10,
    questionCount: 6,
    category: '解题课',
    difficulty: 2,
    firstPublishAt: '2026-03-05T10:00:00Z',
    isContainNote: true
  },
  {
    id: 'math_practice_7_1_1',
    type: 'practice',
    title: '相交线同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '7.1.1 相交线',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 8
  }
]

const mathResources_7_1_2: Resource[] = [
  {
    id: 'math_v_7_1_2_1',
    type: 'video',
    title: '邻补角的定义与识别',
    tags: ['数学', '几何'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
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
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 12,
    questionCount: 5,
    category: '解题课',
    difficulty: 2,
    isTrial: true
  },
  {
    id: 'math_practice_7_1_2',
    type: 'practice',
    title: '邻补角同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '7.1.2 邻补角',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 20,
    completedCount: 5
  }
]

const mathResources_7_2_1: Resource[] = [
  {
    id: 'math_v_7_2_1_1',
    type: 'video',
    title: '平行线的三种判定方法',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview'],                       // 概念课 → 预习
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
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 10,
    questionCount: 5,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'math_practice_7_2_1',
    type: 'practice',
    title: '平行线判定同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '7.2.1 平行线的判定',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 30,
    completedCount: 12
  }
]

const mathResources_7_2_2: Resource[] = [
  {
    id: 'math_v_7_2_2_1',
    type: 'video',
    title: '平行线的性质定理',
    tags: ['数学', '几何'],
    isFree: false,
    scenes: ['preview'],                       // 概念课 → 预习
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
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 14,
    questionCount: 7,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 3
  },
  {
    id: 'math_practice_7_2_2',
    type: 'practice',
    title: '平行线性质同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '7.2.2 平行线的性质',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 28,
    completedCount: 0
  }
]

// ---- 第六章：实数 资源 ----

const mathResources_6_1_1: Resource[] = [
  {
    id: 'math_v_6_1_1_1',
    type: 'video',
    title: '平方根的概念',
    tags: ['数学', '数与式'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 10,
    questionCount: 5,
    category: '概念课',
    valueTag: '必看',
    difficulty: 1
  },
  {
    id: 'math_v_6_1_1_2',
    type: 'video',
    title: '算术平方根与平方根的区别',
    tags: ['数学', '数与式'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 12,
    questionCount: 6,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'math_practice_6_1_1',
    type: 'practice',
    title: '平方根同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '6.1.1 平方根',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 30,
    completedCount: 22
  }
]

const mathResources_6_1_2: Resource[] = [
  {
    id: 'math_v_6_1_2_1',
    type: 'video',
    title: '立方根的概念与运算',
    tags: ['数学', '数与式'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 9,
    questionCount: 4,
    category: '概念课',
    difficulty: 1
  },
  {
    id: 'math_v_6_1_2_2',
    type: 'video',
    title: '开方运算的注意事项',
    tags: ['数学', '数与式'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 11,
    questionCount: 5,
    category: '解题课',
    valueTag: '考点',
    difficulty: 2
  },
  {
    id: 'math_practice_6_1_2',
    type: 'practice',
    title: '立方根同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '6.1.2 立方根',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 15
  }
]

const mathResources_6_2_1: Resource[] = [
  {
    id: 'math_v_6_2_1_1',
    type: 'video',
    title: '无理数的概念',
    tags: ['数学', '数与式'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 8,
    questionCount: 4,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  {
    id: 'math_v_6_2_1_2',
    type: 'video',
    title: '实数的分类体系',
    tags: ['数学', '数与式'],
    isFree: false,
    scenes: ['preview'],                       // 概念课 → 预习（重点概念）
    duration: 14,
    questionCount: 7,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  {
    id: 'math_practice_6_2_1',
    type: 'practice',
    title: '实数分类同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '6.2.1 实数',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 18
  }
]

// ---- 第八章：二元一次方程组 资源 ----

const mathResources_8_1_1: Resource[] = [
  {
    id: 'math_v_8_1_1_1',
    type: 'video',
    title: '二元一次方程组的概念',
    tags: ['数学', '方程'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 10,
    questionCount: 5,
    category: '概念课',
    valueTag: '必看',
    difficulty: 1,
    firstPublishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isContainNote: true
  },
  {
    id: 'math_v_8_1_1_2',
    type: 'video',
    title: '方程组的解的意义',
    tags: ['数学', '方程'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 8,
    questionCount: 4,
    category: '解题课',
    difficulty: 1,
    firstPublishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'math_practice_8_1_1',
    type: 'practice',
    title: '二元一次方程组同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '8.1.1 二元一次方程组',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 0,
    firstPublishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const mathResources_8_2_1: Resource[] = [
  {
    id: 'math_v_8_2_1_1',
    type: 'video',
    title: '代入消元法',
    tags: ['数学', '方程'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 12,
    questionCount: 6,
    category: '概念课',
    valueTag: '考点',
    difficulty: 2,
    firstPublishAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'math_v_8_2_1_2',
    type: 'video',
    title: '加减消元法',
    tags: ['数学', '方程'],
    isFree: false,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 14,
    questionCount: 7,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2,
    firstPublishAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'math_v_8_2_1_3',
    type: 'video',
    title: '消元法的综合应用',
    tags: ['数学', '方程'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 16,
    questionCount: 8,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 3
  },
  {
    id: 'math_practice_8_2_1',
    type: 'practice',
    title: '消元法同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '8.2.1 消元——解二元一次方程组',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 35,
    completedCount: 0
  }
]

const mathResources_8_3_1: Resource[] = [
  {
    id: 'math_v_8_3_1_1',
    type: 'video',
    title: '列方程组解应用题的步骤',
    tags: ['数学', '方程'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 13,
    questionCount: 5,
    category: '概念课',
    valueTag: '考点',
    difficulty: 2
  },
  {
    id: 'math_v_8_3_1_2',
    type: 'video',
    title: '行程与工程问题',
    tags: ['数学', '方程'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 18,
    questionCount: 8,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 3
  },
  {
    id: 'math_practice_8_3_1',
    type: 'practice',
    title: '实际问题与方程组同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '8.3 实际问题与二元一次方程组',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 28,
    completedCount: 0
  }
]

export const mathChapters: Chapter[] = [
  // ---- 第六章 ----
  {
    id: 'math_ch_6',
    title: '第六章 实数',
    level: 'chapter',
    progress: { completed: 18, total: 22 },
    isExpanded: false,
    children: [
      {
        id: 'math_sec_6_1',
        title: '6.1 平方根与立方根',
        level: 'section',
        progress: { completed: 12, total: 14 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_6_1_1',
            title: '6.1.1 平方根',
            level: 'subsection',
            resources: mathResources_6_1_1
          },
          {
            id: 'math_sub_6_1_2',
            title: '6.1.2 立方根',
            level: 'subsection',
            resources: mathResources_6_1_2
          }
        ]
      },
      {
        id: 'math_sec_6_2',
        title: '6.2 实数',
        level: 'section',
        progress: { completed: 6, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_6_2_1',
            title: '6.2.1 实数',
            level: 'subsection',
            resources: mathResources_6_2_1
          }
        ]
      }
    ]
  },
  // ---- 第七章（原有） ----
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
            firstPublishAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
  },
  // ---- 第八章 ----
  {
    id: 'math_ch_8',
    title: '第八章 二元一次方程组',
    level: 'chapter',
    progress: { completed: 0, total: 28 },
    isExpanded: false,
    isHaveNew: true,
    children: [
      {
        id: 'math_sec_8_1',
        title: '8.1 二元一次方程组',
        level: 'section',
        progress: { completed: 0, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_8_1_1',
            title: '8.1.1 二元一次方程组',
            level: 'subsection',
            firstPublishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            resources: mathResources_8_1_1
          }
        ]
      },
      {
        id: 'math_sec_8_2',
        title: '8.2 消元——解二元一次方程组',
        level: 'section',
        progress: { completed: 0, total: 12 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_8_2_1',
            title: '8.2.1 代入消元法与加减消元法',
            level: 'subsection',
            firstPublishAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            resources: mathResources_8_2_1
          }
        ]
      },
      {
        id: 'math_sec_8_3',
        title: '8.3 实际问题与二元一次方程组',
        level: 'section',
        progress: { completed: 0, total: 8 },
        isExpanded: true,
        children: [
          {
            id: 'math_sub_8_3_1',
            title: '8.3.1 列方程组解应用题',
            level: 'subsection',
            resources: mathResources_8_3_1
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
  // 预习：视频 + 学案
  {
    id: 'eng_v_7_1_1',
    type: 'video',
    title: 'Weather Vocabulary',
    tags: ['英语', '词汇'],
    isFree: true,
    scenes: ['preview', 'review'],             // 预习+复习 都展示视频
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
    scenes: ['preview', 'review'],             // 预习+复习 都展示视频
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
    scenes: ['preview'],                       // 学案 → 预习
    pageCount: 6,
    subject: '英语'
  },
  // 复习：同步刷题 + 培优课钩子
  {
    id: 'eng_practice_7_1',
    type: 'practice',
    title: 'Section A 同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: 'Section A',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 15
  },
  {
    id: 'eng_hook_7_1',
    type: 'premium_hook',
    title: '现在进行时培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['review'],                        // 培优课钩子 → 复习
    hookType: '重难点',
    targetCourse: '语法专项突破',
    duration: 14,
    questionCount: 10,
    difficulty: 2
  },
  // 日常积累：视频（积累性学习）
  {
    id: 'eng_v_7_1_acc',
    type: 'video',
    title: '天气相关地道表达',
    tags: ['英语', '日常积累'],
    isFree: true,
    scenes: ['accumulation'],                  // 积累性视频 → 日常积累
    duration: 5,
    questionCount: 0,
    category: '概念课',
    difficulty: 1
  }
]

const englishResources_7_2: Resource[] = [
  // 预习：视频 + 学案
  {
    id: 'eng_v_7_2_1',
    type: 'video',
    title: 'Describing Weather Conditions',
    tags: ['英语', '口语'],
    isFree: true,
    scenes: ['preview', 'review'],             // 预习+复习
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
    scenes: ['preview', 'review'],             // 预习+复习
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
    scenes: ['preview'],                       // 学案 → 预习
    pageCount: 5,
    subject: '英语'
  },
  // 复习：同步刷题 + 培优课钩子
  {
    id: 'eng_practice_7_2',
    type: 'practice',
    title: 'Section B 同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: 'Section B',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 8
  },
  {
    id: 'eng_hook_7_2',
    type: 'premium_hook',
    title: '阅读理解培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['review'],                        // 培优课钩子 → 复习
    hookType: '重难点',
    targetCourse: '阅读理解专项',
    duration: 16,
    questionCount: 8,
    difficulty: 2
  },
  // 日常积累：视频 + 背单词
  {
    id: 'eng_v_7_2_acc',
    type: 'video',
    title: '英语天气话题口语练习',
    tags: ['英语', '日常积累'],
    isFree: true,
    scenes: ['accumulation'],                  // 积累性视频 → 日常积累
    duration: 6,
    questionCount: 0,
    category: '概念课',
    difficulty: 1
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
  // 预习：视频 + 学案 + 笔记卡
  {
    id: 'chn_v_3_1_1',
    type: 'video',
    title: '《从百草园到三味书屋》导读',
    tags: ['语文', '散文'],
    isFree: true,
    scenes: ['preview', 'review'],             // 预习+复习 都展示视频
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
    scenes: ['preview', 'review'],             // 预习+复习（能力向）
    duration: 15,
    questionCount: 6,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 2
  },
  {
    id: 'chn_guide_3_1',
    type: 'guide',
    title: '《从百草园到三味书屋》学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['preview', 'review'],             // 学案 → 预习+复习
    pageCount: 6,
    subject: '语文'
  },
  {
    id: 'chn_note_3_1',
    type: 'summary_note',
    title: '鲁迅作品知识总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['preview'],                       // 笔记卡 → 预习（初中语文特有）
    noteCount: 15,
    subject: '语文'
  },
  // 复习：同步刷题 + 培优课钩子
  {
    id: 'chn_practice_3_1',
    type: 'practice',
    title: '课文理解同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: '《从百草园到三味书屋》',
    difficultyLevels: ['基础', '中等'],
    totalCount: 15,
    completedCount: 6
  },
  {
    id: 'chn_hook_3_1',
    type: 'premium_hook',
    title: '散文阅读培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['review'],                        // 培优课钩子 → 复习
    hookType: '重难点',
    targetCourse: '现代文阅读专项',
    duration: 18,
    questionCount: 6,
    difficulty: 2
  },
  // 日常积累：视频
  {
    id: 'chn_v_3_1_acc',
    type: 'video',
    title: '鲁迅生平与创作背景',
    tags: ['语文', '日常积累'],
    isFree: true,
    scenes: ['accumulation'],                  // 积累性视频 → 日常积累
    duration: 8,
    questionCount: 0,
    category: '概念课',
    difficulty: 1
  }
]

const chineseResources_3_2: Resource[] = [
  // 预习：视频 + 学案 + 笔记卡
  {
    id: 'chn_v_3_2_1',
    type: 'video',
    title: '《爸爸的花儿落了》导读',
    tags: ['语文', '小说'],
    isFree: true,
    scenes: ['preview', 'review'],             // 预习+复习
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
    scenes: ['preview', 'review'],             // 预习+复习（能力向）
    duration: 12,
    questionCount: 5,
    category: '解题课',
    difficulty: 2
  },
  {
    id: 'chn_guide_3_2',
    type: 'guide',
    title: '《爸爸的花儿落了》学案',
    tags: ['学案'],
    isFree: true,
    scenes: ['preview', 'review'],             // 学案 → 预习+复习
    pageCount: 5,
    subject: '语文'
  },
  {
    id: 'chn_note_3_2',
    type: 'summary_note',
    title: '叙事手法总结',
    tags: ['笔记'],
    isFree: true,
    scenes: ['preview'],                       // 笔记卡 → 预习
    noteCount: 10,
    subject: '语文'
  },
  // 复习：同步刷题 + 培优课钩子
  {
    id: 'chn_practice_3_2',
    type: 'practice',
    title: '阅读理解同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: '《爸爸的花儿落了》',
    difficultyLevels: ['基础', '中等'],
    totalCount: 18,
    completedCount: 3
  },
  {
    id: 'chn_hook_3_2',
    type: 'premium_hook',
    title: '叙事写作培优专题',
    tags: ['培优'],
    isFree: false,
    scenes: ['review'],                        // 培优课钩子 → 复习
    hookType: '拔高',
    targetCourse: '写作专项突破',
    duration: 20,
    questionCount: 5,
    difficulty: 3
  },
  // 日常积累：视频
  {
    id: 'chn_v_3_2_acc',
    type: 'video',
    title: '林海音与台湾文学',
    tags: ['语文', '日常积累'],
    isFree: true,
    scenes: ['accumulation'],                  // 积累性视频 → 日常积累
    duration: 7,
    questionCount: 0,
    category: '概念课',
    difficulty: 1
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
  // 预习：视频
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
  {
    id: 'his_v_1_1_1',
    type: 'video',
    title: '新中国成立的历史背景',
    tags: ['历史', '政治史'],
    isFree: true,
    scenes: ['preview'],                       // 预习
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
    scenes: ['preview', 'review'],             // 预习+复习
    duration: 15,
    questionCount: 8,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习：同步刷题
  {
    id: 'his_practice_1_1',
    type: 'practice',
    title: '新中国成立同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: '第1课 中华人民共和国成立',
    difficultyLevels: ['基础', '中等'],
    totalCount: 20,
    completedCount: 8
  }
]

const historyResources_1_2: Resource[] = [
  // 预习：读课文 + 视频
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
  {
    id: 'his_v_1_2_1',
    type: 'video',
    title: '抗美援朝的历史背景',
    tags: ['历史', '军事史'],
    isFree: true,
    scenes: ['preview'],                       // 预习
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
    scenes: ['preview', 'review'],             // 预习+复习
    duration: 16,
    questionCount: 9,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 复习：同步刷题
  {
    id: 'his_practice_1_2',
    type: 'practice',
    title: '抗美援朝同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['review'],                        // 同步刷题 → 复习
    subsectionTitle: '第2课 抗美援朝',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 25,
    completedCount: 5
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
  // 预习：视频（概念课）
  {
    id: 'phy_v_1_1_1',
    type: 'video',
    title: '声音是怎样产生的',
    tags: ['物理', '声学'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
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
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 12,
    questionCount: 6,
    category: '概念课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 刷题：同步刷题
  {
    id: 'phy_practice_1_1',
    type: 'practice',
    title: '声音产生同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '1.1 声音的产生与传播',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 22,
    completedCount: 10
  }
]

const physicsResources_1_2: Resource[] = [
  // 预习：视频（概念课）
  {
    id: 'phy_v_1_2_1',
    type: 'video',
    title: '声音的三要素',
    tags: ['物理', '声学'],
    isFree: true,
    scenes: ['preview'],                       // 概念课 → 预习
    duration: 11,
    questionCount: 6,
    category: '概念课',
    valueTag: '考点',
    difficulty: 1
  },
  // 解题指导：视频（解题课）
  {
    id: 'phy_v_1_2_2',
    type: 'video',
    title: '音调与频率的关系',
    tags: ['物理', '声学'],
    isFree: false,
    scenes: ['problem_solving'],               // 解题课 → 解题指导
    duration: 14,
    questionCount: 8,
    category: '解题课',
    valueTag: '重难点',
    difficulty: 2
  },
  // 刷题：同步刷题
  {
    id: 'phy_practice_1_2',
    type: 'practice',
    title: '声音特性同步刷题',
    tags: ['刷题'],
    isFree: true,
    scenes: ['drill'],                         // 同步刷题 → 刷题
    subsectionTitle: '1.2 声音的特性',
    difficultyLevels: ['基础', '中等', '困难'],
    totalCount: 28,
    completedCount: 6
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
  // 第六章（已完成大部分）
  'math_v_6_1_1_1': { nodeId: 'math_v_6_1_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-20T10:00:00Z' },
  'math_v_6_1_1_2': { nodeId: 'math_v_6_1_1_2', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-20T14:00:00Z' },
  'math_v_6_1_2_1': { nodeId: 'math_v_6_1_2_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-21T09:00:00Z' },
  'math_v_6_1_2_2': { nodeId: 'math_v_6_1_2_2', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-21T11:00:00Z' },
  'math_v_6_2_1_1': { nodeId: 'math_v_6_2_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-22T10:00:00Z' },
  'math_v_6_2_1_2': { nodeId: 'math_v_6_2_1_2', status: 'in_progress', percentage: 75, lastUpdateTime: '2025-12-22T14:00:00Z' },
  // 第七章（学到一半）
  'math_v_7_1_1_1': { nodeId: 'math_v_7_1_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-30T10:00:00Z' },
  'math_v_7_1_1_2': { nodeId: 'math_v_7_1_1_2', status: 'in_progress', percentage: 45, lastUpdateTime: '2025-12-30T11:00:00Z' },
  'math_v_7_1_2_1': { nodeId: 'math_v_7_1_2_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-29T15:00:00Z' },
  // 第八章（全新，无进度）
  // 英语
  'eng_v_7_1_1': { nodeId: 'eng_v_7_1_1', status: 'completed', percentage: 100, lastUpdateTime: '2025-12-30T09:00:00Z' },
  'eng_v_7_1_2': { nodeId: 'eng_v_7_1_2', status: 'in_progress', percentage: 60, lastUpdateTime: '2025-12-30T10:00:00Z' },
  // 语文
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
