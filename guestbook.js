/* ============================================================================
   站内留言 —— 前端（四个页面共用这一个文件）
   ============================================================================

   页面那边只要两行：

       <div id="guestbook-slot" data-style="footer"></div>
       <script src="guestbook.js"></script>

   data-style 有两种：
       footer —— 按钮居中放在页面底部（Gallery / Archive / Film 用这个）
       float  —— 按钮浮在右下角（首页用这个：首页是全屏轮播、不滚动，没有"底部"）

   点按钮打开一个整屏浮层，和 series / archive / film 的阅读视图同一套做法：
   fixed inset-0 的纸面底 + 右上角「→ Way out」+ Esc 退出。

   留言是"先审后发"：写完立刻能提交，但要等作者在邮件里点通过才会出现在列表里。
   ========================================================================= */

(function () {

  var API = 'api/guestbook.php';   // 后端地址（相对路径，与全站一致）

  // 这条留言是从哪一页写的：存进后台方便你知道访客当时在看什么
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');

  var slot = document.getElementById('guestbook-slot');
  if (!slot) return;               // 页面没放位置就什么也不做


  // ── 自带的一点样式 ──────────────────────────────────────────────────
  // 按压态（按下缩一点）本来只写在 archive.html 里，但留言按钮四个页面都要用。
  // 与其往三个 HTML 各抄一遍，不如让这个组件自己带着走 —— 改一处，四页同步。
  var css = document.createElement('style');
  css.textContent =
    '#guestbook-slot .pressable, #gb-close, #gb-submit { transition: transform 0.1s ease-out; }' +
    '#guestbook-slot .pressable:active, #gb-close:active, #gb-submit:active {' +
      'transform: scale(0.97); transition: none; }' +
    /* 系统开了"减弱动态效果"：不做缩放 */
    '@media (prefers-reduced-motion: reduce) {' +
      '#guestbook-slot .pressable:active, #gb-close:active, #gb-submit:active {' +
        'transform: none; } }';
  document.head.appendChild(css);

  var overlay = null;              // 浮层的 DOM
  var listLoaded = false;          // 留言列表是否已经取过（避免每次打开都重新请求）


  // ── 入口按钮 ────────────────────────────────────────────────────────

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML =
    '<span class="font-display tracking-widest">Leave a message</span>' +
    '<span class="font-zh ml-3 text-site-muted">留言</span>';

  if (slot.dataset.style === 'float') {
    // 首页：浮在右下角。底衬用纸面色，压在照片上也读得清
    btn.className = 'pressable fixed bottom-6 right-6 z-40 bg-site-bg border border-site-border ' +
                    'px-4 py-2 text-xs text-site-text hover:text-site-muted transition-colors';
  } else {
    // 其余页面：居中一枚素框按钮，放在内容底部
    btn.className = 'pressable mx-auto block border border-site-border px-6 py-3 ' +
                    'text-sm text-site-text hover:text-site-muted transition-colors';
  }
  btn.addEventListener('click', open);
  slot.appendChild(btn);

  buildOverlay();   // 现在就把浮层建好藏着，理由见下面 buildOverlay 上方的注释


  // ── 浮层 ─────────────────────────────────────────────────────────────
  //
  // 注意：浮层是在页面一打开时就建好的（藏着不显示），而不是等点击时才建。
  // 原因是 Tailwind 的运行时版本靠观察 DOM 变化来现生成样式，中间有大约一帧
  // 的延迟 —— 如果等点击那一刻才创建，用户会看见半帧没有样式的裸文字。
  // 提前建好、藏着，Tailwind 早就处理完了，点开就是成品。

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] bg-site-bg overflow-y-auto';
    overlay.style.display = 'none';

    overlay.innerHTML =
      // 出口（右上角）：与 archive / film / series 的阅读视图完全一致
      '<button id="gb-close" class="pressable fixed top-6 right-8 text-xs text-site-muted ' +
        'hover:text-site-text transition-colors tracking-widest z-10">→ Way out</button>' +

      '<div class="max-w-2xl mx-auto px-6 pt-24 pb-24">' +

        // 标题区：与 Gallery / Archive / Film 的页头同构
        '<h2>' +
          '<span class="block font-display text-4xl tracking-tight">Guestbook</span>' +
          '<span class="block font-zh text-sm text-site-muted mt-2">留言</span>' +
        '</h2>' +
        '<div class="mt-8 h-px w-20 bg-site-border"></div>' +

        // 写留言
        '<form id="gb-form" class="mt-12">' +
          '<input id="gb-name" type="text" maxlength="40" placeholder="你的名字（可不填）" ' +
            'class="font-zh w-full bg-transparent border-b border-site-border py-2 text-base ' +
            'placeholder:text-site-muted focus:outline-none focus:border-site-text transition-colors" />' +

          '<textarea id="gb-text" rows="4" maxlength="1000" placeholder="想说的话…" ' +
            'class="font-zh w-full bg-transparent border-b border-site-border py-2 mt-6 text-base ' +
            'leading-loose resize-none placeholder:text-site-muted focus:outline-none ' +
            'focus:border-site-text transition-colors"></textarea>' +

          // 蜜罐：藏起来的输入框。真人看不见也就不会填，填了的一定是机器人。
          // 用 position:absolute 挪出屏幕而不是 display:none —— 有些机器人会跳过隐藏字段
          '<input id="gb-website" type="text" tabindex="-1" autocomplete="off" ' +
            'style="position:absolute;left:-9999px;width:1px;height:1px" aria-hidden="true" />' +

          '<div class="mt-6 flex items-center justify-between">' +
            '<span id="gb-hint" class="font-zh text-xs text-site-muted"></span>' +
            '<button id="gb-submit" type="submit" class="pressable border border-site-border ' +
              'px-6 py-2 text-sm hover:text-site-muted transition-colors">' +
              '<span class="font-display tracking-widest">Send</span>' +
              '<span class="font-zh ml-2">寄出</span>' +
            '</button>' +
          '</div>' +
        '</form>' +

        // 已通过的留言
        '<div class="mt-20 h-px w-20 bg-site-border"></div>' +
        '<div id="gb-list" class="mt-10"></div>' +

      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('#gb-close').addEventListener('click', close);
    overlay.querySelector('#gb-form').addEventListener('submit', submit);
  }


  // ── 打开 / 关闭 ──────────────────────────────────────────────────────

  function open() {
    overlay.style.display = 'block';
    // 浮层自己滚动，锁住背后的页面，免得两层一起动
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    if (!listLoaded) loadList();
  }

  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  // Esc 退出，与全站阅读视图一致
  function onKey(e) {
    if (e.key === 'Escape') close();
  }


  // ── 取回已通过的留言并铺出来 ─────────────────────────────────────────

  function loadList() {
    var box = overlay.querySelector('#gb-list');
    box.textContent = '';

    fetch(API + '?action=list')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        listLoaded = true;
        if (!data.ok || !data.messages || !data.messages.length) {
          box.innerHTML = '<p class="font-zh text-sm text-site-muted">还没有留言。</p>';
          return;
        }
        data.messages.forEach(function (m) { box.appendChild(makeItem(m)); });
      })
      .catch(function () {
        // 打不到后端：本地用 file:// 直接打开，或者服务器没开 PHP，都会走到这里
        box.innerHTML = '<p class="font-zh text-sm text-site-muted">' +
                        '留言需要在服务器上才能读取。</p>';
      });
  }

  /** 一条留言：名字 + 时间 + 正文 */
  function makeItem(m) {
    var wrap = document.createElement('div');
    wrap.className = 'mb-10';

    var head = document.createElement('div');
    head.className = 'flex items-baseline gap-4';

    var name = document.createElement('span');
    name.className = 'font-zh text-base text-site-text';
    name.textContent = m.name;                 // 用 textContent 而不是 innerHTML：
                                               // 访客写的内容一律当纯文本，不当代码执行
    var time = document.createElement('span');
    time.className = 'text-xs text-site-muted tracking-widest';
    time.textContent = m.time;

    head.appendChild(name);
    head.appendChild(time);

    var text = document.createElement('p');
    text.className = 'font-zh text-base text-site-text leading-loose mt-2 whitespace-pre-wrap';
    text.textContent = m.text;

    wrap.appendChild(head);
    wrap.appendChild(text);
    return wrap;
  }


  // ── 提交一条新留言 ───────────────────────────────────────────────────

  function submit(e) {
    e.preventDefault();

    var nameEl = overlay.querySelector('#gb-name');
    var textEl = overlay.querySelector('#gb-text');
    var hintEl = overlay.querySelector('#gb-hint');
    var sendEl = overlay.querySelector('#gb-submit');

    var text = textEl.value.trim();
    if (!text) {
      hintEl.textContent = '还没写内容。';
      return;
    }

    sendEl.disabled = true;
    hintEl.textContent = '寄出中…';

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    nameEl.value.trim(),
        text:    text,
        page:    PAGE,
        website: overlay.querySelector('#gb-website').value,   // 蜜罐，真人永远是空的
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        sendEl.disabled = false;
        if (!data.ok) {
          hintEl.textContent = data.error || '寄不出去，稍后再试。';
          return;
        }
        // 先审后发：这里不把留言插进列表，因为它还没公开
        textEl.value = '';
        hintEl.textContent = '收到了，作者看过之后会出现在下面。';
      })
      .catch(function () {
        sendEl.disabled = false;
        hintEl.textContent = '寄不出去，稍后再试。';
      });
  }

})();
