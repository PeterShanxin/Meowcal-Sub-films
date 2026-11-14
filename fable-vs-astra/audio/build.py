"""One clock for picture and sound.

Reads src/timeline.json and writes:
  src/cues.json           every frame the picture uses
  public/audio/keys.wav   one recorded keypress per typed character, Enter on
                          send, a click when a video card is tapped, backspaces
  audio/score.json        the single recorded stamp hit (acoustic-score format)

There is no music: the chats and the ending are carried by typing alone, and
the two films bring their own soundtracks. Render the stamp with:
  node fable-vs-astra/audio/score/render-score.mjs fable-vs-astra/audio/score.json \
       fable-vs-astra/public/audio/sfx.wav --ffmpeg ffmpeg
"""

from __future__ import annotations

import json
import random
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48_000
PUNCT = set("，。！？：、,.!?")


class Typist:
    """Humanised keystroke timing; every key and click is recorded for the sound."""

    def __init__(self, typing: dict):
        self.t = typing
        self.rng = random.Random(typing["seed"])
        self.keys: list[tuple[int, str]] = []  # (frame, "key" | "enter" | "click" | "back")

    def type(self, text: str, start: float, rate: float | None = None, soft: bool = False, silent: bool = False) -> tuple[list[int], float]:
        rate = rate or self.t["rate"]
        f = float(start)
        frames = []
        for ch in text:
            frames.append(round(f))
            if not silent:
                self.keys.append((round(f), "soft" if soft else "key"))
            dt = rate * (1 + self.t["jitter"] * self.rng.uniform(-1, 1))
            if ch == " ":
                dt *= 0.6
            if ch in PUNCT:
                dt += self.t["punctPause"]
            f += dt
        return frames, f

    def erase(self, text: str, start: float, rate: float = 1.6) -> tuple[list[int], float]:
        """Frames at which each character disappears, last character first."""
        f = float(start)
        frames = []
        for _ in text:
            frames.append(round(f))
            self.keys.append((round(f), "back"))
            f += rate
        return frames[::-1], f  # frames[i] = when character i is deleted


def thread(spec: dict, start: int, ty: Typist, w: dict) -> dict:
    """Messages are shown as a short status while keys are typed, then sent as
    one plain line (the task) or as blanked-out bars (the complaint)."""
    f = float(start)
    msgs = []
    for m in spec["msgs"]:
        frames, f = ty.type(m.get("text") if not m.get("label") else "x" * m["keys"], f, spec.get("rate"))
        send = round(f + 10)
        ty.keys.append((send, "enter"))
        msgs.append({
            "label": m.get("label"),
            "text": m.get("text"),
            "bars": m.get("bars"),
            "keys": frames,
            "typeStart": frames[0],
            "send": send,
        })
        f = send + 24
    dots = msgs[-1]["send"] + w["dots"]
    reply = dots + w["reply"]
    working = reply + w["working"]
    done = working + w["done"]
    tap = done + w["tap"]
    ty.keys.append((tap, "click"))
    return {
        "msgs": msgs,
        "dots": dots,
        "reply": reply,
        "text": spec["reply"],
        "working": working,
        "done": done,
        "tap": tap,
        "open": {"start": tap + 8, "end": tap + 8 + w["open"]},
    }


def build_cues(tl: dict) -> tuple[dict, Typist]:
    ch, clips, w = tl["chats"], tl["clips"], tl["waits"]
    ty = Typist(tl["typing"])

    astra = thread(ch["astra"]["intro"], 40, ty, w)
    astra_film = {"start": astra["open"]["end"], "end": astra["open"]["end"] + clips["astra"]["frames"]}
    shrink = {"start": astra_film["end"], "end": astra_film["end"] + w["open"]}
    swap = {"start": shrink["end"] + w["hold"], "end": shrink["end"] + w["hold"] + w["swap"]}

    fable = thread(ch["fable"]["intro"], swap["end"] + 24, ty, w)
    v3 = {"start": fable["open"]["end"], "cut": fable["open"]["end"] + clips["v3"]["play"], **clips["v3"]}
    # The comments finish and stay a moment after v3 ends; only then the note and stamp.
    note = v3["cut"] + w["noteHold"]
    stamp = note + w["stamp"]
    pass_ = {"note": note, "stamp": stamp, "fling": stamp + w["fling"], "flingEnd": stamp + w["fling"] + 24}
    rant = thread(ch["fable"]["rant"], pass_["flingEnd"] + 30, ty, w)
    v4 = {"start": rant["open"]["end"], "end": rant["open"]["end"] + clips["v4"]["frames"], **clips["v4"]}

    # The user's own comments, typed under each film while it plays.
    def notes(lines: list, start: int, end: int, trim: int = 0) -> list[dict]:
        """Plain strings are spread evenly; [text, seconds] pins a line to a
        moment in the source film (seconds of the film itself)."""
        step = (end - start - 150) / len(lines)
        out = []
        for i, line in enumerate(lines):
            if isinstance(line, list):
                text, at = line[0], start + round(line[1] * tl["fps"]) - trim
            else:
                text, at = line, start + 90 + i * step
            frames, _ = ty.type(text, at, 3.2, silent=True)
            out.append({"t": text, "frames": frames})
        return out

    film_notes = {
        "astra": notes(tl["notes"]["astra"], astra_film["start"], astra_film["end"]),
        "v3": notes(tl["notes"]["v3"], v3["start"], v3["cut"], v3["trim"]),
        "v4": notes(tl["notes"]["v4"], v4["start"], v4["end"]),
    }

    # Ending: the question stays; the user's takeaway sits under it in small
    # type; then the brand takes the centre.
    copy = tl["copy"]
    o = v4["end"]
    q_frames, f = ty.type(copy["question"], o + 50, 4.5)
    a_frames, f = ty.type(copy["ask"], f + 20, 3.4)
    t1_frames, f = ty.type(copy["thought"][0], f + 70, 3.2, silent=True)
    t2_frames, f = ty.type(copy["thought"][1], f + 16, 3.0, silent=True)
    brand = round(f + w["outroHold"])
    outro = {
        "start": o,
        "question": {"t": copy["question"], "frames": q_frames},
        "ask": {"t": copy["ask"], "frames": a_frames},
        "thought": [{"t": copy["thought"][0], "frames": t1_frames}, {"t": copy["thought"][1], "frames": t2_frames}],
        "brand": brand,
        "end": brand + w["brandHold"],
    }
    cues = {
        "fps": tl["fps"],
        "total": outro["end"],
        "copy": copy,
        "chats": {
            "astra": {"name": ch["astra"]["name"], "accent": ch["astra"]["accent"], "logo": ch["astra"]["logo"], "intro": astra},
            "fable": {"name": ch["fable"]["name"], "accent": ch["fable"]["accent"], "logo": ch["fable"]["logo"], "intro": fable, "rant": rant},
        },
        "astraFilm": astra_film,
        "astraClip": clips["astra"],
        "shrink": shrink,
        "swap": swap,
        "v3": v3,
        "pass": pass_,
        "v4": v4,
        "outro": outro,
        "notes": film_notes,
    }
    return cues, ty


