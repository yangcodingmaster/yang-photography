#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 Markdown 手册转成 PDF（无头 Chrome 打印，零依赖）

为什么不用 pandoc：本机没装，而装 pandoc + xelatex 中文套件要几百 MB。
Chrome 本来就有（分享卡片脚本也在用它），排版还更可控——
用的是系统的苹方字体，和网站气质一致。

用法（在项目根目录）：
    python3 scripts/make-manual-pdf.py 网站维护手册.md

输出：同目录同名的 .pdf

只支持这份手册用到的 Markdown 语法：标题、段落、列表、表格、
代码块、行内代码、粗体、引用、分隔线、链接。够用就行，不做通用转换器。
"""

import html
import os
import re
import subprocess
import sys
import tempfile

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


# ── 行内标记：粗体、行内代码、链接 ──────────────────────────────
def inline(text):
    # 先转义 HTML 特殊字符，之后再插入我们自己的标签
    text = html.escape(text)
    # 行内代码 `xxx`（先处理，避免里面的星号被当成粗体）
    codes = []
    def stash_code(m):
        codes.append(m.group(1))
        return "\x00%d\x00" % (len(codes) - 1)
    text = re.sub(r'`([^`]+)`', stash_code, text)
    # 粗体 **xxx**
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    # 链接 [文字](地址)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    # 把行内代码放回来
    text = re.sub(r'\x00(\d+)\x00',
                  lambda m: '<code>%s</code>' % codes[int(m.group(1))], text)
    return text


# ── 表格：把 | a | b | 这样的若干行转成 <table> ──────────────────
def render_table(rows):
    # rows[1] 是 |---|---| 那条分隔线，跳过
    head = rows[0].strip().strip('|').split('|')
    body = [r.strip().strip('|').split('|') for r in rows[2:]]
    out = ['<table><thead><tr>']
    out += ['<th>%s</th>' % inline(c.strip()) for c in head]
    out.append('</tr></thead><tbody>')
    for r in body:
        out.append('<tr>' + ''.join('<td>%s</td>' % inline(c.strip()) for c in r) + '</tr>')
    out.append('</tbody></table>')
    return ''.join(out)


# ── 主转换：逐行扫描 Markdown，输出 HTML ────────────────────────
def md_to_html(md):
    lines = md.split('\n')
    out = []
    i = 0
    list_open = None          # 当前打开的列表类型：'ul' / 'ol' / None

    def close_list():
        nonlocal list_open
        if list_open:
            out.append('</%s>' % list_open)
            list_open = None

    while i < len(lines):
        line = lines[i]

        # 代码块 ```lang … ```
        if line.startswith('```'):
            close_list()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith('```'):
                buf.append(html.escape(lines[i]))
                i += 1
            i += 1
            out.append('<pre><code>%s</code></pre>' % '\n'.join(buf))
            continue

        # 表格：当前行像 | a | b |，下一行是 |---|
        if line.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s\-:|]+\|$', lines[i + 1]):
            close_list()
            block = []
            while i < len(lines) and lines[i].startswith('|'):
                block.append(lines[i])
                i += 1
            out.append(render_table(block))
            continue

        # 分隔线
        if re.match(r'^---+$', line.strip()):
            close_list()
            out.append('<hr/>')
            i += 1
            continue

        # 标题
        m = re.match(r'^(#{1,4})\s+(.*)$', line)
        if m:
            close_list()
            level = len(m.group(1))
            out.append('<h%d>%s</h%d>' % (level, inline(m.group(2)), level))
            i += 1
            continue

        # 引用
        if line.startswith('> '):
            close_list()
            buf = []
            while i < len(lines) and lines[i].startswith('>'):
                buf.append(lines[i].lstrip('>').strip())
                i += 1
            out.append('<blockquote>%s</blockquote>' % inline(' '.join(buf)))
            continue

        # 有序列表
        m = re.match(r'^(\d+)\.\s+(.*)$', line)
        if m:
            if list_open != 'ol':
                close_list()
                out.append('<ol>')
                list_open = 'ol'
            out.append('<li>%s</li>' % inline(m.group(2)))
            i += 1
            continue

        # 无序列表（支持一层缩进）
        m = re.match(r'^(\s*)-\s+(.*)$', line)
        if m:
            if list_open != 'ul':
                close_list()
                out.append('<ul>')
                list_open = 'ul'
            indent = ' class="sub"' if len(m.group(1)) >= 2 else ''
            out.append('<li%s>%s</li>' % (indent, inline(m.group(2))))
            i += 1
            continue

        # 空行 = 结束当前列表
        if not line.strip():
            close_list()
            i += 1
            continue

        # 普通段落
        close_list()
        out.append('<p>%s</p>' % inline(line))
        i += 1

    close_list()
    return '\n'.join(out)


# ── 页面样式：和网站同一套气质（暖白纸面、克制、无斜体）──────────
CSS = """
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body {
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 10.5pt; line-height: 1.75; color: #111; margin: 0;
  -webkit-font-smoothing: antialiased;
}
h1 {
  font-size: 20pt; font-weight: 600; letter-spacing: -0.01em;
  margin: 0 0 14pt; padding-bottom: 8pt; border-bottom: 2px solid #111;
  page-break-before: always; page-break-after: avoid;
}
h1:first-of-type { page-break-before: avoid; }
h2 {
  font-size: 14pt; font-weight: 600; margin: 20pt 0 8pt;
  padding-bottom: 4pt; border-bottom: 1px solid #ddd; page-break-after: avoid;
}
h3 { font-size: 11.5pt; font-weight: 600; margin: 14pt 0 6pt; page-break-after: avoid; }
h4 { font-size: 10.5pt; font-weight: 600; margin: 12pt 0 4pt; page-break-after: avoid; }
p { margin: 6pt 0; }
ul, ol { margin: 6pt 0; padding-left: 20pt; }
li { margin: 3pt 0; }
li.sub { list-style-type: circle; margin-left: 14pt; }
strong { font-weight: 600; }
a { color: #111; text-decoration: underline; }
code {
  font-family: "SF Mono", Menlo, monospace; font-size: 9pt;
  background: #f2f2ef; padding: 1pt 3pt; border-radius: 2px;
}
pre {
  background: #f7f7f4; border: 1px solid #e0e0dc; border-left: 3px solid #111;
  padding: 8pt 10pt; margin: 8pt 0; overflow-x: auto; page-break-inside: avoid;
}
pre code { background: none; padding: 0; font-size: 8.8pt; line-height: 1.55; }
blockquote {
  margin: 8pt 0; padding: 6pt 10pt; background: #faf9f5;
  border-left: 3px solid #8a8a85; color: #444; page-break-inside: avoid;
}
table {
  width: 100%; border-collapse: collapse; margin: 8pt 0;
  font-size: 9.5pt; page-break-inside: avoid;
}
th {
  background: #f2f2ef; text-align: left; font-weight: 600;
  padding: 5pt 7pt; border: 1px solid #ddd;
}
td { padding: 5pt 7pt; border: 1px solid #e5e5e2; vertical-align: top; }
hr { border: none; border-top: 1px solid #e0e0dc; margin: 14pt 0; }
"""


def main():
    if len(sys.argv) < 2:
        print("用法：python3 scripts/make-manual-pdf.py 文件.md")
        sys.exit(1)

    src = os.path.abspath(sys.argv[1])
    if not os.path.isfile(src):
        print("找不到文件：%s" % src)
        sys.exit(1)
    if not os.path.isfile(CHROME):
        print("找不到 Chrome：%s" % CHROME)
        sys.exit(1)

    out_pdf = os.path.splitext(src)[0] + '.pdf'
    with open(src, encoding='utf-8') as f:
        md = f.read()

    page = ('<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
            '<style>%s</style></head><body>%s</body></html>'
            % (CSS, md_to_html(md)))

    # 中转 HTML 放临时目录，不污染项目
    tmp_html = os.path.join(tempfile.gettempdir(), 'manual-print.html')
    with open(tmp_html, 'w', encoding='utf-8') as f:
        f.write(page)

    print('转换中：%s' % os.path.basename(src))
    subprocess.run([
        CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
        '--print-to-pdf=%s' % out_pdf, 'file://%s' % tmp_html,
    ], check=True, capture_output=True)

    size_kb = os.path.getsize(out_pdf) / 1024
    print('完成：%s（%.0f KB）' % (out_pdf, size_kb))


if __name__ == '__main__':
    main()
