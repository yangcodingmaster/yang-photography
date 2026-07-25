<?php
/* ============================================================================
   站内留言 —— 后端（唯一的一个 PHP 文件）
   ============================================================================

   这个文件干四件事：
     1. 把访客写的留言存进一个 JSON 文件（待审核状态，网站上暂不显示）
     2. 存好之后，用 Resend 发一封通知邮件到你邮箱，邮件里有"通过 / 删除"两个链接
     3. 你点"通过"，这条留言才会在网站上出现
     4. 网站前端来要数据时，只把"已通过"的留言给它

   ⚠️ 数据和密钥都不在网站目录里，在 /www/guestbook-data/。
      原因：scripts/deploy.sh 用的是 rsync --delete，它会让服务器成为本地的
      镜子——服务器上有、本地没有的文件一律删掉。留言和 API key 恰恰就是
      "只在服务器上存在"的东西，放网站目录里的话，你下次更新几张照片就会
      被静悄悄地全部删光。放在网站目录外面，rsync 的镜子照不到，才安全。

   安装步骤见同目录的 README.md。
   ========================================================================= */

// 中国时区：留言时间显示成北京时间，而不是服务器默认的 UTC
date_default_timezone_set('Asia/Shanghai');


/* ── 数据目录：网站目录之外，见上面的说明 ─────────────────────────────
   换服务器时如果目录结构不同，只改这一行。
   （前面那个环境变量是留给本地测试的：服务器上没设，就走后面的默认值） */
$DATA_DIR = getenv('GUESTBOOK_DATA_DIR') ?: '/www/guestbook-data';

$CONFIG_FILE   = $DATA_DIR . '/config.php';      // 密钥和邮箱（不进 git，不进 rsync）
$MESSAGES_FILE = $DATA_DIR . '/messages.json';   // 所有留言（含待审核的）


/* ── 限制：防止有人贴一整篇小说，或者机器人刷屏 ───────────────────── */
$MAX_NAME  = 40;     // 名字最多几个字
$MAX_TEXT  = 1000;   // 留言正文最多几个字
$COOLDOWN  = 60;     // 同一个 IP 两次留言至少间隔几秒


// ─────────────────────────────────────────────────────────────────────
//  下面是实现，正常使用不需要改
// ─────────────────────────────────────────────────────────────────────

/** 回一段 JSON 给前端，然后结束 */
function reply_json($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    // 留言随时在变，不能让浏览器或 CDN 缓存
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** 回一个极简的确认页面（你点邮件里的链接后看到的那一页） */
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

/** 读出整个留言文件（文件还不存在时返回空列表） */
function load_messages($file) {
    if (!file_exists($file)) return array();
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') return array();
    $data = json_decode($raw, true);
    return is_array($data) ? $data : array();
}

/**
 * 安全地"读出来 → 改一改 → 写回去"。
 *
 * 为什么要加锁：如果两个人恰好同时留言，两个 PHP 进程会同时读到同一份旧数据，
 * 各自加上自己那条再写回去 —— 后写的覆盖先写的，先来的那条留言就凭空消失了。
 * flock 让第二个进程排队等第一个写完，谁也不会丢。
 *
 * $mutator 是一个函数：拿到当前列表，返回改好的新列表。
 */
function update_messages($file, $mutator) {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        reply_json(array('ok' => false, 'error' => '数据目录不存在：' . $dir), 500);
    }

    // 'c+' = 读写打开，不存在就创建，且不清空已有内容
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        reply_json(array('ok' => false, 'error' => '留言文件打不开，可能是目录权限不对'), 500);
    }

    flock($fp, LOCK_EX);                       // 排他锁：别的进程要等
    $raw  = stream_get_contents($fp);
    $list = ($raw === false || trim($raw) === '') ? array() : json_decode($raw, true);
    if (!is_array($list)) $list = array();

    $list = $mutator($list);                   // 交给调用方去改

    $json = json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    ftruncate($fp, 0);                         // 清空原内容
    rewind($fp);
    fwrite($fp, $json);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $list;
}

