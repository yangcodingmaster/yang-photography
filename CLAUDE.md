# CLAUDE.md — 个人摄影作品集网站

> 这份文件是 AI 助手（Claude Code）的工作说明书。
> 每次修改网站前，先读这份文件，严格按照规范执行。

---

## 项目概览

| 项目 | 说明 |
|------|------|
| **项目名** | 赵洋 个人摄影作品集 |
| **阶段** | 核心功能完成，两个真实系列已上线，文案和更多系列待填入 |
| **托管目标** | GitHub Pages（静态站点，无后端，无需服务器） |
| **技术栈** | 纯 HTML + Tailwind CSS（CDN 版）+ 原生 JavaScript |
| **语言** | 中英双语（目前两种语言同时展示，不做切换按钮） |
| **照片** | 两个真实系列已上线（Defocused、Photos of 2025），demo 系列保留 |

**核心原则：代码必须人类可读。**
任何一行代码，加上注释后，非程序员也应该能大致猜出它的作用。

---

## 当前进度

| 项目 | 状态 | 备注 |
|------|------|------|
| `index.html` 首页 | ✅ 完成 | 明信片式：暖白纸面 + 居中单张照片轮播（淡入淡出）+ 极简导航 |
| `gallery.html` 作品集 | ✅ 完成 | 系列网格，封面图 + 标题 + 年份地点 |
| `series.html` 系列详情 | ✅ 完成 | 瀑布流网格 + 展览级 Lightbox + 分章支持 + 组图支持 |
| `journal.html` Journal | ✅ 完成 | 散片档案，按年份切换 + 瀑布流 + 纯图 Lightbox（无文字字段） |
| `about.html` 关于页 | ✅ 完成 | 结构完成，文案为占位内容待替换 |
| `data.js` 数据文件 | ✅ 完成 | Gallery（2 个真实系列 + demo）+ Journal（按年份的空数组待填） |
| Defocused 系列 | ✅ 完成 | 6 张照片，虚焦主题，2024，北京上海 |
| Photos of 2025 系列 | ✅ 完成 | 4 个章节共 52 张照片，分章系列 |
| 填写真实文案 | ⬜ 待完成 | 系列 descZh/descEn、照片 caption/desc、关于页 |
| 路径空格清理 | ✅ 完成 | 全部重命名为连字符形式，可直接部署 |
| GitHub 仓库创建 | ⬜ 待完成 | 建好后上传即可通过链接访问 |
| GitHub Pages 上线 | ⬜ 待完成 | 仓库建好后开启，约 2 分钟生效 |

---

## 文件结构

```
我的展览/
│
├── index.html              # 首页：明信片式 + 居中单张照片轮播
├── gallery.html            # 作品集：系列列表（每格是一个系列/文件夹）
├── series.html             # 系列详情页（通用，?id= 参数决定显示哪个系列）
├── journal.html            # Journal：散片档案，按年份切换 + 瀑布流
├── about.html              # 关于页：个人介绍 + 联系方式
│
├── data.js                 # ⭐ 唯一的数据文件，所有内容只改这里
│                           #    包含：allSeries、allPhotos、allChapters、allJournal
│
├── assets/
│   └── images/
│       ├── README.txt
│       ├── gallery/                # ⭐ 所有 Gallery 系列放这里
│       │   ├── Defocused/          # 普通系列（id 与文件夹名一致）
│       │   │   ├── 01.jpeg         # 封面由 data.js 的 cover 字段指定（不限定第一张）
│       │   │   └── 02–06.jpeg
│       │   └── photos-of-2025/     # 分章系列（id 与文件夹名一致）
│       │       ├── tail-of-the-second-year/   # 01–16.jpeg
│       │       ├── the-summer/                # 17–33.jpeg
│       │       ├── the-last-fall/             # 34–45.jpeg
│       │       └── images-that-remain/        # 46–52.jpg
│       └── journal/                # Journal 散片，按年份归档
│           ├── 2025/
│           └── 2024/
│
└── CLAUDE.md               # 本文件
```

**命名规则：**
- 系列文件夹名必须和 `data.js` 里的 `id` 字段**完全一致**；id 一律用连字符、不要空格（会变 `%20`）
- **所有系列**（普通 + 分章）都必须在 `allSeries` 里显式指定 `cover` 字段，自己挑哪张当封面
- 封面不再默认取第一张，统一靠 `cover`，规则对两类系列完全一致
- 系列内照片按 `01.jpg`、`02.jpg` 顺序命名（photos-of-2025 文件全局编号 01–52，分散在 4 个章节文件夹）
- **路径规则**：所有文件夹名、文件名一律用连字符 `-`，不要用空格（部署到 GitHub Pages 会变成 `%20`，丑且容易出问题）

---

## 各页面实际功能说明

