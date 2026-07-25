#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把分享卡片里的网站域名换成真的域名。

为什么需要这个脚本：
    分享卡片的两个字段——og:url 和 og:image——必须写完整网址
    （带 https:// 和域名）。微信服务器是拿着这个网址去下载缩略图的，
    写成相对路径它找不到。而域名要等备案下来才能定，所以先在页面里
    留了占位域名，等域名可用了跑一次这个脚本替换掉。

用法（在项目根目录执行）：
    python3 scripts/set-domain.py www.你的域名.com

    带不带 https:// 都行，带不带 www 也随你，脚本按你写的原样用。
    可以反复跑：它认的是标签本身，不是旧域名叫什么。

跑完记得刷新一下微信的缓存——见 CLAUDE.md 的"分享卡片"一节。
"""

import io
import os
import re
import sys

PAGES = ["index.html", "gallery.html", "series.html", "archive.html", "about.html", "film.html"]

# 占位域名。页面里最初写的就是它，换过一次之后这个值就没用了，
# 所以脚本靠正则去认 og:url / og:image 标签，而不是去找这个字符串。
PLACEHOLDER = "https://www.example.com"


def normalize(domain):
    """把用户输入的域名整理成 https://xxx 的形式，去掉结尾多余的斜杠。"""
    domain = domain.strip().rstrip("/")
    if not domain.startswith(("http://", "https://")):
        domain = "https://" + domain
    return domain


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    if not os.path.isdir("assets"):
        sys.exit("请在项目根目录执行：python3 scripts/set-domain.py 你的域名")

    base = normalize(sys.argv[1])
    print(f"新域名：{base}\n")

    # 认这两个标签的 content，把里面的"协议+域名"部分换掉，路径原样保留。
    # 例如 https://旧域名/assets/images/share/share-card.jpg
    #  →   https://新域名/assets/images/share/share-card.jpg
    pattern = re.compile(
        r'(<meta\s+property="og:(?:url|image)"\s+content=")https?://[^/"]+([^"]*)(")'
    )

    total = 0
    for page in PAGES:
        if not os.path.exists(page):
            print(f"跳过 {page}（文件不存在）")
            continue

        text = io.open(page, encoding="utf-8").read()
        new_text, count = pattern.subn(rf"\g<1>{base}\g<2>\g<3>", text)

        if count == 0:
            print(f"⚠️  {page}：没找到 og:url / og:image 标签")
            continue

        io.open(page, "w", encoding="utf-8").write(new_text)
        print(f"✅ {page}：替换 {count} 处")
        total += count

    print(f"\n共替换 {total} 处。")
    if total:
        print("接下来：把文件传到服务器，然后在微信里发给「文件传输助手」验证卡片。")
        print("如果卡片还是旧的，在网址后面加个 ?v=2 强制微信重新抓取。")


if __name__ == "__main__":
    main()
