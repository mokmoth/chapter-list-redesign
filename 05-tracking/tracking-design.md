# 章节列表页迭代 - 埋点设计方案

> **版本**：V1.0
> **更新时间**：2026-03-09
> **状态**：待评审
> **产品**：洋葱学园 APP（productId: 01）
> **功能模块**：教材同步 / 章节列表页
> **适用平台**：iOS / Android
> **埋点归属**：C端

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 产品名称 | 洋葱学园 APP |
| 批次名称 | 章节列表页场景化重构 V1.0 |
| 所属分线 | 学习线 |
| 功能模块 | 教材同步 / 章节列表页 |
| 埋点归属 | C端 |
| 事件总数 | 23 |
| 新增字段数 | 9 |

---

## 事件总览

| # | event_key | category | description | 状态 |
|---|-----------|----------|-------------|------|
| 1 | enterChapterListPage | learn | 章节列表页-进入页面时触发 | new |
| 2 | clickChapterListSceneTab | learn | 章节列表页-点击场景Tab切换时触发 | new |
| 3 | clickChapterListKnowledgeCard | learn | 章节列表页-点击知识点卡片时触发 | new |
| 4 | clickChapterListPracticeCard | learn | 章节列表页-点击同步刷题卡片时触发 | new |
| 5 | clickChapterListPremiumCard | operate | 章节列表页-点击培优课卡片时触发 | new |
| 6 | clickChapterListTreeNode | learn | 章节列表页-点击章节目录树节点时触发 | new |
| 7 | clickChapterListUpgradeEntry | operate | 章节列表页-点击VIP升级入口时触发 | new |
| 8 | clickChapterListQuickAction | learn | 章节列表页-点击快捷工具按钮时触发 | new |
| 9 | clickChapterListMenuToggle | learn | 章节列表页-点击汉堡菜单按钮时触发(移动端) | new |
| 10 | popupChapterListMoreMenu | learn | 章节列表页-更多菜单下拉曝光时触发(移动端) | new |
| 11 | clickChapterListSidebarToggle | learn | 章节列表页-切换侧边栏抽屉时触发(移动端) | new |
| 12 | clickChapterListBackButton | learn | 章节列表页-点击返回按钮时触发 | new |
| 13 | popupChapterListVipGuideDialog | operate | 章节列表页-VIP购买引导弹窗曝光时触发 | new |
| 14 | popupTextbookSwitchDialog | learn | 教材切换弹窗-弹窗曝光时触发 | new |
| 15 | clickTextbookSwitchOption | learn | 教材切换弹窗-选择学科/版本/年级选项时触发 | new |
| 16 | clickTextbookSwitchConfirm | learn | 教材切换弹窗-点击确认按钮时触发 | new |
| 17 | getTextbookSwitchResult | learn | 教材切换弹窗-教材切换结果回调时触发 | new |
| 18 | popupLearningModeDialog | learn | 学习方式选择弹窗-弹窗曝光时触发 | new |
| 19 | clickLearningModeOption | learn | 学习方式选择弹窗-选择学习方式时触发 | new |
| 20 | clickLearningModeConfirm | learn | 学习方式选择弹窗-点击开始学习按钮时触发 | new |
| 21 | enterChapterListSettingsPage | setting | 设置页-进入页面时触发 | new |
| 22 | clickChapterListSettingsOption | setting | 设置页-修改设置项时触发 | new |
| 23 | clickChapterListSettingsBack | setting | 设置页-点击返回按钮时触发 | new |

---

## 事件详细设计

### 页面：章节列表页（主页面）

---

#### 1. enterChapterListPage

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | enterChapterListPage |
| category | learn |
| 事件描述 (desc) | 章节列表页-进入页面时触发 |
| 埋点状态 | new |
| 触发时机 | 页面加载完成时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| pageSource | string | 页面来源 | home=首页, textbook=教材选择页, deeplink=外部链接, other=其他 | 是 | 是 |
| sceneTab | string | 默认场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |
| subjectId | string | 学科ID | 学科标识，如 math, english, physics | 是 | 是 |
| chapterId | string | 章节ID | 当前章节标识 | 否 | 是 |

---

