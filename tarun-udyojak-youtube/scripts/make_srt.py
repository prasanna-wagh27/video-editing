# timing.json -> .srt (YouTube captions). Long sentences split at commas / every ~9 words.
# usage: python3 scripts/make_srt.py timing.json out.srt
import json, sys
T = json.load(open(sys.argv[1], encoding='utf-8'))
def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}".replace(',1000', ',999')
cues = []
for sen in T:
    ws = sen['words']; part = []
    for k, (t, w) in enumerate(ws):
        part.append((t, w))
        left = len(ws) - k - 1
        if ((w.endswith(',') and len(part) >= 4) or len(part) >= 9) and left >= 3 or k == len(ws) - 1:
            a = part[0][0]
            b = ws[k + 1][0] if k + 1 < len(ws) else sen['end']
            cues.append((a, b, ' '.join(x for _, x in part))); part = []
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    for i, (a, b, txt) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")
print(len(cues), 'cues')