/**
 * 每条留言自己的审核口令。
 *
 * 用总口令 + 这条留言的 id 算出来，所以每条链接都不一样：
 * 万一某封邮件被转发出去了，泄漏的也只是那一条留言的处置权，
 * 不会连累整个后台。
 */
function message_token($id, $adminToken) {
    return substr(hash_hmac('sha256', $id, $adminToken), 0, 32);
}

/** 用 Resend 发一封通知邮件。发不出去也不影响留言已经存下来了 */
function send_notification($cfg, $msg, $selfUrl) {
    if (empty($cfg['RESEND_API_KEY']) || empty($cfg['ADMIN_EMAIL'])) return false;

    $token   = message_token($msg['id'], $cfg['ADMIN_TOKEN']);
    $approve = $selfUrl . '?action=approve&id=' . urlencode($msg['id']) . '&token=' . $token;
    $delete  = $selfUrl . '?action=delete&id='  . urlencode($msg['id']) . '&token=' . $token;

    $safeName = htmlspecialchars($msg['name'], ENT_QUOTES, 'UTF-8');
    $safeText = nl2br(htmlspecialchars($msg['text'], ENT_QUOTES, 'UTF-8'));

    $html =
        '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;line-height:1.7">'
      . '<p style="color:#8a8a85;font-size:13px;margin:0 0 16px">'
      . '有人在你的摄影网站留言了（来自 ' . htmlspecialchars($msg['page']) . ' 页）</p>'
      . '<p style="margin:0 0 4px"><strong>' . $safeName . '</strong> '
      . '<span style="color:#8a8a85;font-size:13px">' . htmlspecialchars($msg['time']) . '</span></p>'
      . '<blockquote style="margin:8px 0 24px;padding:12px 16px;background:#f2f2ef;'
      . 'border-left:2px solid #e0e0dc;color:#111">' . $safeText . '</blockquote>'
      . '<p style="margin:0 0 8px"><a href="' . $approve . '" '
      . 'style="display:inline-block;padding:10px 20px;background:#111;color:#fff;'
      . 'text-decoration:none;font-size:14px">通过，公开显示</a>&nbsp;&nbsp;'
      . '<a href="' . $delete . '" style="color:#8a8a85;font-size:14px">删除</a></p>'
      . '<p style="color:#8a8a85;font-size:12px;margin-top:24px">'
      . '不点任何链接的话，这条留言就一直待审核、不会出现在网站上。</p>'
      . '</div>';

    $payload = array(
        'from'    => $cfg['MAIL_FROM'],
        'to'      => array($cfg['ADMIN_EMAIL']),
        'subject' => '网站留言：' . mb_substr($msg['name'], 0, 20),
        'html'    => $html,
    );

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => array(
            'Authorization: Bearer ' . $cfg['RESEND_API_KEY'],
            'Content-Type: application/json',
        ),
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ));
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // 发信失败就记一笔到服务器日志，方便事后查（留言本身已经存好了，不受影响）
    if ($code < 200 || $code >= 300) {
        error_log('[guestbook] Resend 发信失败 HTTP ' . $code . ' : ' . $res);
        return false;
    }
    return true;
}


// ── 读配置 ────────────────────────────────────────────────────────────
$cfg = file_exists($CONFIG_FILE) ? include $CONFIG_FILE : array();
$cfg = is_array($cfg) ? $cfg : array();
$cfg += array('RESEND_API_KEY' => '', 'ADMIN_EMAIL' => '', 'ADMIN_TOKEN' => '', 'MAIL_FROM' => '');

// 这个文件自己的公开网址，拼审核链接要用
$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$selfUrl = $scheme . '://' . $_SERVER['HTTP_HOST'] . strtok($_SERVER['REQUEST_URI'], '?');

$action = isset($_GET['action']) ? $_GET['action'] : '';


