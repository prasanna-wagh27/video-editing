#!/usr/bin/env python3
"""
Accurate word-level captions: Whisper forced alignment of the exact script text.
usage (from outgrid-reels/): python3 scripts/align_whisper.py script.txt voice.mp3 [lang=mr] > captions.js
  script.txt: one phrase per line; *word* = highlight (several: *a b*). Lines are caption breaks.
  Model: .cache/whisper-small-ct2 (scripts/get_whisper_model.sh). Needs: pip install faster-whisper
How:
 1. Real pauses in the VO (ffmpeg silencedetect) split it into spoken phrases. (Whisper's own segment
    timestamps drift by seconds on Marathi, so they are not used.)
 2. Script lines are assigned to groups of phrases by a DP whose cost is how badly Whisper thinks that
    text fits that audio (teacher-forced token log-probs) plus a light duration prior; a line never splits.
 3. Each group's exact script text is force-aligned (Whisper cross-attention DTW) on that group's audio,
    so every script word gets its own start time.
Prints `export const CAPS = [...]` (frames @30fps: {a, b, words:[{w, t, hi}]}, <=4 words, never across a line)
and a word-time report on stderr (use it for scene cues).
"""
import json, os, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer

FPS, SR = 30, 16000
MODEL = '.cache/whisper-small-ct2'
DIG = {'0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'}
NUM = {'१': 'एक', '२': 'दोन', '३': 'तीन', '८': 'आठ', '१०': 'दहा', '१२': 'बारा', '२०': 'वीस', '५०': 'पन्नास', '६०': 'साठ', '१००': 'शंभर'}
LAT = dict(b='ब', c='क', d='ड', f='फ', g='ग', h='ह', j='ज', k='क', l='ल', m='म', n='न', p='प', q='क', r='र', s='स', t='ट', v='व', w='व', x='कस', y='य', z='ज')
EQ = str.maketrans({'ख': 'क', 'घ': 'ग', 'छ': 'च', 'झ': 'ज', 'ठ': 'ट', 'ढ': 'ड', 'थ': 'त', 'ध': 'द', 'फ': 'प', 'भ': 'ब', 'ण': 'न', 'ळ': 'ल', 'श': 'स', 'ष': 'स', 'ञ': 'न', 'ङ': 'न'})

def skel(w):
    w = re.sub(r"[*'\"!?,.…:‘’“”()]", '', w)
    w = ''.join(DIG.get(c, c) for c in w)
    w = NUM.get(w, w)
    if re.search(r'[A-Za-z]', w): w = ''.join(LAT.get(c, '') for c in w.lower())
    w = w.replace('़', '').translate(EQ)
    return ''.join(c for c in w if 'क' <= c <= 'ह')

def lev(a, b):
    if not a or not b: return max(len(a), len(b))
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1): cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]

def sim(a, b):
    if not a and not b: return 0.5
    return 1 - lev(a, b) / max(len(a), len(b), 1)

def match(sw, ww):
    """global alignment script words <-> whisper words; returns script index -> whisper index (or None)"""
    A, B = [skel(w) for w in sw], [skel(w) for w in ww]
    n, m, G = len(A), len(B), -0.35
    D = np.zeros((n + 1, m + 1)); P = np.zeros((n + 1, m + 1), int)
    D[1:, 0] = G * np.arange(1, n + 1); D[0, 1:] = G * np.arange(1, m + 1); P[1:, 0] = 1; P[0, 1:] = 2
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            opts = (D[i - 1][j - 1] + 2 * sim(A[i - 1], B[j - 1]) - 1, D[i - 1][j] + G, D[i][j - 1] + G)
            k = int(np.argmax(opts)); D[i][j] = opts[k]; P[i][j] = k
    res, i, j = [None] * n, n, m
    while i > 0 and j > 0:
        if P[i][j] == 0: res[i - 1] = j - 1; i, j = i - 1, j - 1
        elif P[i][j] == 1: i -= 1
        else: j -= 1
    return res

def pauses(audio, x, noise=-30, mind=0.2):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', audio, '-af', f'silencedetect=noise={noise}dB:d={mind}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    segs, start, insil, dur = [], 0.0, False, len(x) / SR
    for k, v in re.findall(r'silence_(start|end): ([0-9.]+)', out):
        v = float(v)
        if k == 'start':
            if v > start + 0.05: segs.append((start, v))
            insil = True
        else: start, insil = v, False
    if not insil and dur > start + 0.05: segs.append((start, dur))
    return segs

def syl(w):
    w = re.sub(r"[*'\"!?,.…:‘’“”]", '', w)
    w = NUM.get(w, w)
    if re.search(r'[A-Za-z]', w): return max(1, len(re.findall(r'[aeiouy]+', w.lower())))
    return max(1, len(re.findall(r'[अ-औक-हॲऑ]', w)) - w.count('्'))

