# Meowcal Sub films

Promotional and launch films for [Meowcal Sub](https://github.com/PeterShanxin/Meowcal-Sub).
Each film lives in its own folder with its own README, source, score and
render instructions. Picture and sound are generated from code and share one
frame-based timeline per film.

## Films

| Folder | Film | Cuts | Status |
| --- | --- | --- | --- |
| [`launch-15s/`](launch-15s/) | Launch film: the capture box is the whole film. | 15 s, landscape, vertical and square | Released: [v1.0.0](https://github.com/PeterShanxin/Meowcal-Sub-films/releases/tag/v1.0.0) |
| [`cat-drama/`](cat-drama/) | 就差这一句: cats watch a melodrama, the translation drops out at the climax, and Meowcal Sub reads the subtitle. | 60 s landscape and portrait, 30 s portrait, English 60 s | Released: [cat-drama-v1.0.0](https://github.com/PeterShanxin/Meowcal-Sub-films/releases/tag/cat-drama-v1.0.0) |
| [`read-beyond-language/`](read-beyond-language/) | Read beyond language: a subtitle selection opens into understanding. | 15 s | Alternative concept, kept as its own project |
| [`early-launch/`](early-launch/) | Earlier launch video, preserved for reference. | 15 s | Needs improvement |

## Working in this repository

`launch-15s/` and `cat-drama/` are Remotion projects that share one toolchain at
the repository root (`package.json`, `remotion.config.ts`, `tsconfig.json`).
`read-beyond-language/` has its own `package.json` and installs separately.
Run everything from the repository root:

```bash
npm ci
npm run typecheck
npm run studio:15s
npm run studio:cat-drama
```

Rendering, audio and asset details are in each film's README. Videos rendered
from the shared toolchain go to a git-ignored `out/` inside the film's folder and
are published as release assets, not committed.

`cat-drama/` reuses the selection box, translation plate and brand lockup from
`launch-15s/src/film/`, so changes there affect both films.

## Adding a film

Create a top-level folder with a `README.md`, a `src/index.ts` that registers its
compositions, and a `public/` directory. Add `studio:<name>` and audio scripts to
`package.json` with `--public-dir=<name>/public`, and add `<name>/src` to
`tsconfig.json`. Keep timeline, score and review scripts inside the folder.

## License

Source is licensed under [AGPL-3.0-only](LICENSE), as for Meowcal Sub. The license
does not grant rights to the Meowcal Sub name or logo; see the app’s
[trademark policy](https://github.com/PeterShanxin/Meowcal-Sub/blob/main/TRADEMARKS.md).
Asset provenance is recorded in each film's README; `read-beyond-language/`
keeps its own license notices in `licenses/`.
