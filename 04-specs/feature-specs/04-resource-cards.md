# 功能详细设计：资源卡片体系

| 项目 | 值 |
|------|------|
| 文档版本 | V2.0 |
| 日期 | 2026-03-13 |
| 关联原型 | chapter-list-redesign V1.6 |
| 涉及组件 | `ResourceList.vue`、`KnowledgeCard.vue`、`PracticeCard.vue`、`GuideCard.vue`、`ReadTextCard.vue`、`SummaryNoteCard.vue`、`PremiumHookCard.vue`、`NewBadge.vue` |
| 状态 | Draft |

---

## 1. 资源类型 → 卡片组件映射

| 资源类型 (type) | 卡片组件 | 布局形式 |
|-----------------|----------|----------|
| `video` | `KnowledgeCard` | 横向图文，封面 100×60 |
| `practice` | `PracticeCard` | 横向图文，图标区 100×60 |
| `guide` | `GuideCard` | 横向图标 48×48 |
| `read_text` | `ReadTextCard` | 特殊渐变背景 |
| `summary_note` | `SummaryNoteCard` | 特殊渐变背景 |
| `premium_hook` | `PremiumHookCard` | 横向图文 + 去加购按钮 |
| 其他 (fallback) | `KnowledgeCard` | 横向图文（兜底） |

---

## 2. 场景筛选逻辑

资源根据当前激活的 Tab（场景）进行过滤：

```typescript
const filterByScene = (
  resource: Resource,
  currentTab: SceneType
): boolean => {
  // 资源声明了 scenes 字段 → 精确匹配
  if (resource.scenes && resource.scenes.length > 0) {
    return resource.scenes.includes(currentTab)
  }
  // 未声明 scenes → 默认在 预习/复习 中展示
  return currentTab === 'preview' || currentTab === 'review'
}
```

---

## 3. 动态组件选择

```typescript
import KnowledgeCard from './KnowledgeCard.vue'
import PracticeCard from './PracticeCard.vue'
import GuideCard from './GuideCard.vue'
import ReadTextCard from './ReadTextCard.vue'
import SummaryNoteCard from './SummaryNoteCard.vue'
import PremiumHookCard from './PremiumHookCard.vue'

const CARD_COMPONENT_MAP: Record<string, Component> = {
  video: KnowledgeCard,
  practice: PracticeCard,
  guide: GuideCard,
  read_text: ReadTextCard,
  summary_note: SummaryNoteCard,
  premium_hook: PremiumHookCard,
}

const getCardComponent = (type: string): Component => {
  return CARD_COMPONENT_MAP[type] ?? KnowledgeCard
}
```

```html
<!-- ResourceList.vue -->
<component
  v-for="resource in filteredResources"
  :key="resource.id"
  :is="getCardComponent(resource.type)"
  :resource="resource"
  @click="handleCardClick(resource)"
/>
```

---

## 4. KnowledgeCard（知识点卡片）

适用资源类型：`video`、fallback。

### 4.1 布局结构

```
KnowledgeCard (横向 flex)
├── cover-area (100×60, 圆角 8px)
│   ├── cover-image
│   ├── VipBadge (左上角)
│   └── NewBadge (右上角, size="resource")
├── content-area (flex: 1)
│   ├── title (14px bold, 最多 2 行)
│   ├── tags-row
│   │   ├── CategoryTag (紫色)
│   │   └── ValueTag (橙色, 可选)
│   ├── difficulty-stars (可选)
│   └── progress-bar (分段式, 10 格)
```

### 4.2 视觉规格

| 元素 | 规格 |
|------|------|
| 卡片 | padding 12px，圆角 10px，hover shadow `0 2px 8px rgba(0,0,0,0.08)` |
| 封面 | 100×60，圆角 8px，`object-fit: cover` |
| 标题 | 14px，font-weight 700，`#2E2E3A`，`-webkit-line-clamp: 2` |
| 分类标签 (CategoryTag) | 文字 `#845EFF`，背景 `#F0ECFF`，圆角 4px，padding 2px 6px，字号 11px |
| 价值标签 (ValueTag) | 文字 `#FEA345`，背景 `#FFF1E3`，圆角 4px，padding 2px 6px，字号 11px |
| 难度星级 | 星形图标 12px，填充 `#FFD633`，未填充 `#D4D2DC` |
| 进度条 | 10 段分隔，每段圆角 2px，已完成 `#92E066`，未完成 `#F5F4F8`，高度 4px |

