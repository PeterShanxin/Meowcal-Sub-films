"""Write audio/light.json: a light, modern score for the whole film.

    python sub2-remix/audio/compose.py

One small band: legato strings (a violin melody over a cello and viola pad),
a soft pedalled piano, pizzicato bass and one drummer (cajon, finger snaps,
shaker), all recorded (VCSL / VSCO 2 CE, CC0), at 125 BPM on
the film's own grid (beat k = k * 0.48 s, audio/cues.json). D major,
I-V-vi-IV, with every chapter (the drop, the lock, play, the brand, the
ending) on D. The cajon is the drummer and the only accent voice: the owner suspected
woodblock, claves, bongos, kalimba and glockenspiel together as cluttered.
The opening plays along with Sprite Fright's own 160 BPM beat (its sound is
mixed in by build.py) and hands over on its accent at 1.92 s.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
table = json.loads((ROOT / "audio" / "cues.json").read_text(encoding="utf-8"))
cue = table["cues"]
BEAT = 0.48
b = lambda seconds: round(seconds / BEAT, 4)  # film seconds -> beats

D, A, Bm, G, Em = (62, [62, 66, 69]), (57, [57, 61, 64]), (59, [59, 62, 66]), (55, [55, 59, 62]), (52, [52, 55, 59])
Asus = (57, [57, 62, 64])
# One chord per bar (bar n = beats 4n..4n+4); a pair splits the bar in halves.
BARS = {
    1: D, 2: A, 3: Bm,                 # cold open
    4: G, 5: D,                        # hope
    6: G, 7: (Asus, A),                # bridge and riser into the drop
    8: D, 9: A, 10: Bm, 11: G, 12: D, 13: A, 14: (G, A),   # drop .. lock
    15: D, 16: A, 17: Bm, 18: G,       # lock .. pause
    19: Em,                            # paused: drums out
    20: D, 21: A, 22: (G, A),          # play .. proof
    23: D, 24: (G, A),                 # brand
    25: D,                             # the ending
}

piano, bass, events = [], [], []
ev = lambda group, beat, **kw: events.append({"group": group, "beat": round(beat, 4), **kw})


def chords():
    for bar, c in BARS.items():
        if isinstance(c[0], tuple):
            yield bar * 4, 2, c[0]
            yield bar * 4 + 2, 2, c[1]
        else:
            yield bar * 4, 4, c


# ── Harmony: pedalled piano, pizzicato bass, legato strings ────────────────
for start, length, (root, tones) in chords():
    final = start >= 100
    piano.append([start, [t - 12 for t in tones] + [tones[0]], 6 if final else length, 0.34 if final else 0.26])
    r = root - 24 if root - 24 >= 36 else root - 12
    if final:
        bass.append([start, r, 4, 0.8])
        continue
    bass.append([start, r, 1, 0.78])
    if length == 4:
        bass.append([start + 1.5, r, 0.5, 0.6])
        bass.append([start + 3, r + 7 if r + 7 < 50 else r - 5, 1, 0.66])
    else:
        bass.append([start + 1.5, r, 0.5, 0.6])
quiet = lambda beat: 76 <= beat < 80  # paused
# The melody is joined, not struck: a soft string pad (cello root, viola
# third and fifth) held through each chord, and from the drop a violin line
# whose notes run into each other (the renderer joins a note that starts
# where the last one ended). The owner heard broken-chord marimba as 叮叮咚咚.
strings = []
for start, length, (root, tones) in chords():
    if start < 4:
        continue
    hold = 6 if start >= 100 else length
    soft = 0.22 if 16 <= start < 24 or quiet(start) else 0.3
    strings.append([start, "cello", root - 12, hold, soft + 0.04])
    strings.append([start, "viola", tones[1], hold, soft])
    strings.append([start, "viola", tones[2], hold, soft - 0.04])
MELODY = [  # [beat, midi, length]: D-A-Bm-G phrases from the drop to the end
    (32, 78, 1.5), (33.5, 76, 0.5), (34, 74, 2), (36, 76, 1.5), (37.5, 73, 0.5), (38, 69, 2),
    (40, 74, 1.5), (41.5, 76, 0.5), (42, 78, 2), (44, 79, 2), (46, 78, 1), (47, 76, 1),
    (48, 78, 2), (50, 81, 2), (52, 81, 1.5), (53.5, 79, 0.5), (54, 76, 2), (56, 74, 2), (58, 73, 2),
    (60, 81, 3), (63, 78, 1), (64, 76, 3), (67, 73, 1), (68, 74, 2), (70, 78, 2), (72, 79, 3), (75, 76, 1),
    (80, 78, 2), (82, 81, 2), (84, 81, 1.5), (85.5, 79, 0.5), (86, 76, 2), (88, 79, 2), (90, 76, 2),
    (92, 81, 2), (94, 86, 2), (96, 83, 2), (98, 85, 2), (100, 86, 6),
]
for beat, midi, length in MELODY:
    strings.append([beat, "violin", midi, length, 0.62 if beat >= 92 else 0.55])

# ── The drummer: cajon (bass tone / slap), finger snaps, shaker ────────────
def groove(lo, hi, bass_at, slap_at, shaker=0.25, level=1.0):
    for bar in range(lo, int(-(-hi // 1)), 4):
        for p in bass_at:
            if bar + p < hi:
                ev("cajon-bass", bar + p, velocity=round(0.8 * level, 2), variation=int(p * 2))
        for p in slap_at:
            if bar + p < hi:
                ev("cajon-slap", bar + p, velocity=round(0.72 * level, 2), variation=int(p))
                ev("snap", bar + p, velocity=round(0.45 * level, 2), variation=int(p))
    k = 0
    beat = lo
    while beat < hi - 1e-9:
        ev("shk", beat, velocity=round((0.5 if k % 2 == 0 else 0.32) * level, 2), variation=k % 4)
        beat += shaker
        k += 1


groove(4, 16, [0, 1.5, 2], [1, 3])                       # cold open
groove(16, 24, [0, 2.5], [3], shaker=0.5, level=0.7)     # hope: half time
groove(24, 28, [0, 1, 2, 3], [1, 3])                     # bridge
groove(28, 31.5, [0, 0.5, 1, 1.5, 2, 2.5, 3], [1, 3], shaker=0.125)  # riser, stops an eighth before the drop
for i, at in enumerate((30, 30.25, 30.5, 30.75, 31.25)):  # a cajon roll up into the drop
    ev("cajon-slap", at, velocity=round(0.4 + 0.08 * i, 2), variation=i)
groove(32, 76, [0, 1.5, 2], [1, 3])                      # drop .. pause
groove(80, 100, [0, 1.5, 2, 3.5], [1, 3])                # play .. brand .. end
for p in (0, 2):  # paused: only a soft shaker and the strings
    ev("shk", 76 + p, velocity=0.3)
    ev("shk", 78 + p, velocity=0.3)

# ── The opening: play along with Sprite Fright's own beat (160 BPM) ────────
# Its beat j is at 0.045 + 0.375 j s; its sixth beat is the hand-over, 1.92 s.
for j in range(5):
    t = 0.045 + 0.375 * j
    ev("shk", b(t), velocity=0.5, variation=j)
    ev("shk", b(t + 0.1875), velocity=0.32, variation=j + 1)
for j in (1, 3):
    ev("cajon-bass", b(0.045 + 0.375 * j), velocity=0.6, variation=j)
for i in range(6):  # a cajon roll over the last beat into the hand-over
    ev("cajon-slap", b(1.545 + i * 0.0625), velocity=round(0.3 + 0.07 * i, 2), variation=i)

# ── Picture landings ───────────────────────────────────────────────────────
# One drummer, no extra colours: chapters get the cajon and a cymbal, a few
# hand-offs a finger snap, and the rest ride the groove unaccented.
hits = {"crash": [], "belltree": []}


def land(name, crash=0.0, bell=0.0):
    at = b(cue[name])
    ev("cajon-bass", at, velocity=1.0)
    ev("cajon-slap", at, velocity=0.8)
    if crash:
        hits["crash"].append([at, crash])
    if bell:
        hits["belltree"].append([at, bell])


cut_beats = [b(v) for v in cue["cuts"].values()] + [b(p) for p in cue["punch"]] + [b(cue["sintel"])]
for beat in cut_beats:  # every cut: the cajon's bass tone and a slap on its frame
    ev("cajon-bass", beat, velocity=0.95)
    ev("cajon-slap", beat, velocity=0.6)
hits["crash"].append([b(cue["cuts"]["rider"]), 0.22])
land("giveUp", crash=0.3, bell=0.4)          # the drop, on the icon's render
ev("cajon-bass", b(cue["name"]), velocity=0.9)
hits["belltree"].append([b(cue["name"]), 0.3])
ev("cajon-slap", b(cue["name"] + 0.48), velocity=0.7, variation=0)   # each gold 2
ev("cajon-slap", b(cue["name"] + 0.72), velocity=0.8, variation=1)
land("lock", crash=0.25)
ev("cajon-slap", b(cue["pause"]), velocity=0.8)
ev("cajon-bass", b(cue["play"]), velocity=1.0)
ev("snap", b(cue["play"]), velocity=0.6)
land("proofHit", crash=0.2)
land("brand", crash=0.3, bell=0.5)
ev("cajon-bass", b(cue["resolve"]), velocity=0.8)
hits["belltree"].append([b(cue["resolve"]), 0.3])
hits["crash"].append([b(cue["resolve"]), 0.18])
for name in ("fansub", "bridge", "palette", "start", "release", "plate", "swap", "fold", "relock", "proof", "tagline"):
    ev("snap", b(cue[name]), velocity=0.55)

marked = ["open", "fansub", "bridge", "giveUp", "name", "value", "value2", "value3", "palette", "pickTitle", "pickSource", "pickTarget",
          "start", "circle", "release", "confirm", "read", "lock", "plate", "swap", "fold", "line3", "line4", "pause", "relock", "play",
          "proof", "line3b", "proofHit", "brand", "ears", "tagline", "where", "resolve"]
score = {
    "bpm": 125,
    "seconds": table["seconds"],
    "note": __doc__.strip().splitlines()[0],
    "cues": {k: cue[k] for k in marked if k != "open"} | {"cuts": list(cue["cuts"].values())},
    "piano": piano,
    "bass": bass,
    "strings": strings,
    "grooves": [],
    "hits": {k: v for k, v in hits.items() if v},
    "events": sorted(events, key=lambda e: e["beat"]),
}
(ROOT / "audio" / "light.json").write_text(json.dumps(score, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"light.json: {len(events)} events, {len(piano)} chords, {len(bass)} bass notes")
