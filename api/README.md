# 站内留言 —— 安装说明

这一份是给你自己看的操作手册。全程在宝塔面板里点，大约 15 分钟。

留言的运作方式：访客写 → 存进服务器 → **邮件通知你** → 你点邮件里的「通过」→
它才出现在网站上。不点就永远不出现。

---

## 零、先搞清楚东西放在哪

| 东西 | 位置 | 会不会进 git / 被部署覆盖 |
|---|---|---|
| `guestbook.php`（代码） | `/www/wwwroot/yangzhaophoto.com/api/` | 进 git，每次部署覆盖（正是想要的） |
| `guestbook.js`（前端） | 网站根目录 | 进 git，每次部署覆盖 |
| `config.php`（**密钥**） | `/www/guestbook-data/` | ❌ 不进 git，不被部署碰 |
| `messages.json`（**留言**） | `/www/guestbook-data/` | ❌ 不进 git，不被部署碰 |

> **为什么密钥和留言要放在网站目录外面？**
> `scripts/deploy.sh` 用的是 `rsync --delete`，它让服务器变成本地的镜子 ——
> 服务器上有、本地没有的文件一律删掉。留言和 API key 恰好就是"只在服务器上
> 存在"的东西。放网站目录里的话，你下次更新几张照片跑一次部署，它们会被
> 静悄悄地全部删光，而且没有任何提示。
>
> 顺带一个好处：`/www/guestbook-data/` 不在网站根目录下，公网根本访问不到，
> 别人没法直接下载你的 API key。

---

## 一、确认这个站点能跑 PHP

宝塔 → **网站** → 找到 `yangzhaophoto.com` → 点 **设置** → 看 **PHP 版本** 那一栏。

- 如果显示「纯静态」→ 改成 **PHP-80**（或列表里有的任意 8.x / 7.4）。
  纯静态的话，`.php` 文件会被当成文本原样吐给浏览器，等于源码全公开。
- 没有任何 PHP 版本可选 → 宝塔 → **软件商店** → 搜 `PHP` → 装一个 8.0，再回来选。

## 二、⚠️ 关掉「防跨站攻击」（这一步不做，后面一定失败）

还是在这个站点的 **设置** 里，找到 **网站目录** 这一页，有一个
**防跨站攻击 (open_basedir)** 的开关 —— **把它关掉**。

它的作用是把 PHP 能读写的范围锁死在网站目录里。而我们的留言数据故意放在
网站目录*外面*（第零节解释了原因），开着它 PHP 就永远读不到，体检会报
"数据目录不存在"。

## 三、建数据目录

宝塔 → **文件** → 进到 `/www/` → **新建目录**，名字 `guestbook-data`。

建好后，右键这个目录 → **权限** → 把 **所有者** 改成 `www`（组也是 `www`），
权限 `755`。不改的话 PHP 没权限往里写，留言存不进去。

## 四、生成审核口令

宝塔 → **终端**，粘贴这一行回车：

```bash
openssl rand -hex 24
```

会吐出一串 48 位的字符，复制下来，下一步要用。这就是 `ADMIN_TOKEN` ——
邮件里「通过 / 删除」链接的合法性靠它验证，所以别外传。

## 五、拿 Resend 的 API key

