# Meowcal Sub — 就差这一句

A 60-second brand film in landscape and portrait, plus a 30-second portrait cut.
Original SVG pixel cats watch a melodrama whose star speaks in meows. At the
climax the familiar translation drops out, the viewer pauses, and Meowcal Sub
reads the Japanese subtitles. The revelation: “I’m going to sleep for five more
minutes.” The viewer’s pupils shrink to slits, its ears flatten, and it keeps
eating. The pixel brand resolves into the real Meowcal Sub mark.

## Deliverables

| File | Cut | Frame |
| --- | --- | --- |
| `out/story/meowcal-sub-60s.mp4` | 60 s, Chinese supers | 1920 × 1080 |
| `out/story/meowcal-sub-60s-vertical.mp4` | 60 s, Chinese supers | 1080 × 1920 |
| `out/story/meowcal-sub-30s.mp4` | 30 s, Chinese supers | 1080 × 1920 |
| `out/story/meowcal-sub-60s-en.mp4` | 60 s, English supers | 1920 × 1080 |

All are H.264 at 60 fps with AAC LC stereo at 320 kbps, 48 kHz, −14 LUFS
integrated. `out/story/review.html` shows WebM previews, contact sheets
(`drama-contact-60.jpg`, `-60v.jpg`, `-30.jpg`) and the acting sheet
(`drama-acting.jpg`); `drama-qc.json` records media metadata, loudness and decode
checks.

Length and orientation are independent. `timeline.json` → `dramaFilm.cuts` holds
the `full` and `short` edits; each renders in either frame through the
compositions `CatDrama60`, `CatDrama60Vertical`, `CatDrama30Vertical` and
`CatDrama30`. Every composition takes a `locale` prop (`zh` or `en`). Earlier
compositions remain in the repository as separate studies.

## Reproduce

Install Node dependencies with `npm ci`, and Python dependencies with
`python -m pip install numpy scipy pillow`. FFmpeg and FFprobe must be on PATH.

```powershell
python audio/fetch_drama_samples.py
python audio/synth.py --drama
npm run typecheck
npm run studio
# Complete export, mastering, contact sheets, and media verification:
./scripts/render_drama.ps1
```

On Windows ARM64 use x64 Node under Windows emulation. The renderer uses Edge and
SwiftShader. The export script accepts both paths:

```powershell
./scripts/render_drama.ps1 -NodePath 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe' -BrowserPath 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
```

The export script renders silent pictures, muxes each cut's mastered audio,
creates WebM previews, and fully decodes every deliverable. Studio playback uses
the same mastered WAVs. After changing the end card, re-render its pixel source
with `remotion still DramaBrandLandscape|DramaBrandVertical` into
`public/pixel-film/brand-<frame>-<locale>.png`.

## Source

| Path | Purpose |
| --- | --- |
| `DIRECTOR_SCRIPT.md` | Story, editing, performance and sound directions. |
| `src/drama-film/DramaFilm.tsx` | Shot assembly, supers, lip sync and the cloud scene. |
| `src/drama-film/CatActor.tsx`, `acting.ts` | Cats, pupil / ear / whisker / tail performance and planted bodies. |
| `src/drama-film/Episode.tsx` | The fictional cat drama, pillow action and sleeping pose. |
| `src/drama-film/Room.tsx`, `Screen.tsx` | Each viewer’s room, monitor framing, selection and subtitle geometry. |
| `src/drama-film/Cloud.tsx` | The cloud that tries to take the subtitles. |
| `src/timeline.json` → `dramaFilm` | Shot boundaries, cue frames and Momo’s meowed lines for both cuts. |
| `src/film/Capture.tsx`, `Plate.tsx` | Reused selection, OCR scan and opaque equal-width translation plate. |
| `src/pixel-film/BrandReveal.tsx` | Selection-to-logo, pixel-to-clean ending and the localized end card. |
| `audio/drama.py`, `DRAMA_CREDITS.md` | Score, cat voices, foley, mastering and attribution. |
| `scripts/drama_stills.mjs` | Representative frames for visual inspection. |

## Product accuracy

The monitor is the cat’s Windows PC primary display. Existing Japanese text
remains when the familiar translated line stops. The viewer pauses before
translating, so no sound plays while Meowcal Sub reads that visible text with
Windows OCR and translates locally; the translation plate sits directly below,
with the same width. No speech recognition is depicted. The end card uses the
app README’s tagline and names Windows, the public beta, local AI and the
supported languages; its platform line is the product owner's copy.

UI colors and the final logo follow the app source, including
`src/styles/tokens.css`. The Logo gesture is a visual metaphor, and the action is
edited to story timing. Example translations are authored copy, not a benchmark
of model output or latency. Brand resolution is a visual ending, not a video
upscaling feature. The cloud gag concerns subtitle text staying on the PC;
installation, repair and updates can use the network.

## Earlier film: 15 seconds

The 15-second launch film is still here. The capture box is the whole film: it
drags around a foreign subtitle, the translation drops out beneath it, the world
whips through ten languages behind the locked box, the frame breaks into its
layers (screen → Windows OCR → local AI translation), and the box folds into the
app icon. Landscape, vertical and under-10 MB web copies are attached to the
[latest release](https://github.com/PeterShanxin/Meowcal-Sub-launch-film/releases/latest).

```bash
python audio/synth.py        # score from src/timeline.json
npx remotion render LaunchFilm out/meowcal-sub-launch-film.mp4
```

`LaunchFilmVertical` (1080×1920) and `LaunchFilmSquare` (1080×1080) render the
same film. Its sources are `src/film/` (scenes, camera, `Capture.tsx`, `Plate.tsx`,
`Hud.tsx`, layout) and `audio/synth.py`. Its backdrops in `public/scenes/photo/`
are AI-generated stills, and its soundtrack is generated from code. The app's
styling, copy and logo come from the Meowcal Sub repository. Remotion is free for
individuals and small teams; larger companies need a company licence
(remotion.dev/license).

## Archived concepts

[Read beyond language](archive/read-beyond-language/README.md) is a retained
alternative, not the selected launch film. Its final MP4, editable source,
original assets and verification record are preserved together.

## Assets and license

In the cat drama film, all cats and environments are drawn in code, with no
generated character images or third-party footage. Instrument samples are CC0 recordings from VSCO 2
Community Edition; cat voices are CC0 or public-domain recordings from Wikimedia
Commons. `audio/fetch_drama_samples.py` downloads the pinned files; source URLs,
licenses and SHA-256 hashes are in `audio/samples/*/manifest.json`. See
[audio/DRAMA_CREDITS.md](audio/DRAMA_CREDITS.md).

Source: [AGPL-3.0-only](LICENSE), as for Meowcal Sub. The license does not grant
rights to the Meowcal Sub name or logo; see the app’s
[trademark policy](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
