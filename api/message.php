<?php
/* ============================================================================
   留言表单 —— 后端（唯一的一个 PHP 文件）
   ============================================================================

   它只干一件事：收下访客填的表单，用 Resend 发一封邮件到作者邮箱。
   不存数据库、不写文件、网站上也不显示任何留言。寄出即结束。

   ⚠️ 为什么必须有这个 PHP，不能让网页直接调 Resend？
      因为 API key 一旦写进前端 JS，任何人打开网页源码都能看到，
      拿着它就能用你的域名发垃圾邮件。key 必须待在服务器上，
      访客的浏览器只跟这个文件说话，永远碰不到 key。

   ⚠️ key 放在网站目录之外（/www/site-secrets/config.php），有两个原因：
      1. 公网访问不到那个位置，扒不走；
      2. scripts/deploy.sh 用的是 rsync --delete，网站目录里"只在服务器上
         存在"的文件会被静默删掉。放外面就不归它管。

   安装步骤见同目录的 README.md。
   ========================================================================= */

date_default_timezone_set('Asia/Shanghai');   // 邮件里的时间显示成北京时间


/* ── 配置文件位置（网站目录之外，见上面的说明）───────────────────────
   前面那个环境变量是留给本地测试的：服务器上没设，就走后面的默认值 */
$CONFIG_FILE = getenv('MESSAGE_CONFIG') ?: '/www/site-secrets/config.php';


/* ── 限制 ──────────────────────────────────────────────────────────── */
$MAX_NAME  = 40;     // 名字最多几个字
$MAX_TEXT  = 2000;   // 留言正文最多几个字
$COOLDOWN  = 60;     // 同一个 IP 两次留言至少间隔几秒


// ─────────────────────────────────────────────────────────────────────
//  下面是实现，正常使用不需要改
// ─────────────────────────────────────────────────────────────────────

/** 回一段 JSON 给前端，然后结束 */
function reply_json($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** 回一个极简的页面（体检结果用） */
function reply_page($title, $note) {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>' . htmlspecialchars($title) . '</title>'
       . '<style>body{background:#fafaf7;color:#111;font-family:Georgia,serif;'
       . 'display:flex;flex-direction:column;align-items:center;justify-content:center;'
       . 'height:100vh;margin:0;text-align:center;padding:0 24px}'
       . 'h1{font-weight:400;font-size:28px;margin:0 0 12px}'
       . 'p{color:#8a8a85;font-size:14px;margin:0;line-height:1.8}</style></head><body>'
       . '<h1>' . htmlspecialchars($title) . '</h1>'
       . '<p>' . $note . '</p></body></html>';
    exit;
}

/**
 * 同一个 IP 是不是刚刚才发过。
 *
 * 用系统临时目录里的一个空文件当"上次发送时间"的记号 —— 靠文件的修改时间来记，
 * 不需要数据库，也不需要你在服务器上配任何东西。
 * 这个记号丢了也无所谓（重启清空了，最多让人多发一条），所以放临时目录正合适。
 */
function too_soon($ip, $cooldown) {
    if ($ip === '') return false;
    $stamp = sys_get_temp_dir() . '/msgform-' . md5($ip);
    if (file_exists($stamp) && (time() - filemtime($stamp)) < $cooldown) {
        return true;
    }
    @touch($stamp);
    return false;
}

/**
 * 用 Resend 把这条留言发到作者邮箱。
 *
 * 返回 true 表示确实发出去了。这里的成败很关键 —— 因为我们不存任何东西，
 * 发送失败就意味着这条留言彻底丢了，必须如实告诉访客，不能假装成功。
 */
function send_mail($cfg, $m) {
    $safeName = htmlspecialchars($m['name'],  ENT_QUOTES, 'UTF-8');
    $safeText = nl2br(htmlspecialchars($m['text'], ENT_QUOTES, 'UTF-8'));
    $safeMail = htmlspecialchars($m['email'], ENT_QUOTES, 'UTF-8');

    // 留了邮箱就在正文里带上，方便你一眼看到能不能回
    $contact = $m['email'] !== ''
        ? '<p style="color:#8a8a85;font-size:13px;margin:0 0 16px">回信地址：' . $safeMail . '</p>'
        : '<p style="color:#8a8a85;font-size:13px;margin:0 0 16px">对方没有留邮箱，回不了。</p>';

    $from = $m['page'] !== '' ? '（从 ' . htmlspecialchars($m['page']) . ' 页写的）' : '';

    $html =
        '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;line-height:1.7">'
      . '<p style="margin:0 0 4px"><strong>' . $safeName . '</strong> '
      . '<span style="color:#8a8a85;font-size:13px">' . htmlspecialchars($m['time'])
      . ' ' . $from . '</span></p>'
      . $contact
      . '<blockquote style="margin:0;padding:12px 16px;background:#f2f2ef;'
      . 'border-left:2px solid #e0e0dc;color:#111">' . $safeText . '</blockquote>'
      . '</div>';

    $payload = array(
        'from'    => $cfg['MAIL_FROM'],
        'to'      => array($cfg['ADMIN_EMAIL']),
        'subject' => '网站留言：' . mb_substr($m['name'], 0, 20),
        'html'    => $html,
    );

    // 对方留了邮箱就设成回信地址：你在邮件客户端里直接点"回复"就是回给对方，
    // 不用手动复制粘贴地址
    if ($m['email'] !== '') {
        $payload['reply_to'] = $m['email'];
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => array(
            'Authorization: Bearer ' . $cfg['RESEND_API_KEY'],
            'Content-Type: application/json',
        ),
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ));
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code < 200 || $code >= 300) {
        // 记进服务器日志，事后能查到底为什么被拒（多半是发件域名没验证）
        error_log('[message] Resend 发信失败 HTTP ' . $code . ' : ' . $res);
        return false;
    }
    return true;
}


