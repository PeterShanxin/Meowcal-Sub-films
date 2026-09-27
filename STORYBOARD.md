# Cat Planet

Six cats miss each other's everyday jokes across subtitled vlogs; one selection box helps them discover they all prefer the cardboard box.

## Review deliverables

The current review contains two silent 12-second style studies: `TVStylePixel12` and `TVStyleCeramic12`. Both compositions are 1920×1080 at 60 fps; review exports are 960×540. Open `out/story/review.html` for synchronized playback and the six-frame contact sheet. The living-room / television narrative direction is accepted; visual style and full production remain pending.

The earlier `CatPlanetStory60` and `CatPlanetStory30Vertical` animatics are retained for reference at `out/story/review-v1.html`; they are not approved. Their timing and sound cues live in `src/timeline.json` under `catPlanet`. The existing 15-second launch compositions retain their timing.

## Story

| Time | Picture and action |
| --- | --- |
| 0–5 | Push from space toward a tiny cat-shaped world; six cats watch their screens. |
| 5–8 | 栗子 chooses a cardboard box over a cat bed; layered hills and tiled roofs. |
| 8–10.5 | Momo claims a keyboard as a bed; volcanic mountain and low roofs. |
| 10.5–13 | Bori inspects an empty bowl; mountain city and curved roofline. |
| 13–15 | Bean, Bleu, Fritz: box, sunbeam, pillow; brick terraces, mansard roofs, timber houses. |
| 15–27 | Four cats watch other cats' burned-in subtitles and tilt their heads. Each reaction remains affectionate. |
| 27–30 | Six puzzled faces share the frame. |
| 30–33 | 栗子 opens Meowcal Sub; actual Home screenshot, English → Simplified Chinese. |
| 33–35 | Change the subtitle region; draw around existing text; confirm the region. |
| 35–36 | Return to Home and start translation. |
| 36–39 | Windows OCR scan metaphor, local translation, equal-width opaque plate below the source. |
| 39–42 | Japanese → English: keyboard joke. |
| 42–45 | French → Traditional Chinese: claiming the sunbeam. |
| 45–49.5 | The world's screens illuminate in sequence. Lines represent understanding, not a sharing feature. |
| 49.5–55 | A cloud reaches toward a computer; the cat swats it away. Subtitle stays inside. Setup/update network note remains visible. |
| 55–60 | Selection frame folds into the existing brand cat; exact requested English lockup, public-beta and display boundaries, eight languages. |

Vertical edit: 0–6 conflict, 6–9 Home, 9–12 selection, 12–13 Start, 13–18 translation, 18–22 second language pair, 22–25 recognition, 25–30 brand. Composition uses its own shot list and portrait geometry.

## Cast and burned-in dialogue

All communication appears as text. No spoken dialogue or vocal samples.

| Cat | Fixed silhouette / markings | Original text | Editorial meaning |
| --- | --- | --- | --- |
| 栗子 / Chinese tabby | Brown stripes, angular ears, cream chest | 新买的猫窝？我选纸箱。 | New bed? I choose the box. |
| Momo / Japanese Bobtail | White calico, split orange/black face, round bobtail | キーボードは、私のベッド。 | The keyboard is my bed. |
| Bori / Korean Shorthair | Warm orange stripes, white chest, long tail | 밥그릇이 비었어. 또. | The bowl is empty. Again. |
| Bean / British Shorthair | Round blue-grey head and body, short rounded ears | New bed? I choose the box. | 新猫窝？我选纸箱。 |
| Bleu / Chartreux | Slate coat, tapered face, copper eyes | Ce rayon de soleil est à moi. | 這束陽光是我的。 |
| Fritz / German Rex | Slim cream body, large ears, repeated curl marks | Noch fünf Minuten schlafen. | Five more minutes of sleep. |

These are authored examples, not claimed model outputs. No flags or national dress. Eight supported language labels come from the app's `src/ui/languages.ts`; characters are not added merely to represent the remaining two interface languages.

## Product grounding and assets

Product reference: sibling `Meowcal-Sub` checkout, `README.md`, `docs/USAGE.md`, `docs/adr/0001-curated-local-translation-stack.md`, `docs/adr/0003-incremental-lit-frontend.md`, `src/ui/languages.ts`, `src/styles/tokens.css`, and selector markup. Documentation confirms Windows 11 public beta, primary-display capture, Windows OCR, local HY-MT inference, and subtitle-text privacy with setup/repair/update network use.

