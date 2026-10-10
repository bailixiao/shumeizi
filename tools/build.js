// 產生頁面：src/pages/*.html（最上面一段 <!-- key: value --> 設定）＋ src/layout.html → 根目錄的 *.html
//   node tools/build.js            本機預覽用
//   node tools/build.js --publish  上線前：還有引用 _old/（沒取得同意的照片）就停下來
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publish = process.argv.includes('--publish');
const layout = fs.readFileSync(path.join(root, 'src', 'layout.html'), 'utf8');

// 選單（順序就是畫面上的順序）
const NAV = [
  ['index', '首頁'],
  ['about', '關於我們'],
  ['gym', '靈魂健身房'],
  ['taoke', '槑青韜課館'],
  ['zhisu', '植素園工作坊'],
  ['stories', '回憶與回饋'],
  ['volunteer', '志工']
];

const pagesDir = path.join(root, 'src', 'pages');
const problems = [];
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const key = path.basename(file, '.html');
  let src = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  // 設定：<!-- title: ... --> <!-- description: ... -->
  const meta = {};
  src = src.replace(/<!--\s*(\w+):\s*([\s\S]*?)\s*-->\s*/g, (m, k, v) => { meta[k] = v; return ''; });
  if (publish && /_old\//.test(src)) problems.push(`${file}：還有引用 _old/ 的照片（沒取得同意前不能上線）`);
  const nav = NAV.map(([k, label]) => `<a href="${k === 'index' ? './' : k + '.html'}"${k === key ? ' aria-current="page"' : ''}>${label}</a>`).join('\n          ');
  const title = key === 'index' ? '書槑子青年坊' : `${meta.title} ｜ 書槑子青年坊`;
  const html = layout
    .replace(/{{title}}/g, title)
    .replace(/{{description}}/g, meta.description || '書槑子青年坊：一群青年自發創立的平台，讀書會×活動×課程×志工。')
    .replace(/{{page}}/g, key)
    .replace('{{nav}}', nav)
    .replace('{{content}}', src.trim());
  fs.writeFileSync(path.join(root, key + '.html'), html);
  console.log('✓ ' + key + '.html');
}
if (problems.length) {
  console.error('\n不能上線：\n- ' + problems.join('\n- '));
  process.exit(1);
}