#### 2. clickChapterListSceneTab

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListSceneTab |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击场景Tab切换时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击全部/预习/复习/加餐任一Tab时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| sceneTab | string | 切换到的场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |
| subjectId | string | 学科ID | 当前学科标识 | 是 | 是 |
| chapterId | string | 章节ID | 当前章节标识 | 否 | 是 |

---

#### 3. clickChapterListKnowledgeCard

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListKnowledgeCard |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击知识点卡片时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击 KnowledgeCard 时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| topicId | string | 知识点ID | 知识点唯一标识 | 是 | 是 |
| topicName | string | 知识点名称 | 知识点中文名 | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |
| chapterId | string | 所属章节ID | 章节标识 | 否 | 是 |
| isLocked | boolean | 是否VIP锁定 | true=锁定, false=未锁定 | 是 | 是 |
| cardPosition | integer | 卡片位置 | 卡片在列表中的位置，从1开始计数 | 是 | 是 |

---

#### 4. clickChapterListPracticeCard

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListPracticeCard |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击同步刷题卡片时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击 PracticeCard 时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| topicId | string | 知识点ID | 知识点唯一标识 | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |
| chapterId | string | 所属章节ID | 章节标识 | 否 | 是 |
| cardPosition | integer | 卡片位置 | 卡片在列表中的位置，从1开始计数 | 是 | 是 |

---

#### 5. clickChapterListPremiumCard

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListPremiumCard |
| category | operate |
| 事件描述 (desc) | 章节列表页-点击培优课卡片时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击 PremiumHookCard 时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| topicId | string | 知识点ID | 知识点唯一标识 | 否 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |
| chapterId | string | 所属章节ID | 章节标识 | 否 | 是 |
| cardPosition | integer | 卡片位置 | 卡片在列表中的位置，从1开始计数 | 是 | 是 |

---

#### 6. clickChapterListTreeNode

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListTreeNode |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击章节目录树节点时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击左侧目录树中的小节节点时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| chapterId | string | 章节/小节ID | 点击的节点标识 | 是 | 是 |
| chapterName | string | 章节/小节名称 | 节点中文名 | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 7. clickChapterListUpgradeEntry

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListUpgradeEntry |
| category | operate |
| 事件描述 (desc) | 章节列表页-点击VIP升级入口时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击顶部导航栏的「去升级」或「已升级」按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| isLocked | boolean | 当前VIP状态 | true=已是VIP, false=非VIP | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 8. clickChapterListQuickAction

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListQuickAction |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击快捷工具按钮时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击思维导图/错题本/收藏/设置按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| buttonName | string | 按钮名称 | mindmap=思维导图, errorbook=错题本, favorite=收藏, settings=设置 | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 9. clickChapterListMenuToggle

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListMenuToggle |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击汉堡菜单按钮时触发(移动端) |
| 埋点状态 | new |
| 触发时机 | 用户点击移动端≡菜单按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 10. popupChapterListMoreMenu

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | popupChapterListMoreMenu |
| category | learn |
| 事件描述 (desc) | 章节列表页-更多菜单下拉曝光时触发(移动端) |
| 埋点状态 | new |
| 触发时机 | 移动端更多菜单下拉显示时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 11. clickChapterListSidebarToggle

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListSidebarToggle |
| category | learn |
| 事件描述 (desc) | 章节列表页-切换侧边栏抽屉时触发(移动端) |
| 埋点状态 | new |
| 触发时机 | 用户打开或关闭移动端目录抽屉时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| sidebarAction | string | 侧边栏操作 | open=打开, close=关闭 | 是 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 12. clickChapterListBackButton

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListBackButton |
| category | learn |
| 事件描述 (desc) | 章节列表页-点击返回按钮时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击左上角返回按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| sceneTab | string | 离开时的场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

#### 13. popupChapterListVipGuideDialog

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | popupChapterListVipGuideDialog |
| category | operate |
| 事件描述 (desc) | 章节列表页-VIP购买引导弹窗曝光时触发 |
| 埋点状态 | new |
| 触发时机 | 非VIP用户点击锁定状态的卡片触发购买引导弹窗时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| topicId | string | 知识点ID | 触发锁定的知识点标识 | 否 | 是 |
| sceneTab | string | 当前场景Tab | all=全部, preview=预习, review=复习, extra=加餐 | 是 | 是 |

