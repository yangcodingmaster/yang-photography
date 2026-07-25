# CLAUDE.md — 个人摄影作品集网站

> 这份文件是 AI 助手（Claude Code）的工作说明书。
> 每次修改网站前，先读这份文件，严格按照规范执行。

---

## 项目概览

| 项目 | 说明 |
|------|------|
| **项目名** | 赵洋 个人摄影作品集 |
| **阶段** | 全站已部署到国内服务器并验证可访问；**域名备案审核中**（2026-07-26 时点），备案通过后配 DNS + HTTPS 即可对外。文案待逐张填入 |
| **托管** | **腾讯云轻量服务器 + 宝塔面板**（`124.221.92.171`，OpenCloudOS 9.6，2G 内存，PHP 8.2）<br>站点根目录 `/www/wwwroot/yangzhaophoto.com`，部署用 `bash scripts/deploy.sh`（rsync 增量同步）<br>⚠️ GitHub Pages **仍然开着**且从 main 自动构建，详见"两个线上副本"一节 |
| **技术栈** | 纯 HTML + Tailwind CSS（本地副本）+ 原生 JavaScript；**留言表单额外用到一个 PHP 文件**（服务端唯一的动态部分） |
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
| `film.html` Film | ✅ 完成 | 胶卷柜式：每卷一个筒（135/120 两种剪影），抽片头预览 + 片框阅读视图（与 series 同构的图文面板）；已录入 7 卷真实胶卷 |
| `data.js` 数据文件 | ✅ 完成 | Gallery 8 个系列（含 allSeries / allPhotos / allChapters）+ Archive 5 年（allArchive）+ Film 7 卷真实胶卷（allFilms，共 181 张） |
| Gallery 系列 | ✅ 上线 | 见下方"Gallery 系列清单"，共 8 个，约 200 张照片 |
| Archive 散片 | ✅ 上线 | 2021–2025 五年，共 123 张（可选 note 一句话页脚，作者逐张手填） |
| 图片压缩 | ✅ 完成 | 全部转为网页尺寸（HEIC→JPEG，长边 2560 / 质量 90） |
| 路径空格清理 | ✅ 完成 | 全部重命名为连字符形式，可直接部署 |
| GitHub 仓库 | ✅ | `yangcodingmaster/yang-photography`（**公开仓库**，别往里放任何密钥） |
| 腾讯云部署 | ✅ 已验证 | 736 个文件与本地逐一致，512 张图 md5 全等；`scripts/deploy.sh` 增量同步 |
| `message.js` + `api/message.php` 留言表单 | ✅ 上线 | 访客写 → Resend 直接寄到作者邮箱，不存储、不公开显示 |
| HTTPS / 域名解析 | ⬜ 待备案 | 现在只有 80 端口，域名无 A 记录。**微信抓分享图要求 https** |
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
├── film.html               # Film：胶卷柜式胶卷档案，每卷一个筒 + 抽片头预览 + 片框阅读
├── about.html              # 关于页：个人介绍 + 联系方式
│
├── favicon.ico             # 浏览器标签页图标（16/32/48 三个尺寸打包在一个文件里）
├── apple-touch-icon.png    # iOS/安卓"加到主屏"时用的大图标（180×180）
│                           #    这两个由 scripts/make-share-card.sh 生成，别手改
│
├── data.js                 # ⭐ 唯一的数据文件，所有内容只改这里
│                           #    包含：allSeries、allPhotos、allChapters、allArchive、allFilms
├── fluid.js                # 弹簧动画 + 滑动手势引擎（零依赖手写，series / archive / film 三处阅读视图共用）
├── message.js              # 留言表单的前端（四个页面共用一份，自己注入按钮和浮层）
│
├── api/                    # 服务端（全站唯一需要 PHP 的地方）
│   ├── message.php         #    收表单 → 调 Resend 发到作者邮箱。不存储任何东西
│   ├── config.sample.php   #    配置模板，不含密钥，可以进 git
│   └── README.md           #    服务器安装手册（这两个文件被 deploy.sh 排除，不上公网）
│                           #    ⚠️ 真密钥在服务器的 /www/site-secrets/config.php，不在仓库里
│
├── scripts/                # 维护脚本（不是网站的一部分，不影响访客）
│   ├── deploy.sh           #    ⭐ 日常部署就这一条：rsync 增量同步到腾讯云
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
│       ├── archive/                # Archive 散片，按年份归档
│       │   ├── 2021/  2022/  2023/  2024/  2025/
│       └── film/                   # Film 胶卷档案，每卷一个文件夹（文件夹名 = allFilms 的 id）
│           ├── README.txt                    # 命名规则说明（给作者看）
│           │   # 文件夹名 = 年月-型号-格式（连字符），照片按拍摄顺序 01.jpeg、02.jpeg…
│           ├── 2403-gold200-120/  2403-gold200-135/   # 2024.03 Gold 200（120 + 135）
│           ├── 2405-gold200-120/  2405-gold200-135/   # 2024.05 Gold 200
│           ├── 2512-portra400-135/                     # 2025.12 Portra 400
│           └── 2605-fujifilm-135/  2607-portra400-135/ # 2026.05 富士 / 2026.07 Portra 400
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
- 导航融入纸面（无背景无分割线），全英文：Yang · Gallery · Archive · Film · About（全站六个页面同此顺序）

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

