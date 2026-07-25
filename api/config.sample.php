<?php
/* ============================================================================
   留言功能的配置模板
   ============================================================================

   ⚠️ 这个文件是"样板"，本身不含任何密钥，所以可以放心进 git。
      真正带密钥的那份要放到服务器上、网站目录之外：

          /www/guestbook-data/config.php

      千万别把填好密钥的版本放回项目文件夹里 —— 一是会被 git 记录下来，
      二是 deploy.sh 会把它同步到公网可访问的位置。

   怎么用：把这个文件的内容复制到服务器上的 /www/guestbook-data/config.php，
   把四个值填上。步骤见同目录的 README.md。
   ========================================================================= */

return array(

    // Resend 的 API key，在 resend.com 后台 → API Keys 里创建，形如 re_xxxxxxxx
    'RESEND_API_KEY' => '',

    // 收通知的邮箱：有人留言时，邮件发到这里
    'ADMIN_EMAIL'    => 'zcqshck@ucl.ac.uk',

    // 发件地址：域名必须已经在 Resend 后台验证过（DNS 加几条记录）。
    // 还没验证域名的话，先用 'onboarding@resend.dev' —— 那个只能发给
    // 你注册 Resend 时用的邮箱，够用来跑通流程
    'MAIL_FROM'      => 'Yang Photography <noreply@yangzhaophoto.com>',

    // 审核口令：随便一串长的随机字符，别人猜不到就行。
    // 生成一串：在服务器上跑 openssl rand -hex 24
    // 邮件里"通过 / 删除"链接的合法性就是靠它验证的
    'ADMIN_TOKEN'    => '',

);
