#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 zine-dims.js —— 画册页面用的图片宽高表。

为什么需要它：画册页（zine.html）给每张 <img> 写上宽高占位，
照片还没加载完时页面也不会跳版。宽高从小图档（assets/images-sm/）里读，
键是原图路径（data.js 里写的就是原图路径）。

什么时候跑：加了新照片之后跑一次（和 make-small-images.py 搭配使用，
先跑那个生成小图，再跑这个更新尺寸表）。增量无所谓——每次都是全量重算，
500 张图也只要一两秒。

用法：
    python3 scripts/make-zine-dims.py
"""

import os
import json
import struct

# 脚本在 scripts/ 里，工作目录切到项目根
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


def jpeg_size(path):
    """从 JPEG 码流的 SOF 段直接读尺寸，不依赖任何第三方库。"""
    with open(path, 'rb') as f:
        data = f.read()
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        # SOF0–SOF15（跳过 DHT/JPG/DAC 这三个不是帧头的）
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            h, w = struct.unpack('>HH', data[i + 5:i + 9])
            return w, h
        seglen = struct.unpack('>H', data[i + 2:i + 4])[0]
        i += 2 + seglen
    return None


dims = {}
for root, _, files in os.walk('assets/images-sm'):
    if '/share' in root:          # 分享卡片不进画册，跳过
        continue
    for fn in sorted(files):
        if fn.lower().endswith(('.jpeg', '.jpg')):
            p = os.path.join(root, fn)
            size = jpeg_size(p)
            if size:
                # 键用原图路径：data.js 里写的是 assets/images/…
                dims[p.replace('images-sm', 'images')] = list(size)

out = '// 实验样张专用：小图档的宽高表（由 scripts/make-zine-dims.py 生成，勿手改）\n'
out += 'var ZINE_DIMS = ' + json.dumps(dims, ensure_ascii=False, separators=(',', ':')) + ';\n'
with open('zine-dims.js', 'w', encoding='utf-8') as f:
    f.write(out)

print('已写入 zine-dims.js：', len(dims), '张')
