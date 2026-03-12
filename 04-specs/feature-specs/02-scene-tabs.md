# 功能详细设计：场景Tab切换

> **功能 ID**：B3-B4, D1-D3
> **优先级**：P0
> **状态**：详设完成
> **原型参考**：`SceneTabs.vue`, `LearningGuide.vue`

---

## 1. 功能概述

实现预习/复习/加餐三个场景的切换，包含 Tab 组件和与之联动的学习方法指南。

---

## 2. 场景定义

| 场景 Key | 显示名称 | 默认选中 | 典型资源 |
|----------|----------|----------|----------|
| `preview` | 预习 | 否 | 概念课视频、背单词、学案 |
| `review` | 复习 | **是** | 解题课视频、笔记、错题本、刷题 |
| `extra` | 加餐 | 否 | 同步刷题、培优课、拓展 |

---

## 3. 详细设计

### A. 数据结构

```typescript
type SceneType = 'preview' | 'review' | 'extra';

const tabs: { key: SceneType; label: string }[] = [
  { key: 'preview', label: '预习' },
  { key: 'review', label: '复习' },
  { key: 'extra', label: '加餐' }
];
```

### B. 状态管理

```typescript
// Store
const currentTab = ref<SceneType>('preview');  // 当前选中Tab

const switchTab = async (tab: SceneType) => {
  if (currentTab.value === tab) return;
  currentTab.value = tab;
  await fetchChapters();  // 切换后重新加载数据
};
```

### C. 展示模式

Tab 组件支持两种展示模式：

| 模式 | 使用场景 | 样式特点 |
|------|----------|----------|
| 默认模式 | 独立使用 | 全宽平铺，底部指示器 |
| 嵌入模式 | 嵌入 Header | 紧凑胶囊，背景高亮 |

#### C1. 默认模式样式

```scss
.scene-tabs:not(.is-embedded) {
  border-bottom: 1px solid #eee;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    color: #848096;

    &.active {
      color: #2E2E3A;
      font-weight: 600;
      font-size: 18px;
    }

    .indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: #FEA345;
      border-radius: 2px;
    }
  }
}
```

#### C2. 嵌入模式样式

```scss
.scene-tabs.is-embedded {
  background: transparent;
  padding: 0 4px;
  gap: 4px;
  
  .tab-item {
    padding: 6px 12px;
    font-size: 14px;
    color: #848096;
    border-radius: 999px;
    white-space: nowrap;

    @media (max-width: 380px) {
      padding: 6px 10px;
      font-size: 13px;
    }

    // "全部" tab 使用描边胶囊样式
    &.is-all {
      border: 1px solid #D4D2DC;
    }

    &.active {
      background: #FFF0E6;
      color: #FEA345;
      font-weight: 600;
    }
  }
}
```

### D. 学习方法指南联动

指南内容根据当前 Tab 动态变化：

```typescript
const guideContent = {
  preview: "预习建议：重点关注相交线中的对顶角与邻补角定义，尝试画出简单的三线八角图。",
  review: "复习建议：总结平行线的三个判定定理与性质定理的区别，熟练掌握子弹图、猪手图的辅助线添加方法。",
  extra: "加餐建议：挑战平行线的复杂证明题，尝试用多种方法证明同一结论。"
};

// Store computed
const currentGuide = computed(() => guideContent[currentTab.value]);
```

### E. 指南卡片设计

```scss
.learning-guide {
  background: #FFF9F2;
  border-radius: 8px;
  margin: 12px 16px;
  padding: 0 12px;
  
  .guide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
    
    .title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
      color: #8C5A00;
      
      .icon { color: #FEA345; }
    }
    
    .action {
      font-size: 12px;
      color: #999;
    }
  }
  
  .guide-content {
    padding-bottom: 12px;
    font-size: 13px;
    color: #848096;
    line-height: 1.5;
  }
}
```

### F. 折叠动画

```scss
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
```

---

## 4. 交互逻辑

| 交互 | 效果 |
|------|------|
| 点击 Tab | 切换场景，重新过滤资源，更新指南内容 |
| 点击指南标题 | 折叠/展开指南内容 |
| 切换 Tab | 资源列表滚动到顶部 |

### 切换 Tab 完整流程

```typescript
const switchTab = async (tab: SceneType) => {
  if (currentTab.value === tab) return;
  
  // 1. 更新状态
  currentTab.value = tab;
  
  // 2. 重新加载数据
  await fetchChapters();
  
  // 3. 滚动到顶部 (在 ResourceList 中监听)
  // containerRef.value.scrollTop = 0;
  
  // 4. 重新设置滚动观察者
  // setupObserver();
};
```

---

## 5. 控件逻辑

| 控件 | 可用条件 | 点击效果 |
|------|----------|----------|
| 预习 Tab | 始终可用 | 切换到预习场景 |
| 复习 Tab | 始终可用 | 切换到复习场景 |
| 加餐 Tab | 始终可用 | 切换到加餐场景 |
| 指南标题 | 始终可用 | 切换折叠状态 |

---

## 6. 文案规范

| 场景 | Tab 文案 | 指南内容模板 |
|------|----------|--------------|
| 预习 | 预习 | {学科}建议：重点关注{概念}，尝试{练习方式} |
| 复习 | 复习 | {学科}建议：总结{知识点}的区别，掌握{技巧} |
| 加餐 | 加餐 | {学科}建议：挑战{难度题型}，尝试{拓展方法} |

---

## 7. 交互反馈

| 交互 | 反馈 |
|------|------|
| Tab 切换 | 选中状态变化 (0.2s 过渡) |
| 指南展开 | 高度动画 (0.3s ease) |
| 指南收起 | 高度动画 + 透明度渐变 |

---

## 8. V5.x 自检

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 场景定义明确 | ✅ | 3 个场景，明确 key 和 label |
| 状态管理清晰 | ✅ | Store 统一管理 currentTab |
| 两种模式支持 | ✅ | 默认模式 + 嵌入模式 |
| 联动逻辑完整 | ✅ | Tab → 指南 → 资源过滤 |
| 动画效果平滑 | ✅ | CSS transition |
| 响应式适配 | ✅ | 小屏幕字号和间距调整 |

