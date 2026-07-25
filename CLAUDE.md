# CLAUDE.md — 个人摄影作品集网站

> 这份文件是 AI 助手（Claude Code）的工作说明书。
> 每次修改网站前，先读这份文件，严格按照规范执行。

---

## 项目概览

| 项目 | 说明 |
|------|------|
| **项目名** | 赵洋 个人摄影作品集 |
| **阶段** | 核心功能完成，8 个 Gallery 系列 + 5 年 Archive 散片已上线，**已部署到 GitHub Pages**，文案待逐张填入 |
| **托管** | 当前：GitHub Pages（`yangcodingmaster/yang-photography`，https://yangcodingmaster.github.io/yang-photography/ ）<br>迁移中：阿里云国内节点 + 宝塔，域名备案中。**原因：github.io 在国内被运营商屏蔽，分享到微信打不开**，详见"分享卡片与国内部署"一节 |
| **技术栈** | 纯 HTML + Tailwind CSS（CDN 版）+ 原生 JavaScript |
| **语言** | 中英双语（目前两种语言同时展示，不做切换按钮） |
| **照片** | 8 个 Gallery 系列（5 普通 + 3 分章，约 200 张）+ Archive 散片（2021–2025，共 123 张），均为真实作品，已无 demo |

**核心原则：代码必须人类可读。**
任何一行代码，加上注释后，非程序员也应该能大致猜出它的作用。

---

## 当前进度

| 项目 | 状态 | 备注 |
|------|------|------|
| `index.html` 首页 | ✅ 完成 | 明信片式：暖白纸面 + 居中单张照片轮播（淡入淡出）+ 极简导航 |
| `gallery.html` 作品集 | ✅ 完成 | 系列网格，封面图 + 标题 + 年份地点 |
| `series.html` 系列详情 | ✅ 完成 | 瀑布流网格 + 展览级 Lightbox + 分章支持 + 组图支持 |
| `archive.html` Archive | ✅ 完成 | 书架式：每年一本书（书脊宽度=照片数），翻开逐页阅读（`book-style` 分支重构） |
| `about.html` 关于页 | ✅ 完成 | 结构完成，文案为占位内容待替换 |
| `data.js` 数据文件 | ✅ 完成 | Gallery 8 个系列（含 allSeries / allPhotos / allChapters）+ Archive 5 年（allArchive） |
| Gallery 系列 | ✅ 上线 | 见下方"Gallery 系列清单"，共 8 个，约 200 张照片 |
| Archive 散片 | ✅ 上线 | 2021–2025 五年，共 123 张（可选 note 一句话页脚，作者逐张手填） |
| 图片压缩 | ✅ 完成 | 全部转为网页尺寸（HEIC→JPEG，长边 2560 / 质量 90） |
| 路径空格清理 | ✅ 完成 | 全部重命名为连字符形式，可直接部署 |
| GitHub 仓库 + Pages | ✅ 上线 | `yangcodingmaster/yang-photography`，Pages 已 built |
| `add-gallery-series` skill | ✅ 完成 | 固化"加 Gallery 系列"工作流，见下方"配套 skill" |
| 交互升级（fluid.js） | ✅ 完成 | Apple 流体交互：1:1 跟手拖拽、橡皮筋边界、方向感换图、按压态、滚动浮现、reduced-motion（`interaction-design` 分支开发） |
| 填写真实文案 | ⬜ 进行中 | 各系列 descZh/descEn、照片 caption/desc、关于页（作者逐张手填） |

### Gallery 系列清单（按 gallery 页展示顺序）

