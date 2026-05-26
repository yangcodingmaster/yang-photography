// ================================================================
// data.js — 网站全部内容数据
// ================================================================
// 这是你唯一需要手动编辑的数据文件。
//
// ── 每张照片支持的字段 ──────────────────────────────────────────
//
//   src      必填  图片路径，本地用 'assets/images/系列名/01.jpeg'
//   alt      必填  图片的无障碍描述（一句话即可）
//   caption  选填  作品名 / 短标题，显示在 Lightbox 顶部
//   date     选填  拍摄时间，如 '2024年3月' 或 '2024.03.15'
//   location 选填  拍摄地点，如 '北京' 或 'Shanghai'（每张可以不同）
//   desc     选填  你的想法 / 拍摄感受，一两句话，显示在地点下方
//   meta     选填  相机和胶卷信息，如 'Leica M6 · Kodak Portra 400'
//
//   空字段会自动隐藏，不会显示多余的空白，可以慢慢填。
//
// ── 组图（2-5张纵向堆叠）────────────────────────────────────
// 把单张照片的 src 换成 group 数组即可，其余字段为整组共享：
//
//   {
//     group: [
//       { src: 'assets/images/xxx/01.jpeg', alt: '描述' },
//       { src: 'assets/images/xxx/02.jpeg', alt: '描述' },
//     ],
//     caption:  '整组的标题',
//     date:     '2024年8月',
//     location: '北京',
//     desc:     '整组的想法',
//     meta:     '相机/胶卷',
//   }
//
// ── 如何添加一个新系列 ──────────────────────────────────────────
//   1. 在 allSeries 数组里复制一个对象，填写信息（不需要 cover 字段）
//   2. 在 allPhotos 对象里添加一个同名 key
//      第一张照片 = 系列封面（gallery 页展示的缩略图）
//   3. 在 assets/images/ 下建同名文件夹，放入所有照片
// ================================================================


// ── 系列列表 ─────────────────────────────────────────────────────
// 每个系列对应 gallery.html 里的一个方块（"文件夹"）
// 封面图 = allPhotos 里该系列的第一张，不需要单独的 cover 字段
var allSeries = [
  {
    id:       'Defocused',
    // type 字段缺省 = 普通系列，封面 = allPhotos 第一张
    titleZh:  '虚焦',
    titleEn:  'Defocused',
    year:     '2024',
    location: 'Beijing & Shanghai, China',
    descZh:   '北京与上海，2024。失焦的城市，失焦的时间。',
    descEn:   'Beijing and Shanghai, 2024. Cities out of focus, time out of focus.',
  },
  {
    id:       'photos-of-2025',
    type:     'sectioned',
    cover:    'assets/images/photos-of-2025/tail-of-the-second-year/01.jpeg',
    titleZh:  '2025',
    titleEn:  'Photos of 2025',
    year:     '2025',
    location: '',   // 可填入，如 'Beijing & London'
    descZh:   '',   // 系列简介（显示在系列详情页标题下方）
    descEn:   '',
  },
];


