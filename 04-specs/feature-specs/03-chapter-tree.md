# 功能详细设计：章节目录树

> **功能 ID**：C1-C7, E5
> **优先级**：P0
> **状态**：详设完成
> **原型参考**：`ChapterTree.vue`, `ResourceList.vue` (滚动监听)

---

## 1. 功能概述

实现递归渲染的章节目录树，支持三级层级（chapter/section/subsection），与右侧资源列表双向联动。

---

## 2. 数据结构

### A. 章节层级定义

| 层级 | Key | 显示特征 | 可点击 | 包含内容 |
|------|-----|----------|--------|----------|
| 章节 | `chapter` | 顶层标题，粗体 | 否 | 大节列表 |
| 大节 | `section` | 中间标题，显示进度 | 否 | 小节列表 |
| 小节 | `subsection` | 叶子节点，可高亮 | **是** | 资源列表 |

### B. TypeScript 定义

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

### C. Mock 数据结构示例

```typescript
const mockChapters: Chapter[] = [
  {
    id: 'ch_7',
    title: '7-相交线与平行线',
    level: 'chapter',
    progress: { completed: 5, total: 25 },
    isExpanded: true,
    children: [
      {
        id: 'sec_7_1',
        title: '7.1 相交线',
        level: 'section',
        isExpanded: true,
        children: [
          {
            id: 'sub_7_1_1',
            title: '7.1.1 相交线',
            level: 'subsection',
            resources: [/* Resource[] */]
          },
          // ...more subsections
        ]
      },
      // ...more sections
    ]
  }
];
```

---

## 3. 详细设计

### A. 侧边栏标题区

```scss
.sidebar-chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #F5F4F8;
  border-bottom: 1px solid #D4D2DC;

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #2E2E3A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .switch-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: #845EFF;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 11px;
    cursor: pointer;
  }
}
```

### B. 目录树递归组件

```vue
<template>
  <div class="chapter-tree">
    <div v-for="item in chapters" :key="item.id" class="tree-node">
      <div 
        :id="`sidebar-node-${item.id}`"
        class="node-content" 
        :class="{ 
          'is-selected': store.selectedNodeId === item.id,
          'is-subsection': item.level === 'subsection',
          'is-section': item.level === 'section'
        }"
        @click.stop="handleNodeClick(item)"
      >
        <span v-if="item.level === 'subsection'" class="arrow-placeholder"></span>
        <span class="title">{{ item.title }}</span>
        <span class="progress" v-if="item.progress && item.level === 'section'">
          {{ item.progress.completed }}/{{ item.progress.total }}
        </span>
      </div>

      <div v-if="item.children && item.children.length" class="node-children">
        <ChapterTree :chapters="item.children" />
      </div>
    </div>
  </div>
</template>
```

### C. 层级样式规格

#### C1. 大节 (section)

```scss
.node-content.is-section {
  cursor: default;
  font-weight: 600;
  color: #2E2E3A;
  padding-top: 12px;
  padding-bottom: 4px;
}
```

#### C2. 小节 (subsection)

```scss
.node-content.is-subsection {
  padding-left: 24px;
  font-size: 13px;
  
  &:hover {
    background: #f5f5f5;
  }
}
```

#### C3. 选中状态

```scss
.node-content.is-selected {
  background: #FFF0E6;
  color: #FEA345;

  .title {
    color: #FEA345;
    font-weight: 600;
  }
}
```

### D. 点击交互逻辑

```typescript
const handleNodeClick = (item: Chapter) => {
  if (item.level === 'subsection') {
    // 1. 开启滚动锁，防止观察者干扰
    store.isScrollingByClick = true;
    store.selectedNodeId = item.id;

    // 2. 执行滚动
    const el = document.getElementById(`subsection-${item.id}`);
    const container = document.querySelector('.resource-list-container');
    
    if (el && container) {
      const targetTop = el.offsetTop - 16;
      container.scrollTo({ top: targetTop, behavior: 'smooth' });

      // 3. 滚动结束后释放锁 (平滑滚动通常在 500ms 内结束)
      setTimeout(() => {
        store.isScrollingByClick = false;
      }, 600);
    } else {
      store.isScrollingByClick = false;
    }
  }
};
```

