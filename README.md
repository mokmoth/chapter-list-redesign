# 章节列表页可交互原型

> **版本**：1.0.0  
> **创建日期**：2025-12-31  
> **技术栈**：Vue 3 + TypeScript + Vite + Pinia + SCSS

## 🌐 在线预览

**👉 [点击访问在线原型](https://chapter-list-redesign.vercel.app/)**

---

## ⚠️ 重要声明

**本原型仅供产品验证和演示，不可直接用于生产环境。**

---

## 功能概览

基于 PRD V1.x 和 SDD 技术规格实现的完整可交互原型，覆盖 **50 个功能点**：

### 核心功能

| 模块 | 功能点 | 状态 |
|------|--------|------|
| 页面布局 | 响应式左右分栏、移动端侧边栏抽屉 | ✅ |
| 场景 Tab | 预习/复习/加餐切换、学习指南联动 | ✅ |
| 章节目录 | 递归渲染、左右滚动联动、选中高亮 | ✅ |
| 资源列表 | 场景过滤、学科过滤、滚动监听 | ✅ |
| VIP 权限 | 锁定状态判断、解锁流程、角标展示 | ✅ |

### 资源卡片 (10 种)

| 卡片类型 | 组件 | 适用场景 |
|----------|------|----------|
| 知识点视频 | KnowledgeCard | 预习、复习 |
| 同步刷题 | PracticeCard | 加餐 |
| 思维导图 | MindMapCard | 预习、复习 |
| 背诵 | ReciteCard | 预习 |
| 极速复习 | QuickReviewCard | 复习 |
| AI拍题精学 | AISolveCard | 复习 |
| 学霸笔记 | NoteCard | 复习 |
| 错题本 | ErrorBookCard | 复习 |
| 快背 | QuickMemorizeCard | 加餐（文科） |
| 培优课视频 | PremiumKnowledgeCard | 加餐 |

---

## 快速开始

### 环境要求

- Node.js 22+
- pnpm（推荐）或 npm

### 安装依赖

```bash
cd Product-SDD-Workbench/projects/chapter-list-redesign/03-prototypes/vue-apps/chapter-list-redesign

pnpm install
# 或
npm install
```

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5173 查看原型。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

---

## 项目结构

```
src/
├── main.ts                    # 入口文件
├── App.vue                    # 根组件
├── types/
│   └── index.ts              # TypeScript 类型定义
├── stores/
│   └── chapter.ts            # Pinia 状态管理
├── mocks/
│   └── data.ts               # Mock 数据
├── styles/
│   ├── _variables.scss       # 设计令牌（颜色、字号、间距）
│   └── global.scss           # 全局样式
├── views/
│   └── ChapterList.vue       # 主页面
└── components/
    ├── GlobalHeader.vue      # 全局头部
    ├── FunctionBar.vue       # 功能栏
    ├── SceneTabs.vue         # 场景切换 Tab
    ├── ChapterTree.vue       # 章节目录树（递归）
    ├── ResourceList.vue      # 资源列表容器
    ├── LearningGuide.vue     # 学习方法指南
    ├── KnowledgeCard.vue     # 知识点视频卡片
    ├── PracticeCard.vue      # 同步刷题卡片
    ├── MindMapCard.vue       # 思维导图卡片
    ├── ReciteCard.vue        # 背诵卡片
    ├── QuickReviewCard.vue   # 极速复习卡片
    ├── AISolveCard.vue       # AI拍题精学卡片
    ├── NoteCard.vue          # 学霸笔记卡片
    ├── ErrorBookCard.vue     # 错题本卡片
    ├── QuickMemorizeCard.vue # 快背卡片
    └── PremiumKnowledgeCard.vue # 培优课视频卡片
```

---

## 响应式断点

| 断点 | 布局变化 |
|------|----------|
| ≥768px | 桌面端：左侧目录固定，右侧资源列表 |
| <768px | 移动端：目录收起为抽屉，通过拉手触发 |
| <600px | 快捷入口收纳到更多菜单 |
| <380px | Tab 字号缩小 |
| <360px | VIP 文字隐藏 |

---

## 交互说明

### 左右联动

1. **点击目录 → 滚动资源列表**
   - 点击左侧小节标题
   - 右侧资源列表平滑滚动到对应位置
   - 使用 600ms 锁机制防止冲突

2. **滚动资源列表 → 高亮目录**
   - 滚动右侧资源列表
   - IntersectionObserver 检测当前小节
   - 左侧目录自动高亮并跟随

### VIP 权限

- 免费资源：无角标，直接访问
- VIP 资源（未解锁）：显示 "VIP" 角标，点击提示购买
- VIP 资源（已解锁）：显示 "已解锁" 角标
- 培优课（未购买）：显示 "去加购" 角标
- 培优课（已购买）：显示 "培优课" 金色角标

---

## 关联文档

| 文档 | 路径 |
|------|------|
| PRD V1.x | `../../01-prd/prd-v1.x.md` |
| 功能点清单 | `../../01-prd/v5-feature-list.md` |
| SDD 技术规格 | `../../02-specs/sdd/chapter-list.sdd.json` |
| 功能详细设计 | `../../02-specs/feature-specs/*.md` |

---

## 后续迭代

- [ ] 对接真实 API
- [ ] 添加路由和页面跳转
- [ ] 完善动画效果
- [ ] 添加单元测试

---

*此原型基于 SDD 技术规格生成，可作为研发实现的参考*


