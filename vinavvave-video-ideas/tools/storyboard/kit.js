'use strict';
// VINAVVAVE storyboard kit — draws 9:16 frames (540x960 units) as SVG strings.
const W = 540, H = 960;
const P = {
  k0: '#020304', k1: '#06080b', k2: '#0b0f14', d1: '#121820', d2: '#1a222b', d3: '#252f3a',
  m1: '#333e4a', m2: '#495562', m3: '#626e7b', l1: '#838e9a', l2: '#a6b0ba', l3: '#c8d0d8', l4: '#e2e7ec', w: '#f4f6f8',
  blue: '#1b3c96', blue2: '#2c56c4', blue3: '#0a1844', ann: '#22b8ff'
};
const n = v => Math.round(v * 10) / 10;
const X = v => n(v * W), Y = v => n(v * H);
function rng(seed) { let s = ((seed || 1) * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

// ---------- geometry ----------
function smooth(pts, closed = true, t = 1) {
  const N = pts.length; const g = i => closed ? pts[((i % N) + N) % N] : pts[Math.max(0, Math.min(N - 1, i))];
  let d = `M${n(g(0)[0])},${n(g(0)[1])}`; const L = closed ? N : N - 1;
  for (let i = 0; i < L; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) * t / 6, p1[1] + (p2[1] - p0[1]) * t / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t / 6, p2[1] - (p3[1] - p1[1]) * t / 6];
    d += `C${n(c1[0])},${n(c1[1])} ${n(c2[0])},${n(c2[1])} ${n(p2[0])},${n(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
const poly = pts => 'M' + pts.map(p => `${n(p[0])},${n(p[1])}`).join('L') + 'Z';
function seg(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 0.001, th = Math.atan2(dy, dx);
  const ph = Math.acos(Math.max(-0.999, Math.min(0.999, (r1 - r2) / d))); const a = th + ph, b = th - ph;
  const p1 = [x1 + r1 * Math.cos(a), y1 + r1 * Math.sin(a)], p2 = [x2 + r2 * Math.cos(a), y2 + r2 * Math.sin(a)];
  const p3 = [x2 + r2 * Math.cos(b), y2 + r2 * Math.sin(b)], p4 = [x1 + r1 * Math.cos(b), y1 + r1 * Math.sin(b)];
  return `M${n(p1[0])},${n(p1[1])}L${n(p2[0])},${n(p2[1])}A${n(r2)},${n(r2)} 0 ${ph > Math.PI / 2 ? 1 : 0} 0 ${n(p3[0])},${n(p3[1])}L${n(p4[0])},${n(p4[1])}A${n(r1)},${n(r1)} 0 ${ph < Math.PI / 2 ? 1 : 0} 0 ${n(p1[0])},${n(p1[1])}Z`;
}
const chain = js => { const o = []; for (let i = 0; i < js.length - 1; i++) o.push(seg(...js[i], ...js[i + 1])); return o; };
function ell(cx, cy, rx, ry, rot = 0) {
  const t = rot * Math.PI / 180, sx = cx + rx * Math.cos(t), sy = cy + rx * Math.sin(t), ex = cx - rx * Math.cos(t), ey = cy - rx * Math.sin(t);
  return `M${n(sx)},${n(sy)}A${n(rx)},${n(ry)} ${rot} 1 0 ${n(ex)},${n(ey)}A${n(rx)},${n(ry)} ${rot} 1 0 ${n(sx)},${n(sy)}Z`;
}
const rotPts = (pts, deg, cx = 0, cy = 0) => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };

// ---------- context ----------
function Ctx() { let i = 0; this.defs = []; this.uid = p => `${p || 'i'}${++i}_${Math.floor(Math.random() * 1e6)}`; }

// ---------- figures (local units: standing height 1000, feet at y=0) ----------
const PROFILE = [[-50, 4], [-48, -30], [-30, -56], [0, -64], [30, -56], [45, -36], [50, -17], [47, -7], [53, 3], [61, 15], [52, 20], [53, 27], [49, 31], [52, 37], [46, 47], [35, 57], [14, 62], [-14, 60], [-36, 44]];
const profileHead = (cx, cy, s = 1, dir = 1, rot = 0) => smooth(rotPts(PROFILE.map(([x, y]) => [x * dir * s, y * s]), rot).map(([x, y]) => [cx + x, cy + y]));
const TORSO_SIDE = [[18, -852], [40, -822], [54, -772], [52, -690], [42, -604], [46, -520], [42, -462], [12, -444], [-40, -450], [-56, -516], [-46, -600], [-48, -690], [-52, -780], [-36, -836], [-14, -858]];
const TORSO_FRONT = [[-24, -852], [-72, -838], [-112, -822], [-130, -796], [-124, -746], [-106, -690], [-96, -612], [-98, -540], [-104, -470], [-98, -450], [0, -444], [98, -450], [104, -470], [98, -540], [96, -612], [106, -690], [124, -746], [130, -796], [112, -822], [72, -838], [24, -852], [0, -858]];
const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
const POSES = {
  stand_front(v = {}) {
    const p = [ell(0, -940, 46, 60), seg(0, -886, 19, 0, -842, 23), smooth(TORSO_FRONT)];
    for (const s of [-1, 1]) {
      const up = v.arms === 'open' ? [[s * 112, -798, 26], [s * 176, -652, 19], [s * 228, -522, 14]] : v.arms === 'up' && s === 1 ? [[112, -798, 26], [150, -960, 19], [172, -1112, 14]] : [[s * 114, -798, 28], [s * 130, -640, 21], [s * 122, -488, 15]];
      p.push(...chain(up)); const w = up[2]; p.push(ell(w[0] + (v.arms === 'open' ? s * 10 : (v.arms === 'up' && s === 1 ? 6 : -2 * s)), w[1] + (v.arms === 'up' && s === 1 ? -30 : 30), 16, 30, v.arms === 'open' ? s * 28 : 0));
      p.push(...chain([[s * 54, -468, 50], [s * 60, -245, 31], [s * 57, -32, 18]])); p.push(ell(s * 60, -13, 24, 13));
    }
    return { parts: p, bbox: [-150, -1000, 150, 0], head: [0, -940], torso: 2 };
  },
  stand_side(v = {}) {
    const p = [];
    p.push(...chain([[-12, -470, 46], [-4, -245, 28], [-12, -32, 16]]), ell(12, -13, 40, 12));
    p.push(...chain([[-6, -800, 25], [-14, -640, 18], [-8, -490, 13]]), ell(-6, -460, 14, 30));
    p.push(profileHead(6, -938, 0.95, 1, v.look === 'down' ? 18 : v.look === 'up' ? -22 : 0), seg(0, -890, 19, -4, -842, 23), smooth(TORSO_SIDE)); const T0 = p.length - 1;
    p.push(...chain([[-2, -470, 48], [10, -245, 29], [2, -32, 17]]), ell(28, -13, 42, 13));
    if (v.arm === 'forward') p.push(...chain([[0, -800, 27], [70, -700, 19], [190, -690, 14]]), ell(222, -690, 32, 13));
    else p.push(...chain([[0, -800, 27], [6, -640, 19], [14, -490, 14]]), ell(18, -460, 14, 30, -6));
    return { parts: p, bbox: [-70, -1004, 90, 0], head: [6, -938], torso: T0 };
  },
  walk_side(v = {}) {
    const p = [];
    p.push(...chain([[-10, -470, 46], [-48, -252, 28], [-118, -58, 16]]), ell(-96, -30, 38, 12, 35));
    if (!v.carry) p.push(...chain([[-4, -800, 25], [34, -650, 18], [66, -506, 13]]), ell(74, -478, 14, 30, -20));
    p.push(profileHead(14, -936, 0.95, 1), seg(8, -888, 19, 2, -842, 23), smooth(shift(TORSO_SIDE, 6, 0))); const T1 = p.length - 1;
    p.push(...chain([[2, -470, 48], [62, -262, 29], [92, -36, 17]]), ell(118, -14, 42, 13, 6));
    if (v.carry) p.push(...chain([[2, -800, 27], [56, -742, 19], [70, -856, 14]]), ell(72, -884, 14, 26));
    else p.push(...chain([[2, -800, 27], [-28, -650, 19], [-50, -502, 14]]), ell(-54, -472, 14, 30, 20));
    return { parts: p, bbox: [-150, -1000, 170, 0], head: [14, -936], torso: T1 };
  },
  sit_side(v = {}) {
    const p = [];
    p.push(...chain([[-6, -292, 46], [214, -306, 30], [228, -36, 17]]), ell(252, -14, 40, 12));
    const reach = v.hands === 'lap' ? [[[14, -628, 24], [40, -470, 18], [150, -330, 13]], [176, -326, 28, 11, 10]] : v.hands === 'up' ? [[[14, -628, 24], [80, -600, 18], [170, -560, 13]], [196, -556, 30, 11, -10]] : [[[14, -628, 24], [52, -482, 18], [160, -446, 13]], [188, -440, 30, 11, 8]];
    p.push(...chain(reach[0]), ell(...reach[1]));
    p.push(profileHead(58, -760, 0.95, 1, v.look === 'down' ? 20 : 0), seg(44, -712, 19, 30, -668, 23));
    p.push(smooth([[46, -676], [70, -640], [82, -580], [78, -500], [70, -420], [66, -340], [58, -270], [0, -258], [-46, -264], [-62, -320], [-54, -430], [-46, -540], [-34, -640], [-8, -684]]));
    p.push(...chain([[0, -290, 48], [224, -300, 31], [238, -34, 17]]), ell(262, -14, 42, 13));
    const r2 = reach[0].map(([x, y, r]) => [x + 10, y + 6, r + 1]); p.push(...chain(r2)); const h = reach[1]; p.push(ell(h[0] + 12, h[1] + 8, h[2] + 2, h[3] + 1, h[4]));
    return { parts: p, bbox: [-70, -824, 310, 0], head: [58, -760] };
  },
  sit_front(v = {}) {
    const p = [ell(0, -762, 46, 60), seg(0, -708, 19, 0, -664, 23), smooth(shift(TORSO_FRONT, 0, 178))];
    for (const s of [-1, 1]) {
      p.push(...chain([[s * 56, -290, 50], [s * 66, -236, 40]]), ...chain([[s * 66, -236, 34], [s * 64, -34, 18]]), ell(s * 66, -14, 24, 13));
      const arm = v.hands === 'keys' ? [[s * 112, -620, 26], [s * 130, -480, 19], [s * 70, -420, 14]] : [[s * 112, -620, 26], [s * 124, -470, 19], [s * 84, -332, 14]];
      p.push(...chain(arm), ell(arm[2][0] - s * 6, arm[2][1] + 22, 17, 26, s * 20));
    }
    return { parts: p, bbox: [-150, -822, 150, 0], head: [0, -762], torso: 2 };
  },
  sit_floor(v = {}) {
    const p = [];
    p.push(...chain([[0, -60, 48], [168, -258, 30], [204, -32, 17]]), ell(228, -12, 40, 12));
    p.push(profileHead(24, -520, 0.95, 1, v.look === 'down' ? 26 : 0), seg(10, -470, 19, 0, -430, 23));
    p.push(smooth([[18, -440], [44, -410], [60, -340], [52, -240], [40, -120], [30, -46], [-50, -20], [-92, -60], [-96, -170], [-80, -300], [-62, -400], [-34, -448]]));
    p.push(...chain([[6, -404, 26], [96, -330, 19], [166, -262, 14]]), ell(182, -256, 15, 26, -30));
    return { parts: p, bbox: [-110, -584, 270, 0], head: [24, -520] };
  },
  lie_back(v = {}) {
    const p = [];
    if (v.knee) p.push(...chain([[-10, -50, 44], [200, -200, 28], [330, -28, 16]]), ell(352, -14, 40, 12));
    else p.push(...chain([[-10, -46, 44], [226, -38, 28], [436, -24, 16]]), ell(452, -50, 13, 38));
    p.push(profileHead(-432, -62, 0.95, 1, -90), seg(-382, -54, 19, -350, -52, 23));
    p.push(smooth([[-352, -8], [-358, -94], [-300, -110], [-200, -104], [-100, -96], [-10, -92], [26, -62], [0, -6], [-120, -4], [-250, -4]]));
    p.push(...chain([[0, -48, 46], [230, -40, 29], [440, -26, 17]]), ell(458, -52, 13, 40));
    if (v.arm === 'eyes') p.push(...chain([[-320, -84, 26], [-330, -210, 19], [-430, -150, 14]]), ell(-450, -128, 15, 28, 60));
    else p.push(...chain([[-320, -70, 26], [-180, -44, 19], [-60, -34, 14]]), ell(-30, -30, 30, 14));
    return { parts: p, bbox: [-500, -240, 500, 0], head: [-432, -62] };
  },
  top_down(v = {}) {
    const p = [smooth([[-138, -6], [-124, -48], [-64, -70], [0, -76], [64, -70], [124, -48], [138, -6], [122, 40], [62, 62], [0, 66], [-62, 62], [-122, 40]])];
    for (const s of [-1, 1]) { const arm = v.hands === 'wide' ? [[s * 124, 4, 30], [s * 220, 140, 22], [s * 200, 300, 16]] : [[s * 124, 4, 30], [s * 162, 168, 22], [s * 96, 296, 16]]; p.push(...chain(arm), ell(arm[2][0] - s * 12, arm[2][1] + 34, 24, 38, -s * 18)); }
    p.push(ell(0, 18, 56, 62));
    return { parts: p, bbox: [-240, -80, 240, 380], head: [0, 18] };
  },
  worm(v = {}) { // seen from the floor, standing over the camera, looking down
    const p = [];
    for (const s of [-1, 1]) p.push(...chain([[s * 250, 520, 120], [s * 70, 40, 56]]));
    p.push(smooth([[-86, 60], [-118, -60], [-124, -150], [-70, -190], [0, -198], [70, -190], [124, -150], [118, -60], [86, 60]]));
    for (const s of [-1, 1]) p.push(...chain([[s * 118, -150, 34], [s * 170, 20, 26], [s * 182, 160, 20]]), ell(s * 186, 190, 22, 34));
    p.push(ell(0, -232, 52, 50));
    return { parts: p, bbox: [-380, -300, 380, 640], head: [0, -232] };
  },
  lotus(v = {}) { // seated cross-legged, front view
    const p = [ell(0, -550, 46, 60), seg(0, -496, 19, 0, -452, 23), smooth(shift(TORSO_FRONT, 0, 390))];
    for (const sg of [-1, 1]) {
      p.push(...chain([[sg * 54, -80, 50], [sg * 190, -42, 34]]), ...chain([[sg * 190, -42, 30], [-sg * 40, -26, 20]]), ell(-sg * 62, -24, 30, 14));
      p.push(...chain([[sg * 114, -408, 28], [sg * 150, -250, 21], [sg * 180, -112, 15]]), ell(sg * 186, -86, 16, 26, sg * 10));
    }
    return { parts: p, bbox: [-240, -620, 240, 0], head: [0, -550], torso: 2 };
  },
  slump_side(v = {}) { // asleep, leaning forward onto a surface (piano/desk), facing right
    const p = [];
    p.push(...chain([[-6, -292, 46], [214, -306, 30], [228, -36, 17]]), ell(252, -14, 40, 12));
    p.push(smooth([[-46, -264], [-62, -330], [-36, -430], [30, -520], [110, -575], [170, -588], [196, -560], [164, -518], [104, -468], [64, -400], [52, -330], [42, -272], [0, -258]]));
    p.push(...chain([[150, -560, 26], [226, -478, 19], [330, -476, 14]]), ell(352, -474, 30, 12));
    p.push(profileHead(232, -540, 0.95, 1, 75));
    p.push(...chain([[0, -290, 48], [224, -300, 31], [238, -34, 17]]), ell(262, -14, 42, 13));
    return { parts: p, bbox: [-80, -640, 380, 0], head: [232, -540] };
  },
  bust_front(v = {}) { // head & shoulders, 1000 = head-to-chest
    const p = [ell(0, -620, 150, 196), seg(0, -440, 70, 0, -330, 82), smooth([[-90, -360], [-260, -320], [-420, -250], [-480, -120], [-500, 0], [500, 0], [480, -120], [420, -250], [260, -320], [90, -360]])];
    return { parts: p, bbox: [-500, -820, 500, 0], head: [0, -620] };
  }
};

function figureShapes(o) { const pose = POSES[o.pose](o.v || {}); return pose; }
function figTransform(o) { const s = (o.h || 0.5) * H / 1000; return { s, tr: `translate(${X(o.x)},${Y(o.y)}) rotate(${o.rot || 0}) scale(${o.flip ? -s : s},${s})` }; }
function fig(c, o) {
  const pose = figureShapes(o); const { s, tr } = figTransform(o); const tone = o.tone || 'sil';
  const body = pose.parts.map(d => `<path d="${d}"/>`).join('');
  let fill = P.k1, pre = '';
  if (o.color) fill = o.color;
  else if (tone === 'lit' || tone === 'litblue') {
    const id = c.uid('fg'); const [x0, , x1] = pose.bbox; const R = o.light === 'right';
    const flip = o.flip ? -1 : 1; const ax = R ? x1 : x0, bx = R ? x0 : x1; // light side in local coords (pre-flip)
    const A = flip > 0 ? ax : bx, B = flip > 0 ? bx : ax;
    const c1 = tone === 'litblue' ? P.blue2 : P.l1, c2 = tone === 'litblue' ? P.blue : P.m2, c3 = tone === 'litblue' ? P.blue3 : P.k2;
    c.defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${A}" y1="0" x2="${B}" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="0.5" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>`);
    fill = `url(#${id})`;
  } else if (tone === 'white') fill = P.w; else if (tone === 'gray') fill = P.m2; else if (tone === 'ghost') fill = P.l3; else if (tone === 'dark') fill = P.d2; else if (tone === 'blue') fill = P.blue;
  if (tone === 'rim') {
    const dx = (o.light === 'left' ? -1 : 1) * (o.rimw || 3.5);
    const t2 = `translate(${n(X(o.x) + dx)},${Y(o.y) - 1}) rotate(${o.rot || 0}) scale(${o.flip ? -s : s},${s})`;
    pre = `<g transform="${t2}" fill="${o.rimc || P.l4}" opacity="0.95">${body}</g>`;
  }
  let flt = '';
  if (o.blur) { const id = c.uid('bl'); c.defs.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${o.blur}"/></filter>`); flt = ` filter="url(#${id})"`; }
  let gs = '';
  if (o.shadow) gs = `<ellipse cx="${X(o.x)}" cy="${Y(o.y) + 2}" rx="${n(s * 220)}" ry="${n(s * 26)}" fill="${P.k0}" opacity="0.55" filter="${blurF(c, 4)}"/>`;
  let shirtx = '';
  if (o.shirt && pose.torso != null) { const sid = c.uid('sb'); c.defs.push(`<linearGradient id="${sid}" gradientUnits="userSpaceOnUse" x1="${pose.bbox[0]}" y1="0" x2="${pose.bbox[2]}" y2="0"><stop offset="0" stop-color="${P.blue2}"/><stop offset="0.55" stop-color="${P.blue}"/><stop offset="1" stop-color="${P.blue3}"/></linearGradient>`); shirtx = `<g transform="${tr}" fill="url(#${sid})" opacity="${o.shirtOp ?? 1}"><path d="${pose.parts[pose.torso]}"/></g>`; }
  let topx = '';
  if (o.pose === 'top_down' && tone !== 'sil') { topx = `<g transform="${tr}"><path d="${ell(0, 18, 56, 62)}" fill="${P.k0}"/><path d="${ell(-14, 4, 22, 30, -20)}" fill="${P.m2}" opacity="0.35"/></g>`; }
  return `<g opacity="${o.op ?? 1}"${flt}>${gs}${pre}<g transform="${tr}" fill="${fill}">${body}</g>${shirtx}${topx}</g>`;
}
function figClip(c, o) { const pose = figureShapes(o); const { tr } = figTransform(o); const id = c.uid('fc'); c.defs.push(`<clipPath id="${id}"><g transform="${tr}">${pose.parts.map(d => `<path d="${d}"/>`).join('')}</g></clipPath>`); return id; }

// ---------- faces (local box ~1000 units, centre near nose bridge) ----------
function face34(c, o) {
  const s = (o.s || 0.6) * W / 1000; const tr = `translate(${X(o.x)},${Y(o.y)}) scale(${o.flip ? -s : s},${s})`;
  const id = k => c.uid(k);
  const skin = id('sk'), shirt = id('sh'), cheek = id('ck'), headc = id('hc'), b4 = id('b'), b8 = id('b'), b2 = id('b'), hair = id('hr');
  const blue = o.blue; const shA = blue ? P.blue2 : P.m1, shM = blue ? P.blue : P.d2, shB = blue ? P.blue3 : P.k1;
  c.defs.push(`<linearGradient id="${skin}" gradientUnits="userSpaceOnUse" x1="-260" y1="-300" x2="300" y2="200"><stop offset="0" stop-color="${P.l2}"/><stop offset="0.38" stop-color="${P.l1}"/><stop offset="0.7" stop-color="${P.m2}"/><stop offset="1" stop-color="${P.d2}"/></linearGradient>`,
    `<linearGradient id="${shirt}" gradientUnits="userSpaceOnUse" x1="-560" y1="0" x2="560" y2="0"><stop offset="0" stop-color="${shA}"/><stop offset="0.5" stop-color="${shM}"/><stop offset="1" stop-color="${shB}"/></linearGradient>`,
    `<radialGradient id="${cheek}" gradientUnits="userSpaceOnUse" cx="40" cy="-30" r="230"><stop offset="0" stop-color="${P.w}" stop-opacity="0.5"/><stop offset="1" stop-color="${P.w}" stop-opacity="0"/></radialGradient>`,
    `<linearGradient id="${hair}" gradientUnits="userSpaceOnUse" x1="-260" y1="-400" x2="200" y2="-150"><stop offset="0" stop-color="${P.d2}"/><stop offset="0.45" stop-color="${P.k1}"/><stop offset="1" stop-color="${P.k0}"/></linearGradient>`,
    `<filter id="${b2}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter>`,
    `<filter id="${b4}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>`,
    `<filter id="${b8}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>`);
  const HEAD = [[-170, 150], [-232, 40], [-258, -90], [-246, -222], [-182, -330], [-80, -386], [40, -388], [140, -348], [204, -272], [230, -182], [240, -122], [231, -96], [248, -60], [276, 4], [292, 36], [276, 52], [252, 58], [257, 80], [262, 98], [252, 112], [259, 126], [252, 142], [246, 172], [230, 206], [196, 230], [130, 242], [50, 232], [-40, 192], [-96, 140], [-132, 104]];
  c.defs.push(`<clipPath id="${headc}"><path d="${smooth(HEAD, true, 0.9)}"/></clipPath>`);
  const shade = `<path d="${smooth([[150, -300], [210, -268], [236, -182], [246, -122], [236, -96], [254, -60], [282, 4], [300, 36], [282, 56], [262, 64], [266, 98], [266, 128], [258, 150], [252, 176], [236, 212], [200, 240], [180, 214], [196, 172], [190, 142], [180, 116], [196, 92], [222, 66], [232, 42], [212, -10], [196, -60], [178, -120], [166, -200]])}" fill="${P.k1}" filter="url(#${b4})" opacity="0.97"/>`;
  const eyes = o.eyes === 'closed'
    ? `<path d="${smooth([[56, -84], [96, -96], [138, -84]], false)}" stroke="${P.k0}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="${smooth([[56, -82], [96, -98], [140, -84], [98, -72]])}" fill="${P.k1}"/><circle cx="102" cy="-84" r="11" fill="${P.k0}"/><circle cx="97" cy="-88" r="3.4" fill="${P.l4}"/><path d="${smooth([[52, -84], [96, -102], [144, -86]], false)}" stroke="${P.k0}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `<g transform="${tr}" opacity="${o.op ?? 1}">
  <path d="${smooth([[-640, 640], [-590, 470], [-460, 372], [-290, 322], [-150, 304], [-60, 330], [70, 340], [190, 314], [320, 326], [460, 380], [590, 470], [640, 640]])}" fill="url(#${shirt})"/>
  <path d="${smooth([[-90, 350], [40, 366], [170, 344], [120, 392], [0, 404], [-110, 380]])}" fill="${P.k0}" opacity="0.45"/>
  <path d="${smooth([[-170, 100], [-60, 190], [60, 236], [170, 240], [196, 316], [70, 362], [-120, 352], [-196, 290]])}" fill="url(#${skin})"/>
  <path d="${smooth([[-60, 200], [60, 240], [180, 246], [200, 300], [160, 352], [40, 336], [-60, 280]])}" fill="${P.k0}" opacity="0.62" filter="url(#${b8})"/>
  <path d="${smooth(HEAD, true, 0.9)}" fill="url(#${skin})"/>
  <g clip-path="url(#${headc})">
    <circle cx="40" cy="-30" r="230" fill="url(#${cheek})"/>
    <path d="${smooth([[-130, 130], [-40, 190], [60, 222], [150, 232], [200, 246], [130, 270], [0, 262], [-120, 210]])}" fill="${P.d2}" opacity="0.35" filter="url(#${b8})"/>
    ${shade}
    <path d="${ell(96, -84, 74, 34)}" fill="${P.d3}" opacity="0.55" filter="url(#${b4})"/>
    <path d="${ell(238, 62, 44, 12, -8)}" fill="${P.k0}" opacity="0.6" filter="url(#${b2})"/>
    <path d="${ell(212, 152, 40, 10)}" fill="${P.k1}" opacity="0.5" filter="url(#${b2})"/>
  </g>
  <path d="${smooth([[-170, 140], [-232, 40], [-262, -92], [-252, -230], [-188, -342], [-80, -404], [44, -404], [150, -360], [214, -282], [190, -282], [130, -300], [50, -306], [-30, -290], [-84, -228], [-96, -150], [-98, -66], [-118, -40], [-150, -50], [-176, -10], [-190, 60], [-186, 120]], true, 0.9)}" fill="url(#${hair})"/>
  <path d="${smooth([[-150, -68], [-112, -84], [-86, -46], [-82, 4], [-94, 44], [-118, 62], [-140, 46], [-156, -10]])}" fill="${P.m2}"/>
  <path d="${smooth([[-136, -50], [-110, -58], [-98, -24], [-104, 14], [-120, 28], [-128, -6]])}" fill="${P.d3}"/>
  <path d="${smooth([[34, -122], [90, -140], [150, -138], [190, -120], [184, -110], [150, -124], [92, -126], [38, -110]])}" fill="${P.k1}"/>
  ${eyes}
  <path d="${smooth([[226, -96], [244, -104], [256, -92], [242, -86]])}" fill="${P.k0}" opacity="0.85"/>
  <path d="M168,-74 C200,-40 236,-6 258,30" stroke="${P.l4}" stroke-width="6" fill="none" opacity="0.32" filter="url(#${b2})"/>
  <path d="${ell(270, 30, 13, 9)}" fill="${P.l3}" opacity="0.45"/>
  <path d="${ell(238, 48, 15, 7, -12)}" fill="${P.k0}"/>
  <path d="${smooth([[148, 110], [196, 96], [236, 98], [258, 110], [230, 114], [196, 112]])}" fill="${P.d3}" opacity="0.8"/>
  <path d="${smooth([[146, 112], [198, 110], [236, 114], [258, 112]], false)}" stroke="${P.k0}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="${ell(196, 128, 44, 8)}" fill="${P.l3}" opacity="0.35"/>
  <path d="${ell(150, 196, 46, 16)}" fill="${P.l3}" opacity="0.18" filter="url(#${b2})"/>
  </g>`;
}
function faceFront(c, o) { // symmetric frontal face, light from above (icon)
  const s = (o.s || 0.6) * W / 1000; const tr = `translate(${X(o.x)},${Y(o.y)}) scale(${s},${s})`;
  const g = c.uid('ff'), b = c.uid('b'), sh = c.uid('sh');
  c.defs.push(`<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="0" cy="-200" r="420"><stop offset="0" stop-color="${P.l3}"/><stop offset="0.55" stop-color="${P.l1}"/><stop offset="1" stop-color="${P.d2}"/></radialGradient>`,
    `<filter id="${b}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>`,
    `<linearGradient id="${sh}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.blue ? P.blue : P.d2}"/><stop offset="1" stop-color="${P.k1}"/></linearGradient>`);
  const half = (d) => d; // already symmetric
  return `<g transform="${tr}" opacity="${o.op ?? 1}">
  <path d="${smooth([[-600, 640], [-560, 470], [-430, 380], [-200, 330], [0, 350], [200, 330], [430, 380], [560, 470], [600, 640]])}" fill="url(#${sh})"/>
  <path d="${smooth([[-110, 120], [110, 120], [130, 340], [0, 380], [-130, 340]])}" fill="${P.m2}"/>
  <path d="${smooth([[-60, 220], [60, 220], [110, 300], [0, 330], [-110, 300]])}" fill="${P.k1}" opacity="0.6" filter="url(#${b})"/>
  <path d="${smooth([[0, -430], [150, -400], [230, -280], [240, -120], [210, 40], [150, 190], [60, 270], [0, 282], [-60, 270], [-150, 190], [-210, 40], [-240, -120], [-230, -280], [-150, -400]])}" fill="url(#${g})"/>
  <path d="${smooth([[0, -440], [160, -410], [244, -290], [250, -150], [222, -170], [190, -290], [90, -330], [0, -322], [-90, -330], [-190, -290], [-222, -170], [-250, -150], [-244, -290], [-160, -410]])}" fill="${P.k1}"/>
  ${[-1, 1].map(k => `<path d="${ell(k * 95, -100, 70, 38)}" fill="${P.k2}" opacity="0.6" filter="url(#${b})"/><path d="${smooth([[k * 50, -100], [k * 95, -118], [k * 140, -98], [k * 95, -88]])}" fill="${P.k1}"/><circle cx="${k * 95}" cy="-103" r="11" fill="${P.k0}"/><path d="${smooth([[k * 40, -158], [k * 100, -178], [k * 156, -160], [k * 150, -150], [k * 100, -164], [k * 46, -148]])}" fill="${P.k1}"/>`).join('')}
  <path d="M0,-80 L0,40" stroke="${P.w}" stroke-width="10" opacity="0.25" filter="url(#${b})"/>
  <path d="${ell(0, 66, 52, 16)}" fill="${P.k1}" opacity="0.6" filter="url(#${b})"/>
  <path d="${smooth([[-26, 54], [0, 60], [26, 54], [0, 66]])}" fill="${P.k0}"/>
  <path d="${smooth([[-70, 130], [0, 122], [70, 130]], false)}" stroke="${P.k0}" stroke-width="6" fill="none"/>
  <path d="${ell(0, 150, 46, 10)}" fill="${P.l3}" opacity="0.3"/>
  <path d="${ell(0, 186, 60, 18)}" fill="${P.k1}" opacity="0.35" filter="url(#${b})"/>
  ${o.eyes === 'closed' ? [-1, 1].map(k => `<path d="${smooth([[k * 50, -100], [k * 95, -118], [k * 140, -98], [k * 95, -88]])}" fill="${P.l1}"/><path d="${smooth([[k * 50, -98], [k * 95, -90], [k * 140, -98]], false)}" stroke="${P.k0}" stroke-width="5" fill="none"/>`).join('') : ''}
  </g>`;
}

