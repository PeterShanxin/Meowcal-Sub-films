# 就差这一句 — music and sound

Original composition and sound design: the frame-based score in `drama.py`.
The arrangement uses violin pizzicato, cello pizzicato and bowed cello,
marimba, and glockenspiel. The post-reveal silence is intentional. There are
no spoken voices, vocal samples, or cat recordings.

Instrument recordings: **Versilian Studios VSCO 2 Community Edition**, by
Sam Gossner and Simon Dalzell, with sample cutting by Elan Hickler. The source
samples are released under **CC0 1.0 Universal**.

- Project: <https://versilian-studios.com/vsco-community/>
- Source: <https://github.com/sgossner/VSCO-2-CE>
- Pinned revision: `440300901dfe9275fd84e0b7763af1f8443ae62e`
- Exact six files, download URLs, detected MIDI roots, and SHA-256 hashes:
  `samples/vsco/manifest.json`
- License text: `samples/vsco/LICENSE.txt`

Sample filenames use an octave convention one below scientific pitch
notation. The score's root metadata accounts for that difference; the low
violin sample has a strong second harmonic.

Mouse clicks, air movement, cloth, the pillow, cloud tap, and snack crunch
are procedural foley made by `drama.py`. No external SFX library is used.

`python audio/synth.py --drama` rebuilds both 48 kHz stereo masters. Every
musical section and narrative sound is anchored to `dramaFilm` shot starts
or cue frames in `src/timeline.json`. Instrument notes are explicitly scored;
there is no generative music service or random note selection. A fixed random
seed is used only for noise textures in the foley.
