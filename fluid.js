// ================================================================
// fluid.js — 手写的弹簧动画 + 滑动手势引擎（零依赖，series / archive 两个 Lightbox 共用）
//
// 灵感来自 Apple 的"流体界面"哲学：
//   1. 跟手 —— 照片被手指/鼠标 1:1 拖动，不是"松手后才反应"
//   2. 可打断 —— 动画随时能被新的输入接管，永远从当前位置继续
//   3. 有惯性 —— 松手时按"手的速度"决定翻页还是弹回，动画无缝接住手速
//   4. 边界有阻力 —— 第一张往回拖是"橡皮筋"，越拉越沉，传达"这边没有了"
//
// 气质约束（和整站一致）：全程临界阻尼 = 永不回弹、永不过冲。
// ================================================================


// ── 系统设置检查：用户是否开了"减弱动态效果" ─────────────────────
// 开了的话：手势仍然有效（照样能翻页），但一切位移动画退化为纯淡入淡出
function fluidReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


// ── 临界阻尼弹簧：把一个数字平滑地推向目标，永不回弹 ─────────────
// 原理：每帧模拟一次"弹力拉向目标 + 阻尼消耗速度"的物理过程（半隐式欧拉积分）。
// 好处：随时可以改目标、随时可以带着初速度启动 —— "可打断"是天然免费的。
//   onUpdate(x) —— 每帧回调，拿到当前值去改 DOM
//   onRest()    —— 到达目标并静止后回调一次
function createSpring(onUpdate, onRest) {
  var RESPONSE = 0.35;                                // 响应时长（秒）：越小越快
  var k = Math.pow(2 * Math.PI / RESPONSE, 2);        // 弹簧刚度
  var c = 2 * Math.sqrt(k);                           // 阻尼系数（锁死临界阻尼 = 不回弹）

  var x = 0, v = 0, target = 0;                       // 当前值、速度、目标
  var rafId = null, lastT = 0;

  // 每帧执行一次物理模拟
  function frame(t) {
    var dt = Math.min((t - lastT) / 1000, 1 / 30);    // 时间步长上限 1/30s，防止切后台回来数值爆炸
    lastT = t;
    v += (-k * (x - target) - c * v) * dt;            // 弹力 + 阻尼
    x += v * dt;

    // 足够接近目标且几乎静止 → 吸附到目标、收工
    if (Math.abs(v) < 2 && Math.abs(x - target) < 0.5) {
      x = target; v = 0; rafId = null;
      onUpdate(x);
      if (onRest) onRest();
      return;
    }
    onUpdate(x);
    rafId = requestAnimationFrame(frame);
  }

  return {
    // 读取当前值（= 屏幕上正在呈现的值，打断动画时从这里接手）
    get: function() { return x; },

    // 瞬间跳到某个值（不产生动画），并立即刷新一次 DOM
    jumpTo: function(value) {
      x = value; v = 0;
      onUpdate(x);
    },

    // 向新目标出发；velocity 可选 —— 把手指松开时的速度无缝交接给动画
    springTo: function(newTarget, velocity) {
      target = newTarget;
      if (velocity !== undefined) v = velocity;
      if (rafId === null) {
        lastT = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    },

    // 立即停住（打断动画时用），当前值保持不动
    stop: function() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null; v = 0;
    },
  };
}


// ── 橡皮筋阻力：拖得越远，跟手越少（Apple 的公式，c = 0.55）────────
// offset 是拖拽距离，dimension 是容器宽度；返回打了折扣的位移
function rubberband(offset, dimension) {
  var c = 0.55;
  return (offset * dimension * c) / (dimension + c * Math.abs(offset));
}


// ── 惯性投影：按松手瞬间的速度，预测"如果不管它，会滑到哪里停下" ──
// 和 iOS 滚动减速用的是同一条指数衰减公式
function project(velocity) {
  var decelerationRate = 0.998;
  return (velocity / 1000) * decelerationRate / (1 - decelerationRate);
}