### Film 页 `film.html`（胶卷柜式）
- 胶卷档案，与 Gallery / Archive 平级的第三种浏览维度：按物质载体看（一卷胶片 = 一个时间胶囊）
- 数据来自 `data.js` 的 `allFilms`（数组，每个元素一卷）；页面自动按 `stock` 分组成一排排搁板，
  排的顺序 = 型号在数组里首次出现的顺序
- 头部：英文大标题 `Film` + 中文小灰 `胶卷档案`，左对齐短分割线（与 Gallery / Archive 同构）
- **抽象拟物**（与书架式 Archive 同一哲学，不画写实质感）：
  - **筒的剪影 = 画幅制式**：135 = 金属暗盒（带片轴头），120 = 纸封卷（腰带标签）；
    **120 比 135 高**（真实比例感：120 胶片更宽）
  - **筒身配色比背景深一档**：`site-border` 打底 + `site-muted` 半透明描边（Archive 的书是纸
    用 `site-surface`，胶卷是金属/纸筒，用更深一档立出来——对比度是有意调过的，别调回去）
  - **真实胶片壳配色**（film.html 里 `REAL_SHELLS` 开关，当前 `true`，作者已认可采纳）：
    按真实暗盒扁平化——柯达 Professional 系（Portra 400/800、Ektar）= 黑壳 + 柯达黄侧竖条
    + 白字；Gold = 金黄壳黑字（数字金红）；Superia = 富士绿壳白字；135 两端黑压盖。
    只换皮肤，几何交互不变；改 `false` 一行回抽象灰调。`SHELL_STYLES` 按 stock 全名查色，
    查不到自动回退灰调；**品牌色是全站唯一允许硬编码颜色的例外**（属于内容而非设计系统）。
    ⚠️ 加新型号（表里没有的）需在 `SHELL_STYLES` 补一行配色，否则那卷显示为灰调回退
  - **型号只印在筒身上**（`label` 字段，按空格拆行：135 竖排两列 / 120 腰带两行），
    **不设排标牌、不印张数**——字越少越好，架子上只有实物
  - **物体表面的印字用 `font-shell`（系统无衬线栈）**，界面文字仍是 Cormorant——
    划界原则见"禁止做"里的字体例外条目；**筒身尺寸和印字字号（12px）是可读性下限**：
    作者要求 15 寸屏上能直接读出型号，别缩小
  - 135 竖排字**倒转 180°**（`vertical-rl + rotate(180deg)`）：字底朝上、从下往上读，
    字母列在左、数字列在右（作者指定的方向，别"扶正"）
  - **135 常态露出一小截片头舌**（`.leader .tip`：不与胶片同高、外端带弧度像把手——新胶卷
    就是这样，也是"这里能抽"的暗示）；**舌是片头条的末端、同一个实物**：完整片头收起时
    整条藏在筒身后（筒身不透明盖住），只露舌尖；抽出 = 整条 translateX 滑出、舌尖一路
    在最前端（与 bay 展宽同一条缓动曲线）——不是"舌消失、另一条出现"的两个物件
  - **拍摄时间 = 筒脚下的小灰字**（搁板线下方、对准筒身，像标本柜的标签；没写就不渲染）；
    **排内约定按时间从左到右**（靠 allFilms 数组顺序）——钟爱型号的那一排就是一条时间线
  - hover / 触屏第一击 = **从筒里抽出一截片头**（暗色底片 + 第一张照片；135 带齿孔、120 素黑边），
    邻筒被自然挤开——对应 Archive 书脊的展宽露封面
  - 触屏两步交互与 Archive 同构：第一击把这卷推到屏幕中心（平移的是本排的筒容器）、再点才翻开；
    点其他筒切换预览、点空白收回；桌面不做居中位移（同 Archive 的理由）
  - 筒有极轻按压态（scale 0.99，支点在底边）；滚动浮现（fluidReveal）
  - ⚠️ 片头封面图**不能加 `loading="lazy"`**：片头藏在 overflow:hidden 里被视作不可见，
    懒加载永不触发，fluidReveal 等不到图片解码、筒就永远不浮现（已踩过的坑）