| id | 标题（中 / 英） | 类型 | 照片数 |
|----|----------------|------|--------|
| `Defocused` | 虚焦之一 / Defocused (i) | 普通 | 6 |
| `defocused-uk` | 虚焦之二 / Defocused (ii) | 普通 | 7 |
| `in-transfer` | 传输中 / In Transfer | 普通 | 10 |
| `goodbye-ucl` | 再见，UCL / Goodbye, UCL | 普通 | 16 |
| `lake-district-collections` | 在湖区 / Lake District Collections | 普通 | 26 |
| `photos-of-2025` | 照片记忆｜2025 / Photos of 2025 | 分章（4 章） | 52 |
| `photos-of-2024` | 照片记忆｜2024 / Photos of 2024 | 分章（3 章） | 53 |
| `photos-of-2023` | 照片记忆｜2023 / Photos of 2023 | 分章（4 章） | 34 |

---

## 文件结构

```
我的展览/
│
├── index.html              # 首页：明信片式 + 居中单张照片轮播
├── gallery.html            # 作品集：系列列表（每格是一个系列/文件夹）
├── series.html             # 系列详情页（通用，?id= 参数决定显示哪个系列）
├── archive.html            # Archive：书架式散片档案，每年一本书 + 翻开逐页阅读
├── about.html              # 关于页：个人介绍 + 联系方式
│
├── favicon.ico             # 浏览器标签页图标（16/32/48 三个尺寸打包在一个文件里）
├── apple-touch-icon.png    # iOS/安卓"加到主屏"时用的大图标（180×180）
│                           #    这两个由 scripts/make-share-card.sh 生成，别手改
│
├── data.js                 # ⭐ 唯一的数据文件，所有内容只改这里
│                           #    包含：allSeries、allPhotos、allChapters、allArchive
├── fluid.js                # 弹簧动画 + 滑动手势引擎（零依赖手写，series Lightbox 与 archive 阅读视图共用）
│
├── scripts/                # 维护脚本（不是网站的一部分，不影响访客）
│   ├── share-card.html     #    分享缩略图的"模具"，浏览器截图用
│   ├── make-share-card.sh  #    换分享图照片时跑它
│   ├── set-domain.py       #    换域名时跑它（往 og 标签注入真实域名）
│   └── fetch-fonts.py      #    重新抓取本地字体（改字重/换字体时才需要）
│
├── assets/
│   ├── vendor/             # ⭐ 境外资源的本地副本（国内节点必需，详见"部署"一节）
│   │   ├── tailwind.js     #    Tailwind 运行时（407KB）
│   │   ├── fonts.css       #    字体声明，由 fetch-fonts.py 生成，别手改
│   │   └── fonts/          #    210 个 woff2 分片（约 12MB）
│   └── images/
│       ├── README.txt
│       ├── share/          # 分享卡片缩略图（share-card.jpg，1200×1200）
│       ├── gallery/                # ⭐ 所有 Gallery 系列放这里（id = 文件夹名）
│       │   ├── Defocused/                    # 普通系列，01–06.jpeg
│       │   ├── defocused-uk/                 # 普通系列，01–07.jpeg
│       │   ├── in-transfer/                  # 普通系列，01–10.jpeg
│       │   ├── goodbye-ucl/                  # 普通系列，01–16.jpeg
│       │   ├── lake-district-collections/    # 普通系列，01–26.jpeg
│       │   ├── photos-of-2025/               # 分章系列（4 章子文件夹，01–52）
│       │   ├── photos-of-2024/               # 分章系列（3 章子文件夹）
│       │   └── photos-of-2023/               # 分章系列（4 章子文件夹）
│       │       # 封面统一由 data.js 的 cover 字段指定（不限定第一张）
│       └── archive/                # Archive 散片，按年份归档
│           ├── 2021/  2022/  2023/  2024/  2025/
│
├── .claude/
│   └── skills/
│       └── add-gallery-series/     # 配套 skill：固化"加 Gallery 系列"工作流
│           ├── SKILL.md
│           └── scripts/convert_photos.sh   # HEIC→JPEG + 压缩 2560/90 + 规范命名
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
- 全 data.js 随机抽取（含 Gallery / Archive 所有照片，含组图拆开）
- 两张 `<img>` 叠层做交叉淡入淡出，HOLD_MS=4500、FADE_MS=1200（顶部 JS 常量，可调）
- 照片有 1px 黑色描边
- 导航融入纸面（无背景无分割线），全英文：Yang · Gallery · Archive · About

### 作品集页 `gallery.html`
- 头部：英文大标题 `Gallery` 在上、中文小灰 `作品集` 在下，下方一条**左对齐短分割线**（`w-20`，不横跨全宽），与 Archive 头部同构
- 从 `data.js` 读取 `allSeries`，渲染成 3 列网格
- 每格显示：封面图、中文标题、英文标题、年份、地点
- 封面图取法：统一用 `series.cover`（所有系列都显式指定，不再回退第一张）
- 卡片无悬停放大/遮罩等"网页味"动效，整卡可点即跳 `series.html?id=`
- 卡片有**极轻的按压态**（按下瞬间 scale 0.99、松开缓出）——这是有意加的即时反馈，不要"修复"掉

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
  - 键盘 ← → 翻页、Esc 退出
  - **流体手势**（fluid.js）：照片 1:1 跟手拖拽（触摸 + 鼠标统一走 Pointer Events），
    松手按"惯性投影"决定翻页或弹回；第一张往回拖是橡皮筋阻力；结束卡上用力一甩 = 走出展厅；
    换图是方向感的滑出/滑入 + 渐隐渐显，键盘翻页走同一条动画管路，连按可无缝改目标
- **组图**（`group` 类型）：Lightbox 内纵向堆叠 2–5 张照片，右侧共享一组文字说明
- 四种 Lightbox 视图：`view-photo`（单张）、`view-group`（组图）、`view-chapter`（章节卡）、`view-end`（结束卡）

### Archive 页 `archive.html`（书架式，`book-style` 分支重构）
- 散片档案，和 Gallery 平级（不是子集）。所有"不成系列"的照片放这里
- 数据来自 `data.js` 的 `allArchive`，按年份组织（key 是年份字符串）
- 头部：英文大标题 `Archive` + 中文小灰 `散片档案`，下方左对齐短分割线（与 Gallery 同构）
- **书架**：每年是一本书，从左到右按时间排（2021 → 2025），站在一条搁板细线上
  - 书脊 = 扁平竖条（`site-surface` 底 + `site-border` 边框），竖排年份
  - **书脊宽度 = 16px + 照片数 × 1.6px**（数据即造型：一眼看出哪年拍得多）
  - hover 展宽露出封面（照片图版 + 年份 + 张数）——只在有光标的设备上（`@media (hover: hover)`）
  - **触屏两步交互**：第一次点书脊 = 书架平移把这本书**推到屏幕中心**展开预览（其余书挤向两边、
    超出屏幕部分裁掉），再点封面才翻开；点其他书脊切换预览、点空白收回、Way out 回来自动收回。
    桌面不做居中位移（书架一动光标底下就换书，会抖），两端交互不同、各自最优
  - 书脊有极轻按压态（scale 0.99，支点在底边）；打开某本时其余书淡出并收拢宽度
  - 书架入场有滚动浮现（`fluidReveal`，自左而右错开）
- 点击书 = **翻开进入阅读视图**（一次一整页，替代旧瀑布流 + Lightbox）：
  - 背景纯不透明纸面（`bg-site-bg`，**不加模糊**），与 gallery/series 一致
  - 版式：照片区（弹性，居中）+ **定高页脚贴底**——页码位置不随照片横竖比例移动
  - 页脚两行：可选 **note**（作者写的一句话，`font-zh`）+ 页码 `n / N`（年份由左上角常驻标示，页码不重复报年份）
  - 右上角出口 `→ Way out`，与 series.html 统一；**无箭头按钮、无操作提示文字**（全站约定：操作靠直觉）
  - **不循环**：最后一页再 → 进入结束卡 `view-end`（游览到此结束 / Your visit is over），结束卡再 → 合上书回书架；第一页往 ← 停住；结束卡视图里左上角年份清空
  - 键盘 ← → 翻页、Esc 合上；照片区点击左半边往回/右半边往后
  - **流体手势**（fluid.js）：与 series.html 完全一致的 1:1 跟手拖拽 + 橡皮筋 + 惯性决策；结束卡上用力一甩 = 合上书
- 年份内顺序 = 数组顺序：把新照片放数组前面 = 最新在最前面；封面图 = 当年数组第一张

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

### allArchive — Archive 散片档案

```javascript
var allArchive = {
  '2025': [
    // 数组顺序就是显示顺序，新照片放前面 = 最新在最前面（也是这本书的封面）
    { src: 'assets/images/archive/2025/任意命名.jpg', alt: '' },
    // 可选：note 一句话页脚，显示在阅读视图照片和页码之间；不写就只显示页码
    { src: 'assets/images/archive/2025/xxx.jpg', alt: '', note: '多佛白崖下的海湾' },
  ],
  '2024': [
    { src: 'assets/images/archive/2024/xxx.jpg', alt: '' },
  ],
};
```

**关键约束：Archive 只放 src、alt 和可选的 note，不要其他字段。**
Archive 故意没有 caption / date / location / desc / meta，因为它的定位就是"只放照片"。
note 是书架式改版后唯一的例外：一本书翻到某页时，页脚可以有作者的一句话（不是正经作品文案）。
要给照片配完整文字（标题/日期/地点/器材），那它应该进 Gallery 而不是 Archive。

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

> 💡 **有配套 skill 自动处理**：直接把照片文件夹丢进 `assets/images/gallery/`，
> 跟 Claude 说「加一个系列，放 XX 旁边，叫 XX」即可触发 `add-gallery-series` skill，
> 它会自动转码压缩、规范命名、写入 data.js。下面是它背后的手动步骤（供理解/手动操作）：

1. 在 `assets/images/gallery/` 下新建文件夹，名字与计划使用的 `id` 完全一致（用连字符）
2. 放入照片，按 `01.jpeg`、`02.jpeg` 顺序命名（相机直出的 HEIC 需先转 JPEG，见下方"图片压缩标准"）
3. 打开 `data.js`，在 `allSeries` 对应位置添加新对象（不加 `type`，但要加 `cover` 指定封面）
4. 在 `allPhotos` 里添加对应的 key 和照片数组（**每张照片每个字段独占一行**，文本字段留空待填）
5. 刷新 `gallery.html` 查看效果（注意浏览器会缓存 data.js，用 Cmd+Shift+R 硬刷新）

### 如何添加一个分章系列

1. 在 `assets/images/gallery/` 下建系列总文件夹，内部按章节建子文件夹
2. 准备一张封面图（可以是任意一张照片）
3. 在 `allSeries` 里加上 `type: 'sectioned'` 和 `cover: 'assets/images/gallery/.../xxx.jpg'`
4. 在 `allChapters` 里添加对应的 key 和章节数组
5. 每个章节包含 `titleZh`、`titleEn`、`descZh`、`descEn`、`photos` 数组

### 如何往 Archive 加照片

1. 把照片放进 `assets/images/archive/YYYY/`（年份是哪年就放哪年的文件夹）
2. 文件名随意（Archive 不依赖文件名顺序，靠数组顺序决定显示顺序）
3. 在 `data.js` 的 `allArchive['YYYY']` 数组**最前面**加一行 `{ src: 'assets/images/archive/YYYY/xxx.jpg', alt: '' }`
   （放最前面 = 它成为这本书的封面和第一页；想配一句话页脚就再加 `note: '…'` 字段）
4. 想加新一年（如 2026）：在 `allArchive` 里加 `'2026': []`，书架上会自动多一本书（书脊宽度随照片数长粗）
5. 刷新 `archive.html`（浏览器缓存 data.js 时用 Cmd+Shift+R 硬刷新）

### 支持的图片格式与压缩标准

- 浏览器最终用的是 **JPEG**。相机直出常是 HEIC/HIF（哪怕扩展名写成 `.jpeg`），HEIF 浏览器支持度低，**必须转成真 JPEG**。
- **图片压缩标准（固定）**：HEIC→JPEG、**长边 2560px、质量 90**。这是网页展示的安全甜点——视觉无损、体积约降到 1/10。改这个标准要另行说明（如印刷级别）。
- 转码压缩交给 `add-gallery-series` skill 的 `scripts/convert_photos.sh` 自动完成（macOS 用 `sips`）。
- ⚠️ 入库的都是缩小过的网页版；**HEIC 原片请在仓库外另存备份**（印刷/二次修图要用原片）。

---

## 配套 skill：`add-gallery-series`

位于 `.claude/skills/add-gallery-series/`，把"往 Gallery 加一个系列"的整套流程固化下来。

**触发**：把照片文件夹丢进 `assets/images/gallery/`，说一句「加一个系列，放 XX 旁边，叫 XX」。

**它做的事**：
1. **探测真实格式** —— 不信扩展名（相机直出常是 HEIC 伪装成 `.jpeg`，文件名还可能带前导空格）
2. **转码 + 压缩 + 命名** —— `scripts/convert_photos.sh`：HEIC→JPEG、长边 2560 / 质量 90、自然排序零填充成 `01.jpeg…`，并自检（不删源文件夹）
3. **写入 data.js** —— allSeries + allPhotos 两处；先备份、先读最新文件（防止冲掉作者并发的手动编辑）；照片每字段独占一行、文本字段留空待填
4. **验证** —— `node --check` + 每个 src 与磁盘文件交叉核对 + 预览封面加载
5. **报告** —— 并提醒原片备份、硬刷新、续集编号风格统一

**两条固定约定（作者已拍板）**：压缩参数 2560/90 写死不问；文本字段一律留空待作者自己填。

> 分章系列（`type: 'sectioned'`）图片处理相同，但 Step 3 写入的是 `allChapters` 而非 `allPhotos`。

---

## 分享卡片与国内部署

### 为什么要迁到国内节点

`github.io` 在工信部黑名单上，国内运营商（尤其移动）普遍屏蔽。后果有两层：
微信服务器抓不到 `og:image`（卡片没图），以及**朋友点开是白屏**。卡片做得再好看，
打不开就是负面效果。所以域名 + 国内节点是这件事的前提，不是可选项。

### 境外依赖已全部本地化（⚠️ 别改回在线引用）

| 依赖 | 国内表现 | 现在的做法 |
|---|---|---|
| `fonts.googleapis.com` | **确定被墙**，100% 失败 | `assets/vendor/fonts.css` + `fonts/`，210 个 woff2 分片 |
| `cdn.tailwindcss.com` | 走 Cloudflare，时通时断 | `assets/vendor/tailwind.js`，单文件 407KB |

字体保留了 Google 的 **unicode-range 分片**机制：中文被切成一百多片，浏览器只下载
页面里真正出现过的那几片（gallery 页实测 12 片 / 784KB）。这样做的好处是——
**将来往 data.js 填任何生僻字都不会缺字**，比一次性子集化稳。
中文只保留 300/400 两个字重（页面用到的），Cormorant 砍掉了西里尔/越南语分片。

> 想加中文粗体（600）：改 `scripts/fetch-fonts.py` 里的 `KEEP` 再跑一次。
> 代价是多约一百个分片、四五兆体积，所以确实用得上再加。

### 分享卡片（Open Graph）怎么工作

把网址发到微信，微信服务器会先抓一遍这个页面，从 `<head>` 里读 `og:title` /
`og:description` / `og:image` 拼成卡片。**这套标签微信、QQ、微博、飞书、Slack、
iMessage 都读**，改一次全平台受益。

微信的特殊规矩（跟 Facebook/Twitter 不一样，设计要迁就它）：

- 卡片是**左小方图 + 右两行字**，缩略图会被**裁成正方形** → 所以分享图做成 1:1
- 缩略图建议 ≥300×300，图必须**公网 https 可访问**
- 描述手机端只显示一行，**约 15–20 字**，写长了白写
- 微信会**缓存**抓取结果，改了图不一定立刻变 → 网址后加 `?v=2` 强制重抓

**两条硬约束，改动前必读：**

1. `og:image` 和 `og:url` **必须是完整网址**（带 `https://` 和域名）。
   这是全站唯一允许出现绝对路径的地方——微信服务器拿着它去下载图片，相对路径抓不到。