### 首页 `index.html`
- 明信片式布局：暖白纸面，照片居中显示（max-height: 70vh, max-width: 78vw），不裁切不拉伸，保持自身比例
- 全 data.js 随机抽取（含 Gallery / Journal 所有照片，含组图拆开）
- 两张 `<img>` 叠层做交叉淡入淡出，HOLD_MS=4500、FADE_MS=1200（顶部 JS 常量，可调）
- 照片有 1px 黑色描边
- 导航融入纸面（无背景无分割线），全英文：Yang · Gallery · Journal · About

### 作品集页 `gallery.html`
- 从 `data.js` 读取 `allSeries`，渲染成 3 列网格
- 每格显示：封面图、中文标题、英文标题、年份、地点、照片数量
- 封面图取法：统一用 `series.cover`（所有系列都显式指定，不再回退第一张）
- 悬停有轻微放大 + 半透明遮罩提示

### 系列详情页 `series.html`
- 读取 URL 中的 `?id=` 参数，从 `data.js` 找到对应系列
- **瀑布流布局**：CSS columns（3 列），照片保持原始比例
  - **两种系列都按 data.js 数组顺序展示**，不随机
  - 把"普通系列"理解为"只有一章的分章系列"，行为完全一致（除了没有章节卡和章节标题条）
- **普通系列**：直接渲染 `allPhotos[id]` 数组
- **分章系列**（`type: 'sectioned'`）：按章节渲染
  - 每个章节顶部有一个**可点击的标题条**（"在英国 Tail of the Second Year"），点击打开该章节的章节卡
  - 章节卡放在 `renderItems` 中**每个章节的开头**（不是章节之间），所以每章都有自己的卡
- **Lightbox 行为**：
  - 左侧照片 / 右侧文字分栏（无分割线）
  - 文字字段：作品名 → 日期 → 地点 → 描述 → 相机/胶卷信息，有则显示无则隐藏
  - **左上角常驻章节指示器**：`N / M · The Summer`（章节卡和结束卡视图里清空）
  - **不再循环**：到末尾再 → 进入结束卡，结束卡再 → 关闭 Lightbox（走出展厅）。第一张往 ← 停住
  - **结束卡** `view-end`：游览到此结束 / Your visit is over
  - **右上角出口按钮**：`→ Way out`（取代之前的"关闭 / Esc"），首字母大写不全大写
  - 键盘 ← → 翻页、Esc 退出、支持触摸滑动
- **组图**（`group` 类型）：Lightbox 内纵向堆叠 2–5 张照片，右侧共享一组文字说明
- 四种 Lightbox 视图：`view-photo`（单张）、`view-group`（组图）、`view-chapter`（章节卡）、`view-end`（结束卡）

### Journal 页 `journal.html`
- 散片档案，和 Gallery 平级（不是子集）。所有"不成系列"的照片放这里
- 数据来自 `data.js` 的 `allJournal`，按年份组织（key 是年份字符串）
- 页面顶部年份小导航：点击切换年份，一次只显示一年的照片，默认进入最新年份
- 瀑布流布局（CSS columns，3 列；中屏 2 列；窄屏 1 列），保持照片原始比例
- 照片有 1px 黑色描边（和首页一致）
- 点击照片打开**纯图 Lightbox**：没有右侧文字面板，因为 Journal 故意不要任何字段
  - Esc / × / 点背景关闭，← → 翻页，支持触摸滑动
- 年份内顺序 = 数组顺序：把新照片放数组前面 = 最新在最上面

### 关于页 `about.html`
- 左侧个人照片（`assets/images/profile.jpg`），右侧双语介绍
- 拍摄方向标签（可增减）
- Email + Instagram 链接

---

## data.js 数据结构详解

### allSeries — 系列元数据

```javascript
{
  id:       'defocused',          // 唯一标识，与文件夹名完全一致
  titleZh:  '虚焦',
  titleEn:  'Defocused',
  year:     '2024',
  location: '北京 / 上海',
  descZh:   '中文系列简介',
  descEn:   'English description',
  cover:    'assets/images/.../cover.jpg',  // 所有系列必填：自己挑哪张当封面
  // 仅分章系列额外需要：
  type:     'sectioned',          // 触发分章渲染模式
}
```

### allPhotos — 普通系列照片列表

```javascript
allPhotos['defocused'] = [
  {
    src:      'assets/images/Defocused/01.jpeg',
    alt:      '图片描述（供屏幕阅读器）',
    caption:  '作品名',          // 显示为大标题
    date:     '2024.03',
    location: '北京',
    desc:     '这张照片的故事…', // 较长的说明文字
    meta:     'Pentax 67 · Kodak 400', // 相机、胶卷等技术信息
  },
  // ...
]
```

### allChapters — 分章系列结构

