"""Measure the tempo, beat phase and section energy of a track.

    python sub2-remix/audio/analysis/tempo.py <track.mp3> [start end]

Decodes with FFmpeg to mono 22.05 kHz, builds a spectral-flux onset envelope,
finds the tempo by autocorrelation and the beat phase by comb alignment, and
prints loudness per bar so sections can be picked.
"""
import json
import subprocess
import sys

import numpy as np

SR = 22050
HOP = 256


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64)


def flux(x):
    n = 2048
    win = np.hanning(n)
    frames = np.lib.stride_tricks.sliding_window_view(np.pad(x, (n // 2, n // 2)), n)[::HOP] * win
    mag = np.log1p(100 * np.abs(np.fft.rfft(frames, axis=1)))
    d = np.diff(mag, axis=0, prepend=mag[:1])
    env = np.maximum(d, 0).sum(axis=1)
    env -= np.convolve(env, np.ones(16) / 16, mode="same")
    return np.maximum(env, 0), mag


def main():
    x = decode(sys.argv[1])
    env, mag = flux(x)
    fps = SR / HOP
    lo, hi = (float(sys.argv[2]), float(sys.argv[3])) if len(sys.argv) > 3 else (0, len(x) / SR)
    seg = env[int(lo * fps): int(hi * fps)]
    ac = np.correlate(seg - seg.mean(), seg - seg.mean(), mode="full")[len(seg) - 1:]
    best = None
    for bpm in np.arange(60, 181, 0.05):
        lag = 60 / bpm * fps
        score = sum(np.interp(lag * k, np.arange(len(ac)), ac) for k in (1, 2, 4)) 
        if best is None or score > best[0]:
            best = (score, bpm)
    bpm = best[1]
    period = 60 / bpm
    # Beat phase: the offset whose comb collects the most onset energy.
    t = np.arange(len(env)) / fps
    phases = np.arange(0, period, 0.002)
    sel = (t >= lo) & (t < hi)
    def comb(ph):
        beats = np.arange(lo + ph, hi, period)
        return np.interp(beats, t, env).sum()
    phase = phases[int(np.argmax([comb(p) for p in phases]))]
    # Low band (kick) per beat, to find downbeats (strongest beat of four).
    freqs = np.fft.rfftfreq(2048, 1 / SR)
    low = np.maximum(np.diff(mag[:, freqs < 150], axis=0, prepend=mag[:1, freqs < 150]), 0).sum(axis=1)
    beats = np.arange(lo + phase, hi, period)
    lowb = np.array([low[int(b * fps) - 2: int(b * fps) + 3].max() if int(b * fps) + 3 < len(low) else 0 for b in beats])
    bar_phase = int(np.argmax([lowb[k::4].mean() for k in range(4)]))
    rms = np.sqrt(np.convolve(x ** 2, np.ones(SR // 2) / (SR // 2), mode="same"))
    print(json.dumps({"bpm": round(bpm, 3), "period": period, "firstBeat": round(lo + phase, 4), "downbeatIndex": bar_phase}))
    downs = beats[bar_phase::4]
    for i, d in enumerate(downs):
        a = int(d * SR); b = int(min(len(x), (d + 4 * period) * SR))
        db = 20 * np.log10(np.sqrt(np.mean(x[a:b] ** 2)) + 1e-9)
        bright = float(np.mean(env[int(d * fps): int((d + 4 * period) * fps)]))
        lowe = float(np.mean(low[int(d * fps): int((d + 4 * period) * fps)]))
        print(f"bar {i:3d}  {d:7.3f}s  {db:6.1f} dB  flux {bright:6.2f}  low {lowe:6.2f}  " + "#" * int(max(0, db + 40)))


main()
