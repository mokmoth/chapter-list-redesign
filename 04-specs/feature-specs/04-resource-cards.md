# 功能详细设计：资源卡片组件

> **功能 ID**：E1-E6, F1-F10, G1-G7, H1-H4
> **优先级**：P0
> **状态**：详设完成
> **原型参考**：`ResourceList.vue`, 所有 `*Card.vue` 组件

---

## 1. 功能概述

实现资源列表容器和 10 种不同类型的资源卡片组件，支持场景过滤、VIP 权限控制、学习进度展示。

---

## 2. 资源类型体系

### A. 资源类型枚举

```typescript
type ResourceType = 
  | 'video'           // 知识点视频
  | 'exercise'        // 练习题
  | 'paper'           // 试卷
  | 'guide'           // 学案
  | 'exam'            // 考试
  | 'recite'          // 背诵（单词/课文）
  | 'mind_map'        // 思维导图
  | 'quick_review'    // 极速复习
  | 'ai_solve'        // AI拍题精学
  | 'note'            // 学霸笔记
  | 'error_book'      // 错题本
  | 'quick_memorize'  // 快背
  | 'practice'        // 同步刷题
  | 'premium_video';  // 培优课视频
```

### B. 类型与组件映射

| 资源类型 | 卡片组件 | 布局类型 | 适用场景 |
|----------|----------|----------|----------|
| `video` | KnowledgeCard | 横向图文 | preview, review |
| `mind_map` | MindMapCard | 横向图标 | preview, review |
| `recite` | ReciteCard | 横向图标 | preview |
| `quick_review` | QuickReviewCard | 紧凑图标 | review |
| `ai_solve` | AISolveCard | 紧凑图标 | review |
| `note` | NoteCard | 紧凑图标 | review |
| `error_book` | ErrorBookCard | 紧凑图标 | review |
| `quick_memorize` | QuickMemorizeCard | 紧凑图标 | extra (文科) |
| `practice` | PracticeCard | 横向图文 | extra |
| `premium_video` | PremiumKnowledgeCard | 横向图文 | extra |

---

## 3. 资源列表容器

### A. 场景过滤逻辑

```typescript
const filteredSubsections = computed(() => {
  return store.allSubsections.map(sub => {
    const resources = sub.resources?.filter(res => {
      // 1. 场景过滤
      let sceneMatch = false;
      if (!res.scenes || res.scenes.length === 0) {
        // 无场景标记的资源默认显示在 preview/review
        sceneMatch = store.currentTab === 'preview' || store.currentTab === 'review';
      } else {
        sceneMatch = res.scenes.includes(store.currentTab);
      }
      
      if (!sceneMatch) return false;
      
      // 2. 学科过滤：快背卡片只对文科显示
      if (res.type === 'quick_memorize') {
        const liberalArtsSubjects = ['地理', '历史', '政治', '生物', '化学'];
        return res.subject && liberalArtsSubjects.includes(res.subject);
      }
      
      return true;
    }) || [];

    return { ...sub, resources };
  }).filter(sub => sub.resources.length > 0);
});
```

### B. 组件动态选择

```typescript
const getCardComponent = (type: string) => {
  const componentMap: Record<string, Component> = {
    'mind_map': MindMapCard,
    'recite': ReciteCard,
    'quick_review': QuickReviewCard,
    'ai_solve': AISolveCard,
    'note': NoteCard,
    'error_book': ErrorBookCard,
    'quick_memorize': QuickMemorizeCard,
    'practice': PracticeCard,
    'premium_video': PremiumKnowledgeCard,
  };
  return componentMap[type] || KnowledgeCard;
};
```

### C. 滚动监听设置

```typescript
const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    if (store.isScrollingByClick) return;
    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('subsection-', '');
        store.selectedNodeId = id;
      }
    });
  }, {
    root: containerRef.value,
    threshold: [0, 0.1, 0.2],
    rootMargin: '-10% 0px -85% 0px'  // 感应区在顶部 10%-15%
  });
};
```

---

## 4. 卡片组件详细设计

