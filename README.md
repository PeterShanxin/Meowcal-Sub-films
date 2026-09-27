# Meowcal Sub — 就差这一句

A 60-second landscape brand film and a separately staged 30-second portrait cut.
Original SVG pixel cats watch a dramatic declaration, lose their familiar
translation, and use Meowcal Sub to read the Japanese subtitles. The revelation:
“I’m going to sleep for five more minutes.” The viewer freezes, slow-blinks, and
keeps eating. The pixel brand resolves into the real Meowcal Sub mark.

## Deliverables

- `out/story/meowcal-sub-60s.mp4`: 1920 × 1080, 60 fps, H.264.
- `out/story/meowcal-sub-30s.mp4`: 1080 × 1920, 60 fps, H.264.
- Both: AAC LC stereo at 320 kbps, 48 kHz, −14 LUFS integrated target.
- `out/story/review.html`: WebM previews, downloads and contact sheets.
- `out/story/drama-contact-60.jpg`, `drama-contact-30.jpg`: one frame per shot.
- `out/story/drama-acting.jpg`: the two reactions and the snack action.
- `out/story/drama-qc.json`: measured media metadata, loudness and decode checks.

The compositions are `CatDrama60` and `CatDrama30Vertical`. Earlier compositions
remain in the repository as separate studies. Their story and music are not used
by the current film.

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

On Windows ARM64 use x64 Node under Windows emulation. The renderer uses Edge,
SwiftShader, and one render worker. The export script accepts both paths:

```powershell
./scripts/render_drama.ps1 -NodePath 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe' -BrowserPath 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
```

The export script renders silent pictures, muxes the mastered audio, creates
WebM preview files, and fully decodes both deliverables. The MP4 picture is copied
during muxing. Studio playback uses the same mastered WAVs.

## Source

| Path | Purpose |
| --- | --- |
| `DIRECTOR_SCRIPT.md` | Story, editing and performance directions. |
| `src/drama-film/DramaFilm.tsx` | Shot assembly, TV continuity and locality gag. |
| `src/drama-film/CatActor.tsx`, `acting.ts` | Consistent cats, eye/ear/lid performance and planted bodies. |
| `src/drama-film/Episode.tsx` | The original fictional cat drama, pillow action and sleeping pose. |
| `src/drama-film/Room.tsx`, `Screen.tsx` | Rooms, monitor framing, selection and subtitle geometry. |
| `src/timeline.json` → `dramaFilm` | Shared shot boundaries and audio/action cue frames. |
| `src/film/Capture.tsx`, `Plate.tsx` | Reused selection, OCR scan and opaque equal-width translation plate. |
| `src/pixel-film/BrandReveal.tsx` | Selection-to-logo and pixel-to-clean brand ending. |
| `audio/drama.py`, `DRAMA_CREDITS.md` | Original score, foley, mastering and sample attribution. |
| `scripts/drama_stills.mjs` | Representative render frames for visual inspection. |

## Product accuracy

The monitor is the cat’s Windows PC primary display. Existing Japanese text
remains when the familiar translated line stops. Meowcal Sub reads that visible
text with Windows OCR and translates locally; the translation plate sits directly
below, with the same width. No speech recognition is depicted. The ending states
Windows 11, public beta, primary-display support, and all eight supported languages.

UI colors and the final logo follow the app source, including
`src/styles/tokens.css`. The Logo gesture is a visual metaphor, and the action is
edited to story timing. Example translations are authored copy, not a benchmark
of model output or latency. Brand resolution is a visual ending, not a video
upscaling feature. The cloud gag concerns subtitle text staying on the PC;
installation, repair and updates can use the network.

## Assets and license

All cats and environments used in this film are drawn in code. No generated
character images or third-party dramatic footage are used. The original score
uses six CC0 instrument recordings from VSCO 2 Community Edition; the pinned
source URLs, SHA-256 hashes and full license are in `audio/samples/vsco/`.
See [audio/DRAMA_CREDITS.md](audio/DRAMA_CREDITS.md). No vocal recordings are used.

Source: [AGPL-3.0-only](LICENSE), as for Meowcal Sub. The license does not grant
rights to the Meowcal Sub name or logo; see the app’s
[trademark policy](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
