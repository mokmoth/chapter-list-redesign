# SDD 技术规格：章节列表页迭代

> **版本**：1.0.0
> **创建日期**：2025-12-31
> **来源**：可交互原型反向工程
> **JSON Schema**：`chapter-list.sdd.json`

---

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | 前端框架 |
| TypeScript | 5.x | 类型系统 |
| Pinia | 2.x | 状态管理 |
| Vite | 5.x | 构建工具 |
| SCSS | - | 样式预处理 |
| Lucide Vue Next | - | 图标库 |

---

## 2. 设计令牌 (Design Tokens)

### 2.1 颜色系统

| 类别 | 变量名 | 色值 | 用途 |
|------|--------|------|------|
| **主色** | primary | `#FEA345` | 提示-橙、选中状态 |
| | primary_light | `#FFF0E6` | 选中背景 |
| | primary_bg | `#FFF9F2` | 指南卡片背景 |
| **次要色** | secondary | `#845EFF` | 品牌辅助-紫、链接 |
| | secondary_light | `#EBF3FF` | 紫色标签背景 |
| | secondary_bg | `#F0F7FF` | 紫色图标区背景 |
| **成功色** | success | `#92E066` | 正确-绿、进度 |
| | success_light | `#E8F5E9` | 绿色标签背景 |
| | success_bg | `#F1F8F4` | 绿色图标区背景 |
| **警告色** | warning | `#FFD633` | 品牌色-黄 |
| | warning_light | `#FFF5E6` | 黄色标签背景 |
| | warning_bg | `#FFFBF0` | 黄色图标区背景 |
| **错误色** | error | `#FA5A65` | 错误-红、会员角标 |
| **文字** | text_primary | `#2E2E3A` | 主要文字 |
| | text_secondary | `#848096` | 次要文字 |
| | text_tertiary | `#999999` | 辅助文字 |
| **边框/背景** | border | `#D4D2DC` | 分割线 |
| | background | `#FFFFFF` | 主背景 |
| | background_secondary | `#F5F4F8` | 二级背景 |
| | overlay | `rgba(0,0,0,0.4)` | 遮罩层 |
| **渐变** | vip_gradient | `#FFC561 → #F57575` | 会员锁定角标 |
| | gold_gradient | `#FFD700 → #FFAA00` | 会员已解锁角标 |

### 2.2 字体规格

```scss
$font-family: "Alibaba PuHuiTi 2.0", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

$font-sizes: (
  xl: 18px,    // Tab 选中状态
  lg: 16px,    // 大节标题、教材选择
  md: 14px,    // 卡片标题、Tab 默认
  sm: 13px,    // 小节标题、紧凑卡片标题
  xs: 12px,    // 按钮文字、副标题
  xxs: 11px,   // 元信息、进度文字
  xxxs: 10px   // 标签、角标
);

$font-weights: (
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 800
);
```

### 2.3 间距系统

| Token | 值 | 用途 |
|-------|----|----- |
| xxs | 2px | 最小间距 |
| xs | 4px | 图标与文字间距 |
| sm | 6px | 标签内边距 |
| md | 8px | 紧凑卡片内边距 |
| lg | 10px | 卡片内边距 |
| xl | 12px | 卡片间距 |
| xxl | 16px | 区域间距 |
| xxxl | 24px | 大区域间距 |

### 2.4 圆角规格

| Token | 值 | 用途 |
|-------|----|----- |
| sm | 6px | 标签 |
| md | 8px | 封面图 |
| lg | 14px | 指南卡片、资源卡片 |
| xl | 14px | 大圆角容器 |
| pill | 999px | 胶囊按钮 |
| circle | 50% | 圆形图标区 |

### 2.5 响应式断点

| 断点 | 值 | 说明 |
|------|----|----- |
| mobile | 768px | 侧边栏切换为抽屉 |
| small_mobile | 600px | 快捷入口收纳 |
| tiny_mobile | 380px | Tab 字号缩小 |
| micro_mobile | 360px | VIP 文字隐藏 |

---

## 3. 数据模型

### 3.1 Resource (资源)

