# 就差这一句 — music and sound

Original composition and sound design: the frame-based score in `drama.py`.
The fictional drama's music uses sustained violin, viola and cello sections,
violin tremolo, timpani, suspended cymbal and harp. The film's own music uses
violin and cello pizzicato, marimba, glockenspiel and harp. Momo's lines and the
viewer's chirp are edited cat recordings; the snore and all foley are procedural.

## Instrument recordings

**Versilian Studios VSCO 2 Community Edition**, by Sam Gossner and Simon
Dalzell, with sample cutting by Elan Hickler, released under **CC0 1.0
Universal**.

- Project: <https://versilian-studios.com/vsco-community/>
- Source: <https://github.com/sgossner/VSCO-2-CE>
- Pinned revision: `440300901dfe9275fd84e0b7763af1f8443ae62e`
- Files, download URLs, measured MIDI roots and SHA-256 hashes:
  `samples/vsco/manifest.json`
- License text: `samples/vsco/LICENSE.txt`

MIDI roots were measured from each recording; filenames in the VSCO tree do not
use one octave convention across instruments.

## Cat recordings

Six recordings from Wikimedia Commons, each marked **CC0** or **public domain**
on its file page. `fetch_drama_samples.py` refuses any file whose license is
not one of those two. Titles, file pages, download URLs, licenses and SHA-256
hashes are in `samples/cats/manifest.json`.

Momo's meowed lines are voiced segments of these recordings, pitched down and
placed on the cue frames in `cat-drama/src/timeline.json` (`dramaFilm.cuts.*.voice`), which
also drive her lip sync. The viewer's questioning chirp is a reversed, trilled
segment. Meows carry no words; the subtitles carry the meaning.

## Rebuild

`python cat-drama/audio/drama.py` (from the repository root) rebuilds one 48 kHz stereo master per cut
(`cat-drama/public/audio/drama-full.wav`, `drama-short.wav`). Every musical section and
narrative sound is anchored to `dramaFilm` shot starts or cue frames. Instrument
notes are explicitly scored; there is no generative music service or random note
selection. A fixed random seed is used only for noise textures in the foley.
