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
//   1. 在 allSeries 数组里复制一个对象，填写信息
//      cover 字段必填：自己挑哪张当 gallery 封面（普通/分章系列都一样）
//   2. 在 allPhotos 对象里添加一个同名 key（key 必须和 id 完全一致）
//   3. 在 assets/images/ 下建同名文件夹，放入所有照片
// ================================================================


// ── 系列列表 ─────────────────────────────────────────────────────
// 每个系列对应 gallery.html 里的一个方块（"文件夹"）
// 封面图 = 每个系列的 cover 字段，自己挑哪张，普通系列和分章系列规则一致
var allSeries = [
  {
    id:       'Defocused',
    // 普通系列（无 type），封面用 cover 字段显式指定
    cover:    'assets/images/gallery/Defocused/01.jpeg',
    titleZh:  '虚焦之一',
    titleEn:  'Defocused (i)',
    year:     '2024',
    location: 'Beijing & Shanghai, CN',
    descZh:   '受杉本博司的作品《建筑》的启发，这组照片是对其拙劣的模仿。巨大建筑往往给人留下深刻印象，随着时间流逝，人们对于建筑细节的记忆必将一同消逝，只模糊地想起它们的轮廓。建筑被“失焦”地记录下来，是对人们朦胧的记忆或梦境的呈现。但是，对于闻名世界的建筑而言，即便只窥其轮廓，人们也能立马想起它们的名字。',
    descEn:   '',
  },
  {
    id:       'defocused-uk',
    // 普通系列（无 type），封面用 cover 字段显式指定
    cover:    'assets/images/gallery/defocused-uk/01.jpeg',
    titleZh:  '虚焦之二',
    titleEn:  'Defocused (ii)',
    year:     '2026',
    location: 'London, UK',
    descZh:   '虚焦系列的在伦敦的延伸。我的三年最美好的青春都在这座城度过。相信在未来的某一天想起这里的日子，就像失焦的地标一样模糊。我感激这里的日子。',
    descEn:   '',
  },
  {
    id:       'in-transfer',
    cover:    'assets/images/gallery/in-transfer/01.jpeg',
    titleZh:  '传输中',
    titleEn:  'In Transfer',
    year:     '2023-2024',
    location: '',
    descZh:   '一年暑假，我将存储卡的照片转移到硬盘里。后来查看这些照片时发现了数据迁移造成的不可逆的数据丢失，也就是照片中不规律的彩带。这些彩带，把重要的部分都遮挡住了，我怎么着也回想不起来了。',
    descEn:   '',
  },
  {
    id:       'goodbye-ucl',
    // 普通系列（无 type），封面用 cover 字段显式指定
    cover:    'assets/images/gallery/goodbye-ucl/01.jpeg',
    titleZh:  '再见，UCL',
    titleEn:  'Goodbye, UCL',
    year:     '2026',
    location: 'University College London, UK',
    descZh:   '这组照片全部拍摄于 2026 年 6 月 12 日，这是我学生证过期的最后一天。我特意来了一趟，把这三年我走过的角角落落重温一遍，尽管 UCL 我已经熟悉到没什么可拍的了，可是还是拍了许多张主楼的照片。',
    descEn:   '',
  },
  {
    id:       'lake-district-collections',
    cover:    'assets/images/gallery/lake-district-collections/01.jpeg',
    titleZh:  '在湖区',
    titleEn:  'Lake District Collections',
    year:     ' 2026',
    location: 'Windermere',
    descZh:   '一个让我轻轻感受内心平静的地方。清晨时望着碧蓝的湖面泛起的涟漪，我什么都没有想。将来我想在秋冬再来一次。',
    descEn:   '',
  },
  {
    id:       'photos-of-2025',
    type:     'sectioned',
    cover:    'assets/images/gallery/photos-of-2025/tail-of-the-second-year/01.jpeg',
    titleZh:  '照片记忆｜2025',
    titleEn:  'Photos of 2025',
    year:     '2025',
    location: '',   // 可填入，如 'Beijing & London'
    descZh:   '',   // 系列简介（显示在系列详情页标题下方）
    descEn:   '',
  },
  {
    id:       'photos-of-2024',
    type:     'sectioned',
    cover:    'assets/images/gallery/photos-of-2024/street-life/19.jpeg',
    titleZh:  '照片记忆｜2024',
    titleEn:  'Photos of 2024',
    year:     '2024',
    location: '',
    descZh:   '',
    descEn:   '',
  },
  {
    id:       'photos-of-2023',
    type:     'sectioned',
    cover:    'assets/images/gallery/photos-of-2023/humanities/09.jpeg',
    titleZh:  '照片记忆｜2023',
    titleEn:  'Photos of 2023',
    year:     '2023',
    location: '',
    descZh:   '',
    descEn:   '',
  }
];