```typescript
interface Resource {
  // 必填字段
  id: string;
  type: ResourceType;
  title: string;
  tags: string[];
  isFree: boolean;
  
  // 可选字段
  scenes?: SceneType[];           // 适用场景 ['preview', 'review', 'extra']
  subType?: 'vocab' | 'text';     // 背诵卡片子类型
  subject?: string;               // 学科 (用于快背过滤)
  
  // VIP 相关
  isPremium?: boolean;            // 是否为培优课
  premiumStatus?: 'locked' | 'unlocked';
  isTrial?: boolean;              // 是否可试看
  
  // 视频相关
  duration?: number;              // 时长(分钟)
  questionCount?: number;         // 随堂检测题目数
  category?: '概念课' | '解题课' | '实验课' | '总结课';
  valueTag?: '新中考' | '重难点' | '易错点' | '考点';
  difficulty?: 1 | 2 | 3;
  coverUrl?: string;
  
  // 刷题相关
  completedCount?: number;        // 已完成题数
  totalCount?: number;            // 总题数
  difficultyLevels?: string[];   // ['基础', '中等', '困难']
  subsectionTitle?: string;       // 小节标题 (用于刷题卡片显示)
}
```

### 3.2 Chapter (章节)

```typescript
interface Chapter {
  id: string;
  title: string;
  level: 'chapter' | 'section' | 'subsection';
  children?: Chapter[];
  resources?: Resource[];
  progress?: { completed: number; total: number };
  isExpanded?: boolean;
}
```

### 3.3 UserProgress (学习进度)

```typescript
interface UserProgress {
  nodeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  percentage: number;  // 0-100
  lastUpdateTime: string;  // ISO8601
}
```

---

## 4. 状态管理 (Store)

### 4.1 State

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loading | boolean | false | 加载状态 |
| currentTab | SceneType | 'preview' | 当前场景 |
| chapters | Chapter[] | [] | 章节数据 |
| selectedNodeId | string | '' | 选中的小节ID |
| isScrollingByClick | boolean | false | 点击滚动锁 |
| progressMap | Record<string, UserProgress> | {} | 进度映射 |
| isVip | boolean | false | VIP 状态 |
| currentSubject | string | '数学' | 当前学科 |
| hasPremiumAccess | boolean | false | 培优课权限 |

### 4.2 Getters

| Getter | 返回类型 | 逻辑 |
|--------|----------|------|
| currentGuide | string | guideContent[currentTab] |
| allSubsections | Chapter[] | 递归收集 level === 'subsection' |

### 4.3 Actions

| Action | 参数 | 逻辑 |
|--------|------|------|
| fetchChapters | - | 异步加载章节数据 |
| selectNode | id: string | 更新 selectedNodeId |
| toggleExpand | chapterId: string | 切换 isExpanded |
| switchTab | tab: SceneType | 更新 currentTab，重新加载数据 |
| unlockVip | - | 设置 isVip = true |

---

## 5. 组件规格

### 5.1 组件树

```
App
└── ChapterList (主页面)
    ├── GlobalHeader
    │   └── [slot: SceneTabs]
    ├── FunctionBar
    ├── ChapterTree (递归)
    └── ResourceList
        ├── LearningGuide
        └── [动态卡片组件]
            ├── KnowledgeCard
            ├── MindMapCard
            ├── ReciteCard
            ├── QuickReviewCard
            ├── AISolveCard
            ├── NoteCard
            ├── ErrorBookCard
            ├── QuickMemorizeCard
            ├── PracticeCard
            └── PremiumKnowledgeCard
```

### 5.2 ChapterList (主页面)

**布局结构**：

```scss
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}
```

**响应式规则**：

| 断点 | sidebar | 拉手按钮 | 遮罩层 |
|------|---------|----------|--------|
| ≥768px | 固定 260px | 隐藏 | 无 |
| <768px | 抽屉 80% | 显示 | 打开时显示 |

**本地状态**：

```typescript
const isSidebarOpen = ref(false);
```

### 5.3 GlobalHeader

**高度**：40px

**布局**：三栏 (返回 | 中间插槽 | VIP入口)

**元素规格**：

