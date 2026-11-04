# python -I analyze.py <audio> <out.json> [<out_map.png>]
import os as _os, glob as _g
FONT_DIR = _os.environ.get('VV_FONT_DIR', _os.path.expanduser('~/.local/share/fonts'))
def font_path(w):
    c = _g.glob(_os.path.join(FONT_DIR, '**', f'NotoSansSC-{w}.ttf'), recursive=True) or _g.glob('/usr/share/fonts/**/wqy-zenhei.ttc', recursive=True)
    return c[0]

import sys, json, subprocess, numpy as np, librosa
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
png = sys.argv[3] if len(sys.argv) > 3 else None
wav = out[:-5] + '_22k.wav'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-ac', '1', '-ar', '22050', wav], check=True)
y, sr = librosa.load(wav, sr=22050, mono=True)
dur = len(y) / sr
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time', start_bpm=125, tightness=120)
bpm = float(np.atleast_1d(tempo)[0])
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=512)
lowS = S[freqs < 150]
on_low = librosa.onset.onset_strength(S=librosa.amplitude_to_db(lowS + 1e-6), sr=sr)
on_all = librosa.onset.onset_strength(y=y, sr=sr)
def at(arr, t):
    i = int(np.searchsorted(times, t)); return float(arr[min(max(i, 0), len(arr) - 1)])
rms0 = librosa.feature.rms(S=S)[0]
E = []
for i in range(len(beats) - 1):
    m = (times >= beats[i]) & (times < beats[i + 1]); E.append(float(rms0[m].mean()) if m.any() else 0.0)
E = np.array(E); dE = np.abs(np.diff(np.log(E + 1e-6), prepend=np.log(E[0] + 1e-6)))
nov = [float(np.sum(np.sort(dE[ph::4])[-6:])) for ph in range(4)]  # biggest energy changes land on downbeats
low_sc = [float(np.mean([at(on_low, beats[i]) for i in range(ph, len(beats), 4)] or [0])) for ph in range(4)]
best = int(np.argmax(nov)) if max(nov) > 1.3 * sorted(nov)[-2] else int(np.argmax(low_sc))
phase_info = {'novelty': [round(v, 2) for v in nov], 'low': [round(v, 2) for v in low_sc], 'chosen': best}
bar_starts = [float(beats[i]) for i in range(best, len(beats), 4)]
if bar_starts and bar_starts[0] > 240 / bpm * 0.9:  # extrapolate bars before the first detected downbeat
    t = bar_starts[0]
    while t - 240 / bpm > -0.05: t -= 240 / bpm; bar_starts.insert(0, max(t, 0.0))
rms = librosa.feature.rms(S=S)[0]
low_ratio = lowS.sum(0) / (S.sum(0) + 1e-9)
hi_ratio = S[freqs > 5000].sum(0) / (S.sum(0) + 1e-9)
bars = []
for i, t0 in enumerate(bar_starts):
    t1 = bar_starts[i + 1] if i + 1 < len(bar_starts) else dur
    m = (times >= t0) & (times < t1)
    if not m.any(): continue
    bars.append({'bar': i + 1, 't0': round(t0, 3), 't1': round(t1, 3), 'rms': float(rms[m].mean()), 'low': float(low_ratio[m].mean()), 'hi': float(hi_ratio[m].mean()), 'onsets': float(on_all[m].mean())})
def norm(k):
    a = np.array([b[k] for b in bars]); a = (a - a.min()) / (np.ptp(a) + 1e-9)
    for b, v in zip(bars, a): b[k + '_n'] = round(float(v), 2)
for k in ('rms', 'low', 'hi', 'onsets'): norm(k)
res = {'phase': phase_info, 'src': src, 'duration': round(dur, 2), 'bpm': round(bpm, 2), 'bar_sec': round(240 / bpm, 3), 'n_bars': len(bars), 'bars': bars}
json.dump(res, open(out, 'w'), indent=1, ensure_ascii=False)
print(f"bpm {bpm:.1f} | bar {240/bpm:.2f}s | {len(bars)} bars | {dur:.1f}s")
if png:  # structure map: one column per bar (energy / bass / highs)
    W, H = max(800, 14 * len(bars) + 80), 300
    im = Image.new('RGB', (W, H), (250, 250, 250)); d = ImageDraw.Draw(im)
    f = ImageFont.truetype(font_path('400'), 12)
    for j, b in enumerate(bars):
        x = 60 + j * 14
        d.rectangle([x, 230 - int(b['rms_n'] * 150), x + 10, 230], fill=(30, 30, 30))
        d.rectangle([x, 250, x + 10, 250 + int(b['low_n'] * 30)], fill=(27, 60, 150))
        if (b['bar'] - 1) % 4 == 0: d.text((x, 285), str(b['bar']), fill=(80, 80, 80), font=f)
    d.text((10, 8), f"{src.split('/')[-1]}   {bpm:.1f} BPM   {len(bars)} bars   黑=能量  蓝=低频", fill=(0, 0, 0), font=f)
    im.save(png)
