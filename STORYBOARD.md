# Cat Planet

Let cats who speak different languages understand each other's everyday jokes.

## Current production status

The pixel direction continues with further visual refinement needed. The existing full animatics are not approved for production. [DIRECTOR_SCRIPT.md](DIRECTOR_SCRIPT.md) is the current proposal: familiar translated subtitles stop at a cat drama's climax, the viewer uses Meowcal Sub to read the remaining original text, and the grand declaration turns out to be five more minutes of sleep. Script review comes before new boards or animation.

## Existing animatic reference

The material below describes the previous `PixelStory60` and `PixelStory30Vertical` exports, retained as visual reference. They are silent 60-second and 30-second animatics at 60 fps. `out/story/review.html` contains MP4 downloads and WebM browser previews at 960×540 and 540×960.

The opening establishes the world and its viewers. Meowcal Sub appears when a cat needs help reading another cat's subtitles. The final selection box becomes the brand mark; the pixel brand progressively resolves into the existing clean logo and wordmark. This resolution change belongs to the brand ending, not a product feature demonstration.

The page includes one frame per shot, a four-frame brand transition strip, and a separate five-second ending. These exports do not depict the new director script.

## Picture

| Time | Landscape action |
| --- | --- |
| 0–5 | Push toward a small cat-shaped planet with six illuminated homes. |
| 5–10 | A tabby watches a Japanese bobtail's keyboard vlog; move from the room into its television. |
| 10–15 | A Chartreux watches a British cat's cardboard-box vlog; a German Rex watches a Korean cat's empty-bowl vlog. |
| 15–21 | Cut back to two viewers' puzzled, restrained reactions. |
| 21–30 | The tabby watches the British cat's box joke, then reacts to the unfamiliar subtitle. |
| 30–32 | Show the actual App Home screen and select Change. |
| 32–35 | Frame the existing English subtitle and confirm the area. |
| 35–36.5 | Return to Home and start translation. |
| 36.5–40 | Windows OCR scan, local translation, then an equal-width Chinese plate beneath the original. |
| 40–45 | English → French and Korean → German examples. |
| 45–48 | Three viewers understand the jokes; their bodies and paws stay planted. |
| 48–51 | Screens around the planet illuminate in sequence. Connecting paths represent understanding. |
| 51–55 | A cloud reaches for the subtitles; the tabby swats it away. Text stays on the computer. |
| 55–60 | Selection frame becomes the pixel brand; its pixels shrink into the clean brand. Hold the clean ending for two seconds. |

The portrait edit has its own staging: 0–7 conflict, 7–9 App, 9–12 selection, 12–13.5 Start, 13.5–18 translation, 18–21 recognition, 21–24 a second language pair, and 24–30 brand. It is not a center crop.

## Characters

All communication is burned-in text. No spoken dialogue or vocal samples are present.

| Cat | Silhouette / markings | Vlog text |
| --- | --- | --- |
| 栗子 / Chinese tabby | Grey-brown stripes, angular ears, cream muzzle | 买了猫窝，住了纸箱。 |
| Momo / Japanese Bobtail | White calico, split orange/black face, bobtail | ここが、いちばん暖かい。 |
| Bori / Korean Shorthair | Cream coat, orange patches, long tail | 분명 방금 채웠는데. |
| Bean / British Shorthair | Round blue-grey head, short ears, gold eyes | The box was the actual gift. |
| Bleu / Chartreux | Tapered blue face, copper eyes | Cette place est déjà prise. |
| Fritz / German Rex | Slim body, large ears, curl marks | Das Kissen gehört jetzt mir. |

The six cats share reusable SVG drawings in `src/pixel-film/PixelCats.tsx` and `src/story-tv/styles/PixelScene.tsx`. Regional landscapes use hills, rooflines, brick terraces, mansards, and timber framing. No flags or national dress. Subtitle examples are authored copy, not recorded model outputs.

## Product and asset sources

Product references: sibling `Meowcal-Sub/README.md`, `docs/USAGE.md`, accepted ADRs 0001 and 0003, `src/ui/languages.ts`, `src/styles/tokens.css`, and selector markup. The product reads visible text with Windows OCR and translates it with a local model; it requires Windows 11 and the primary display and remains a public beta. The television is a PC display, not a standalone smart-TV application. Setup, repair, and updates may use the network.

- `public/story/app-home.png` is the real product Home screenshot. `PixelSurface` samples it at reduced resolution for the visual style; the cursor is editorial animation.
- `Capture.tsx`, `Plate.tsx`, and `Brand.tsx` retain the existing selection, scan, translation plate, and brand rendering. The original launch film's defaults and timeline remain unchanged.
- `public/pixel-film/brand-{landscape,vertical}.png` are canonical renders of `FinalBrand`, which reuses the existing Brand component and real logo path. The ending samples these images at progressively finer resolution, then displays the component directly.
- All characters and environments are code-drawn SVG. No generated images or stock media are used.
- The animatics are silent. New sound cue frames are stored under `pixelFilm.audio` in `src/timeline.json`; the rejected synthetic score is not used.
- Source text remains separate from the opaque translation plate directly beneath it. The demonstration is edited for story rhythm and does not measure processing latency.

## Reproduction

On this Windows ARM64 workstation use x64 Node and Edge, software rendering, and concurrency 1. Render canonical brand images before rendering the films whenever the ending layout changes.

```powershell
$filmNode = 'C:/tmp/tools/node-v22.20.0-win-x64/node.exe'
$filmEdge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
$filmCli = 'node_modules/@remotion/cli/remotion-cli.js'
& $filmNode node_modules/typescript/bin/tsc --noEmit
& $filmNode $filmCli still PixelBrandLandscape public/pixel-film/brand-landscape.png --frame=0 --gl=swangle --browser-executable=$filmEdge
& $filmNode $filmCli still PixelBrandVertical public/pixel-film/brand-vertical.png --frame=0 --gl=swangle --browser-executable=$filmEdge
& $filmNode $filmCli render PixelStory60 out/story/pixel-story-60.mp4 --scale=0.5 --concurrency=1 --crf=19 --x264-preset=veryfast --gl=swangle --browser-executable=$filmEdge
& $filmNode $filmCli render PixelStory30Vertical out/story/pixel-story-30.mp4 --scale=0.5 --concurrency=1 --crf=19 --x264-preset=veryfast --gl=swangle --browser-executable=$filmEdge
python scripts/pixel_review.py
```

`pixel_review.py` checks continuous shot coverage, exact duration and frame count, 60 fps H.264, silent streams, full WebM decoding, and the final frame's agreement with the clean brand. It generates 20 landscape and 9 portrait shot stills, contact sheets, the ending excerpt, and the review page. Results are stored in `out/story/pixel-verification.json`.

The browser previews use VP9 WebM because H.264 previously displayed black in the Codex sidebar. Older reference pages remain at `style-review.html`, `tv-study.html`, and `review-v1.html`; their audio and visual decisions do not supersede this storyboard.

Final delivery still requires a new original score and effects aligned to the shared timeline, stereo AAC at a 320 kbps encoder target, measured -14 LUFS, full-size exports, and a final phone-size readability check.