---

### 页面：教材切换弹窗

---

#### 14. popupTextbookSwitchDialog

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | popupTextbookSwitchDialog |
| category | learn |
| 事件描述 (desc) | 教材切换弹窗-弹窗曝光时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击教材选择器打开弹窗时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| subjectId | string | 当前学科ID | 打开弹窗时的学科标识 | 是 | 是 |

---

#### 15. clickTextbookSwitchOption

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickTextbookSwitchOption |
| category | learn |
| 事件描述 (desc) | 教材切换弹窗-选择学科/版本/年级选项时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击三列选择器中的任一选项时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| optionType | string | 选项类型 | subject=学科, version=版本, grade=年级册别 | 是 | 是 |
| optionValue | string | 选中的值 | 具体学科名/版本ID/年级ID | 是 | 是 |

---

#### 16. clickTextbookSwitchConfirm

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickTextbookSwitchConfirm |
| category | learn |
| 事件描述 (desc) | 教材切换弹窗-点击确认按钮时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击确认切换教材按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| subjectId | string | 切换后学科ID | 目标学科标识 | 是 | 是 |
| optionValue | string | 切换后教材 | 版本ID + 年级ID 组合值 | 是 | 是 |

---

#### 17. getTextbookSwitchResult

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | getTextbookSwitchResult |
| category | learn |
| 事件描述 (desc) | 教材切换弹窗-教材切换结果回调时触发 |
| 埋点状态 | new |
| 触发时机 | 教材数据异步加载完成或失败时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| result | string | 切换结果 | success=成功, fail=失败 | 是 | 是 |
| failReason | string | 失败原因 | network=网络错误, timeout=超时, nodata=无数据, other=其他（仅 fail 时传） | 否 | 否 |
| subjectId | string | 切换后学科ID | 目标学科标识 | 是 | 是 |

---

### 页面：学习方式选择弹窗

---

#### 18. popupLearningModeDialog

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | popupLearningModeDialog |
| category | learn |
| 事件描述 (desc) | 学习方式选择弹窗-弹窗曝光时触发 |
| 埋点状态 | new |
| 触发时机 | 复习Tab下点击知识点卡片且学习顺序设置为「每次选择」时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| topicId | string | 知识点ID | 触发弹窗的知识点标识 | 否 | 是 |
| topicName | string | 知识点名称 | 知识点中文名 | 否 | 是 |

---

#### 19. clickLearningModeOption

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickLearningModeOption |
| category | learn |
| 事件描述 (desc) | 学习方式选择弹窗-选择学习方式时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击「先做题后看视频」或「先看视频后做题」选项时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| learningMode | string | 学习方式 | quiz-first=先做题后看视频, video-first=先看视频后做题 | 否 | 是 |
| topicId | string | 知识点ID | 知识点标识 | 否 | 是 |

---

#### 20. clickLearningModeConfirm

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickLearningModeConfirm |
| category | learn |
| 事件描述 (desc) | 学习方式选择弹窗-点击开始学习按钮时触发 |
| 埋点状态 | new |
| 触发时机 | 用户选择学习方式后点击「开始学习」按钮时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| learningMode | string | 学习方式 | quiz-first=先做题后看视频, video-first=先看视频后做题 | 否 | 是 |
| topicId | string | 知识点ID | 知识点标识 | 否 | 是 |
| topicName | string | 知识点名称 | 知识点中文名 | 否 | 是 |

---

### 页面：设置页

---

#### 21. enterChapterListSettingsPage

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | enterChapterListSettingsPage |
| category | setting |
| 事件描述 (desc) | 设置页-进入页面时触发 |
| 埋点状态 | new |
| 触发时机 | 设置页面加载完成时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| subjectId | string | 当前学科ID | 学科标识 | 是 | 是 |

---

#### 22. clickChapterListSettingsOption

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListSettingsOption |
| category | setting |
| 事件描述 (desc) | 设置页-修改设置项时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击任一设置选项(单选/多选)时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| settingKey | string | 设置项名称 | reviewMode=复习学习顺序, defaultScene=默认场景, practiceDifficulty=刷题难度 | 否 | 是 |
| settingValue | string | 设置项新值 | reviewMode: quiz-first/video-first/ask-every-time; defaultScene: all/last-selected; practiceDifficulty: basic/medium/hard | 否 | 是 |