```scss
.knowledge-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .cover-area {
    width: 100px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content-area {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .card-title {
    font-size: 14px;
    font-weight: 700;
    color: #2E2E3A;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .category-tag {
    font-size: 11px;
    color: #845EFF;
    background: #F0ECFF;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .value-tag {
    font-size: 11px;
    color: #FEA345;
    background: #FFF1E3;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

// 进度条 - 分段式
.progress-bar {
  display: flex;
  gap: 2px;
  height: 4px;

  .progress-segment {
    flex: 1;
    border-radius: 2px;
    background: #F5F4F8;

    &.filled {
      background: #92E066;
    }
  }
}
```

### 4.3 VIP 锁定逻辑

| 条件 | 徽章文字 | 徽章颜色 | 卡片样式 |
|------|----------|----------|----------|
| `!isFree && !isVip` | "会员" | 背景 `#FA5A65`，文字 `#FFFFFF` | 封面加灰色蒙版 `rgba(0,0,0,0.3)` |
| `!isFree && isVip` | 无（或灰色已解锁标记） | `#B0ADBA` | 正常样式 |
| `isFree && isTrial` | "免费试看" | 背景 `#92E066`，文字 `#FFFFFF` | 正常样式 |
| `isFree` | 无 | — | 正常样式 |

```scss
.vip-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 600;

  &.locked {
    background: #FA5A65;
    color: #FFFFFF;
  }

  &.unlocked {
    background: #B0ADBA;
    color: #FFFFFF;
  }

  &.trial {
    background: #92E066;
    color: #FFFFFF;
  }
}

.cover-area.is-locked {
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }
}
```

### 4.4 ContentChoiceModal 触发

当资源 `isContainNote === true` 时，点击 KnowledgeCard 弹出内容选择弹窗。

```typescript
const handleCardClick = (resource: Resource) => {
  if (resource.isContainNote) {
    showContentChoiceModal.value = true
    currentResource.value = resource
    return
  }
  // 正常跳转逻辑
  navigateToResource(resource)
}
```

---

## 5. PracticeCard（练习卡片）

适用资源类型：`practice`。

### 5.1 布局结构

```
PracticeCard (横向 flex)
├── icon-area (100×60, 蓝色背景 #F0ECFF)
│   ├── practice-svg-icon
│   └── NewBadge (右上角)
├── content-area (flex: 1)
│   ├── title (14px bold, 最多 2 行)
│   ├── difficulty-row
│   │   ├── difficulty-label ("简单"/"中等"/"困难")
│   │   └── difficulty-underline (分段彩色条)
│   └── progress-text ("x/y 题")
```

### 5.2 难度显示

| 难度 | 文字标签 | 分段条颜色 |
|------|----------|------------|
| easy | 简单 | `#92E066`（绿色） |
| medium | 中等 | `#FEA345`（橙色） |
| hard | 困难 | `#FA5A65`（红色） |

```scss
.difficulty-row {
  display: flex;
  align-items: center;
  gap: 8px;

  .difficulty-label {
    font-size: 12px;
    font-weight: 500;
  }

  .difficulty-underline {
    display: flex;
    gap: 2px;
    height: 3px;
    width: 40px;

    .segment {
      flex: 1;
      border-radius: 999px;

      &.filled.easy   { background: #92E066; }
      &.filled.medium { background: #FEA345; }
      &.filled.hard   { background: #FA5A65; }
      &:not(.filled)  { background: #D4D2DC; }
    }
  }
}

.practice-card {
  .icon-area {
    width: 100px;
    height: 60px;
    border-radius: 8px;
    background: #F0ECFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;

    .practice-icon {
      width: 32px;
      height: 32px;
      color: #845EFF;
    }
  }

  .progress-text {
    font-size: 12px;
    color: #848096;
  }
}
```

---

## 6. GuideCard（学案卡片）

