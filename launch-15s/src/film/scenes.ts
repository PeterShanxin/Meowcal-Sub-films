import { T } from "./timeline";

export interface Line {
  source: string;
  translation: string;
}

export interface Scene {
  backdrop: string;
  source: string;
  target: string;
  lines: readonly Line[];
  // Mirrors the app's Subtitle style setting: Light suits bright scenes.
  plate: "dark" | "light";
}

export const HERO: Scene = {
  backdrop: "harbor",
  source: "ja-JP",
  target: "en-US",
  plate: "dark",
  lines: [
    { source: "最終便は、夜明け前に出る。", translation: "The last ferry leaves before sunrise." },
    { source: "急げば、まだ間に合う。", translation: "If we hurry, we can still make it." },
  ],
};

// One scene per montage cut, in cut order. The first half translates into
// English; the second half turns the pair around to show any direction works.
export const MONTAGE: readonly Scene[] = [
  { backdrop: "neon", source: "ko-KR", target: "en-US", plate: "dark", lines: [{ source: "우리 다시 만날 수 있을까?", translation: "Will we ever meet again?" }] },
  { backdrop: "paris", source: "fr-FR", target: "en-US", plate: "dark", lines: [{ source: "Ne te retourne pas. Cours !", translation: "Don't look back. Run!" }] },
  { backdrop: "lantern", source: "zh-CN", target: "en-US", plate: "dark", lines: [{ source: "这座城市从来不睡觉。", translation: "This city never sleeps." }] },
  { backdrop: "coast", source: "es-ES", target: "en-US", plate: "dark", lines: [{ source: "Aún no es demasiado tarde.", translation: "It's not too late yet." }] },
  { backdrop: "snow", source: "de-DE", target: "en-US", plate: "light", lines: [{ source: "Der Winter kommt dieses Jahr früher.", translation: "Winter is coming early this year." }] },
  { backdrop: "stars", source: "en-US", target: "zh-CN", plate: "dark", lines: [{ source: "We were never alone out here.", translation: "我们在这里从不孤单。" }] },
  { backdrop: "sakura", source: "en-US", target: "ja-JP", plate: "dark", lines: [{ source: "Meet me under the cherry trees.", translation: "桜の木の下で会おう。" }] },
  { backdrop: "deep", source: "en-US", target: "ko-KR", plate: "dark", lines: [{ source: "Hold your breath. Dive.", translation: "숨 참고, 뛰어들어." }] },
  { backdrop: "forest", source: "en-US", target: "es-ES", plate: "dark", lines: [{ source: "Follow the light.", translation: "Sigue la luz." }] },
  { backdrop: "golden", source: "en-US", target: "fr-FR", plate: "dark", lines: [{ source: "This is where it all begins.", translation: "C'est ici que tout commence." }] },
];

export interface SceneAt {
  scene: Scene;
  line: Line;
  // Frame the current scene's footage started (its whip-in begins here).
  sceneStart: number;
  previous: { scene: Scene; line: Line; start: number } | null;
}

export function sceneAt(frame: number): SceneAt {
  const cuts = T.montage.cuts;
  let index = -1;
  for (let i = 0; i < cuts.length; i++) if (frame >= cuts[i]) index = i;

  if (index < 0) {
    const second = frame >= T.magic.line2;
    return {
      scene: HERO,
      line: HERO.lines[second ? 1 : 0],
      sceneStart: 0,
      previous: null,
    };
  }

  const scene = MONTAGE[index];
  const prevScene = index === 0 ? HERO : MONTAGE[index - 1];
  const prevLine = index === 0 ? HERO.lines[1] : prevScene.lines[0];
  return {
    scene,
    line: scene.lines[0],
    sceneStart: cuts[index],
    previous: { scene: prevScene, line: prevLine, start: index === 0 ? 0 : cuts[index - 1] },
  };
}

// How long a cut's whip pan takes: the accelerating tail of the montage whips faster.
export function whipLength(cut: number): number {
  const cuts = T.montage.cuts;
  const i = cuts.indexOf(cut);
  const next = i >= 0 && i + 1 < cuts.length ? cuts[i + 1] : T.payoff.start;
  return next - cut <= 15 ? 5 : 7;
}
