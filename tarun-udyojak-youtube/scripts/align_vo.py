# Estimate sentence/word times for a VO from its script + silence gaps (no ASR needed).
# usage: python3 scripts_align.py vo.mp3 script.txt out.json
import json, re, subprocess, sys
vo, script, out = sys.argv[1:4]
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo]))
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', vo, '-af', 'silencedetect=noise=-32dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
ev = re.findall(r'silence_(start|end): ([0-9.]+)', log)
gaps, st = [], None
for k, v in ev:
    if k == 'start': st = float(v)
    elif st is not None: gaps.append((st, float(v))); st = None
if st is not None: gaps.append((st, dur))
# speech segments
segs, t = [], 0.0
for a, b in gaps:
    if a > t + 0.02: segs.append((t, a))
    t = b
if dur > t + 0.02: segs.append((t, dur))
speech = sum(b - a for a, b in segs)
def sp2real(x):  # speech-time -> real time
    for a, b in segs:
        if x <= b - a: return a + x
        x -= b - a
    return segs[-1][1]
text = open(script, encoding='utf-8').read()
sents = [s.strip() for s in re.split(r'(?<=[.?!।])\s+|\n+', text) if s.strip()]
def weight(w):
    core = re.sub(r'[^\wऀ-ॿ-]', '', w)
    if re.search(r'[०-९0-9]', core): return 7 + 2 * len(core)  # numbers are spoken longer
    return len(core) + 2
words = []
for i, s in enumerate(sents):
    for w in s.split(): words.append({'s': i, 'w': w, 'n': weight(w)})
tot = sum(o['n'] for o in words)
acc = 0
for o in words:
    o['t'] = acc / tot * speech; acc += o['n']; o['e'] = acc / tot * speech
# real times
for o in words: o['t'], o['e'] = sp2real(o['t']), sp2real(o['e'])
# snap each sentence start to the nearest decent pause (>=0.2 s) within 2 s, then rescale words inside
starts = []
for i in range(len(sents)):
    t0 = next(o['t'] for o in words if o['s'] == i)
    if i == 0: starts.append(segs[0][0]); continue
    cand = [g for g in gaps if g[1] - g[0] >= 0.2 and abs(g[1] - t0) < 2.0 and g[1] > starts[-1] + 0.5]
    starts.append(min(cand, key=lambda g: abs(g[1] - t0))[1] if cand else t0)
ends = []
for i in range(len(sents)):
    nxt = starts[i + 1] if i + 1 < len(sents) else segs[-1][1]
    pg = [g for g in gaps if g[1] == nxt]
    ends.append(pg[0][0] if pg else nxt)
res = []
for i, s in enumerate(sents):
    ws = [o for o in words if o['s'] == i]
    a, b = starts[i], ends[i]; n = sum(o['n'] for o in ws); acc = 0
    wl = []
    for o in ws:
        wl.append([round(a + (b - a) * acc / n, 2), o['w']]); acc += o['n']
    res.append({'i': i, 'start': round(a, 2), 'end': round(b, 2), 'text': s, 'words': wl})
json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for r in res: print(f"{r['i']:2d} {r['start']:7.2f} {r['end']:7.2f}  {r['text'][:70]}")