// ── 滚动浮现：照片第一次进入视野时，从下方轻轻浮上来 ─────────────
// 展厅隐喻：走到哪面墙，哪面墙的作品浮现。每张只浮现一次，永不再藏回去。
// 克制线（防"网页味"）：位移只有 14px、450ms、无回弹；
// 同一批进入视野的照片按屏幕位置从上到下错开 50ms，形成瀑布感；
// 图片解码完成后才开始浮现（慢网速下不给空框做入场动画）；
// 系统开了"减弱动态"就只淡入、不位移。
var revealObserver = null;                 // 全页共用一个观察器（懒创建）

function fluidReveal(el) {
  // 老浏览器没有 IntersectionObserver：不做动画，直接正常显示
  if (typeof IntersectionObserver === 'undefined') return;

  // 初始态：透明 + 藏在下方 14px（减弱动态时不位移，只准备淡入）
  el.style.opacity = '0';
  if (!fluidReducedMotion()) el.style.transform = 'translateY(14px)';

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(function(entries) {
      // 同一批进入视野的元素，按屏幕上的位置排序（先上后下、先左后右），
      // 依次错开 50ms —— 打开页面时首屏照片自上而下浮现
      var visible = entries.filter(function(en) { return en.isIntersecting; });
      visible.sort(function(a, b) {
        return (a.boundingClientRect.top - b.boundingClientRect.top)
            || (a.boundingClientRect.left - b.boundingClientRect.left);
      });
      visible.forEach(function(en, i) {
        revealObserver.unobserve(en.target);              // 只浮现一次
        revealWhenReady(en.target, Math.min(i * 50, 400)); // 错峰上限 400ms
      });
    });
  }
  revealObserver.observe(el);
}

// 等元素里的图片解码完成，再延迟 delay 毫秒开始浮现
function revealWhenReady(el, delay) {
  var img = el.tagName === 'IMG' ? el : el.querySelector('img');
  // 图片还没加载完就先等它（decode 失败也照常浮现，不卡死）
  var ready = (img && !img.complete && typeof img.decode === 'function')
    ? img.decode().catch(function() {})
    : Promise.resolve();

  ready.then(function() {
    setTimeout(function() {
      el.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
      el.style.opacity = '';                // 清掉内联值 = 回到正常状态，触发过渡
      el.style.transform = '';
      // 过渡结束后把 transition 也清掉，不影响元素原有的悬停/按压动效
      setTimeout(function() { el.style.transition = ''; }, 500);
    }, delay);
  });
}


// ── 照片加载辅助（series / archive / film 三个阅读视图共用）──────────
//
// 为什么需要：照片平均 1.16MB，服务器出口约 400KB/s——翻页后新照片要
// 好几秒才到，而浏览器在新图到达之前会一直显示旧图，且不给任何提示。
// 看起来就是"翻不动、永远停在第一张"（2026-07 作者真机报的最严重 bug，
// 排查结论：翻页逻辑完好，是照片在路上 + 界面不吭声）。
//
// 两手准备：
//   fluidPreload(srcs)          —— 预加载一组图片（浏览器缓存热身）
//   fluidLoadingGuard(img, cb)  —— 给阅读视图的主图挂一次；换 src 后调 mark()，
//                                  图没到就压暗（.photo-loading），到了自动恢复
//                                  并回调 cb（页面用它接着预加载相邻照片——
//                                  等当前图到了再预热邻图，不跟它抢带宽）

// ── 小图档路径规则 ────────────────────────────────────────────────
// 每张照片都有一个 1280px/q85 的手机档，由 scripts/make-small-images.py 生成：
//     assets/images/…/xx.jpeg  →  assets/images-sm/…/xx.jpeg
// ⚠️ 这条替换规则和那个脚本是一对约定，改一边必须改另一边。
// 为什么要小图档：原图平均 1.16MB 是给桌面高分屏定的，手机用不到那么多像素，
// 而服务器出口只有 ~400KB/s——小图档把手机翻页等待从 ~3 秒降到 ~1 秒内。
function fluidSmallSrc(src) {
  return src.replace('assets/images/', 'assets/images-sm/');
}