// ── 各系列的照片 ──────────────────────────────────────────────────
// key 必须和上面 allSeries 里的 id 完全一致
var allPhotos = {

  // ── Defocused 系列 ───────────────────────────────────────────────
  // 第一张 = 封面（gallery 页展示的缩略图）
  // caption / desc / date / meta 留空即可，Lightbox 不会显示空字段
  'Defocused': [
    {
      src:      'assets/images/gallery/Defocused/01.jpeg', // 封面（第一张 = gallery 缩略图）
      alt:      '虚焦 封面',
      caption:  '中央电视台',
      date:     '2024 年 8 月',
      location: '国贸｜北京',          // 拍摄地点，如：'北京' 或 '上海'
      desc:     '在酒吧',
      meta:     'Sony α6700',          // 相机/胶卷，如：'Contax T2 · Kodak Portra 400'
    },
    {
      src:      'assets/images/gallery/Defocused/02.jpeg',
      alt:      '虚焦 02',
      caption:  '国家大剧院',
      date:     '2024 年 7 月',
      location: '长安街｜北京',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/Defocused/03.jpeg',
      alt:      '虚焦 03',
      caption:  '上海中心',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/Defocused/04.jpeg',
      alt:      '虚焦 04',
      caption:  '国家大剧院',
      date:     '2024 年 7 月',
      location: '长安街｜北京',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/Defocused/05.jpeg',
      alt:      '虚焦 05',
      caption:  '上海中心、金茂大厦和环球金融中心',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/Defocused/06.jpeg',
      alt:      '虚焦 06',
      caption:  '东方明珠',
      date:     '2024 年 7 月',
      location: '外滩｜上海',
      desc:     '',
      meta:     '',
    },
  ],

  // ── 虚焦之二 (defocused-uk) 系列 ──────────────────────────────────
  // 文字字段先留空，想好了再逐张填；空字段不会显示
  'defocused-uk': [
    {
      src:      'assets/images/gallery/defocused-uk/01.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'London Eye',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/defocused-uk/02.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'The Parliament',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/defocused-uk/03.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'the Big Ben and the London Eye',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/defocused-uk/04.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'The Elizabeth Tower',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/defocused-uk/05.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'The Main Quad',
      desc:     '',
      meta:     '',
    },
    {
      src:      '',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/defocused-uk/07.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: 'The Tower Bridge',
      desc:     '',
      meta:     '',
    },
  ],

  // ── In Transfer 系列 ───────────────────────────────────────────────
  // 文字字段先留空（caption/date/location/desc/meta），想好了再填，空的不显示
  'in-transfer': [
    { src: 'assets/images/gallery/in-transfer/01.jpeg', alt: '', caption: '', date: '', location: 'Regent Street', desc: '第一次去看天使灯。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/02.jpeg', alt: '', caption: '', date: '', location: '', desc: '忘了在哪里，忘了和谁。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/03.jpeg', alt: '', caption: '', date: '', location: 'The Primrose hill', desc: '最爱的 Primrose Hill，最常见到的枯木，它好像永远在这片草坪中消失了。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/04.jpeg', alt: '', caption: '', date: '', location: '', desc: '', meta: '' },
    { src: 'assets/images/gallery/in-transfer/05.jpeg', alt: '', caption: '', date: '', location: '', desc: '半夜给冰箱拍照。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/06.jpeg', alt: '', caption: '', date: '', location: 'Oxford', desc: '牛津的某个 college，这是真的没有印象了。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/07.jpeg', alt: '', caption: '', date: '', location: '', desc: '', meta: '' },
    { src: 'assets/images/gallery/in-transfer/08.jpeg', alt: '', caption: '', date: '', location: '', desc: '彩带后面好像有一艘货轮。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/09.jpeg', alt: '', caption: '', date: '', location: '', desc: '彩带遮住了丘吉尔的头。', meta: '' },
    { src: 'assets/images/gallery/in-transfer/10.jpeg', alt: '', caption: '', date: '', location: '', desc: '彩带把站牌遮住了会不会更好？', meta: '' },
  ],

  // ── goodbye-ucl 系列 ──────────────────────────────────────────────
  // 文字字段先留空，想好了再逐张填；空字段不会显示
  'goodbye-ucl': [
    {
      src:      'assets/images/gallery/goodbye-ucl/01.jpeg',
      alt:      '',
      caption:  '主楼一角',
      date:     '12/06/2026',
      location: 'Main Quad｜University College London',
      desc:     '200周年限定横幅的主楼',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/02.jpeg',
      alt:      '',
      caption:  'The North Wing',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/03.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/04.jpeg',
      alt:      '',
      caption:  'Logging in',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/05.jpeg',
      alt:      '',
      caption:  '最熟悉的地方',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/06.jpeg',
      alt:      '',
      caption:  'CIB',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/07.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/08.jpeg',
      alt:      '',
      caption:  'IOE',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/09.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/10.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/11.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/12.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/13.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/14.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/15.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/goodbye-ucl/16.jpeg',
      alt:      '',
      caption:  'Theatre',
      date:     '',
      location: 'Logan Hall',
      desc:     '',
      meta:     '',
    },
  ],

  // ── lake-district-collections 系列 ──────────────────────────────────────────────
  // 文字字段先留空，想好了再逐张填；空字段不会显示
  'lake-district-collections': [
    {
      src:      'assets/images/gallery/lake-district-collections/01.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '晚上七八点钟，天还没黑。',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/02.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '我在 Derwent Water的石滩发呆坐在一块大石头上，好像也什么都没想。',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/03.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/04.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/05.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/06.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/07.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/08.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/09.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '在 Grasmere Lake 划桨板的小朋友。',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/10.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '在船上拍的湖面。',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/11.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/12.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/13.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/14.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/15.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/16.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/17.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/18.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/19.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/20.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/21.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/22.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/23.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/24.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/25.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '',
      meta:     '',
    },
    {
      src:      'assets/images/gallery/lake-district-collections/26.jpeg',
      alt:      '',
      caption:  '',
      date:     '',
      location: '',
      desc:     '救生圈的倒影。',
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
        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/01.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/02.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/03.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/04.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/05.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/06.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/07.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/08.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/09.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/10.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/11.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/12.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/13.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/14.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/15.jpeg', alt: '' },

        { src: 'assets/images/gallery/photos-of-2025/tail-of-the-second-year/16.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '在中国',
      titleEn: 'The Summer',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/gallery/photos-of-2025/the-summer/17.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/18.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/19.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/20.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/21.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/22.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/23.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/24.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/25.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/26.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/27.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/28.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/29.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/30.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/31.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/32.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-summer/33.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '回英国',
      titleEn: 'The Last Fall',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/34.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/35.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/36.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/37.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/38.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/39.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/40.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/41.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/42.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/43.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/44.jpeg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/the-last-fall/45.jpeg', alt: '' },
      ],
    },
    {
      titleZh: 'Images That Remain',
      titleEn: 'Images That Remain',
      descZh:  '',
      descEn:  '',
      photos: [
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/46.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/47.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/48.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/49.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/50.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/51.jpg', alt: '' },
        { src: 'assets/images/gallery/photos-of-2025/images-that-remain/52.jpg', alt: '' },
      ],
    },
  ],

  'photos-of-2024': [
    {
      titleZh: '流影',
      titleEn: 'Flowing Shadows',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/09.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/10.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/11.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/12.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/flowing-shadows/13.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '',
      titleEn: 'Pure Light',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2024/pure-light/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/09.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/10.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/11.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/12.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/13.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/14.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/15.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/16.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/17.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/18.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/19.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/pure-light/20.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '街头',
      titleEn: 'Street Life',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2024/street-life/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/09.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/10.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/11.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/12.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/13.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/14.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/15.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/16.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/17.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/18.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/19.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2024/street-life/20.jpeg', alt: '' },
      ],
    },
  ],

  'photos-of-2023': [
    {
      titleZh: '建筑',
      titleEn: 'Architecture',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2023/architecture/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/architecture/09.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '人文',
      titleEn: 'Humanities',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2023/humanities/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/humanities/09.jpeg', alt: '' },
      ],
    },
    {
      titleZh: '自然',
      titleEn: 'Nature',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2023/nature/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/05.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/06.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/07.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/08.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/09.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/10.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/nature/11.jpeg', alt: '' },
      ]
    },
    {
      titleZh: '创意',
      titleEn: 'creation',
      descZh:  '',
      descEn:  '',
      photos: [
        {src: 'assets/images/gallery/photos-of-2023/creation/01.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/creation/02.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/creation/03.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/creation/04.jpeg', alt: '' },
        {src: 'assets/images/gallery/photos-of-2023/creation/05.jpeg', alt: '' },
      ],
    }
  ],
};


