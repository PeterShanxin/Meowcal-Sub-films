# Asset provenance

- `public/home.png`: unchanged Meowcal Sub Home screenshot from `docs/assets/screenshot-home.png`, repository commit `0df43b6`. The film crops the language controls, selected region, Start translation button and Local processing status.
- `public/logo.svg`: repository brand asset. The animated cat path in `src/motion.tsx` copies the mark geometry from this SVG. Trademark terms are retained in `licenses/Meowcal-trademarks.md`.
- `public/ferry.png`: original fictional scenery generated for this film with the built-in image generation tool. No movie or stock footage is used. Prompt below.
- `public/soundtrack.wav`: original procedural stereo score and effects, 48 kHz. All oscillators and noise are synthesized by `scripts/soundtrack.mjs`; no sampled recordings, songs or third-party sound library.
- Inter and Noto Sans SC: npm-distributed fonts, SIL OFL 1.1. License texts are in `licenses/`.
- `public/grain.svg`: procedural texture.

## Scene prompt

Original cinematic film still, wide 16:9. A solitary small passenger ferry with warm amber cabin windows moving across an immense deep navy sea just before sunrise, distant jagged mountainous islands in layered fog, muted icy cyan dawn sky, horizon at 38 percent height. Ferry at x=67 percent, y=50 percent, 16 percent width. Low camera near water, long silvery wake toward lower left. Deep nearly black water in bottom 35 percent for subtitles. Photorealistic atmosphere, restrained color, negative space, anamorphic film photography, fine detail and subtle grain. No text, subtitles, logos, watermarks or UI. Original fictional scenery, not from an existing movie.

## Product truth

The film depicts selecting visible English subtitles, starting local OCR/translation, and reading a Chinese floating overlay. Both language options, area selection, the start action, the opaque dark plate and local processing are implemented in the product. Copy and appearance were checked against README, `src/ui/home-view.ts`, `src/styles/selector.css`, `src/styles/overlay.css` and `src/styles/tokens.css` at `0df43b6`.

Selector, pointer, button-to-plate transition and subtitle timing are presentation choreography, not a native capture recording or latency benchmark. The film does not depict speech transcription, subtitle search, cloud translation or automatic subtitle-file discovery. The second fictional cue, “This is only the beginning.” / “这才刚刚开始。”, demonstrates the existing updating-overlay behavior.
