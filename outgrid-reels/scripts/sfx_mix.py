#!/usr/bin/env python3
"""
Synthesized sound effects mixed under the voiceover (no downloads: every sound is generated here).
usage (from outgrid-reels/): python3 scripts/sfx_mix.py reels/<name>   -> reels/<name>/public/mix.wav
  reads reels/<name>/sfx.json: {"cues": [[sec, "name", gain_dB?], ...]}
  names: whoosh, swish, pop, pop_hi, pop_lo, tick, ding, cash, coin, boom, riser, error, sparkle, stamp, type, thud
  then: AUDIO=mix.wav scripts/render_encode.sh reels/<name> <out> ...
  python3 scripts/sfx_mix.py --demo <out.wav>   writes every sound in a row, to audition.
Levels: the SFX bus sits about 17 dB under the VO's speech RMS; per-cue gain_dB adds to that.
"""
import json, subprocess, sys
import numpy as np
from scipy import signal

SR = 48000
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r):  # attack / exp release (seconds)
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)
def norm(x, peak=0.9): return x / (np.max(np.abs(x)) + 1e-9) * peak

def band_sweep(d, f0, f1, q=1.2, shape=None):
    """noise through a band-pass whose centre glides f0 -> f1 (log), via STFT masking"""
    n = int(d * SR); x = rng.standard_normal(n + 2048)
    f, tt, Z = signal.stft(x, SR, nperseg=1024)
    k = np.linspace(0, 1, Z.shape[1])
    c = np.exp(np.log(f0) + (np.log(f1) - np.log(f0)) * (k if shape is None else shape(k)))
    lf = np.log(np.maximum(f, 1))[:, None]
    Z *= np.exp(-((lf - np.log(c)[None, :]) ** 2) / (2 * (0.55 / q) ** 2))
    return signal.istft(Z, SR, nperseg=1024)[1][:n]

def whoosh(d=0.55):
    x = band_sweep(d, 350, 2600, q=1.1, shape=lambda k: np.sin(k * np.pi / 2))
    t = np.linspace(0, 1, len(x)); e = np.sin(np.pi * t ** 0.7) ** 2
    return norm(x * e, 0.7)
def swish(d=0.22):
    x = band_sweep(d, 2500, 6000, q=1.4); t = np.linspace(0, 1, len(x))
    return norm(x * np.sin(np.pi * t) ** 2, 0.45)
def pop(f0=880, f1=330, d=0.11):
    t = t_(d); f = f1 + (f0 - f1) * np.exp(-t / 0.018)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.03), 0.75)
def tick():
    t = t_(0.03); return norm(np.sin(2 * np.pi * 2600 * t) * env(len(t), 0.0005, 0.006) + 0.3 * rng.standard_normal(len(t)) * env(len(t), 0.0003, 0.003), 0.5)
def bell(f, d=1.4, parts=((1, 1, 1), (2.0, 0.35, 0.6), (2.76, 0.22, 0.45), (5.4, 0.08, 0.25)), decay=0.45):
    t = t_(d); y = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (decay * r)) for m, a, r in parts)
    return y * np.minimum(1, t / 0.002) * np.minimum(1, (d - t) / (0.25 * d))
def ding(): return norm(bell(1318.5) + 0.6 * bell(1975.5), 0.6)
def sparkle():
    out = np.zeros(int(1.2 * SR))
    for i, f in enumerate((1046.5, 1318.5, 1568, 2093)):
        b = bell(f, 0.9, decay=0.25); o = int(i * 0.07 * SR); out[o:o + len(b)] += b[:len(out) - o] * (0.8 + 0.1 * i)
    return norm(out, 0.55)
def coin():
    out = np.zeros(int(0.8 * SR))
    for o, f in ((0, 2637), (0.075, 3520)):
        b = bell(f, 0.7, parts=((1, 1, 1), (2.4, 0.4, 0.5), (4.1, 0.2, 0.3)), decay=0.18); i = int(o * SR); out[i:i + len(b)] += b[:len(out) - i]
    return norm(out, 0.5)
def cash():
    out = np.zeros(int(1.6 * SR))
    r = band_sweep(0.12, 3000, 5000, q=2) * env(int(0.12 * SR), 0.001, 0.03)       # "cha"
    out[:len(r)] += 0.6 * norm(r)
    for f in (2093, 2637, 3136):                                                  # "-ching"
        b = bell(f, 1.4, decay=0.55); i = int(0.11 * SR); out[i:i + len(b)] += 0.5 * b[:len(out) - i]
    return norm(out, 0.65)
