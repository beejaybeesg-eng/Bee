# python -I animatic.py <frames_dir> <timeline.json> <audio.wav> <out.mp4>
import os as _os, glob as _g
FONT_DIR = _os.environ.get('VV_FONT_DIR', _os.path.expanduser('~/.local/share/fonts'))
def font_path(w):
    c = _g.glob(_os.path.join(FONT_DIR, '**', f'NotoSansSC-{w}.ttf'), recursive=True) or _g.glob('/usr/share/fonts/**/wqy-zenhei.ttc', recursive=True)
    return c[0]

# timeline: {"fps":30,"label":"...","shots":[{"id":"01","t0":0,"t1":1.2,"fx":["slam"],"push":0.04,"hits":[0.5],"rot":[0,90]}]}
import sys, json, subprocess, random, math
from PIL import Image, ImageDraw, ImageFont
fdir, tl, audio, out = sys.argv[1:5]
T = json.load(open(tl)); fps = T.get('fps', 30); W, H = 1080, 1920
cache = {}
def img(i):
    if i not in cache:
        if i == 'BLACK': cache[i] = Image.new('RGB', (W, H), (2, 3, 4))
        elif i == 'WHITE': cache[i] = Image.new('RGB', (W, H), (244, 246, 248))
        else: cache[i] = Image.open(f"{fdir}/{i}.png").convert('RGB').resize((W, H))
    return cache[i]
dur = max(s['t1'] for s in T['shots'])
font = ImageFont.truetype(font_path('700'), 24)
WHITE, BLACK = Image.new('RGB', (W, H), (255, 255, 255)), Image.new('RGB', (W, H), (0, 0, 0))
p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-', '-i', audio,
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
rnd = random.Random(7)
for f in range(int(round(dur * fps))):
    t = f / fps
    s = next((s for s in T['shots'] if s['t0'] <= t < s['t1']), T['shots'][-1])
    base = img(s['id']); span = max(s['t1'] - s['t0'], 1e-3); k = (t - s['t0']) / span; fi = int(round((t - s['t0']) * fps))
    fx = s.get('fx', [])
    scale = 1.0 + s.get('push', 0.03) * k; dx = dy = 0; a = 0.0
    if 'slam' in fx and fi < 4: scale *= 1.12 - 0.03 * fi
    if ('slam' in fx or 'shake' in fx) and fi < 5: dx, dy = rnd.randint(-14, 14), rnd.randint(-14, 14)
    if ('slam' in fx or 'flash' in fx) and fi < 2: a = 0.85 if fi == 0 else 0.4
    for ht in s.get('hits', []):
        dd = t - s['t0'] - ht
        if 0 <= dd < 5 / fps: dx, dy = rnd.randint(-12, 12), rnd.randint(-12, 12)
        if 0 <= dd < 2 / fps: a = max(a, 0.7 if dd < 1 / fps else 0.3)
    im = base
    if 'rot' in s:
        ang = s['rot'][0] + (s['rot'][1] - s['rot'][0]) * (0.5 - 0.5 * math.cos(math.pi * k))
        sc = 1 + 0.8 * abs(math.sin(math.radians(ang)))
        im = im.rotate(-ang, resample=Image.BILINEAR, expand=False); scale *= sc
    if scale != 1.0 or dx or dy:
        w2, h2 = int(W * scale), int(H * scale); im2 = im.resize((w2, h2), Image.BILINEAR)
        x0, y0 = (w2 - W) // 2 - dx, (h2 - H) // 2 - dy; im = im2.crop((x0, y0, x0 + W, y0 + H))
    else: im = im.copy()
    if a: im = Image.blend(im, WHITE, a)
    if 'fadeout' in fx and k > 0.55: im = Image.blend(im, BLACK, min(1, (k - 0.55) / 0.45))
    if 'fadein' in fx and k < 0.3: im = Image.blend(BLACK, im, k / 0.3)
    d = ImageDraw.Draw(im); d.text((34, 30), T.get('label', '小样'), fill=(255, 255, 255), font=font)
    p.stdin.write(im.tobytes())
p.stdin.close(); p.wait(); print('wrote', out, f'{dur:.1f}s')