// ---------- hands ----------
function hand(c, o) { // o.k: 'hover' (side view, fingers curling down), 'top' (palm down from above)
  const s = (o.s || 0.3) * W / 300; const tr = `translate(${X(o.x)},${Y(o.y)}) rotate(${o.rot || 0}) scale(${o.flip ? -s : s},${s})`;
  const fill = o.tone === 'lit' ? (()=>{const g=c.uid('hg'); c.defs.push(`<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="-90" y1="-40" x2="170" y2="70"><stop offset="0" stop-color="${P.l2}"/><stop offset="0.6" stop-color="${P.l1}"/><stop offset="1" stop-color="${P.m2}"/></linearGradient>`); return `url(#${g})`;})() : o.tone === 'white' ? P.w : o.tone === 'gray' ? P.m2 : P.k1;
  let parts = [];
  if (o.k === 'top') {
    parts.push(smooth([[-42, 0], [-50, 60], [-44, 112], [0, 120], [46, 112], [52, 60], [40, 0]]));
    parts.push(...chain([[-34, 108, 12], [-42, 206, 10]]), ...chain([[-11, 116, 12.5], [-13, 228, 10.5]]), ...chain([[12, 114, 12], [16, 214, 10]]), ...chain([[34, 104, 10.5], [44, 178, 9]]), ...chain([[-40, 40, 15], [-78, 94, 13], [-92, 138, 11]]));
    parts.push(seg(0, -60, 34, 0, 10, 40));
  } else {
    const pr = o.press ? 10 : 0;
    parts.push(smooth([[-90, -24], [0, -28], [62, -32], [112, -22], [142, -8 + pr * 0.3], [164, 12 + pr], [174, 40 + pr], [172, 62 + pr], [160, 66 + pr], [151, 42 + pr], [138, 22 + pr * 0.6], [122, 16], [100, 24], [72, 32], [108, 50], [118, 60], [108, 66], [72, 56], [36, 44], [0, 32], [-90, 28]], true, 0.8));
  }
  let lines = '';
  if (o.k !== 'top') lines = [0, 1, 2].map(i => `<path d="M${118 + i * 7},${-14 + i * 6} C${146 + i * 6},${0 + i * 6} ${160 + i * 3},${26 + i * 4} ${164 + i * 1},${52 + i * 3}" stroke="${o.tone === 'lit' ? P.d3 : P.m1}" stroke-width="2.4" fill="none" opacity="0.8"/>`).join('');
  return `<g transform="${tr}" fill="${fill}" opacity="${o.op ?? 1}">${parts.map(d => `<path d="${d}"/>`).join('')}${lines}</g>`;
}

