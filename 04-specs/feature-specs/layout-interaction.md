# 功能详设：布局与交互 (Layout & Interaction)

> **版本**：V1.0
> **更新时间**：2026-01-12

## 1. 响应式布局策略

| 视口宽度 | 模式 | 侧边栏行为 | 功能栏行为 |
|----------|------|------------|------------|
| >= 768px | Desktop | 固定展示 (260px) | 展开所有快捷按钮 |
| < 768px | Mobile | 默认隐藏 (Drawer) | 收入"≡"汉堡菜单 |

### 1.1 移动端抽屉 (Drawer)
- **唤起方式**：
  - 点击左侧边缘的"拉手"浮窗 (`.mobile-toggle`)
  - (可选) 屏幕左边缘右滑手势
- **关闭方式**：
  - 点击遮罩层 (`.sidebar-overlay`)
  - 点击任意目录节点
- **动画**：`transform: translateX(-100% -> 0)`，过渡时间 `0.3s`。

## 2. 双向滚动联动 (Two-Way Scroll Sync)

实现目录树与资源列表的精准同步。

### 2.1 目录 -> 内容 (Click to Scroll)
- **触发**：用户点击左侧 `ChapterTree` 的子节点。
- **行为**：
  1. `store.selectNode(id)` 更新选中状态。
  2. `store.setScrollingByClick(true)` **锁定滚动监听**，防止页面滚动时触发反向更新。
  3. `ResourceList` 接收信号，执行 `scrollIntoView({ behavior: 'smooth' })`。
  4. 滚动结束后（利用 `setTimeout`），释放滚动锁。

### 2.2 内容 -> 目录 (Scroll to Highlight)
- **触发**：用户滚动右侧 `ResourceList`。
- **检测**：使用 `IntersectionObserver` 监听每个 `.subsection-group`。
- **配置**：
  - `rootMargin: '-10% 0px -85% 0px'`
  - 仅在视口顶部 10%-15% 的区域判定为"当前激活"，确保高亮准确。
- **行为**：
  1. 检查 `!store.isScrollingByClick` (未锁定)。
  2. 触发 `store.selectNode(id)`。
  3. 左侧目录树自动滚动，确保高亮节点在可视区内 (`scrollIntoView`)。

## 3. 吸顶交互

- **SceneTabs**：非嵌入模式下 (`GlobalHeader` 放不下时)，在页面滚动时吸附顶部。
- **SubsectionHeader**：小节标题在组内滚动时吸附顶部，增强上下文感知。