// ── 动作一：把已通过的留言给前端 ──────────────────────────────────────
if ($action === 'list') {
    $all = load_messages($MESSAGES_FILE);
    $out = array();
    foreach ($all as $m) {
        if (!isset($m['status']) || $m['status'] !== 'approved') continue;
        // 只给前端看得见的字段；IP、User-Agent 这些留在服务器上，绝不外发
        $out[] = array(
            'name' => $m['name'],
            'text' => $m['text'],
            'time' => $m['time'],
        );
    }
    $out = array_reverse($out);                // 最新的排最前面
    reply_json(array('ok' => true, 'messages' => $out));
}


// ── 动作二：收下一条新留言 ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) $body = $_POST;

    // 蜜罐：这个字段在页面上是隐藏的，真人看不见也就不会填。
    // 填了的一定是自动灌水的机器人 —— 假装收下（不让它知道被识破），实际丢掉
    if (!empty($body['website'])) {
        reply_json(array('ok' => true, 'pending' => true));
    }

    $name = isset($body['name']) ? trim($body['name']) : '';
    $text = isset($body['text']) ? trim($body['text']) : '';
    $page = isset($body['page']) ? trim($body['page']) : '';

    if ($text === '') {
        reply_json(array('ok' => false, 'error' => '留言内容是空的'), 400);
    }
    if (mb_strlen($text) > $MAX_TEXT) {
        reply_json(array('ok' => false, 'error' => '留言太长了（最多 ' . $MAX_TEXT . ' 字）'), 400);
    }
    if ($name === '') $name = '无名';
    $name = mb_substr($name, 0, $MAX_NAME);
    $page = mb_substr(preg_replace('/[^a-zA-Z0-9._-]/', '', $page), 0, 30);

    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    $ua = isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr($_SERVER['HTTP_USER_AGENT'], 0, 200) : '';

    $newMsg = array(
        'id'     => bin2hex(random_bytes(6)),
        'name'   => $name,
        'text'   => $text,
        'page'   => $page,
        'time'   => date('Y.m.d H:i'),
        'ts'     => time(),
        'ip'     => $ip,          // 只留在服务器上，用来查垃圾留言，不外发
        'ua'     => $ua,
        'status' => 'pending',    // 待审核：网站上还看不到
    );

    // 冷却检查和写入放在同一把锁里做，两个人同时提交也不会互相穿插
    $tooSoon = false;
    update_messages($MESSAGES_FILE, function ($list) use ($newMsg, $ip, $COOLDOWN, &$tooSoon) {
        foreach ($list as $m) {
            if (!empty($ip) && isset($m['ip']) && $m['ip'] === $ip
                && isset($m['ts']) && (time() - $m['ts']) < $COOLDOWN) {
                $tooSoon = true;
                return $list;                  // 原样返回 = 什么也不写
            }
        }
        $list[] = $newMsg;
        return $list;
    });

    if ($tooSoon) {
        reply_json(array('ok' => false, 'error' => '刚刚才留过言，歇一会儿再来'), 429);
    }

    send_notification($cfg, $newMsg, $selfUrl);   // 发不出去也不影响留言已存下
    reply_json(array('ok' => true, 'pending' => true));
}


// ── 动作三 / 四：审核通过、删除（你点邮件里的链接会走到这里）──────────
if ($action === 'approve' || $action === 'delete') {

    $id    = isset($_GET['id'])    ? $_GET['id']    : '';
    $token = isset($_GET['token']) ? $_GET['token'] : '';

    if ($cfg['ADMIN_TOKEN'] === '') {
        reply_page('还没配置口令', '服务器上的 config.php 里 ADMIN_TOKEN 是空的。');
    }
    // hash_equals：逐字节比较且耗时固定，不会因为"前几位对了"而变慢，
    // 别人也就没法靠计时一位一位地猜口令
    if ($id === '' || !hash_equals(message_token($id, $cfg['ADMIN_TOKEN']), $token)) {
        reply_page('链接无效', '这个审核链接不对，或者已经过期了。');
    }

    $found = false;
    update_messages($MESSAGES_FILE, function ($list) use ($id, $action, &$found) {
        $out = array();
        foreach ($list as $m) {
            if (isset($m['id']) && $m['id'] === $id) {
                $found = true;
                if ($action === 'delete') continue;      // 删除 = 不放进新列表
                $m['status'] = 'approved';
            }
            $out[] = $m;
        }
        return $out;
    });

    if (!$found) {
        reply_page('没找到这条留言', '可能你已经处理过它了。');
    }
    if ($action === 'delete') {
        reply_page('已删除', '这条留言已经从服务器上抹掉了。');
    }
    reply_page('已通过', '这条留言现在会出现在网站上了。');
}


