// node build.js specs/02.js [--frames]
const path = require('path'), fs = require('fs');
const { renderFrame } = require('./kit');
const { chromium } = require('playwright');
const REPO = process.env.VV_REPO || path.resolve(__dirname, '../..');
const SP = process.env.VV_BUILD || path.join(require('os').tmpdir(), 'vinavvave-build');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inl = s => esc(s).replace(/\\\*/g, '*').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

// ---------- plan view (top-down setup diagram) ----------
function planView(pl, w = 300, h = 200) {
  if (!pl) return '';
  const X = v => (v * w).toFixed(1), Y = v => (v * h).toFixed(1); const A = '#0a8fd6';
  let s = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="#f4f6f8" stroke="#c9d0d6" stroke-width="1.5" rx="6"/>`;
  if (pl.room === 'outdoor') s = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="#eef3f6" stroke="#c9d0d6" stroke-width="1.5" rx="6" stroke-dasharray="5 4"/>`;
  for (const p of pl.props || []) {
    const [k, x, y, r = 0, L = 0.22] = p; const t = `translate(${X(x)},${Y(y)}) rotate(${r})`;
    if (k === 'piano') s += `<g transform="${t}"><rect x="${-L * w / 2}" y="-6" width="${L * w}" height="12" fill="#333" rx="2"/><rect x="${-L * w / 2 + 3}" y="1" width="${L * w - 6}" height="4" fill="#fff"/></g>`;
    else if (k === 'mirror') s += `<g transform="${t}"><rect x="${-L * w / 2}" y="-3" width="${L * w}" height="6" fill="#9fb3c4" stroke="#333" stroke-width="1.5"/></g>`;
    else if (k === 'chair') s += `<g transform="${t}"><rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#333" stroke-width="2.5"/><rect x="-8" y="-11" width="16" height="4" fill="#333"/></g>`;
    else if (k === 'mpc') s += `<g transform="${t}"><rect x="-11" y="-10" width="22" height="20" fill="#333" rx="2"/><rect x="-8" y="-7" width="10" height="5" fill="#fff"/></g>`;
    else if (k === 'table') s += `<g transform="${t}"><rect x="${-L * w / 2}" y="-14" width="${L * w}" height="28" fill="none" stroke="#777" stroke-width="2" rx="2"/></g>`;
    else if (k === 'glass') s += `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="#cfe0ff" stroke="#333" stroke-width="1.5"/>`;
    else if (k === 'sheet') s += `<g transform="${t}"><line x1="${-L * w / 2}" y1="0" x2="${L * w / 2}" y2="0" stroke="#999" stroke-width="5" stroke-dasharray="6 3"/></g>`;
    else if (k === 'rail') s += `<g transform="${t}"><line x1="${-L * w / 2}" y1="0" x2="${L * w / 2}" y2="0" stroke="#555" stroke-width="3"/>${Array.from({ length: 12 }, (_, i) => `<line x1="${-L * w / 2 + i * L * w / 11}" y1="-4" x2="${-L * w / 2 + i * L * w / 11}" y2="4" stroke="#555" stroke-width="2"/>`).join('')}</g>`;
    else if (k === 'river') s += `<g transform="${t}">${[0, 8, 16].map(o => `<path d="M${-L * w / 2},${o} q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="#7aa7c7" stroke-width="2"/>`).join('')}</g>`;
    else if (k === 'bench') s += `<g transform="${t}"><rect x="${-L * w / 2}" y="-5" width="${L * w}" height="10" fill="none" stroke="#555" stroke-width="2"/></g>`;
    else if (k === 'rig') s += `<g transform="${t}"><line x1="${-L * w / 2}" y1="0" x2="${L * w / 2}" y2="0" stroke="#b07a2a" stroke-width="4"/><rect x="${-L * w / 2 - 7}" y="-7" width="14" height="14" fill="none" stroke="#333" stroke-width="2"/><rect x="${L * w / 2 - 7}" y="-7" width="14" height="14" fill="none" stroke="#333" stroke-width="2"/></g>`;
    else if (k === 'label') s += `<text x="${X(x)}" y="${Y(y)}" font-size="11" fill="#555" font-family="Noto Sans SC" text-anchor="middle">${esc(p[3])}</text>`;
  }
  if (pl.light) { const [x, y, a, lab] = pl.light; const rad = a * Math.PI / 180; s += `<g><rect x="${(+X(x) - 18).toFixed(1)}" y="${(+Y(y) - 4).toFixed(1)}" width="36" height="8" fill="#ffd65a" stroke="#c9a227" stroke-width="1" transform="rotate(${a + 90},${X(x)},${Y(y)})"/>${[-14, 0, 14].map(o => { const ox = Math.cos(rad + Math.PI / 2) * o, oy = Math.sin(rad + Math.PI / 2) * o; return `<line x1="${(+X(x) + ox).toFixed(1)}" y1="${(+Y(y) + oy).toFixed(1)}" x2="${(+X(x) + ox + Math.cos(rad) * 26).toFixed(1)}" y2="${(+Y(y) + oy + Math.sin(rad) * 26).toFixed(1)}" stroke="#d9a400" stroke-width="2" marker-end="url(#pa)"/>`; }).join('')}<text x="${X(x)}" y="${(+Y(y) - 10).toFixed(1)}" font-size="12" fill="#9a7400" font-family="Noto Sans SC" font-weight="700" text-anchor="middle">${esc(lab || '光')}</text></g>`; }
  if (pl.me) { const [x, y, a, lab] = pl.me; const rad = a * Math.PI / 180; s += `<g><circle cx="${X(x)}" cy="${Y(y)}" r="9" fill="#222"/><path d="M${(+X(x) + Math.cos(rad) * 15).toFixed(1)},${(+Y(y) + Math.sin(rad) * 15).toFixed(1)} L${(+X(x) + Math.cos(rad + 0.5) * 8).toFixed(1)},${(+Y(y) + Math.sin(rad + 0.5) * 8).toFixed(1)} L${(+X(x) + Math.cos(rad - 0.5) * 8).toFixed(1)},${(+Y(y) + Math.sin(rad - 0.5) * 8).toFixed(1)}Z" fill="#222"/><text x="${(+X(x) + 13).toFixed(1)}" y="${(+Y(y) - 8).toFixed(1)}" font-size="13" fill="#222" font-family="Noto Sans SC" font-weight="700">${esc(lab || '他')}</text></g>`; }
  if (pl.cam) { const [x, y, a, fov = 24, lab] = pl.cam; const rad = a * Math.PI / 180, f = fov * Math.PI / 180, L = 70; s += `<g><path d="M${X(x)},${Y(y)} L${(+X(x) + Math.cos(rad - f) * L).toFixed(1)},${(+Y(y) + Math.sin(rad - f) * L).toFixed(1)} L${(+X(x) + Math.cos(rad + f) * L).toFixed(1)},${(+Y(y) + Math.sin(rad + f) * L).toFixed(1)}Z" fill="${A}" opacity="0.15"/><line x1="${X(x)}" y1="${Y(y)}" x2="${(+X(x) + Math.cos(rad - f) * L).toFixed(1)}" y2="${(+Y(y) + Math.sin(rad - f) * L).toFixed(1)}" stroke="${A}" stroke-width="1.2"/><line x1="${X(x)}" y1="${Y(y)}" x2="${(+X(x) + Math.cos(rad + f) * L).toFixed(1)}" y2="${(+Y(y) + Math.sin(rad + f) * L).toFixed(1)}" stroke="${A}" stroke-width="1.2"/><rect x="${(+X(x) - 5).toFixed(1)}" y="${(+Y(y) - 8).toFixed(1)}" width="10" height="16" rx="2" fill="${A}" transform="rotate(${a - 90},${X(x)},${Y(y)})"/><text x="${(+X(x) + 12).toFixed(1)}" y="${(+Y(y) + 5).toFixed(1)}" font-size="13" fill="${A}" font-family="Noto Sans SC" font-weight="700">${esc(lab || '手机')}</text></g>`; }
  if (pl.dist) { const [x1, y1, x2, y2, lab] = pl.dist; s += `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#888" stroke-width="1" stroke-dasharray="3 3"/><text x="${((+X(x1) + +X(x2)) / 2).toFixed(1)}" y="${((+Y(y1) + +Y(y2)) / 2 - 4).toFixed(1)}" font-size="12" fill="#555" font-family="Noto Sans SC" text-anchor="middle">${esc(lab)}</text>`; }
  if (pl.note) s += `<text x="8" y="${h - 8}" font-size="10.5" fill="#666" font-family="Noto Sans SC">${esc(pl.note)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block"><defs><marker id="pa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#d9a400"/></marker></defs>${s}</svg>`;
}

