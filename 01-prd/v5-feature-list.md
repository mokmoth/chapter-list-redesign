# V5.x 功能点清单

> **项目**：章节列表页迭代
> **基于**：可交互原型反向工程 + 分学科筛选逻辑确认稿
> **原型路径**：`02-prototypes/vue-apps/chapter-list-redesign/`
> **创建日期**：2025-12-31
> **最后更新**：2026-03-17（v1.7 同步：分学科场景筛选逻辑确认）

---

## 功能点拆解来源

基于已实现的 Vue3 + TypeScript 可交互原型，并结合已确认的分学科筛选逻辑（`章节列表页2026改版-分学科筛选逻辑汇总.xlsx`，18 学科全部确认 ✅），按以下页面结构拆解功能点：

```
顶部区域 (GlobalHeader + FunctionBar)
    ├── 返回按钮 + VIP升级入口
    ├── 场景Tab (SceneTabs)
    └── 功能栏 (教材选择 + 快捷入口)

主内容区域 (MainLayout)
    ├── 侧边栏 (Sidebar + ChapterTree)
    │   ├── 章节标题 + 切换按钮
    │   └── 章节目录树
    └── 资源列表区 (ResourceList)
        ├── 学习方法指南 (LearningGuide)
        └── 资源卡片组 (多种卡片类型)
```

---

## 功能点清单

### 模块 A：页面整体布局

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| A1 | 页面响应式布局框架 | P0 | - | `ChapterList.vue` | ✅ |
| A2 | 移动端侧边栏抽屉 | P0 | A1 | `ChapterList.vue` | ✅ |
| A3 | 侧边栏拉手交互（黄金分割定位 61.8%） | P1 | A2 | `ChapterList.vue` | ✅ |
| A4 | 加载状态展示 | P0 | A1 | `ChapterList.vue` | ✅ |
| A5 | 左右联动滚动同步 | P1 | A1 | `ChapterList.vue` + Store | ✅ |

**响应式断点**：
- 桌面端 (≥768px)：左侧目录固定展示，右侧资源列表
- 移动端 (<768px)：目录收起为抽屉，通过拉手触发
- 小屏手机 (<480px)：FunctionBar 快捷操作收纳至汉堡菜单

### 模块 B：顶部导航区域

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| B1 | 全局头部 (返回+VIP) | P0 | - | `GlobalHeader.vue` | ✅ |
| B2 | VIP 状态展示与升级入口 | P0 | B1 | `GlobalHeader.vue` | ✅ |
| B3 | 场景 Tab 切换 | P0 | - | `SceneTabs.vue` | ✅ |
| B4 | Tab 嵌入模式样式 | P0 | B3 | `SceneTabs.vue` | ✅ |
| B5 | 教材信息选择器 | P0 | - | `FunctionBar.vue` | ✅ |
| B6 | 快捷功能入口 (学霸笔记/错题/收藏) | P1 | B5 | `FunctionBar.vue` | ✅ |
| B7 | 移动端更多菜单收纳 | P1 | B6 | `FunctionBar.vue` | ✅ |
| B8 | 学科差异化 Scene Tab 配置 | P1 | B3 | `SCENE_CONFIG` + Store | ✅ |
| B9 | 章节级资源统计 badge（思维导图/错题本数量） | P1 | B6 | `FunctionBar.vue` + Store | ✅ |

**场景 Tab 定义**（v1.7 更新：按学段+学科确认 5 种模板）：

| SceneType | 中文名 | 说明 |
|-----------|-------|------|
| `preview` | 预习 | 课前预习相关资源 |
| `review` | 复习 | 复习巩固相关资源 |
| `problem_solving` | 解题指导 | 解题类视频（仅高中理科） |
| `drill` | 刷题 | 同步刷题（仅高中理科） |
| `accumulation` | 日常积累 | 积累性学习（仅文科语言类） |
| `extra` | 加餐 | 加餐拓展资源（同步刷题 + 培优课钩子） |

**场景 Tab 学科模板**（v1.7 确认）：