// ---------- backgrounds ----------
function grad(c, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) { const id = c.uid('lg'); c.defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, col, op]) => `<stop offset="${o}" stop-color="${col}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`); return `url(#${id})`; }
function rgrad(c, cx, cy, r, stops) { const id = c.uid('rg'); c.defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, col, op]) => `<stop offset="${o}" stop-color="${col}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient>`); return `url(#${id})`; }
function blurF(c, sd) { const id = c.uid('bf'); c.defs.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${id})`; }
function skyline(c, y, o = {}) {
  const r = rng(o.seed || 7); let x = -10, out = ''; const col = o.col || P.k1; const hMax = (o.hmax || 0.14) * H;
  while (x < W + 10) { const w = 14 + r() * 34; const h = (0.15 + r() * 0.85) * hMax * (r() < 0.12 ? 1.8 : 1); out += `<rect x="${n(x)}" y="${n(y - h)}" width="${n(w)}" height="${n(h + 2)}" fill="${col}"/>`;
    if (o.lights) for (let k = 0; k < h / 9; k++) if (r() < 0.28) out += `<rect x="${n(x + 3 + r() * (w - 6))}" y="${n(y - h + 5 + k * 9)}" width="2" height="2.6" fill="${P.l3}" opacity="${n(0.4 + r() * 0.5)}"/>`;
    x += w + (r() < 0.3 ? 2 + r() * 8 : 0); }
  return out;
}
function bg(c, o) {
  const k = o.k;
  if (k === 'black') return `<rect width="${W}" height="${H}" fill="${P.k0}"/>`;
  if (k === 'white') return `<rect width="${W}" height="${H}" fill="${P.w}"/>`;
  if (k === 'gray') return `<rect width="${W}" height="${H}" fill="${o.col || P.m1}"/>`;
  if (k === 'wall') return `<rect width="${W}" height="${H}" fill="${grad(c, [[0, P.d2], [0.6, P.d1], [1, P.k1]])}"/><circle cx="${X(o.lx ?? 0.7)}" cy="${Y(o.ly ?? 0.35)}" r="${X(o.lr ?? 0.9)}" fill="${rgrad(c, X(o.lx ?? 0.7), Y(o.ly ?? 0.35), X(o.lr ?? 0.9), [[0, P.l1, 0.45], [1, P.l1, 0]])}"/>${o.floor ? `<rect y="${Y(o.floor)}" width="${W}" height="${H - Y(o.floor)}" fill="${grad(c, [[0, P.d3], [1, P.k1]])}"/>` : ''}`;
  if (k === 'attic') {
    const day = o.tone !== 'night'; const ap = [0.5, o.apex ?? 0.1], ey = o.eave ?? 0.5, fy = o.floor ?? 0.8, wx = o.wallx ?? 0.1;
    const wall = poly([[X(wx), Y(fy)], [X(wx), Y(ey)], [X(ap[0]), Y(ap[1])], [X(1 - wx), Y(ey)], [X(1 - wx), Y(fy)]]);
    let s = `<rect width="${W}" height="${H}" fill="${P.k1}"/>`;
    s += `<path d="${wall}" fill="${grad(c, [[0, day ? P.m1 : P.d2], [0.7, day ? P.d3 : P.d1], [1, P.d1]])}"/>`;
    if (o.window === 'round' || o.window === 'rect') {
      const wy = Y(o.wy ?? 0.3), wr = X(o.wr ?? 0.065);
      s += `<circle cx="${W / 2}" cy="${wy}" r="${n(wr * 4.5)}" fill="${rgrad(c, W / 2, wy, wr * 4.5, [[0, P.l4, day ? 0.55 : 0.3], [1, P.l4, 0]])}"/>`;
      s += o.window === 'round' ? `<circle cx="${W / 2}" cy="${wy}" r="${wr}" fill="${P.w}"/>${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${W / 2}" y1="${wy}" x2="${n(W / 2 + wr * Math.cos(a))}" y2="${n(wy + wr * Math.sin(a))}" stroke="${P.d3}" stroke-width="2.5"/>`; }).join('')}<circle cx="${W / 2}" cy="${wy}" r="${n(wr * 0.3)}" fill="none" stroke="${P.d3}" stroke-width="2.5"/>` : `<rect x="${n(W / 2 - wr * 0.6)}" y="${n(wy - wr * 1.3)}" width="${n(wr * 1.2)}" height="${n(wr * 2.6)}" fill="${P.w}"/><line x1="${W / 2}" y1="${n(wy - wr * 1.3)}" x2="${W / 2}" y2="${n(wy + wr * 1.3)}" stroke="${P.d3}" stroke-width="3"/>`;
    }
    const lp = poly([[X(0.5), -20], [X(ap[0]), Y(ap[1])], [X(wx), Y(ey)], [0, Y(ey + 0.12)], [0, -20]]), rp = poly([[X(0.5), -20], [X(ap[0]), Y(ap[1])], [X(1 - wx), Y(ey)], [W, Y(ey + 0.12)], [W, -20]]);
    s += `<path d="${lp}" fill="${grad(c, [[0, P.k2], [1, day ? P.d2 : P.d1]], 0, 0, 1, 1)}"/><path d="${rp}" fill="${grad(c, [[0, P.k2], [1, day ? P.d3 : P.d1]], 1, 0, 0, 1)}"/>`;
    for (let i = 1; i <= 6; i++) { const t = i / 7; const ly = Y(ap[1]) + (Y(ey) - Y(ap[1])) * t, lx = X(ap[0]) - (X(ap[0]) - X(wx)) * t; const fx = 0, fy2 = Y(ey + 0.12) * (t) - 20 * (1 - t); s += `<line x1="${n(lx)}" y1="${n(ly)}" x2="${fx}" y2="${n(fy2 + (Y(ey + 0.12) - fy2) * 0.0)}" stroke="${P.k0}" stroke-width="${n(2 + t * 5)}" opacity="0.65"/><line x1="${n(W - lx)}" y1="${n(ly)}" x2="${W}" y2="${n(fy2)}" stroke="${P.k0}" stroke-width="${n(2 + t * 5)}" opacity="0.65"/>`; }
    s += `<line x1="${X(wx)}" y1="${Y(ey)}" x2="${X(1 - wx)}" y2="${Y(ey)}" stroke="${P.k1}" stroke-width="7"/>`;
    s += `<path d="${poly([[X(wx), Y(ey)], [X(wx), Y(fy)], [0, Y(fy + 0.1)], [0, Y(ey + 0.12)]])}" fill="${P.d1}"/><path d="${poly([[X(1 - wx), Y(ey)], [X(1 - wx), Y(fy)], [W, Y(fy + 0.1)], [W, Y(ey + 0.12)]])}" fill="${P.d1}"/>`;
    s += `<path d="${poly([[X(wx), Y(fy)], [X(1 - wx), Y(fy)], [W, Y(fy + 0.1)], [W, H], [0, H], [0, Y(fy + 0.1)]])}" fill="${grad(c, [[0, day ? P.d3 : P.d2], [1, P.k1]])}"/>`;
    for (let i = -6; i <= 6; i++) s += `<line x1="${n(W / 2 + i * 22)}" y1="${Y(fy)}" x2="${n(W / 2 + i * 110)}" y2="${H}" stroke="${P.k1}" stroke-width="1.5" opacity="0.6"/>`;
    return s;
  }
  if (k === 'roof_up') { // phone face-down on the floor looking up at the A-frame
    let s = `<rect width="${W}" height="${H}" fill="${P.d1}"/>`;
    s += `<path d="${poly([[0, 0], [W / 2, 0], [W / 2, H], [0, H]])}" fill="${grad(c, [[0, P.d3], [1, P.k2]], 1, 0, 0, 0)}"/><path d="${poly([[W, 0], [W / 2, 0], [W / 2, H], [W, H]])}" fill="${grad(c, [[0, P.d2], [1, P.k2]], 0, 0, 1, 0)}"/>`;
    for (let i = -8; i <= 8; i++) { const y = H / 2 + i * 70 + Math.sign(i) * i * i * 3; s += `<path d="M0,${n(y + 40)} L${W / 2},${n(y)} L${W},${n(y + 40)}" fill="none" stroke="${P.k0}" stroke-width="${n(5 - Math.abs(i) * 0.3)}" opacity="0.7"/>`; }
    s += `<rect x="${W / 2 - 7}" y="0" width="14" height="${H}" fill="${P.k0}"/>`;
    if (o.sky) s += `<path d="${poly([[X(0.62), Y(0.18)], [X(0.86), Y(0.22)], [X(0.86), Y(0.38)], [X(0.62), Y(0.34)]])}" fill="${P.w}"/>`;
    return s;
  }
  if (k === 'balcony' || k === 'sky' || k === 'river' || k === 'park') {
    const hz = o.hz ?? (k === 'sky' ? 0.95 : k === 'balcony' ? 0.7 : 0.62); const t = o.time || 'dusk';
    const top = t === 'night' ? P.k1 : t === 'day' ? P.l1 : P.m1, mid = t === 'night' ? P.d2 : t === 'day' ? P.l3 : P.l2, low = t === 'night' ? P.m1 : t === 'day' ? P.l4 : P.w;
    let s = `<rect width="${W}" height="${H}" fill="${grad(c, [[0, top], [0.6, mid], [1, low]])}"/>`;
    if (o.sun !== false && t !== 'night') { const sx = X(o.sunx ?? 0.62), sy = Y(o.suny ?? hz - 0.04); s += `<circle cx="${sx}" cy="${sy}" r="${X(0.55)}" fill="${rgrad(c, sx, sy, X(0.55), [[0, P.w, 0.9], [0.25, P.w, 0.35], [1, P.w, 0]])}"/><circle cx="${sx}" cy="${sy}" r="${X(0.035)}" fill="${P.w}"/>`; }
    if (o.clouds) { const r = rng(o.seed || 3); for (let i = 0; i < 6; i++) s += `<ellipse cx="${n(r() * W)}" cy="${n(Y(0.1 + r() * (hz - 0.3)))}" rx="${n(60 + r() * 120)}" ry="${n(8 + r() * 14)}" fill="${t === 'night' ? P.d3 : P.l4}" opacity="${n(0.25 + r() * 0.3)}" filter="${blurF(c, 6)}"/>`; }
    if (k === 'park') { s += skyline(c, Y(hz), { col: P.m2, hmax: 0.08, seed: o.seed || 11, lights: t === 'night' }); s += `<rect y="${Y(hz)}" width="${W}" height="${H - Y(hz)}" fill="${grad(c, [[0, P.d3], [1, P.k1]])}"/>`; const r = rng(5); for (let i = 0; i < 4; i++) { const tx = r() * W, ty = Y(hz) + 6 + r() * 20, tr = 30 + r() * 40; s += `<rect x="${n(tx - 3)}" y="${n(ty - tr)}" width="6" height="${n(tr)}" fill="${P.k1}"/><circle cx="${n(tx)}" cy="${n(ty - tr)}" r="${n(tr * 0.7)}" fill="${P.k1}"/><circle cx="${n(tx - tr * 0.4)}" cy="${n(ty - tr * 0.8)}" r="${n(tr * 0.5)}" fill="${P.k1}"/>`; } }
    if (k === 'river') { s += skyline(c, Y(hz), { col: t === 'night' ? P.k1 : P.d2, hmax: o.hmax || 0.16, seed: o.seed || 21, lights: t === 'night' }); s += `<rect y="${Y(hz)}" width="${W}" height="${H - Y(hz)}" fill="${grad(c, [[0, t === 'night' ? P.d2 : P.m2], [1, P.k1]])}"/>`; const r = rng(9); for (let i = 0; i < 70; i++) { const yy = Y(hz) + 4 + Math.pow(r(), 1.6) * (H - Y(hz)) * 0.8, ww = 6 + r() * 40; s += `<rect x="${n(r() * W)}" y="${n(yy)}" width="${n(ww)}" height="1.6" fill="${P.l3}" opacity="${n(0.15 + r() * 0.4)}"/>`; } if (o.sun !== false && t !== 'night') s += `<rect x="${n(X(o.sunx ?? 0.62) - 14)}" y="${Y(hz)}" width="28" height="${n((H - Y(hz)) * 0.7)}" fill="${grad(c, [[0, P.w, 0.7], [1, P.w, 0]])}"/>`; if (o.rail) { const ry = Y(o.rail); s += `<rect y="${ry}" width="${W}" height="10" fill="${P.k1}"/><rect y="${ry + 60}" width="${W}" height="6" fill="${P.k1}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 48 + 10}" y="${ry}" width="7" height="${H - ry}" fill="${P.k1}"/>`).join('')}<rect y="${ry + 120}" width="${W}" height="${H - ry - 120}" fill="${P.k1}"/>`; } }
    if (k === 'balcony') { s += skyline(c, Y(hz), { col: t === 'night' ? P.k1 : P.d3, hmax: 0.12, seed: o.seed || 13, lights: t === 'night' }); s += `<rect y="${Y(hz)}" width="${W}" height="${H - Y(hz)}" fill="${P.k1}"/>`; const ry = Y(o.rail ?? hz + 0.02); s += `<rect y="${ry}" width="${W}" height="9" fill="${P.k0}"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 36 + 6}" y="${ry}" width="5" height="${n(H * 0.12)}" fill="${P.k0}"/>`).join('')}<rect y="${n(ry + H * 0.12)}" width="${W}" height="${H}" fill="${P.k0}"/>`; }
    return s;
  }
  if (k === 'desk_top' || k === 'floor_top') {
    let s = `<rect width="${W}" height="${H}" fill="${k === 'desk_top' ? P.d2 : P.d1}"/>`; const r = rng(4);
    for (let i = 0; i < 9; i++) s += `<rect x="${i * 64}" y="0" width="1.5" height="${H}" fill="${P.k1}" opacity="0.7"/>`;
    for (let i = 0; i < 140; i++) s += `<rect x="${n(r() * W)}" y="${n(r() * H)}" width="1" height="${n(20 + r() * 80)}" fill="${P.d3}" opacity="${n(0.3 + r() * 0.4)}"/>`;
    if (o.pool) s += `<ellipse cx="${X(o.pool[0])}" cy="${Y(o.pool[1])}" rx="${X(o.pool[2])}" ry="${X(o.pool[2] * 0.9)}" fill="${rgrad(c, X(o.pool[0]), Y(o.pool[1]), X(o.pool[2]), [[0, P.l2, 0.5], [1, P.l2, 0]])}"/>`;
    return s;
  }
  if (k === 'mirror_room') { return bg(c, { k: 'wall', lx: 0.85, ly: 0.3, lr: 0.9, floor: o.floor ?? 0.82 }); }
  return `<rect width="${W}" height="${H}" fill="${P.d1}"/>`;
}