### 4.1 KnowledgeCard（知识点视频卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│                              [VIP角标/已解锁]     │
│  ┌─────────┐  标题文字                            │
│  │  封面图  │  [概念课] [新中考] [难度★★☆]        │
│  │ (100×60)│  5分钟 · 随堂检测 5题                │
│  └─────────┘  ═══════════════════════ 45%        │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 卡片 | 圆角 14px，内边距 10px，底部间距 12px |
| 封面 | 100×60px，圆角 8px |
| 标题 | 14px，#2E2E3A，加粗，最多 2 行 |
| 分类标签 | 10px，紫色底 #EBF3FF，文字 #845EFF |
| 价值标签 | 10px，橙色底 #FFF0E6，文字 #FEA345 |
| 难度星星 | 10px，填充色 #FEA345 |
| 元信息 | 11px，#999 |
| 进度条 | 分段式 (10段)，高 4px，背景 #D4D2DC，填充 #92E066 |
| 会员角标 | 右上角，珊瑚色 #FA5A65 背景，白色文字 "会员" |

**VIP 状态处理**：

| 状态 | 显示 |
|------|------|
| `isFree: true` | 无角标 |
| `isFree: false` + 非VIP | "会员"锁定角标 (珊瑚色 #FA5A65) |
| `isFree: false` + VIP | "已解锁"角标（弱化显示） |
| `isTrial: true` | "免费试看"角标 |

---

### 4.2 MindMapCard（思维导图卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  ┌─────────┐  思维导图标题                        │
│  │  图标区  │  知识脉络一目了然        [查看 >]   │
│  │ (100×60)│                                     │
│  └─────────┘                                     │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 100×60px，背景 #F0F7FF，BrainCircuit 图标 |
| 标题 | 14px，#2E2E3A，加粗 |
| 副标题 | 11px，#999 |
| 操作按钮 | 12px，#845EFF |

---

### 4.3 ReciteCard（背诵卡片）

**子类型**：
- `vocab`：背单词（橙色主题）
- `text`：读课文（绿色主题）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  ┌─────────┐  [背单词]                           │
│  │  图标区  │  核心词汇：平行线相关概念 [开始 ▶]  │
│  │ (100×60)│  共 15 个词汇                       │
│  └─────────┘                                     │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 子类型 | 图标区背景 | 标签颜色 | 图标 |
|--------|------------|----------|------|
| vocab | #FFF9F5 | #FEA345 | Languages |
| text | #F6FFF7 | #92E066 | BookOpenCheck |

---

### 4.4 QuickReviewCard（极速复习卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  (⚡)  极速复习                         [开始]   │
│  [📷] 拍照关联知识点视频                         │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形，背景 #FFFBF0 |
| 主图标 | Zap，18px，#FFD633 |
| 相机徽章 | 18×18px 圆形，背景 #FFD633 |
| 操作文字 | 11px，#FFD633 |

---

### 4.5 AISolveCard（AI拍题精学卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  (✨)  拍题精学                         [开始]   │
│  [📷] 拍照获得AI讲解                             │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形，背景 #F0F7FF |
| 主图标 | Sparkles，18px，#845EFF |
| 相机徽章 | 18×18px 圆形，背景 #845EFF |
| 操作文字 | 11px，#845EFF |

---

### 4.6 NoteCard（学霸笔记卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  (📝)  学霸笔记                            [>]   │
│        3条笔记                                   │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形，背景 #FFFBF0 |
| 图标 | NotebookPen，20px，#FFD633 |

---

### 4.7 ErrorBookCard（错题本卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  (✗)  错题本                               [>]   │
│       5道错题                                    │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形，背景 #FFF0E6 |
| 图标 | BookX，20px，#FEA345 |

---

### 4.8 QuickMemorizeCard（快背卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│  (🧠)  快背地理                            [>]   │
│        快速识记知识卡片                          │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 40×40px 圆形，背景 #F1F8F4 |
| 图标 | Brain，20px，#92E066 |

**显示条件**：仅当 `subject` 在文科学科列表中时显示。

---

### 4.9 PracticeCard（同步刷题卡片）

**布局结构**：
```
┌──────────────────────────────────────────────────┐
│                              [VIP角标/已解锁]     │
│  ┌─────────┐  7.1.1 相交线                       │
│  │ 刷题图标 │  包含难度：基础 中等 困难           │
│  │ (100×60)│  ═══════════════════════ 5/20题     │
│  └─────────┘                                     │
└──────────────────────────────────────────────────┘
```

**样式规格**：

| 元素 | 规格 |
|------|------|
| 图标区 | 100×60px，背景 #F0F7FF |
| 图标 | SVG 试卷图形，紫色 #845EFF |
| 标签 | "同步刷题"，10px，#845EFF |
| 难度文字 | 文字标签 + 彩色分段下划线，11px，#848096 |
| 进度文字 | "x/y题"，11px，#848096 |

---

### 4.10 PremiumKnowledgeCard（培优课视频卡片）

**布局结构**：与 KnowledgeCard 类似，但角标不同。

**VIP 状态处理**：

| 状态 | 显示 |
|------|------|
| `premiumStatus: 'locked'` | "去加购"角标（渐变背景） |
| `premiumStatus: 'unlocked'` | "培优课"角标（金色背景） |

---

## 5. 公共样式规范

### A. 卡片基础样式

```scss
.card-base {
  display: flex;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  gap: 12px;
  border: 1px solid transparent;
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.98);
    background: #f9f9f9;
  }
  
  &.is-locked {
    background: #FAFAFA;
  }
}
```

### B. VIP 角标样式

```scss
// 锁定状态 — "会员"角标
.badge-lock-corner {
  position: absolute;
  top: 0;
  right: 0;
  background: #FA5A65;  // 珊瑚色 (错误-红)
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 0 0 0 10px;
  display: flex;
  align-items: center;
  gap: 3px;
  // 角标文字从 "VIP" 改为 "会员"
}

// 已解锁状态
.badge-unlocked-corner {
  position: absolute;
  top: 0;
  right: 0;
  background: #D4D2DC;
  color: #999;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 0 0 0 10px;
  opacity: 0.8;
}
```

### C. 进度条样式（分段式，10段）

```scss
.progress-bar {
  flex: 1;
  height: 4px;
  display: flex;
  gap: 2px;                // 分段间隙

  .segment {
    flex: 1;
    height: 100%;
    background: #D4D2DC;   // 未完成段
    border-radius: 2px;

    &.filled {
      background: #92E066; // 已完成段 (正确-绿)
    }
  }
}
```

---

## 6. 权限控制逻辑

### A. 锁定状态计算

```typescript
// 普通资源
const isLocked = computed(() => !props.resource.isFree && !store.isVip);

// 培优课资源
const isPremiumLocked = computed(() => {
  return props.resource.premiumStatus === 'locked' || 
         (!store.hasPremiumAccess && props.resource.isPremium);
});
```

### B. 点击处理

```typescript
const handleClick = () => {
  if (isLocked.value) {
    if (confirm('该内容需要开通 VIP 才能观看，是否立即开通？')) {
      store.unlockVip();
    }
  } else {
    alert(`进入学习：${props.resource.title}`);
  }
};
```

---

## 7. 进度展示逻辑

### A. 知识点进度

```typescript
const progress = computed(() => store.progressMap[props.resource.id]);

// 展示百分比
{{ progress?.percentage || 0 }}%
```

### B. 刷题进度

```typescript
const questionCountText = computed(() => {
  const completed = props.resource.completedCount || 0;
  const total = props.resource.totalCount || props.resource.questionCount || 0;
  return `${completed}/${total}`;
});
```

---

## 8. V5.x 自检

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 资源类型完整 | ✅ | 10 种卡片类型 |
| 场景过滤正确 | ✅ | scenes 数组判断 |
| 学科过滤正确 | ✅ | 快背卡片文科限制 |
| VIP 状态处理 | ✅ | 锁定/解锁/试看 |
| 培优课权限 | ✅ | 独立权限体系 |
| 进度展示完整 | ✅ | 百分比/题目数 |
| 样式规范统一 | ✅ | 公共变量复用 |
| 交互反馈及时 | ✅ | 点击缩放动画 |

