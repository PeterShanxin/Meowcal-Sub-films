"""Original score and sound design for the launch film, synthesised from scratch.

Every cue is placed from src/timeline.json, the same file the picture reads, so
sound and motion share one clock. Output: public/audio/soundtrack.wav
(48 kHz, 24-bit stereo, 15 s).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import wave
import sys
import runpy

if __name__ == "__main__" and "--cat-planet" in sys.argv:
    runpy.run_path(os.path.join(os.path.dirname(__file__), "cat_planet.py"), run_name="__main__")
    sys.exit(0)

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt, sosfilt_zi

SR = 48_000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "src", "timeline.json"), encoding="utf-8") as timeline_file:
    TL = json.load(timeline_file)
FPS = TL["fps"]
DURATION = TL["duration"] / FPS
N = int(DURATION * SR)
BEAT = 60 / TL["bpm"]
RNG = np.random.default_rng(7)


def sec(frame: float) -> float:
    return frame / FPS


def note(name: str) -> float:
    names = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
             "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
    pitch, octave = name[:-1], int(name[-1])
    midi = 12 * (octave + 1) + names[pitch]
    return 440.0 * 2 ** ((midi - 69) / 12)


class Bus:
    def __init__(self) -> None:
        self.buf = np.zeros((2, N + SR * 4), np.float64)

    def add(self, t: float, sig: np.ndarray, gain: float = 1.0, pan: float | np.ndarray = 0.0) -> None:
        start = int(round(t * SR))
        if start >= N or len(sig) == 0:
            return
        if start < 0:
            sig = sig[-start:]
            if isinstance(pan, np.ndarray):
                pan = pan[-start:]
            start = 0
        end = min(start + len(sig), self.buf.shape[1])
        sig = sig[: end - start] * gain
        if isinstance(pan, np.ndarray):
            pan = pan[: end - start]
        angle = (np.asarray(pan) + 1) * np.pi / 4
        self.buf[0, start:end] += sig * np.cos(angle)
        self.buf[1, start:end] += sig * np.sin(angle)

    def add_stereo(self, t: float, left: np.ndarray, right: np.ndarray, gain: float = 1.0) -> None:
        start = int(round(t * SR))
        end = min(start + len(left), self.buf.shape[1])
        self.buf[0, start:end] += left[: end - start] * gain
        self.buf[1, start:end] += right[: end - start] * gain


# ---------------------------------------------------------------- primitives

def layer(*sigs: np.ndarray) -> np.ndarray:
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs:
        out[: len(x)] += x
    return out


def ts(duration: float) -> np.ndarray:
    return np.arange(int(duration * SR)) / SR


def noise(duration: float) -> np.ndarray:
    return RNG.standard_normal(int(duration * SR))


def filt(sig: np.ndarray, kind: str, freq, order: int = 2) -> np.ndarray:
    sos = butter(order, freq, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, sig)


def sweep_filter(sig: np.ndarray, kind: str, freqs: np.ndarray, block: int = 256, width: float = 0.6) -> np.ndarray:
    """Time-varying filter: re-designed every block, state carried across."""
    out = np.zeros_like(sig)
    zi = None
    for i in range(0, len(sig), block):
        f = float(np.clip(freqs[min(i, len(freqs) - 1)], 30, SR * 0.45))
        band = [f * (1 - width / 2), min(f * (1 + width / 2), SR * 0.45)] if kind == "bandpass" else f
        sos = butter(2, band, btype=kind, fs=SR, output="sos")
        if zi is None or zi.shape != sosfilt_zi(sos).shape:
            zi = sosfilt_zi(sos) * 0
        out[i : i + block], zi = sosfilt(sos, sig[i : i + block], zi=zi)
    return out


def saw(freq: float | np.ndarray, duration: float, harmonics: int = 40) -> np.ndarray:
    t = ts(duration)
    phase = 2 * np.pi * np.cumsum(np.broadcast_to(freq, t.shape)) / SR
    base = float(np.max(freq))
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if k * base > 16000:
            break
        out += np.sin(k * phase) / k
    return out * 0.6


def sine(freq: float | np.ndarray, duration: float) -> np.ndarray:
    t = ts(duration)
    return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(freq, t.shape)) / SR)


def env(duration: float, attack: float, release: float, hold: float = 0.0, curve: float = 3.0) -> np.ndarray:
    t = ts(duration)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    r = np.clip(1 - (t - attack - hold) / max(release, 1e-4), 0, 1) ** curve
    return a * np.where(t < attack + hold, 1, r)


def decay(duration: float, tau: float) -> np.ndarray:
    return np.exp(-ts(duration) / tau)


def reverb_ir(seconds: float, tone: float = 5000) -> tuple[np.ndarray, np.ndarray]:
    t = ts(seconds)
    shape = np.exp(-t / (seconds / 6.5))
    left = filt(RNG.standard_normal(len(t)), "lowpass", tone) * shape
    right = filt(RNG.standard_normal(len(t)), "lowpass", tone) * shape
    return left / np.sqrt(np.sum(left**2)), right / np.sqrt(np.sum(right**2))


# ------------------------------------------------------------------ voices

def kick(level: float = 1.0) -> np.ndarray:
    t = ts(0.5)
    pitch = 46 + 150 * np.exp(-t / 0.028)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t / 0.22)
    click = filt(noise(0.5), "highpass", 2500) * np.exp(-t / 0.003) * 0.35
    return np.tanh((body + click) * 1.6) * level


def boom(duration: float = 2.0, base: float = 38) -> np.ndarray:
    t = ts(duration)
    pitch = base + 60 * np.exp(-t / 0.08)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t / (duration / 3.2))
    grit = filt(noise(duration), "lowpass", 180) * np.exp(-t / 0.25) * 0.5
    return np.tanh((body + grit) * 1.4)


def clap() -> np.ndarray:
    t = ts(0.4)
    burst = np.zeros_like(t)
    for offset in (0.0, 0.011, 0.022):
        shifted = np.clip(t - offset, 0, None)
        burst += (t >= offset) * np.exp(-shifted / (0.006 if offset < 0.02 else 0.12))
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.3
    return filt(noise(0.4), "bandpass", [900, 6000]) * burst * 0.8 + tone


def hat(open_: bool = False) -> np.ndarray:
    d = 0.25 if open_ else 0.06
    return filt(noise(d), "highpass", 7500) * decay(d, 0.07 if open_ else 0.014)


def tick(freq: float = 3200, length: float = 0.02) -> np.ndarray:
    t = ts(length * 4)
    return (np.sin(2 * np.pi * freq * t) * 0.6 + filt(noise(length * 4), "highpass", 3000) * 0.4) * np.exp(-t / length * 2.5)


def mouse_click(up: bool = False) -> np.ndarray:
    t = ts(0.06)
    snap = filt(noise(0.06), "bandpass", [1800, 7000]) * np.exp(-t / 0.0022)
    body = np.sin(2 * np.pi * (1500 if up else 1100) * t) * np.exp(-t / 0.006) * 0.5
    return snap + body


def blip(freq: float, length: float = 0.07) -> np.ndarray:
    t = ts(length)
    tone = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)
    return tone * np.exp(-t / (length / 4)) * np.clip(t / 0.002, 0, 1)


def bell(freq: float, length: float = 2.5, index: float = 2.2) -> np.ndarray:
    t = ts(length)
    mod = np.sin(2 * np.pi * freq * 3.5 * t) * index * np.exp(-t / 0.35)
    tone = np.sin(2 * np.pi * freq * t + mod)
    return tone * np.exp(-t / (length / 4)) * np.clip(t / 0.003, 0, 1)


def pad(freqs: list[float], duration: float, cutoff: float = 1800, attack: float = 0.4,
        release: float = 0.6, voices: int = 5) -> tuple[np.ndarray, np.ndarray]:
    left = np.zeros(int(duration * SR))
    right = np.zeros_like(left)
    for i, f in enumerate(freqs):
        for v in range(voices):
            detune = 2 ** (((v - (voices - 1) / 2) * 7) / 1200)
            s = saw(f * detune, duration, harmonics=24)
            if (v + i) % 2:
                left += s
            else:
                right += s
    shape = env(duration, attack, release, hold=duration - attack - release, curve=1.5)
    scale = 1 / (len(freqs) * voices) ** 0.5
    return filt(left, "lowpass", cutoff) * shape * scale, filt(right, "lowpass", cutoff) * shape * scale


def whoosh(duration: float, lo: float, hi: float, pan_from: float = 0.0, pan_to: float = 0.0,
           reverse: bool = False) -> tuple[np.ndarray, np.ndarray]:
    t = np.linspace(0, 1, int(duration * SR))
    shape = np.sin(np.pi * t) ** (1.5 if not reverse else 0.8)
    if reverse:
        shape = t**3
    centre = lo * (hi / lo) ** (np.sin(np.pi * t) if not reverse else t)
    sig = sweep_filter(noise(duration), "bandpass", centre, width=0.9) * shape
    return sig, pan_from + (pan_to - pan_from) * t


def riser(duration: float, lo: float = 200, hi: float = 7000) -> np.ndarray:
    t = np.linspace(0, 1, int(duration * SR))
    air = sweep_filter(noise(duration), "bandpass", lo * (hi / lo) ** (t**1.6), width=0.7)
    tone = saw(note("D3") * 2 ** (t * 1.0), duration, harmonics=12)
    tone = filt(tone, "lowpass", 2500)
    return (air * 0.9 + tone * 0.25) * t**2.2


# -------------------------------------------------------------------- score

music = Bus()
sfx = Bus()
kicks: list[float] = []

hook, magic, montage, payoff, brand = TL["hook"], TL["magic"], TL["montage"], TL["payoff"], TL["brand"]
drop = sec(magic["drop"])
cuts = [sec(c) for c in montage["cuts"]]
payoff_t = sec(payoff["start"])
statement_t = sec(payoff["statement"])
collapse_t = sec(payoff["collapse"])
flat_t = sec(payoff["flat"])
logo_t = sec(brand["hit"])

# Cold open: one low hit and a held Dm drone, the clock already ticking.
sfx.add(0.0, boom(2.4, 36), 0.75)
sfx.add(0.0, filt(noise(0.6), "lowpass", 3000) * decay(0.6, 0.08), 0.25)
l, r = pad([note("D2"), note("A2"), note("D3"), note("E4"), note("F4")], drop + 0.3, cutoff=900, attack=0.05, release=0.25)
music.add_stereo(0.0, l, r, 0.3)
for i in range(1, int(drop / (BEAT / 2))):
    t = i * BEAT / 2
    sfx.add(t, tick(4200 if i % 2 else 3400, 0.012), 0.08 + 0.1 * t / drop, pan=0.3 if i % 2 else -0.3)

# Pull back out of the glyphs.
w, p = whoosh(sec(hook["pullbackEnd"] - hook["pullbackStart"]) + 0.1, 180, 2400, 0, 0)
sfx.add(sec(hook["pullbackStart"]), w, 0.35)

# Cursor glides in, presses, drags, lets go.
w, p = whoosh(sec(hook["cursorArrive"] - hook["cursorIn"]), 800, 3500, 0.7, -0.4)
sfx.add(sec(hook["cursorIn"]), w, 0.12, pan=p)
sfx.add(sec(hook["press"]), mouse_click(), 0.55, pan=-0.35)
drag_len = sec(hook["dragEnd"] - hook["press"])
glide = sine(np.linspace(520, 980, int(drag_len * SR)), drag_len) * env(drag_len, 0.05, 0.1, hold=drag_len - 0.15, curve=1)
sfx.add(sec(hook["press"]), glide, 0.05, pan=np.linspace(-0.35, 0.35, len(glide)))
w, p = whoosh(drag_len, 1200, 5000, -0.35, 0.35)
sfx.add(sec(hook["press"]), w, 0.1, pan=p)
sfx.add(sec(hook["release"]), mouse_click(up=True), 0.5, pan=0.35)
sfx.add(sec(hook["release"]), layer(blip(2637, 0.12), blip(3951, 0.09) * 0.5), 0.18, pan=0.2)
sfx.add(sec(hook["release"]), kick(0.5), 0.35)
for i in range(8):
    sfx.add(sec(hook["release"] + 1 + i * 1.2), blip(3000 + i * 180, 0.025), 0.05, pan=-0.6 + i * 0.15)

# OCR scan: a sweep that pans with the beam, one note per glyph it reads.
PENTATONIC = ["D5", "F5", "G5", "A5", "C6", "D6", "F6", "G6", "A6", "C7", "D7"]


def scan_sound(start_frame: float, end_frame: float, glyphs: int, level: float = 1.0) -> None:
    start, end = sec(start_frame), sec(end_frame)
    length = end - start
    w, _ = whoosh(length + 0.05, 1500, 7000)
    sfx.add(start, w, 0.1 * level, pan=np.linspace(-0.6, 0.6, len(w)))
    for i in range(glyphs):
        t = start + (i + 0.5) / glyphs * length
        sfx.add(t, blip(note(PENTATONIC[i % len(PENTATONIC)]), 0.06), 0.07 * level, pan=-0.6 + 1.2 * (i + 0.5) / glyphs)


# Glyph counts: readable characters in the two hero lines (punctuation is not boxed).
scan_sound(magic["scanStart"], magic["scanEnd"], 11)
scan_sound(magic["line2"] + 2, magic["line2ScanEnd"], 9, 0.8)

# The build into the drop.
sfx.add(drop - 0.5, riser(0.5, 400, 6000), 0.22)

# Drop: the translation lands.
sfx.add(drop, boom(1.6, 42), 0.6)
sfx.add(drop, filt(noise(1.2), "highpass", 4000) * decay(1.2, 0.3), 0.12)
l, r = pad([note("D3"), note("A3"), note("D4"), note("F4"), note("A4")], 1.2, cutoff=4200, attack=0.005, release=1.0)
music.add_stereo(drop, l, r, 0.5)

# Chords: Dm | Bb | F | C, then the payoff turns to Gm and Bb, and the logo resolves to D major.
CHORDS = [
    (drop, sec(magic["line2"]), ["D3", "A3", "D4", "F4", "A4"], "D2"),
    (sec(magic["line2"]), cuts[0], ["Bb2", "F3", "D4", "F4", "Bb4"], "Bb1"),
    (cuts[0], cuts[4], ["F3", "C4", "F4", "A4", "C5"], "F2"),
    (cuts[4], payoff_t, ["C3", "G3", "C4", "E4", "G4"], "C2"),
    (payoff_t, statement_t, ["G2", "D3", "Bb3", "D4", "A4"], "G1"),
    (statement_t, collapse_t, ["Bb2", "F3", "D4", "F4", "C5"], "Bb1"),
    (collapse_t, logo_t, ["A2", "E3", "A3", "D4", "E4"], "A1"),
]
for start, end, notes, root in CHORDS:
    length = end - start + 0.35
    l, r = pad([note(n) for n in notes], length, cutoff=2200 if start < payoff_t else 1500, attack=0.08, release=0.35)
    music.add_stereo(start, l, r, 0.26)
    if start >= payoff_t:
        continue
    # Eighth-note bass, pumping against the kick.
    for i in range(int((end - start) / (BEAT / 2) + 0.5)):
        t = start + i * BEAT / 2
        d = BEAT / 2 * 0.9
        f0 = note(root) * (2 if i % 2 else 1)
        b = filt(saw(f0, d, 20), "lowpass", 520) * env(d, 0.004, d * 0.8, curve=2) + sine(f0, d) * env(d, 0.004, d * 0.8, curve=2) * 0.6
        music.add(t, b, 0.24)

# Drums from the drop to the payoff.
t = drop
while t < payoff_t - 0.01:
    kicks.append(t)
    sfx.add(t, kick(), 0.62)
    beat_index = round((t - drop) / BEAT)
    if t >= cuts[0] - 0.01:
        if beat_index % 2 == 1:
            sfx.add(t, clap(), 0.3, pan=0.05)
        for s in range(4):
            sfx.add(t + s * BEAT / 4, hat(open_=(s == 2)), 0.1 if s != 2 else 0.07, pan=0.35 if s % 2 else 0.2)
    elif t >= drop + 1.0:
        sfx.add(t + BEAT / 2, hat(), 0.09, pan=0.3)
    t += BEAT

# Montage: each cut whips right to left; each translation lands on a rising note.
LAND_NOTES = ["D5", "E5", "F5", "G5", "A5", "Bb5", "C6", "D6", "E6", "F6"]
for i, cut in enumerate(montage["cuts"]):
    nxt = montage["cuts"][i + 1] if i + 1 < len(montage["cuts"]) else payoff["start"]
    # Mirrors whipLength() and the montage SCANS in src/film: the line lands one frame after the whip.
    whip = 5 if nxt - cut <= 15 else 7
    w, p = whoosh(sec(whip) + 0.06, 500, 6000, 0.7, -0.7)
    sfx.add(sec(cut) - 0.02, w, 0.3, pan=p)
    land = cut + whip + 1
    sfx.add(sec(land), bell(note(LAND_NOTES[i]), 0.6, 1.2), 0.07, pan=0.1)
    sfx.add(sec(land), tick(5200, 0.008), 0.08)

# Build: riser plus an accelerating snare roll, then a breath of silence.
sfx.add(cuts[4], riser(payoff_t - cuts[4] - 0.08, 250, 8000), 0.3)
roll_t, step = cuts[6], BEAT / 2
while roll_t < payoff_t - 0.09:
    level = 0.08 + 0.18 * (roll_t - cuts[6]) / (payoff_t - cuts[6])
    sfx.add(roll_t, clap(), level, pan=RNG.uniform(-0.2, 0.2))
    roll_t += step
    if roll_t >= cuts[7] - 0.01:
        step = BEAT / 4
    if roll_t >= cuts[8] - 0.01:
        step = BEAT / 8

# Payoff: the frame breaks into layers.
sfx.add(payoff_t, boom(2.6, 34), 0.95)
sfx.add(payoff_t, kick(1.0), 0.7)
sfx.add(payoff_t, filt(noise(2.0), "bandpass", [2000, 9000]) * decay(2.0, 0.45), 0.2)
l, r = pad([note("G2"), note("D3"), note("G3"), note("Bb3"), note("D4")], 1.4, cutoff=5000, attack=0.004, release=1.3)
music.add_stereo(payoff_t, l, r, 0.55)
for k in (payoff_t + 1.0, payoff_t + 2.0):
    sfx.add(k, kick(0.6), 0.5)
    kicks.append(k)
for i, label in enumerate(payoff["labels"]):
    sfx.add(sec(label), layer(tick(2600 + i * 500, 0.015), blip(note(["A5", "C6", "D6"][i]), 0.08) * 0.6), 0.2, pan=-0.3 + 0.3 * i)
    w, p = whoosh(0.18, 900, 4000, -0.5, 0.2)
    sfx.add(sec(label) - 0.03, w, 0.08, pan=p)

sfx.add(statement_t - 0.5, riser(0.5, 500, 7000), 0.2)
sfx.add(statement_t, boom(1.2, 44), 0.55)
sfx.add(statement_t, kick(0.9), 0.6)
kicks.append(statement_t)
for i in range(4):
    sfx.add(statement_t + i * 0.05, blip(note(["D6", "F6", "A6", "D7"][i]), 0.1), 0.05, pan=-0.3 + 0.2 * i)

# Collapse: everything folds into the box, the box becomes the icon.
w, p = whoosh(0.45, 300, 3000, -0.4, 0.4)
sfx.add(collapse_t, w, 0.35, pan=p)
swell_len = logo_t - flat_t
glide = sine(np.geomspace(note("A3"), note("D5"), int(swell_len * SR)), swell_len)
sfx.add(flat_t, glide * np.linspace(0, 1, len(glide)) ** 2, 0.1)
w, _ = whoosh(logo_t - collapse_t, 300, 9000, reverse=True)
sfx.add(collapse_t, w, 0.25)

# Logo: resolve to D major.
sfx.add(logo_t, boom(2.0, 36), 0.8)
sfx.add(logo_t, kick(0.9), 0.55)
l, r = pad([note("D3"), note("A3"), note("D4"), note("F#4"), note("A4"), note("E5")], DURATION - logo_t, cutoff=3200, attack=0.01, release=1.5)
music.add_stereo(logo_t, l, r, 0.5)
for i, n in enumerate(["D5", "A5", "F#6", "D6"]):
    sfx.add(logo_t + i * 0.09, bell(note(n), 1.8), 0.1 - i * 0.015, pan=-0.25 + 0.17 * i)
w, p = whoosh(0.4, 1500, 7000, -0.3, 0.4)
sfx.add(sec(brand["wordmark"]), w, 0.1, pan=p)
sfx.add(sec(brand["meta"]), bell(note("A6"), 1.0, 0.8), 0.03, pan=0.3)

# ------------------------------------------------------------------ mixdown

def sidechain(length: int) -> np.ndarray:
    gain = np.ones(length)
    for k in kicks:
        i = int(k * SR)
        d = int(0.28 * SR)
        seg = 1 - 0.55 * np.exp(-np.arange(d) / (0.09 * SR))
        end = min(i + d, length)
        gain[i:end] = np.minimum(gain[i:end], seg[: end - i])
    return gain


mix_buf = music.buf * sidechain(music.buf.shape[1])[None, :] + sfx.buf

ir_l, ir_r = reverb_ir(2.4)
wet_l = fftconvolve(mix_buf[0], ir_l)[: mix_buf.shape[1]]
wet_r = fftconvolve(mix_buf[1], ir_r)[: mix_buf.shape[1]]
out = mix_buf + 0.22 * np.stack([wet_l, wet_r])
out = out[:, :N]

def write_wav(file: str, sig: np.ndarray) -> None:
    pcm = (np.clip(sig.T, -1, 1) * (2**23 - 1)).astype(np.int32)
    raw = np.zeros((pcm.shape[0], 2, 3), np.uint8)
    for c in range(2):
        for byte in range(3):
            raw[:, c, byte] = (pcm[:, c] >> (8 * byte)) & 0xFF
    with wave.open(file, "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(3)
        wav.setframerate(SR)
        wav.writeframes(raw.tobytes())


def integrated_lufs(file: str) -> float:
    report = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", file, "-af", "ebur128", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", report)[-1])


def limit(sig: np.ndarray, ceiling: float, lookahead: float = 0.005, release: float = 0.08) -> np.ndarray:
    """Look-ahead peak limiter: gain dips ahead of each peak, recovers smoothly."""
    need = np.minimum(1.0, ceiling / np.maximum(np.max(np.abs(sig), axis=0), 1e-9))
    ahead = int(lookahead * SR)
    padded = np.concatenate([need, np.ones(ahead)])
    target = np.lib.stride_tricks.sliding_window_view(padded, ahead)[: len(need)].min(axis=1)
    gain = np.empty_like(target)
    g = 1.0
    coeff = np.exp(-1 / (release * SR))
    for i, t in enumerate(target):
        g = t if t < g else t + (g - t) * coeff
        gain[i] = g
    return sig * gain[None, :]


out = filt(out, "highpass", 28)
fade = int(0.35 * SR)
out[:, -fade:] *= np.linspace(1, 0, fade) ** 2
out *= 0.89 / np.max(np.abs(out))

os.makedirs(os.path.join(ROOT, "public", "audio"), exist_ok=True)
path = os.path.join(ROOT, "public", "audio", "soundtrack.wav")
write_wav(path, out)

# Web platforms play back around -14 LUFS; aim there with true peak under -1 dBFS.
TARGET_LUFS = -14.0
out = limit(out * 10 ** ((TARGET_LUFS - integrated_lufs(path)) / 20), 0.85)
write_wav(path, out)
print(f"wrote {path}: {N / SR:.2f}s, peak {np.max(np.abs(out)):.3f}, {integrated_lufs(path):.1f} LUFS")