| 模板 | 适用范围 | Tab 组合 | 备注 |
|------|---------|---------|------|
| 小学理科型 | 小学数学 | 预习 → 复习 → ~~加餐~~ | 加餐不走标签筛选 |
| 小学文科型 | 小学语文、小学英语 | 预习 → 复习 → 日常积累 → ~~加餐~~ | 加餐不走标签筛选 |
| 初中理科解题型 | 初中数理化 | 预习 → 复习 → ~~加餐~~ | 复习=解题课，加餐不走标签筛选 |
| 文科语言型 | 初/高中语文英语 | 预习 → 复习 → 日常积累 → ~~加餐~~ | 加餐不走标签筛选 |
| 高中理科型 | 高中数理化生 | 预习 → 解题指导 → 刷题 | 无加餐场景 |
| 小四门基础型 | 初/高中生物地理历史政治道法 | 预习 → 复习 | 无加餐/积累场景 |

> 详细的学科×场景×卡片×标签映射见 [`场景划分与标签筛选逻辑汇总.md`](场景划分与标签筛选逻辑汇总.md)

### 模块 C：章节目录树

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| C1 | 侧边栏章节标题展示 | P0 | - | `ChapterList.vue` | ✅ |
| C2 | 教材切换按钮 | P1 | C1 | `ChapterList.vue` | ✅ |
| C3 | 章节树递归渲染 | P0 | - | `ChapterTree.vue` | ✅ |
| C4 | 章节/大节/小节层级样式 | P0 | C3 | `ChapterTree.vue` | ✅ |
| C5 | 小节选中状态高亮 | P0 | C3 | `ChapterTree.vue` | ✅ |
| C6 | 点击小节跳转联动 | P0 | C3 | `ChapterTree.vue` | ✅ |
| C7 | 滚动时自动更新选中项 | P1 | C6 | `ResourceList.vue` | ✅ |
| C8 | 侧边栏"切换教材"按钮（二级入口） | P1 | C1 | `ChapterList.vue` | ✅ |
| C9 | 背单词入口（仅英语学科） | P1 | - | `ChapterList.vue` | ✅ |

**目录层级结构**：
- `chapter` (章节)：顶层分组，不可点击
- `section` (大节)：中间层级，显示进度
- `subsection` (小节)：可点击，包含资源

### 模块 D：学习方法指南

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| D1 | 学习指南卡片 | P1 | - | `LearningGuide.vue` | ✅ |
| D2 | 折叠/展开交互 | P1 | D1 | `LearningGuide.vue` | ✅ |
| D3 | 根据 Tab 动态内容 | P1 | D1, B3 | `LearningGuide.vue` + Store | ✅ |

**指南内容定义**（v1.7 更新：按确认稿各模板定位说明）：

| 场景模板 | 预习 | 复习/解题指导 | 日常积累 | 加餐/刷题 |
|---------|------|------------|--------|---------|
| 小学 | 同步视频全覆盖，课前抢先看，带你轻松拿捏新知识 | 温故知新，查漏补缺。考前抓重点，稳拿关键分 | 每日一小步，成长一大步。利用碎片时间，练就扎实功底 | 学有余力，更进一程。攻克薄弱项，练就解题直觉 |
| 初中数理化 | 课前勤预习，心中有底气。带你拆解重难点，学习效率翻倍 | 作业没思路？解题有妙招！攻克课后题，练就真本事 | — | 想要更出色？来这儿多刷题。跳出思维定式，解锁学霸模式 |
| 中学语英 | 拆解经典文章，内化核心素养。习得阅读新策略，让表达更有深度 | 针对性训练综合语言能力，应用更从容 | 扫清基础漏洞，字词语法全掌握，解决"薄弱"后顾之忧 | 学有余力，更进一程 |
| 高中理科 | 基础内容全梳理，快速构建高中知识体系 | 精讲做题套路，攻克重难点练习题 | — | 实战见真章，海量题库随时练 |
| 小四门 | 知识图谱全扫描，同步学透不费力。日常稳扎稳打，不做"考前突击队" | 备考冲刺加速器，突破提分瓶颈，避坑更省心 | — | — |