| 元素 | 规格 |
|------|------|
| 返回按钮 | ChevronLeft, 24px, #2E2E3A |
| VIP入口 | Crown 14px + 文字, 金色渐变背景, 圆角 12px |

### 5.4 FunctionBar

**高度**：44px

**布局**：两栏 (教材选择 | 快捷入口)

**响应式**：
- ≥600px：展示全部快捷入口
- <600px：收纳到更多菜单（"≡" 汉堡图标，深色圆角方块背景）

### 5.5 SceneTabs

**Props**：
- `embedded`: boolean - 是否为嵌入模式

**模式对比**：

| 模式 | 布局 | 选中效果 |
|------|------|----------|
| 默认 | 三栏均分 | 底部指示器 3px #FEA345 |
| 嵌入 | 紧凑间隔 | 胶囊背景 #FFF0E6 |

### 5.6 ChapterTree

**递归组件**，按层级渲染不同样式。

**节点样式**：

| 层级 | 字号 | 颜色 | 左边距 | 可点击 |
|------|------|------|--------|--------|
| section | 14px 加粗 | #2E2E3A | 12px | 否 |
| subsection | 13px | #2E2E3A | 24px | 是 |

**选中状态**：背景 #FFF0E6，文字 #FEA345

### 5.7 ResourceList

**场景过滤逻辑**：

```typescript
// 1. 场景匹配
if (resource.scenes) {
  return resource.scenes.includes(currentTab);
} else {
  return ['preview', 'review'].includes(currentTab);
}

// 2. 学科过滤 (快背卡片)
if (resource.type === 'quick_memorize') {
  return ['地理', '历史', '政治', '生物', '化学'].includes(resource.subject);
}
```

**滚动监听**：

```typescript
const observer = new IntersectionObserver(callback, {
  root: containerRef.value,
  threshold: [0, 0.1, 0.2],
  rootMargin: '-10% 0px -85% 0px'  // 感应区在顶部
});
```

### 5.8 卡片组件规格

#### KnowledgeCard (知识点视频)

| 元素 | 规格 |
|------|------|
| 封面 | 100×60px, 圆角 8px |
| 标题 | 14px 加粗, 最多 2 行 |
| 分类标签 | 10px, 背景 #EBF3FF, 文字 #845EFF |
| 价值标签 | 10px, 背景 #FFF0E6, 文字 #FEA345 |
| 难度星星 | 10px, 填充 #FEA345 |
| 进度条 | 分段式 (10段), 4px 高, 背景 #D4D2DC, 填充 #92E066 |
| 会员角标 | 右上角, 珊瑚色 #FA5A65 背景, 白色文字 "会员" |

#### PracticeCard (同步刷题)

| 元素 | 规格 |
|------|------|
| 图标区 | 100×60px, 背景 #F0F7FF, SVG 试卷图标 |
| 标签 | "同步刷题", 10px, #845EFF |
| 难度 | 文字标签 + 彩色分段下划线 (非胶囊 pill), 11px, #848096 |
| 进度 | "{completed}/{total}题", 11px, #848096 |

#### 紧凑卡片 (QuickReview/AISolve/Note/ErrorBook/QuickMemorize)

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形 |
| 标题 | 13px 加粗 |
| 副标题 | 10px, #999 |
| 操作 | 箭头或文字 |

---

## 6. 联动机制

### 6.1 左右滚动同步

```
┌─────────────────────────────────────────────────────────────┐
│                      点击目录 → 滚动资源列表                 │
├─────────────────────────────────────────────────────────────┤
│  1. 用户点击左侧小节                                         │
│  2. store.isScrollingByClick = true (开锁)                  │
│  3. store.selectedNodeId = item.id                          │
│  4. 右侧 scrollTo 对应小节                                   │
│  5. 600ms 后 store.isScrollingByClick = false (解锁)        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      滚动资源列表 → 高亮目录                 │
├─────────────────────────────────────────────────────────────┤
│  1. 用户滚动右侧资源列表                                     │
│  2. IntersectionObserver 检测进入感应区的小节               │
│  3. if (!store.isScrollingByClick)                          │
│       store.selectedNodeId = 新的小节 ID                    │
│  4. 左侧目录 watch selectedNodeId                           │
│  5. scrollIntoView 到对应项                                 │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Tab 切换联动

```
1. 用户点击 Tab
2. store.switchTab(newTab)
3. 重新加载数据 (fetchChapters)
4. 资源列表滚动到顶部
5. 重新设置 IntersectionObserver
6. 学习指南内容更新 (currentGuide)
```

---

## 7. VIP 权限逻辑

### 7.1 资源锁定判断

```typescript
// 普通资源
const isLocked = !resource.isFree && !store.isVip;

