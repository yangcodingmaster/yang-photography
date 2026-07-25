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
  --exclude 'scripts' \
  --exclude '.gitignore' \
  --exclude '.DS_Store' \
  --exclude 'api/config.php' \
  ./ "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/"

echo
if [ -n "$DRY_RUN" ]; then
  echo "演习结束。确认清单没问题后，去掉 --dry-run 再跑一次即可真正部署。"
else
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