2. **微信抓取时不执行 JavaScript**。所以卡片内容必须写死在 HTML 里。
   `series.html?id=xxx` 靠 JS 渲染，因此**做不到每个系列一张自己的封面**，
   只能用通用文案。想做到就得改成静态多页，不值当。

### 分享图怎么改

分享图是 `assets/images/share/share-card.jpg`（1200×1200）：暖白纸面 + 居中照片
（3px 黑描边）+ Cormorant 落款 "Yang"。用 `scripts/share-card.html` 这个模具经
浏览器截图生成，所以和网站是同一套字体和颜色。

- **换里面那张照片**：改 `scripts/make-share-card.sh` 里的 `PHOTO` 一行，再跑
  `bash scripts/make-share-card.sh`（favicon 也会一并重新生成）
- **选图标准**：优先高对比、构图简单的照片。缩略图在微信里只有百来像素，
  细节丰富的照片缩到那个尺寸会糊成一团。当前用的是黑白柱廊逆光那张
- **照片比网站上相对更大**是有意的：网站那种奢侈留白在百来像素下会显得空、不抓眼
- 模具支持三种版式：`center`（当前用）、`polaroid`（照片偏上下方厚边）、`icon`（做图标）

### 上线流程（域名备案通过后）

1. `python3 scripts/set-domain.py 你的域名` —— 把占位域名换成真的。
   **不做这步卡片就没图**，因为 og:image 还指向 www.example.com
