# Meowcal Sub — Read beyond language

**Alternative concept · 2026-09-27.** A separate 15-second cut, kept as its own
project with its own toolchain. The film released as the launch film is in
[`../launch-15s/`](../launch-15s/).

[Watch / download the final MP4](deliverables/Meowcal-Sub-Launch-15s.mp4) ·
[Storyboard](deliverables/storyboard.jpg) ·
[Verification record](deliverables/verification.json)

A 15-second product reveal: a subtitle selection opens into understanding; the screen boundary closes into the Meowcal cat mark.

## Deliverable

`deliverables/Meowcal-Sub-Launch-15s.mp4`: 1920×1080, 60 FPS, 900 frames, exactly 15.000 seconds, H.264/yuv420p, stereo AAC at 48 kHz, fast-start MP4. Original score targets −16 LUFS. No voiceover.

## Preview and render

Node.js, npm and FFmpeg on PATH are required.

```powershell
cd read-beyond-language
npm ci --force
npm run dev
npm run render
```

On Windows ARM64, `--force` allows the pinned x64 Remotion compositor to run through Windows emulation. The render script selects installed Edge or Chrome and supplies the absolute compositor path. Windows x64 can use ordinary `npm ci`. Set `REMOTION_BROWSER` to choose another Chromium executable.

```powershell
npm run render -- MeowcalPortrait
npm run render -- MeowcalSquare
npm run lint
```

Landscape is the reviewed delivery. Portrait and square compositions reflow the layout and are editable starting points; inspect their framing before publication.

## Edit

- `src/scenes/Capture.tsx`: hook, selection, confirmation, start action, translating plate.
- `src/scenes/Local.tsx`: actual Home UI crop and local-processing message.
- `src/scenes/Payoff.tsx`: full-screen viewing and changing subtitle cue.
- `src/scenes/Brand.tsx`: frame closure and original cat mark.
- `src/Film.tsx`: scene timing; all motion derives from frame number.
- `src/Root.tsx`: output dimensions and aspect-ratio compositions.
- `scripts/soundtrack.mjs`: original synthesis and frame-aligned cue times.

Rebuild audio only when changing the score:

```powershell
npm run audio
ffmpeg -y -i public/soundtrack-raw.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 48000 -ac 2 public/soundtrack.wav
```

The normalized WAV is included, so rendering does not require audio regeneration. `ASSETS.md` records asset provenance and the distinction between editorial choreography and native app capture.
