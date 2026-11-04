# python -I cut.py <source_audio> <analysis.json> <plan.json> <out.wav>
# plan: {"segments": [[first_bar, n_bars], ...], "fade_out": 0.6}
import sys, json, subprocess
src, ana, plan, out = sys.argv[1:5]
A = json.load(open(ana)); P = json.load(open(plan))
bars = {b['bar']: b for b in A['bars']}; bs = A['bar_sec']
def t_of(bar):
    if bar in bars: return bars[bar]['t0']
    last = max(bars); return bars[last]['t0'] + (bar - last) * bs
segs = []
for fb, nb in P['segments']:
    t0 = max(t_of(fb) - 0.012, 0); t1 = t_of(fb + nb) - 0.012
    segs.append((round(t0, 3), round(t1, 3)))
xf = 0.02
fc = []; labels = []
for i, (a, b) in enumerate(segs):
    fc.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS[s{i}]"); labels.append(f"s{i}")
cur = labels[0]
for i in range(1, len(labels)):
    fc.append(f"[{cur}][{labels[i]}]acrossfade=d={xf}:c1=tri:c2=tri[x{i}]"); cur = f"x{i}"
total = sum(b - a for a, b in segs) - xf * (len(segs) - 1)
fo = P.get('fade_out', 0.6)
fc.append(f"[{cur}]afade=t=out:st={max(total - fo, 0):.3f}:d={fo},loudnorm=I=-14:TP=-1.0:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex', ';'.join(fc), '-map', '[out]', '-ar', '48000', '-ac', '2', out], check=True)
json.dump({'segments': [{'bars': f"{fb}–{fb + nb - 1}", 'n_bars': nb, 'src_t0': a, 'src_t1': b} for (fb, nb), (a, b) in zip(P['segments'], segs)], 'length_sec': round(total, 2)}, open(out[:-4] + '_cutsheet.json', 'w'), indent=1, ensure_ascii=False)
print(f"cut {len(segs)} segments, {total:.1f}s -> {out}")
