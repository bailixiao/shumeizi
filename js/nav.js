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
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });

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
    g.addEventListener('mouseenter', function () { if (wide.matches) g.open = true; });
    g.addEventListener('mouseleave', function () { if (wide.matches) g.open = false; });
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
