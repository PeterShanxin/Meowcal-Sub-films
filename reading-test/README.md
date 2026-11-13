# 看个剧，还要做题？

A 21.6-second portrait film for **Meowcal Sub · 妙影**. A romantic-looking
scene becomes a reading-comprehension test. Selecting the visible French
subtitle reveals that the conversation is about an unpaid debt.
The film's promise is simple: watch the story instead of guessing the dialogue.

## Deliverables

- `out/meowcal-reading-test-v1.mp4`: 1080 × 1920, 60 fps, H.264, BT.709,
  yuv420p, AAC stereo at 48 kHz.
- `out/cover-v1.png`: 1080 × 1440 cover, composed separately for a feed tile.
- [发布文案](description.zh-CN.md).
- `out/qc.json`: measured media properties, decode result, loudness and hashes.
- `out/contact-sheet.jpg`: frames extracted from the finished MP4.

The approved film and three-file ZIP are distributed through the repository release.
The mix is measured but has not been auditioned by the agent; listen to the
MP4 when preparing a social post.

## Rebuild

Run commands from the repository root on Windows. Use Node 24, Python 3.12
with `numpy`, `scipy`, `pillow`, and FFmpeg / FFprobe on PATH.
The film uses the repository's pinned Remotion version and Windows system
fonts (Microsoft YaHei and Segoe UI). Do not redistribute those font files.

```powershell
npm ci
python -m pip install numpy scipy pillow
npm run audio:reading-test
npm run typecheck
npm run studio:reading-test
npm run render:reading-test
npm run cover:reading-test
python reading-test/verify.py
python reading-test/package_delivery.py
python reading-test/serve.py
```

The audio builder downloads three small recorded-instrument samples from a
pinned revision, saves their hashes and license, then performs two-pass
loudness normalization. It accepts `FFMPEG` when the executable is not on PATH.
The checker also accepts `FFPROBE`. Rendered exports and the intermediate
unmastered audio are reproducible outputs, not release assets in Git.

The review server declares UTF-8 for text responses. Publication copy also has
an HTML preview with a charset declaration and a UTF-8-with-BOM TXT export,
so browser and Windows text viewers preserve Chinese. The ZIP contains only
the MP4, PNG cover and TXT copy; its entries are read back and hash-checked.

## Edit

| File | Owns |
| --- | --- |
| `src/index.tsx` | Four scene durations and composition registration |
| `src/Exam.tsx` | Opening hook, pause, choices, pencil circle |
| `src/Reveal.tsx` | Selection gesture and authored translation |
| `src/Cinema.tsx` | Original illustrated characters, rain, banknote action |
| `src/Closing.tsx` | Closing statement, brand and separate cover layout |
| `src/design.tsx` | Palette, typography, cursor, source subtitle and texture |
| `audio/score.py` | Acoustic score and mastering |

The four scenes are independently selectable in Studio. If timing changes,
move the corresponding audio events in `score.py`; `audio/cues.json` records
the score's actual frame positions. The output duration is checked against the
composition. `public/paper.png` is a deterministic texture generated from a
NumPy RNG seed of 604 (480 × 480, mean 150, standard deviation 27, uint8).

## Product and material provenance

This is an authored illustration of the interaction, **not a screen recording
or a translation-speed benchmark**. The French subtitle already exists on
screen; the tool does not listen to dialogue. The Chinese translation and
selection timing are authored. The banknote is a simplified fictional prop.

The app's README and `docs/ARCHITECTURE.md` establish region selection, local
OCR/translation and overlay presentation. The film does not depict engine
installation, frame-perfect playback synchronization, or translation of audio.
The current PP-OCRv6 engine and FIFO queue are deliberately not a feature list.

| Material | Source / terms |
| --- | --- |
| Characters, setting, layout, animation | Original SVG/React code in this folder; no third-party footage or generated image plates |
| Layered subtitle mark | `docs/assets/mark.svg` from Meowcal Sub; copied unchanged, [brand terms](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md) |
| Piano, pizzicato cello, claves | VSCO 2 Community Edition, Sam Gossner / Versilian Studios, [CC0](https://github.com/sgossner/VSCO-2-CE/blob/440300901dfe9275fd84e0b7763af1f8443ae62e/LICENSE); exact URLs and SHA-256 in `audio/samples/manifest.json` |
| Music | Original arrangement of those recordings; no synthetic notification tones or third-party composition |
| Type | Windows-installed Microsoft YaHei, Segoe UI and Georgia, rasterized in the exports |

Source is covered by the repository's AGPL-3.0-only license. The logo retains
the product's separate trademark terms.
