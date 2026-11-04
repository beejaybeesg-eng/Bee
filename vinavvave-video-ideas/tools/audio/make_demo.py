# python -I make_demo.py <NN> <analysis.json> <cut.wav> <out.mp4> <label>
# Builds the animatic timeline from templates.json (beats) using the track BPM, then renders.
import sys, json, subprocess, os
nn, ana, wav, out, label = sys.argv[1:6]
A = json.load(open(ana)); T = json.load(open(os.path.join(os.path.dirname(__file__), 'templates.json')))[nn]
beat = 60.0 / A['bpm']
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
tot_beats = sum(s[1] for s in T['shots']); scale = dur / (tot_beats * beat)  # stretch template to the real cut length
shots, t = [], 0.0
for sid, nb, fx in T['shots']:
    d = nb * beat * scale; s = {'id': sid, 't0': round(t, 3), 't1': round(t + d, 3), 'fx': [f for f in fx if not f.startswith('hits') and f != 'rot'], 'push': 0.04}
    if 'hits1' in fx: s['hits'] = [round(k * beat * scale, 3) for k in range(1, int(nb))]
    if 'hits2' in fx: s['hits'] = [round(k * 2 * beat * scale, 3) for k in range(1, int(nb / 2))]
    if 'hits4' in fx: s['hits'] = [round(k * 4 * beat * scale, 3) for k in range(1, int(nb / 4))]
    if 'rot' in fx: s['rot'] = [0, 90]; s['push'] = 0
    shots.append(s); t += d
shots[-1]['t1'] = round(dur, 3)
tl = {'fps': 30, 'label': label, 'shots': shots}
tlp = out[:-4] + '_timeline.json'; json.dump(tl, open(tlp, 'w'), ensure_ascii=False, indent=1)
import tempfile
fdir = os.path.join(os.environ.get('VV_BUILD') or os.path.join(tempfile.gettempdir(), 'vinavvave-build'), 'out', nn, 'frames')
subprocess.run([sys.executable, '-I', os.path.join(os.path.dirname(__file__), 'animatic.py'), fdir, tlp, wav, out], check=True)