// 培优课资源
const isPremiumLocked = resource.premiumStatus === 'locked' || 
                        (!store.hasPremiumAccess && resource.isPremium);
```

### 7.2 角标展示规则

| 条件 | 角标 |
|------|------|
| isFree === true | 无角标 |
| !isFree && !isVip | "会员" (珊瑚色 #FA5A65 背景) |
| !isFree && isVip | "已解锁" (灰色弱化) |
| isTrial === true | "免费试看" (橙色) |
| isPremium && locked | "去加购" (渐变) |
| isPremium && unlocked | "培优课" (金色) |

### 7.3 点击行为

```typescript
if (isLocked) {
  if (confirm('该内容需要开通 VIP...')) {
    store.unlockVip();
  }
} else {
  // 进入学习
}
```

---

## 8. 文件结构

```
src/
├── App.vue
├── main.ts
├── style.css
├── types/
│   └── index.ts           # 类型定义
├── stores/
│   └── chapter.ts         # Pinia Store
├── mocks/
│   └── data.ts            # Mock 数据
├── views/
│   └── ChapterList.vue    # 主页面
└── components/
    ├── GlobalHeader.vue
    ├── FunctionBar.vue
    ├── SceneTabs.vue
    ├── ChapterTree.vue    # 递归
    ├── ResourceList.vue
    ├── LearningGuide.vue
    ├── KnowledgeCard.vue
    ├── MindMapCard.vue
    ├── ReciteCard.vue
    ├── QuickReviewCard.vue
    ├── AISolveCard.vue
    ├── NoteCard.vue
    ├── ErrorBookCard.vue
    ├── QuickMemorizeCard.vue
    ├── PracticeCard.vue
    └── PremiumKnowledgeCard.vue
```

---

## 9. 复现检查清单

使用此 SDD 复现原型时，确保以下关键点：

### 9.1 布局

- [ ] 响应式断点 768px 切换侧边栏模式
- [ ] 移动端侧边栏宽度 80%，抽屉动画 0.3s
- [ ] 拉手按钮位置在黄金分割点 (top: 61.8%)
- [ ] 遮罩层禁止滚动 (touch-action: none)

### 9.2 场景 Tab

- [ ] 三个场景：preview/review/extra
- [ ] 嵌入模式胶囊样式，选中背景 #FFF0E6；"全部" tab 使用描边胶囊边框
- [ ] 切换 Tab 后滚动到顶部

### 9.3 章节目录

- [ ] 递归渲染三级结构
- [ ] section 不可点击，subsection 可点击
- [ ] 选中状态背景 #FFF0E6，文字 #FEA345
- [ ] 左右滚动同步，有 600ms 锁机制

### 9.4 资源卡片

- [ ] 10 种卡片类型正确映射
- [ ] 场景过滤：scenes 数组匹配
- [ ] 快背卡片仅文科学科显示
- [ ] VIP 锁定状态正确判断
- [ ] 进度条分段式 (10段)，颜色 #92E066

### 9.5 学习指南

- [ ] 背景色 #FFF9F2
- [ ] 可折叠，动画 0.3s
- [ ] 内容根据 Tab 动态变化

---

## 10. 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-12-31 | 基于可交互原型反向工程生成 SDD |
| 1.1.0 | 2026-03-09 | 同步官方设计令牌 (onion-tokens)：更新颜色、字体、圆角、进度条分段式、会员角标等 |

---

*此文档与 `chapter-list.sdd.json` 同步维护，提供完整技术规格以支持 100% 复现原型*