```javascript
allChapters['photos-of-2025'] = [
  {
    id:      'tail-of-the-second-year',
    titleZh: '第二年的尾巴',
    titleEn: 'tail of the second year',
    descZh:  '章节中文简介',
    descEn:  'Chapter description',
    photos: [
      // 照片格式与 allPhotos 相同
      { src: '...', alt: '...', caption: '', date: '', location: '', desc: '', meta: '' },
    ]
  },
  // 更多章节...
]
```

### allJournal — Journal 散片档案

```javascript
var allJournal = {
  '2025': [
    // 数组顺序就是显示顺序，新照片放前面 = 最新在最上面
    { src: 'assets/images/Journal/2025/任意命名.jpg', alt: '' },
  ],
  '2024': [
    { src: 'assets/images/Journal/2024/xxx.jpg', alt: '' },
  ],
};
```

**关键约束：Journal 只放 src 和 alt，不要任何其他字段。** 这是有意为之 ——
Journal 故意没有 caption / date / location / desc / meta，因为它的定位就是"只放照片"。
要给照片配文字，那它应该进 Gallery 而不是 Journal。

### 组图写法（group）

在 `allPhotos` 或章节的 `photos` 数组里：

```javascript
{
  group: [
    { src: 'assets/images/.../01.jpg', alt: '...' },
    { src: 'assets/images/.../02.jpg', alt: '...' },
  ],
  caption:  '组图共享的作品名',
  date:     '2025.01',
  location: '伦敦',
  desc:     '组图说明',
  meta:     'Leica M6 · HP5',
}
```

---

## 内容维护指南（给作者自己看）

### 如何修改文字内容

| 想改什么 | 去哪里改 |
|---|---|
| 系列标题、年份、地点 | `data.js` → `allSeries` 数组 |
| 系列简介 | `data.js` → 每个系列的 `descZh` / `descEn` |
| 照片作品名 | `data.js` → 每张照片的 `caption` |
| 照片日期、地点 | `data.js` → 每张的 `date` / `location` |
| 照片故事/说明 | `data.js` → 每张的 `desc` |
| 相机、胶卷信息 | `data.js` → 每张的 `meta` |
| 章节标题 | `data.js` → `allChapters` 里对应章节的 `titleZh` / `titleEn` |
| 关于页自我介绍 | `about.html` 直接找中文段落修改 |
| 网站标题（浏览器标签）| 各 `.html` 文件的 `<title>` 标签 |
| 导航栏名字 "Yang" | 各 `.html` 文件的 `<nav>` 里的 Logo 链接 |

### 如何添加一个普通系列

1. 在 `assets/images/gallery/` 下新建文件夹，名字与计划使用的 `id` 完全一致（用连字符）
2. 放入照片，按 `01.jpg`、`02.jpg` 顺序命名
3. 打开 `data.js`，在 `allSeries` 末尾添加新对象（不加 `type`，但要加 `cover` 指定封面）
4. 在 `allPhotos` 里添加对应的 key 和照片数组（路径形如 `assets/images/gallery/系列名/01.jpg`）
5. 刷新 `gallery.html` 查看效果

### 如何添加一个分章系列

1. 在 `assets/images/gallery/` 下建系列总文件夹，内部按章节建子文件夹
2. 准备一张封面图（可以是任意一张照片）
3. 在 `allSeries` 里加上 `type: 'sectioned'` 和 `cover: 'assets/images/gallery/.../xxx.jpg'`
4. 在 `allChapters` 里添加对应的 key 和章节数组
5. 每个章节包含 `titleZh`、`titleEn`、`descZh`、`descEn`、`photos` 数组

### 如何往 Journal 加照片

1. 把照片放进 `assets/images/journal/YYYY/`（年份是哪年就放哪年的文件夹）
2. 文件名随意（Journal 不依赖文件名顺序，靠数组顺序决定显示顺序）
3. 在 `data.js` 的 `allJournal['YYYY']` 数组**最前面**加一行 `{ src: 'assets/images/journal/YYYY/xxx.jpg', alt: '' }`
4. 想加新一年（如 2026）：在 `allJournal` 里加 `'2026': []`，年份导航会自动出现
5. 刷新 `journal.html`，最新照片会出现在最上面

### 支持的图片格式

`.jpg` / `.jpeg` / `.png` / `.webp` / `.heic` / `.heif` 均可；浏览器支持度 HEIF 稍低，建议转为 JPEG。

---

## 技术规范

### Tailwind CSS
- 使用 **CDN 版本**，每个 HTML 文件 `<head>` 里引入：
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- 颜色、字体配置写在每个页面的 `tailwind.config` 脚本里
- 优先用 Tailwind class，避免内联 `style=""`（仅动画/JS 动态控制时允许例外）

### JavaScript
- 使用原生 JavaScript，不引入任何框架或 npm 包
- 所有 JS 写在 HTML 底部的 `<script>` 标签内，或单独 `.js` 文件
- 每段逻辑必须有中文注释