// ── 各系列的照片 ──────────────────────────────────────────────────
// key 必须和上面 allSeries 里的 id 完全一致
var allPhotos = {

  // ── Defocused 系列 ───────────────────────────────────────────────
  // 第一张 = 封面（gallery 页展示的缩略图）
  // caption / desc / date / meta 留空即可，Lightbox 不会显示空字段
  'Defocused': [
    {
      src:      'assets/images/Defocused/01.jpeg', // 封面（第一张 = gallery 缩略图）
      alt:      '虚焦 封面',
      caption:  '中央电视台',
      date:     '2024 年 8 月',
      location: '国贸｜北京',          // 拍摄地点，如：'北京' 或 '上海'
      desc:     '在酒吧',
      meta:     'Sony α6700',          // 相机/胶卷，如：'Contax T2 · Kodak Portra 400'
    },
    {
      src:      'assets/images/Defocused/02.jpeg',
      alt:      '虚焦 02',
      caption:  '国家大剧院',
      date:     '2024 年 7 月',
      location: '长安街｜北京',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/Defocused/03.jpeg',
      alt:      '虚焦 03',
      caption:  '上海中心',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/Defocused/04.jpeg',
      alt:      '虚焦 04',
      caption:  '国家大剧院',
      date:     '2024 年 7 月',
      location: '长安街｜北京',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/Defocused/05.jpeg',
      alt:      '虚焦 05',
      caption:  '上海中心、金茂大厦和环球金融中心',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/Defocused/06.jpeg',
      alt:      '虚焦 06',
      caption:  '东方明珠',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
  ],

};


// ================================================================
// allChapters — 分章系列的数据（年度合集等多主题系列）
// ================================================================
// 每个 key 对应 allSeries 里 type: 'sectioned' 的系列 id
//
// 每个章节包含：
//   titleZh  章节中文名，显示在章节标题和过渡卡上
//   titleEn  章节英文名
//   descZh   章节中文描述，显示在过渡卡正文（可留空）
//   descEn   章节英文描述（可留空）
//   photos   照片列表，字段与 allPhotos 完全一致
//
// 注意：
//   - 封面在 allSeries 的 cover 字段里显式指定，不从第一张读取
//   - 章节内照片不会随机打散，保持你填写的顺序
// ================================================================
var allChapters = {

  // ── Photos of 2025 ───────────────────────────────────────────────
  'photos-of-2025': [
    {
      titleZh: '在英国',
      titleEn: 'Tail of the Second Year',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/01.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/02.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/03.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/04.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/05.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/06.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/07.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/08.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/09.jpeg', alt: '' },

        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/10.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/11.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/12.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/13.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/14.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/15.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/tail-of-the-second-year/16.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '在中国',
      titleEn: 'The Summer',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/photos-of-2025/the-summer/17.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/18.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/19.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/20.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/21.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/22.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/23.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/24.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/25.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/26.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/27.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/28.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/29.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/30.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/31.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/32.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-summer/33.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '回英国',
      titleEn: 'The Last Fall',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/photos-of-2025/the-last-fall/34.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/35.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/36.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/37.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/38.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/39.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/40.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/41.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/42.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/43.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/44.jpeg', alt: '' },
        { src: 'assets/images/photos-of-2025/the-last-fall/45.jpeg', alt: '' },
      ],
    },
    {
      titleZh: 'Images That Remain',
      titleEn: 'Images That Remain',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/photos-of-2025/images-that-remain/46.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/47.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/48.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/49.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/50.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/51.jpg', alt: '' },
        { src: 'assets/images/photos-of-2025/images-that-remain/52.jpg', alt: '' },
      ],
    },
  ],

};


// ================================================================
// allJournal — Journal（散片档案）按年份组织
// ================================================================
// Journal 和 Gallery 是平级的两种容器：
//   - Gallery (allSeries / allPhotos / allChapters) = 我认真策展过的系列
//   - Journal (allJournal)                          = 不成系列的散片，按年归档
//
// 数据结构：key 是年份字符串，value 是该年所有照片的数组
// 年份内的顺序 = 数组的顺序（把新照片放在数组前面，最新的就在最上面）
//
// 每张照片只需要 src（路径）和 alt（无障碍描述，可空）。
// 不需要 caption / date / location / desc / meta —— Journal 故意只放照片。
//
// 添加流程：
//   1. 把照片放进 assets/images/Journal/YYYY/ 文件夹（命名随意）
//   2. 在 allJournal['YYYY'] 数组开头加一行 { src: '...', alt: '' }
// ================================================================
var allJournal = {

  '2025': [
    // { src: 'assets/images/Journal/2025/xxx.jpg', alt: '' },
  ],

  '2024': [
    // { src: 'assets/images/Journal/2024/xxx.jpg', alt: '' },
  ],

};