# ---------------------------------------------------------------- sound

def read_mono(path: Path) -> np.ndarray:
    with wave.open(str(path)) as wv:
        assert wv.getframerate() == SR and wv.getnchannels() == 1
        x = np.frombuffer(wv.readframes(wv.getnframes()), dtype="<i2").astype(np.float64) / 32768
    i = int(np.argmax(np.abs(x) > 0.1 * np.abs(x).max()))  # start at the attack
    return x[max(0, i - 48):]


def build_keys(c: dict, ty: Typist) -> None:
    keys = [read_mono(p) for p in sorted((ROOT / "audio/keys").glob("key-*.wav"))]
    energy = [float(np.sqrt(np.mean(k[:2400] ** 2))) for k in keys]
    order = np.argsort(energy)
    enter = keys[int(order[-1])]
    click = keys[int(order[0])]  # the lightest key stands in for a tap
    rng = random.Random(7)
    n = int(c["total"] / c["fps"] * SR) + SR
    buf = np.zeros((n, 2))
    last = -1

    def put(frame: int, x: np.ndarray, gain: float, pan: float) -> None:
        k = int(frame / c["fps"] * SR)
        end = min(k + len(x), n)
        buf[k:end, 0] += x[: end - k] * gain * (1 - max(0, pan))
        buf[k:end, 1] += x[: end - k] * gain * (1 + min(0, pan))

    for frame, kind in ty.keys:
        if kind == "enter":
            put(frame, enter, 0.8, 0)
        elif kind == "click":
            put(frame, click, 0.5, 0)
        else:
            i = rng.randrange(len(keys))
            if i == last:
                i = (i + 1) % len(keys)
            last = i
            g = rng.uniform(0.35, 0.6) * {"back": 0.75, "soft": 0.45}.get(kind, 1)
            put(frame, keys[i], g, rng.uniform(-0.15, 0.15))
    buf *= 0.9 / np.abs(buf).max()
    data = (np.clip(buf, -1, 1) * 32767).astype("<i2")
    with wave.open(str(ROOT / "public/audio/keys.wav"), "wb") as wv:
        wv.setnchannels(2)
        wv.setsampwidth(2)
        wv.setframerate(SR)
        wv.writeframes(data.tobytes())


def build_score(c: dict) -> dict:
    """The PASS stamp: one concert bass drum and a clap, recorded."""
    sec = c["pass"]["stamp"] / c["fps"]
    beat = round(sec * 2, 4)  # 120 BPM: beats = seconds * 2
    return {
        "bpm": 120,
        "seconds": round(c["total"] / c["fps"] + 0.5, 3),
        "cues": {"stamp": round(sec, 4)},
        "hits": {"boom": [[beat, 0.7]], "clap": [[beat, 0.5]]},
    }


def main() -> None:
    tl = json.loads((ROOT / "src/timeline.json").read_text(encoding="utf-8"))
    cues, ty = build_cues(tl)
    (ROOT / "src/cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (ROOT / "audio/score.json").write_text(json.dumps(build_score(cues), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    build_keys(cues, ty)
    fps = cues["fps"]
    s = lambda f: f"{f / fps:.1f}s"  # noqa: E731
    a, fb, r = cues["chats"]["astra"]["intro"], cues["chats"]["fable"]["intro"], cues["chats"]["fable"]["rant"]
    print("astra reply", s(a["reply"]), "done", s(a["done"]), "film", s(cues["astraFilm"]["start"]), "-", s(cues["astraFilm"]["end"]))
    print("fable reply", s(fb["reply"]), "v3", s(cues["v3"]["start"]), "-", s(cues["v3"]["cut"]), "stamp", s(cues["pass"]["stamp"]))
    print("rant reply", s(r["reply"]), "v4", s(cues["v4"]["start"]), "-", s(cues["v4"]["end"]))
    print("brand", s(cues["outro"]["brand"]), "end", s(cues["total"]))


if __name__ == "__main__":
    main()
