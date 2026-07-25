照片存放规则
============

目录结构（三种浏览维度各一个子文件夹）
  gallery/   — Gallery 系列，每个系列一个文件夹（文件夹名 = data.js 里的 id）
  archive/   — Archive 散片，按年份归档（2021/ 2022/ … 2025/）
  film/      — Film 胶卷档案，每卷一个文件夹（详见 film/README.txt）
  share/     — 分享卡片缩略图（由 scripts/make-share-card.sh 生成，别手改）

一、Gallery 文件夹命名
  每个系列一个文件夹，文件夹名必须和 data.js 里的 id 字段完全一致（连字符，不要空格）。
  例如：data.js 里写 id: 'lake-district-collections'，文件夹就叫 lake-district-collections/

二、文件命名
  01.jpeg、02.jpeg…   — 系列内照片按顺序编号（零填充两位，方便排序）
  封面不用固定文件名：在 data.js 的 allSeries 里用 cover 字段指定哪张当封面（可以是任意一张）

三、关于页个人照片
  直接放在 assets/images/ 根目录，命名为 profile.jpg

四、图片压缩标准（固定，全站统一）
  HEIC/BMP → 真 JPEG，长边 2560 px，质量 90。
  这是网页展示的安全甜点（视觉无损、体积约降到 1/10）。改这个标准要另行说明（如印刷级别）。
  转码压缩交给 add-gallery-series skill 的 scripts/convert_photos.sh 自动完成。

五、加照片的方法
  1. 把照片按命名规则放进对应文件夹（Gallery 见上，Archive/Film 见各自说明）
  2. 打开 data.js，在对应的 allSeries/allPhotos/allArchive/allFilms 里加条目，src 指向本地路径
     例如：'assets/images/gallery/lake-district-collections/01.jpeg'

⚠️ 入库的都是缩小过的网页版；HEIC / 原始扫描件请在仓库外另存备份（印刷 / 二次修图要用原片）。