### 模块 E：资源列表与过滤

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| E1 | 资源列表容器 | P0 | - | `ResourceList.vue` | ✅ |
| E2 | 按小节分组展示 | P0 | E1 | `ResourceList.vue` | ✅ |
| E3 | 场景过滤逻辑（基于 scenes 数组） | P0 | E1, B3 | `ResourceList.vue` | ✅ |
| E3.1 | 分学科标签筛选逻辑（内容标签 × 场景标签） | P0 | E3, B8 | 后端接口 / 前端配置 | 🆕 待开发 |
| E3.2 | 前台标签显隐控制 | P0 | E3.1 | `ResourceList.vue` / 卡片组件 | 🆕 待开发 |
| E4 | 文科学科读课文过滤 | P1 | E3 | `ResourceList.vue` | ✅ |
| E5 | 滚动监听联动目录 | P1 | E1 | `ResourceList.vue` | ✅ |
| E6 | 空状态展示 | P0 | E1 | `ResourceList.vue` | ✅ |
| E7 | 小节标题栏 + AI总结徽标 | P0 | E2 | `ResourceList.vue` | ✅ |
| E8 | summary_note 类型过滤（入口整合至 E7） | P1 | E3, E7 | `ResourceList.vue` | ✅ |

**场景过滤规则**（v1.7 更新）：

原型层（已实现）：
- 每个资源有 `scenes` 数组标记适用场景
- 无 `scenes` 的资源默认显示在 preview/review
- 读课文 (`read_text`) 仅对文科学科显示
- `summary_note` 类型在过滤阶段被排除，不再渲染为独立卡片（v1.3 变更）

线上实现层（v1.7 新增，需开发）：

> **E3.1 分学科标签筛选逻辑**：线上环境中，视频资源的场景归属由后端根据「内容标签 × 场景标签」组合计算，而非前端硬编码 `scenes[]`。规则如下：
>
> 1. **组内关系**：同一标签类型内多个值为 **OR**（满足任一即可）
> 2. **组间关系**：内容标签与场景标签之间为 **AND**（须同时满足）
> 3. **多条件组**：一个场景可配置多组筛选条件，组间为 **OR**
> 4. 每个「学段 × 学科 × 场景」有独立的标签筛选规则，共 18 个学科已全部确认
> 5. 非视频资源（同步刷题、培优课钩子、学案、背单词）按资源类型直接归属场景，不走标签筛选
>
> 完整规则详见 [`场景划分与标签筛选逻辑汇总.md`](场景划分与标签筛选逻辑汇总.md)

> **E3.2 前台标签显隐控制**：部分标签仅用于后端筛选，不在前台展示给用户。每个「学段 × 学科 × 场景」配置了需隐藏的标签列表，前端渲染卡片标签时需过滤。典型规则：
>
> - 大多数学科的「预习」场景隐藏【课前预习】场景标签
> - 部分学科的「日常积累」场景隐藏所有场景标签
> - 初中生物「复习」场景隐藏【基础概念课】【实验操作】【进阶理解课】内容标签

**小节标题栏（v1.3 新增）**：
- 每个小节分组顶部显示标题栏：定位图标 + 小节名称 + 「AI总结」胶囊徽标
- AI 总结徽标为紫色渐变 pill 形状，点击跳转 AI 总结详情
- 小节标题不做 sticky 吸附，随内容自然滚动

### 模块 F：资源卡片组件

> 以下为原型中实际注册在 `componentMap` 中并渲染的卡片组件（v1.3）。

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| F1 | 知识点视频卡片 | P0 | - | `KnowledgeCard.vue` | ✅ |
| F2 | 同步刷题卡片 | P0 | - | `PracticeCard.vue` | ✅ |
| F3 | 学案卡片 | P1 | - | `GuideCard.vue` | ✅ |
| F4 | 读课文卡片 (仅文科) | P1 | - | `ReadTextCard.vue` | ✅ |
| F5 | 培优课钩子卡片 | P1 | - | `PremiumHookCard.vue` | ✅ |
| F6 | AI 总结卡片 | P1 | - | `SummaryNoteCard.vue` | ⚠️ 已整合 |

> **F6 说明**：`SummaryNoteCard.vue` 组件代码保留，但 v1.3 起在 `filteredSubsections` 中过滤 `summary_note` 类型，不再渲染为独立卡片。AI 总结入口已整合至小节标题的「AI总结」胶囊徽标（见 E7）。

**卡片类型映射（v1.7 更新：按确认稿对齐）**：

