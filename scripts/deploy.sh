#!/bin/bash
#
# 一键部署：把本地网站同步到腾讯云服务器
#
# 用法（在项目根目录跑）：
#     bash scripts/deploy.sh            # 正式同步
#     bash scripts/deploy.sh --dry-run  # 演习：只显示会传什么，不真的传
#
# 原理：rsync 会逐个对比本地和服务器上的文件，只传"变了的"那些。
#      所以第一次要传满 600MB，之后改几行文案就只传那几 KB，一两秒完事。
#

set -e  # 任何一步出错就立刻停下，不要带着错误继续跑

# ---------- 配置（换服务器/换域名时改这里）----------

SERVER_USER="root"                                # 服务器登录用户名
SERVER_IP="124.221.92.171"                        # 服务器公网 IP
REMOTE_DIR="/www/wwwroot/yangzhaophoto.com"       # 宝塔站点根目录（在宝塔"网站"页能看到）

# ---------- 演习模式判断 ----------

# 带了 --dry-run 参数就只演习，不真传（第一次用建议先演习一遍看看清单）
DRY_RUN=""
if [ "$1" = "--dry-run" ]; then
  DRY_RUN="--dry-run"
  echo "【演习模式】只列出将要同步的文件，不会真的上传"
  echo
fi

# ---------- 开始同步 ----------

echo "本地目录：$(pwd)"
echo "目标位置：${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}"
echo

rsync -avz --progress --delete $DRY_RUN \
  --exclude '.git' \
  --exclude '.claude' \
  --exclude 'CLAUDE.md' \
  --exclude '*维护手册.md' \
  --exclude '*维护手册.pdf' \
  --exclude 'scripts' \
  --exclude '.gitignore' \
  --exclude '.DS_Store' \
  --exclude 'api/config.php' \
  --exclude 'api/README.md' \
  --exclude 'api/config.sample.php' \
  ./ "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/"

echo
if [ -n "$DRY_RUN" ]; then
  echo "演习结束。确认清单没问题后，去掉 --dry-run 再跑一次即可真正部署。"
else
  # ---------- 把文件属主归位成 www ----------
  #
  # Nginx 和 PHP 是以 www 这个身份在跑的，网站文件理应属于 www。
  # 但 rsync 传过来的文件属主会是本机的用户编号（Mac 上是 501），
  # 服务器上根本没有这个用户，显示出来是 "501:games" 这种看不懂的东西。
  #
  # 正规做法是给 rsync 加 --chown=www:www，但那是 rsync 3.1 才有的参数，
  # 而 macOS 自带的 rsync 停留在 2.6.9（2006 年），没有这个参数。
  # 所以改成传完之后在服务器上补一刀 chown，效果一样。
  #
  # 现在文件权限是 644（谁都能读），就算属主不对网站也能正常访问；
  # 归位是为了防患：万一将来出现 640 权限的文件，属主不对 www 就读不到了，
  # 而且宝塔的备份、权限修复等功能都默认网站文件属于 www。
  echo "归位文件属主…"
  ssh "${SERVER_USER}@${SERVER_IP}" "chown -R www:www '${REMOTE_DIR}'"

  echo "部署完成。"
  echo "备案通过前用 IP 查看：http://${SERVER_IP}"
  echo "备案通过后用域名查看：https://yangzhaophoto.com"
fi

# ---------- 说明：--delete 是干什么的 ----------
#
# --delete 让服务器成为本地的"镜子"：本地删掉的照片，服务器上也会删掉。
# 这是想要的行为（否则删掉的旧照片会永远留在服务器上占空间）。
# 代价是：如果 REMOTE_DIR 填错，指向了别的目录，那个目录会被清空。
# 所以换服务器或换域名后第一次跑，请先用 --dry-run 确认一遍。
#
# ---------- 说明：留言表单的 API key 为什么不会被删掉 ----------
#
# Resend 的 API key 是"只在服务器上存在、本地永远没有"的东西，
# 正好是 --delete 要清理的对象。为此做了两层保险：
#
#   第一层（主要的）：key 根本不在网站目录里，在 /www/site-secrets/config.php。
#                    那个目录不在 REMOTE_DIR 底下，rsync 的镜子照不到。
#   第二层（兜底的）：上面那条 api/config.php 的 exclude。万一将来有人图省事
#                    把配置挪回 api/ 目录里，也不至于一部署就没了。
#
# 换句话说：正常情况下第二层是多余的，留着是为了不正常的情况。
#
# 留言本身不用管 —— 表单是收下就发邮件，服务器上不存任何东西。
#
# 另外两条 exclude（README.md 和 config.sample.php）是别的考虑：
# 它们不含密钥，进 git 没问题，但没必要放到公网上让人直接下载 ——
# README 里写着密钥存在哪、体检接口叫什么、有哪些防护措施。
# 服务器上只需要 message.php 这一个能执行的文件，文档留在仓库里就够了。
#
# ---------- 说明：两份维护手册为什么也排除 ----------
#
# 同一个理由。《画册维护手册》《网站维护手册》都是给作者自己看的运维文档，
# 写着服务器路径、SSH 加固备份位置、宝塔操作细节 —— 不含密钥，
# 但没必要挂在公网上让人翻。
# ⚠️ 2026-08-04 发现《画册维护手册.md》此前一直可被公网直接下载
# （http://IP/画册维护手册.md 返回 200）。已手动 ssh 删除服务器上那一份。
#
# 【这里有个反直觉的坑，值得记住】
# 加 exclude 并不会让服务器上已有的同名文件被 --delete 清掉 ——
# 恰恰相反：rsync 里被 exclude 的文件在接收端是**受保护**的，
# --delete 会绕开它们（这正是 api/config.php 那条兜底 exclude 能护住密钥的原理）。
# 所以「排除一个已经传上去的文件」要两步：加 exclude（挡住以后）
# + 手动上服务器删一次（清掉现在）：
#     ssh root@IP "rm -f '/www/wwwroot/yangzhaophoto.com/文件名'"