2. 宝塔建站，根目录 `/www/wwwroot/域名`，把整个项目打包上传解压，
   确认 `index.html` 在根目录而不是子文件夹里
3. 宝塔 → SSL → 免费证书申请 → 打开"强制 HTTPS"（微信抓图要求 https）
4. 验证：把网址发到微信"文件传输助手"，看卡片。没图或还是旧的就在网址后加 `?v=2`

---

## 技术规范

### Tailwind CSS
- 使用 CDN 运行时版本，但引的是**本地副本**（国内节点访问 CDN 不稳定）：
  ```html
  <script src="assets/vendor/tailwind.js"></script>
  ```
  ⚠️ 别改回 `https://cdn.tailwindcss.com`——一旦加载失败整站会变成没有样式的裸文字。
  同理字体引的是 `assets/vendor/fonts.css`，不是 Google Fonts。理由见"分享卡片与国内部署"
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
- **`chapterCardIndices[chIdx]`** — 每个章节的章节卡在 renderItems 中的索引，瀑布流里的章节标题 onclick 通过它跳转
- **`swipeControl`** — fluid.js 的滑动控制器实例，接管所有翻页（手势 + 键盘）；页面通过 hooks
  （`isActive / getView / canPrev / canNext / swap / flickClose`）告诉它"当前视图是谁、边界在哪、怎么换内容"

