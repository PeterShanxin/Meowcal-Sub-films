# Meowcal Sub — 就差这一句

A 60-second brand film in landscape and portrait, plus a 30-second portrait cut.
Original SVG pixel cats watch a melodrama whose star speaks in meows. At the
climax the familiar translation drops out, the viewer pauses, and Meowcal Sub
reads the Japanese subtitles. The revelation: “I’m going to sleep for five more
minutes.” The viewer’s pupils shrink to slits, its ears flatten, and it keeps
eating. The pixel brand resolves into the real Meowcal Sub mark.

The four cuts are attached to the
[cat-drama-v1.0.0 release](https://github.com/PeterShanxin/Meowcal-Sub-films/releases/tag/cat-drama-v1.0.0).

Paths in this file are relative to `cat-drama/`; commands run from the
repository root.

## Deliverables

| File | Cut | Frame |
| --- | --- | --- |
| `out/story/meowcal-sub-60s.mp4` | 60 s, Chinese supers | 1920 × 1080 |
| `out/story/meowcal-sub-60s-vertical.mp4` | 60 s, Chinese supers | 1080 × 1920 |
| `out/story/meowcal-sub-30s.mp4` | 30 s, Chinese supers | 1080 × 1920 |
| `out/story/meowcal-sub-60s-en.mp4` | 60 s, English supers | 1920 × 1080 |

All are H.264 at 60 fps with AAC LC stereo at 320 kbps, 48 kHz, −14 LUFS
integrated. `out/` is not committed. `out/story/review.html` shows WebM previews,
contact sheets and the acting sheet; `drama-qc.json` records media metadata,
loudness and decode checks. The contact sheets and acting sheet are also written
to `storyboard/`, which is committed and embedded in `STORYBOARD.md`.

Length and orientation are independent. `src/timeline.json` → `dramaFilm.cuts`
holds the `full` and `short` edits; each renders in either frame through the
compositions `CatDrama60`, `CatDrama60Vertical`, `CatDrama30Vertical` and
`CatDrama30`. Every composition takes a `locale` prop (`zh` or `en`).

## Reproduce

Install dependencies once from the repository root with `npm ci`, and the Python
dependencies with `python -m pip install numpy scipy pillow`. FFmpeg and FFprobe
must be on PATH.

```powershell
python cat-drama/audio/fetch_drama_samples.py
python cat-drama/audio/drama.py
npm run typecheck
npm run studio:cat-drama
# Complete export, mastering, contact sheets, and media verification:
./cat-drama/scripts/render_drama.ps1
```

On Windows ARM64 use x64 Node under Windows emulation, and keep the renderer at
one browser tab: higher concurrency crashed or hung Edge on that host. The renderer
uses Edge and SwiftShader. The export script accepts both paths:

```powershell
./cat-drama/scripts/render_drama.ps1 -NodePath 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe' -BrowserPath 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
```

The export script renders silent pictures, muxes each cut's mastered audio,
creates WebM previews, and fully decodes every deliverable. Studio playback uses
the same mastered WAVs. After changing the end card, re-render its pixel source
(`DramaBrandLandscape` or `DramaBrandVertical`) into
`public/pixel-film/brand-<landscape|vertical>-<zh|en>.png`:

```powershell
npx remotion still cat-drama/src/index.ts DramaBrandLandscape cat-drama/public/pixel-film/brand-landscape-zh.png --public-dir=cat-drama/public --props='{"locale":"zh"}'
```

## Source

| Path | Purpose |
| --- | --- |
| `DIRECTOR_SCRIPT.md` | Story, editing, performance and sound directions. |
| `STORYBOARD.md` | Contact sheets and shot list. |
| `src/drama-film/DramaFilm.tsx` | Shot assembly, supers, lip sync and the cloud scene. |
| `src/drama-film/CatActor.tsx`, `acting.ts` | Cats, pupil / ear / whisker / tail performance and planted bodies. |
| `src/drama-film/Episode.tsx` | The fictional cat drama, pillow action and sleeping pose. |
| `src/drama-film/Room.tsx`, `Screen.tsx` | Each viewer’s room, monitor framing, selection and subtitle geometry. |
| `src/drama-film/Cloud.tsx` | The cloud that tries to take the subtitles. |
| `src/timeline.json` → `dramaFilm` | Shot boundaries, cue frames and Momo’s meowed lines for both cuts. |
| `src/pixel-film/BrandReveal.tsx` | Selection-to-logo, pixel-to-clean ending and the localized end card. |
| `src/pixel-film/`, `src/story-tv/styles/PixelScene.tsx` | Pixel world, cats, places and the room the final film builds on. |
| `audio/drama.py`, `audio/DRAMA_CREDITS.md` | Score, cat voices, foley, mastering and attribution. |
| `scripts/drama_stills.mjs` | Representative frames for visual inspection (run from the repository root). |

The selection box, OCR scan, translation plate and brand lockup are reused from
the 15-second film: this project imports `../launch-15s/src/film/` (`Capture.tsx`,
`Plate.tsx`, `Brand.tsx`, layout and theme helpers). Changing those files changes
this film too. `src/story/`, `src/story-tv/` and the rest of `src/pixel-film/` are
the cat-planet and TV style studies (compositions `CatPlanetStory*`,
`PixelStory*`, `TVStyle*`, `TVStoryStudy12`); the drama film does not use their
story or music, and their review scripts are in `scripts/`.
`python cat-drama/audio/cat_planet.py` rebuilds the cat-planet score
(`public/audio/cat-planet-*.wav`). `public/scenes/` holds the film-grain tiles
used by `TVStoryStudy12`, copies of `launch-15s/public/scenes/grain-*.png`.

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

## Assets and license

In the cat drama film, all cats and environments are drawn in code, with no
generated character images or third-party footage. Instrument samples are CC0
recordings from VSCO 2 Community Edition; cat voices are CC0 or public-domain
recordings from Wikimedia Commons. `audio/fetch_drama_samples.py` downloads the
pinned files; source URLs, licenses and SHA-256 hashes are in
`audio/samples/*/manifest.json`. See [audio/DRAMA_CREDITS.md](audio/DRAMA_CREDITS.md).

Source: [AGPL-3.0-only](../LICENSE), as for Meowcal Sub. The license does not
grant rights to the Meowcal Sub name or logo; see the app’s
[trademark policy](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