- 点击筒 = **翻开进入片框阅读视图**（一次一格，**图文布局与 series.html 的 Lightbox 同构**）：
  - **片框在左、说明面板在右、垂直居中**（`#view-photo` = `flex md:flex-row items-center`，
    与 series 的 `view-photo` 一套写法）；拖动翻页时**图文整体（片框+面板）一起位移**
    （fluid.js 的 `getView()` 返回 `#view-photo`，与 series 完全一致）
  - 照片嵌在深色片框（`bg-site-text`）里：135 上下两排齿孔；120 无齿孔、素黑宽边（`f120` 类）
  - **片边字**：型号在左（大写 + 拉宽字距），画格编号在右（135 带 A 如 `3A`——真实底片写法；120 纯数字）
  - **竖片自适应**：照片加载后按 naturalWidth/Height 判断，竖片时齿孔转到左右两侧、片边字横贯顶部
    （物理底片上竖片是横躺的，完全还原就得歪头看——拟物让位于可用性）
  - 片框 CSS 关键点：齿孔带用 `width:0 + min-width:100%` 不参与格宽计算（预填几十颗齿孔会把格子撑满全屏）；
    片框 + 图片 `max-width:100%` 跟随片框区（`flex-1`），别压到右侧面板（这是 gallery 式布局后的约束）
  - **右侧说明面板层次**（与 series 的文字面板同构，空字段靠 `:empty` 自动隐藏）：
    `title`（作品名，作者自定义，大标题=相当于 series 的 caption）→
    `desc`（这卷一句解释=相当于 series 的 desc）→
    参数行「型号 · 相机 · 镜头 · 日期」（固定技术信息成组，相当于 series 的 meta "Sony α6700"）→
    每格可选 `note`（那一格自己的一句话）。
    **型号和日期不占标题位**（它们是固定技术信息，不是创作标题）——这是 film 和 gallery 的关键区别
  - **左上角**：页码 `n / N`（与 series 计数器同位，拖动时不动）；**右上角** `→ Way out`；
    无箭头按钮、无提示文字（全站约定）
  - 120 抽出的片头是**正方形**（匹配 6×6 方画幅，`--lw` 按格式区分：135=220 长条 / 120=108 近方）
  - 不循环 / 结束卡 `view-end` / 键盘 ← → Esc / 照片区左右半边点击 / 流体手势——全部与 series 一致
- 卷内顺序 = 数组顺序 = 拍摄顺序；片头预览图 = 这卷数组第一张

### 关于页 `about.html`
- 左侧个人照片（`assets/images/profile.jpg`），右侧双语介绍
- 拍摄方向标签（可增减）
- Email + Instagram 链接

### 留言表单（`message.js` + `api/message.php`）

**它是表单，不是留言板。** 访客写的话直接寄到作者邮箱，服务器上不存、网站上不显示。
（曾经做过带存储 + 先审后发的留言板，2026-07-26 按作者要求砍掉了，别再加回来。）

- **入口**：首页 / Gallery / Archive / Film 四页，各放一个 `<div id="message-slot">`
  占位 + 一行 `<script src="message.js">`。按钮和浮层全部由 JS 生成，改一处四页同步
  - `data-style="footer"` = 按钮居中放页面底部（Gallery / Archive / Film）
  - `data-style="float"` = 浮在右下角（首页：全屏轮播、不滚动，没有"底部"可放）
- **浮层**与 series / archive / film 的阅读视图同构：`fixed inset-0` 纸面底 +
  右上角 `→ Way out` + Esc 退出。三个字段：名字（可不填）、邮箱（可不填）、正文
- **浮层在页面加载时就建好藏着**，不是点击时才建 —— Tailwind 运行时靠观察 DOM
  现生成样式，有约一帧延迟，等点击才建会闪一下裸样式。别改回懒创建
- **寄出失败必须如实告诉访客**：什么都不存，发不出去就是彻底丢了。代码里
  发送失败返回 502 且前端保留已填内容，**不要为了"体验好"改成假装成功**