修改 Lightbox 字段显示时，只需改 `updateLightbox()` 里对应视图的 `setField` 调用顺序。
分章系列 renderItems 的顺序是 `[ch1 card, ch1 photos, ch2 card, ch2 photos, ..., end card]`。

### fluid.js 手势引擎（修改前必读）

系列页和 Archive 的 Lightbox 手势/动画全部来自这一个文件，页面里只有 hooks 接线：

- **`createSpring(onUpdate, onRest)`** — 临界阻尼弹簧（永不回弹），半隐式欧拉积分，支持随时改目标、带初速度启动
- **`rubberband(offset, dimension)`** — 边界橡皮筋阻力（Apple 公式，c=0.55）
- **`project(velocity)`** — 惯性投影：按松手速度预测停点，决定翻页还是弹回
- **`createSwipeControl(rootEl, hooks)`** — 手势控制器：10px 迟滞 + 方向锁定（竖向让给原生滚动）、
  1:1 跟手、松手决策、两段式换图动画（滑出渐隐 → swap → 反向滑入渐显）、拖拽后吞 click 防误触
- **手感参数**都在 `createSwipeControl` 顶部（HYSTERESIS/COMMIT_DIST/OUT_DIST/IN_DIST/FLICK_CLOSE），改前三思
- **`fluidReveal(el)`** — 滚动浮现：元素第一次进入视野且图片解码完成后，从下方 14px 轻轻浮上来（450ms 无回弹）。
  gallery 卡片 / series 网格项 / archive 书架的书脊都在创建元素时调用它；同批进入视野的按屏幕位置错开 50ms；
  每张只浮现一次；切换 Archive 年份重新渲染 = 重新浮现（有意的）