// 阅读视图主图的 srcset：浏览器按"显示尺寸 × 屏幕密度"自己挑
// （手机 → 1280 小图；高分屏桌面 → 2560 原图，桌面画质零损失）
function fluidSrcset(src) {
  return fluidSmallSrc(src) + ' 1280w, ' + src + ' 2560w';
}

// 预加载：让浏览器把这些图悄悄拉进缓存（重复调用无害，缓存直接命中）
// 用和阅读视图主图相同的 srcset + sizes——预热的必须正是待会儿要显示的
// 那个候选，不然手机预热了 2560 原图、显示时却去拿 1280 小图，全白热
function fluidPreload(srcs) {
  (srcs || []).forEach(function (src) {
    if (!src) return;
    var im = new Image();
    im.sizes = '100vw';
    im.srcset = fluidSrcset(src);
    im.src = src;                    // 兜底（不认识 srcset 的老浏览器）
  });
}

// 加载状态守卫：img 元素挂一次，返回 { mark }
// ⚠️ 压暗用的是 filter（.photo-loading 类），不是 opacity——
//    opacity 归上面滑动控制器的翻页动画管，两边写同一个属性会打架
function fluidLoadingGuard(img, onReady) {
  function done() {
    img.classList.remove('photo-loading');
    if (onReady) onReady();
  }
  img.addEventListener('load', done);
  img.addEventListener('error', done);   // 加载失败也别永远压暗着
  return {
    // 每次给 img 换完 src 后调用：已在缓存里就直接触发 onReady，否则压暗等它
    mark: function () {
      var loaded = img.complete;
      img.classList.toggle('photo-loading', !loaded);
      if (loaded) { if (onReady) onReady(); }
    },
  };
}


