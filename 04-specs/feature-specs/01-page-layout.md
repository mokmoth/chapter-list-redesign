# 功能详细设计：页面整体布局

> **功能 ID**：A1-A5
> **优先级**：P0
> **状态**：详设完成
> **原型参考**：`ChapterList.vue`

---

## 1. 功能概述

章节列表页的整体布局框架，包含响应式设计、移动端侧边栏抽屉、左右联动滚动同步等核心交互。

---

## 2. 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│                      page-container                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    top-area                            │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ GlobalHeader (返回 | SceneTabs | VIP入口)       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ FunctionBar (教材选择 | 快捷入口)               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    main-layout                         │  │
│  │  ┌──────────┐  ┌────────────────────────────────────┐ │  │
│  │  │ sidebar  │  │          content-area              │ │  │
│  │  │          │  │  ┌──────────────────────────────┐  │ │  │
│  │  │ 章节标题  │  │  │     LearningGuide           │  │ │  │
│  │  │ 章节目录  │  │  └──────────────────────────────┘  │ │  │
│  │  │          │  │  ┌──────────────────────────────┐  │ │  │
│  │  │          │  │  │     ResourceList            │  │ │  │
│  │  │          │  │  │     (按小节分组的卡片)       │  │ │  │
│  │  │          │  │  └──────────────────────────────┘  │ │  │
│  │  └──────────┘  └────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 详细设计

### A. 响应式布局规则

| 断点 | 屏幕宽度 | 布局方式 | 侧边栏状态 |
|------|----------|----------|------------|
| 桌面端 | ≥768px | 左右分栏 | 固定展示，宽度 260px |
| 移动端 | <768px | 全宽单栏 | 抽屉模式，宽度 80% |

### B. 核心容器样式规格

#### B1. page-container

```scss
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
```

#### B2. top-area

```scss
.top-area {
  background: #fff;
  z-index: 10;
  border-bottom: 1px solid #D4D2DC;
  // 固定在顶部，不参与滚动
}
```

#### B3. main-layout

```scss
.main-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}
```

#### B4. sidebar

```scss
.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #D4D2DC;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 80%;
    
    &.is-open {
      transform: translateX(0);
    }
  }
}
```

#### B5. content-area

```scss
.content-area {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: #fff;
  
  @media (max-width: 768px) {
    touch-action: pan-y;  // 显式允许垂直滚动
  }
}
```

### C. 移动端侧边栏交互

#### C1. 拉手按钮

| 属性 | 规格 |
|------|------|
| 位置 | 左侧，垂直黄金分割点 (top: 61.8%) |
| 尺寸 | 16px × 80px |
| 样式 | 圆角右侧 10px，淡橙色背景 |
| 图标 | ChevronRight，16px |
| 触发区域 | 扩展到 20px 便于点击 |

```scss
.mobile-toggle {
  display: none;  // 桌面端隐藏
  position: absolute;
  top: 61.8%;
  left: 0;
  transform: translateY(-50%);
  z-index: 20;
  width: 16px;
  height: 80px;
  background: rgba(255, 243, 229, 1);
  color: rgba(18, 18, 18, 1);
  border: 1px solid rgba(186, 186, 186, 1);
  border-radius: 0 10px 10px 0;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  &:active {
    width: 20px;
    background: rgba(255, 235, 210, 1);
  }
}
```

#### C2. 遮罩层

```scss
.sidebar-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 25;
  touch-action: none;  // 禁止手势，防止滚动冲突
}
```

### D. 状态管理

```typescript
// 组件内状态
const isSidebarOpen = ref(false);

// Store 状态
interface ChapterStore {
  loading: boolean;              // 加载状态
  selectedNodeId: string;        // 当前选中的章节ID
  isScrollingByClick: boolean;   // 正在执行点击触发的滚动
}
```

### E. 交互逻辑

#### E1. 侧边栏切换

```typescript
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 移动端点击目录项后自动收起
const handleTreeClick = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};
```

#### E2. 左右联动滚动

```typescript
// 监听选中节点变化，自动滚动侧边栏
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

### F. 加载状态

| 状态 | 展示内容 |
|------|----------|
| loading = true | 加载动画 (旋转圆环) + "正在加载..." 文案 |
| loading = false | 正常页面内容 |

```scss
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #FEA345;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}
```

---

## 4. 控件逻辑

| 控件 | 可用条件 | 点击效果 |
|------|----------|----------|
| 返回按钮 | 始终可用 | 返回上一页 |
| 侧边栏拉手 | 移动端 + 侧边栏关闭 | 展开侧边栏 |
| 遮罩层 | 移动端 + 侧边栏打开 | 关闭侧边栏 |
| 侧边栏目录项 | 始终可用 | 跳转到对应资源 + 关闭侧边栏(移动端) |

---

## 5. 异常处理

| 异常场景 | 处理方式 | 用户提示 |
|----------|----------|----------|
| 数据加载失败 | 显示重试按钮 | "加载失败，请重试" |
| 章节数据为空 | 显示空状态 | "暂无数据" |

---

## 6. 依赖组件

| 组件 | 用途 |
|------|------|
| GlobalHeader | 顶部导航 |
| FunctionBar | 功能栏 |
| SceneTabs | 场景切换 (嵌入在 Header 中) |
| ChapterTree | 章节目录 |
| ResourceList | 资源列表 |

---

## 7. V5.x 自检

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 响应式断点明确 | ✅ | 768px 为断点 |
| 布局结构清晰 | ✅ | 三级容器嵌套 |
| 移动端交互完整 | ✅ | 抽屉 + 拉手 + 遮罩 |
| 状态管理合理 | ✅ | 本地状态 + Store |
| 联动逻辑清晰 | ✅ | 左右滚动同步 |
| 异常处理覆盖 | ✅ | 加载失败 + 空状态 |

