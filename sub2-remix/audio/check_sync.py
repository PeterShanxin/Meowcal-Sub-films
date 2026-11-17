"""Check that every picture cue lands on Red's beat in a rendered file.

    python -I sub2-remix/audio/check_sync.py <film.mp4 | mix.wav>

Two measurements, both against audio/cues.json:

1. Placement: the file's audio is cross-correlated with out/music.wav (the
   edit before mastering) to find how far the whole soundtrack sits from the
   picture's clock. It should be within a millisecond or two.
2. Onsets: for every cue, the strongest spectral-flux onset within +-40 ms of
   the cue is found in the file itself, with its offset in ms and its strength
   against the median of the surrounding second. "hit" means a clear onset
   within +-15 ms; "soft" means the music has only a small rise there; "off"
   means the nearest clear onset is further than 15 ms away.

Also prints, for each cue, how far it is from the track's own beat grid
(cues.json "music": firstBeat + n * beat), which is the edit's design error.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 22050
HOP = 32
table = json.loads((ROOT / "audio" / "cues.json").read_text(encoding="utf-8"))


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-map", "0:a:0", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64)


def flux(x: np.ndarray) -> np.ndarray:
    n = 256
    pad = np.pad(x, (n // 2, n // 2))
    win = np.hanning(n)
    frames = np.lib.stride_tricks.sliding_window_view(pad, n)[::HOP] * win
    mag = np.log1p(100 * np.abs(np.fft.rfft(frames, axis=1)))
    return np.maximum(np.diff(mag, axis=0, prepend=mag[:1]), 0).sum(axis=1)


def flat(cues: dict) -> list[tuple[str, float]]:
    out = []
    for name, value in cues.items():
        if isinstance(value, dict):
            out += [(f"{name}.{k}", v) for k, v in value.items()]
        elif isinstance(value, list):
            out += [(f"{name}[{i}]", v) for i, v in enumerate(value)]
        else:
            out.append((name, value))
    return sorted(out, key=lambda kv: kv[1])


def film_to_track(t: float) -> float | None:
    segs = table["music"]["segments"]
    for i, seg in enumerate(segs):
        end = segs[i + 1]["film"] if i + 1 < len(segs) else table["seconds"]
        if seg["film"] <= t < end:
            return seg["from"] + (t - seg["film"])
    return None


def main() -> None:
    film = Path(sys.argv[1])
    x = decode(film)
    ref = decode(ROOT / "out" / "music.wav")
    # 1. Placement, from a 6 s window around the drop.
    a = int(12 * SR)
    seg = ref[a:a + 6 * SR]
    lags = np.arange(-int(0.05 * SR), int(0.05 * SR) + 1)
    corr = [float(np.dot(seg, x[a + l:a + l + len(seg)])) for l in lags]
    lag = lags[int(np.argmax(corr))] / SR * 1000
    print(f"soundtrack placement vs picture clock: {lag:+.2f} ms")

    # 2. Onsets.
    env = flux(x)
    fps = SR / HOP
    music = table["music"]
    results = []
    for name, t in flat(table["cues"]):
        i = int(round(t * fps))
        w = int(0.04 * fps)
        lo, hi = max(0, i - w), min(len(env), i + w + 1)
        j = lo + int(np.argmax(env[lo:hi]))
        med = float(np.median(env[max(0, i - int(fps / 2)):i + int(fps / 2)])) + 1e-9
        strength = env[j] / med
        delta = (j - i) / fps * 1000
        verdict = "hit" if strength >= 2.0 and abs(delta) <= 15 else ("soft" if abs(delta) <= 15 else "off")
        track = film_to_track(t)
        grid = None
        if track is not None:
            n = round((track - music["firstBeat"]) / music["beat"] * 2) / 2
            grid = (track - (music["firstBeat"] + n * music["beat"])) * 1000
        results.append((name, t, delta, strength, verdict, grid))
        g = f"{grid:+5.1f} ms" if grid is not None else "   -   "
        print(f"{name:16s} {t:7.3f}s  onset {delta:+6.1f} ms  x{strength:5.1f}  {verdict:4s}  grid {g}")
    counts = {v: sum(1 for r in results if r[4] == v) for v in ("hit", "soft", "off")}
    worst = max(abs(r[5]) for r in results if r[5] is not None)
    print(f"cues: {len(results)}  hit {counts['hit']}  soft {counts['soft']}  off {counts['off']}  max grid error {worst:.1f} ms")


if __name__ == "__main__":
    main()