// ================================================================
// allArchive — Journal（散片档案）按年份组织
// ================================================================
// Journal 和 Gallery 是平级的两种容器：
//   - Gallery (allSeries / allPhotos / allChapters) = 我认真策展过的系列
//   - Journal (allArchive)                          = 不成系列的散片，按年归档
//
// 数据结构：key 是年份字符串，value 是该年所有照片的数组
// 年份内的顺序 = 数组的顺序（把新照片放在数组前面，最新的就在最上面）
//
// 每张照片只需要 src（路径）和 alt（无障碍描述，可空）。
// 不需要 caption / date / location / desc / meta —— Journal 故意只放照片。
//
// 添加流程：
//   1. 把照片放进 assets/images/archive/YYYY/ 文件夹（命名随意，会自动按数组顺序展示）
//   2. 在 allArchive['YYYY'] 数组开头加一行 { src: '...', alt: '' }
// ================================================================
var allArchive = {

  '2025': [
    { src: 'assets/images/archive/2025/1.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/2.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/3.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/4.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/5.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/6.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/7.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/8.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/9.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/10.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/11.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/12.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/13.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/14.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/15.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/16.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/17.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/18.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/19.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/20.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/21.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/22.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/23.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/24.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/25.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/26.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/27.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/28.jpeg', alt: '' },
    { src: 'assets/images/archive/2025/29.jpeg', alt: '' },
  ],

  '2024': [
    { src: 'assets/images/archive/2024/1.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/2.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/3.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/4.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/5.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/6.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/7.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/8.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/9.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/10.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/11.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/12.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/13.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/14.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/15.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/16.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/17.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/18.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/19.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/20.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/21.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/22.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/23.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/24.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/25.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/26.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/27.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/28.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/29.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/30.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/31.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/32.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/33.jpeg', alt: '' },
    { src: 'assets/images/archive/2024/34.jpeg', alt: '' },
  ],

  '2023': [
    { src: 'assets/images/archive/2023/1.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/2.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/3.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/4.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/5.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/6.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/7.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/8.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/9.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/10.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/11.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/12.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/13.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/14.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/15.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/16.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/17.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/18.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/19.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/20.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/21.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/22.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/23.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/24.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/25.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/26.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/27.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/28.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/29.jpeg', alt: '' },
    { src: 'assets/images/archive/2023/30.jpeg', alt: '' },
  ],

  '2022': [
    { src: 'assets/images/archive/2022/1.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/2.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/3.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/4.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/5.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/6.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/7.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/8.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/9.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/10.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/11.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/12.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/13.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/14.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/15.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/16.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/17.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/18.jpeg', alt: '' },
    { src: 'assets/images/archive/2022/19.jpeg', alt: '' },
  ],

  '2021': [
    { src: 'assets/images/archive/2021/1.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/2.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/3.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/4.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/5.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/6.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/7.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/8.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/9.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/10.jpeg', alt: '' },
    { src: 'assets/images/archive/2021/11.jpeg', alt: '' },
  ],

};


