// Track 10 — PHAI
const ATTIC = { t: 'bg', k: 'attic', window: 'round', wy: 0.24, wr: 0.05 };
const BEAM = { t: 'light', k: 'beam', from: [0.0, 0.25], to: [0.55, 0.92], w0: 0.15, w1: 0.55, str: 0.25, end: 0.03, soft: 16 };
const RIVER = { t: 'bg', k: 'river', time: 'dusk', hz: 0.6, sunx: 0.72, hmax: 0.2 };
const PROM = { t: 'rect', x: 0, y: 0.8, w: 1, h: 0.2, col: '#0b0f14' };
module.exports = {
  num: '10', slug: 'PHAI', title: 'PHAI', meaning: '消散',
  hero: ['01', '05', '06', '11'],
  ep: '最后一首 · 建议 1/5（新年第一周）发', len: '约 45 秒（30–50 秒都可以）', color: '冷调彩色 → 黑白 → 白（全系列唯一一次彩色）',
  method: 'phai 本来就是“褪色”：这一集从彩色开始，一层层褪——先褪成黑白，再褪成雾，最后他从前几集的每个地方褪掉，只剩空景；最后一秒，他笑了。',
  special: [
    '**彩色**：只有这一集要保留颜色。设置里打开“锁定白平衡”；尽量在阴天光、窗光、蓝调时刻拍，后期整体往冷调（不要暖黄）。',
    '**有他 / 没他**：每个地方一个固定机位，按录制后不碰手机，先“有他”10 秒，再“哈气”，再“没他”10 秒，一条录完。',
    '**哈气起雾**：相框玻璃竖着夹在镜头前 **10 cm**；他从画面侧面探进来，对着玻璃哈一口长气，然后从侧面退出画面；雾散开时他已经不在了。',
    '天冷不起雾的话：玻璃先放冰箱 5 分钟再拿出来，哈气就会起雾。',
    '每个地方的机位尽量和前几集一样（同样的高度和距离），这一集是在“回访”。'
  ],
  setups: [
    { id: 'A', name: '阁楼四处（镜子 / 琴 / MPC / 空椅子）', lens: '1×（24mm）', fps: '4K 30',
      rig: '书堆固定，机位和前几集一样；玻璃夹在镜头前 10 cm。',
      exp: '锁他的身体，**−0.7EV**；白平衡锁定。',
      takes: '每处一条：有他 10 秒 → 哈气 → 没他 10 秒；**每处 2 条**。',
      plan: { props: [['mirror', 0.2, 0.2, 0, 0.18], ['piano', 0.55, 0.2, 0, 0.26], ['mpc', 0.85, 0.3], ['chair', 0.3, 0.45], ['sheet', 0.5, 0.74, 0, 0.12], ['label', 0.7, 0.74, 0, '玻璃']], cam: [0.5, 0.86, -90, 22, '手机'], light: [0.06, 0.3, 0, '窗'] } },
    { id: 'B', name: '阳台 · 彩色', lens: '1×（24mm）', fps: '4K 30',
      rig: '书堆放在阳台地上，离地 15 cm；玻璃在镜头前。',
      exp: '锁他，**−0.7EV**（天太亮时 **−1.0EV**）。',
      takes: '有他 → 哈气 → 没他 × 2 条（傍晚蓝调时刻）。',
      plan: { room: 'outdoor', props: [['rail', 0.5, 0.1, 0, 0.8]], me: [0.5, 0.3, 90, '他'], cam: [0.5, 0.86, -90, 22, '手机'], light: [0.5, 0.03, 90, '天光'] } },
    { id: 'C', name: 'Thủ Thiêm 河边 · 彩色', lens: '1×（24mm）', fps: '4K 30',
      rig: '背包 + 书，离地 15 cm，和第 2 集同一个位置。',
      exp: '锁他，**−0.7EV**。',
      takes: '有他 → 哈气 → 没他 × 2 条。',
      plan: { room: 'outdoor', props: [['river', 0.5, 0.06, 0, 1], ['rail', 0.5, 0.2, 0, 0.9]], me: [0.5, 0.32, 90, '他'], cam: [0.5, 0.86, -90, 22, '手机'] } },
    { id: 'D', name: '大笑（窗前剪影）', lens: '1×（24mm）', fps: '4K 30',
      rig: '书堆放在椅子上，对着窗，离他约 **2 m**。',
      exp: '长按窗户锁 AE/AF，**−1.5EV**：他是剪影。',
      takes: '真的笑出来（想一件真好笑的事），肩膀在抖，5 条；只取最好的 1 秒。',
      plan: { me: [0.5, 0.3, 90, '他'], cam: [0.5, 0.86, -90, 22, '手机'], light: [0.5, 0.03, 90, '窗'] } }
  ],
  shots: [
    { id: '01', sec: '开头 · 彩色', dur: '约 3 秒', sound: '开头（声部都在）', setup: 'A', cam: '有他',
      desc: '**第一次看见颜色**：阁楼是冷调的彩色，他的 T 恤是深蓝，很平静地坐着。',
      grade: 'cool', scene: [ATTIC, BEAM, { t: 'chair', view: 'front', x: 0.5, y: 0.86, h: 0.26 }, { t: 'fig', pose: 'sit_front', x: 0.5, y: 0.86, h: 0.52, tone: 'lit', light: 'left', shirt: true, shadow: true, keepColor: true }, { t: 'text', s: 'PHAI', x: 0.5, y: 0.2, size: 0.26, ls: 8 }] },
    { id: '02', sec: '开头 · 彩色', dur: '约 2.5 秒', sound: '开头', setup: 'B',
      desc: '阳台，傍晚的蓝调时刻，彩色；他站着，看着城市。',
      grade: 'cool', scene: [{ t: 'bg', k: 'balcony', time: 'dusk', sunx: 0.3, hz: 0.66, rail: 0.68 }, { t: 'fig', pose: 'stand_side', x: 0.45, y: 0.92, h: 0.62, shirt: true, keepColor: true }] },
    { id: '03', sec: '开头 · 彩色', dur: '约 2.5 秒', sound: '开头', setup: 'C',
      desc: '河边，彩色；对岸是城市，他站在第 2 集放琴的地方，手里什么也没有。',
      grade: 'cool', scene: [RIVER, PROM, { t: 'fig', pose: 'stand_front', x: 0.5, y: 0.9, h: 0.6, tone: 'rim', light: 'right', rimw: 3, shirt: true, keepColor: true }] },
    { id: '04', sec: '中段 · 第一层撤', dur: '约 3 秒', sound: '第一层声部撤掉', setup: 'A',
      desc: '第一层声部一撤，**颜色褪成黑白**。', post: '饱和度 100% → 0，用 2 小节慢慢褪。',
      scene: [ATTIC, BEAM, { t: 'chair', view: 'front', x: 0.5, y: 0.86, h: 0.26 }, { t: 'fig', pose: 'sit_front', x: 0.5, y: 0.86, h: 0.52, tone: 'lit', light: 'left', shadow: true }, { t: 'text', s: 'PHAI', style: 'fade', x: 0.5, y: 0.2, size: 0.26, ls: 8, top: 1, bot: 0.4 }] },
    { id: '05', sec: '中段 · 第二层撤', dur: '约 3 秒', sound: '第二层声部撤掉', setup: 'A', cam: '哈气',
      desc: '第二层一撤，**黑变灰、起雾**：他探过来对着镜头前的玻璃哈一口气，雾把画面盖住。', post: '黑位抬到 25% 灰；雾是真的（哈气）。',
      lift: 0.22, scene: [ATTIC, { t: 'chair', view: 'front', x: 0.5, y: 0.86, h: 0.26 }, { t: 'fig', pose: 'sit_front', x: 0.5, y: 0.86, h: 0.52, tone: 'lit', light: 'left' }, { t: 'fx', k: 'fog', x: 0.45, y: 0.5, r: 0.9, a: 0.75 }] },
    { id: '06', sec: '高潮 · 镜子', dur: '约 2 秒', sound: '高潮（回访）', setup: 'A', cam: '镜子：有他 → 雾 → 没他',
      desc: '回到第 1 集的镜子：雾散开时，**镜子前和镜子里都没有人了**。',
      lift: 0.18, scene: [ATTIC, { t: 'mirror', x: 0.6, y: 0.86, w: 0.44, h: 0.62, layers: [{ t: 'bg', k: 'wall', lx: 0.4, ly: 0.4 }] }, { t: 'fx', k: 'fog', x: 0.2, y: 0.3, r: 0.6, a: 0.45 }] },
    { id: '07', sec: '高潮 · 琴', dur: '约 2 秒', sound: '高潮（回访）', setup: 'A', cam: '琴：没他',
      desc: '回到第 2 集的琴：琴还在，人已经褪掉了。',
      lift: 0.2, scene: [ATTIC, { t: 'piano', view: 'front', x: 0.5, y: 0.655, w: 0.92, floorY: 0.86 }, { t: 'chair', view: 'front', x: 0.5, y: 0.86, h: 0.26 }, { t: 'fx', k: 'fog', x: 0.7, y: 0.7, r: 0.5, a: 0.4 }] },
    { id: '08', sec: '高潮 · MPC / 空椅子', dur: '约 2 秒', sound: '高潮（回访）', setup: 'A', cam: '没他',
      desc: 'MPC 和空椅子，一个接一个，都没有他；画面越来越淡。',
      lift: 0.3, scene: [{ t: 'panel', rect: [0, 0, 1, 0.5], layers: [{ t: 'bg', k: 'desk_top', pool: [0.5, 0.5, 0.6] }, { t: 'mpc', x: 0.5, y: 0.5, w: 0.7, screen: 'off' }] }, { t: 'panel', rect: [0, 0.5, 1, 0.5], layers: [ATTIC, { t: 'chair', view: 'front', x: 0.5, y: 0.86, h: 0.26 }] }, { t: 'fx', k: 'fog', x: 0.5, y: 0.5, r: 1.0, a: 0.35 }] },
    { id: '09', sec: '高潮 · 河边', dur: '约 2 秒', sound: '高潮最后', setup: 'C', cam: '没他',
      desc: '河边：空的。只剩城市和河，淡得像要消失。',
      lift: 0.35, scene: [RIVER, PROM, { t: 'fx', k: 'fog', x: 0.5, y: 0.4, r: 1.0, a: 0.4 }] },
    { id: '10', sec: '结尾', dur: '约 2 秒', sound: '最后一层撤掉', cam: '剪辑里做',
      desc: '**全白**。', post: '最后一个画面曝光拉满到白。',
      scene: [{ t: 'bg', k: 'white' }, { t: 'text', s: 'PHAI', style: 'outline', x: 0.5, y: 0.52, size: 0.26, ls: 8, color: '#c8d0d8', sw: 1.5 }] },
    { id: '11', sec: '结尾 · 〔大胆〕大笑', dur: '1 秒（硬切）', sound: '最后一个声音之后 / 之上', setup: 'D',
      desc: '**硬切 1 秒：他放声大笑**，剪影里肩膀在抖——把整张专辑、整个系列的神圣一下子打破：“去他妈的吧这些 faith 哈哈哈”。', post: '只用 1 秒；可以带一点他真实的笑声（如果你想要）。',
      ghost: [6, -4, 0.35], scene: [{ t: 'bg', k: 'wall', lx: 0.5, ly: 0.3, lr: 1.2 }, { t: 'light', k: 'halo', x: 0.5, y: 0.25, r: 0.9, str: 0.7 }, { t: 'fig', pose: 'stand_front', x: 0.5, y: 1.1, h: 0.95, v: { arms: 'open' } }, { t: 'fx', k: 'streaks', n: 12 }] },
    { id: '12', sec: '片尾卡', dur: '约 2.5 秒', sound: '尾音结束', cam: '剪辑里做',
      desc: '黑底；PHAI 和 BEEJAYBEE · VINAVVAVE 一个字一个字褪掉，**BEEJAYBEE · VINAVVAVE 最后一个消失**。',
      scene: [{ t: 'bg', k: 'black' }, { t: 'text', s: 'PHAI', style: 'fade', x: 0.5, y: 0.52, size: 0.2, ls: 8, top: 0.5, bot: 0.05 }, { t: 'text', s: 'BEEJAYBEE · VINAVVAVE', font: 'label', x: 0.5, y: 0.62, size: 0.04, ls: 6, color: '#a6b0ba' }] },
    { id: 'T1', sec: '字 · 褪色的油漆', dur: '跟声部撤', sound: '每撤一层声部', cam: '剪辑里做',
      desc: 'PHAI 四个字母开始是实心的；声部每撤一层，字从底部往上淡一层；最后只剩一条细轮廓。', post: '字高约画面宽度的 26%，字距拉开；用渐变遮罩从下往上推。',
      scene: [{ t: 'bg', k: 'gray', col: '#141a21' }, { t: 'text', s: 'PHAI', x: 0.5, y: 0.28, size: 0.2, ls: 8 }, { t: 'text', s: 'PHAI', style: 'fade', x: 0.5, y: 0.52, size: 0.2, ls: 8, top: 1, bot: 0.15 }, { t: 'text', s: 'PHAI', style: 'outline', x: 0.5, y: 0.76, size: 0.2, ls: 8, sw: 1.5 }, { t: 'ann', k: 'label', x: 0.86, y: 0.22, tx: '①' }, { t: 'ann', k: 'label', x: 0.86, y: 0.46, tx: '②' }, { t: 'ann', k: 'label', x: 0.86, y: 0.7, tx: '③' }] }
  ],
  schedule: [
    ['14:30–14:40', '阁楼', '布置：锁定白平衡；相框玻璃（先放冰箱 5 分钟）；书堆。'],
    ['14:40–15:35', '阁楼', '**机位 A**：镜子、琴、MPC、空椅子四处，每处“有他 → 哈气 → 没他” × 2（每处约 12 分钟）。'],
    ['15:35–15:55', '路上', '去 Thủ Thiêm 河边（带玻璃、书、背包）。'],
    ['15:55–16:30', '河边', '**机位 C**：彩色，有他 → 哈气 → 没他 × 2。'],
    ['16:30–16:50', '路上', '回家。'],
    ['16:50–17:10', '阳台', '**机位 B**：蓝调时刻，彩色 × 2。'],
    ['17:10–17:25', '阁楼', '**机位 D**：大笑 × 5（窗还亮的时候）。'],
    ['17:25–17:30', '—', '回看、备份（约 3 小时）。']
  ],
  props: ['相框玻璃（哈气起雾用；先冰 5 分钟）', '前几集的道具：落地镜、GO:PIANO88、MPC、椅子', '书、背包（支撑）', '深蓝纯色 T 恤（这一集颜色看得见）'],
  text: [
    '**PHAI**：窄粗黑体，白字，字距拉开，字高约画面宽度的 26%，放在上 1/3。',
    '像褪色的油漆：开始实心；声部每撤一层，字从底部往上淡一层；最后只剩一条细轮廓。',
    '片尾卡也一个字一个字褪掉，BEEJAYBEE · VINAVVAVE 最后一个消失。英文意思只放 IG 文案：“Phai — to fade.”'
  ],
  edit: [
    '时间线 1080×1920 / 30p。**开头彩色**（整体往冷调：色温偏蓝、去掉暖黄），这是全系列唯一一次彩色。',
    '**声部退一层，画面褪一层**：① 饱和度 100% → 0（2 小节）；② 黑位抬到 25% 灰 + 哈气的雾；③ 他从每个地方消失（雾当转场，雾后面换成“没他”那一段）。',
    '回访的地方按前几集的顺序：镜子（第 1 集）→ 琴（第 2 集）→ MPC / 空椅子 → 河边。',
    '最后一层撤掉：曝光拉满到白；然后**硬切 1 秒大笑**；再接片尾卡（字一个个褪掉）。',
    '长度按小节表剪，30–50 秒都可以（这一集可以到 45–50 秒）。'
  ],
  check: [
    '开拍前：电量 100%、存储 50 GB、飞行模式；**锁定白平衡**；4K 30。',
    '每处“有他 / 没他”同一条录完，中途不碰手机。',
    '外景：先转一圈，旗、横幅、招牌商标不入画（彩色更显眼，尤其注意）。',
    '大笑要真笑：多拍几条，只用最好的 1 秒。'
  ]
};