适用资源类型：`guide`。

### 6.1 布局结构

```
GuideCard (横向 flex)
├── icon-container (48×48, 蓝色渐变)
│   └── guide-icon (PDF 图标)
├── content-area (flex: 1)
│   ├── title (14px bold)
│   └── tag ("PDF学案", 蓝色)
├── action-icon (Download, 右侧)
```

### 6.2 视觉规格

| 元素 | 规格 |
|------|------|
| 图标容器 | 48×48，圆角 10px，渐变背景 `linear-gradient(135deg, #E8E4FF, #F0ECFF)` |
| 标签 | "PDF学案"，字号 11px，颜色 `#845EFF`，背景 `#F0ECFF`，圆角 4px |
| 下载图标 | `Download`，20px，颜色 `#848096`，hover 颜色 `#FEA345` |

```scss
.guide-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: linear-gradient(135deg, #E8E4FF, #F0ECFF);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .action-icon {
    width: 20px;
    height: 20px;
    color: #848096;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #FEA345;
    }
  }
}
```

---

## 7. ReadTextCard（朗读卡片）

适用资源类型：`read_text`。

### 7.1 布局结构

```
ReadTextCard (渐变背景卡片)
├── icon-container (48×48, 橙色)
│   └── read-icon (朗读图标)
├── content-area (flex: 1)
│   ├── title (14px bold)
│   └── NewBadge (可选)
├── action-pill ("开始朗读" 按钮)
```

### 7.2 视觉规格

| 元素 | 规格 |
|------|------|
| 卡片背景 | 渐变 `linear-gradient(135deg, #FFF1E3, #FFF9E0)` |
| 图标容器 | 48×48，圆角 10px，背景 `#FEA345`（橙色） |
| 图标 | 白色 24px |
| 操作按钮 | "开始朗读"，pill 形，背景 `#FEA345`，文字 `#FFFFFF`，圆角 999px，padding 6px 16px，字号 12px |

```scss
.read-text-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FFF1E3, #FFF9E0);

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #FEA345;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .read-icon {
      width: 24px;
      height: 24px;
      color: #FFFFFF;
    }
  }

  .action-pill {
    padding: 6px 16px;
    border-radius: 999px;
    background: #FEA345;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }
}
```

---

## 8. SummaryNoteCard（AI 总结卡片）

适用资源类型：`summary_note`。

### 8.1 布局结构

```
SummaryNoteCard (渐变背景卡片)
├── icon-container (48×48, 绿色)
│   └── note-icon
├── content-area (flex: 1)
│   ├── title (14px bold)
│   └── tag ("AI 总结", 绿色)
├── sparkles-badge (右上角, Sparkles 图标)
```

### 8.2 视觉规格

| 元素 | 规格 |
|------|------|
| 卡片背景 | 渐变 `linear-gradient(135deg, #EFFAE8, #E0F5D6)` |
| 图标容器 | 48×48，圆角 10px，背景 `#92E066` |
| 标签 | "AI 总结"，字号 11px，颜色 `#4CAF50`，背景 `#E8F5E9` |
| Sparkles 徽章 | 右上角绝对定位，`Sparkles` 图标 16px，颜色 `#FFD633` |

```scss
.summary-note-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #EFFAE8, #E0F5D6);
  position: relative;

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #92E066;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ai-tag {
    font-size: 11px;
    color: #4CAF50;
    background: #E8F5E9;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .sparkles-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    color: #FFD633;
  }
}
```

---

## 9. PremiumHookCard（加购引导卡片）

适用资源类型：`premium_hook`。

### 9.1 布局结构

```
PremiumHookCard (横向 flex)
├── cover-area (100×60, 金色渐变)
│   └── hook-icon
├── content-area (flex: 1)
│   ├── title (14px bold)
│   └── category-tag (来自 hookType)
├── purchase-button ("去加购", 右上角)
```

### 9.2 视觉规格

| 元素 | 规格 |
|------|------|
| 封面区域 | 100×60，渐变 `linear-gradient(135deg, #FFD633, #FEA345)`，圆角 8px |
| 分类标签 | 来自 `resource.hookType`，橙色系 |
| 去加购按钮 | pill 形，背景 `#FEA345`，文字 `#FFFFFF`，圆角 999px，padding 4px 12px，字号 11px |
| 按钮位置 | 绝对定位，top 8px，right 8px |

