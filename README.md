# Meowcal Sub — 15-second launch film

Remotion (React + TypeScript) source for the Meowcal Sub launch film:
1920×1080, 60 fps, H.264 + 320 kbps AAC stereo.

**Concept.** The capture box is the whole film. You drag it around a foreign
subtitle, the translation drops out beneath it, the world whips through ten
languages behind the locked box, the frame breaks into its layers (screen →
Windows OCR → local AI translation) to show nothing leaves the PC, and the box
finally folds into the app icon.

## Cat Planet story

The current 60-second story and 30-second portrait proposal are in
[DIRECTOR_SCRIPT.md](DIRECTOR_SCRIPT.md), awaiting script review.
[STORYBOARD.md](STORYBOARD.md) documents the existing pixel animatics and their
source assets; those exports are visual references, not an approved story.

## Watch

Landscape, vertical, and under-10 MB web copies are attached to the
[latest release](https://github.com/PeterShanxin/Meowcal-Sub-launch-film/releases/latest).

## Render

Remotion ships no Windows ARM64 renderer, so on ARM64 run it under an x64 Node
(Windows emulates it). On x64 machines use your normal Node.

```bash
npm install
python audio/synth.py        # regenerate the score from src/timeline.json
npx remotion studio          # preview
npx remotion render LaunchFilm out/meowcal-sub-launch-film.mp4
```

`LaunchFilmVertical` (1080×1920) and `LaunchFilmSquare` (1080×1080) render the
same film; geometry comes from `src/film/layout.ts`.

## Where things live

| Path | What |
| --- | --- |
| `src/timeline.json` | Every cue frame. Picture and `audio/synth.py` both read it, so sound stays on the motion. |
| `src/film/scenes.ts` | Subtitle lines, translations, and language pairs per scene. |
| `src/film/camera.ts` | Camera path, including the 3D exploded view and its screen projection. |
| `src/film/Capture.tsx` | Selection box, dimming, cursor, OCR scan, and the box-to-icon morph. |
| `src/film/Plate.tsx`, `Hud.tsx` | The app's subtitle plate and status pill, styled from the app's tokens. |
| `audio/synth.py` | Original score and sound design, synthesised with NumPy; mastered to -14 LUFS. |

## Assets

- UI styling, copy, language labels, and the logo come from the Meowcal Sub
  repository (`src/styles/tokens.css`, `src/selector.html`, `docs/assets/logo.svg`).
- Backdrops in `public/scenes/photo/` are AI-generated stills (Codex image
  generation), not stock footage.
- The soundtrack is generated from code; no samples or licensed music.
- Remotion is free for individuals and small teams; larger companies need a
  company licence (see remotion.dev/license).

## License

The source is licensed under the [GNU Affero General Public License v3.0 only](LICENSE),
the same licence as [Meowcal Sub](https://github.com/PeterShanxin/Meowcal-Sub).
The licence does not grant rights to the Meowcal Sub name or logo; see the
project's [trademark policy](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
