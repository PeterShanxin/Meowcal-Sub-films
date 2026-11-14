# Recorded instrument provenance

Every WAV in `scripts/instrument-bank.json` is CC0-1.0 and pinned to an exact
commit; the downloader checks each file's Git blob SHA-1.

- **VCSL**, Versilian Community Sample Library, by Versilian Studios / Sam
  Gossner and contributors: https://github.com/sgossner/VCSL , commit
  `c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e`. Steinway B piano (Sus and NoSus),
  concert bass drum, snare, rim, roll, claps, hi-hat, shaker, tambourine, tom,
  suspended cymbal (crash and swells), glockenspiel and bell tree. The README
  releases the samples under CC0.
- **VSCO 2 Community Edition**, by Versilian Studios:
  https://github.com/sgossner/VSCO-2-CE , commit
  `440300901dfe9275fd84e0b7763af1f8443ae62e`. Solo contrabass pizzicato,
  cello, viola and violin section sustains, and the muted kick. Recorded by Sam
  Gossner and Simon Dalzell; cutting by Elan Hickler. License:
  https://github.com/sgossner/VSCO-2-CE/blob/440300901dfe9275fd84e0b7763af1f8443ae62e/LICENSE

## Pitch conventions already corrected in the manifest

- VSCO string and contrabass filenames name pitches one octave below
  scientific pitch; manifest roots are the sounding pitch.
- VCSL glockenspiel files sound an octave above their names; roots are the
  sounding pitch (G4 file = MIDI 79).

No third-party melody or finished song is bundled. The license does not imply
endorsement by the sample creators. Keep this file when copying the scripts
into a project; CC0 does not require attribution, but a credits line in the
film's README is good practice. Say "recorded instrument samples arranged in
code", not "live performance".
