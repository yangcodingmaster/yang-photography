#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成手机小图档：assets/images/ → assets/images-sm/（长边 1280 / 质量 85）

为什么需要：原图标准是长边 2560 / 质量 90（平均 1.16MB），那是给桌面
高分屏定的。手机屏幕最多用到 ~1300px 宽——70% 的字节是手机显示不出来的。
服务器出口约 400KB/s，小图档把翻页等待从 ~3 秒降到 ~0.75 秒，免费。

规则（与页面里的 fluidSmallSrc 约定一致，改一边必须改另一边）：
    小图路径 = 原图路径里的 assets/images/ 换成 assets/images-sm/
    文件名和子目录结构完全相同

三种处理方式（脚本自动判断）：
    缩放重编码   —— 正常照片且长边 > 1280
    原字节拷贝   —— ① glitch 作品（码流故意损坏的创作，绝不重编码：
                       不同解码器渲染损坏码流的结果不同，重编码等于
                       替作者选定一种渲染并抹掉其它可能）
                    ② 本来就 ≤1280 的图（缩了也省不了几个字节）
                    ③ 重编码反而变大的图（罕见，但发生就用原图）
    跳过         —— 小图已存在且比原图新（增量：加了新照片再跑一次即可）

用法（在项目根目录）：
    python3 scripts/make-small-images.py            # 增量生成
    python3 scripts/make-small-images.py --force    # 全部重做（改参数后用）

跑完把 assets/images-sm/ 一起提交 + 部署即可（deploy.sh 会自动同步）。
"""

import io
import os
import shutil
import sys

from PIL import Image, ImageOps

SRC_ROOT = 'assets/images'
DST_ROOT = 'assets/images-sm'
LONG_EDGE = 1280
QUALITY = 85

# 这些不生成小图：share 是微信分享卡片（og:image 指向原图，动不得）
SKIP_DIRS = {'share'}


def is_corrupt_jpeg(path):
    """字节级检查 JPEG 码流是否"损坏"（= 可能是 glitch 作品，须原样保留）。

    JPEG 的压缩数据里，0xFF 后面只允许跟 0x00（转义）、0xD0-D7（重启标记）、
    0xFF（填充）或 0xD9（结束）。出现别的 = 码流被写坏，解码器会在那里
    渲染出彩色噪声——正是 glitch 作品的做法。结尾缺 FFD9 同理（截断）。
    """
    data = open(path, 'rb').read()
    if len(data) < 4 or data[:2] != b'\xff\xd8':
        return True
    if data[-2:] != b'\xff\xd9':
        return True

    # 顺着段结构找到 SOS（压缩数据入口）
    i = 2
    sos = None
    while i < len(data) - 3:
        if data[i] != 0xFF:
            return True                          # 段结构乱了
        marker = data[i + 1]
        if marker == 0x01 or 0xD0 <= marker <= 0xD8:
            i += 2
            continue
        seg = (data[i + 2] << 8) | data[i + 3]
        if marker == 0xDA:
            sos = i + 2 + seg
            break
        i += 2 + seg
    if sos is None:
        return True

    # 扫压缩数据里的非法标记
    j = sos
    end = len(data) - 2
    while j < end:
        if data[j] == 0xFF:
            nxt = data[j + 1]
            if nxt == 0xD9:
                break
            if not (nxt == 0x00 or 0xD0 <= nxt <= 0xD7 or nxt == 0xFF):
                return True
            j += 2
        else:
            j += 1
    return False


def make_small(src, dst):
    """生成一张小图。返回处理方式的标签（统计用）。"""
    if is_corrupt_jpeg(src):
        shutil.copy2(src, dst)
        return 'glitch原样拷贝'

    try:
        im = Image.open(src)
        im.load()
    except Exception:
        shutil.copy2(src, dst)                   # 解不开就原样拷贝，别丢照片
        return 'glitch原样拷贝'

    # 尊重 EXIF 旋转（烤进像素里，小图不再带 EXIF）
    im = ImageOps.exif_transpose(im)

    if max(im.size) <= LONG_EDGE:
        shutil.copy2(src, dst)                   # 本来就小，缩了没意义
        return '本就不大拷贝'

    im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)

    # 保留色彩配置文件（P3 拍的照片丢了 ICC 会偏色）；progressive = 慢网先糊后清
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=QUALITY, optimize=True, progressive=True,
            icc_profile=im.info.get('icc_profile'))
    small = buf.getvalue()

    if len(small) >= os.path.getsize(src):
        shutil.copy2(src, dst)                   # 缩完反而更大（罕见）→ 用原图
        return '重编码反大拷贝'

    open(dst, 'wb').write(small)
    return '缩放重编码'


def main():
    force = '--force' in sys.argv
    if not os.path.isdir(SRC_ROOT):
        sys.exit('请在项目根目录执行')

    stats = {}
    total_src = total_dst = 0

    for dirpath, dirnames, filenames in os.walk(SRC_ROOT):
        # 跳过不需要小图的目录
        rel = os.path.relpath(dirpath, SRC_ROOT)
        top = rel.split(os.sep)[0]
        if top in SKIP_DIRS:
            dirnames[:] = []
            continue

        for name in sorted(filenames):
            if not name.lower().endswith(('.jpg', '.jpeg')):
                continue
            src = os.path.join(dirpath, name)
            dst = os.path.join(DST_ROOT, rel, name) if rel != '.' else os.path.join(DST_ROOT, name)

            os.makedirs(os.path.dirname(dst), exist_ok=True)

            # 增量：已有且比原图新就跳过
            if not force and os.path.exists(dst) \
               and os.path.getmtime(dst) >= os.path.getmtime(src):
                stats['跳过(已是最新)'] = stats.get('跳过(已是最新)', 0) + 1
                continue

            tag = make_small(src, dst)
            stats[tag] = stats.get(tag, 0) + 1
            total_src += os.path.getsize(src)
            total_dst += os.path.getsize(dst)

    print('处理结果：')
    for k in sorted(stats):
        print(f'  {k}: {stats[k]} 张')
    if total_src:
        print(f'本次处理的体积：{total_src/1048576:.0f} MB → {total_dst/1048576:.0f} MB'
              f'（{100*total_dst/total_src:.0f}%）')

    # 自检：小图树和原图树的照片数量必须一致（页面是按路径规则直接引用的，
    # 缺一张就是一个 404 破图）
    def count(root, skip):
        n = 0
        for dp, dn, fn in os.walk(root):
            rel0 = os.path.relpath(dp, root).split(os.sep)[0]
            if rel0 in skip:
                dn[:] = []
                continue
            n += sum(1 for f in fn if f.lower().endswith(('.jpg', '.jpeg')))
        return n

    n_src, n_dst = count(SRC_ROOT, SKIP_DIRS), count(DST_ROOT, set())
    print(f'自检：原图 {n_src} 张 / 小图 {n_dst} 张 ' + ('✓ 一致' if n_src == n_dst else '❌ 不一致！'))
    return 0 if n_src == n_dst else 1


if __name__ == '__main__':
    sys.exit(main())
