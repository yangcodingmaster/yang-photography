/* ============================================================================
   留言表单 —— 前端（四个页面共用这一个文件）
   ============================================================================

   页面那边只要两行：

       <div id="message-slot" data-style="footer"></div>
       <script src="message.js"></script>

   data-style 有两种：
       footer —— 按钮居中放在页面底部（Gallery / Archive / Film 用这个）
       float  —— 按钮浮在右下角（首页用这个：首页是全屏轮播、不滚动，没有"底部"）

   点按钮打开一个整屏浮层，和 series / archive / film 的阅读视图同一套做法：
   fixed inset-0 的纸面底 + 右上角「→ Way out」+ Esc 退出。

   浮层里只有一个表单。写完点寄出，内容直接发到作者邮箱 ——
   不存服务器、网站上也不显示，所以没有"别人的留言"可看。
   ========================================================================= */

(function () {

  var API = 'api/message.php';     // 后端地址（相对路径，与全站一致）

  // 这条留言是从哪一页写的：附在邮件里，方便知道访客当时在看什么
  var PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');

  var slot = document.getElementById('message-slot');
  if (!slot) return;               // 页面没放位置就什么也不做

  var overlay = null;              // 浮层的 DOM


  // ── 自带的一点样式 ──────────────────────────────────────────────────
  // 按压态（按下缩一点）本来只写在 archive.html 里，但留言按钮四个页面都要用。
  // 与其往三个 HTML 各抄一遍，不如让这个组件自己带着走 —— 改一处，四页同步。
  var css = document.createElement('style');
  css.textContent =
    '#message-slot .pressable, #msg-close, #msg-submit { transition: transform 0.1s ease-out; }' +
    '#message-slot .pressable:active, #msg-close:active, #msg-submit:active {' +
      'transform: scale(0.97); transition: none; }' +
    /* 系统开了"减弱动态效果"：不做缩放 */
    '@media (prefers-reduced-motion: reduce) {' +
      '#message-slot .pressable:active, #msg-close:active, #msg-submit:active {' +
        'transform: none; } }' +
    /* 蜜罐字段：挪出屏幕而不是 display:none —— 有些机器人会跳过隐藏字段，
       但会老老实实填这种"看不见却存在"的输入框 */
    '#msg-website { position: absolute; left: -9999px; width: 1px; height: 1px; }';
  document.head.appendChild(css);


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
      '<button id="msg-close" class="pressable fixed top-6 right-8 text-xs text-site-muted ' +
        'hover:text-site-text transition-colors tracking-widest z-10">→ Way out</button>' +

      '<div class="max-w-2xl mx-auto px-6 pt-24 pb-24">' +

        // 标题区：与 Gallery / Archive / Film 的页头同构
        '<h2>' +
          '<span class="block font-display text-4xl tracking-tight">Message</span>' +
          '<span class="block font-zh text-sm text-site-muted mt-2">留言</span>' +
        '</h2>' +
        '<div class="mt-8 h-px w-20 bg-site-border"></div>' +

        // 说清楚这些字去了哪儿：不是公开留言板，别人看不到
        '<p class="font-zh text-sm text-site-muted leading-loose mt-8">' +
          '写下的话会直接寄到我的邮箱，不会公开显示。</p>' +
        '<p class="font-display text-sm text-site-muted mt-1">' +
          'Sent straight to my inbox. Never shown publicly.</p>' +

        // 表单
        '<form id="msg-form" class="mt-12">' +
          '<input id="msg-name" type="text" maxlength="40" placeholder="你的名字（可不填）" ' +
            'class="font-zh w-full bg-transparent border-b border-site-border py-2 text-base ' +
            'placeholder:text-site-muted focus:outline-none focus:border-site-text transition-colors" />' +

          '<input id="msg-email" type="email" maxlength="120" placeholder="你的邮箱（想收到回信就留下）" ' +
            'class="font-zh w-full bg-transparent border-b border-site-border py-2 mt-6 text-base ' +
            'placeholder:text-site-muted focus:outline-none focus:border-site-text transition-colors" />' +

          '<textarea id="msg-text" rows="5" maxlength="2000" placeholder="想说的话…" ' +
            'class="font-zh w-full bg-transparent border-b border-site-border py-2 mt-6 text-base ' +
            'leading-loose resize-none placeholder:text-site-muted focus:outline-none ' +
            'focus:border-site-text transition-colors"></textarea>' +

          // 蜜罐：藏起来的输入框。真人看不见也就不会填，填了的一定是机器人。
          // 怎么藏的写在上面那段 CSS 里（项目规则：不写内联 style）
          '<input id="msg-website" type="text" tabindex="-1" autocomplete="off" ' +
            'aria-hidden="true" />' +

          '<div class="mt-6 flex items-center justify-between gap-4">' +
            '<span id="msg-hint" class="font-zh text-xs text-site-muted"></span>' +
            '<button id="msg-submit" type="submit" class="pressable shrink-0 border border-site-border ' +
              'px-6 py-2 text-sm hover:text-site-muted transition-colors">' +
              '<span class="font-display tracking-widest">Send</span>' +
              '<span class="font-zh ml-2">寄出</span>' +
            '</button>' +
          '</div>' +
        '</form>' +

        // 寄出成功后显示这一段，同时把表单藏起来（免得手滑连发好几封）
        '<div id="msg-done" class="mt-12" style="display:none">' +
          '<p class="font-zh text-base text-site-text leading-loose">寄出了，谢谢你写这些。</p>' +
          '<p class="font-display text-sm text-site-muted mt-1">Sent. Thank you.</p>' +
        '</div>' +

      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('#msg-close').addEventListener('click', close);
    overlay.querySelector('#msg-form').addEventListener('submit', submit);
  }


  // ── 打开 / 关闭 ──────────────────────────────────────────────────────

  function open() {
    overlay.style.display = 'block';
    // 浮层自己滚动，锁住背后的页面，免得两层一起动
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  }

  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);

    // 关掉之后恢复成"可以再写一封"的样子：
    // 已经寄出过的话，下次打开看到的应该是空白表单，而不是上次的"寄出了"
    overlay.querySelector('#msg-form').style.display = '';
    overlay.querySelector('#msg-done').style.display = 'none';
    overlay.querySelector('#msg-hint').textContent = '';
  }

  // Esc 退出，与全站阅读视图一致
  function onKey(e) {
    if (e.key === 'Escape') close();
  }


  // ── 寄出 ─────────────────────────────────────────────────────────────

  function submit(e) {
    e.preventDefault();

    var nameEl  = overlay.querySelector('#msg-name');
    var mailEl  = overlay.querySelector('#msg-email');
    var textEl  = overlay.querySelector('#msg-text');
    var hintEl  = overlay.querySelector('#msg-hint');
    var sendEl  = overlay.querySelector('#msg-submit');

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
        email:   mailEl.value.trim(),
        text:    text,
        page:    PAGE,
        website: overlay.querySelector('#msg-website').value,   // 蜜罐，真人永远是空的
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        sendEl.disabled = false;
        if (!data.ok) {
          hintEl.textContent = data.error || '没能寄出，稍后再试。';
          return;
        }
        // 成功：清空并换成"寄出了"，表单收起来防止手滑连发
        nameEl.value = ''; mailEl.value = ''; textEl.value = '';
        hintEl.textContent = '';
        overlay.querySelector('#msg-form').style.display = 'none';
        overlay.querySelector('#msg-done').style.display = '';
      })
      .catch(function () {
        // 网络断了，或者服务器上没开 PHP（本地用 file:// 打开也会走到这里）
        sendEl.disabled = false;
        hintEl.textContent = '没能寄出，稍后再试。';
      });
  }

})();
