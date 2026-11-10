# Sentence + word timing for a long VO from its script, without ASR.
# Every sentence boundary is matched to a real pause; dynamic programming picks the set of pauses whose
# sentence lengths best fit a steady speaking rate (and prefers longer pauses). Words are spread over the
# speech inside each sentence (internal pauses skipped), weighted by length.
# usage: python3 scripts/align_vo2.py vo.mp3 script.txt out.json [noise_db=-32]
import json, math, re, subprocess, sys

vo, script, out = sys.argv[1:4]
NOISE = sys.argv[4] if len(sys.argv) > 4 else '-32'
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo]))
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', vo, '-af', f'silencedetect=noise={NOISE}dB:d=0.1', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
gaps, st = [], None
for k, v in re.findall(r'silence_(start|end): ([0-9.]+)', log):
    if k == 'start': st = float(v)
    elif st is not None: gaps.append((st, float(v))); st = None
if st is not None: gaps.append((st, dur))
lead = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
tail = gaps[-1][0] if gaps and gaps[-1][1] > dur - 0.05 else dur
inner = [g for g in gaps if g[0] > lead + 0.05 and g[1] < tail - 0.05]

text = open(script, encoding='utf-8').read()
sents = [s.strip() for s in re.split(r'(?<=[.?!।…])\s+|\n+', text) if s.strip()]


def wweight(w):
    core = re.sub(r'[^\wऀ-ॿ-]', '', w)
    if re.search(r'[०-९0-9]', core):  # numbers are spoken as words: "₹13 लाख 20 हजार", "1,500"
        return 6 + 3.2 * len(re.sub(r'[^0-9०-९]', '', core)) + len(re.sub(r'[0-9०-९]', '', core))
    return len(core) + 2


SW = [sum(wweight(w) for w in s.split()) for s in sents]
N, G = len(sents), len(inner)
# speech time between two instants (pauses removed)
pts = [lead] + [x for g in inner for x in g] + [tail]


def speech(a, b):
    s = b - a
    for g0, g1 in inner:
        lo, hi = max(a, g0), min(b, g1)
        if hi > lo: s -= hi - lo
    return s


total_speech = speech(lead, tail)
rate = total_speech / sum(SW)
# boundary candidates: gap index j (sentence ends at inner[j][0], next starts at inner[j][1])
INF = float('inf')
starts_c = [lead] + [g[1] for g in inner]
ends_c = [g[0] for g in inner] + [tail]
# cum speech for fast lookup: speech from lead to instant
import bisect
cum_at = {}


def S(x):
    if x not in cum_at: cum_at[x] = speech(lead, x)
    return cum_at[x]


# dp[i][j]: best cost when sentence i ends at ends_c[j] (j = G means the final tail)
cost = [[INF] * (G + 1) for _ in range(N)]
back = [[-1] * (G + 1) for _ in range(N)]
exp_end = [0.0] * N
acc = 0
for i in range(N):
    acc += SW[i]; exp_end[i] = acc * rate
WIN = 25.0  # seconds of speech a boundary may drift from the steady-rate estimate


def seg_cost(i, a_idx, b_idx):
    sp = S(ends_c[b_idx]) - S(starts_c[a_idx])
    if sp <= 0.15: return INF
    e = SW[i] * rate
    return (math.log(sp / e)) ** 2 * (1 + SW[i] / 40)


def gap_bonus(j):  # longer pauses are likelier sentence ends
    if j >= G: return 0
    L = inner[j][1] - inner[j][0]
    return -0.6 * math.log(1 + L / 0.15)


for j in range(G + 1):
    if abs(S(ends_c[j]) - exp_end[0]) < WIN:
        cost[0][j] = seg_cost(0, 0, j) + gap_bonus(j)
for i in range(1, N):
    for j in range(G + 1):
        if (i < N - 1 and j == G) or (i == N - 1 and j != G): continue
        if abs(S(ends_c[j]) - exp_end[i]) > WIN: continue
        best, bk = INF, -1
        for k in range(j - 1, -1, -1):  # previous sentence ended at gap k, this one starts at starts_c[k+1]
            if cost[i - 1][k] == INF:
                if S(ends_c[k]) < exp_end[i - 1] - WIN: break
                continue
            c = cost[i - 1][k] + seg_cost(i, k + 1, j)
            if c < best: best, bk = c, k
            if S(ends_c[j]) - S(ends_c[k]) > SW[i] * rate * 4 + 3: break
        if bk >= 0:
            cost[i][j] = best + gap_bonus(j); back[i][j] = bk
if cost[N - 1][G] == INF:
    sys.exit('alignment failed: try a different noise_db (e.g. -35 or -28) or check the script matches the VO')
ends_idx = [0] * N; j = G
for i in range(N - 1, -1, -1):
    ends_idx[i] = j; j = back[i][j]
res = []
for i, s in enumerate(sents):
    a = starts_c[ends_idx[i - 1] + 1] if i else lead
    b = ends_c[ends_idx[i]]
    # speech pieces inside [a, b]
    pieces, t = [], a
    for g0, g1 in inner:
        if g0 >= a and g1 <= b:
            pieces.append((t, g0)); t = g1
    pieces.append((t, b))
    sp = sum(y - x for x, y in pieces)

    def at(x):  # speech offset -> real time
        for p0, p1 in pieces:
            if x <= p1 - p0 + 1e-9: return p0 + x
            x -= p1 - p0
        return pieces[-1][1]
    ws = s.split(); wts = [wweight(w) for w in ws]; tot = sum(wts); c = 0; wl = []
    for w, n in zip(ws, wts):
        wl.append([round(at(sp * c / tot), 2), w]); c += n
    res.append({'i': i, 'start': round(a, 2), 'end': round(b, 2), 'rate': round(sp / (SW[i] * rate), 2), 'text': s, 'words': wl})
json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for r in res:
    flag = '  <-- check' if not 0.6 < r['rate'] < 1.6 else ''
    print(f"{r['i']:3d} {r['start']:7.2f} {r['end']:7.2f} x{r['rate']:.2f}  {r['text'][:60]}{flag}")
print(f'{N} sentences, {G} pauses, speech {total_speech:.1f}s of {dur:.1f}s')