// ── 动作五：待审核列表（邮件没收到时的备用入口）────────────────────────
if ($action === 'review') {
    $token = isset($_GET['token']) ? $_GET['token'] : '';
    if ($cfg['ADMIN_TOKEN'] === '' || !hash_equals($cfg['ADMIN_TOKEN'], $token)) {
        reply_page('口令不对', '网址里的 token 要和 config.php 里的 ADMIN_TOKEN 一致。');
    }

    $all  = load_messages($MESSAGES_FILE);
    $rows = '';
    foreach (array_reverse($all) as $m) {
        if (!isset($m['status']) || $m['status'] !== 'pending') continue;
        $t = message_token($m['id'], $cfg['ADMIN_TOKEN']);
        $rows .= '<p style="text-align:left;max-width:520px;border-bottom:1px solid #e0e0dc;padding-bottom:16px">'
              . '<strong>' . htmlspecialchars($m['name']) . '</strong> '
              . '<span style="font-size:12px">' . htmlspecialchars($m['time']) . '</span><br>'
              . htmlspecialchars($m['text']) . '<br>'
              . '<a href="' . $selfUrl . '?action=approve&id=' . urlencode($m['id']) . '&token=' . $t . '">通过</a>'
              . ' &nbsp; '
              . '<a href="' . $selfUrl . '?action=delete&id=' . urlencode($m['id']) . '&token=' . $t . '">删除</a>'
              . '</p>';
    }
    reply_page('待审核留言', $rows !== '' ? $rows : '目前没有待审核的留言。');
}


// ── 动作六：体检（部署完跑一次，看看哪一环没配好）──────────────────────
if ($action === 'selftest') {
    $token = isset($_GET['token']) ? $_GET['token'] : '';
    if ($cfg['ADMIN_TOKEN'] === '' || !hash_equals($cfg['ADMIN_TOKEN'], $token)) {
        reply_page('口令不对', '网址里的 token 要和 config.php 里的 ADMIN_TOKEN 一致。');
    }
    $checks = array(
        'PHP 版本'          => PHP_VERSION,
        'curl 扩展（发邮件要用）' => function_exists('curl_init') ? '有' : '❌ 没有，装一下',
        'mbstring 扩展（数中文字数要用）' => function_exists('mb_strlen') ? '有' : '❌ 没有，装一下',
        '数据目录存在'        => is_dir($DATA_DIR) ? '是（' . $DATA_DIR . '）' : '❌ 否：' . $DATA_DIR,
        '数据目录可写'        => is_writable($DATA_DIR) ? '是' : '❌ 否，改成属主 www',
        '配置文件'           => file_exists($CONFIG_FILE) ? '有' : '❌ 没有：' . $CONFIG_FILE,
        'Resend API Key'   => $cfg['RESEND_API_KEY'] !== '' ? '已填' : '❌ 空的',
        '通知收件邮箱'        => $cfg['ADMIN_EMAIL'] !== '' ? $cfg['ADMIN_EMAIL'] : '❌ 空的',
        '发件地址'           => $cfg['MAIL_FROM'] !== '' ? $cfg['MAIL_FROM'] : '❌ 空的',
        '留言总数'           => count(load_messages($MESSAGES_FILE)),
    );
    $rows = '<table style="margin:0 auto;text-align:left;font-size:14px;border-spacing:12px 6px">';
    foreach ($checks as $k => $v) {
        $rows .= '<tr><td style="color:#8a8a85">' . htmlspecialchars($k) . '</td><td>'
              . htmlspecialchars((string)$v) . '</td></tr>';
    }
    $rows .= '</table>';
    reply_page('留言功能体检', $rows);
}


// 什么动作都没匹配上
reply_json(array('ok' => false, 'error' => '不认识的请求'), 400);
