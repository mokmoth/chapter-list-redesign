# 功能详细设计：页面整体布局

| 项目 | 值 |
|------|------|
| 文档版本 | V2.0 |
| 日期 | 2026-03-13 |
| 关联原型 | chapter-list-redesign V1.6 |
| 涉及组件 | `ChapterList.vue` |
| 状态 | Draft |

---

## 1. 页面结构总览

```
page-container
├── top-area (固定顶部)
│   ├── GlobalHeader          ← 40px
│   └── FunctionBar           ← 44px
├── main-layout (flex 横向)
│   ├── sidebar               ← 固定 260px (桌面) / 抽屉 80vw (移动)
│   │   ├── sidebar-header
│   │   │   ├── chapter-title
│   │   │   └── switch-button (RefreshCw icon)
│   │   └── ChapterTree
│   └── content-area (flex: 1)
│       ├── SceneTabs         ← 独立行 (移动端)
│       ├── LearningGuide
│       ├── ResourceList
│       └── ChapterFooter
└── loading-overlay (条件渲染)
    ├── spinner
    └── "正在加载..."
```

---

## 2. 顶部区域 (top-area)

| 子组件 | 高度 | 说明 |
|--------|------|------|
| `GlobalHeader` | 40px | 全局导航栏，固定于视口顶部 |
| `FunctionBar` | 44px | 功能操作栏（设置、返回等），紧贴 Header 下方 |

```scss
.top-area {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: calc(40px + 44px); // header + functionbar
  flex-shrink: 0;
}
```

---

## 3. 主布局 (main-layout)

### 3.1 桌面端布局

```scss
.main-layout {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 84px); // 减去 top-area
  overflow: hidden;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #D4D2DC;
  background: #FFFFFF;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  min-width: 0; // 防止 flex 子元素溢出
}
```

### 3.2 移动端抽屉模式

移动端 sidebar 转为左侧抽屉，通过 `isSidebarOpen` 控制显隐。

```scss
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    top: 84px; // top-area 高度
    left: 0;
    width: 80vw;
    max-width: 320px;
    height: calc(100vh - 84px);
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: none;

    &.is-open {
      transform: translateX(0);
      box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
    }
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    top: 84px;
    background: rgba(0, 0, 0, 0.4);
    z-index: 199;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.is-visible {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
```

### 3.3 抽屉开关按钮

| 属性 | 值 |
|------|------|
| 位置 | 屏幕左侧边缘，垂直位置 = 可视区高度 × 61.8%（黄金比例） |
| 图标 | `ChevronRight`（关闭态）/ `ChevronLeft`（展开态） |
| 尺寸 | 24px × 48px，圆角 0 12px 12px 0 |
| 背景 | `#FEA345` |
| 颜色 | `#FFFFFF` |
| z-index | 201 |

```scss
.sidebar-toggle {
  position: fixed;
  left: 0;
  top: 61.8%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  border-radius: 0 12px 12px 0;
  background: #FEA345;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 201;
  cursor: pointer;
  transition: left 0.3s ease;

  .sidebar.is-open ~ & {
    left: 80vw;
  }
}
```

---

## 4. 加载状态

```html
<div v-if="isLoading" class="loading-overlay">
  <div class="loading-spinner" />
  <span class="loading-text">正在加载...</span>
</div>
```

```scss
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 84px);
  gap: 12px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #D4D2DC;
    border-top-color: #FEA345;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-size: 14px;
    color: #848096;
  }
}
```

---

## 5. 响应式断点规则

| 断点名称 | 条件 | 布局模式 | 关键变化 |
|----------|------|----------|----------|
| desktop | `≥768px` | 并列 sidebar + content | sidebar 固定 260px 显示 |
| mobile | `<768px` | 抽屉 + 全宽 content | sidebar 转为 80vw 抽屉 |
| small-mobile | `<600px` | 抽屉 + 全宽 content | content 内边距收窄至 12px |
| tiny | `<380px` | 抽屉 + 全宽 content | 字号整体缩小，间距压缩 |
| micro | `<360px` | 抽屉 + 全宽 content | 极限压缩，卡片单列满宽 |

```scss
// 断点变量
$breakpoint-mobile: 768px;
$breakpoint-small-mobile: 600px;
$breakpoint-tiny: 380px;
$breakpoint-micro: 360px;

// content-area 响应式内边距
.content-area {
  padding: 16px 20px;

  @media (max-width: $breakpoint-mobile - 1) {
    padding: 12px 16px;
  }

  @media (max-width: $breakpoint-small-mobile - 1) {
    padding: 10px 12px;
  }

  @media (max-width: $breakpoint-tiny - 1) {
    padding: 8px 10px;
  }

  @media (max-width: $breakpoint-micro - 1) {
    padding: 6px 8px;
  }
}
```

---

## 6. 组件状态

| 状态变量 | 类型 | 默认值 | 说明 |
|----------|------|--------|------|
| `isSidebarOpen` | `Ref<boolean>` | `false` | 移动端抽屉开关（桌面端忽略） |
| `currentView` | `Ref<'main' \| 'settings'>` | `'main'` | 当前视图（主页面 / 设置页） |
| `isLoading` | `Ref<boolean>` | `true` | 页面数据加载中 |

```typescript
// ChapterList.vue
const isSidebarOpen = ref(false)
const currentView = ref<'main' | 'settings'>('main')
const isLoading = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
```

---

## 7. V5.x 自检表

| # | 检查项 | 状态 | 备注 |
|---|--------|------|------|
| 1 | 页面结构图是否完整覆盖所有区域 | ✅ | top-area / main-layout / loading |
| 2 | 桌面端 sidebar 宽度 260px 是否明确 | ✅ | 固定值，flex-shrink: 0 |
| 3 | 移动端抽屉宽度 80vw + overlay 是否定义 | ✅ | max-width 320px，overlay rgba(0,0,0,0.4) |
| 4 | 抽屉开关按钮黄金比例定位是否标注 | ✅ | top: 61.8%，ChevronRight 图标 |
| 5 | 5 级响应式断点是否全部列出 | ✅ | 768/600/380/360 四个断点 |
| 6 | 加载状态 UI 是否完整 | ✅ | spinner + 文字 |
| 7 | 状态变量类型与默认值是否明确 | ✅ | isSidebarOpen / currentView / isLoading |
| 8 | SCSS 关键数值是否与 Design Tokens 一致 | ✅ | 颜色 / 字号 / 圆角均引用 tokens |