| 资源类型 | 卡片组件 | 场景适用 | 适用学科范围 | 备注 |
|----------|----------|----------|-----------|------|
| `video` | KnowledgeCard | 预习, 复习, 解题指导, 日常积累 | 全学科 | 核心卡片，含分段进度条。不同场景展示不同类型的视频（概念课/解题课/积累课等），由标签筛选决定 |
| `practice` | PracticeCard | 复习, 加餐, 刷题, 预习(部分学科) | 全学科 | 难度标签 + 彩色进度段。初中生物预习场景含简单题，复习含中等+较难题 |
| `guide` | GuideCard | 预习, 复习 | 小学语英、初/高中语英 | 学案，含页数 |
| `read_text` | ReadTextCard | 预习 (仅文科) | 语文、英语 | 读课文 |
| `summary_note` | SummaryNoteCard | — | — | ⚠️ v1.3 起不渲染，入口整合至小节标题 AI 总结徽标 |
| `premium_hook` | PremiumHookCard | 加餐, 解题指导, 复习 | 全学科（视学段） | 培优课付费钩子。高中理科在「解题指导」场景出现 |
| `notebook` | — | 预习 | 初/高中语文 | 笔记卡（v1.7 确认），仅初/高中语文预习场景 |
| `vocabulary` | — | 日常积累 | 英语（全学段） | 背单词模块，章节级入口 |

> 完整的「学段 × 学科 × 场景 → 卡片类型」映射见 [`场景划分与标签筛选逻辑汇总.md`](场景划分与标签筛选逻辑汇总.md)

### 模块 G：VIP 权限控制

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| G1 | VIP 状态全局管理 | P0 | - | `stores/chapter.ts` | ✅ |
| G2 | 资源锁定状态判断 | P0 | G1 | 各卡片组件 | ✅ |
| G3 | 锁定标识展示 (VIP角标) | P0 | G2 | `KnowledgeCard.vue` | ✅ |
| G4 | 已解锁标识展示 | P0 | G2 | `KnowledgeCard.vue` | ✅ |
| G5 | 点击锁定资源引导购买 | P0 | G2 | 各卡片组件 | ✅ |
| G6 | 培优课权限控制 | P1 | G1 | `PremiumKnowledgeCard.vue` | ✅ |
| G7 | 模拟购买解锁流程 | P0 | G1 | Store + 组件 | ✅ |

**权限规则**：
- `isFree: true` → 所有用户可访问
- `isFree: false` + 非VIP → 显示锁定标识
- `isPremium: true` → 需要培优课权限

### 模块 H：学习进度管理

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| H1 | 进度数据结构定义 | P0 | - | `types/index.ts` | ✅ |
| H2 | 进度状态展示 (进度条) | P0 | H1 | `KnowledgeCard.vue` | ✅ |
| H3 | 百分比文案展示 | P0 | H2 | 各卡片组件 | ✅ |
| H4 | 刷题进度展示 (x/y题) | P0 | H1 | `PracticeCard.vue` | ✅ |

**进度状态定义**：
- `not_started` (0%)：未开始
- `in_progress` (1-99%)：进行中
- `completed` (100%)：已完成

### 模块 I：线上系统对比补全（v1.5 新增）

> 来源：线上 `courses/system` + `questionBank` 反向推导 PRD 对比

| ID | 功能点 | 优先级 | 依赖 | 组件参考 | 详设状态 |
|----|--------|--------|------|---------|----------|
| I1 | 首次进入引导（3 步 + 手势动画） | P0 | A1 | `FirstTimeGuide.vue` | ✅ |
| I2 | 学习记录定位优先级链 | P0 | A1, C3 | Store `restorePosition()` | ✅ |
| I3 | NEW 徽标（7 天规则 + 三级冒泡） | P0 | E1, C3 | `NewBadge.vue` | ✅ |
| I4 | 学习内容选择弹窗（视频/练习/笔记） | P0 | F1 | `ContentChoiceModal.vue` | ✅ |
| I5 | 章节底部导航（上一章/下一章） | P0 | E1 | `ChapterFooter.vue` | ✅ |
| I6 | 课程更新订阅 | P1 | B5 | — | 📝 仅文档 |
| I7 | 下载功能 | P1 | F1, G1 | — | 📝 仅文档 |
| I8 | 课堂笔记入口 | P1 | B6 | — | 📝 仅文档 |
| I9 | 低频用户快速定位 | P2 | A1 | — | 📝 仅文档 |
| I10 | 运营位/广告位 | P2 | E1 | — | 📝 仅文档 |
| I11 | 用户反馈入口 | P2 | E1 | — | 📝 仅文档 |
| I12 | 学年确认弹窗 | P2 | B5 | — | 📝 仅文档 |

