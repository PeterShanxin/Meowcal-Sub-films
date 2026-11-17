"""Build the soundtrack from the same cue table the picture uses.

The film's score is the light one (cues.json "music.score": "light"):
audio/compose.py writes audio/light.json and build_light() renders it under
Sprite Fright's opening sound. MUSIC=red rebuilds the earlier Red edit.

    python sub2-remix/audio/build.py            # full mix of Red
    MUSIC=altmix python sub2-remix/audio/build.py   # the no-vocals mix

Reads audio/cues.json and writes:
  out/music.wav           Red, edited on its own beat grid (see cues.json "music")
  out/keys.wav            recorded keypresses and clicks, one per screen action
  out/mix.premaster.wav   music + keys
  public/audio/mix.wav    the master the composition plays

The edit takes track beats 171-271 (82.55-130.55 s: the build, the break, the
drop and the climax), then the closing F minor chord from 190.08 s, joined
with a short equal-power crossfade on the downbeat, and fades out at the end.
The master is brought to -14 LUFS with a limiter ceiling of -2.4 dBFS, which
leaves room for the AAC encode to stay under -1 dBTP. Needs NumPy and FFmpeg
(PATH or the FFMPEG environment variable).
"""

from __future__ import annotations

import json
import os
import random
import re
import subprocess
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
SR = 48_000
TARGET_I = -14.0
CEILING_DB = -2.4

table = json.loads((ROOT / "audio" / "cues.json").read_text(encoding="utf-8"))
cue, sfx, music = table["cues"], table["sfx"], table["music"]
LENGTH = int(round(table["seconds"] * SR))


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64).reshape(-1, 2)


def read_mono(path: Path) -> np.ndarray:
    with wave.open(str(path)) as wv:
        assert wv.getframerate() == SR and wv.getnchannels() == 1
        x = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64) / 32768
    start = int(np.argmax(np.abs(x) > 0.1 * np.abs(x).max()))  # begin at the attack
    return x[max(0, start - 48):]