// ---------- tiny md → html (for the one-pager page) ----------
function md2html(md) {
  const L = md.split('\n'); let out = '', inList = false, inOl = false, inTable = false;
  const close = () => { if (inList) { out += '</ul>'; inList = false; } if (inOl) { out += '</ol>'; inOl = false; } if (inTable) { out += '</table>'; inTable = false; } };
  for (const raw of L) {
    const l = raw.trimEnd();
    if (/^# /.test(l)) { close(); out += `<h1>${inl(l.slice(2))}</h1>`; continue; }
    if (/^## /.test(l)) { close(); out += `<h2>${inl(l.slice(3))}</h2>`; continue; }
    if (/^\|/.test(l)) { if (/^\|[-| ]+\|$/.test(l)) continue; if (!inTable) { close(); out += '<table class="mt">'; inTable = true; } out += '<tr>' + l.split('|').slice(1, -1).map(c => `<td>${inl(c.trim())}</td>`).join('') + '</tr>'; continue; }
    if (/^- /.test(l)) { if (!inList) { close(); out += '<ul>'; inList = true; } out += `<li>${inl(l.slice(2))}</li>`; continue; }
    if (/^\d+\. /.test(l)) { if (!inOl) { close(); out += '<ol>'; inOl = true; } out += `<li>${inl(l.replace(/^\d+\. /, ''))}</li>`; continue; }
    if (!l.trim()) { close(); continue; }
    close(); out += `<p>${inl(l)}</p>`;
  }
  close(); return out;
}

const CSS = `
@page{size:210mm 297mm;margin:0}
*{box-sizing:border-box}
body{margin:0;background:#9aa3ab;font-family:'Noto Sans SC',sans-serif;color:#111}
.page{width:210mm;height:297mm;background:#fff;margin:0 auto 8mm;padding:11mm 11mm 9mm;position:relative;overflow:hidden;page-break-after:always}
.ph{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #111;padding-bottom:2.2mm;margin-bottom:4mm}
.ph .t{font-family:'Anton';font-size:19px;letter-spacing:.5px}
.ph .m{font-size:10px;color:#555;text-align:right;line-height:1.35}
.foot{position:absolute;bottom:5mm;left:11mm;right:11mm;font-size:9px;color:#888;display:flex;justify-content:space-between}
.cover h1{font-family:'Anton';font-size:34px;line-height:1.05;margin:0 0 2mm}
.cover h2{font-size:13px;margin:4mm 0 1.5mm}
.cover p,.cover li{font-size:11.2px;line-height:1.62;margin:.8mm 0}
.cover ul,.cover ol{margin:.5mm 0 1mm;padding-left:5mm}
.cover b{font-weight:900}
.cover .sub{font-size:12px;color:#444;margin-bottom:4mm}
.hero{position:absolute;bottom:13mm;left:11mm;right:11mm;display:flex;gap:3mm}
.hero figure{flex:1;margin:0}
.hero img{width:100%;aspect-ratio:9/16;object-fit:cover;display:block;border:1.2px solid #111;border-radius:1.5mm}
.hero figcaption{font-size:9px;color:#333;margin-top:1mm}
.grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:3.2mm;height:252mm}
.card{border:1.2px solid #222;border-radius:2mm;display:flex;overflow:hidden;background:#fff}
.card .fr{flex:0 0 auto;height:100%;aspect-ratio:9/16;background:#000;border-right:1.2px solid #222}
.card .fr svg{width:100%;height:100%;display:block}
.card .tx{flex:1;padding:2mm 2.2mm;font-size:8.6px;line-height:1.45;display:flex;flex-direction:column;gap:.7mm;min-width:0}
.card .hd{display:flex;align-items:baseline;gap:1.5mm;border-bottom:1px solid #ddd;padding-bottom:1mm;margin-bottom:.4mm}
.card .no{font-family:'Anton';font-size:17px}
.card .sec{background:#111;color:#fff;font-size:8px;padding:.3mm 1.3mm;border-radius:1mm;white-space:nowrap}
.card .du{font-size:8.5px;color:#444;margin-left:auto;white-space:nowrap}
.card .snd{font-size:8.6px;color:#0a6fa8;font-weight:700}
.card .k{font-weight:700;color:#000}
.card .nt{color:#a3361b}
.card .su{color:#333;background:#f1f4f6;border-radius:1mm;padding:.6mm 1mm}
table.st{width:100%;border-collapse:collapse;font-size:9.3px;line-height:1.45}
table.st td,table.st th{border:1px solid #cfd5da;padding:1.3mm 1.6mm;vertical-align:top;text-align:left}
table.st th{background:#111;color:#fff;font-weight:700}
.setups{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.setup{border:1.2px solid #222;border-radius:2mm;padding:2mm 2.4mm;font-size:8.6px;line-height:1.45}
.setup .row{display:flex;gap:2.4mm;margin-top:1.2mm}
.setup .pv{flex:0 0 40%}
.setup .st2{flex:1;min-width:0}
.setup .sn{font-family:'Anton';font-size:16px;margin-right:2mm}
.setup .sl{font-weight:700}
h3{font-size:12.5px;margin:3.5mm 0 1.6mm;border-left:3px solid #111;padding-left:2mm}
.small{font-size:9.6px;line-height:1.55}
.small li{margin:.4mm 0}
ul.small{padding-left:4.5mm;margin:0}
table.mt{border-collapse:collapse;font-size:9.5px;margin:1mm 0}
table.mt td{border:1px solid #ccc;padding:1mm 1.6mm}
`;

function header(spec, label, pn) { return `<div class="ph"><div class="t">${esc(spec.num)} · ${esc(spec.title)}</div><div class="m">VINAVVAVE · ${esc(spec.ep)}<br>${esc(label)}</div></div>`; }
function foot(spec, pn) { return `<div class="foot"><span>BEEJAYBEE · VINAVVAVE · 竖屏 1080×1920 · ${esc(spec.color)}</span><span>${pn}</span></div>`; }

function card(spec, sh) {
  const su = spec.setups.find(s => s.id === sh.setup) || {};
  const img = sh._img ? `<img src="file://${sh._img}" style="width:100%;height:100%;display:block">` : renderFrame(sh, {});
  return `<div class="card"><div class="fr">${img}</div><div class="tx">
  <div class="hd"><span class="no">${esc(sh.id)}</span><span class="sec">${esc(sh.sec)}</span><span class="du">${esc(sh.dur)}</span></div>
  <div class="snd">♪ ${esc(sh.sound)}</div>
  <div><span class="k">画面</span> ${inl(sh.desc)}</div>
  ${sh.act ? `<div><span class="k">动作</span> ${inl(sh.act)}</div>` : ''}
  ${sh.setup ? `<div class="su"><span class="k">机位 ${esc(sh.setup)}</span> ${esc(su.name || '')}${su.lens ? `<br>${esc(su.lens)} · ${esc(su.fps)}` : ''}${sh.cam ? (su.lens ? ' · ' : '<br>') + esc(sh.cam) : ''}</div>` : (sh.cam ? `<div class="su">${esc(sh.cam)}</div>` : '')}
  ${sh.post ? `<div><span class="k">剪辑</span> ${inl(sh.post)}</div>` : ''}
  ${sh.note ? `<div class="nt">⚠ ${inl(sh.note)}</div>` : ''}
  </div></div>`;
}

function scriptPages(spec) {
  const pages = [];
  // page: setups (机位) with plan views
  let s = `<div class="page">${header(spec, '拍摄脚本 · 机位表')}`;
  s += `<div class="small" style="margin-bottom:2.5mm"><b>本集：</b>${inl(spec.method)}<br><b>颜色：</b>${esc(spec.color)}　<b>成片：</b>${esc(spec.len)}　<b>设备：</b>iPhone 16 Pro Max 一部（无三脚架）＋ 家里现成的支撑。通用设置见《拍摄通用参数》。</div>`;
  if (spec.special && spec.special.length) s += `<h3>这一集的特殊设置</h3><ul class="small">${spec.special.map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  s += `<h3>机位（每个机位拍完之前不碰手机）</h3><div class="setups">`;
  for (const su of spec.setups) s += `<div class="setup"><div><span class="sn">${esc(su.id)}</span><b>${esc(su.name)}</b></div><div class="row"><div class="pv">${planView(su.plan)}</div><div class="st2"><div><span class="sl">镜头/帧率：</span>${esc(su.lens)} · ${esc(su.fps)}</div><div><span class="sl">支撑：</span>${inl(su.rig)}</div><div><span class="sl">曝光/对焦：</span>${inl(su.exp)}</div></div></div>${su.takes ? `<div style="margin-top:1mm"><span class="sl">要录的条：</span>${inl(su.takes)}</div>` : ''}</div>`;
  s += `</div>${foot(spec, '机位表')}</div>`;
  pages.push(s);
  // page: schedule + props + edit
  let t = `<div class="page">${header(spec, '拍摄脚本 · 时间表 / 道具 / 剪辑')}`;
  t += `<h3>拍摄顺序（≤ 3 小时）</h3><table class="st"><tr><th style="width:23%">时间</th><th style="width:15%">地点</th><th>做什么</th></tr>${spec.schedule.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${inl(r[2])}</td></tr>`).join('')}</table>`;
  t += `<h3>道具清单</h3><ul class="small">${spec.props.map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  t += `<h3>字（上屏设计）</h3><ul class="small">${spec.text.map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  t += `<h3>剪辑要点</h3><ul class="small">${spec.edit.map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  t += `<h3>开拍前 / 收工前检查</h3><ul class="small">${(spec.check || []).map(x => `<li>${inl(x)}</li>`).join('')}</ul>`;
  t += `${foot(spec, '时间表')}</div>`;
  pages.push(t);
  return pages;
}

function storyboardPages(spec) {
  const pages = []; const per = 6;
  for (let i = 0; i < spec.shots.length; i += per) {
    const chunk = spec.shots.slice(i, i + per); const pn = Math.floor(i / per) + 1, tot = Math.ceil(spec.shots.length / per);
    pages.push(`<div class="page sb">${header(spec, `分镜 ${pn}/${tot} · 按成片顺序`)}<div class="grid">${chunk.map(sh => card(spec, sh)).join('')}</div>${foot(spec, `分镜 ${pn}/${tot}`)}</div>`);
  }
  return pages;
}

function coverPage(spec) {
  const md = fs.readFileSync(path.join(REPO, `${spec.num}_${spec.slug}.md`), 'utf8');
  const hero = (spec.hero || []).map(id => spec.shots.find(x => x.id === id)).filter(Boolean);
  const strip = hero.length ? `<div class="hero">${hero.map(h => `<figure><img src="file://${h._img}"><figcaption><b>${esc(h.id)}</b> ${esc(h.sec)}</figcaption></figure>`).join('')}</div>` : '';
  return `<div class="page cover">${header(spec, '一页纸 · 创意')}${md2html(md)}${strip}${foot(spec, '一页纸')}</div>`;
}

function scriptMd(spec) {
  const L = [];
  L.push(`# ${spec.num} · ${spec.title} · 拍摄脚本`, '');
  L.push(`${spec.meaning}｜${spec.ep}｜${spec.len}｜颜色：${spec.color}`, '');
  L.push(`设备：iPhone 16 Pro Max 一部，没有三脚架，靠家里现成的东西固定。通用设置见 [拍摄通用参数](拍摄通用参数_iPhone16ProMax.md)。完整版（含分镜图）见 [PDF](pdf/${spec.num}_${spec.slug}_分镜脚本.pdf)。`, '');
  L.push(`**本集手法：**${spec.method}`, '');
  if (spec.special?.length) { L.push('## 这一集的特殊设置'); spec.special.forEach(x => L.push(`- ${x}`)); L.push(''); }
  L.push('## 机位表（每个机位拍完之前不碰手机）');
  for (const su of spec.setups) { L.push(`### 机位 ${su.id} · ${su.name}`); L.push(`- 镜头 / 帧率：${su.lens} · ${su.fps}`, `- 支撑：${su.rig}`, `- 曝光 / 对焦：${su.exp}`); if (su.takes) L.push(`- 要录的条：${su.takes}`); L.push(''); }
  L.push('## 分镜（按成片顺序）');
  spec.shots.forEach(sh => { L.push(`### ${sh.id} · ${sh.sec} · ${sh.dur}`, `- 声音：${sh.sound}`, `- 画面：${sh.desc}`); if (sh.act) L.push(`- 动作：${sh.act}`); if (sh.setup) L.push(`- 机位：${sh.setup}${sh.cam ? '（' + sh.cam + '）' : ''}`); else if (sh.cam) L.push(`- 机位：${sh.cam}`); if (sh.post) L.push(`- 剪辑：${sh.post}`); if (sh.note) L.push(`- 注意：${sh.note}`); L.push(''); });
  const nP = Math.ceil(spec.shots.length / 6); for (let i = 1; i <= nP; i++) L.push(`![分镜 ${i}](storyboards/${spec.num}_${spec.slug}_分镜${i}.jpg)`); L.push('');
  L.push('## 拍摄顺序（≤ 3 小时）', '| 时间 | 地点 | 做什么 |', '|---|---|---|'); spec.schedule.forEach(r => L.push(`| ${r[0]} | ${r[1]} | ${r[2]} |`)); L.push('');
  L.push('## 道具清单'); spec.props.forEach(x => L.push(`- ${x}`)); L.push('');
  L.push('## 字（上屏设计）'); spec.text.forEach(x => L.push(`- ${x}`)); L.push('');
  L.push('## 剪辑要点'); spec.edit.forEach(x => L.push(`- ${x}`)); L.push('');
  if (spec.check?.length) { L.push('## 开拍前 / 收工前检查'); spec.check.forEach(x => L.push(`- ${x}`)); L.push(''); }
  return L.join('\n').replace(/\*\*/g, '**');
}

async function build(specPath, opts = {}) {
  const spec = require(path.resolve(specPath));
  const outDir0 = path.join(SP, 'out', spec.num); fs.mkdirSync(path.join(outDir0, 'cards'), { recursive: true });
  { const b0 = await chromium.launch(); const q0 = await b0.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1.3 });
    for (const sh of spec.shots) { const f = path.join(outDir0, 'cards', `${sh.id}.jpg`); await q0.setContent(`<html><body style="margin:0">${renderFrame(sh, {})}</body></html>`); await q0.waitForTimeout(60); await q0.screenshot({ path: f, type: 'jpeg', quality: 84 }); sh._img = f; }
    await b0.close(); }
  const pages = [coverPage(spec), ...scriptPages(spec), ...storyboardPages(spec)];
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;
  const outDir = path.join(SP, 'out', spec.num); fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'doc.html'), html);
  fs.mkdirSync(path.join(REPO, 'storyboards'), { recursive: true }); fs.mkdirSync(path.join(REPO, 'pdf'), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(outDir, 'doc.html')); await p.waitForTimeout(400);
  await p.evaluate(() => document.fonts.ready);
  const sb = await p.$$('.page.sb');
  for (let i = 0; i < sb.length; i++) await sb[i].screenshot({ path: path.join(REPO, 'storyboards', `${spec.num}_${spec.slug}_分镜${i + 1}.jpg`), type: 'jpeg', quality: 86 });
  if (opts.preview) { const all = await p.$$('.page'); for (let i = 0; i < all.length; i++) await all[i].screenshot({ path: path.join(outDir, `page${i + 1}.png`) }); }
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: path.join(REPO, 'pdf', `${spec.num}_${spec.slug}_分镜脚本.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  if (opts.frames) { // clean 1080x1920 frames for the animatic
    const fdir = path.join(outDir, 'frames'); fs.mkdirSync(fdir, { recursive: true });
    const q = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    for (const sh of spec.shots) { await q.setContent(`<html><body style="margin:0">${renderFrame(sh, { noAnn: true, w: 1080, h: 1920 })}</body></html>`); await q.waitForTimeout(80); await q.screenshot({ path: path.join(fdir, `${sh.id}.png`) }); }
  }
  await b.close();
  fs.writeFileSync(path.join(REPO, `${spec.num}_${spec.slug}_拍摄脚本.md`), scriptMd(spec));
  console.log('built', spec.num, 'pages', pages.length);
}
if (require.main === module) build(process.argv[2], { frames: process.argv.includes('--frames'), preview: process.argv.includes('--preview') }).catch(e => { console.error(e); process.exit(1); });
module.exports = { build, planView, md2html, CSS };
