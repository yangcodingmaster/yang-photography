#!/bin/bash
# ── 生成分享缩略图和网站图标 ────────────────────────────────────
#
# 做什么：
#   用无头浏览器把 scripts/share-card.html 这个"模具"拍成图片，
#   产出微信分享用的缩略图和浏览器标签页的小图标。
#   走浏览器而不是修图软件，是为了让分享图和网站用上同一套字体和颜色。
#
# 什么时候跑：
#   想换分享图里那张照片的时候。改下面的 PHOTO 一行，再跑一次即可。
#
# 用法（在项目根目录执行）：
#   bash scripts/make-share-card.sh
#
# 前提：本地预览服务开着（端口 4321）。没开的话脚本会自己起一个临时的。
# ────────────────────────────────────────────────────────────────

set -e

# ── 想换分享图里的照片，改这一行 ──────────────────────────────
PHOTO="assets/images/gallery/photos-of-2024/street-life/19.jpeg"
# 选图建议：优先高对比、构图简单的照片。分享缩略图在微信聊天列表里
# 只有百来像素，细节丰富的照片缩到那个尺寸会糊成一团。
# ────────────────────────────────────────────────────────────

PORT=4321
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ ! -d "assets" ]; then
  echo "请在项目根目录执行：bash scripts/make-share-card.sh"; exit 1
fi
if [ ! -x "$CHROME" ]; then
  echo "找不到 Chrome：$CHROME"; exit 1
fi

# 本地预览服务没开的话，临时起一个，用完关掉
STARTED_SERVER=0
if ! curl -s -m 2 -o /dev/null "http://localhost:$PORT/"; then
  echo "本地服务没开，临时起一个…"
  python3 -m http.server $PORT >/dev/null 2>&1 &
  SERVER_PID=$!
  STARTED_SERVER=1
  sleep 1.5
fi

TMP=$(mktemp -d)

echo "生成分享缩略图（1200×1200）…"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,1200 --screenshot="$TMP/card.png" --virtual-time-budget=4000 \
  "http://localhost:$PORT/scripts/share-card.html?photo=$PHOTO" >/dev/null 2>&1

echo "生成网站图标（512×512）…"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=512,512 --screenshot="$TMP/icon.png" --virtual-time-budget=4000 \
  "http://localhost:$PORT/scripts/share-card.html?layout=icon" >/dev/null 2>&1

echo "转成最终文件…"
python3 - "$TMP" <<'PY'
from PIL import Image
import sys, os
tmp = sys.argv[1]

os.makedirs("assets/images/share", exist_ok=True)

# 分享缩略图：微信只要求 ≥300×300，1200 见方足够各平台使用
card = Image.open(f"{tmp}/card.png").convert("RGB")
card.save("assets/images/share/share-card.jpg", "JPEG", quality=88, optimize=True)

# 网站图标：ico 内含多个尺寸让浏览器自己挑；png 给 iOS 加到主屏时用
icon = Image.open(f"{tmp}/icon.png").convert("RGB")
icon.resize((180, 180), Image.LANCZOS).save("apple-touch-icon.png", optimize=True)
icon.resize((64, 64), Image.LANCZOS).save("favicon.ico", sizes=[(16,16),(32,32),(48,48)])

for f in ("assets/images/share/share-card.jpg", "apple-touch-icon.png", "favicon.ico"):
    print(f"  {f}  {os.path.getsize(f)/1024:.0f} KB")
PY

rm -rf "$TMP"
if [ "$STARTED_SERVER" = "1" ]; then kill $SERVER_PID 2>/dev/null || true; fi

echo ""
echo "完成。缩略图换了之后，微信可能还缓存着旧图——"
echo "在分享的网址后面加个 ?v=2 就能强制它重新抓取。"
