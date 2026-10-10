// 行事曆 API 與網址（規格第 4 節）。本機預覽讀行事曆示範版（node tools/dev-server.js --mock --demo，port 5175）。
(function () {
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  window.SITE_CONFIG = local
    ? { API: 'http://localhost:5175/api', CAL: 'http://localhost:5175/' }
    : { API: 'https://shumeizi-api.duty-calendar-worker.workers.dev/', CAL: 'https://bailixiao.github.io/shumeizi-calendar/' };
})();
