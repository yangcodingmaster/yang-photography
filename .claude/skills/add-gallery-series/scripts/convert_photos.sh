#!/usr/bin/env bash
# ============================================================
# convert_photos.sh — 把一个"原始照片文件夹"转成网页用的系列文件夹
# ------------------------------------------------------------
# 用法:
#   convert_photos.sh "<源文件夹>" "<目标id>"
#
# 例:
#   convert_photos.sh "assets/images/gallery/Defocused UK" \
#                      "assets/images/gallery/defocused-uk"
#
# 它做三件每次都一样的事（所以固化成脚本，不必每次手写）:
#   1. 探测真实格式 —— 相机直出常把 HEIC/HIF 写成 .jpeg 扩展名，靠内容判断
#   2. 转 JPEG + 压缩 —— 长边 2560px / 质量 90（网页展示的固定标准，视觉无损）
#   3. 规范命名 —— 自然顺序排好，零填充成 01.jpeg / 02.jpeg ...
# 最后做一遍校验（全是合法 JPEG、长边不超标）。
#
# 它【不会】删除源文件夹 —— 删除留给你确认无误后手动执行，过程中绝不丢东西。
# 兼容 macOS 自带 bash 3.2（不用 mapfile）。
# ============================================================

set -euo pipefail

SRC="${1:?用法: convert_photos.sh <源文件夹> <目标id路径>}"
DST="${2:?用法: convert_photos.sh <源文件夹> <目标id路径>}"

# 固定压缩标准（和仓库历史、已上线系列保持一致；如需印刷级别另谈）
LONG_EDGE=2560
QUALITY=90

[ -d "$SRC" ] || { echo "✗ 源文件夹不存在: $SRC" >&2; exit 1; }

# 收集图片文件并自然排序（按文件名里的数字 1,2,...,10 而非 1,10,2）
# -iname 大小写不敏感，覆盖常见格式；自动跳过 .DS_Store 等非图片
# 用 while-read 而非 mapfile，兼容 bash 3.2；IFS= read -r 保留含空格/前导空格的文件名
files=()
while IFS= read -r line; do
  files+=("$line")
done < <(
  find "$SRC" -maxdepth 1 -type f \
    \( -iname '*.jpg'  -o -iname '*.jpeg' -o -iname '*.png'  \
       -o -iname '*.heic' -o -iname '*.heif' -o -iname '*.hif' \
       -o -iname '*.webp' -o -iname '*.tif'  -o -iname '*.tiff' \) \
    -print | sort -V
)

count=${#files[@]}
[ "$count" -gt 0 ] || { echo "✗ 源文件夹里没有找到图片: $SRC" >&2; exit 1; }

mkdir -p "$DST"

# 零填充位数：>=100 张用 3 位，否则 2 位
pad=2; [ "$count" -ge 100 ] && pad=3

echo "源:   $SRC"
echo "目标: $DST"
echo "找到 $count 张图片，转换中（长边 ${LONG_EDGE}px / 质量 ${QUALITY}）..."
echo

i=0
for src in "${files[@]}"; do
  i=$((i+1))
  out=$(printf "%s/%0${pad}d.jpeg" "$DST" "$i")
  if sips -s format jpeg -Z "$LONG_EDGE" -s formatOptions "$QUALITY" "$src" --out "$out" >/dev/null 2>&1; then
    dim=$(sips -g pixelWidth -g pixelHeight "$out" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}')
    sz=$(ls -la "$out" | awk '{printf "%.1fMB", $5/1048576}')
    printf "  %s  ←  %s   (%s, %s)\n" "$(basename "$out")" "$(basename "$src")" "$dim" "$sz"
  else
    echo "  ✗ 转换失败: $src" >&2
  fi
done

echo
# ── 校验：全是合法 JPEG 且长边 <= LONG_EDGE ──
bad=0
for f in "$DST"/*.jpeg; do
  ft=$(file -b "$f")
  case "$ft" in JPEG*) ;; *) echo "  ✗ 非JPEG: $f -> $ft"; bad=$((bad+1));; esac
  w=$(sips -g pixelWidth  "$f" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')
  long=$(( w > h ? w : h ))
  [ "$long" -gt "$LONG_EDGE" ] && { echo "  ✗ 超尺寸: $f ${w}x${h}"; bad=$((bad+1)); }
done

done_count=$(ls "$DST"/*.jpeg 2>/dev/null | wc -l | tr -d ' ')
echo "完成：输出 $done_count 张，校验问题 $bad 处。"
if [ "$bad" -eq 0 ]; then
  echo "源文件夹未删除 —— 确认无误后手动执行：  rm -rf \"$SRC\""
fi
