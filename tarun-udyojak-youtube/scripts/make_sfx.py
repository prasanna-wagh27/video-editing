# Sound-effects library, synthesised from scratch in numpy (no samples -> no copyright issues).
# usage: python3 scripts/make_sfx.py [out_dir=shared/sfx]
# Every file is 48 kHz mono 16-bit WAV, peak-normalised to -3 dBFS; set loudness per cue with <Sfx v=...>.
import sys, os, wave
import numpy as np

OUT = sys.argv[1] if len(sys.argv) > 1 else 'shared/sfx'
SR = 48000
rng = np.random.default_rng(11)


def T(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def lp(x, cut):
    """One-pole low-pass; cut may be a scalar or an array (time-varying), in Hz."""
    cut = np.broadcast_to(np.asarray(cut, float), x.shape)
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def hp(x, cut):
    return x - lp(x, cut)


def bp(x, lo, hi):
    return hp(lp(x, hi), lo)


def env_ad(n, a, d, curve=4.0):
    """Attack (s) then exponential decay over d (s); total length n samples."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), np.exp(-curve * (t - a) / max(d, 1e-6)))
    return e


def sweep(f0, f1, d, shape='exp'):
    t = T(d)
    f = f0 * (f1 / f0) ** (t / d) if shape == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def tone(f, d, partials=((1, 1),)):
    t = T(d)
    return sum(g * np.sin(2 * np.pi * f * k * t) for k, g in partials)


def pad(x, d):
    n = int(d * SR)
    return np.concatenate([x, np.zeros(max(0, n - len(x)))])[:n] if n else x


def mix(*parts):
    n = max(int(off * SR) + len(p) for off, p in parts)
    y = np.zeros(n)
    for off, p in parts:
        i = int(off * SR); y[i:i + len(p)] += p[:max(0, n - i)]
    return y


def save(name, x):
    x = np.asarray(x, float)
    fade = min(len(x), int(0.004 * SR)); x[-fade:] *= np.linspace(1, 0, fade)
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (-3 / 20)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())
    print(f'{name:10s} {len(x) / SR:.2f}s')


os.makedirs(OUT, exist_ok=True)

# whoosh: filtered noise swept up then down, for big moves / scene changes
d = 0.7; t = T(d); shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
save('whoosh', lp(noise(d), 300 + 3800 * shape) * shape)

# swish: short quick whoosh, for cards sliding in
d = 0.28; t = T(d); shape = np.sin(np.pi * t / d) ** 1.5
save('swish', hp(lp(noise(d), 900 + 6000 * shape), 400) * shape)

# pop: pitched bubble, for icons/labels appearing
d = 0.14; save('pop', sweep(900, 260, d) * env_ad(int(d * SR), 0.002, 0.06))

# click: UI tap
d = 0.05; save('click', hp(noise(d), 2000) * env_ad(int(d * SR), 0.0005, 0.008) + 0.4 * tone(1800, d) * env_ad(int(d * SR), 0.0005, 0.01))

# tick: clock tick / counter step
d = 0.04; save('tick', bp(noise(d), 3000, 7000) * env_ad(int(d * SR), 0.0003, 0.006))

# ding: bright bell, for a key number or "correct"
d = 1.4; save('ding', tone(1318.5, d, ((1, 1), (2.76, 0.35), (5.4, 0.15))) * env_ad(int(d * SR), 0.002, 0.9))

# coin: two quick metallic pings
d = 0.5; p = lambda f: tone(f, d, ((1, 1), (2.4, 0.4), (4.1, 0.2))) * env_ad(int(d * SR), 0.001, 0.25)
save('coin', mix((0, p(1975)), (0.07, p(2637))))

# cash: register "ka-ching" = drawer thunk + bell
d = 1.2; thunk = lp(noise(0.12), 900) * env_ad(int(0.12 * SR), 0.001, 0.05)
bell = tone(2093, d, ((1, 1), (2.5, 0.5), (3.9, 0.25))) * env_ad(int(d * SR), 0.002, 0.7)
save('cash', mix((0, 1.4 * thunk), (0.09, bell), (0.09, 0.6 * tone(2637, d) * env_ad(int(d * SR), 0.002, 0.6))))

# thud: punchy low hit, for stamps / big numbers landing
d = 0.5; save('thud', (sweep(140, 45, d) + 0.5 * lp(noise(d), 500)) * env_ad(int(d * SR), 0.002, 0.18))

# boom: cinematic sub drop + noise tail, for reveals
d = 2.2; save('boom', (sweep(90, 30, d) * env_ad(int(d * SR), 0.003, 1.2) + 0.35 * lp(noise(d), 260) * env_ad(int(d * SR), 0.003, 0.6)))

# riser: 2 s tension build into a reveal
d = 2.0; t = T(d); g = (t / d) ** 2
save('riser', 0.6 * lp(noise(d), 400 + 7000 * g) * g + 0.4 * sweep(180, 900, d) * g)

# type: keyboard burst, for search bars / typing text
d = 0.9; ks = [k * 0.075 + rng.uniform(0, 0.02) for k in range(11)]
key = lambda: bp(noise(0.03), 1500, 6000) * env_ad(int(0.03 * SR), 0.0005, 0.006) * rng.uniform(0.6, 1)
save('type', mix(*[(k, key()) for k in ks]))

# stamp: rubber stamp slam
d = 0.35; save('stamp', (lp(noise(d), 1400) + 0.8 * sweep(220, 70, d)) * env_ad(int(d * SR), 0.001, 0.07))

# buzz: wrong / loss
d = 0.45; sq = np.sign(np.sin(2 * np.pi * 110 * T(d))) + 0.5 * np.sign(np.sin(2 * np.pi * 116 * T(d)))
save('buzz', lp(sq, 1600) * env_ad(int(d * SR), 0.005, 0.5, 2))

# chime: success, three rising notes
p = lambda f: tone(f, 0.9, ((1, 1), (2, 0.3), (3, 0.1))) * env_ad(int(0.9 * SR), 0.003, 0.5)
save('chime', mix((0, p(1046.5)), (0.09, p(1318.5)), (0.18, p(1568))))

# shutter: camera click, for photos appearing
c1 = hp(noise(0.03), 1500) * env_ad(int(0.03 * SR), 0.0005, 0.006)
save('shutter', mix((0, c1), (0.07, 0.8 * c1), (0.02, 0.3 * lp(noise(0.08), 900) * env_ad(int(0.08 * SR), 0.001, 0.03))))

# paper: rustle, for clippings / documents
d = 0.4; t = T(d); grains = (rng.random(int(d * SR)) < 0.004) * rng.uniform(0.3, 1, int(d * SR))
save('paper', bp(lp(grains, 5000) + 0.08 * noise(d), 900, 7000) * np.sin(np.pi * t / d))

# glitch: digital stutter
d = 0.3; x = np.sign(np.sin(2 * np.pi * 70 * T(d))) * (rng.random(int(d * SR)) < 0.6)
x *= np.repeat(rng.random(30) > 0.4, int(d * SR) // 30 + 1)[:int(d * SR)]
save('glitch', hp(x + 0.3 * noise(d), 300) * 0.6)

# swipe: phone / app swipe (short rising swish + click)
d = 0.22; t = T(d); shape = np.sin(np.pi * t / d)
save('swipe', mix((0, hp(lp(noise(d), 1500 + 6000 * t / d), 600) * shape), (0.18, 0.5 * c1)))

# notify: phone notification (two soft notes)
p = lambda f: tone(f, 0.5, ((1, 1), (2, 0.2))) * env_ad(int(0.5 * SR), 0.004, 0.25)
save('notify', mix((0, p(880)), (0.12, p(1318.5))))
