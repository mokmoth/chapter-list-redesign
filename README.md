# 章节列表页迭代

> 洋葱学园 APP 章节列表页的场景化重构，将资源按预习/复习/加餐场景聚合，提供结构化导航和个性化学习体验。

---

## 项目状态

| 阶段 | 技能 | 输出 | 状态 |
|------|------|------|------|
| 需求阶段 | v1-assistant | PRD V1.2 + 50 功能点清单 | ✅ 完成 |
| 原型阶段 | prototype-first | Vue3 可交互原型 | ✅ 完成 |
| 评审阶段 | review-map | 交互式评审地图 | ✅ 完成 |
| 规格阶段 | spec-extractor | SDD + 7 feature-specs | ✅ 完成 |
| 埋点阶段 | tracking-designer | 埋点设计方案 | ✅ 完成 |
| 交付阶段 | - | 交付研发 | ⏳ 待启动 |

---

## 工作流

```
需求阶段          原型阶段            评审阶段             规格阶段             埋点阶段       交付阶段
──────────────────────────────────────────────────────────────────────────────────────────────────
v1-assistant  →  prototype-first  →  review-map     →  spec-extractor  →  tracking-designer → 交付研发
    ↓                 ↓                  ↓                  ↓                   ↓
 PRD V1.2        Vue3 原型         review-map.html    SDD + specs         埋点方案
 功能点清单      (Vercel 部署)      (评审地图)          feature-specs/      05-tracking/
```

---

## 文件结构

```
chapter-list-redesign/
├── README.md                         ← 本文件
├── 00-context/                       # 需求背景与调研
│   ├── v1-需求质询.md                # 6 阶段需求质询（已确认）
│   ├── （确认版）同步课章节列表页... # 资源清单确认版
│   ├── learning-flow-analysis.md     # 学习流程分析
│   ├── design-decisions.md           # 6 个核心设计决策
│   ├── resource-inventory.md         # 资源盘点
│   └── deployment-git-draft.md       # 部署规划草案
│
├── 01-prd/                           # 产品需求文档
│   ├── 章节列表页迭代_V1.2.md        # PRD 终稿（基于原型验证）
│   └── v5-feature-list.md            # 50 功能点清单（100% 已细化）
│
├── 02-prototypes/                    # 可交互原型
│   └── vue-apps/
│       └── chapter-list-redesign/    # Vue3 + TypeScript + Pinia
│           ├── src/                  # 源码（15 组件 + Pinia store）
│           └── dist/                 # 构建产物
│
├── 03-panorama/                      # 评审地图
│   ├── review-map.html               # 交互式评审文档
│   ├── review-map.md                 # 评审地图 Markdown 版
│   ├── review-map-data.json          # 结构化数据
│   └── screenshots/                  # 11 张状态截图
│
├── 04-specs/                         # 技术规格
│   ├── feature-specs/                # 功能详细设计（7 个文件）
│   │   ├── 01-page-layout.md
│   │   ├── 02-scene-tabs.md
│   │   ├── 03-chapter-tree.md
│   │   ├── 04-resource-cards.md
│   │   ├── layout-interaction.md
│   │   ├── review-mode.md
│   │   └── settings-module.md
│   └── sdd/                          # 系统设计文档
│       ├── chapter-list.sdd.md
│       ├── chapter-list.sdd.json
│       ├── architecture.md
│       └── data-model.md
│
└── 05-tracking/                      # 埋点设计
    ├── tracking-design.md            # 埋点方案文档（23个事件）
    └── tracking-design.xlsx          # Excel上传格式（管理平台用）
```

---

## 体验原型

### 线上地址

https://chapter-list-redesign.vercel.app/

### 本地运行

```bash
cd 02-prototypes/vue-apps/chapter-list-redesign
npm install
npm run dev
```

---

## 核心功能

- **场景化 Tab**：预习/复习/加餐 三大学习场景，按场景聚合资源
- **响应式双栏布局**：桌面端固定侧栏 + 移动端抽屉式目录
- **左右联动滚动**：IntersectionObserver + 点击锁机制，目录与内容双向同步
- **VIP 权限体系**：5 种徽标状态（免费/锁定/已解锁/试看/去加购）
- **复习模式选择**：先做题后看视频 vs 先看视频后做题
- **个性化设置**：复习顺序、默认场景、刷题难度偏好

---

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | Vue 3 (Composition API) | 3.4 |
| 状态管理 | Pinia | 2.1 |
| 语言 | TypeScript | 5.3 |
| 构建 | Vite | 5.0 |
| 样式 | SCSS | - |
| 图标 | lucide-vue-next | 0.460 |

---

## 参考资料

- [产品经理工作台工作流](../../../.agents/global-context/workflow.md)
- [prototype-first 技能](../../../.agents/skills/prototype-first/SKILL.md)
- [review-map 技能](../../../.agents/skills/review-map/SKILL.md)
- [spec-extractor 技能](../../../.agents/skills/spec-extractor/SKILL.md)
- [tracking-designer 技能](../../../.agents/skills/tracking-designer/SKILL.md)
