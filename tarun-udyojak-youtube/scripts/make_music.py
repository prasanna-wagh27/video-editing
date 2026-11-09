# Original background music, synthesised from scratch (no samples, no third-party audio -> no copyright issues).
# usage: python3 scripts/make_music.py out.wav seconds
# 96 BPM, A minor (Am-F-C-G), sections follow the Turf video's story beats.
import sys, wave
import numpy as np

OUT, DUR = sys.argv[1], float(sys.argv[2])
SR = 44100
N = int(DUR * SR)
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

def hz(m):  # midi -> Hz
    return 440.0 * 2 ** ((m - 69) / 12)

# chord roots/tones (midi), 2 bars each
CHORDS = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]
DARK = [(57, [57, 60, 64]), (53, [53, 56, 60]), (50, [50, 53, 57]), (52, [52, 56, 59])]  # Am-Fm-Dm-E for the "problem" part

def chord_at(t):
    dark = 135 <= t < 176
    seq = DARK if dark else CHORDS
    return seq[int(t // (2 * BAR)) % 4]

# section gain curves (time s -> gain), linear in between
def env(points):
    xs, ys = zip(*points)
    return lambda t: np.interp(t, xs, ys)

G = {
    'pad':   env([(0, 0.0), (1.5, 0.9), (69, 0.9), (72, 1.0), (135, 1.0), (176, 1.1), (252, 1.0), (DUR - 3, 0.9), (DUR, 0.0)]),
    'pluck': env([(0, 0.6), (5, 0.7), (69, 0.7), (72, 0.9), (133, 0.9), (136, 0.0), (174, 0.0), (177, 1.0), (250, 1.0), (253, 0.6), (DUR - 2, 0.5), (DUR, 0)]),
    'bass':  env([(0, 0.0), (5.0, 0.0), (5.5, 0.9), (133, 0.9), (136, 0.6), (174, 0.6), (177, 1.0), (251, 1.0), (253, 0.0), (DUR, 0)]),
    'kick':  env([(0, 0.0), (5.0, 0.0), (5.5, 0.7), (69, 0.7), (72, 0.9), (133, 0.9), (136, 0.0), (174, 0.0), (177, 1.0), (251, 1.0), (253, 0.0), (DUR, 0)]),
    'hat':   env([(0, 0.0), (20, 0.0), (24, 0.6), (133, 0.7), (136, 0.0), (180, 0.0), (184, 0.8), (251, 0.8), (253, 0.0), (DUR, 0)]),
    'snare': env([(0, 0.0), (71, 0.0), (72, 0.6), (133, 0.6), (136, 0.0), (184, 0.0), (185, 0.7), (251, 0.7), (253, 0.0), (DUR, 0)]),
}

L = np.zeros(N + SR * 3, np.float32)
R = np.zeros(N + SR * 3, np.float32)

def add(buf, start_s, sig, gain):
    i = int(start_s * SR)
    if i >= N or gain <= 0:
        return
    j = min(i + len(sig), len(buf))
    buf[i:j] += (sig[: j - i] * gain).astype(np.float32)

def tone(f, dur, harm=(1, .5, .25, .12), detune=0.0):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for k, a in enumerate(harm, 1):
        out += a * np.sin(2 * np.pi * f * k * (1 + detune) * t)
    return out, t

# ---- pad: 2 detuned voices per chord tone, slow attack, long release
for b in range(int(DUR / (2 * BAR)) + 1):
    t0 = b * 2 * BAR
    root, notes = chord_at(t0 + 0.01)
    d = 2 * BAR + 1.2
    dark = 135 <= t0 < 176
    harm = (1, .35, .12) if dark else (1, .45, .2, .08)
    sigL = 0; sigR = 0
    for m in notes + [notes[0] + 12]:
        a, t = tone(hz(m), d, harm, +0.0018)
        c, _ = tone(hz(m), d, harm, -0.0018)
        sigL = sigL + a; sigR = sigR + c
    t = np.arange(int(d * SR)) / SR
    e = np.minimum(t / 0.8, 1) * np.clip((d - t) / 1.2, 0, 1)
    e *= 0.85 + 0.15 * np.sin(2 * np.pi * t / (2 * BAR))  # slow swell
    g = float(G['pad'](t0)) * 0.045
    add(L, t0, sigL * e, g); add(R, t0, sigR * e, g)

# ---- pluck arpeggio (8ths), up an octave, with ping-pong echo
pattern = [0, 1, 2, 3, 2, 1, 2, 3]
step = BEAT / 2
for k in range(int(DUR / step)):
    t0 = k * step
    g = float(G['pluck'](t0))
    if g <= 0:
        continue
    root, notes = chord_at(t0)
    seq = notes + [notes[0] + 12]
    m = seq[pattern[k % 8]] + 12
    s, t = tone(hz(m), 0.9, (1, .3, .08))
    s *= np.exp(-t * 7) * np.minimum(t / 0.004, 1)
    acc = 1.0 if k % 8 == 0 else 0.75
    add(L, t0, s, 0.05 * g * acc); add(R, t0, s, 0.04 * g * acc)
    add(R, t0 + 0.75 * BEAT, s, 0.018 * g)   # echo right
    add(L, t0 + 1.5 * BEAT, s, 0.010 * g)    # echo left

# ---- bass on beats 1 and the "and" of 2
for k in range(int(DUR / BEAT)):
    for off, acc in ((0, 1.0), (1.5, 0.6)) if k % 2 == 0 else ((0, 0.8),):
        t0 = k * BEAT + off * BEAT
        g = float(G['bass'](t0))
        if g <= 0:
            continue
        root, _ = chord_at(t0)
        s, t = tone(hz(root - 12), 0.6, (1, .25, .06))
        s *= np.exp(-t * 4) * np.minimum(t / 0.01, 1)
        add(L, t0, s, 0.11 * g * acc); add(R, t0, s, 0.11 * g * acc)

# ---- drums
def kick():
    t = np.arange(int(0.45 * SR)) / SR
    f = 45 + 85 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) * np.minimum(t / 0.002, 1)
def hat():
    t = np.arange(int(0.08 * SR)) / SR
    n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0); n = np.diff(n, prepend=0)
    return n * np.exp(-t * 55) * 0.25
def snare():
    t = np.arange(int(0.25 * SR)) / SR
    n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)
    return (n * 0.5 * np.exp(-t * 20) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25))
K, H, S = kick(), hat(), snare()
for k in range(int(DUR / BEAT)):
    t0 = k * BEAT
    gk = float(G['kick'](t0))
    add(L, t0, K, 0.22 * gk); add(R, t0, K, 0.22 * gk)
    gh = float(G['hat'](t0 + BEAT / 2))
    add(L, t0 + BEAT / 2, H, 0.10 * gh); add(R, t0 + BEAT / 2, H, 0.13 * gh)
    if k % 2 == 1:
        gs = float(G['snare'](t0))
        add(L, t0, S, 0.07 * gs); add(R, t0, S, 0.07 * gs)

# soft riser + impact into the strategies section (~176.6 s)
t = np.arange(int(3.0 * SR)) / SR
n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)
rise = n * (t / 3.0) ** 2 * 0.06
add(L, 173.6, rise, 1); add(R, 173.6, rise, 1)

mix = np.stack([L[:N], R[:N]], 1)
mix /= max(1e-6, np.abs(mix).max()) / 0.89
pcm = (mix * 32767).astype('<i2')
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', OUT, DUR, 's')