// ── 滑动控制器：接管一个 Lightbox 的所有横向手势 + 翻页动画 ────────
// 页面只需要提供 hooks（钩子），引擎不关心页面的数据结构：
//   isActive()   → Lightbox 当前是否打开
//   getView()    → 当前应该跟手移动的那个视图容器（DOM 元素）
//   canPrev()    → 还能往前翻吗（false 时往右拖是橡皮筋）
//   canNext()    → 还能往后翻吗（false = 已在结束卡，往左拖是橡皮筋）
//   swap(dir)    → 真正换内容：dir 为 +1/-1，页面自己改索引并重新渲染
//   flickClose() → "走出展厅"：结束卡上用力一甩 / 键盘再按 → 时调用
// 返回 { slide(dir), justDragged(), reset() }
function createSwipeControl(rootEl, hooks) {

  // —— 手感参数（都经过 Apple 官方数值校准，改前三思）——
  var HYSTERESIS  = 10;    // 迟滞：移动超过 10px 才算拖拽，以内算点按
  var COMMIT_DIST = 80;    // 惯性投影超过 80px 才翻页，否则弹回
  var OUT_DIST    = 40;    // 出场：从松手位置再滑 40px 同时渐隐
  var IN_DIST     = 24;    // 入场：新内容从反方向 24px 处滑入并渐显
  var FLICK_CLOSE = 600;   // 结束卡上向左甩超过 600px/s = 走出展厅

  // —— 状态机 ——
  // idle: 静止 | drag: 手指拖着 | settle: 松手弹回原位 | out: 旧内容出场 | in: 新内容入场
  var phase = 'idle';
  var viewEl = null;       // 当前正在被移动的视图容器
  var outStartX = 0, outTargetX = 0, outDir = 0;  // 出场动画的起点/终点/方向
  var pendingDir = 0;      // 出场进行中又收到的翻页请求，出完场再执行
  var finishing = false;   // 防止出场收尾被触发两次

  // —— 拖拽状态 ——
  var activePointer = null;          // 正在跟踪的指针 id（null = 没有拖拽）
  var gestureState = 'none';         // pending: 还没过迟滞阈值 | drag: 确认为拖拽
  var startX = 0, startY = 0;        // 手势起点
  var dragBaseX = 0;                 // 拖拽开始时视图已有的位移（打断动画接手时非 0）
  var lastVisualX = 0;               // 视图当前实际显示的位移
  var samples = [];                  // 最近的 (时间, 位置) 采样，用于算松手速度
  var draggedFlag = false;           // 刚刚发生过拖拽 → 吞掉紧随其后的 click

  // 弹簧的每帧回调：把数值写到视图的 transform / opacity 上
  var spring = createSpring(applyFrame, onSpringRest);

  // ── 每帧渲染：位移直接写 translateX，透明度按所处阶段计算 ──
  function applyFrame(x) {
    if (!viewEl) return;
    lastVisualX = x;
    viewEl.style.transform = 'translateX(' + x + 'px)';

    if (phase === 'out') {
      // 出场：从起点到终点的进度 0→1，透明度 1→0
      var progress = (x - outStartX) / (outTargetX - outStartX);
      progress = Math.max(0, Math.min(progress, 1));
      viewEl.style.opacity = String(1 - progress);
      if (progress >= 1) finishOut();   // 甩得快会提前滑到位，不必等弹簧完全静止
    } else if (phase === 'in') {
      // 入场：离原位越近越清晰
      viewEl.style.opacity = String(Math.max(0, 1 - Math.abs(x) / IN_DIST));
    }
    // drag / settle 阶段不碰透明度：照片粘在手上时不该变虚
  }

  // ── 弹簧静止时：按所处阶段收尾 ──
  function onSpringRest() {
    if (phase === 'settle') {
      clearStyles(viewEl);
      phase = 'idle';
    } else if (phase === 'out') {
      finishOut();                      // 兜底：慢速出场走到头
    } else if (phase === 'in') {
      clearStyles(viewEl);
      phase = 'idle';
      // 入场期间攒下的翻页请求，现在执行
      if (pendingDir !== 0) {
        var d = pendingDir; pendingDir = 0;
        slide(d);
      }
    }
  }

  // ── 出场结束：换内容，然后让新内容从反方向入场 ──
  function finishOut() {
    if (finishing || phase !== 'out') return;
    finishing = true;
    spring.stop();
    clearStyles(viewEl);
    hooks.swap(outDir);                 // 页面在这里改索引 + 重新渲染
    viewEl = hooks.getView();           // 内容换了，视图容器可能也换了（照片→章节卡）
    phase = 'in';
    finishing = false;
    // 新内容先站到反方向 24px 处（透明），再滑到原位（渐显）
    spring.jumpTo(outDir > 0 ? IN_DIST : -IN_DIST);
    spring.springTo(0);
  }

  // ── 开始出场动画：从 fromX 出发，带着手速滑向 40px 外 ──
  function beginOut(dir, fromX, velocity) {
    phase = 'out';
    outDir = dir;
    viewEl = hooks.getView();
    outStartX = fromX;
    outTargetX = fromX + (dir > 0 ? -OUT_DIST : OUT_DIST);
    spring.jumpTo(fromX);
    // 手速交接（限幅：甩得再猛也别让数值飞出去）
    var v = Math.max(-3000, Math.min(velocity || 0, 3000));
    spring.springTo(outTargetX, v);
  }

  // ── 松手弹回原位（没翻页/在边界上），带着剩余手速弹回去 ──
  function settleBack(velocity) {
    phase = 'settle';
    spring.jumpTo(lastVisualX);
    spring.springTo(0, velocity || 0);
  }

  // ── 清掉视图上的内联样式，交还给 CSS ──
  function clearStyles(el) {
    if (!el) return;
    el.style.transform = '';
    el.style.opacity = '';
  }

  // ── 减弱动态模式下的换页：不位移，只做 150ms 的淡入 ──
  var fadeToken = 0;
  function reducedFade(el) {
    var token = ++fadeToken;
    var t0 = performance.now();
    el.style.opacity = '0';
    function step(t) {
      if (token !== fadeToken) return;  // 有更新的淡入接管了，这次作废
      var p = Math.min((t - t0) / 150, 1);
      el.style.opacity = (p === 1) ? '' : String(p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── 计算松手瞬间的速度（px/s）：取最近 100ms 内采样的斜率 ──
  function releaseVelocity() {
    if (samples.length < 2) return 0;
    var last = samples[samples.length - 1];
    var first = samples[0];
    for (var i = samples.length - 2; i >= 0; i--) {
      if (last.t - samples[i].t > 100) break;   // 只看最近 100ms
      first = samples[i];
    }
    var dt = last.t - first.t;
    if (dt <= 0) return 0;
    return (last.x - first.x) / dt * 1000;
  }

  // ── 松手决策：翻页？弹回？还是走出展厅？ ──
  function decide(totalX, velocity) {
    var projected = totalX + project(velocity);           // 惯性投影：预测最终会停在哪
    var atFirstEdge = totalX > 0 && !hooks.canPrev();     // 第一张还往回拖
    var atLastEdge  = totalX < 0 && !hooks.canNext();     // 结束卡还往前拖

    if (atLastEdge && velocity < -FLICK_CLOSE) {
      hooks.flickClose();                                 // 结束卡上用力一甩 → 走出展厅
      return;
    }
    if (atFirstEdge || atLastEdge) {
      if (!fluidReducedMotion()) settleBack(velocity);    // 橡皮筋弹回
      return;
    }
    if (projected < -COMMIT_DIST && hooks.canNext()) {
      commit(1, velocity);
    } else if (projected > COMMIT_DIST && hooks.canPrev()) {
      commit(-1, velocity);
    } else if (!fluidReducedMotion()) {
      settleBack(velocity);                               // 没拖够 → 弹回原位
    }
  }

  // ── 确认翻页：正常模式走出场动画，减弱动态模式直接换 + 淡入 ──
  function commit(dir, velocity) {
    if (fluidReducedMotion()) {
      hooks.swap(dir);
      reducedFade(hooks.getView());
      return;
    }
    beginOut(dir, lastVisualX, velocity);
  }

  // ── 键盘 / 按钮翻页：走和手势完全相同的动画管路 ──
  function slide(dir) {
    if (!hooks.isActive()) return;
    if (activePointer !== null) return;          // 手指还按着：键盘先让路
    if (phase === 'out') {                       // 正在出场：记下来，出完接着走
      pendingDir = dir;
      return;
    }
    if (dir > 0 && !hooks.canNext()) {           // 结束卡上再往前 = 走出展厅
      hooks.flickClose();
      return;
    }
    if (dir < 0 && !hooks.canPrev()) return;     // 第一张再往回 = 停住

    if (fluidReducedMotion()) {
      hooks.swap(dir);
      reducedFade(hooks.getView());
      return;
    }
    // 从当前呈现位置出发（正在入场/弹回时被打断 → 无缝接着走，不跳帧）
    var fromX = (phase === 'in' || phase === 'settle') ? spring.get() : 0;
    beginOut(dir, fromX, 0);
  }

  // ── 指针按下：先按兵不动，等它证明自己是拖拽还是点按 ──
  rootEl.addEventListener('pointerdown', function(e) {
    if (!hooks.isActive()) return;
    if (!e.isPrimary) return;                            // 第二根手指不管
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (phase === 'out') return;                         // 内容马上要换，这一瞬不接管
    activePointer = e.pointerId;
    gestureState = 'pending';
    startX = e.clientX; startY = e.clientY;
    samples = [{ t: e.timeStamp, x: e.clientX }];
    draggedFlag = false;
  });

  // ── 指针移动：过了 10px 迟滞后锁定方向，横向才接管 ──
  rootEl.addEventListener('pointermove', function(e) {
    if (e.pointerId !== activePointer) return;

    if (gestureState === 'pending') {
      var dx0 = e.clientX - startX, dy0 = e.clientY - startY;
      if (Math.abs(dx0) < HYSTERESIS && Math.abs(dy0) < HYSTERESIS) return;
      if (Math.abs(dy0) > Math.abs(dx0)) {
        activePointer = null;                            // 竖向意图：放手，让浏览器滚动（组图区）
        return;
      }
      // 确认为横向拖拽：捕获指针、接管当前视图
      gestureState = 'drag';
      rootEl.setPointerCapture(e.pointerId);
      rootEl.classList.add('fluid-grabbing');
      spring.stop();
      pendingDir = 0;
      // 若正处于入场/弹回动画中，从当前位置无缝接手
      dragBaseX = (phase === 'in' || phase === 'settle') ? spring.get() : 0;
      phase = 'drag';
      viewEl = hooks.getView();
      viewEl.style.opacity = '';                         // 拖拽中照片保持不透明
      startX = e.clientX;                                // 以锁定点为新原点，避免起步跳动
      samples = [{ t: e.timeStamp, x: e.clientX }];
    }

    if (gestureState !== 'drag') return;

    // 采样（算松手速度用），只留最近 6 个
    samples.push({ t: e.timeStamp, x: e.clientX });
    if (samples.length > 6) samples.shift();

    var totalX = dragBaseX + (e.clientX - startX);
    // 边界上：橡皮筋阻力 —— 拖得越远跟手越少
    var visualX = totalX;
    if ((totalX > 0 && !hooks.canPrev()) || (totalX < 0 && !hooks.canNext())) {
      visualX = rubberband(totalX, rootEl.clientWidth);
    }
    lastVisualX = visualX;
    if (!fluidReducedMotion()) {
      viewEl.style.transform = 'translateX(' + visualX + 'px)';
    }
  });

  // ── 指针抬起：点按放行；拖拽则进入松手决策 ──
  rootEl.addEventListener('pointerup', function(e) {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    if (gestureState !== 'drag') { gestureState = 'none'; return; }   // 纯点按，click 正常触发
    gestureState = 'none';
    rootEl.classList.remove('fluid-grabbing');
    draggedFlag = true;                                  // 让紧随其后的 click 作废

    var totalX = dragBaseX + (e.clientX - startX);
    decide(totalX, releaseVelocity());
  });

  // ── 指针被系统取消（如浏览器接管了滚动）：弹回原位 ──
  rootEl.addEventListener('pointercancel', function(e) {
    if (e.pointerId !== activePointer) return;
    activePointer = null;
    if (gestureState === 'drag') {
      rootEl.classList.remove('fluid-grabbing');
      settleBack(0);
    }
    gestureState = 'none';
  });

  // ── 拖拽后的 click 一律吞掉（防止误触按钮 / 背景点击关闭）──
  rootEl.addEventListener('click', function(e) {
    if (draggedFlag) {
      draggedFlag = false;
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);

  // ── 对外接口 ──
  return {
    slide: slide,                                        // 键盘/按钮翻页（带方向动画）
    justDragged: function() { return draggedFlag; },     // 刚拖拽过吗（背景点击关闭的保险）
    reset: function() {                                  // 打开/关闭 Lightbox 时清场
      spring.stop();
      clearStyles(viewEl);
      clearStyles(hooks.getView());
      phase = 'idle';
      pendingDir = 0;
      activePointer = null;
      gestureState = 'none';
      rootEl.classList.remove('fluid-grabbing');
    },
  };
}