- **减弱动态**：`fluidReducedMotion()` 每次现查系统设置，开了就只做淡入淡出、不做位移（浮现也一样：只淡入不上浮）

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
- [ ] **⚠️ 域名备案通过后，第一件事：`python3 scripts/set-domain.py 你的域名`**
      现在 og 标签里是占位域名 `www.example.com`，不换掉分享卡片就没有缩略图
- [ ] 迁到阿里云国内节点（宝塔建站 → 上传 → 申请 SSL → 强制 HTTPS），
      流程见"分享卡片与国内部署"一节
- [ ] 关于页文案填好后，同步改 `about.html` 的 `og:description`
      （现在是占位的"关于我，以及联系方式。"）
- [ ] 填写真实文案（各系列 descZh/descEn，照片 caption/date/location/desc/meta，逐张手填）
- [ ] 填写关于页自我介绍
- [x] ~~往 Archive 放散片（2021–2025 已录入）~~
- [x] ~~创建 GitHub 仓库并部署到 GitHub Pages~~（已上线）
- [x] ~~分享卡片（Open Graph）+ favicon + 境外依赖本地化~~（`share-card` 分支）

### 未来可能的方向
> 现阶段不实现，等需求明确后再讨论。

- [ ] 风格和结构上的进一步打磨（待定，边用边想）
- [ ] **每个系列/胶卷有自己的分享卡片**（2026-07 讨论过，作者决定先上线再说）

      想要的效果：分享某个作品集时，微信卡片显示这个系列自己的封面和标题，
      而不是全站通用的那张。

      为什么现在做不到：`series.html` 一个文件服务 8 个系列，靠 `?id=` 区分。
      但查询参数不改变服务器返回的文件，而微信抓取又不执行 JS——它读到的
      永远是同一套标签。**这是架构决定的，加多少 og 标签都没用。**

      更麻烦的是 film 和 archive：点开某一卷/某一年是**页面内状态切换，
      网址根本不变**，那一卷压根没有自己的网址，想分享都无从分享起。

      要做的话分两步：
      1. film.html / archive.html 先支持 URL 参数直接打开某卷/某年（改交互逻辑）
      2. 写脚本从 data.js 批量生成静态页，每个文件写死自己的 og 标签和 id

      作者已拍板的网址风格：`域名/series/goodbye-ucl.html`（子文件夹形式）。
      专属分享图不用另做模具，`scripts/share-card.html` 换 `photo` 参数就能批量出。
      生成物直接进仓库，网站仍是纯静态、仍不需要 npm，守得住零构建原则。

- [ ] 字体体积优化：gallery 页要下 12 个中文分片约 784KB（300 和 400 两个字重都用到了）。
      国内节点上线后如果觉得中文字体出现得慢，可以考虑中文统一收敛到 400 一个字重，能省掉近一半
- [ ] 照片分类筛选（按题材横向筛选）
- [ ] 语言切换按钮（中/英分离显示）
- [ ] 首页照片墙：点击照片后跳转到对应系列
- [ ] 自定义域名绑定
