# CLAUDE.md

書槑子青年坊官網。2026/10/10 開始，用來取代舊的 Webnode 官網（https://shumeiziqingnianfang4.webnode.page/）。
行事曆是另一個專案：`D:\Projects\書槑子行事曆`（https://bailixiao.github.io/shumeizi-calendar/），兩邊互相連結。
**不可修改 `D:\Projects\教全區行事曆` 裡的任何檔案。**

## 每次工作前

- 先讀 `docs/spec.md`，所有開發以它為準；需求有變動先改規格書再改程式。

## 公開儲存庫規則

- 之後會放到公開的 GitHub，**不可放任何人名、電話**。回饋只寫「槑友・職業」這類，不寫名字（連遮一個字的也不放）。
- **新增有人臉的照片要本人同意才能放**（舊官網已公開的那幾張，使用者 2026/10/10 決定沿用）。還沒同意的照片只放在 `_old/`（不進 git），頁面引用 `_old/` 的圖片只在本機預覽看得到；`node tools/build.js --publish` 會擋下還有引用 `_old/` 的頁面。
- 用詞：對象是青年，口語輕鬆；不用「道親、壇辦、佛堂、點傳師、了愿」這類詞。

## 開發流程

- 頁面原始檔在 `src/pages/*.html`，共用外框在 `src/layout.html`；改完執行 `node tools/build.js` 產生根目錄的 `*.html`（產生的檔案也要 commit，GitHub Pages 直接用）。
- 本機預覽：`node tools/serve.js`（http://localhost:5180）。本機時「近期活動」讀行事曆示範版（先開 `D:\Projects\書槑子行事曆` 的 `node tools/dev-server.js --mock --demo`，port 5175）；正式網址讀正式的行事曆 API。
- 每完成一個段落就 commit；**push（公開）之前要確認團隊同意、照片都取得同意**。
- 改了 css／js 要把 `src/layout.html` 裡的 `?v=` 版本號換新。