def align_group(model, tok, x, ga, gb, wlist, cache):
    """force-align words (list of str) on audio [ga, gb]; returns (starts_sec, sum_neglogp)"""
    key = (round(ga, 2), round(gb, 2))
    if key not in cache:
        a = max(0.0, ga - 0.12); b = min(len(x) / SR, gb + 0.12)
        feats = model.feature_extractor(x[int(a * SR):int(b * SR)])
        nfr = max(1, feats.shape[-1] - 1)
        feats = np.pad(feats, ((0, 0), (0, max(0, 3000 - feats.shape[-1]))))[:, :3000]
        cache[key] = (a, model.encode(feats), min(nfr, 3000))
    a, enc, nfr = cache[key]
    wt = [tok.encode(' ' + w) for w in wlist]  # tokens per script word (punctuation stays inside the word)
    flat = [t for w in wt for t in w]
    res = model.model.align(enc, tok.sot_sequence, [flat], [nfr], median_filter_width=7)[0]
    ti = np.array([p[0] for p in res.alignments]); tm = np.array([p[1] for p in res.alignments])
    jumps = np.pad(np.diff(ti), (1, 0), constant_values=1).astype(bool)
    jt = tm[jumps] / model.tokens_per_second
    bounds = np.pad(np.cumsum([len(w) for w in wt]), (1, 0))[:-1]
    starts = [a + float(jt[min(b, len(jt) - 1)]) for b in bounds]
    nll = -float(np.sum(np.log(np.clip(np.array(res.text_token_probs), 1e-6, 1))))
    return starts, nll

def assign(model, tok, x, lines, words, segs):
    """DP: lines -> consecutive groups of pause segments, cost = Whisper NLL of the text on that audio + duration prior"""
    W = [syl(w) for w in words]
    n, m = len(lines), len(segs)
    LW = [sum(W[i] for i in ln) for ln in lines]
    rate = sum(b - a for a, b in segs) / sum(LW)
    pre = np.concatenate([[0], np.cumsum(LW)])
    INF = 1e18; dp = np.full((n + 1, m + 1), INF); bk = {}; dp[0][0] = 0; cache = {}; got = {}
    # optional band (env ALIGN_BAND=seconds of speech): line i may only end near its expected speech time; makes long VOs (5+ min) tractable
    band = float(os.environ.get('ALIGN_BAND', 'inf'))
    segcum = np.concatenate([[0], np.cumsum([b - a for a, b in segs])])
    for i in range(1, n + 1):
        if i % 10 == 0: print(f'  dp line {i}/{n}', file=sys.stderr, flush=True)
        for j in range(1, m + 1):
            if abs(segcum[j] - pre[i] * rate) > band: continue
            for i0 in range(max(0, i - 5), i):
                for j0 in range(max(0, j - 4), j):
                    if dp[i0][j0] >= INF: continue
                    ga, gb = segs[j0][0], segs[j - 1][1]
                    d = gb - ga; pred = (pre[i] - pre[i0]) * rate
                    if not (0.5 * d < pred < 2.0 * d) or d > 28: continue
                    idx = [w for ln in lines[i0:i] for w in ln]
                    starts, nll = align_group(model, tok, x, ga, gb, [words[k].replace('*', '') for k in idx], cache)
                    c = dp[i0][j0] + nll + 2.0 * ((pred - d) / max(0.6, d) ** 0.5) ** 2
                    if c < dp[i][j]: dp[i][j] = c; bk[(i, j)] = (i0, j0); got[(i0, i, j0, j)] = (idx, starts)
    out, i, j = [], n, m
    while i > 0:
        i0, j0 = bk[(i, j)]
        out.append(got[(i0, i, j0, j)]); i, j = i0, j0
    return out[::-1]

def main():
    script, audio = sys.argv[1], sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else 'mr'
    x = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', audio, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-']), np.int16).astype(np.float32) / 32768
    model = WhisperModel(MODEL, device='cpu', compute_type='int8')
    words, hi, line_end, inhi = [], [], [], False
    lines, buf = [], []
    for line in open(script, encoding='utf-8').read().split('\n'):
        toks = line.split()
        for i, w in enumerate(toks):
            if w.startswith('*'): inhi = True
            words.append(w); hi.append(inhi); line_end.append(i == len(toks) - 1)
            if re.sub(r'[.,!?…]+$', '', w).endswith('*'): inhi = False
            buf.append(len(words) - 1)
        if toks: lines.append(buf); buf = []
    segs = pauses(audio, x)
    tok = Tokenizer(model.hf_tokenizer, True, task='transcribe', language=lang)
    times = [None] * len(words)
    for idx, starts in assign(model, tok, x, lines, words, segs):
        for i, st in zip(idx, starts): times[i] = st
    for i in range(1, len(times)): times[i] = max(times[i], times[i - 1] + 0.06)
    # chunks: <=4 words, break at line ends
    caps, cur = [], []
    def flush(nxt):
        if cur: caps.append({'a': round(times[cur[0]] * FPS) - 2, 'b': None, 'words': [{'w': words[i].replace('*', ''), 't': round(times[i] * FPS), 'hi': hi[i]} for i in cur]})
    for ln in lines:
        n = -(-len(ln) // 4); size = -(-len(ln) // n)
        for c in range(0, len(ln), size): cur = ln[c:c + size]; flush(None)
    for j, c in enumerate(caps):
        last = c['words'][-1]['t']
        c['b'] = min(caps[j + 1]['a'] if j + 1 < len(caps) else last + 30, last + 30)
    print('// generated by scripts/align_whisper.py (Whisper forced alignment of the script)')
    print('export const CAPS = ' + json.dumps(caps, ensure_ascii=False) + ';')
    print('export const WORD_T = ' + json.dumps([round(t, 3) for t in times]) + ';')
    for ln in lines: sys.stderr.write(' '.join(f"{words[i].strip('*')}@{times[i]:.2f}" for i in ln) + '\n')

if __name__ == '__main__':
    main()