```scss
.premium-hook-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  position: relative;

  .cover-area {
    width: 100px;
    height: 60px;
    border-radius: 8px;
    background: linear-gradient(135deg, #FFD633, #FEA345);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .hook-icon {
      width: 32px;
      height: 32px;
      color: #FFFFFF;
    }
  }

  .purchase-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 12px;
    border-radius: 999px;
    background: #FEA345;
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }
}
```

---

## 10. NewBadge 组件

通用"新内容"标记组件，支持两种尺寸。

### 10.1 两种尺寸

| size | 形式 | 尺寸 | 背景 | 文字 |
|------|------|------|------|------|
| `"resource"` | 药丸形 "NEW" 文字 | padding 1px 6px | `#FA5A65` | `#FFFFFF`，10px，bold |
| `"dot"` | 纯圆点 | 8×8 | `#FA5A65` | 无 |

```scss
.new-badge {
  &.size-resource {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    border-radius: 999px;
    background: #FA5A65;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 700;
    line-height: 1.2;
  }

  &.size-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FA5A65;
    flex-shrink: 0;
  }
}
```

### 10.2 新内容判定逻辑

```typescript
// store 中的判定方法
const isNewContent = (firstPublishAt: string | null): boolean => {
  if (!firstPublishAt) return false
  const publishDate = new Date(firstPublishAt)
  const now = new Date()
  const diffDays = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}
```

---

## 11. 卡片通用规格汇总

| 通用属性 | 值 |
|----------|------|
| 卡片间距 | `gap: 8px`（ResourceList 内 flex-direction: column） |
| 卡片圆角 | 10px (`$radius-lg`) |
| 卡片内边距 | 12px |
| hover 效果 | `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)` |
| active 效果 | `transform: scale(0.98)`，`transition: 0.1s ease` |
| 标题字号 | 14px bold |
| 标题行数限制 | 最多 2 行（`-webkit-line-clamp: 2`） |
| 标题颜色 | `#2E2E3A` |

```scss
// 卡片基础混入
@mixin card-base {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.1s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.98);
  }
}

@mixin card-title {
  font-size: 14px;
  font-weight: 700;
  color: #2E2E3A;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 12. V5.x 自检表

| # | 检查项 | 状态 | 备注 |
|---|--------|------|------|
| 1 | 9 种资源类型 → 7 个卡片组件映射是否完整 | ✅ | 含 fallback 逻辑 |
| 2 | 场景筛选逻辑 (scenes 字段) 是否明确 | ✅ | 有 scenes → 精确匹配；无 → preview/review |
| 3 | getCardComponent 动态组件选择是否定义 | ✅ | Record 映射 + fallback |
| 4 | KnowledgeCard 所有子元素规格是否完整 | ✅ | 封面/标题/标签/难度/进度/VIP |
| 5 | VIP 锁定 4 种状态是否区分 | ✅ | locked/unlocked/trial/free |
| 6 | PracticeCard 难度 3 级颜色是否标注 | ✅ | 绿/橙/红分段条 |
| 7 | GuideCard 下载图标交互是否定义 | ✅ | hover 变色 |
| 8 | ReadTextCard 渐变背景 + action pill 是否完整 | ✅ | #FFF1E3→#FFF9E0 |
| 9 | SummaryNoteCard Sparkles 徽章位置是否标注 | ✅ | 右上角绝对定位 |
| 10 | PremiumHookCard 金色渐变 + 去加购按钮是否定义 | ✅ | #FFD633→#FEA345 |
| 11 | NewBadge 两种尺寸 (resource/dot) 是否区分 | ✅ | pill vs 8px 圆点 |
| 12 | isNewContent 7 天判定逻辑是否明确 | ✅ | diffDays <= 7 |
| 13 | ContentChoiceModal 触发条件是否说明 | ✅ | isContainNote === true |
| 14 | 卡片通用混入 (card-base / card-title) 是否提供 | ✅ | SCSS mixin |
