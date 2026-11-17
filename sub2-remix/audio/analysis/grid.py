"""Fit a precise beat grid to a section of a track and dump per-beat onset
strength (broadband and low band) and per-bar chroma, for choosing cues and
splice points.

    python -I sub2-remix/audio/analysis/grid.py <track> <lo> <hi> <bpmMin> <bpmMax> [out.json]
"""
import json
import subprocess
import sys

import numpy as np

SR = 22050
HOP = 128


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64)


x = decode(sys.argv[1])
lo, hi, bmin, bmax = map(float, sys.argv[2:6])
n = 2048
pad = np.pad(x, (n // 2, n // 2))
idx = np.arange(0, len(x), HOP)
win = np.hanning(n)
freqs = np.fft.rfftfreq(n, 1 / SR)
mags = []
for s in range(0, len(idx), 4096):
    fr = np.stack([pad[i:i + n] for i in idx[s:s + 4096]]) * win
    mags.append(np.abs(np.fft.rfft(fr, axis=1)).astype(np.float32))
mag = np.concatenate(mags)
lm = np.log1p(100 * mag)
d = np.maximum(np.diff(lm, axis=0, prepend=lm[:1]), 0)
env = d.sum(axis=1)
low = d[:, freqs < 160].sum(axis=1)
fps = SR / HOP
t = np.arange(len(env)) / fps
sel = (t >= lo) & (t < hi)
e = env.copy(); e -= np.convolve(e, np.ones(32) / 32, mode="same"); e = np.maximum(e, 0)


def score(bpm, ph):
    beats = np.arange(lo + ph, hi, 60 / bpm)
    return np.interp(beats, t, e).sum() + 0.5 * np.interp(beats + 30 / bpm, t, e).sum()


best = (-1, 0, 0)
for bpm in np.arange(bmin, bmax, 0.01):
    p = 60 / bpm
    for ph in np.arange(0, p, 0.004):
        s = score(bpm, ph)
        if s > best[0]:
            best = (s, bpm, ph)
_, bpm, ph = best
# refine phase finely
p = 60 / bpm
phs = np.arange(ph - 0.006, ph + 0.006, 0.0005)
ph = phs[int(np.argmax([score(bpm, q) for q in phs]))]
beat0 = lo + ph
# extend back to track start
first = beat0 - np.floor(beat0 / p) * p
beats = np.arange(first, len(x) / SR, p)
bstr = np.array([env[max(0, int(b * fps) - 3): int(b * fps) + 4].max(initial=0) for b in beats])
lstr = np.array([low[max(0, int(b * fps) - 3): int(b * fps) + 4].max(initial=0) for b in beats])
# chroma per beat
pitch = 69 + 12 * np.log2(np.maximum(freqs, 1) / 440)
band = (freqs > 60) & (freqs < 4000)
chroma_map = np.zeros((12, len(freqs)))
for k in np.where(band)[0]:
    chroma_map[int(round(pitch[k])) % 12, k] = 1
chroma = []
for b in beats:
    a = int(b * fps); z = int((b + p) * fps)
    c = chroma_map @ mag[a:z].mean(axis=0) if z > a and z <= len(mag) else np.zeros(12)
    chroma.append((c / (np.linalg.norm(c) + 1e-9)).round(3).tolist())
out = {"bpm": round(bpm, 4), "period": p, "firstBeat": first, "beats": beats.round(4).tolist(), "strength": bstr.round(2).tolist(), "low": lstr.round(2).tolist(), "chroma": chroma}
print(json.dumps({"bpm": out["bpm"], "period": round(p, 5), "firstBeat": round(first, 4), "fitFrom": round(beat0, 4)}))
if len(sys.argv) > 6:
    json.dump(out, open(sys.argv[6], "w"))