1. 登录 [resend.com](https://resend.com) → **API Keys** → **Create API Key**
   → 权限选 `Sending access` → 复制那串 `re_xxxxxxxx`（**只显示这一次**）
2. 发件域名二选一：
   - **先跑通流程**：`MAIL_FROM` 填 `onboarding@resend.dev`。
     限制是只能发到你注册 Resend 用的那个邮箱，但测试足够了。
   - **正式用**：Resend → **Domains** → 添加 `yangzhaophoto.com` → 按它给的
     几条 DNS 记录去域名商后台加上 → 等验证变绿 → 然后
     `MAIL_FROM` 填 `Yang Photography <noreply@yangzhaophoto.com>`

## 六、写配置文件

宝塔 → **文件** → 进 `/www/guestbook-data/` → **新建文件**，名字 `config.php`。
双击打开，把项目里 `api/config.sample.php` 的内容整个粘进去，填上四个值：

```php
'RESEND_API_KEY' => 're_你刚复制的那串',
'ADMIN_EMAIL'    => 'zcqshck@ucl.ac.uk',
'MAIL_FROM'      => 'onboarding@resend.dev',
'ADMIN_TOKEN'    => '第四步生成的那串',
```

保存。**这个文件永远不要复制回项目文件夹**，那样等于把密钥推上 GitHub。

## 七、部署

本地项目目录里跑：

```bash
bash scripts/deploy.sh --dry-run
```

看一眼清单里有 `api/guestbook.php` 和 `guestbook.js`，没问题再跑正式的：

```bash
bash scripts/deploy.sh
```

## 八、体检

浏览器打开（把 `你的口令` 换成第四步那串）：

```
https://yangzhaophoto.com/api/guestbook.php?action=selftest&token=你的口令
```

九项全绿就没问题。常见的红：

| 报错 | 原因 | 怎么修 |
|---|---|---|
| 页面显示的是 PHP 源代码 | 站点是「纯静态」 | 回第一步选 PHP 版本 |
| 数据目录存在 ❌ | 防跨站攻击没关 | 回第二步 |
| 数据目录可写 ❌ | 目录属主不是 `www` | 回第三步改权限 |
| curl 扩展 ❌ | PHP 没装 curl | 宝塔 → 软件商店 → PHP → 设置 → 安装扩展 → curl |

## 九、走一遍真实流程

1. 打开 `https://yangzhaophoto.com/gallery.html`，滚到底，点 **Leave a message 留言**
2. 随便写一句，点 **Send 寄出** → 应该显示"收到了，作者看过之后会出现在下面"
3. 查邮箱 → 应该收到一封带留言内容和两个按钮的邮件
4. 点 **通过，公开显示** → 出现"已通过"页面
5. 回网站刷新，再打开留言浮层 → 那条留言应该出现在下面了

第 3 步没收到邮件：先看垃圾箱；还没有就说明 Resend 那边被拒了，
去 Resend 后台 **Logs** 看具体原因（多半是 `MAIL_FROM` 的域名没验证）。
**注意：邮件发不出去不影响留言已经存下来了**，可以用备用入口处理：

```
https://yangzhaophoto.com/api/guestbook.php?action=review&token=你的口令
```

这个页面列出所有待审核的留言，一样能通过和删除。

---

## 日常使用

- **有人留言** → 你收到邮件 → 点「通过」或「删除」，完事
- **想看还有哪些没处理** → 上面那个 `action=review` 链接（存成手机书签）
- **想手动改留言** → 宝塔文件管理器打开 `/www/guestbook-data/messages.json`，
  它就是一个纯文本文件，肉眼能读、能改。改之前先复制一份备份
- **想删掉某条已公开的留言** → 同上，在 json 里删掉那一段

## 内置的防护

| 手段 | 挡什么 |
|---|---|
| 先审后发 | 垃圾留言永远到不了网站上，最多骚扰你的邮箱 |
| 蜜罐字段 | 页面上有个藏起来的输入框，真人看不见；填了的直接丢弃 |
| 同 IP 60 秒冷却 | 挡住刷屏 |
| 正文限 1000 字 / 名字限 40 字 | 挡住贴一整篇小说 |
| 前端一律用 `textContent` 渲染 | 别人写的 `<script>` 只会当文字显示，不会被执行 |
| 审核链接每条一个签名 | 某封邮件被转发出去，泄漏的也只是那一条的处置权 |

## 备份

留言全在一个文件里，备份就是复制它：

```bash
cp /www/guestbook-data/messages.json /www/guestbook-data/messages.backup.json
```

留言多了以后可以在宝塔 → **计划任务** 里加一条每周自动备份。