- 对方留了邮箱就设成邮件的 `reply_to`，作者在邮箱里点"回复"即可回信
- **防护**：蜜罐字段 + 同 IP 60 秒冷却（靠系统临时目录的文件时间戳，无需配置）
  + 正文 2000 字 / 名字 40 字上限 + 非字符串输入清洗 + 邮件内容全部转义后再拼
- **密钥永远不进仓库**：Resend 的 key 在服务器的 `/www/site-secrets/config.php`，
  网站目录之外（公网访问不到，且 `deploy.sh` 的 `--delete` 够不着）。
  安装步骤见 `api/README.md`
- **体检接口**：`/api/message.php?action=selftest&token=…`（token 在上面那个配置文件里），
  一次列出 PHP 版本、扩展、配置、邮箱等八项状态，排障从这里开始

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

### allFilms — Film 胶卷档案

```javascript
var allFilms = [
  {
    id:     '2512-portra400-135',       // 唯一标识 = assets/images/film/ 下的文件夹名
                                        //   命名约定：年月-型号-格式（连字符，URL 安全）
    stock:  'Kodak Portra 400',         // 胶卷型号全名；同型号必须一字不差，页面按它分排
    label:  'PORTRA 400',               // 筒身印字（短版大写）；每个空格 = 换一行；每卷必填
    format: '135',                      // '135' 或 '120'：决定筒的剪影和片框有无齿孔
    camera: 'Canon EOS-1',              // 这卷用的相机；可空；一次性相机写 'FUJI film Quick Snap'
    lens:   '',                         // 这卷用的镜头；可空（胶片一卷器材固定，忘了就空着）
    date:   '2025.12',                  // 精确到月；显示在筒脚下 + 阅读视图参数行；可空
    title:  '',                         // ⭐ 作品名（作者自定义 = 阅读视图大标题，相当于 gallery 的 caption）；可空
    desc:   '',                         // ⭐ 这卷的一句解释（相当于 gallery 的 desc）；可空
    photos: [
      // 顺序 = 这卷的拍摄顺序；第一张 = 抽片头预览露出的那张
      { src: 'assets/images/film/2512-portra400-135/01.jpeg', alt: '' },
      // 可选 note：每格自己的一句话，显示在阅读视图面板底部
      { src: 'assets/images/film/2512-portra400-135/02.jpeg', alt: '', note: '雨停之前' },
    ],
  },
];
```

**阅读视图面板层次（与 series lightbox 同构）：**
`title`（作品名，大标题）→ `desc`（解释）→ 参数行「型号 · 相机 · 镜头 · 日期」。
—— 与 gallery 的区别：型号和日期是固定技术信息，不当作品名，成组放参数行；
标题留给作者自定义的 `title`。所有可选字段留空则自动隐藏（`:empty`）。

**关键约束：photos 里只放 src、alt 和可选 note**（每格一句话，与 Archive 同款）。
卷级的创作文字用 `title` / `desc`，技术信息用 `stock` / `camera` / `lens` / `date`。

**当前状态：已录入 7 卷真实胶卷共 181 张**（Gold 200 ×4、Portra 400 ×2、Fujifilm ×1），
相机已填；`title` / `desc` / `lens` 留空待作者逐卷填。加新一卷见下方"如何往 Film 加一卷"。

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
| Film 某卷作品名 / 一句解释 | `data.js` → `allFilms` 对应卷的 `title` / `desc`（可留空） |
| Film 某卷相机 / 镜头 | `data.js` → `allFilms` 对应卷的 `camera` / `lens`（一卷器材固定） |
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

### 如何往 Film 加一卷

1. 在 `assets/images/film/` 下建文件夹，名字 = 这卷的 `id`，命名约定 **年月-型号-格式**
   （连字符、URL 安全，如 `2403-gold200-135`、`2605-fujifilm-135`）
2. 照片按**这卷的拍摄顺序**命名 `01.jpeg`、`02.jpeg`…放进去（HEIC/BMP 先转 JPEG，压缩标准同全站）
3. 在 `data.js` 的 `allFilms` 数组里照抄任意一卷的格式加一段：
   id / stock / label / format / camera / **lens** / date / **title** / **desc** / photos
   （lens/title/desc 可留空自动隐藏；⚠️ 新型号需在 film.html 的 `SHELL_STYLES` 补一行配色）
