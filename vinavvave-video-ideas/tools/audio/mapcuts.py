import sys, json
from PIL import Image, ImageDraw, ImageFont
mp, ana, plans, nn, out = sys.argv[1:6]
A = json.load(open(ana)); P = json.load(open(plans))[nn]; nb = A['n_bars']
im = Image.open(mp).convert('RGB'); W, H = im.size; im2 = Image.new('RGB', (W, H + 110), (250, 250, 250)); im2.paste(im, (0, 0)); d = ImageDraw.Draw(im2)
f = ImageFont.truetype('/root/.local/share/fonts/sb/NotoSansSC-700.ttf', 13)
cols = {'A': (90, 90, 90), 'B': (27, 60, 150), 'C': (180, 40, 40)}; names = {'A': 'A 结构版', 'B': 'B 画面版', 'C': 'C IG版'}
for r, v in enumerate('ABC'):
    y = H + 10 + r * 26; segs = P[v]; L = sum(n for _, n in segs) * A['bar_sec']
    d.text((4, y - 2), v, fill=cols[v], font=f)
    for k, (s, n) in enumerate(segs):
        x0 = 60 + (s - 1) * 14; x1 = 60 + (s + n - 1) * 14 - 4
        d.rectangle([x0, y, x1, y + 12], fill=cols[v]); d.text((x0, y + 12), str(k + 1), fill=cols[v], font=ImageFont.truetype('/root/.local/share/fonts/sb/NotoSansSC-400.ttf', 10))
    tag = names[v] + f' ≈{L:.0f}s' + ('  ← 小样用这一版' if v == P['pick'] else '')
    d.text((W - 260, y - 2), tag, fill=cols[v], font=f)
d.text((10, H + 92), f"{nn} {P['title']}   色块 = 剪辑用到的小节，数字 = 播放顺序", fill=(0, 0, 0), font=f)
im2.save(out)
