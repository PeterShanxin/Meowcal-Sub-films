# 同一件事，交给两个 AI — Astra vs Fable 5.2

A portrait film of about 150 seconds that shows one AI after the other. The
user texts Astra a few casual messages; Astra answers 「Battle，接了。」, shows a
progress bar while it works, and posts 「做好了。」 with its [`reading-test`](../reading-test/)
cut as a video card, which is tapped and opens full screen with its own sound. The film settles back into the chat, the screen
switches to Fable 5.2, and the user texts much the same request; Fable
answers 「收到，这条我来定。」. Fable's v3 (一则寓言) plays through, is
marked 「来回改了几版，还是不满意。」 and stamped PASS, and is thrown out of
the chat. The user's complaint is typed, Fable answers 「收到。重来。」, and v4
(五部生肉) plays full screen with its own sound. v4 then shrinks into the
right half of a choice screen beside Astra's film: 「你选哪边？」,
「两边的表现，你怎么看？」, typed and then deleted for the user's own takeaway,
then the brand.

## Deliverables

| File | Frame |
| --- | --- |
| `out/fable-vs-astra-v10.mp4` | 1080 × 1920, 60 fps, H.264, AAC 48 kHz |
| `out/cover.png` | 1080 × 1440 cover |

`out/`, `public/clips/` and the generated `public/audio/*.wav` are not committed (the reproduce steps rebuild them). Commands run from the repository root.

## Reproduce

```powershell
npm ci
python fable-vs-astra/scripts/fetch_clips.py
python fable-vs-astra/audio/build.py
node fable-vs-astra/audio/score/render-score.mjs fable-vs-astra/audio/score.json fable-vs-astra/public/audio/sfx.wav
npm run typecheck
npm run studio:fable-vs-astra
npm run render:fable-vs-astra
# Remotion's AAC lands ~42 ms late here; check-sync measures it. Shift it back:
ffmpeg -i fable-vs-astra/out/fable-vs-astra-v10.mp4 -map 0:v -map 0:a -c:v copy -af "atrim=start=0.042,asetpts=PTS-STARTPTS" -c:a aac -b:a 320k fable-vs-astra/out/fable-vs-astra-v10-sync.mp4
node fable-vs-astra/audio/score/check-sync.mjs fable-vs-astra/out/fable-vs-astra-v10-sync.mp4 fable-vs-astra/audio/score.json --ffmpeg ffmpeg
npm run cover:fable-vs-astra
```

`node fable-vs-astra/scripts/stills.mjs <frame> ...` writes half-size frames
to `out/stills/`.

## Edit

| File | Owns |
| --- | --- |
| `src/timeline.json` | Every message, reply and on-screen line; typing speeds; clip lengths. |
| `audio/build.py` | The one clock: types every message with humanised timing, schedules replies, the working state, the video card, the tap and the ending, and writes `src/cues.json`, `public/audio/keys.wav` and the stamp score. Rerun after any timeline change. |
| `audio/score/` | Copy of the acoustic-score renderer (used only for the stamp), with sample provenance. |
| `src/Chat.tsx` | The chat window: header, bubbles, typing, reply. |
| `src/Film.tsx` | Astra scene, swap, Fable scene (v3, PASS, complaint, v4), choice screen, score and typing volume. |
| `src/index.tsx` | Composition registration and the cover. |

## Sound

There is no music. The chats and the ending are carried by recorded typing
alone: one keypress per character with humanised timing, a heavier key on
send, a light key as the tap on a video card, backspaces when the ending's
question is deleted (`audio/keys/`, CC0). The films play with their own
soundtracks (v3 included). The only other sound is the
PASS stamp, one recorded concert bass drum and clap (`audio/score.json`,
rendered with the acoustic-score renderer in `audio/score/`).

## Accuracy

The messages are a shortened, casual restatement of the real prompts, not the
exact text. The chat window is a generic drawing, not either product's
interface, and the agents' replies are written for the film. The films are the
released cuts; v3 is shown from 1.0 s to its end, with its sound.

## Assets

The three films are this repository's own release assets (see their READMEs
for provenance). The Meowcal Sub mark is `docs/assets/mark.svg` from the app
repository under its [brand terms](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
Instrument samples are CC0 (VCSL and VSCO 2 CE), pinned by hash; see
`audio/score/PROVENANCE.md`. Keyboard samples are CC0 from OpenGameArt; see
`audio/keys/PROVENANCE.md`.