// ---------- props ----------
function piano(c, o) {
  const v = o.view || 'front', x = X(o.x), y = Y(o.y), w = X(o.w || 0.9), rot = o.rot || 0; let s = '';
  if (v === 'front') {
    const kh = w * (o.depth || 0.05), bh = w * 0.035;
    s += `<rect x="${n(-w / 2)}" y="${n(-bh)}" width="${n(w)}" height="${n(bh)}" fill="${P.d1}"/><rect x="${n(-w / 2)}" y="${n(-bh)}" width="${n(w)}" height="2" fill="${P.m2}"/>`;
    s += `<rect x="${n(-w / 2 + w * 0.02)}" y="0" width="${n(w * 0.96)}" height="${n(kh)}" fill="${P.l3}"/>`;
    const kw = w * 0.96 / 52; for (let i = 1; i < 52; i++) s += `<rect x="${n(-w / 2 + w * 0.02 + i * kw - 0.4)}" y="0" width="0.8" height="${n(kh)}" fill="${P.m2}"/>`;
    const notes = 'ABCDEFG'; for (let i = 0; i < 51; i++) { const nt = notes[i % 7]; if ('ACDFG'.includes(nt)) s += `<rect x="${n(-w / 2 + w * 0.02 + (i + 1) * kw - kw * 0.3)}" y="0" width="${n(kw * 0.6)}" height="${n(kh * 0.62)}" fill="${P.k1}"/>`; }
    s += `<rect x="${n(-w / 2)}" y="${n(kh)}" width="${n(w)}" height="${n(w * 0.028)}" fill="${P.k1}"/>`;
    if (o.stand !== false) s += `<path d="M${n(-w * 0.32)},${n(kh + w * 0.03)} L${n(-w * 0.22)},${n(Y(o.floorY ?? 0.85) - y)} M${n(-w * 0.22)},${n(kh + w * 0.03)} L${n(-w * 0.32)},${n(Y(o.floorY ?? 0.85) - y)} M${n(w * 0.32)},${n(kh + w * 0.03)} L${n(w * 0.22)},${n(Y(o.floorY ?? 0.85) - y)} M${n(w * 0.22)},${n(kh + w * 0.03)} L${n(w * 0.32)},${n(Y(o.floorY ?? 0.85) - y)}" stroke="${P.k1}" stroke-width="${n(w * 0.012)}"/>`;
  } else if (v === 'top') {
    const L = w, D = w * 0.21, kd = D * 0.55;
    s += `<rect x="${n(-L / 2)}" y="${n(-D / 2)}" width="${n(L)}" height="${n(D)}" rx="4" fill="${P.d1}"/><rect x="${n(-L / 2 + L * 0.02)}" y="${n(D / 2 - kd - D * 0.06)}" width="${n(L * 0.96)}" height="${n(kd)}" fill="${P.l3}"/>`;
    const kw = L * 0.96 / 52; for (let i = 1; i < 52; i++) s += `<rect x="${n(-L / 2 + L * 0.02 + i * kw - 0.4)}" y="${n(D / 2 - kd - D * 0.06)}" width="0.8" height="${n(kd)}" fill="${P.m2}"/>`;
    const notes = 'ABCDEFG'; for (let i = 0; i < 51; i++) if ('ACDFG'.includes(notes[i % 7])) s += `<rect x="${n(-L / 2 + L * 0.02 + (i + 1) * kw - kw * 0.3)}" y="${n(D / 2 - kd - D * 0.06)}" width="${n(kw * 0.6)}" height="${n(kd * 0.6)}" fill="${P.k1}"/>`;
    s += `<rect x="${n(-L * 0.42)}" y="${n(-D * 0.36)}" width="${n(L * 0.1)}" height="${n(D * 0.12)}" rx="2" fill="${P.d3}"/>`;
  } else if (v === 'end') {
    const L = w, h = w * 0.36; s += `<rect x="${n(-L / 2)}" y="${n(-h)}" width="${n(L)}" height="${n(h)}" rx="3" fill="${P.d1}"/><rect x="${n(-L / 2)}" y="${n(-h)}" width="${n(L)}" height="3" fill="${P.m3}"/><rect x="${n(L / 2 - L * 0.62)}" y="${n(-h - 3)}" width="${n(L * 0.62)}" height="5" fill="${P.l2}"/>`;
    if (o.stand !== false) s += `<path d="M${n(-L * 0.3)},0 L${n(L * 0.25)},${n(Y(o.floorY ?? 0.85) - y)} M${n(L * 0.3)},0 L${n(-L * 0.25)},${n(Y(o.floorY ?? 0.85) - y)}" stroke="${P.k1}" stroke-width="${n(L * 0.07)}"/>`;
  } else if (v === 'slab') {
    const L = w, T = w * 0.1; s += `<rect x="${n(-L / 2)}" y="${n(-T / 2)}" width="${n(L)}" height="${n(T)}" rx="3" fill="${P.d1}"/><rect x="${n(-L / 2 + L * 0.03)}" y="${n(T * 0.15)}" width="${n(L * 0.94)}" height="${n(T * 0.3)}" fill="${P.l3}" opacity="0.85"/>`;
    const kw = L * 0.94 / 52; for (let i = 1; i < 52; i++) s += `<rect x="${n(-L / 2 + L * 0.03 + i * kw - 0.4)}" y="${n(T * 0.15)}" width="0.8" height="${n(T * 0.3)}" fill="${P.m2}"/>`;
  } else if (v === 'close') { // keys close-up in perspective, keys running toward camera
    const N = o.keys || 9, kw = w / N; for (let i = 0; i < N; i++) s += `<path d="${poly([[-w / 2 + i * kw, 0], [-w / 2 + (i + 1) * kw, 0], [-w * 0.9 + (i + 1) * kw * 1.8, H], [-w * 0.9 + i * kw * 1.8, H]])}" fill="${P.l3}" stroke="${P.m2}" stroke-width="1.2"/>`;
    for (let i = 0; i < N - 1; i++) if ([0, 1, 3, 4, 5].includes(i % 7)) s += `<path d="${poly([[-w / 2 + (i + 0.7) * kw, 0], [-w / 2 + (i + 1.3) * kw, 0], [-w * 0.9 + (i + 1.3) * kw * 1.8, H * 0.55], [-w * 0.9 + (i + 0.7) * kw * 1.8, H * 0.55]])}" fill="${P.k1}"/>`;
  }
  if (o.sil) s = s.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${P.k1}"`).replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${P.k1}"`);
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${o.flip ? -1 : 1},1)" opacity="${o.op ?? 1}">${s}</g>`;
}
function mpc(c, o) {
  const x = X(o.x), y = Y(o.y), w = X(o.w || 0.6), rot = o.rot || 0, h = w * 0.92; let s = '';
  s += `<rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.04)}" fill="${P.d1}" stroke="${P.k0}" stroke-width="2"/>`;
  const sw = w * 0.56, sh = w * 0.3, sx = -w / 2 + w * 0.06, sy = -h / 2 + w * 0.06;
  if (o.glow !== false) s += `<rect x="${n(sx - sw * 0.3)}" y="${n(sy - sh * 0.4)}" width="${n(sw * 1.6)}" height="${n(sh * 1.8)}" fill="${rgrad(c, 0, 0, 1, [[0, P.w, 0.5], [1, P.w, 0]]).replace('userSpaceOnUse', '')}" opacity="0"/>`;
  s += `<rect x="${n(sx)}" y="${n(sy)}" width="${n(sw)}" height="${n(sh)}" rx="3" fill="${o.screen === 'off' ? P.d3 : o.blue ? P.blue2 : P.l4}"/>`;
  if (o.screen !== 'off') for (let i = 0; i < 4; i++) s += `<rect x="${n(sx + sw * 0.08)}" y="${n(sy + sh * (0.2 + i * 0.18))}" width="${n(sw * (0.3 + (i % 3) * 0.18))}" height="${n(sh * 0.06)}" fill="${P.m2}" opacity="0.6"/>`;
  s += `<circle cx="${n(w * 0.3)}" cy="${n(sy + sh * 0.5)}" r="${n(w * 0.09)}" fill="${P.k1}" stroke="${P.m1}" stroke-width="2"/>`;
  const px0 = -w / 2 + w * 0.36, py0 = -h / 2 + h * 0.42, pg = w * 0.135;
  for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const lit = o.lit && o.lit.includes(r * 4 + q); s += `<rect x="${n(px0 + q * pg)}" y="${n(py0 + r * pg)}" width="${n(pg * 0.86)}" height="${n(pg * 0.86)}" rx="${n(pg * 0.12)}" fill="${lit ? P.w : P.m1}" stroke="${P.k1}" stroke-width="1.5"/>`; if (lit) s += `<rect x="${n(px0 + q * pg - pg * 0.4)}" y="${n(py0 + r * pg - pg * 0.4)}" width="${n(pg * 1.66)}" height="${n(pg * 1.66)}" rx="${n(pg * 0.5)}" fill="${P.w}" opacity="0.25" filter="${blurF(c, 6)}"/>`; }
  for (let i = 0; i < 6; i++) s += `<rect x="${n(-w / 2 + w * 0.07)}" y="${n(py0 + i * pg * 0.6)}" width="${n(w * 0.2)}" height="${n(pg * 0.36)}" rx="2" fill="${P.d3}"/>`;
  return `<g transform="translate(${x},${y}) rotate(${rot})" opacity="${o.op ?? 1}">${s}</g>`;
}
function clock(c, o) {
  const x = X(o.x), y = Y(o.y), r = X(o.r || 0.3); const [hh, mm, ss] = (o.time || '10:10:30').split(':').map(Number);
  const ha = ((hh % 12) + mm / 60) * 30, ma = mm * 6, sa = (ss || 0) * 6; const hand_ = (a, L, w, col) => `<line x1="0" y1="${n(r * 0.12)}" x2="0" y2="${n(-L)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" transform="rotate(${a})"/>`;
  let s = `<circle r="${n(r * 1.08)}" fill="${P.k1}"/><circle r="${n(r)}" fill="${rgrad(c, 0, -r * 0.3, r * 1.3, [[0, P.l4], [1, P.l1]])}"/>`;
  for (let i = 0; i < 60; i++) s += `<line x1="0" y1="${n(-r * 0.9)}" x2="0" y2="${n(-r * (i % 5 ? 0.86 : 0.78))}" stroke="${P.k1}" stroke-width="${i % 5 ? 1.5 : 4}" transform="rotate(${i * 6})"/>`;
  if (o.blurSec) s += `<path d="M0,0 L${n(r * 0.85 * Math.sin((sa - 40) * Math.PI / 180))},${n(-r * 0.85 * Math.cos((sa - 40) * Math.PI / 180))} A${n(r * 0.85)},${n(r * 0.85)} 0 0 1 ${n(r * 0.85 * Math.sin(sa * Math.PI / 180))},${n(-r * 0.85 * Math.cos(sa * Math.PI / 180))} Z" fill="${P.k1}" opacity="0.15"/>`;
  s += hand_(ha, r * 0.5, n(r * 0.06), P.k1) + hand_(ma, r * 0.78, n(r * 0.04), P.k1) + hand_(sa, r * 0.85, 1.6, P.k0) + `<circle r="${n(r * 0.05)}" fill="${P.k0}"/>`;
  s += `<path d="M${n(-r * 0.7)},${n(-r * 0.6)} A${n(r)},${n(r)} 0 0 1 ${n(r * 0.2)},${n(-r * 0.95)}" stroke="${P.w}" stroke-width="${n(r * 0.06)}" fill="none" opacity="0.35"/>`;
  return `<g transform="translate(${x},${y})" opacity="${o.op ?? 1}">${s}</g>`;
}
function chair(c, o) {
  const x = X(o.x), y = Y(o.y), h = Y(o.h || 0.3), col = o.tone === 'lit' ? P.m2 : o.tone === 'white' ? P.w : P.k1, v = o.view || 'side'; let s = '';
  if (v === 'side') { const sy = -h * 0.5, sw = h * 0.42; s += `<rect x="${n(-sw / 2)}" y="${n(sy)}" width="${n(sw)}" height="${n(h * 0.045)}" fill="${col}"/><rect x="${n(-sw / 2)}" y="${n(-h)}" width="${n(h * 0.04)}" height="${n(h)}" fill="${col}"/><rect x="${n(sw / 2 - h * 0.035)}" y="${n(sy)}" width="${n(h * 0.035)}" height="${n(-sy)}" fill="${col}"/><rect x="${n(-sw / 2)}" y="${n(-h * 0.92)}" width="${n(h * 0.1)}" height="${n(h * 0.3)}" fill="${col}"/>`; }
  else { const sw = h * 0.5; s += `<rect x="${n(-sw / 2)}" y="${n(-h)}" width="${n(sw)}" height="${n(h * 0.34)}" rx="3" fill="${col}"/><rect x="${n(-sw / 2)}" y="${n(-h * 0.52)}" width="${n(sw)}" height="${n(h * 0.06)}" fill="${col}"/><rect x="${n(-sw / 2)}" y="${n(-h)}" width="${n(h * 0.035)}" height="${n(h)}" fill="${col}"/><rect x="${n(sw / 2 - h * 0.035)}" y="${n(-h)}" width="${n(h * 0.035)}" height="${n(h)}" fill="${col}"/><rect x="${n(-sw * 0.38)}" y="${n(-h * 0.46)}" width="${n(h * 0.03)}" height="${n(h * 0.46)}" fill="${col}"/><rect x="${n(sw * 0.38 - h * 0.03)}" y="${n(-h * 0.46)}" width="${n(h * 0.03)}" height="${n(h * 0.46)}" fill="${col}"/>`; }
  return `<g transform="translate(${x},${y}) scale(${o.flip ? -1 : 1},1)" opacity="${o.op ?? 1}">${s}</g>`;
}
function mirror(c, o, inner) {
  const x = X(o.x), y = Y(o.y), w = X(o.w || 0.35), h = Y(o.h || 0.6); const id = c.uid('mc');
  c.defs.push(`<clipPath id="${id}"><rect x="${n(x - w / 2)}" y="${n(y - h)}" width="${n(w)}" height="${n(h)}"/></clipPath>`);
  let s = `<rect x="${n(x - w / 2 - 6)}" y="${n(y - h - 6)}" width="${n(w + 12)}" height="${n(h + 12)}" fill="${P.k1}"/>`;
  s += `<rect x="${n(x - w / 2)}" y="${n(y - h)}" width="${n(w)}" height="${n(h)}" fill="${grad(c, [[0, P.m1], [0.5, P.d3], [1, P.d2]], 0, 0, 1, 1)}"/>`;
  s += `<g clip-path="url(#${id})">${inner || ''}<path d="${poly([[x - w / 2, y - h * 0.2], [x - w / 2 + w * 0.35, y - h], [x - w / 2 + w * 0.5, y - h], [x - w / 2, y - h * 0.05]])}" fill="${P.w}" opacity="0.08"/></g>`;
  if (o.stand !== false) s += `<path d="M${n(x - w * 0.35)},${n(y + 6)} L${n(x - w * 0.5)},${n(y + h * 0.08)} M${n(x + w * 0.35)},${n(y + 6)} L${n(x + w * 0.5)},${n(y + h * 0.08)}" stroke="${P.k1}" stroke-width="5"/>`;
  return `<g opacity="${o.op ?? 1}">${s}</g>`;
}
function nonla(c, o) {
  const x = X(o.x), y = Y(o.y), w = X(o.w || 0.4), v = o.view || 'side'; let s = '';
  if (v === 'side') { const h = w * 0.36; s += `<path d="M${n(-w / 2)},0 C${n(-w * 0.3)},${n(-h * 0.25)} ${n(-w * 0.08)},${n(-h * 0.85)} 0,${n(-h)} C${n(w * 0.08)},${n(-h * 0.85)} ${n(w * 0.3)},${n(-h * 0.25)} ${n(w / 2)},0 Q0,${n(h * 0.12)} ${n(-w / 2)},0Z" fill="${o.tone === 'white' ? P.w : P.k1}"/>`; }
  else { // from below / backlit: radial ribs = rose window / halo
    const R = w / 2; s += `<circle r="${n(R * 1.6)}" fill="${rgrad(c, 0, 0, R * 1.6, [[0, P.w, 0.9], [0.55, P.w, 0.35], [1, P.w, 0]])}"/><circle r="${n(R)}" fill="${o.lit === false ? P.k1 : P.l4}"/>`;
    for (let i = 1; i <= 12; i++) s += `<circle r="${n(R * i / 12)}" fill="none" stroke="${P.d3}" stroke-width="${i % 3 ? 1 : 2.4}" opacity="0.7"/>`;
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; s += `<line x1="0" y1="0" x2="${n(R * Math.cos(a))}" y2="${n(R * Math.sin(a))}" stroke="${P.d2}" stroke-width="2.4" opacity="0.8"/>`; }
    s += `<circle r="${n(R * 0.06)}" fill="${P.k1}"/><circle r="${n(R)}" fill="none" stroke="${P.k1}" stroke-width="5"/>`;
  }
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0})" opacity="${o.op ?? 1}">${s}</g>`;
}
function glass(c, o) {
  const x = X(o.x), y = Y(o.y), h = Y(o.h || 0.2), w = h * 0.62, lv = o.level ?? 0.6, col = o.liquid === 'blue' ? P.blue : o.liquid === 'black' ? P.k1 : P.m2;
  let s = `<path d="${poly([[-w / 2, -h], [w / 2, -h], [w * 0.42, 0], [-w * 0.42, 0]])}" fill="${P.l3}" opacity="0.18" stroke="${P.l3}" stroke-width="2"/>`;
  if (lv > 0) { const ly = -h * lv, lw = w * 0.42 + (w / 2 - w * 0.42) * lv; s += `<path d="${poly([[-lw, ly], [lw, ly], [w * 0.42, -h * 0.08], [-w * 0.42, -h * 0.08]])}" fill="${col}" opacity="0.92"/><ellipse cx="0" cy="${n(ly)}" rx="${n(lw)}" ry="${n(h * 0.03)}" fill="${o.liquid === 'blue' ? P.blue2 : P.l1}" opacity="0.8"/>`; }
  s += `<rect x="${n(-w * 0.42)}" y="${n(-h * 0.08)}" width="${n(w * 0.84)}" height="${n(h * 0.08)}" fill="${P.l3}" opacity="0.35"/><path d="M${n(-w * 0.3)},${n(-h * 0.9)} L${n(-w * 0.26)},${n(-h * 0.15)}" stroke="${P.w}" stroke-width="3" opacity="0.6"/><ellipse cx="0" cy="${n(-h)}" rx="${n(w / 2)}" ry="${n(h * 0.035)}" fill="none" stroke="${P.l3}" stroke-width="2" opacity="0.7"/>`;
  return `<g transform="translate(${x},${y}) rotate(${o.rot || 0})" opacity="${o.op ?? 1}">${s}</g>`;
}
function windowP(c, o) { const x = X(o.x), y = Y(o.y), w = X(o.w || 0.25), h = Y(o.h || 0.3); return `<g opacity="${o.op ?? 1}"><rect x="${n(x - w / 2 - 6)}" y="${n(y - h / 2 - 6)}" width="${n(w + 12)}" height="${n(h + 12)}" fill="${P.k1}"/><rect x="${n(x - w / 2)}" y="${n(y - h / 2)}" width="${n(w)}" height="${n(h)}" fill="${o.col || P.w}"/><rect x="${n(x - 3)}" y="${n(y - h / 2)}" width="6" height="${n(h)}" fill="${P.k1}"/><rect x="${n(x - w / 2)}" y="${n(y - 3)}" width="${n(w)}" height="6" fill="${P.k1}"/></g>`; }
function sheet(c, o) { // hanging white cloth (veil) pinned at two top corners; o.fall 0..1 slides it down
  const x = X(o.x), y0 = Y(o.y), w = X(o.w || 0.4), h = Y(o.h || 0.5), f = o.fall || 0; const y = y0 + h * f * 0.95, hh = h * (1 - f * 0.55);
  const pts = [[x - w / 2, y], [x - w * 0.15, y + hh * 0.02], [x + w * 0.15, y + hh * 0.02], [x + w / 2, y], [x + w * 0.56, y + hh * 0.45], [x + w * 0.62, y + hh * 0.96], [x + w * 0.3, y + hh], [x + w * 0.05, y + hh * 0.97], [x - w * 0.22, y + hh], [x - w * 0.6, y + hh * 0.95], [x - w * 0.55, y + hh * 0.45]];
  let s = '';
  if (o.glow) s += `<ellipse cx="${x}" cy="${n(y + hh / 2)}" rx="${n(w * 1.1)}" ry="${n(hh * 0.8)}" fill="${rgrad(c, x, y + hh / 2, w * 1.3, [[0, P.w, 0.65], [1, P.w, 0]])}"/>`;
  const g = grad(c, [[0, o.glow ? P.w : P.l3], [1, o.glow ? P.l3 : P.l1]]);
  s += `<path d="${smooth(pts, true, 0.7)}" fill="${g}" opacity="${o.op ?? 0.96}"/>`;
  for (let i = 1; i < 6; i++) { const fx = x - w / 2 + i * w / 6; s += `<path d="M${n(fx)},${n(y + 4)} C${n(fx + 8)},${n(y + hh * 0.35)} ${n(fx - 10)},${n(y + hh * 0.7)} ${n(fx + (i - 3) * 6)},${n(y + hh * 0.97)}" stroke="${P.m2}" stroke-width="${i % 2 ? 4 : 2.5}" fill="none" opacity="0.28"/>`; }
  s += `<circle cx="${n(x - w / 2)}" cy="${n(y)}" r="4" fill="${P.k1}"/><circle cx="${n(x + w / 2)}" cy="${n(y)}" r="4" fill="${P.k1}"/>`;
  return `<g>${s}</g>`;
}
function torchBeam(c, o) { // cone of light from a point
  const x = X(o.x), y = Y(o.y), L = X(o.len || 0.9), a = o.angle ?? 90, sp = o.spread ?? 16; const t1 = (a - sp) * Math.PI / 180, t2 = (a + sp) * Math.PI / 180;
  const id = c.uid('tb'); c.defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${x}" cy="${y}" r="${L}"><stop offset="0" stop-color="${P.w}" stop-opacity="${o.str ?? 0.75}"/><stop offset="1" stop-color="${P.w}" stop-opacity="0"/></radialGradient>`);
  return `<path d="M${x},${y} L${n(x + L * Math.cos(t1))},${n(y + L * Math.sin(t1))} A${L},${L} 0 0 1 ${n(x + L * Math.cos(t2))},${n(y + L * Math.sin(t2))} Z" fill="url(#${id})" filter="${blurF(c, o.soft ?? 6)}"/>`;
}