- `public/story/app-home.png` is copied unchanged from `Meowcal-Sub/docs/assets/screenshot-home.png`. It is a real product screenshot; cursor motion is editorial.
- `public/story/app-tokens.css` preserves the referenced product token snapshot. Product shots reuse `Capture.tsx`, `Plate.tsx`, and `Brand.tsx`; optional line/scan inputs let the new film retain their rendering without changing the launch film's defaults.
- `src/story/Cat.tsx` contains all character vectors. `World.tsx` contains all vector landscapes and the parallax planet. No generated or stock images used in this animatic.
- `audio/cat_planet.py` synthesizes every note and effect from code, invoked by `python audio/synth.py --cat-planet`. Both scores share the picture's frame cues. No external samples or CC0 attribution required.
- Source and translation remain visibly separate. The scan and reveal are editorial diagrams; no latency or recognition-success measurement is implied.

## Reproduction

On Windows ARM64 use the existing x64 Node at `C:/tmp/tools/node-v22.20.0-win-x64/node.exe` and Edge at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Do not run the renderer with native ARM64 Node. Keep render concurrency at 1 on this shared workstation.

```powershell
python audio/synth.py --cat-planet
npm run typecheck
& 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe' node_modules/@remotion/cli/remotion-cli.js render CatPlanetStory60 out/story/cat-planet-60-animatic.mp4 --scale=0.3333333333333333 --concurrency=1 --crf=25 --x264-preset=veryfast --browser-executable='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
& 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe' node_modules/@remotion/cli/remotion-cli.js render CatPlanetStory30Vertical out/story/cat-planet-30-animatic.mp4 --scale=0.3333333333333333 --concurrency=1 --crf=25 --x264-preset=veryfast --browser-executable='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
python scripts/story_review.py
```

After approval: refine character acting and cloud contact, continuous camera moves, region depth, lighting, motion blur and final mix; export both requested full-resolution H.264 / 320k AAC stereo masters at -14 LUFS. Review every shot at phone size before final delivery.

## Animatic verification

Both H.264 previews decode fully: 3600 and 1800 frames at 60 fps, stereo AAC at a 320 kbps encoder target. Encoded audio measured -14.08 LUFS / -1.46 dBTP (landscape), -13.97 LUFS / -1.48 dBTP (portrait). TypeScript and Python compilation pass. Contact sheets cover all 19 and 9 shots; title collisions and portrait wrapping were corrected. Product screenshot and token snapshot SHA-256 values match their source files. Original launch-film timeline values are unchanged. Detailed local media metadata is in `out/story/verification.json`.

## Review status

The initial Cat Planet animatic is rejected: the synthetic score, presentation-style layout, and shallow staging do not establish the intended story. It must not be treated as an approved direction.

`TVStoryStudy12` is a silent 12-second direction study. A tabby watches a television in its living room; the camera moves past the viewer into the screen, where a Japanese bobtail rests on a keyboard. The Japanese burned-in subtitle means "This is the warmest place." A cut back to the tabby's restrained reaction establishes the viewer/screen relationship without explanatory titles or punctuation graphics.

This study changes the visual direction and camera grammar only. It does not approve or replace the full 60s/30s deliverable. TV scenes in the eventual product demonstration must clearly use the television as a Windows 11 PC's primary display; the app is not a standalone smart-TV app. No soundtrack from the rejected animatic should be reused.

Browser preview uses VP9 WebM. H.264 displayed black in the actual Codex sidebar even when it played in an automation-created tab; validate the user's actual tab. The original MP4 remains available as a file.

## Style comparison

The living-room / television narrative is approved in direction. Visual style is pending selection between `TVStylePixel12` (pixel art) and `TVStyleCeramic12` (cool grey illustration based on the app palette). Both are silent 12-second studies at 60 fps with the same camera and acting cues in `timeline.json` under `styleStudy`.

The characters, sets, and lighting are SVG artwork in `src/story-tv/styles/`. The viewer's body and paws remain planted; eyes lead the neck turn, followed by a held pose and blink. The bobtail's ribcage breathes independently of its paws, rump, and contact shadow. Camera motion ends before the reaction cut. Pixel poses use discrete offsets; the illustration uses eased neck movement.

Render both compositions at scale 0.5 with x64 Node, Edge, `--concurrency=1 --gl=swangle`, then run `python scripts/story_style_review.py` to create the WebM previews, six-frame contact sheet, media checks, and current `out/story/review.html`. Full production and the replacement score remain pending style selection.