### E. 滚动监听联动

在 `ResourceList.vue` 中实现：

```typescript
const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    // 如果是点击触发的滚动，不执行观察者逻辑
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
    rootMargin: '-10% 0px -85% 0px' // 关键：将感应区压缩在顶部
  });

  const subsections = document.querySelectorAll('.subsection-group');
  subsections.forEach(el => observer?.observe(el));
};
```

### F. 侧边栏自动跟随

在主页面 `ChapterList.vue` 中监听：

```typescript
watch(() => store.selectedNodeId, (newId) => {
  if (newId && !store.isScrollingByClick) {
    nextTick(() => {
      const el = document.getElementById(`sidebar-node-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
```

---

## 4. 状态管理

| 状态 | 存储位置 | 用途 |
|------|----------|------|
| `selectedNodeId` | Store | 当前选中的小节 ID |
| `isScrollingByClick` | Store | 滚动锁，防止联动冲突 |
| `chapters` | Store | 章节数据 |

---

## 5. 控件逻辑

| 控件 | 可用条件 | 点击效果 |
|------|----------|----------|
| 大节标题 | - | 不可点击 |
| 小节标题 | 始终可用 | 滚动到对应资源区，更新选中状态 |
| 切换按钮 | 始终可用 | 打开教材选择弹窗 (placeholder) |

---

## 6. 样式规格汇总

| 元素 | 字号 | 颜色 | 内边距 |
|------|------|------|--------|
| 大节标题 | 14px | #2E2E3A | 12px 12px 4px 12px |
| 小节标题 | 13px | #2E2E3A | 8px 12px 8px 24px |
| 进度文案 | 11px | #999 | - |
| 选中背景 | - | #FFF0E6 | - |
| 选中文字 | - | #FEA345 | - |

---

## 7. 联动时序图

```
用户点击小节:
  ┌──────────┐     ┌───────────┐     ┌──────────────┐
  │ChapterTree│     │   Store   │     │ ResourceList │
  └────┬─────┘     └─────┬─────┘     └──────┬───────┘
       │                 │                   │
       │ click(item)     │                   │
       │─────────────────>                   │
       │                 │                   │
       │ isScrollingByClick = true           │
       │ selectedNodeId = item.id            │
       │                 │                   │
       │                 │ scrollTo(element) │
       │                 │──────────────────>│
       │                 │                   │
       │       (600ms timeout)               │
       │ isScrollingByClick = false          │
       │                 │                   │

用户滚动资源列表:
  ┌──────────────┐     ┌───────────┐     ┌──────────┐
  │ ResourceList │     │   Store   │     │ChapterTree│
  └──────┬───────┘     └─────┬─────┘     └────┬─────┘
         │                   │                 │
         │ IntersectionObserver              │
         │ (entry.isIntersecting)            │
         │                   │                 │
         │ if (!isScrollingByClick)          │
         │   selectedNodeId = id             │
         │                   │                 │
         │                   │ watch()        │
         │                   │───────────────>│
         │                   │                 │
         │                   │scrollIntoView()│
         │                   │                 │
```

---

## 8. V5.x 自检

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 数据结构明确 | ✅ | Chapter interface 定义 |
| 递归渲染实现 | ✅ | 组件自引用 |
| 层级样式区分 | ✅ | section/subsection 不同样式 |
| 选中状态管理 | ✅ | Store 统一管理 |
| 点击联动完整 | ✅ | 点击 → 滚动 → 更新状态 |
| 滚动联动完整 | ✅ | IntersectionObserver |
| 冲突防护完善 | ✅ | isScrollingByClick 锁机制 |

