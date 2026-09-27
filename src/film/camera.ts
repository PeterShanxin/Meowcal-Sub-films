import type { Layout } from "./layout";
import { ease, mix, shake, sp, tween } from "./motion";
import { T } from "./timeline";

export interface Camera {
  // World point placed at the centre of the frame.
  cx: number;
  cy: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
}

const MACRO_SCALE = 4.6;
const PERSPECTIVE = 2600;
// A narrow portrait frame cannot take the wide swing: the front layers would
// fan out past its left edge.
const EXPLODED = { scale: 0.47, rx: -12, ry: -28 };
const EXPLODED_PORTRAIT = { scale: 0.6, rx: -12, ry: -16 };

function baseCamera(f: number, L: Layout): Camera {
  const { W, H, box } = L;
  const text = { x: W / 2, y: box.y + box.h / 2 };
  const home = { x: W / 2, y: H / 2 };

  // Hook: start inside the glyphs, then snap back to the full frame.
  const pull = tween(f, [T.hook.pullbackStart, T.hook.pullbackEnd], [0, 1], ease.out);
  const macroDrift = tween(f, [0, T.hook.pullbackStart], [0, 1], ease.linear);
  let cam: Camera = {
    cx: mix(text.x + 60 * L.u - macroDrift * 12 * L.u, home.x, pull),
    cy: mix(text.y, home.y, pull),
    // Interpolate zoom in log space so the pull-back reads as constant speed.
    scale: Math.exp(mix(Math.log(MACRO_SCALE), 0, pull)),
    rx: 0,
    ry: 0,
    rz: mix(-2.5, 0, pull),
  };

  // Magic moment: a slow push onto the subtitle pair.
  const push = tween(f, [T.hook.pullbackEnd, T.magic.drop + 100], [0, 1], ease.inOut);
  const creep = tween(f, [T.magic.drop + 100, T.payoff.start], [0, 1], ease.linear);
  cam = {
    ...cam,
    cx: mix(cam.cx, L.pairCenter.x, push),
    cy: mix(cam.cy, L.pairCenter.y, push),
    scale: cam.scale * mix(1, L.pairZoom, push) * (1 + 0.05 * creep),
  };

  // Montage: a small punch-in on every cut keeps the locked-off frame alive.
  for (const cut of T.montage.cuts) {
    const t = f - cut;
    if (t >= 0 && t < 14) cam.scale *= 1 + 0.018 * (1 - t / 14) ** 2;
  }

  // Payoff: swing into an exploded 3D view, then fall back flat for the logo.
  const explode = sp(f, T.payoff.start, { damping: 20, stiffness: 70, mass: 1.1 });
  const orbit = tween(f, [T.payoff.start + 40, T.payoff.collapse], [0, 1], ease.linear);
  const flatten = sp(f, T.payoff.collapse, { damping: 22, stiffness: 150 });
  const k = explode * (1 - flatten);
  const view = L.portrait ? EXPLODED_PORTRAIT : EXPLODED;
  const target = { x: W / 2 - (L.portrait ? 170 : 260) * L.u, y: H / 2 - 60 * L.u };
  cam = {
    cx: mix(mix(cam.cx, target.x, explode), home.x, flatten),
    cy: mix(mix(cam.cy, target.y, explode), home.y, flatten),
    scale: mix(mix(cam.scale, view.scale * (1 + 0.05 * orbit), explode), 1, flatten),
    rx: view.rx * k,
    ry: (view.ry - (L.portrait ? 3 : 6) * orbit) * k,
    rz: cam.rz,
  };
  return cam;
}

export function camera(f: number, L: Layout): Camera & { blur: number; shakeX: number; shakeY: number } {
  const cam = baseCamera(f, L);
  const before = baseCamera(f - 0.5, L);
  const after = baseCamera(f + 0.5, L);
  const zoomVelocity = Math.abs(Math.log(after.scale / before.scale));
  const panVelocity = Math.hypot(after.cx - before.cx, after.cy - before.cy) * cam.scale;
  const blur = Math.min(10 * L.u, zoomVelocity * 55 * L.u + panVelocity * 0.06);

  const [ax, ay] = shake(f, T.magic.drop, 6 * L.u);
  const [bx, by] = shake(f, T.payoff.start, 10 * L.u, 24);
  const [cx, cy] = shake(f, T.payoff.statement, 7 * L.u);
  return { ...cam, blur, shakeX: ax + bx + cx, shakeY: ay + by + cy };
}

// Where a world point on a plane lifted by z lands on screen: the same chain
// worldTransform builds, evaluated by hand so HUD labels can track 3D layers.
export function project(
  cam: Camera & { shakeX: number; shakeY: number },
  L: Layout,
  x: number,
  y: number,
  z: number,
): { x: number; y: number } {
  const rad = Math.PI / 180;
  let X = (x - cam.cx) * cam.scale;
  let Y = (y - cam.cy) * cam.scale;
  let Z = z;
  [X, Y] = [X * Math.cos(cam.rz * rad) - Y * Math.sin(cam.rz * rad), X * Math.sin(cam.rz * rad) + Y * Math.cos(cam.rz * rad)];
  [X, Z] = [X * Math.cos(cam.ry * rad) + Z * Math.sin(cam.ry * rad), -X * Math.sin(cam.ry * rad) + Z * Math.cos(cam.ry * rad)];
  [Y, Z] = [Y * Math.cos(cam.rx * rad) - Z * Math.sin(cam.rx * rad), Y * Math.sin(cam.rx * rad) + Z * Math.cos(cam.rx * rad)];
  const w = 1 - Z / (PERSPECTIVE * L.u);
  return { x: L.W / 2 + cam.shakeX + X / w, y: L.H / 2 + cam.shakeY + Y / w };
}

export function worldTransform(cam: Camera & { shakeX: number; shakeY: number }, L: Layout): string {
  return [
    `translate(${L.W / 2 + cam.shakeX}px, ${L.H / 2 + cam.shakeY}px)`,
    `perspective(${PERSPECTIVE * L.u}px)`,
    `rotateX(${cam.rx}deg)`,
    `rotateY(${cam.ry}deg)`,
    `rotateZ(${cam.rz}deg)`,
    `scale(${cam.scale})`,
    `translate(${-cam.cx}px, ${-cam.cy}px)`,
  ].join(" ");
}
