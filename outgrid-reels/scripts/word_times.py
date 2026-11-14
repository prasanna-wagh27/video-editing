#!/usr/bin/env python3
"""
Word-level caption timing without Whisper (works offline).
usage (from outgrid-reels/): python3 scripts/word_times.py script.txt voice.mp3 [noise_dB=-28] [min_pause=0.13] > captions.js
script.txt: one phrase per line, *word* marks a highlight (several words: *a b*).
1. pause-bounded speech segments (ffmpeg silencedetect)
2. DP: assign script words to segments by syllable weight (Devanagari consonants + vowels - virama; Latin vowel groups)
3. inside a segment: syllable nuclei = peaks of the loudness envelope; word k starts at the dip before
   the peak where its syllables begin (proportional mapping of script syllables onto detected peaks)
4. prints `const CAPS = [...]` chunks ({a, b, words: [{w, t, hi}]}, frames at 30 fps), <=4 words, never across a pause
"""
import json, re, subprocess, sys
import numpy as np

FPS = 30
SPOKEN = {'६०': 'साठ', '१२': 'बारा', '८': 'आठ', '१': 'एक', '१०': 'दहा', '१००': 'शंभर', '५०': 'पन्नास', '२०': 'वीस', '३०': 'तीस'}

def segments(audio, noise, mind):
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).decode())
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', audio, '-af', f'silencedetect=noise={noise}dB:d={mind}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ev = re.findall(r'silence_(start|end): ([0-9.]+)', out)
    segs, start, insil = [], 0.0, False
    for k, v in ev:
        v = float(v)
        if k == 'start':
            if v > start + 0.05: segs.append((start, v))
            insil = True
        else:
            start, insil = v, False
    if not insil and dur > start + 0.05: segs.append((start, dur))
    return segs

def weight(w):
    core = re.sub(r"[*'\"!?,.…:‘’“”]", '', w)
    core = SPOKEN.get(core, core)
    if re.match(r'^[A-Za-z0-9-]+$', core): return max(1, len(re.findall(r'[aeiouy]+', core.lower())))
    return max(1, len(re.findall(r'[अ-औक-हॲऑ]', core)) - core.count('्'))

def align(words, ends, W, segs):
    n, m = len(words), len(segs)
    rate = sum(b - a for a, b in segs) / sum(W)
    pre = np.concatenate([[0], np.cumsum(W)])
    INF = 1e18
    dp = np.full((m + 1, n + 1), INF); bk = np.zeros((m + 1, n + 1), int); dp[0][0] = 0
    for j in range(1, m + 1):
        d = segs[j - 1][1] - segs[j - 1][0]
        for i in range(1, n + 1):
            for k in range(max(0, i - 25), i):
                if dp[j - 1][k] >= INF: continue
                pred = (pre[i] - pre[k]) * rate
                c = dp[j - 1][k] + ((pred - d) / max(0.6, d) ** 0.5) ** 2 - 1.2 * ends[i - 1]
                if c < dp[j][i]: dp[j][i], bk[j][i] = c, k
    out, i = [], n
    for j in range(m, 0, -1):
        k = bk[j][i]; out.append((segs[j - 1], k, i)); i = k
    return out[::-1]

def envelope(audio):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', audio, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'])
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    hop, win = 160, 400  # 10 ms hop, 25 ms window
    nfr = max(1, (len(x) - win) // hop)
    idx = np.arange(win)[None, :] + hop * np.arange(nfr)[:, None]
    db = 10 * np.log10(np.mean(x[idx] ** 2, axis=1) + 1e-9)
    k = np.ones(5) / 5
    return np.convolve(db, k, mode='same')  # 50 ms smoothing, 1 value per 10 ms

def nuclei(env, a, b):
    i0, i1 = int(a * 100), int(b * 100)
    e = env[i0:i1]
    if len(e) < 3: return [a], [a]
    peaks = [i for i in range(1, len(e) - 1) if e[i] >= e[i - 1] and e[i] > e[i + 1] and e[i] > e.max() - 25]
    # keep peaks separated by a dip of >= 1.5 dB and >= 60 ms apart
    kept = []
    for p in peaks:
        if kept and (p - kept[-1] < 6 or min(e[kept[-1]:p + 1]) > min(e[kept[-1]], e[p]) - 1.5):
            if e[p] > e[kept[-1]]: kept[-1] = p
            continue
        kept.append(p)
    if not kept: kept = [int(np.argmax(e))]
    dips = [0] + [kept[q - 1] + int(np.argmin(e[kept[q - 1]:kept[q] + 1])) for q in range(1, len(kept))]
    return [(i0 + p) / 100 for p in kept], [(i0 + d) / 100 for d in dips]

def main():
    script, audio = sys.argv[1], sys.argv[2]
    noise = float(sys.argv[3]) if len(sys.argv) > 3 else -28
    mind = float(sys.argv[4]) if len(sys.argv) > 4 else 0.13
    words, ends = [], []
    for line in open(script, encoding='utf-8').read().split('\n'):
        ws = [w for w in line.split() if w != '—']
        for i, w in enumerate(ws):
            words.append(w); ends.append(1 if i == len(ws) - 1 else (0.5 if re.search(r'[,…!?:.]$', w) else 0))
    hi, inhi = [], False
    for w in words:
        if w.startswith('*'): inhi = True
        hi.append(inhi)
        if re.sub(r'[.,!?…]+$', '', w).endswith('*'): inhi = False
    W = [weight(w) for w in words]
    segs = segments(audio, noise, mind)
    env = envelope(audio)
    caps, report = [], []
    for (a, b), k0, k1 in align(words, ends, W, segs):
        peaks, dips = nuclei(env, a, b)
        ws = list(range(k0, k1)); tot = sum(W[i] for i in ws); acc = 0; times = []
        for i in ws:
            q = min(len(peaks) - 1, int(round(acc / tot * len(peaks))))
            times.append(a if q == 0 else dips[q]); acc += W[i]
        times = [max(t, times[j - 1] + 0.08) if j else t for j, t in enumerate(times)]
        report.append(f'{a:6.2f}-{b:6.2f} peaks={len(peaks):2d} syl={tot:2d} ' + ' '.join(f'{words[i].strip("*")}@{t:.2f}' for i, t in zip(ws, times)))
        n = -(-len(ws) // 4); size = -(-len(ws) // n)
        for c in range(0, len(ws), size):
            part = list(zip(ws[c:c + size], times[c:c + size]))
            nxt = times[c + size] if c + size < len(ws) else b + 0.25
            caps.append({'a': round(part[0][1] * FPS) - 2, 'b': round(nxt * FPS) - (2 if c + size < len(ws) else 0),
                         'words': [{'w': words[i].replace('*', ''), 't': round(t * FPS), 'hi': hi[i]} for i, t in part]})
    for j in range(len(caps) - 1): caps[j]['b'] = min(caps[j]['b'], caps[j + 1]['a'])
    print('// generated by scripts/word_times.py: word-level timing from syllable peaks in the VO')
    print('export const CAPS = ' + json.dumps(caps, ensure_ascii=False) + ';')
    sys.stderr.write('\n'.join(report) + '\n')

if __name__ == '__main__':
    main()
