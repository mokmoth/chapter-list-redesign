# 数据模型定义 (Data Model)

> **版本**：V1.0
> **更新时间**：2026-01-12

本文档定义了系统中的核心数据结构和类型接口。

## 1. 章节与资源结构 (Chapter & Resource)

### 1.1 资源类型 (ResourceType)
```typescript
type ResourceType = 
  | 'video'           // 知识点视频 + 课后题
  | 'practice'        // 同步刷题
  | 'guide'           // 学案
  | 'read_text'       // 读课文（文科）
  | 'summary_note'    // 总结类笔记
  | 'recite'          // 背单词（英语）
  | 'mind_map'        // 思维导图
  | 'error_book'      // 错题本
  | 'premium_hook';   // 培优课钩子
```

### 1.2 资源实体 (Resource)
```typescript
interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  duration?: number;      // 视频时长(分钟)
  questionCount?: number; // 题目数量
  difficulty?: 1 | 2 | 3; // 难度星级
  isFree?: boolean;       // 是否免费
  isTrial?: boolean;      // 是否试看
  scenes?: SceneType[];   // 适用场景 (preview, review, extra)
  // ... 其他元数据
}
```

### 1.3 章节节点 (Chapter)
```typescript
interface Chapter {
  id: string;
  title: string;
  level: 'chapter' | 'section' | 'subsection';
  children?: Chapter[];   // 子章节
  resources?: Resource[]; // 该节点下的资源
  isExpanded?: boolean;   // UI状态：是否展开
}
```

## 2. 应用设置 (App Settings)

用户偏好设置，持久化存储于 `localStorage`。

### 2.1 设置接口 (AppSettings)
```typescript
interface AppSettings {
  // 复习模式学习顺序
  reviewLearningMode: 'quiz-first' | 'video-first' | 'ask-every-time';
  
  // 默认进入的场景 Tab
  defaultSceneTab: 'all' | 'last-selected';
  
  // 同步刷题默认难度筛选
  practiceDifficulties: ('basic' | 'medium' | 'hard')[];
  
  // 上次选择的 Tab (用于 defaultSceneTab='last-selected')
  lastSelectedTab: SceneType | 'all';
}
```

### 2.2 默认值
```typescript
const DEFAULT_SETTINGS: AppSettings = {
  reviewLearningMode: 'ask-every-time',
  defaultSceneTab: 'all',
  practiceDifficulties: ['basic', 'medium', 'hard'],
  lastSelectedTab: 'preview'
}
```

## 3. 用户进度 (User Progress)

记录用户的学习状态。

```typescript
interface UserProgress {
  nodeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  percentage: number;     // 0-100
  lastUpdateTime: string; // ISO Date
}
```

## 4. 全局 Store 状态 (Store State)

Pinia Store (`useChapterStore`) 管理的运行时状态。

```typescript
interface ChapterStoreState {
  loading: boolean;
  currentTab: SceneType;
  chapters: Chapter[];
  selectedNodeId: string;
  progressMap: Record<string, UserProgress>;
  isVip: boolean;
  isAllResourcesOpen: boolean; // 是否处于"全部资源"视图
  appSettings: AppSettings;    // 应用设置
}
```