// ── 读配置 ────────────────────────────────────────────────────────────
$cfg = file_exists($CONFIG_FILE) ? include $CONFIG_FILE : array();
$cfg = is_array($cfg) ? $cfg : array();
$cfg += array('RESEND_API_KEY' => '', 'ADMIN_EMAIL' => '', 'MAIL_FROM' => '', 'ADMIN_TOKEN' => '');

$action = isset($_GET['action']) ? $_GET['action'] : '';


// ── 体检：部署完跑一次，看看哪一环没配好 ──────────────────────────────
if ($action === 'selftest') {
    $token = isset($_GET['token']) ? $_GET['token'] : '';
    // hash_equals：逐字节比较且耗时固定，别人没法靠计时一位一位地猜口令
    if ($cfg['ADMIN_TOKEN'] === '' || !hash_equals($cfg['ADMIN_TOKEN'], $token)) {
        reply_page('口令不对', '网址里的 token 要和 config.php 里的 ADMIN_TOKEN 一致。');
    }
    $checks = array(
        'PHP 版本'                       => PHP_VERSION,
        'curl 扩展（发邮件要用）'          => function_exists('curl_init') ? '有' : '❌ 没有，装一下',
        'mbstring 扩展（数中文字数要用）'   => function_exists('mb_strlen') ? '有' : '❌ 没有，装一下',
        '配置文件'                        => file_exists($CONFIG_FILE) ? '读到了' : '❌ 找不到：' . $CONFIG_FILE,
        'Resend API Key'                => $cfg['RESEND_API_KEY'] !== '' ? '已填' : '❌ 空的',
        '通知收件邮箱'                     => $cfg['ADMIN_EMAIL'] !== '' ? $cfg['ADMIN_EMAIL'] : '❌ 空的',
        '发件地址'                        => $cfg['MAIL_FROM'] !== '' ? $cfg['MAIL_FROM'] : '❌ 空的',
        '临时目录可写（防刷用）'            => is_writable(sys_get_temp_dir()) ? '可以' : '❌ 不行（不致命，只是防刷失效）',
    );
    $rows = '<table style="margin:0 auto;text-align:left;font-size:14px;border-spacing:12px 6px">';
    foreach ($checks as $k => $v) {
        $rows .= '<tr><td style="color:#8a8a85">' . htmlspecialchars($k) . '</td><td>'
              . htmlspecialchars((string)$v) . '</td></tr>';
    }
    $rows .= '</table>';
    reply_page('留言表单体检', $rows);
}


// ── 收下一条留言并寄出 ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) $body = $_POST;

    // 蜜罐：这个字段在页面上是隐藏的，真人看不见也就不会填。
    // 填了的一定是自动灌水的机器人 —— 假装收下（不让它知道被识破），实际什么也不做
    if (!empty($body['website'])) {
        reply_json(array('ok' => true));
    }

    // 先确认是字符串再处理：这是个公开接口，谁都能往里发东西。
    // 机器人如果发的是 {"name": {...}} 这种，trim() 拿到数组会直接抛错、接口 500
    $str = function ($v) { return is_string($v) ? trim($v) : ''; };

    $name  = $str(isset($body['name'])  ? $body['name']  : '');
    $text  = $str(isset($body['text'])  ? $body['text']  : '');
    $email = $str(isset($body['email']) ? $body['email'] : '');
    $page  = $str(isset($body['page'])  ? $body['page']  : '');

    if ($text === '') {
        reply_json(array('ok' => false, 'error' => '留言内容是空的'), 400);
    }
    if (mb_strlen($text) > $MAX_TEXT) {
        reply_json(array('ok' => false, 'error' => '留言太长了（最多 ' . $MAX_TEXT . ' 字）'), 400);
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        reply_json(array('ok' => false, 'error' => '邮箱格式不太对'), 400);
    }
    if ($name === '') $name = '无名';
    $name = mb_substr($name, 0, $MAX_NAME);
    // 来源页只可能是 index / gallery / archive / film 这几个词，
    // 剔掉其它字符，免得有人往邮件标题里塞东西
    $page = mb_substr(preg_replace('/[^a-zA-Z0-9._-]/', '', $page), 0, 30);

    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    if (too_soon($ip, $COOLDOWN)) {
        reply_json(array('ok' => false, 'error' => '刚刚才寄过一封，歇一会儿再来'), 429);
    }

    if ($cfg['RESEND_API_KEY'] === '' || $cfg['ADMIN_EMAIL'] === '' || $cfg['MAIL_FROM'] === '') {
        error_log('[message] 配置不全，无法发信。检查 ' . $CONFIG_FILE);
        reply_json(array('ok' => false, 'error' => '邮件服务还没配好'), 500);
    }

    $sent = send_mail($cfg, array(
        'name'  => $name,
        'text'  => $text,
        'email' => $email,
        'page'  => $page,
        'time'  => date('Y.m.d H:i'),
    ));

    // 这里不能假装成功：什么都没存，发不出去就是彻底丢了，必须让访客知道
    if (!$sent) {
        reply_json(array('ok' => false, 'error' => '没能寄出去'), 502);
    }
    reply_json(array('ok' => true));
}


// 什么动作都没匹配上
reply_json(array('ok' => false, 'error' => '不认识的请求'), 400);
