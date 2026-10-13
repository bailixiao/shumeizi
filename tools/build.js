// 產生頁面：src/pages/*.html（最上面一段 <!-- key: value --> 設定）＋ src/layout.html → 根目錄的 *.html
//   node tools/build.js            本機預覽用
//   node tools/build.js --publish  上線前：還有引用 _old/（沒取得同意的照片）就停下來
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publish = process.argv.includes('--publish');
const layout = fs.readFileSync(path.join(root, 'src', 'layout.html'), 'utf8');

// 選單（順序就是畫面上的順序；2026/10/13 改成下拉式）：
//   字串＝本站頁面的 key；{ label, href, out }＝連到別的地方（out：開新分頁）；{ label, items }＝有子選單的大項
const CAL = 'https://bailixiao.github.io/shumeizi-calendar/';
const LINE = 'https://lin.ee/auCgNDI';
const HAPPY = 'https://line.me/ti/g2/54nufHfVxf8vBencGmHK4fvJH408_CUpuOEWIA';
const NAV = [
  'index',
  { label: '關於我們', items: ['about', 'stories'] },
  { label: '槑子活動', items: ['gym', 'taoke', 'volunteer'] },
  { label: '植素園工作坊', items: ['zhisu', { label: '本月團購', href: 'zhisu.html#shop' }, { label: '出攤預告', href: 'zhisu.html#stalls' }, { label: '🌿 HAPPY 購團購社群', href: HAPPY, out: true }] },
  { label: '聯絡我們', items: [{ label: '聯絡方式', href: './#contact' }, { label: '💬 官方 LINE', href: LINE, out: true }, { label: '📅 行事曆、報名', href: CAL, cal: true }] }
];
const PAGE_LABEL = { index: '首頁', about: '關於我們', stories: '回憶與回饋', gym: '靈魂健身房', taoke: '槑青韜課館', volunteer: '志工', zhisu: '植素園工作坊' };
const NAV_LABEL = { zhisu: '關於植素園工作坊' }; // 選單裡和頁面名稱不一樣的字
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** 選單 HTML：大項用 <details>（沒有 JavaScript 也能展開）；目前這頁標 aria-current，所在的大項標 is-here */
function navHtml(key) {
  const link = (it) => {
    if (typeof it === 'string') return `<a href="${it === 'index' ? './' : it + '.html'}"${it === key ? ' aria-current="page"' : ''}>${esc(NAV_LABEL[it] || PAGE_LABEL[it])}</a>`;
    return `<a href="${esc(it.href)}"${it.out ? ' target="_blank" rel="noopener"' : ''}${it.cal ? ' data-cal' : ''}>${esc(it.label)}</a>`;
  };
  return NAV.map((it) => {
    if (!it.items) return `<div class="nav-item">${link(it)}</div>`;
    const here = it.items.some((x) => x === key);
    return `<details class="nav-item nav-group${here ? ' is-here' : ''}"><summary>${esc(it.label)}</summary><div class="nav-sub">${it.items.map(link).join('')}</div></details>`;
  }).join('\n          ');
}

const pagesDir = path.join(root, 'src', 'pages');
const problems = [];
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const key = path.basename(file, '.html');
  let src = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  // 設定：<!-- title: ... --> <!-- description: ... -->
  const meta = {};
  src = src.replace(/<!--\s*(\w+):\s*([\s\S]*?)\s*-->\s*/g, (m, k, v) => { meta[k] = v; return ''; });
  if (publish && /_old\//.test(src)) problems.push(`${file}：還有引用 _old/ 的照片（沒取得同意前不能上線）`);
  const nav = navHtml(key);
  const title = key === 'index' ? '書槑子青年坊' : `${meta.title} ｜ 書槑子青年坊`;
  const html = layout
    .replace(/{{title}}/g, title)
    .replace(/{{description}}/g, meta.description || '書槑子青年坊：一群青年自發創立的平台，讀書會×活動×課程×志工。')
    .replace(/{{page}}/g, key)
    .replace('{{nav}}', nav)
    // 左上角的標誌：植素園的頁面用植素園的標誌（2026/10/14）
    .replace('{{brandLogo}}', key === 'zhisu' ? 'img/zhisu-head.png?v=20261014' : 'img/logo-head.png?v=20261014')
    .replace('{{brandName}}', key === 'zhisu' ? '植素園工作坊' : '書槑子青年坊') // 植素園的頁面：左上角寫「植素園工作坊」
    .replace('{{pageLabel}}', esc(key === 'zhisu' ? '關於植素園工作坊' : (PAGE_LABEL[key] || meta.title || ''))) // 標題旁的小字：現在在哪一頁（植素園頁：捲到哪一區就換成那一區，見 js/nav.js）
    .replace('{{content}}', src.trim());
  fs.writeFileSync(path.join(root, key + '.html'), html);
  console.log('✓ ' + key + '.html');
}
if (problems.length) {
  console.error('\n不能上線：\n- ' + problems.join('\n- '));
  process.exit(1);
}
