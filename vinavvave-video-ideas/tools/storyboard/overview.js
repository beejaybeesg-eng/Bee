// Builds the overview PDF (cover + 总览 + 通用参数 + 导演稿) and merges all track PDFs into 全部_分镜脚本.pdf
const path = require('path'), fs = require('fs');
const { md2html } = require('./build');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const REPO = process.env.VV_REPO || path.resolve(__dirname, '../..'), SP = process.env.VV_BUILD || path.join(require('os').tmpdir(), 'vinavvave-build');
const tracks = ['01', '02', '04', '05', '06', '07', '08', '09', '10'];
const specs = tracks.map(n => require(`./specs/${n}.js`));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const thumbs = specs.map(sp => { const id = sp.hero[0]; return `<figure><img src="file://${path.join(SP, 'out', sp.num, 'cards', id + '.jpg')}"><figcaption><b>${sp.num}</b> ${esc(sp.title.replace(/（.*）/, ''))}</figcaption></figure>`; }).join('');
const rd = f => fs.readFileSync(path.join(REPO, f), 'utf8');
const CSS = `@page{size:210mm 297mm;margin:13mm 13mm 14mm}
*{box-sizing:border-box} body{font-family:'Noto Sans SC',sans-serif;color:#111;margin:0;font-size:10.6px;line-height:1.62}
h1{font-family:'Anton';font-size:28px;line-height:1.1;margin:0 0 3mm;letter-spacing:.3px} h2{font-size:14px;margin:5mm 0 2mm;border-left:3px solid #111;padding-left:2mm} h3{font-size:12px;margin:4mm 0 1.5mm}
p{margin:1.2mm 0} ul,ol{margin:1mm 0;padding-left:5mm} li{margin:.6mm 0} b{font-weight:900}
table{border-collapse:collapse;width:100%;margin:2mm 0;font-size:10px} td{border:1px solid #cfd5da;padding:1.4mm 2mm;vertical-align:top} tr:first-child td{background:#111;color:#fff;font-weight:700}
.cover{page-break-after:always} .big{font-family:'Anton';font-size:64px;letter-spacing:4px;line-height:1;margin:10mm 0 2mm} .sub{font-size:13px;color:#333;margin-bottom:6mm}
.thumbs{display:flex;flex-wrap:wrap;gap:3mm;justify-content:center} .thumbs figure{margin:0;width:31mm} .thumbs img{width:100%;aspect-ratio:9/16;object-fit:cover;display:block;border:1.2px solid #111;border-radius:1.5mm} .thumbs figcaption{font-size:8.5px;margin-top:1mm;line-height:1.3}
.brk{page-break-before:always} .meta{font-size:10px;color:#555;margin-top:8mm}`;
(async () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="cover"><div class="big">VINAVVAVE</div><div class="sub">BEEJAYBEE · 竖屏短视频系列 · 剩下九集的创意、拍摄脚本与分镜<br>iPhone 16 Pro Max 一部 · 一个人 · 每集 ≤ 3 小时</div><div class="thumbs">${thumbs}</div>
  <div class="meta">本册顺序：总览 → 拍摄通用参数 → 三位导演原稿与剪辑方案 → 第 1、2、4–10 首（每首：一页纸 / 机位表 / 时间表 / 分镜）。<br>第 4、5、6、7、9 首的声调按意思定（见总览）；画面、字幕、文案不碰任何历史和政治联想。</div></div>
  ${md2html(rd('00_总览.md'))}
  <div class="brk"></div>${md2html(rd('拍摄通用参数_iPhone16ProMax.md'))}
  <div class="brk"></div>${md2html(rd('导演稿与剪辑方案.md'))}
  </body></html>`;
  const out = path.join(SP, 'out', 'overview.html'); fs.writeFileSync(out, html);
  const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + out); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const ov = path.join(SP, 'out', 'overview.pdf'); await p.pdf({ path: ov, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  const pc = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 }); await pc.goto('file://' + out); await pc.waitForTimeout(300); await pc.screenshot({ path: path.join(SP, 'out', 'overview_p1.png') });
  await b.close();
  const parts = [ov, ...specs.map(sp => path.join(REPO, 'pdf', `${sp.num}_${sp.slug}_分镜脚本.pdf`))];
  execFileSync(process.env.PYTHON || 'python3', ['-I', '-c', `import sys\nfrom pypdf import PdfWriter\nw=PdfWriter()\nfor f in sys.argv[2:]: w.append(f)\nw.write(sys.argv[1])`, path.join(REPO, '全部_分镜脚本.pdf'), ...parts]);
  console.log('merged', parts.length, 'parts');
})();