**说明**：
- P0 功能（I1-I5）：已在原型中实现并添加组件
- P1 功能（I6-I8）：仅在 PRD V1.5 §3.12-§3.14 文档标注，不实现原型
- P2 功能（I9-I12）：仅在 PRD V1.5 §3.15-§3.18 文档标注，不实现原型

---

## 统计

| 优先级 | 功能点数 | 已详设 | 待详设 |
|--------|----------|--------|--------|
| P0 | 32 | 30 | 2 |
| P1 | 28 | 24 | 4 |
| P2 | 4 | 0 | 4 |
| **合计** | **64** | **54** | **10** |

> v1.7 新增 2 项 P0 功能点（E3.1 分学科标签筛选逻辑、E3.2 前台标签显隐控制），规则已由各学科确认，待开发。
> v1.5 新增 12 项功能点（I1-I12），其中 5 项 P0 已实现，3 项 P1 + 4 项 P2 仅文档标注。F6（SummaryNoteCard）标记为「已整合」，不计入待详设。

---

## 数据模型（与原型 `types/index.ts` 对齐）

### SceneType (场景类型枚举) — v1.7 更新

```typescript
type SceneType =
  | 'preview'          // 预习
  | 'review'           // 复习
  | 'problem_solving'  // 解题指导（高中理科）
  | 'drill'            // 刷题（高中理科）
  | 'accumulation'     // 日常积累（文科语言类）
  | 'extra'            // 加餐（不走标签筛选，按资源类型聚合）
```

### ResourceType (资源类型枚举)

```typescript
type ResourceType =
  | 'video'           // 知识点视频 + 课后题
  | 'practice'        // 同步刷题
  | 'guide'           // 学案
  | 'read_text'       // 读课文（文科）
  | 'summary_note'    // 总结类笔记（v1.3 起不渲染为卡片）
  | 'premium_hook'    // 培优课钩子
  | 'recite'          // 背单词（英语，章节级入口）
  | 'mind_map'        // 思维导图（章节级入口）
  | 'error_book'      // 错题本（章节级入口）
```

### Resource (资源)

```typescript
interface Resource {
  // 必填
  id: string
  type: ResourceType
  title: string
  tags: string[]
  isFree: boolean

  // 场景与过滤
  scenes?: SceneType[]        // 适用场景（原型层：前端硬编码）
  subject?: SubjectType       // 所属学科

  // v1.7 标签筛选（线上层：后端标签驱动）
  contentTags?: string[]      // 内容标签（概念课/解题课/课文精讲/进阶理解/实验操作 等）
  sceneTags?: string[]        // 场景标签（课前预习/课后巩固/单元复习/作业精讲/期中期末重点/新题型/日常积累）
  hiddenTags?: string[]       // 前台需隐藏的标签（仅用于后端筛选，不展示给用户）

  // VIP 相关
  isTrial?: boolean           // 是否可试看

  // 视频相关
  duration?: number           // 时长(分钟)
  questionCount?: number      // 随堂检测题目数
  category?: CourseCategory   // 课程分类
  valueTag?: ValueTag         // 价值标签
  difficulty?: 1 | 2 | 3     // 难度等级
  coverUrl?: string           // 封面图

  // 刷题相关
  completedCount?: number     // 已完成题数
  totalCount?: number         // 总题数
  difficultyLevels?: string[] // ['基础', '中等', '困难']
  subsectionTitle?: string    // 小节标题

  // 学案相关
  pageCount?: number          // 页数
  downloadUrl?: string        // 下载链接

  // 读课文相关
  paragraphCount?: number     // 段落数
  estimatedTime?: number      // 预计用时（分钟）

  // 笔记相关
  noteCount?: number          // 笔记条数

  // 培优课钩子
  hookType?: '重难点' | '拔高' | '竞赛'
  targetCourse?: string       // 目标课程名称

  // v1.5 线上系统对齐字段
  firstPublishAt?: string     // 首次发布时间（ISO8601），用于 NEW 徽标计算
  videoTimepoint?: number     // 视频播放进度（秒），用于断点续播
  isContainNote?: boolean     // 是否含课堂笔记
  isPremium?: boolean         // 是否为付费内容
}
```

### TextbookConfig (教材配置) — v1.5 新增 4id

```typescript
interface TextbookConfig {
  id: string
  stageId: number       // 学段 ID（如：2=初中, 3=高中）
  subjectId: number     // 学科 ID（如：2=数学, 3=英语）
  publisherId: number   // 出版社/版本 ID（如：2=人教版）
  semesterId: number    // 册别 ID（如：上册/下册）
  subject: SubjectType
  version: string
  grade: string
  semester: string
  displayName: string
}
```