// ================================================================
// allFilms — Film（胶卷档案）按"卷"组织
// ================================================================
// Film 是和 Gallery / Archive 平级的第三种浏览维度：
//   - Gallery = 按系列看（策展过的作品）
//   - Archive = 按年份看（散片，一年一本书）
//   - Film    = 按物质载体看（一卷胶片 = 一个时间胶囊）
//
// 数据结构：一个数组，每个元素是一卷胶片。
// 页面会自动按 stock（胶卷型号）分组成一排一排的架子：
//   同型号的卷站在同一层搁板上；排的顺序 = 型号在数组里首次出现的顺序。
//
// 每卷的字段：
//   id:     唯一标识，与 assets/images/film/ 下的文件夹名完全一致（连字符，不要空格）
//           命名习惯：型号缩写-序号，如 portra400-01、gold200-02
//   stock:  胶卷型号全名（同一型号必须一字不差，否则会被分到两排）
//           用在：分排依据 + 阅读视图的片边字和左上角
//   label:  筒身印字（短版型号，大写，如 'PORTRA 400'）——型号只印在筒上，架子不设标牌
//           每个空格 = 换一行（135 竖排两列 / 120 腰带两行）；每卷必填，不做自动缩写
//   format: '135' 或 '120' —— 决定筒的造型（135 金属暗盒带片轴头 / 120 纸封卷）
//           和阅读视图的片框（135 有齿孔 / 120 无齿孔）
//   camera: 拍摄相机，可空（''）则不显示；一次性相机写 '一次性相机 · Fuji QuickSnap'
//   date:   拍摄时间，精确到月（如 '2024.06'）——显示在筒脚下的搁板线下方 + 阅读视图左上角；
//           可空（''）则不显示（忘了就空着，诚实比编造好）
//   photos: 照片数组，顺序 = 这卷的拍摄顺序（第一张 = 抽出片头预览时露出的那张）
//           每张只放 src、alt 和可选 note（一句话页脚），与 Archive 同一哲学：
//           想配完整文案（标题/日期/地点/器材）的照片应该进 Gallery。
//
// 排内顺序约定：同型号的卷按时间从左到右排（靠这个数组里的先后顺序，自己控制）——
// 钟爱的型号那一排，本身就是一条时间线。
//
// 添加一卷的流程：
//   1. 在 assets/images/film/ 下建文件夹，名字 = id（如 portra400-03）
//   2. 照片按拍摄顺序命名 01.jpeg、02.jpeg…放进去（HEIC 需先转 JPEG 压缩，规则同全站）
//   3. 在下面数组里加一段（照抄任意一卷的格式），刷新 film.html（缓存用 Cmd+Shift+R）
// ================================================================
// ⚠️ 以下是测试数据：照片临时借用 Archive 的图，仅用于看效果。
//    作者填好 assets/images/film/ 各文件夹后，把 src 换成真实路径、
//    并把 stock / format / camera 改成每卷的真实信息。
// ================================================================
var allFilms = [

  {
    id:     '2403-gold200-120',
    stock:  'Kodak Gold 200',
    label:  'GOLD 200',
    format: '120',
    camera: 'Hasselblad 503CM',
    lens:   '',
    date:   '2024.03',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2403-gold200-120/01.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/02.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/03.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/04.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/05.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/06.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/07.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/08.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/09.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/10.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/11.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-120/12.jpeg', alt: '' },
    ],
  },

  {
    id:     '2403-gold200-135',
    stock:  'Kodak Gold 200',
    label:  'GOLD 200',
    format: '135',
    camera: 'Ricoh GR-S',
    lens:   '',
    date:   '2024.03',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2403-gold200-135/01.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/02.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/03.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/04.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/05.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/06.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/07.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/08.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/09.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/10.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/11.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/12.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/13.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/14.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/15.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/16.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/17.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/18.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/19.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/20.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/21.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/22.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/23.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/24.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/25.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/26.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/27.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/28.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/29.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/30.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/31.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/32.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/33.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/34.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/35.jpeg', alt: '' },
      { src: 'assets/images/film/2403-gold200-135/36.jpeg', alt: '' },
    ],
  },

  {
    id:     '2405-gold200-120',
    stock:  'Kodak Gold 200',
    label:  'GOLD 200',
    format: '120',
    camera: 'Hasselblad 503CM',
    lens:   '',
    date:   '2024.05',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2405-gold200-120/01.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/02.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/03.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/04.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/05.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/06.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/07.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/08.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/09.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/10.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/11.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-120/12.jpeg', alt: '' },
    ],
  },

  {
    id:     '2405-gold200-135',
    stock:  'Kodak Gold 200',
    label:  'GOLD 200',
    format: '135',
    camera: 'Ricoh GR-S',
    lens:   '',
    date:   '2024.05',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2405-gold200-135/01.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/02.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/03.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/04.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/05.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/06.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/07.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/08.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/09.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/10.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/11.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/12.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/13.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/14.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/15.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/16.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/17.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/18.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/19.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/20.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/21.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/22.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/23.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/24.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/25.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/26.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/27.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/28.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/29.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/30.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/31.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/32.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/33.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/34.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/35.jpeg', alt: '' },
      { src: 'assets/images/film/2405-gold200-135/36.jpeg', alt: '' },
    ],
  },

  {
    id:     '2512-portra400-135',
    stock:  'Kodak Portra 400',
    label:  'PORTRA 400',
    format: '135',
    camera: 'Canon EOS-1',
    lens:   '',
    date:   '2025.12',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2512-portra400-135/01.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/02.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/03.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/04.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/05.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/06.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/07.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/08.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/09.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/10.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/11.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/12.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/13.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/14.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/15.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/16.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/17.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/18.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/19.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/20.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/21.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/22.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/23.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/24.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/25.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/26.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/27.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/28.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/29.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/30.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/31.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/32.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/33.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/34.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/35.jpeg', alt: '' },
      { src: 'assets/images/film/2512-portra400-135/36.jpeg', alt: '' },
    ],
  },

  {
    id:     '2605-fujifilm-135',
    stock:  'Fujifilm',
    label:  'FUJIFILM',
    format: '135',
    camera: 'FUJI film Quick Snap',
    lens:   '',
    date:   '2026.05',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2605-fujifilm-135/01.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/02.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/03.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/04.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/05.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/06.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/07.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/08.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/09.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/10.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/11.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/12.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/13.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/14.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/15.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/16.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/17.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/18.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/19.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/20.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/21.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/22.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/23.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/24.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/25.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/26.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/27.jpeg', alt: '' },
      { src: 'assets/images/film/2605-fujifilm-135/28.jpeg', alt: '' },
    ],
  },

  {
    id:     '2607-portra400-135',
    stock:  'Kodak Portra 400',
    label:  'PORTRA 400',
    format: '135',
    camera: 'Canon EOS-1',
    lens:   '',
    date:   '2026.07',
    desc:   '',
    photos: [
      { src: 'assets/images/film/2607-portra400-135/01.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/02.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/03.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/04.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/05.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/06.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/07.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/08.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/09.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/10.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/11.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/12.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/13.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/14.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/15.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/16.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/17.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/18.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/19.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/20.jpeg', alt: '' },
      { src: 'assets/images/film/2607-portra400-135/21.jpeg', alt: '' },
    ],
  },

];