// ---------- light ----------
function light(c, o) {
  const k = o.k;
  if (k === 'beam') { const [x1, y1] = o.from, [x2, y2] = o.to; const w0 = X(o.w0 || 0.05), w1 = X(o.w1 || 0.3); const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)) + Math.PI / 2; const ca = Math.cos(a), sa = Math.sin(a);
    const pts = [[X(x1) + ca * w0 / 2, Y(y1) + sa * w0 / 2], [X(x2) + ca * w1 / 2, Y(y2) + sa * w1 / 2], [X(x2) - ca * w1 / 2, Y(y2) - sa * w1 / 2], [X(x1) - ca * w0 / 2, Y(y1) - sa * w0 / 2]];
    const id = c.uid('bm'); c.defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}"><stop offset="0" stop-color="${o.col || P.w}" stop-opacity="${o.str ?? 0.55}"/><stop offset="1" stop-color="${o.col || P.w}" stop-opacity="${o.end ?? 0.08}"/></linearGradient>`);
    let s = `<path d="${poly(pts)}" fill="url(#${id})" filter="${blurF(c, o.soft ?? 10)}"/>`;
    if (o.dust) { const r = rng(o.seed || 17); for (let i = 0; i < 40; i++) { const t = r(), u = r() - 0.5; const px = X(x1) + (X(x2) - X(x1)) * t + ca * (w0 + (w1 - w0) * t) * u, py = Y(y1) + (Y(y2) - Y(y1)) * t + sa * (w0 + (w1 - w0) * t) * u; s += `<circle cx="${n(px)}" cy="${n(py)}" r="${n(0.6 + r() * 1.4)}" fill="${P.w}" opacity="${n(0.3 + r() * 0.6)}"/>`; } }
    return s; }
  if (k === 'halo') { const x = X(o.x), y = Y(o.y), r = X(o.r || 0.4); return `<circle cx="${x}" cy="${y}" r="${r}" fill="${rgrad(c, x, y, r, [[0, o.col || P.w, o.str ?? 0.9], [0.35, o.col || P.w, (o.str ?? 0.9) * 0.45], [1, o.col || P.w, 0]])}"/>${o.ring ? `<circle cx="${x}" cy="${y}" r="${n(r * 0.42)}" fill="none" stroke="${P.w}" stroke-width="3" opacity="0.7"/>` : ''}`; }
  if (k === 'pool') { const x = X(o.x), y = Y(o.y), rx = X(o.rx || 0.35), ry = Y(o.ry || 0.05); return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${rgrad(c, x, y, rx, [[0, P.w, o.str ?? 0.5], [1, P.w, 0]])}" transform="translate(${x},${y}) scale(1,${n(ry / rx)}) translate(${-x},${-y})"/>`; }
  if (k === 'rays') { const x = X(o.x), y = Y(o.y), L = X(o.len || 1.2); let s = ''; const r = rng(o.seed || 2); for (let i = 0; i < (o.n || 14); i++) { const a = (o.a0 ?? 0) + i * (o.span ?? 360) / (o.n || 14) + r() * 6; const t = a * Math.PI / 180, w = 2 + r() * 10; s += `<path d="M${x},${y} L${n(x + L * Math.cos(t - w / 400))},${n(y + L * Math.sin(t - w / 400))} L${n(x + L * Math.cos(t + w / 400))},${n(y + L * Math.sin(t + w / 400))}Z" fill="${P.w}" opacity="${n(0.08 + r() * 0.18)}"/>`; } return `<g filter="${blurF(c, 3)}">${s}</g>`; }
  if (k === 'glow') { const x = X(o.x), y = Y(o.y), w = X(o.w || 0.3), h = Y(o.h || 0.1); return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${rgrad(c, x, y, w, [[0, P.w, o.str ?? 0.6], [1, P.w, 0]])}" transform="translate(${x},${y}) scale(1,${n(h / w)}) translate(${-x},${-y})"/>`; }
  return '';
}

// ---------- text ----------
const FONT = { anton: "'Anton','Oswald',sans-serif", ultra: "'Big Shoulders Display','Anton',sans-serif", label: "'Oswald','Anton',sans-serif", cn: "'Noto Sans SC',sans-serif" };
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function text(c, o) {
  const x = X(o.x ?? 0.5), y = Y(o.y ?? 0.5), size = X(o.size || 0.3), col = o.color || P.w, fam = FONT[o.font || 'anton'], ls = o.ls ?? 0, anc = o.anchor || 'middle', st = o.style || 'plain', rot = o.rot || 0, wt = o.weight || (o.font === 'ultra' ? 900 : 400);
  const T = (dx = 0, dy = 0, extra = '', fill = col) => `<text x="${n(x + dx)}" y="${n(y + dy)}" font-family="${fam}" font-weight="${wt}" font-size="${size}" letter-spacing="${ls}" text-anchor="${anc}" fill="${fill}" ${extra}>${esc(o.s)}</text>`;
  let s = '';
  if (st === 'plain') s = T();
  else if (st === 'slam') { s = T(0, -size * 0.28, 'opacity="0.18"') + T(0, -size * 0.14, 'opacity="0.35"') + T(); const r = rng(o.seed || 5); for (let i = 0; i < 9; i++) { const xx = x + (r() - 0.5) * size * 2.4; s += `<rect x="${n(xx)}" y="${n(y - size * (1.6 + r() * 0.9))}" width="${n(1 + r() * 2)}" height="${n(size * (0.4 + r() * 0.6))}" fill="${col}" opacity="0.5"/>`; } }
  else if (st === 'shake') s = T(-9, 3, `opacity="0.4" fill="${o.ghost || P.l2}"`) + T(7, -2, 'opacity="0.35"') + T();
  else if (st === 'outline') s = `<text x="${x}" y="${y}" font-family="${fam}" font-weight="${wt}" font-size="${size}" letter-spacing="${ls}" text-anchor="${anc}" fill="none" stroke="${col}" stroke-width="${o.sw || 2}">${esc(o.s)}</text>`;
  else if (st === 'block') { const bw = X(o.bw || 0.8), bh = size * 1.12; s = `<rect x="${n(x - (anc === 'middle' ? bw / 2 : 0))}" y="${n(y - size * 0.95)}" width="${n(bw)}" height="${n(bh)}" fill="${o.bcol || P.w}"/>` + T(0, 0, '', o.tcol || P.k0); }
  else if (st === 'crack') { const a = c.uid('ca'), b = c.uid('cb'); c.defs.push(`<clipPath id="${a}"><path d="${poly([[0, 0], [x + size * 0.15, 0], [x - size * 0.2, y - size * 0.4], [x + size * 0.25, y - size * 0.1], [x - size * 0.05, H], [0, H]])}"/></clipPath>`, `<clipPath id="${b}"><path d="${poly([[x + size * 0.15, 0], [W, 0], [W, H], [x - size * 0.05, H], [x + size * 0.25, y - size * 0.1], [x - size * 0.2, y - size * 0.4]])}"/></clipPath>`);
    s = `<g clip-path="url(#${a})">${T(-4, 2)}</g><g clip-path="url(#${b})">${T(6, -5)}</g><path d="M${n(x + size * 0.15)},${n(y - size * 1.1)} L${n(x - size * 0.2)},${n(y - size * 0.4)} L${n(x + size * 0.25)},${n(y - size * 0.1)} L${n(x - size * 0.05)},${n(y + size * 0.2)}" stroke="${o.bgc || P.k0}" stroke-width="3" fill="none"/>`; }
  else if (st === 'split') { const k3 = [c.uid('s'), c.uid('s'), c.uid('s')]; const bands = [[y - size, y - size * 0.62], [y - size * 0.62, y - size * 0.3], [y - size * 0.3, y + size * 0.2]]; const offs = o.offs || [-14, 10, -4]; bands.forEach((bb, i) => c.defs.push(`<clipPath id="${k3[i]}"><rect x="0" y="${n(bb[0])}" width="${W}" height="${n(bb[1] - bb[0])}"/></clipPath>`)); s = bands.map((bb, i) => `<g clip-path="url(#${k3[i]})">${T(offs[i], 0)}</g>`).join(''); }
  else if (st === 'stack') { const lines = String(o.s).split('|'); s = lines.map((L, i) => `<text x="${x}" y="${n(y + i * size * (o.lh || 1.0))}" font-family="${fam}" font-weight="${wt}" font-size="${size}" letter-spacing="${ls}" text-anchor="${anc}" fill="${col}">${esc(L)}</text>`).join(''); }
  else if (st === 'mirror') { const id = c.uid('mf'); c.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0.45"/><stop offset="0.7" stop-color="${col}" stop-opacity="0"/></linearGradient>`); s = T() + `<g transform="translate(0,${n(2 * y + size * 0.08)}) scale(1,-1)">${T(0, 0, '', `url(#${id})`)}</g>`; }
  else if (st === 'blur') s = `<g filter="${blurF(c, o.bl || 6)}">${T()}</g>`;
  else if (st === 'fade') { const id = c.uid('fd'); c.defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="${o.top ?? 1}"/><stop offset="1" stop-color="${col}" stop-opacity="${o.bot ?? 0.1}"/></linearGradient>`); s = T(0, 0, '', `url(#${id})`); }
  else if (st === 'drip') { s = T(); const r = rng(o.seed || 13); const wApprox = String(o.s).length * size * 0.42; for (let i = 0; i < (o.n || 9); i++) { const xx = x - wApprox / 2 + r() * wApprox, L = size * (0.3 + r() * 1.4); s += `<rect x="${n(xx)}" y="${n(y - size * 0.08)}" width="${n(2 + r() * 4)}" height="${n(L)}" rx="2" fill="${col}" opacity="${n(0.55 + r() * 0.4)}"/><ellipse cx="${n(xx + 2)}" cy="${n(y - size * 0.08 + L + 3)}" rx="${n(3 + r() * 2)}" ry="${n(4 + r() * 3)}" fill="${col}"/>`; } }
  else if (st === 'stamp') { s = `<g transform="rotate(${o.srot ?? -8},${x},${y})"><rect x="${n(x - size * 1.3)}" y="${n(y - size * 0.98)}" width="${n(size * 2.6)}" height="${n(size * 1.22)}" fill="none" stroke="${col}" stroke-width="${n(size * 0.06)}"/>${T()}</g>`; }
  let clip = '';
  if (o.clip) { const id = c.uid('tc'); const q = o.clip; c.defs.push(`<clipPath id="${id}">${q.k === 'circle' ? `<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="${X(q.r)}"/>` : `<rect x="${X(q.x)}" y="${Y(q.y)}" width="${X(q.w)}" height="${Y(q.h)}"/>`}</clipPath>`); clip = ` clip-path="url(#${id})"`; }
  const fl = o.flip ? ` transform="translate(${n(2 * x)},0) scale(-1,1)"` : '';
  return `<g opacity="${o.op ?? 1}"${clip}><g${fl}><g transform="rotate(${rot},${x},${y})">${s}</g></g></g>`;
}

// ---------- fx ----------
function fx(c, o) {
  const k = o.k;
  if (k === 'flash') return `<rect width="${W}" height="${H}" fill="${P.w}" opacity="${o.a ?? 0.6}"/>`;
  if (k === 'dark') return `<rect width="${W}" height="${H}" fill="${P.k0}" opacity="${o.a ?? 0.5}"/>`;
  if (k === 'tint') return `<rect width="${W}" height="${H}" fill="${o.col || P.blue}" opacity="${o.a ?? 0.45}" style="mix-blend-mode:${o.mode || 'multiply'}"/>`;
  if (k === 'streaks') { const r = rng(o.seed || 8); let s = ''; for (let i = 0; i < (o.n || 26); i++) { const vx = o.dir === 'h'; const a = r() * (vx ? H : W), L = 60 + r() * 220, p = r() * (vx ? W : H); s += vx ? `<rect x="${n(p)}" y="${n(a)}" width="${n(L)}" height="${n(1 + r() * 2)}" fill="${P.w}" opacity="${n(0.15 + r() * 0.35)}"/>` : `<rect x="${n(a)}" y="${n(p)}" width="${n(1 + r() * 2)}" height="${n(L)}" fill="${P.w}" opacity="${n(0.15 + r() * 0.35)}"/>`; } return s; }
  if (k === 'rain') { const r = rng(o.seed || 12); let s = ''; const ang = (o.angle ?? 8) * Math.PI / 180; for (let i = 0; i < (o.n || 160); i++) { const x = r() * W, y = r() * H, L = o.frozen ? 4 + r() * 6 : 24 + r() * 60; s += o.frozen ? `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(1.2 + r() * 1.8)}" ry="${n(L / 2)}" fill="${P.l4}" opacity="${n(0.35 + r() * 0.5)}"/>` : `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + Math.sin(ang) * L)}" y2="${n(y + Math.cos(ang) * L)}" stroke="${P.l4}" stroke-width="${n(0.8 + r() * 1.4)}" opacity="${n(0.2 + r() * 0.45)}"/>`; } return s; }
  if (k === 'drops') { const r = rng(o.seed || 31); let s = ''; for (let i = 0; i < (o.n || 70); i++) { const x = r() * W, y = r() * H, rr = 2 + Math.pow(r(), 3) * 16; s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rr)}" ry="${n(rr * 1.15)}" fill="${P.k1}" opacity="0.25"/><ellipse cx="${n(x - rr * 0.25)}" cy="${n(y - rr * 0.3)}" rx="${n(rr * 0.45)}" ry="${n(rr * 0.5)}" fill="${P.w}" opacity="0.55"/>`; if (r() < 0.12) s += `<path d="M${n(x)},${n(y)} q${n(r() * 6 - 3)},${n(40 + r() * 60)} ${n(r() * 4 - 2)},${n(80 + r() * 90)}" stroke="${P.l3}" stroke-width="${n(rr * 0.5)}" fill="none" opacity="0.3"/>`; } return `<g filter="${blurF(c, o.blur ?? 0.6)}">${s}</g>`; }
  if (k === 'fog') return `<rect width="${W}" height="${H}" fill="${rgrad(c, X(o.x ?? 0.5), Y(o.y ?? 0.5), X(o.r ?? 1.2), [[0, P.w, o.a ?? 0.85], [0.6, P.w, (o.a ?? 0.85) * 0.75], [1, P.w, (o.a ?? 0.85) * 0.3]])}"/>`;
  if (k === 'scratch') { const r = rng(o.seed || 44); let s = ''; for (let i = 0; i < (o.n || 8); i++) { const x = r() * W; s += `<rect x="${n(x)}" y="0" width="${n(0.6 + r())}" height="${H}" fill="${P.w}" opacity="${n(0.1 + r() * 0.3)}"/>`; } for (let i = 0; i < 60; i++) s += `<circle cx="${n(r() * W)}" cy="${n(r() * H)}" r="${n(0.5 + r() * 1.5)}" fill="${r() < 0.5 ? P.w : P.k0}" opacity="${n(0.3 + r() * 0.5)}"/>`; return s; }
  if (k === 'ink') { const r = rng(o.seed || 21), cx = X(o.x ?? 0.5), cy = Y(o.y ?? 0.5), R = X(o.r ?? 0.3); let q = ''; for (let i = 0; i < (o.n || 14); i++) { const a = r() * Math.PI * 2, d = r() * R, px = cx + Math.cos(a) * d * 0.6, py = cy + Math.sin(a) * d + r() * R * 0.3; const w = R * (0.15 + r() * 0.5); q += `<path d="M${n(px)},${n(py)} c${n(w * 0.5)},${n(-w * 0.8)} ${n(w * 1.2)},${n(w * 0.2)} ${n(w * 0.4)},${n(w)} s${n(-w)},${n(w * 0.6)} ${n(-w * 0.6)},${n(-w * 0.3)}z" fill="${o.col || P.blue}" opacity="${n(0.25 + r() * 0.45)}"/>`; } return `<g filter="${blurF(c, o.blur ?? 5)}">${q}</g>`; }
  if (k === 'splash') { const cx = X(o.x ?? 0.5), cy = Y(o.y ?? 0.5), S = X(o.s ?? 0.2); const r = rng(o.seed || 5); let q = `<ellipse cx="${cx}" cy="${cy}" rx="${n(S * 0.6)}" ry="${n(S * 0.12)}" fill="none" stroke="${P.w}" stroke-width="3" opacity="0.8"/>`; for (let i = 0; i < 11; i++) { const a = Math.PI + i * Math.PI / 10, x2 = cx + Math.cos(a) * S * 0.62, y2 = cy + Math.sin(a) * S * 0.12; const h = S * (0.25 + r() * 0.35); q += `<path d="M${n(x2 - 3)},${n(y2)} Q${n(x2 + Math.cos(a) * 8)},${n(y2 - h * 0.6)} ${n(x2 + Math.cos(a) * 14)},${n(y2 - h)} Q${n(x2 + 4)},${n(y2 - h * 0.5)} ${n(x2 + 3)},${n(y2)}Z" fill="${P.l4}" opacity="0.85"/><circle cx="${n(x2 + Math.cos(a) * 18)}" cy="${n(y2 - h - 8 - r() * 10)}" r="${n(2 + r() * 3)}" fill="${P.w}"/>`; } return q; }
  if (k === 'eyelid') { const a = o.a ?? 0.35; return `<rect width="${W}" height="${n(H * a)}" fill="${P.k0}"/><rect y="${n(H * (1 - a))}" width="${W}" height="${n(H * a)}" fill="${P.k0}"/>`; }
  if (k === 'crack') { const r = rng(o.seed || 9); const cx = X(o.x ?? 0.5), cy = Y(o.y ?? 0.5); let s = ''; for (let i = 0; i < (o.n || 9); i++) { let a = r() * Math.PI * 2, px = cx, py = cy, d = 'M' + n(px) + ',' + n(py); for (let j = 0; j < 6; j++) { a += (r() - 0.5) * 0.7; px += Math.cos(a) * (20 + r() * 50); py += Math.sin(a) * (20 + r() * 50); d += 'L' + n(px) + ',' + n(py); } s += `<path d="${d}" stroke="${o.col || P.w}" stroke-width="${n(1 + r() * 2)}" fill="none" opacity="0.85"/>`; } return s; }
  return '';
}

// ---------- annotations (cyan) ----------
function ann(c, o) {
  const A = P.ann, k = o.k; const mk = c.uid('ar'); c.defs.push(`<marker id="${mk}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${o.col || A}"/></marker>`);
  const line = (x1, y1, x2, y2, dash = '', w = 4) => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${o.col || A}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="url(#${mk})" stroke-linecap="round"/>`;
  const label = (x, y, t, anchor = 'middle') => { const w = String(t).length * 15 + 18; const bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x; return `<g><rect x="${n(bx)}" y="${n(y - 20)}" width="${n(w)}" height="28" rx="14" fill="${P.k0}" opacity="0.72"/><text x="${n(bx + w / 2)}" y="${n(y)}" font-family="${FONT.cn}" font-weight="700" font-size="16" fill="${o.col || A}" text-anchor="middle">${esc(t)}</text></g>`; };
  if (k === 'push' || k === 'pull') { const m = o.m || 0.12, inw = W * m, inh = H * m; let s = `<rect x="${n(inw)}" y="${n(inh)}" width="${n(W - 2 * inw)}" height="${n(H - 2 * inh)}" fill="none" stroke="${A}" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.9"/>`; const cs = [[0, 0], [W, 0], [0, H], [W, H]]; for (const [cx, cy] of cs) { const ix = cx ? W - inw : inw, iy = cy ? H - inh : inh; const ox = cx ? W - 14 : 14, oy = cy ? H - 14 : 14; s += k === 'push' ? line(ox, oy, ix + (cx ? 10 : -10), iy + (cy ? 10 : -10)) : line(ix, iy, ox, oy); } return s + (o.tx ? label(W / 2, inh + 34, o.tx) : ''); }
  if (k === 'tilt') { const up = o.dir !== 'down'; return line(W - 34, up ? H * 0.7 : H * 0.3, W - 34, up ? H * 0.3 : H * 0.7, '', 5) + (o.tx ? label(W - 40, H * 0.5, o.tx, 'end') : ''); }
  if (k === 'pan') { const r = o.dir !== 'left'; return line(r ? W * 0.25 : W * 0.75, H - 50, r ? W * 0.75 : W * 0.25, H - 50, '', 5) + (o.tx ? label(W / 2, H - 70, o.tx) : ''); }
  if (k === 'rotate') { const cx = W / 2, cy = H / 2, r = W * 0.36; return `<path d="M${n(cx + r)},${n(cy)} A${n(r)},${n(r)} 0 0 1 ${n(cx)},${n(cy + r)}" stroke="${A}" stroke-width="5" fill="none" marker-end="url(#${mk})"/>` + (o.tx ? label(cx, cy + r + 40, o.tx) : ''); }
  if (k === 'move') { const [x1, y1] = o.from, [x2, y2] = o.to; return line(X(x1), Y(y1), X(x2), Y(y2), '12 9', 4) + (o.tx ? label((X(x1) + X(x2)) / 2, (Y(y1) + Y(y2)) / 2 - 16, o.tx) : ''); }
  if (k === 'label') return label(X(o.x), Y(o.y), o.tx, o.anchor || 'middle');
  if (k === 'box') return `<rect x="${X(o.x)}" y="${Y(o.y)}" width="${X(o.w)}" height="${Y(o.h)}" fill="none" stroke="${A}" stroke-width="3" stroke-dasharray="10 8"/>` + (o.tx ? label(X(o.x) + X(o.w) / 2, Y(o.y) - 12, o.tx) : '');
  if (k === 'beat') { const on = o.on; return `<g><circle cx="${X(o.x ?? 0.9)}" cy="${Y(o.y ?? 0.06)}" r="16" fill="${on ? A : 'none'}" stroke="${A}" stroke-width="3"/>${o.tx ? label(X(o.x ?? 0.9) - 26, Y(o.y ?? 0.06) + 7, o.tx, 'end') : ''}</g>`; }
  if (k === 'safe') return `<rect x="${n(W * 0.06)}" y="${n(H * 0.12)}" width="${n(W * 0.8)}" height="${n(H * 0.62)}" fill="none" stroke="${A}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"/>`;
  if (k === 'hold') return label(X(o.x ?? 0.5), Y(o.y ?? 0.5), o.tx || '停 1 厘米');
  return '';
}

// ---------- composition ----------
function layer(c, L) {
  switch (L.t) {
    case 'bg': return bg(c, L);
    case 'fig': return fig(c, L);
    case 'face': return (L.k === 'front' ? faceFront : face34)(c, L);
    case 'hand': return hand(c, L);
    case 'piano': return piano(c, L);
    case 'mpc': return mpc(c, L);
    case 'clock': return clock(c, L);
    case 'chair': return chair(c, L);
    case 'mirror': return mirror(c, L, L.layers ? L.layers.map(x => layer(c, x)).join('') : '');
    case 'nonla': return nonla(c, L);
    case 'glass': return glass(c, L);
    case 'window': return windowP(c, L);
    case 'sheet': return sheet(c, L);
    case 'torch': return torchBeam(c, L);
    case 'light': return light(c, L);
    case 'text': return text(c, L);
    case 'fx': return fx(c, L);
    case 'rect': return `<rect x="${X(L.x)}" y="${Y(L.y)}" width="${X(L.w)}" height="${Y(L.h)}" fill="${L.col || P.k0}" opacity="${L.op ?? 1}" ${L.rx ? `rx="${L.rx}"` : ''}/>`;
    case 'svg': return L.s;
    case 'group': { let inner = (L.layers || []).map(x => layer(c, x)).join(''); let attrs = ''; if (L.clipFig) attrs += ` clip-path="url(#${figClip(c, L.clipFig)})"`; if (L.clipRect) { const id = c.uid('gr'); c.defs.push(`<clipPath id="${id}"><rect x="${X(L.clipRect[0])}" y="${Y(L.clipRect[1])}" width="${X(L.clipRect[2])}" height="${Y(L.clipRect[3])}"/></clipPath>`); attrs += ` clip-path="url(#${id})"`; } if (L.clipCircle) { const id = c.uid('gc'); c.defs.push(`<clipPath id="${id}"><circle cx="${X(L.clipCircle[0])}" cy="${Y(L.clipCircle[1])}" r="${X(L.clipCircle[2])}"/></clipPath>`); attrs += ` clip-path="url(#${id})"`; } if (L.blur) attrs += ` filter="${blurF(c, L.blur)}"`; if (L.ripple) { const id = c.uid('rp'); c.defs.push(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${L.rf || '0.012 0.05'}" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${L.ripple}" xChannelSelector="R" yChannelSelector="G"/></filter>`); attrs += ` filter="url(#${id})"`; } if (L.neg) attrs += ` filter="url(#${negF(c)})"`; return `<g opacity="${L.op ?? 1}"${attrs}${L.transform ? ` transform="${L.transform}"` : ''}${L.blend ? ` style="mix-blend-mode:${L.blend}"` : ''}>${inner}</g>`; }
    case 'panel': { const [px, py, pw, ph] = L.rect; return `<svg x="${X(px)}" y="${Y(py)}" width="${X(pw)}" height="${Y(ph)}" viewBox="${L.vb || `0 0 ${W} ${H}`}" preserveAspectRatio="xMidYMid slice">${(L.layers || []).map(x => layer(c, x)).join('')}</svg>${L.border !== false ? `<rect x="${X(px)}" y="${Y(py)}" width="${X(pw)}" height="${Y(ph)}" fill="none" stroke="${P.k0}" stroke-width="4"/>` : ''}`; }
    case 'ann': return '';
    default: return '';
  }
}
function negF(c) { const id = c.uid('ng'); c.defs.push(`<filter id="${id}"><feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"/></filter>`); return id; }
function renderFrame(fr, opts = {}) {
  const c = new Ctx(); const layers = fr.scene || [];
  let gradeId = null;
  if (fr.grade === 'cool') { gradeId = c.uid('cg'); c.defs.push(`<filter id="${gradeId}"><feColorMatrix type="saturate" values="0" result="g"/><feComponentTransfer in="g"><feFuncR type="table" tableValues="0.02 0.10 0.36 0.93"/><feFuncG type="table" tableValues="0.05 0.22 0.52 0.95"/><feFuncB type="table" tableValues="0.10 0.33 0.60 0.96"/></feComponentTransfer></filter>`); }
  let body = layers.filter(L => L.t !== 'ann').map(L => gradeId && !L.keepColor ? `<g filter="url(#${gradeId})">${layer(c, L)}</g>` : layer(c, L)).join('\n');
  if (fr.mirror) { const id = c.uid('mh'); c.defs.push(`<clipPath id="${id}"><rect x="0" y="0" width="${W / 2}" height="${H}"/></clipPath>`); body = `<g clip-path="url(#${id})">${body}</g><g transform="translate(${W},0) scale(-1,1)"><g clip-path="url(#${id})">${body}</g></g><rect x="${W / 2 - 0.75}" y="0" width="1.5" height="${H}" fill="${P.w}" opacity="0.18"/>`; }
  if (fr.ghost) { const [dx, dy, op] = fr.ghost; body = `<g transform="translate(${dx},${dy})" opacity="${op}">${body}</g>` + `<g>${body}</g>`; }
  if (fr.slices) { let extra = ''; fr.slices.forEach(([y0, y1, dx]) => { const id = c.uid('sl'); c.defs.push(`<clipPath id="${id}"><rect x="0" y="${Y(y0)}" width="${W}" height="${Y(y1 - y0)}"/></clipPath>`); extra += `<g clip-path="url(#${id})"><g transform="translate(${dx},0)">${body}</g></g>`; }); body += extra; }
  let filt = '';
  if (fr.neg) filt = ` filter="url(#${negF(c)})"`;
  if (fr.tone === 'cyan' || fr.tone === 'blue') { const id = c.uid('cy'); c.defs.push(`<filter id="${id}"><feColorMatrix type="saturate" values="0" result="g"/><feColorMatrix in="g" type="matrix" values="${fr.tone === 'cyan' ? '0.86 0 0 0 0.02  0.9 0 0 0 0.07  0.82 0 0 0 0.19  0 0 0 1 0' : '0.55 0 0 0 0.02  0.62 0 0 0 0.05  0.9 0 0 0 0.16  0 0 0 1 0'}"/></filter>`); body = `<g filter="url(#${id})">${body}</g>`; }
  if (fr.lift) { const id = c.uid('lf'); const a = fr.lift; c.defs.push(`<filter id="${id}"><feComponentTransfer><feFuncR type="linear" slope="${n(1 - a)}" intercept="${a}"/><feFuncG type="linear" slope="${n(1 - a)}" intercept="${a}"/><feFuncB type="linear" slope="${n(1 - a)}" intercept="${a}"/></feComponentTransfer></filter>`); body = `<g filter="url(#${id})">${body}</g>`; }
  if (fr.desat) { const id = c.uid('ds'); c.defs.push(`<filter id="${id}"><feColorMatrix type="saturate" values="${fr.desat}"/></filter>`); body = `<g filter="url(#${id})">${body}</g>`; }
  const gid = c.uid('gn'); c.defs.push(`<filter id="${gid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${fr.seed || 3}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`);
  const vid = c.uid('vg'); c.defs.push(`<radialGradient id="${vid}" cx="50%" cy="48%" r="75%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${fr.vig ?? 0.55}"/></radialGradient>`);
  const anns = opts.noAnn ? '' : layers.filter(L => L.t === 'ann').map(L => ann(c, L)).join('');
  const overlay = `<rect width="${W}" height="${H}" fill="url(#${vid})"/><rect width="${W}" height="${H}" filter="url(#${gid})" opacity="${fr.grain ?? 0.13}" style="mix-blend-mode:overlay"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${opts.w || W}" height="${opts.h || H}"><defs>${c.defs.join('')}</defs><g${filt}>${body}${overlay}</g>${anns}</svg>`;
}
module.exports = { renderFrame, W, H, P, FONT };