---

#### 23. clickChapterListSettingsBack

| 列名 | 值 |
|------|-----|
| 事件名称 (event_key) | clickChapterListSettingsBack |
| category | setting |
| 事件描述 (desc) | 设置页-点击返回按钮时触发 |
| 埋点状态 | new |
| 触发时机 | 用户点击返回按钮离开设置页时 |

| 属性名称 | 数据类型 | 属性显示名 | 枚举值及描述 | 游客是否必传 | 非游客是否必传 |
|---------|---------|-----------|-------------|------------|--------------|
| _(无自定义字段)_ | | | | | |

---

## 行为链路（click + get 成对）

| click 事件 | get 事件 | 说明 |
|-----------|---------|------|
| clickTextbookSwitchConfirm | getTextbookSwitchResult | 教材切换的异步请求与回调 |

> VIP 购买流程由支付模块独立管理埋点，本方案仅覆盖到 `popupChapterListVipGuideDialog`（引导弹窗曝光），后续支付链路不在本次设计范围内。

---

## 公共组件复用

| 公共组件 | 触发入口事件 | 关键字段取值 |
|---------|------------|-------------|
| 习题流程 (problemNew) | clickChapterListKnowledgeCard → 进入随堂检测 | practiceType=随堂检测, practiceScene=chapterList |
| 习题流程 (problemNew) | clickChapterListPracticeCard → 进入同步刷题 | practiceType=同步刷题, practiceScene=chapterList |
| 视频流程 (newVideo) | clickChapterListKnowledgeCard → 进入看课 | videoType=videoCourse, videoScene=chapterList |

> 公共组件内部事件由数据中台统一维护，PM 无需重复设计。仅需确认 practiceType / practiceScene / videoType / videoScene 取值与现有枚举一致。

---

## 自定义字段汇总

### 新增字段（9个）

| 字段名 | 数据类型 | 说明 | 使用事件数 |
|--------|---------|------|----------|
| sceneTab | string | 当前场景Tab（all/preview/review/extra） | 12 |
| cardPosition | integer | 卡片在列表中的位置（从1开始） | 3 |
| isLocked | boolean | 是否VIP锁定 | 2 |
| learningMode | string | 学习方式（quiz-first/video-first） | 3 |
| settingKey | string | 设置项名称 | 1 |
| settingValue | string | 设置项新值 | 1 |
| sidebarAction | string | 侧边栏操作（open/close） | 1 |
| optionType | string | 教材选择器选项类型 | 1 |
| optionValue | string | 教材选择器选中值 | 2 |

### 复用字段（9个）

| 字段名 | 数据类型 | 来源 | 使用事件数 |
|--------|---------|------|----------|
| topicId | string | 字段字典-内容字段 | 6 |
| topicName | string | 字段字典-内容字段 | 3 |
| chapterId | string | 字段字典-内容字段 | 5 |
| chapterName | string | 字段字典-内容字段 | 1 |
| subjectId | string | 字段字典-内容字段 | 5 |
| pageSource | string | 常用enter模式 | 1 |
| buttonName | string | 常用click模式 | 1 |
| result | string | 常用get模式 | 1 |
| failReason | string | 常用get模式 | 1 |

---

## 覆盖度自检

| 检查项 | 结果 | 说明 |
|--------|------|------|
| 所有页面有 enter 事件 | ✅ | 2 个 enter（章节列表页 + 设置页）+ 3 个 popup（弹窗曝光） |
| 所有按钮有 click 事件 | ✅ | 14 个交互元素完整覆盖 |
| 异步操作有 click+get 成对 | ✅ | 1 组成对（教材切换），VIP购买由支付模块管理 |
| 弹窗/曝光有 popup 事件 | ✅ | 4 个曝光点：更多菜单、VIP引导、教材切换、学习方式 |
| 异常路径已覆盖 | ✅ | getTextbookSwitchResult 含 fail+failReason |
| 公共组件正确复用 | ✅ | problemNew + newVideo 复用，未重复设计 |

---

共 **23** 个事件，**18** 个字段（9个新增 + 9个复用），覆盖 **4** 个页面/弹窗。

如需导出为 Excel 文件，请告知。
