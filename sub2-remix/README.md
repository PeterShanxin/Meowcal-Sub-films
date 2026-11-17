# 好字幕，自动上屏。 — Meowcal Sub 2 · 妙影2 launch film, remix

A 51-second portrait film for
[Meowcal Sub 2 · 妙影2](https://github.com/PeterShanxin/Meowcal-Sub-2): a second
cut of the Sub 2 launch film, with a horror-cut question, a cyberpunk cold
open, an epic-fantasy main scene and a light score for a small band (legato
strings, piano, bass and one cajon player). Every film, clip and the music are openly licensed
for commercial reuse; the list and the evidence are below.

**Concept:** the good subtitle already exists. Meowcal Sub 2 finds it, lines it
up with the picture, and puts it on your screen as a second subtitle.

The copy, the structure, the geometric logo build, the tumbling name with each
2 popping, 「自动」 with the rolling 找/对/换, the Chinese studio UI and the
subtitle-card icon are the parent film's. What changed:

- **First frame: the question.** 「想看的片，只有外语字幕？」 is on screen from frame
  0 and stays through the cold open. Under it, *Sprite Fright*'s scream
  ("Aaaah! My eyes!", English line burned in) plays with the film's own sound,
  which has its own beat (160 BPM). A recorded kit plays along on that beat,
  building, and the clip starts at 5:29.957 so that its accent on 5:31.877
  falls exactly on the score's entry at 1.92 s: the pulse never breaks, only the
  tempo changes. Over its last beat the picture pushes in and blurs, the window
  starts to open, and the rider arrives on the score's hit already pushed in and
  settles (a zoom-through, not a hard cut). The film's own next cut (5:32.08)
  is never reached.
- **Cold open (1.92–7.7 s).** The score comes in on a cajon hit, the window opens
  to a tall 4:5, and six shots cut on its hits: a neon rider (Mixkit), then
  *Charge*: the energy cell, the blast, the paint can bursting, his swing at the
  robot, the robot's visor in sparks. On the last beat the window folds down
  onto *Sintel*, the shaman's tent; 「可字幕组大神，早就翻好了。」 lands under the
  question on the beat.
- **Main scene: *Sintel*.** The capture box is drawn around "What brings you to
  / the land of the gatekeepers?", the film's own Chinese subtitle file spins
  and locks on it, and 「你为何要来到守门人的领地？」 drops onto the plate on the
  drop. The next lines follow, the viewer pauses on "Someone very dear? / A
  kindred spirit?", drags back to "I'm searching for someone." and plays.
- **Music: a light score** (since v7): a legato violin melody over a cello and
  viola pad (v8; v7's marimba line read as 叮叮咚咚), one drummer (cajon, finger snaps, shaker),
  soft piano and pizzicato bass, written to the cue table.
  v1–v6 used Scott Buckley's "Red", which read as too grand for a subtitle app.

| Time | Beat | On screen | Music |
| --- | --- | --- | --- |
| 0–1.9 s | The question | 想看的片，只有外语字幕？ over Sprite Fright's scream | the film's own sound at its 160 BPM, shaker and cajon playing along, handing over on its beat |
| 1.9–7.7 s | Cold open | 6 shots on the drum hits, tall window, folds down onto Sintel on the last beat | cajon and shaker groove; the cajon's bass tone and a slap on each cut |
| 7.7–11.5 s | Hope | 可字幕组大神，早就翻好了。 (Sintel) | half time; a finger snap on the fansub line |
| 11.5–15.4 s | Bridge | 所以，我们做了个神仙 App, the icon built by geometry | cajon on every beat, then eighths, a shaker in sixteenths and a cajon roll, an eighth of air before the drop |
| 15.4–19.2 s | Name and value | Meowcal Sub 2 · 妙影2 (each 2 pops in) · 自动 + 找 → 对 → 换 | the drop: cymbal and bell tree, a cajon slap on each 2 |
| 19.2–25 s | Find | 字幕组翻好的，自动找来。 | |
| 25–27 s | The viewer's decision | 圈住画面里的字幕。 | |
| 27–31 s | Align | 认出这一句—— → 时间轴，自动对上。 | |
| 31–36.5 s | Replace | 第二份字幕，自动换上。 | |
| 36.5–40.3 s | Follow | 暂停、倒回，它都跟着。 | |
| 40.3–44.2 s | Proof | 每一句，都对得上。 | |
| 44.2–50.9 s | Brand | Meowcal Sub 2 · 妙影2 · 好字幕，自动上屏。 · 现已登陆 Windows · GitHub · Microsoft Store | the climax, then the closing chord |

## Deliverables

| File | Format |
| --- | --- |
| `out/release-v10/meowcal-sub-2-remix-v10.mp4` | 1080 × 1920, 60 fps, H.264 yuv420p BT.709, AAC stereo 48 kHz |
| `out/release-v10/cover-v10.png` | 1080 × 1440 Xiaohongshu cover |
| `out/release-v10/description.zh-CN.txt` | Post title, body, tags, disclosures and credits (UTF-8 with BOM), from [`description.zh-CN.md`](description.zh-CN.md) |
| `out/release-v10/qc.json` | Measured streams, full-decode result, loudness, true peak, SHA-256 |

`out/`, `public/frames/`, `public/fonts/` and `public/audio/*.wav` are not
committed; the steps below rebuild them.

## Reproduce

From the repository root, with Node 24, Python 3.12 with NumPy, and FFmpeg on
PATH:

```powershell
npm ci
npm run assets:sub2-remix     # films, clips, music, subtitles, fonts → hashes checked, frames cut (~1.7 GB download)
npm run audio:sub2-remix      # Red edited on its beat grid + key sounds → public/audio/mix.wav
npm run typecheck
npm run studio:sub2-remix     # http://localhost:3000/Sub2Remix
npm run render:sub2-remix     # picture, then the WAV master muxed in as AAC
npm run cover:sub2-remix
npm run sync:sub2-remix       # cue sync on the final MP4
```

`node sub2-remix/scripts/stills.mjs <seconds> ...` writes frames to
`out/stills/` for inspection.

## Edit

| File | Owns |
| --- | --- |
| `audio/cues.json` | The one clock: `cues` for every landing in the picture, `sfx` for typing and dragging, and `music`, the edit of Red (which track seconds play at which film second). 125 BPM, so a beat is 0.48 s; every cue is a whole or half beat. |
| `audio/compose.py` | Writes `audio/light.json`, the light score, from the cue table: harmony, the cajon groove per section, and the tick or sparkle on each picture landing. |
| `audio/build.py` | Renders the light score with `audio/score/` (the acoustic-score renderer, with VCSL light percussion and mallets added to its bank and voices), lays Sprite Fright's opening sound under it, places one recorded key per screen action, mixes and masters to −14 LUFS. `MUSIC=red` rebuilds the v1–v6 Red edit. |
| `audio/check_sync.py` | Placement of the soundtrack against the picture's clock, and the onset at each cue, on any rendered file. |
| `audio/analysis/` | How the tempo, beat grid and splice were measured (`tempo.py`, `grid.py`, `red-grid.json`). |
| `src/clock.ts` | Cue import, easing, the shot list, Sintel's lines (verbatim from its subtitle files), footage time and what the plate shows when. |
| `src/layout.ts` | Every rectangle: the tall cold-open window and the cinema window, the burned-in line, the plate, the glass object's path. |
| `src/Picture.tsx` | The window, the film's light around it, the burned-in English lines. |
| `src/Construct.tsx` | The icon grown from one line by geometry, 12–15.4 s. |
| `src/Rig.tsx` | The one glass object: mark, search, toolbar, subtitle file, empty plate, mark. |
| `src/Overlay.tsx` | Headlines, 找/对/换, capture box, the text hand-offs, plate, player transport, cursor, lockup. |
| `scripts/assets.json` | Every third-party file with its URL, licence, evidence and SHA-256, and where each clip is cut. |

## Sound

### The light score (v7)

The owner found Red and the big drums too grand ("很宏大…有一点点偏") and asked for
something more modern and relaxed, with woodblock, castanets or a band
drummer as options. v7 replaces the music with a score written to the cue
table (`audio/compose.py`), rendered from recorded CC0 samples:

- **Instruments.** Marimba (VCSL Outrigger, its files named an octave low,
  corrected by pitch measurement), kalimba (VCSL, Kenya; each tine's root set
  to its measured pitch), cajon bass tone and slap, a small shaker, claves,
  woodblock, bongos, solo claps (VCSL), with the pedalled piano, pizzicato bass
  and glockenspiel of the renderer's bank (VSCO 2 CE, VCSL). VCSL has no
  castanets; claves and woodblock give that dry click. Each voice was balanced
  on its solo stem.
- **Harmony.** D major, I–V–vi–IV (D–A–Bm–G), one chord a bar, with the drop,
  the lock, play, the brand and the ending on D. The marimba plays broken
  chords in eighths accented 3+3+2 over the soft piano and the bass.
  v8 replaces that marimba line, which the owner heard as 叮叮咚咚 ("主旋律…比较像
  AI slop"): a cello and viola pad holds each chord, and from the drop a violin
  melody in joined notes (D–A–Bm–G phrases, up to D6 on the ending) carries
  the tune; percussion and landings are unchanged.
- **The drummer is the cajon.** Bass tone and slap with a snap on 2 and 4 and
  sixteenth-note shaker; half time under the hope line; every beat, then
  eighths and a bongo run into the drop, which follows an eighth of air; out
  while the viewer pauses and drags back, back on play.
- **Picture landings (v9).** One drummer and no extra colours. Each cut gets
  the cajon's bass tone and a slap on its frame; the drop, the lock, the proof
  and the brand the cajon with a cymbal (bell tree on the drop, the name, the
  brand and the ending); each gold 2 a cajon slap; ten hand-offs a finger
  snap; the other landings ride the groove unaccented. v8 also used claves,
  woodblock, bongos, kalimba and glockenspiel (17 voices); the owner found the
  score's elements cluttered ("BGM元素比较杂乱 特别是木鱼"), so v9 has 11.
- **Measured on the v9 MP4.** `check_sync.py`: 44 of 49 cues are clear onsets (v10 the same),
  5 soft (the zoom, one chip and the end card's three lines), none off;
  −14.0 LUFS, −1.4 dBTP. v9 also ends at 50.9 s instead of 52 s (the end
  card held still for 4 s after the last chord). Older figures follow.
- **Measured on the v7 MP4** (v8 below). `check_sync.py`: 48 of 49 cues are clear onsets
  within 15 ms, none off; the attacks land 1–10 ms early (under a frame).
  −14.0 LUFS, true peak −1.5 dBTP. Not auditioned.
- **The opening** is still Sprite Fright's own sound at its 160 BPM, now with
  claves and shaker playing along, handing over on its accent at 1.92 s.

### Earlier versions: Red (v1–v6, `MUSIC=red`)

**Music: 'Red' by Scott Buckley - released under CC-BY 4.0. www.scottbuckley.com.au**
(full mix, edited). The composer describes it as inspired by the look of
Cyberpunk 2077.

- **Tempo and grid, measured.** Red is 124.99 BPM (a beat is 0.48004 s), fitted
  by autocorrelation and comb alignment of a spectral-flux onset envelope over
  99–190 s, with the downbeat taken from the intro's booms (track beats 3, 11,
  19, 27, one every two bars). The fitted phase was then moved 18 ms later to
  the transients' actual attack, measured on beat-averaged high-band envelopes.
- **The edit.** Film 0–1.92 s is *Sprite Fright*'s own soundtrack (5:29.957–5:31.877,
  the scream, 160 BPM), 2 dB under Red's entry, ringing 40 ms into Red's hit;
  `audio/opening.json` is the kit playing along on its beats, 6 dB under it. The cold open (film 1.92–7.68 s) plays track 136.33–142.09 s
  (beats 283–294), a drum section of the climax that the rest of the film never
  uses, entering on the hit at beat 283 with a recorded bass drum and crash on
  top, so the six shots cut on real hits (track beats 283, 286, 287, 289, 290,
  291; film 1.92, 3.36, 3.84, 4.80, 5.28, 5.76 s) and the frame punches on one
  more (7.20 s). On the downbeat at 7.68 s the track cuts
  to its build; the downbeat's own hit rings out over the cut for 0.9 s. Film
  7.68–48.0 s plays track 90.25–130.57 s (beats 187–271): the
  build under the hook, the near-silent break under the bridge
  and the logo build, the drop at 97.93 s on the icon's render (film 15.36 s),
  the vocal line through the demo, and the climax at 126.73 s on the brand
  (film 44.16 s). From the drop to the climax is exactly 60 beats, the same
  span the parent film has from icon to brand, so the parent's cue structure
  carries over at 0.96× time. At film 48.0 s the C-major bar cuts (12 ms
  equal-power crossfade, on the downbeat) to the track's closing F-minor
  chord at 190.10 s, a cadence on the end card; it fades out from 50 to 52 s.
- **Accents.** Before the drop Red has no drums, and some picture landings
  after it fall between Red's hits. `audio/accents.json` puts recorded CC0
  drums (concert bass drum, kick, snare, clap, rim, toms, a cymbal swell into
  the drop; `audio/score/`, from the acoustic-score renderer) on those
  landings: the hook, the cut to Sintel, the bridge, the name and each 2, the
  rolling 找/对/换, the plate, the fold, the next line, the relock, the proof
  and the end row.
- **Drum layer.** `audio/groove.json` puts a recorded kit under the whole film,
  5 dB under Red: kick, claps on 2 and 4 and eighth-note hats with Red's drums
  in the cold open; four on the floor, claps and hats from the drop; a tom fill
  into the lock and a snare roll into the brand; it drops out while the viewer
  pauses and drags back (36.5–38.4 s) and returns with a crash on play.
- **Riser.** Red's break under the app's arrival is near-silent, which read as
  dead air. `audio/riser.json` drives film 7.68–15.36 s with a recorded kit:
  a half-time kick, four on the floor with claps from the bridge line
  (11.52 s), eighth-note kicks and sixteenth hats from 14.4 s, and a snare roll
  crescendo that stops an eighth note before the drop, where a bass drum, kick and crash double Red's hit.
  `build.py` sets it 3 dB under the cold open's level.
- **Picture on the hits.** On every cut the whole frame jumps about 4 % and
  flares, starting on the hit's own frame and settling within 0.3 s; the big
  landings (render, lock, proof, brand) and smaller UI landings punch less.
- **Keys.** Recorded keypresses (`audio/keys/`, CC0) for each typed character
  of "Sintel" and each mouse press and release, mixed just under the music.
- **Master.** −14 LUFS integrated, true peak under −1 dBTP after AAC.
- **Sync, measured on the release MP4.** The picture's cues sit on the track's
  grid within 3.8 ms by design. `check_sync.py` finds the soundtrack at
  +0.00 ms against the picture clock (the limiter's look-ahead is compensated,
  `alimiter latency=1`). In 5 ms peak bins, the attacks of the drop (15.36 s),
  the lock (28.80 s), the brand (44.16 s) and the closing chord (48.00 s) begin
  within 0–5 ms of their cues; palette, swap, pause and proof read as clear
  onsets within 9 ms. In v6, with the drum layer, `check_sync.py` reports
  47 of 49 cues as clear hits within 15 ms and none off (v2: 28 of 49; v1: 13 of 47). Frame-difference
  peaks of the picture (cuts and the source films' own shot changes) were
  matched against the soundtrack: all eight cold-open cuts land within 0–23 ms
  of a drum attack, and Sintel's own shot cut now changes on the line4 and
  line3b beats (it was 133 ms late in v1).

**The music has been measured, not auditioned.** In particular the splice into
the closing chord and the balance of the key sounds against the vocal have not
been listened to.

## What the film shows and what the app does

- The studio search, lists, start button, capture box, toolbar and subtitle
  plate are redrawn from the app's source at about 2.2× for a phone screen, in
  the app's narrow-window layout and Simplified Chinese interface, as in the
  parent film. It is an animation, not a screen recording.
- *Sintel* has no subtitles burned into the picture. The English lines are
  drawn from the film's own English subtitle stream in the official 1080p
  release (they match the community English timed text on Wikimedia Commons
  word for word and in timing); the Chinese lines on the plate are
  `sintel_chs.srt` from the film's download page, used as published (its
  line 9 is a loose translation, 「某人，一个很亲的人吗？很好的人？」 for "Someone very
  dear? A kindred spirit?", shown as published). Line breaks and timings are
  the files', except that "Someone very dear?" starts 0.125 s late, on the
  film's own shot cut, so cut, line and plate change together on the beat.
- *Sprite Fright*'s line ("Aaaah! My eyes!", 5:30.25) is the dialogue as spoken,
  checked against the Commons English timed text (shown from 5:29.95, 0.3 s before its timed start, so it is on the opening frame); it has no Chinese subtitle
  and the plate does not appear over it.
- Footage time is re-timed: Sintel slows (0.5–0.66×) while the app is set up
  and read, holds while the box is drawn, and plays at 1.00–1.04× afterwards
  so that each next line arrives on a beat.
- The search results (file names, sources) are illustrations.
- The row of timed cues that spins and locks is an illustration of the
  subtitle file being matched; the app shows only the plate during playback.
- Compressed for time: installing a subtitle source key, preparing the
  session, and the seconds a real match and a re-match after seeking take.
- The plate is drawn without the app's `SUB`/`AI` corner mark, selected rows
  without the left accent stripe, and no live-dock bead
  (PeterShanxin/Meowcal-Sub-2#158, #159, #160), as in the parent.
- The end row lists Microsoft Store next to GitHub; check that the Store
  listing serves Sub 2 before posting (same note as the parent).
- 「每一句，都对得上」 and 「暂停、倒回，它都跟着」 rest on the app's
  `docs/OCR_BENCHMARK.md` (native capture run of 2026-11-10), as in the parent;
  neither is a whole-film coverage rate.

## Assets and credits

| Material | Credit | Licence and evidence |
| --- | --- | --- |
| *Sintel* (2010), 1:58–2:28 | © copyright Blender Foundation \| [durian.blender.org](https://durian.blender.org/); [download](https://download.blender.org/durian/movies/) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Audio removed, cropped to 2.4:1, darkened, re-timed (slow motion, hold, pause, seek); English subtitle lines redrawn as text; interface animation drawn over it. |
| *Sintel* subtitles | English: the film's subtitle stream; Chinese: [`sintel_chs.srt`](https://download.blender.org/durian/subs/sintel_chs.srt), Durian project translators | CC BY 3.0, as published with the film |
| *Charge* (2022), five shots between 0:50 and 2:05 | © Blender Foundation \| [studio.blender.org/charge](https://studio.blender.org/films/charge/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (the film's end card; [Commons file page](https://commons.wikimedia.org/wiki/File:Charge_-_Blender_Open_Movie-full_movie.webm)). Audio removed, cropped to 4:5, shortened. |
| *Sprite Fright* (2021), 5:29.5–5:31.9 | (CC) Blender Foundation \| [studio.blender.org](https://studio.blender.org/films/sprite-fright/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) ([Commons file page](https://commons.wikimedia.org/wiki/File:Sprite_Fright_-_Blender_Open_Movie-full_movie.webm)). Its own sound used for the first 1.92 s, otherwise audio removed; cropped to 2.4:1, darkened; English line redrawn as text. |
| "A motorcyclist wearing a leather jacket is driving through the neon city lights at fast pace" (#99864) | [Mixkit](https://mixkit.co/) | [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree): each item is marked Free License on its page (checked 2026-11-16); covers online marketing ads; attribution not required. Cropped to 4:5, shortened. Restricted-licence Mixkit clips were not used. |
| Music in v1–v6 (not in v7): "Red" | 'Red' by Scott Buckley - released under CC-BY 4.0. [www.scottbuckley.com.au](https://www.scottbuckley.com.au/library/red/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Edited: 136.33–142.09 s, then 90.25–130.57 s, then 190.10 s to the fade. |
| Meowcal Sub 2 icon and name | `docs/assets/` in the app repository | Project brand asset |
| Score instruments: violin, viola, cello, cajon, shaker, finger snaps, piano, pizzicato bass, bell tree, cymbal | [VCSL](https://github.com/sgossner/VCSL) (pinned to commit c1ea7bc), VSCO 2 CE (`audio/score/instrument-bank.json`, `audio/score/PROVENANCE.md`) | CC0 |
| Key recordings | "Keyboard Soundpack 1" by unicaegames, OpenGameArt (`audio/keys/PROVENANCE.md`) | CC0 |
| Noto Sans SC, Inter, JetBrains Mono | google/fonts at a pinned commit (`scripts/assets.json`) | SIL OFL 1.1 |

The films' own soundtracks are not used, except *Sprite Fright*'s for the first 1.92 s. No *Tears of Steel* live action is
used: its actors keep likeness rights for product advertising. Every
downloaded file is pinned by SHA-256 in `scripts/assets.json`.

Remotion is used under the [Remotion license](https://www.remotion.dev/docs/license).
