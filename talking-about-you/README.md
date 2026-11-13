# Meowcal Sub · 妙影 — 五部生肉

A 33-second portrait film. Fable 5.2 shoots five films in code, each in a
different language and a different picture style: a Japanese animated dusk, a
Korean drama's rainy street, an English film noir, a French picture-book Paris
and a German Expressionist silent film. It then admits the viewer understood
none of them. The strip rewinds, a box is drawn around the subtitle, and the
five translations read as the advertisement itself: if the screen has subtitles,
draw a box, the translation appears below, nothing leaves your computer, and it
costs nothing. The box and plate close into the Meowcal Sub mark.

## Deliverables

| File | Frame |
| --- | --- |
| `out/talking-about-you-v4.mp4` | 1080 × 1920, 60 fps, H.264, AAC 48 kHz |
| `out/poster.png` | 1080 × 1440 cover |

`out/` is not committed. Paths are relative to `talking-about-you/`; commands
run from the repository root.

## Reproduce

Install with `npm ci` and `python -m pip install numpy scipy pillow`. FFmpeg must
be on PATH. On Windows ARM64 use x64 Node and keep the renderer at one tab.

```powershell
python talking-about-you/audio/fetch_samples.py
python talking-about-you/audio/score.py
npm run typecheck
npm run studio:talking-about-you
node node_modules/@remotion/cli/remotion-cli.js render talking-about-you/src/index.ts TalkingAboutYou talking-about-you/out/talking-about-you-v4.mp4 --public-dir=talking-about-you/public --concurrency=1 --gl=swangle
node node_modules/@remotion/cli/remotion-cli.js still talking-about-you/src/index.ts TalkingAboutYouPoster talking-about-you/out/poster.png --public-dir=talking-about-you/public --gl=swangle
```

`node talking-about-you/scripts/stills.mjs [frame ...]` writes half-size frames
to `out/stills/` for inspection. Set `COMP=SceneSheet` to review one film at a
time: frame `1000 * n + t` shows film `n` at time `t`.

## Source

| Path | Purpose |
| --- | --- |
| `src/timeline.json` | Every cue in frames; picture and score both read it. |
| `src/timeline.ts` | Layout and the camera that slides along the strip of films. |
| `src/scenes/` | The five films, each drawn as SVG in its own style. |
| `src/Film.tsx` | Slate, typed lines, subtitle, capture box, plate, mark. |
| `src/Poster.tsx` | The 3:4 cover. |
| `audio/score.py` | Score, each film's room tone, slides, rewind and mastering to -14 LUFS. |

Motion helpers and the app palette come from `../launch-15s/src/film/`.

Masks and patterns that cover the full frame can stall the software renderer;
the scenes use plain shapes and gradients.

## Product accuracy

The app translates subtitles that are visible on screen: the film shows a box
drawn around an existing subtitle and the translation in a plate of the same
width directly below, while the picture under the box changes. The five films
are an edit across five viewing sessions; one session has one source language.
Translations are authored copy, not model output, and timing is edited. Korean
is read by Windows OCR, the other four languages by the built-in recognizer.
"Nothing leaves your computer" refers to subtitle text; setup and updates use
the network. The mark, name and colours follow `docs/assets/mark.svg` and
`wordmark.zh-CN.svg` in the app repository.

Fable 5.2 is the Claude model that wrote, drew and scored this film; it is not
part of Meowcal Sub, which translates with a local model.

## Assets and license

All pictures are drawn in code. Film grain tiles are copies of
`launch-15s/public/scenes/grain-*.png`. Piano and cello are recordings from
Versilian Studios VSCO 2 Community Edition (CC0 1.0), pinned in
`audio/fetch_samples.py` with hashes in `audio/samples/manifest.json`. All other
sound is procedural.