def boom(d=1.0):
    t = t_(d); f = 42 + 70 * np.exp(-t / 0.08)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 0.35)
    n = signal.sosfilt(signal.butter(2, 400, 'low', fs=SR, output='sos'), rng.standard_normal(len(t))) * env(len(t), 0.001, 0.05)
    return norm(y + 0.6 * norm(n), 0.85)
def thud(): return norm(boom(0.35) * 0.7 + 0.3 * swish(0.35)[:int(0.35 * SR)], 0.6)
def riser(d=1.1):
    x = band_sweep(d, 300, 5000, q=1.6, shape=lambda k: k ** 1.6); t = np.linspace(0, 1, len(x))
    s = np.sin(2 * np.pi * np.cumsum(220 + 500 * t ** 2) / SR) * 0.15
    return norm((x + s) * t ** 2.2 * (1 - np.clip((t - 0.97) / 0.03, 0, 1)), 0.6)
def error():
    out = np.zeros(int(0.6 * SR))
    for o, f in ((0, 392), (0.17, 293.7)):
        t = t_(0.2); y = signal.sawtooth(2 * np.pi * f * t, 0.5) * env(len(t), 0.005, 0.07)
        i = int(o * SR); out[i:i + len(y)] += y
    return norm(signal.sosfilt(signal.butter(2, 1800, 'low', fs=SR, output='sos'), out), 0.5)
def stamp(): return norm(boom(0.3) * 0.8 + 0.5 * band_sweep(0.3, 900, 500) * env(int(0.3 * SR), 0.001, 0.04), 0.7)
def typing(n=6, gap=0.075):
    out = np.zeros(int((n * gap + 0.1) * SR))
    for i in range(n):
        k = tick() * (0.6 + 0.4 * rng.random()); o = int((i * gap + rng.random() * 0.015) * SR); out[o:o + len(k)] += k
    return norm(out, 0.4)

LIB = {'whoosh': whoosh, 'swish': swish, 'pop': pop, 'pop_hi': lambda: pop(1300, 600, 0.09), 'pop_lo': lambda: pop(520, 200, 0.14),
       'tick': tick, 'ding': ding, 'cash': cash, 'coin': coin, 'boom': boom, 'riser': riser, 'error': error, 'sparkle': sparkle,
       'stamp': stamp, 'type': typing, 'thud': thud}
OFFSET = {'riser': None}  # riser cues name the moment it peaks; it starts len(riser) earlier

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def main():
    if sys.argv[1] == '--demo':
        parts = [np.concatenate([LIB[k](), np.zeros(SR // 2)]) for k in LIB]
        y = np.concatenate(parts); write(sys.argv[2], np.stack([y, y], 1)); print(' '.join(LIB)); return
    d = sys.argv[1].rstrip('/')
    cues = json.load(open(f'{d}/sfx.json'))['cues']
    vo = load(f'{d}/public/vo.mp3')
    speech = vo[np.abs(vo) > 0.02]; vo_rms = np.sqrt(np.mean(speech ** 2))
    bus = np.zeros(len(vo) + 3 * SR)
    cache = {}
    for c in cues:
        sec, name = c[0], c[1]; g = c[2] if len(c) > 2 else 0
        if name not in cache: cache[name] = LIB[name]()
        x = cache[name]; st = int(sec * SR) - (len(x) if name == 'riser' else 0)
        if st < 0: x = x[-st:]; st = 0
        x = x * 10 ** (g / 20); bus[st:st + len(x)] += x[:len(bus) - st]
    # bus level: each sound peaks ~0.5-0.9; scale so a typical cue sits ~17 dB under speech RMS
    ref = np.sqrt(np.mean(cache.get('whoosh', whoosh()) ** 2)) if cues else 1
    bus *= vo_rms / max(ref, 1e-6) * 10 ** (-17 / 20)
    mix = np.zeros_like(bus); mix[:len(vo)] = vo; mix += bus
    peak = np.max(np.abs(mix))
    if peak > 0.97: mix *= 0.97 / peak
    write(f'{d}/public/mix.wav', np.stack([mix, mix], 1))
    print(f'{len(cues)} cues, vo speech rms {20*np.log10(vo_rms):.1f} dBFS, mix peak {20*np.log10(np.max(np.abs(mix))):.1f} dBFS -> {d}/public/mix.wav')

def write(path, y):
    y16 = (np.clip(y, -1, 1) * 32767).astype('<i2')
    import wave
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y16.tobytes())

if __name__ == '__main__':
    main()