4. 同型号的卷会自动归到同一排搁板；新型号 = 柜子里自动多一排；
   **同排内把卷按时间先后排在数组里**（早的在前 = 站在左边），日期精确到月（如 `2024.06`）
5. 刷新 `film.html`（浏览器缓存 data.js 时用 Cmd+Shift+R 硬刷新）

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

### 为什么迁到了国内节点（已完成）

`github.io` 在工信部黑名单上，国内运营商（尤其移动）普遍屏蔽。后果有两层：
微信服务器抓不到 `og:image`（卡片没图），以及**朋友点开是白屏**。卡片做得再好看，
打不开就是负面效果。所以域名 + 国内节点是这件事的前提，不是可选项。

2026-07 已迁到腾讯云轻量服务器 + 宝塔，站点验证可访问，只等域名备案。

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

### 日常部署（已上线，这是现在的做法）

```bash
bash scripts/deploy.sh              # 正式同步
bash scripts/deploy.sh --dry-run    # 演习：只列清单不真传
```

rsync 增量同步到腾讯云，**只传变化的部分** —— 改几行文案就是几 KB、一两秒。
（对比：早期用宝塔传 zip 是每次 600MB，还得解压，且传丢过 12 个文件。）

**三个必须知道的点：**

1. **`--delete` 让服务器成为本地的镜子** —— 服务器上有、本地没有的一律删掉。
   所以密钥和任何"只在服务器上产生"的东西都必须放在站点根目录**外面**
   （现在只有 `/www/site-secrets/config.php` 属于这类）
2. **`api/README.md` 和 `api/config.sample.php` 被排除**，不上公网 ——
   它们不含密钥，但写着密钥存放路径和防护细节，没必要公开
3. **同步完会自动把文件属主归位成 `www:www`**（脚本末尾补了一条 `chown`）。
   正规做法是给 rsync 加 `--chown=www:www`，但那是 rsync 3.1 的参数，
   而 **macOS 自带的 rsync 停在 2.6.9（2006 年）没有它**，所以改成传完补一刀

### SSH 加固（2026-07-26 做的，换服务器时要重做）

密码登录已关闭，只认密钥。配置在 `/etc/ssh/sshd_config.d/00-hardening.conf`。

**⚠️ 为什么文件名必须以 `00` 开头**：主配置第 15 行有
`Include /etc/ssh/sshd_config.d/*.conf`，这些文件按文件名顺序读取，
而 **sshd 的规则是"同一项最先出现的生效"**。系统自带的 `50-cloud-init.conf`
里写着 `PasswordAuthentication yes` —— 往主文件末尾加一行是**完全无效的**，
必须排在它前面才能覆盖。改完务必用 `sshd -T | grep passwordauthentication`
确认真的生效，别只看自己写了什么。

- 改回去：删掉 `00-hardening.conf` → `systemctl reload sshd`
- 备份在 `/root/ssh-backup-20260726-050007`
- **万一 SSH 进不去**：用腾讯云控制台的 **VNC 登录**（不走 SSH），照样能改回来

### 服务器上已经配好的（换服务器时要重做）

| 项 | 状态 |
|---|---|
| 站点 PHP 版本 | PHP-82（**不能是「纯静态」**，否则 .php 会被当文本吐出源码） |
| 防跨站攻击 (open_basedir) | **已关闭** —— 开着的话 PHP 读不到站点目录外的密钥文件 |
| `/www/site-secrets/config.php` | `640 root:www`，含 Resend key 和体检口令 |
| SSH | 公钥免密登录已配；**密码登录已关闭**（2026-07-26），只认密钥 |

### 备案通过后还剩三步

1. 腾讯云 DNSPod 加 A 记录：`yangzhaophoto.com` → `124.221.92.171`
2. 宝塔 → SSL → 免费证书 → 打开"强制 HTTPS"（**微信抓分享图要求 https**）
3. Resend 后台验证 `yangzhaophoto.com` 域名，把服务器配置里的 `MAIL_FROM`
   从 `onboarding@resend.dev` 换成自己域名的地址（降低进垃圾箱概率）

然后把网址发到微信"文件传输助手"验证卡片；没图或还是旧的就在网址后加 `?v=2` 强制重抓。

> og 占位域名已于 2026-07-26 替换为 `https://yangzhaophoto.com`（12 处），这步不用再做。

### ⚠️ 两个线上副本

**GitHub Pages 仍然开着**，从 `main` 分支自动构建，也就是说每次 push 都会更新
`https://yangcodingmaster.github.io/yang-photography/`。于是同一个站有两个线上副本，
它们的行为**不一样**：

