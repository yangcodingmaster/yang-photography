#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 Google Fonts 的字体文件抓到本地（assets/vendor/）。

为什么需要这个脚本：
    网站部署在国内节点后，fonts.googleapis.com 是访问不到的（被墙）。
    如果继续用在线引用，中文和英文字体都会加载失败，整站视觉直接垮掉。
    所以把字体文件搬到自己服务器上，跟网页一起发出去。

它保留了 Google 原本的 unicode-range 分片机制：
    中文字体被切成一百多个小片，浏览器只下载页面里真正出现过的那几片。
    好处是——将来往 data.js 填任何生僻字都不会缺字，而访客并不会因此多下载。

什么时候需要重跑：
    1. 想新增字重（比如中文要用到 600 粗体）——改下面的 KEEP 再跑；
    2. 想换字体族——改 GOOGLE_FONTS_URL 再跑。
平时不用管它，assets/vendor/ 里的文件已经提交进仓库了。

用法（在项目根目录执行）：
    python3 scripts/fetch-fonts.py
"""

import re
import os
import sys
import urllib.request
import concurrent.futures as futures

# ── 配置 ───────────────────────────────────────────────────────────
# 向 Google 索要的字体清单（和原先 HTML 里那行 <link> 完全一致）
GOOGLE_FONTS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Cormorant+Garamond:wght@300;400;500;600"
    "&family=Noto+Serif+SC:wght@300;400;600"
    "&display=swap"
)

# 每个字体族实际要保留的字重。网站中文只用到 300（font-light）和 400（默认），
# 600 白白多出一百个分片、四五兆体积，所以不要。
KEEP = {
    "Cormorant Garamond": {"300", "400", "500", "600"},
    "Noto Serif SC":      {"300", "400"},
}

# Cormorant 里用不上的语种分片（网站只有中英文）
SKIP_SUBSETS = ("cyrillic", "vietnamese", "greek")

OUT_DIR  = "assets/vendor/fonts"
OUT_CSS  = "assets/vendor/fonts.css"

# 必须伪装成浏览器：Google 会按 User-Agent 决定给 woff2 还是老格式 ttf
BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def fetch(url):
    """下载一个 URL，返回字节内容。"""
    req = urllib.request.Request(url, headers={"User-Agent": BROWSER_UA})
    return urllib.request.urlopen(req, timeout=30).read()


def main():
    if not os.path.isdir("assets"):
        sys.exit("请在项目根目录执行：python3 scripts/fetch-fonts.py")

    os.makedirs(OUT_DIR, exist_ok=True)

    # 第一步：拿到 Google 生成的 CSS，里面是几百段 @font-face
    print("正在获取字体清单…")
    css = fetch(GOOGLE_FONTS_URL).decode("utf-8")

    # 第二步：逐段解析，挑出要保留的，记下"下载哪个文件、存成什么名字"
    # 每段前面通常有个 /* latin */ 这样的注释，标明这片是哪个语种
    blocks = re.findall(r"(/\*\s*([\w\[\]-]+)\s*\*/\s*)?@font-face\s*\{(.*?)\}", css, re.S)
    downloads = []   # [(远程地址, 本地路径)]
    faces = []       # [(字体族, 字重, 文件名, unicode-range)]
    seq = {}         # 给同一族同一字重的分片顺序编号

    for _comment, subset, body in blocks:
        family = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", body).group(1)

        if weight not in KEEP.get(family, set()):
            continue
        if family == "Cormorant Garamond" and subset and any(s in subset for s in SKIP_SUBSETS):
            continue

        url = re.search(r"url\((https://[^)]+\.woff2)\)", body).group(1)
        unicode_range = re.search(r"unicode-range:\s*([^;]+);", body)

        slug = family.lower().replace(" ", "-")
        key = (slug, weight)
        seq[key] = seq.get(key, 0) + 1
        filename = f"{slug}-{weight}-{seq[key]:03d}.woff2"

        downloads.append((url, os.path.join(OUT_DIR, filename)))
        faces.append((family, weight, filename,
                      unicode_range.group(1).strip() if unicode_range else None))

    print(f"需要下载 {len(downloads)} 个字体分片…")

    # 第三步：并发下载（已存在的跳过，方便断点续传）
    def download_one(job):
        url, path = job
        if os.path.exists(path) and os.path.getsize(path) > 0:
            return 0
        data = fetch(url)
        with open(path, "wb") as f:
            f.write(data)
        return len(data)

    total = 0
    with futures.ThreadPoolExecutor(max_workers=12) as pool:
        for size in pool.map(download_one, downloads):
            total += size
    print(f"下载完成，新增 {total / 1024 / 1024:.2f} MB")

    # 第四步：生成本地 CSS。和 Google 原版的唯一区别是 src 指向本地文件，
    # unicode-range 原样保留，所以浏览器按需加载的行为完全不变。
    lines = [
        "/* ── 本地字体 ────────────────────────────────────────────────",
        "   镜像自 Google Fonts。国内节点访问不到 fonts.googleapis.com，",
        "   所以把字体文件放在自己服务器上，跟网页一起发出去。",
        "",
        "   保留了 unicode-range 分片：中文字体被切成一百多片，",
        "   浏览器只下载页面里真正出现过的那几片（通常一共几十 KB）。",
        "",
        "   这个文件是 scripts/fetch-fonts.py 生成的，不要手改。",
        "   ──────────────────────────────────────────────────────── */",
        "",
    ]
    for family, weight, filename, unicode_range in faces:
        lines += [
            "@font-face {",
            f"  font-family: '{family}';",
            "  font-style: normal;",
            f"  font-weight: {weight};",
            "  font-display: swap;",
            f"  src: url(fonts/{filename}) format('woff2');",
        ]
        if unicode_range:
            lines.append(f"  unicode-range: {unicode_range};")
        lines += ["}", ""]

    with open(OUT_CSS, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"已生成 {OUT_CSS}（{len(faces)} 个 @font-face）")


if __name__ == "__main__":
    main()
