// 選單（2026/10/13 下拉式）：手機按「選單」打開／收起；電腦版大項一次只開一個，滑鼠移過去就打開，點外面或按 Esc 收起。
// 大項是 <details>，沒有 JavaScript 也能點開。
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  var groups = Array.prototype.slice.call(nav.querySelectorAll('.nav-group'));
  var wide = window.matchMedia('(min-width: 900px)');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  // 手機：選單最多到螢幕底（扣掉上面的標題列），底下的項目也捲得到
  function fitHeight() {
    if (!nav.classList.contains('is-open')) return;
    nav.style.setProperty('--nav-max', Math.max(200, window.innerHeight - nav.getBoundingClientRect().top) + 'px');
  }
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); fitHeight(); });
  window.addEventListener('resize', fitHeight);

  // 手機：目前這頁所在的大項先展開
  function syncMode() {
    groups.forEach(function (g) { g.open = !wide.matches && g.classList.contains('is-here'); });
    if (wide.matches) setOpen(false);
  }
  syncMode();
  (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(syncMode);

  // 電腦：一次只開一個；滑過打開、離開收起
  groups.forEach(function (g) {
    g.addEventListener('toggle', function () {
      if (wide.matches && g.open) groups.forEach(function (o) { if (o !== g) o.open = false; });
    });
    // 滑鼠離開後等一下才收起（手不穩、斜斜往下移也不會縮回去）
    var timer = 0;
    g.addEventListener('mouseenter', function () { if (!wide.matches) return; clearTimeout(timer); g.open = true; });
    g.addEventListener('mouseleave', function () { if (!wide.matches) return; clearTimeout(timer); timer = setTimeout(function () { g.open = false; }, 400); });
    // 電腦：點大項只會打開，不會把剛滑開的選單又關掉（收起：點外面、按 Esc、滑鼠離開）
    g.querySelector('summary').addEventListener('click', function (ev) {
      if (!wide.matches) return;
      ev.preventDefault(); clearTimeout(timer); g.open = true;
    });
  });
  document.addEventListener('click', function (ev) {
    if (wide.matches && !nav.contains(ev.target)) groups.forEach(function (g) { g.open = false; });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    groups.forEach(function (g) { g.open = false; });
    if (nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  // 手機點了同一頁的錨點（例：團購）就收起選單
  nav.addEventListener('click', function (ev) {
    if (ev.target.closest && ev.target.closest('a') && !wide.matches) setOpen(false);
  });
})();