| | 腾讯云（正式） | GitHub Pages |
|---|---|---|
| 国内能否打开 | 能 | ❌ github.io 被屏蔽 |
| 留言表单 | 正常 | ❌ **坏的**：静态托管不跑 PHP，点寄出必失败 |
| `api/message.php` | 被执行 | ⚠️ 被当纯文本吐出源码（不含密钥，但暴露设计细节） |

**这是个待决问题，不是已解决状态。** 三个选项：关掉 Pages（推荐——当初迁走就是因为
它在国内打不开）、留着当境外镜像但接受留言表单是坏的、或给 Pages 做优雅降级。
作者未拍板前不要擅自关闭。

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

系列页、Archive 和 Film 的 Lightbox/阅读视图手势动画全部来自这一个文件，页面里只有 hooks 接线：

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
- 改完线上相关的东西，用 `bash scripts/deploy.sh --dry-run` 先看清单再真跑

### 禁止做
- 不引入 npm 包或需要构建的工具（保持零构建。`api/message.php` 是单文件 PHP，
  不需要 composer、不需要构建，没有破坏这条原则）
- **任何密钥、API key、口令都不许进仓库、不许进聊天、不许写死在代码里**。
  它们只存在于服务器的 `/www/site-secrets/config.php`。
  需要生成口令时在服务器上跑 `openssl rand -hex 24`，别把值打印出来
- **不给公开仓库提交服务器密码或私钥**（`yangcodingmaster/yang-photography` 是公开仓库）
- 不用 `style=""` 内联样式（JS 动态控制 display/transform 除外）
- 不把颜色值硬编码在 class 里（用 `text-site-muted` 而不是 `text-[#8a8a85]`）
- 不在没有说明的情况下改动设计系统
- 不写没有注释的 JavaScript 函数
- 不为任何系列省略 `cover` 字段（封面统一靠 cover，省略则 gallery 缩略图空白）
- **不使用 `italic` 类**：英文统一用 Cormorant Garamond 的正体，不要斜体（用户明确要求）
- **不引入 Cormorant 以外的英文字体**（DM Sans 已经移除，保持 Cormorant + Noto Serif SC 两个字体即可）。
  **唯一例外（与品牌色例外同一条原则——"物"是内容，界面是设计系统）**：Film 页"物体表面的印字"
  用 `font-shell` = 系统无衬线栈（`"Helvetica Neue", Arial, sans-serif`，零加载，真实暗盒印的就是这一路字）。
  只允许出现在三处：135 筒身竖排印字、120 腰带印字、阅读视图片边字。
  筒脚日期、面板卷信息（作品名/解释/参数行）、页码、note 等界面文字一律走界面字体
  （Cormorant / 中文 Noto Serif），不得扩散到 font-shell

### 每次任务结束后报告
1. 改了什么文件
2. 新增了什么功能
3. 有没有需要手动处理的遗留问题

---

## 待办 / 未来可能的方向

> 已完成的条目直接删除，不留划线记录 —— 历史在 git 里，这份文件只回答"现在还差什么"。

### 阻塞中（等外部）
- [ ] **域名备案**审核中。通过后三步：DNS A 记录 → 宝塔申请 SSL + 强制 HTTPS →
      Resend 验证发件域名。详见"备案通过后还剩三步"

### 待作者决定
- [ ] **GitHub Pages 怎么处理** —— 现在是第二个线上副本且留言表单是坏的，
      见"两个线上副本"一节。建议关掉

### 待填文案（只有作者本人能做）
- [ ] 各系列 `descZh` / `descEn`，照片 `caption` / `date` / `location` / `desc` / `meta`
- [ ] 关于页自我介绍；填好后同步改 `about.html` 的 `og:description`
      （现在是占位的"关于我，以及联系方式。"）
- [ ] Film 逐卷填 `title` / `desc` / `lens`（都可选，留空自动隐藏）

### 待观察
- [ ] 首页轮播是否纳入 Film 照片（暂不纳入）
- [ ] 网站有真实访问量之后再考虑装统计（2026-07-26 查日志：三天 258 次请求，
      **全部是境外扫描机器人**，零真人页面访问，所以现在装统计工具没有意义）。
      到时候首选 GoAccess：读 Nginx 日志出单文件 HTML 报表，不改网站、不用数据库、
      不把数据交给第三方。⚠️ 别用 Google Analytics —— 它在国内被墙，收不到主要受众

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