def write_stereo(path: Path, buf: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wv:
        wv.setnchannels(2)
        wv.setsampwidth(2)
        wv.setframerate(SR)
        wv.writeframes((np.clip(buf, -1, 1) * 32767).astype("<i2").tobytes())


def build_music() -> np.ndarray:
    """Place each segment of the track at its film time; equal-power
    crossfades at the joins, a fade-in of 10 ms and the final fade-out."""
    source = ROOT / (music["altmix"] if os.environ.get("MUSIC") == "altmix" else music["file"])
    track = decode(source)
    out = np.zeros((LENGTH, 2))
    half = music["crossfade"] / 2
    segments = music["segments"]
    for i, seg in enumerate(segments):
        film0 = seg["film"] - (half if i else 0)
        film1 = segments[i + 1]["film"] + half if i + 1 < len(segments) else table["seconds"]
        a = int(round((seg["from"] - (seg["film"] - film0)) * SR))
        n = int(round((film1 - film0) * SR))
        piece = track[a:a + n].copy()
        gain = np.ones(len(piece))
        fade = int(round(music["crossfade"] * SR))
        if i:  # fade in over the crossfade
            gain[:fade] = np.sin(np.linspace(0, np.pi / 2, fade)) ** 1
        else:
            gain[: SR // 100] = np.linspace(0, 1, SR // 100)
        if i + 1 < len(segments):
            gain[-fade:] = np.cos(np.linspace(0, np.pi / 2, fade))
        k = int(round(film0 * SR))
        end = min(LENGTH, k + len(piece))
        out[k:end] += piece[: end - k] * gain[: end - k, None]
    # The opening is the source film's own sound, running on its own beat until
    # Red takes over on it; it rings 40 ms into Red's hit. 2 dB under Red's entry.
    orig = music.get("original")
    if orig:
        raw = subprocess.run([FFMPEG, "-v", "error", "-ss", str(orig["from"]), "-t", str(orig["to"] - orig["from"]), "-i", str(ROOT / orig["file"]),
                              "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
        piece = np.frombuffer(raw, dtype="<f4").astype(np.float64).reshape(-1, 2).copy()
        k = int(round(orig["film"] * SR))
        entry = out[int(segments[0]["film"] * SR):int((segments[0]["film"] + 2.0) * SR)]
        piece_gain = np.sqrt(np.mean(entry ** 2)) / np.sqrt(np.mean(piece ** 2)) * 10 ** (-2 / 20)
        piece *= piece_gain
        piece[: SR // 200] *= np.linspace(0, 1, SR // 200)[:, None]
        ring = int(0.04 * SR)
        piece = np.concatenate([piece, np.frombuffer(subprocess.run([FFMPEG, "-v", "error", "-ss", str(orig["to"]), "-t", "0.04", "-i", str(ROOT / orig["file"]),
                                "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, dtype="<f4").astype(np.float64).reshape(-1, 2)[:ring] * piece_gain])
        piece[-ring:] *= np.cos(np.linspace(0, np.pi / 2, len(piece[-ring:])))[:, None]
        out[k:k + len(piece)] += piece
    # A hit that would fall on a join plays on over the next segment and dies away.
    for tail in music.get("tails", []):
        a, n = int(round(tail["from"] * SR)), int(round(tail["length"] * SR))
        piece = track[a:a + n].copy()
        env = np.exp(-np.arange(len(piece)) / (0.18 * SR))
        env[: SR // 500] *= np.linspace(0, 1, SR // 500)
        k = int(round(tail["film"] * SR))
        out[k:k + len(piece)] += piece * env[:, None]
    f0, f1 = music["fadeOut"]
    t = np.arange(LENGTH) / SR
    out *= np.clip((f1 - t) / (f1 - f0), 0, 1)[:, None] ** 1.5
    return out


def build_keys() -> np.ndarray:
    """One recorded key per typed character; the lightest key stands in for a
    mouse button going down, softer coming up."""
    keys = [read_mono(p) for p in sorted((ROOT / "audio" / "keys").glob("key-*.wav"))]
    order = np.argsort([float(np.sqrt(np.mean(k[:2400] ** 2))) for k in keys])
    click = keys[int(order[0])]
    rng = random.Random(41)
    buf = np.zeros((LENGTH, 2))

    def put(seconds: float, x: np.ndarray, gain: float, pan: float = 0.0) -> None:
        k = int(round(seconds * SR))
        end = min(k + len(x), len(buf))
        buf[k:end, 0] += x[: end - k] * gain * (1 - max(0.0, pan))
        buf[k:end, 1] += x[: end - k] * gain * (1 + min(0.0, pan))

    last = -1
    for i in range(len(sfx["typeText"])):
        pick = rng.randrange(len(keys))
        if pick == last:
            pick = (pick + 1) % len(keys)
        last = pick
        put(sfx["typeStart"] + i * sfx["typeStep"], keys[pick], rng.uniform(0.4, 0.62), rng.uniform(-0.15, 0.15))
    for name in ("pickTitle", "pickSource", "pickTarget", "start", "confirm", "pause", "play"):
        put(cue[name], click, 0.6)
    for at, gain in ((sfx["dragPress"], 0.6), (cue["release"], 0.38), (sfx["grab"], 0.6), (sfx["drop"], 0.38)):
        put(at, click, gain)
    return buf


def loudness(path: Path) -> dict:
    log = subprocess.run(
        [FFMPEG, "-hide_banner", "-nostdin", "-i", str(path), "-af", "loudnorm=I=-14:TP=-1:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, encoding="utf-8", check=True,
    ).stderr
    return json.loads(re.search(r"\{\s*\"input_i\"[\s\S]*?\}", log).group(0))


def master(source: Path, target: Path) -> dict:
    """Gain to the target loudness, catch the peaks with a look-ahead limiter,
    measure, and trim once more so the result sits on the target."""
    ceiling = 10 ** (CEILING_DB / 20)
    gain = TARGET_I - float(loudness(source)["input_i"])
    for _ in range(4):
        subprocess.run(
            [FFMPEG, "-hide_banner", "-nostdin", "-v", "error", "-y", "-i", str(source), "-af",
             f"volume={gain:.3f}dB,alimiter=limit={ceiling:.4f}:attack=4:release=60:level=false:asc=1:latency=1",
             "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(target)],
            check=True,
        )
        measured = loudness(target)
        error = TARGET_I - float(measured["input_i"])
        if abs(error) < 0.1:
            break
        gain += error
    return measured


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path)) as wv:
        assert wv.getframerate() == SR
        x = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, wv.getnchannels()) / 32768
    return np.pad(x, ((0, max(0, LENGTH - len(x))), (0, 0)))[:LENGTH]


def build_light() -> np.ndarray:
    """The light score (audio/compose.py -> audio/light.json): marimba, cajon,
    shaker, claves, woodblock, kalimba, piano and bass, rendered from recorded
    CC0 samples on the film's grid, under Sprite Fright's own sound for the
    opening, which hands over on its own beat at 1.92 s."""
    out = ROOT / "out"
    subprocess.run(["python", str(ROOT / "audio" / "compose.py")], check=True)
    subprocess.run(["node", str(ROOT / "audio" / "score" / "render-score.mjs"), str(ROOT / "audio" / "light.json"), str(out / "light.wav")], check=True)
    song = read_wav(out / "light.wav")
    orig = music["original"]
    clip = lambda a, n: np.frombuffer(subprocess.run([FFMPEG, "-v", "error", "-ss", str(a), "-t", str(n), "-i", str(ROOT / orig["file"]),
                                                      "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, dtype="<f4").astype(np.float64).reshape(-1, 2)
    piece = clip(orig["from"], orig["to"] - orig["from"])
    entry = song[int(cue["cuts"]["rider"] * SR):int((cue["cuts"]["rider"] + 2.0) * SR)]
    gain = np.sqrt(np.mean(entry ** 2)) / np.sqrt(np.mean(piece ** 2)) * 10 ** (-3 / 20)
    ring = int(0.04 * SR)
    piece = np.concatenate([piece, clip(orig["to"], 0.04)[:ring]]) * gain
    piece[: SR // 200] *= np.linspace(0, 1, SR // 200)[:, None]
    piece[-ring:] *= np.cos(np.linspace(0, np.pi / 2, ring))[:, None]
    k = int(round(orig["film"] * SR))
    song[k:k + len(piece)] += piece
    f0, f1 = music["fadeOut"]
    t = np.arange(LENGTH) / SR
    return song * np.clip((f1 - t) / (f1 - f0), 0, 1)[:, None] ** 1.5


def main() -> None:
    out = ROOT / "out"
    out.mkdir(exist_ok=True)
    if os.environ.get("MUSIC", music.get("score", "red")) == "light":
        song = build_light()
        write_stereo(out / "music.wav", song * (0.9 / np.abs(song).max()))
        keys = build_keys()
        write_stereo(out / "keys.wav", keys * (0.5 / np.abs(keys).max()))
        # The score is light, so the keys sit a little lower than they did under Red.
        mix = song / np.abs(song).max() + keys * (0.22 / np.abs(keys).max())
        write_stereo(out / "mix.premaster.wav", mix * (0.7 / np.abs(mix).max()))
        measured = master(out / "mix.premaster.wav", ROOT / "public" / "audio" / "mix.wav")
        print(f"master: {measured['input_i']} LUFS, {measured['input_tp']} dBTP, LRA {measured['input_lra']}")
        return
    song = build_music()
    write_stereo(out / "music.wav", song * (0.9 / np.abs(song).max()))
    keys = build_keys()
    write_stereo(out / "keys.wav", keys * (0.5 / np.abs(keys).max()))
    # Recorded drum accents (CC0) on the picture's hits where Red has no drum
    # of its own: the hook, the name, the 2s, the plate, the proof.
    subprocess.run(["node", str(ROOT / "audio" / "score" / "render-score.mjs"), str(ROOT / "audio" / "accents.json"), str(out / "accents.wav")], check=True)
    with wave.open(str(out / "accents.wav")) as wv:
        assert wv.getframerate() == SR
        acc = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, wv.getnchannels()) / 32768
    acc = np.pad(acc, ((0, max(0, LENGTH - len(acc))), (0, 0)))[:LENGTH]
    # Under the app's arrival Red goes nearly silent; a recorded kit (audio/riser.json)
    # drives it into the drop, set 3 dB under the cold open's level.
    subprocess.run(["node", str(ROOT / "audio" / "score" / "render-score.mjs"), str(ROOT / "audio" / "riser.json"), str(out / "riser.wav")], check=True)
    with wave.open(str(out / "riser.wav")) as wv:
        riser = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, wv.getnchannels()) / 32768
    riser = np.pad(riser, ((0, max(0, LENGTH - len(riser))), (0, 0)))[:LENGTH]
    song = song / np.abs(song).max()
    rms = lambda x, a, b: float(np.sqrt(np.mean(x[int(a * SR):int(b * SR)] ** 2)))
    riser *= rms(song, cue["cuts"]["rider"], cue["sintel"]) * 10 ** (-3 / 20) / rms(riser, cue["bridge"], cue["giveUp"])
    # A recorded kit under the whole film (audio/groove.json), 5 dB under Red
    # from the drop to the brand, so there is a drum on every beat.
    subprocess.run(["node", str(ROOT / "audio" / "score" / "render-score.mjs"), str(ROOT / "audio" / "groove.json"), str(out / "groove.wav")], check=True)
    with wave.open(str(out / "groove.wav")) as wv:
        groove = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, wv.getnchannels()) / 32768
    groove = np.pad(groove, ((0, max(0, LENGTH - len(groove))), (0, 0)))[:LENGTH]
    groove *= rms(song, cue["giveUp"], cue["brand"]) * 10 ** (-5 / 20) / rms(groove, cue["giveUp"], cue["pause"])
    # Under the opening a kit plays along with Sprite Fright's own beat (audio/opening.json).
    subprocess.run(["node", str(ROOT / "audio" / "score" / "render-score.mjs"), str(ROOT / "audio" / "opening.json"), str(out / "opening.wav")], check=True)
    with wave.open(str(out / "opening.wav")) as wv:
        along = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, wv.getnchannels()) / 32768
    along = np.pad(along, ((0, max(0, LENGTH - len(along))), (0, 0)))[:LENGTH]
    along *= rms(song, 0, cue["cuts"]["rider"]) * 10 ** (-6 / 20) / rms(along, 0, cue["cuts"]["rider"])
    # Red is dense; the keys sit just under it, present without poking out.
    mix = song + along + riser + groove + acc * (0.75 / np.abs(acc).max()) + keys * (0.32 / np.abs(keys).max())
    write_stereo(out / "mix.premaster.wav", mix * (0.7 / np.abs(mix).max()))
    measured = master(out / "mix.premaster.wav", ROOT / "public" / "audio" / "mix.wav")
    print(f"master: {measured['input_i']} LUFS, {measured['input_tp']} dBTP, LRA {measured['input_lra']}")


if __name__ == "__main__":
    main()