### Chapter (章节)

```typescript
interface Chapter {
  id: string
  title: string
  level: 'chapter' | 'section' | 'subsection'
  children?: Chapter[]
  resources?: Resource[]
  progress?: { completed: number; total: number }
  isExpanded?: boolean
  isHaveNew?: boolean   // 是否含有 NEW 内容（冒泡标记）
  scene?: string        // 场景标记
}
```

### UserProgress (学习进度)

```typescript
interface UserProgress {
  nodeId: string
  status: 'not_started' | 'in_progress' | 'completed'
  percentage: number
  lastUpdateTime: string
}
```

---

## 组件清单（原型实际文件）

| 组件文件 | 功能 | 依赖组件 | 备注 |
|----------|------|----------|------|
| `App.vue` | 应用入口 | ChapterList | — |
| `ChapterList.vue` | 主页面布局（双栏/抽屉） | GlobalHeader, FunctionBar, SceneTabs, ChapterTree, ResourceList, ContextSelector, SettingsPage | 顶层容器 |
| `GlobalHeader.vue` | 全局顶部导航 | — | 返回 + VIP 入口 |
| `FunctionBar.vue` | 功能栏 | — | Tab + 快捷入口 + 移动端菜单 |
| `SceneTabs.vue` | 场景切换 Tab | — | 全部/预习/复习/加餐 |
| `ContextSelector.vue` | 教材切换弹窗 | — | 三列级联选择器 |
| `ChapterTree.vue` | 章节目录树（递归） | 自身 | 三级结构 |
| `ResourceList.vue` | 资源列表容器 | LearningGuide, 所有卡片组件, LearningModeModal | 含 AI 总结徽标 |
| `LearningGuide.vue` | 学习方法指南 | — | 根据 Tab 动态内容 |
| `KnowledgeCard.vue` | 知识点视频卡片 | — | 分段式进度条 |
| `PracticeCard.vue` | 同步刷题卡片 | — | 难度标签 + 彩色进度段 |
| `GuideCard.vue` | 学案卡片 | — | 页数 + 下载 |
| `ReadTextCard.vue` | 读课文卡片 | — | 仅文科 |
| `PremiumHookCard.vue` | 培优课钩子卡片 | — | 金色差异化样式 |
| `SummaryNoteCard.vue` | AI 总结卡片 | — | ⚠️ v1.3 起不渲染 |
| `LearningModeModal.vue` | 学习方式选择弹窗 | — | 复习场景触发 |
| `SettingsPage.vue` | 设置页 | — | 三项偏好配置 |
| `FirstTimeGuide.vue` | 首次进入引导遮罩 | — | 3 步引导 + Lottie 手势动画（v1.5 新增） |
| `ContentChoiceModal.vue` | 学习内容选择弹窗 | — | 视频/练习/笔记三选一（v1.5 新增） |
| `ChapterFooter.vue` | 章节底部导航 | — | 上一章/下一章（v1.5 新增） |
| `NewBadge.vue` | NEW 徽标组件 | — | 7 天规则 + 三级冒泡（v1.5 新增） |

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Pinia | 2.x | 状态管理 |
| Vite | 5.x | 构建工具 |
| SCSS | - | 样式预处理 |
| Lucide Vue Next | - | 图标库 |

---

## 下一步

- [x] V5.x 功能点拆解完成
- [x] 所有功能点详细设计
- [x] Design Tokens 同步（onion-tokens.json）
- [x] 评审地图生成（`03-panorama/review-map.html`）
- [x] 埋点设计完成（`05-tracking/tracking-design.md`）
- [x] V1.x 内审通过（v1.4 审查 7 大维度）
- [x] 线上系统对比补全（v1.5 对比 12 项功能 + 4id 对齐）
- [x] 分学科筛选逻辑确认（v1.7 — 18 学科全部确认 ✅）
- [ ] E3.1 / E3.2 开发落地（标签筛选 + 显隐控制）
- [ ] SDD 技术规格生成
- [ ] V5.x 内审

---

*此文档基于可交互原型反向工程生成（v1.7 已同步分学科筛选逻辑确认稿 + 标签体系对齐），用于支持在其他工程中复现原型*