### series.html 核心模式（修改前必读）

`series.html` 使用统一的 `renderItems` 数组模式，所有内容类型都经过同一个渲染和 Lightbox 管路：

- **`entryToItem(entry, chapter?)`** — 把 data.js 原始条目转为 `{ kind, ... }` 对象，把所属 chapter 的 titleZh/titleEn 也带上（用于常驻章节指示器）
- **`makeGridItem(item)`** — 根据 kind 创建网格 DOM 元素
- **`updateLightbox()`** — 根据 `currentIndex` 读取 `renderItems`，分发给四个视图（`view-photo` / `view-group` / `view-chapter` / `view-end`）
- **`setField(id, value)`** — 填充文字并按有无内容自动显示/隐藏元素
- **`isHSwipe(dx, dy)`** — 判断触摸方向，防止纵向滚动误触发翻页
- **`chapterCardIndices[chIdx]`** — 每个章节的章节卡在 renderItems 中的索引，瀑布流里的章节标题 onclick 通过它跳转
- **`changePhoto(direction)`** — 翻页函数：不循环；到末尾再 → 关闭 Lightbox，到开头再 ← 停住

修改 Lightbox 字段显示时，只需改 `updateLightbox()` 里对应视图的 `setField` 调用顺序。
分章系列 renderItems 的顺序是 `[ch1 card, ch1 photos, ch2 card, ch2 photos, ..., end card]`。

### 图片
- 本地图片放在 `assets/images/` 对应子文件夹
- 每张图片必须有 `alt` 属性
- 路径统一用**相对路径**，不用以 `/` 开头的绝对路径
- 路径含空格本地可用，但部署到 GitHub Pages 前须处理（重命名或 URL 编码）

---

## 设计系统

> 改这里的值，颜色/字体全站生效。每个 HTML 文件都有一份，需同步修改。

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'site-bg':      '#fafaf7',   /* 页面背景：暖白 */
        'site-surface': '#f2f2ef',   /* 卡片/区块背景 */
        'site-border':  '#e0e0dc',   /* 边框、分割线 */
        'site-text':    '#111111',   /* 正文文字：近黑 */
        'site-muted':   '#8a8a85',   /* 辅助文字、标签 */
        'site-accent':  '#111111',   /* 强调色：极简黑 */
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],/* 英文衬线（标题和正文都用这一个，统一） */
        'body':    ['"Cormorant Garamond"', 'Georgia', 'serif'],/* 英文统一只用 Cormorant，不混入 DM Sans */
        'zh':      ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'], /* 中文衬线 */
      },
    }
  }
}
```

---

## 给 AI 的工作守则

### 必须做
- 每个 HTML 区块前加中文注释说明用途
- 修改 `series.html` 前先理解 `renderItems` → `updateLightbox` → `setField` 整条链路
- 修改 data.js 前先完整读取文件，确认当前内容后再 Edit（文件较大，用户可能已手动改动）
- 新增内容前先确认和设计系统的颜色/字体变量一致
- 路径统一用相对路径
- 响应式：手机端优先

### 禁止做
- 不引入 npm 包或需要构建的工具（保持零构建）
- 不用 `style=""` 内联样式（JS 动态控制 display/transform 除外）
- 不把颜色值硬编码在 class 里（用 `text-site-muted` 而不是 `text-[#8a8a85]`）
- 不在没有说明的情况下改动设计系统
- 不写没有注释的 JavaScript 函数
- 不为任何系列省略 `cover` 字段（封面统一靠 cover，省略则 gallery 缩略图空白）
- **不使用 `italic` 类**：英文统一用 Cormorant Garamond 的正体，不要斜体（用户明确要求）
- **不引入 Cormorant 以外的英文字体**（DM Sans 已经移除，保持 Cormorant + Noto Serif SC 两个字体即可）

### 每次任务结束后报告
1. 改了什么文件
2. 新增了什么功能
3. 有没有需要手动处理的遗留问题

---

## 待办 / 未来可能的方向

### 近期待完成
- [ ] 填写真实文案（Photos of 2025 各章节 descZh/descEn，Defocused 各照片 caption/desc）
- [ ] 填写关于页自我介绍
- [ ] 往 `assets/images/Journal/` 下面放散片（按年份归档），同步更新 `data.js` 的 `allJournal`
- [ ] 创建 GitHub 仓库并部署到 GitHub Pages

### 未来可能的方向
> 现阶段不实现，等需求明确后再讨论。

- [ ] 风格和结构上的进一步打磨（待定，边用边想）
- [ ] 照片分类筛选（按题材横向筛选）
- [ ] 语言切换按钮（中/英分离显示）
- [ ] 首页照片墙：点击照片后跳转到对应系列
- [ ] 自定义域名绑定
