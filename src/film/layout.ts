export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layout {
  W: number;
  H: number;
  // One design pixel at 1080p; every size scales from it.
  u: number;
  portrait: boolean;
  box: Rect;
  plate: Rect;
  sourceSize: number;
  plateTextSize: number;
  // Where the camera centres on the subtitle pair during the hero push-in.
  pairCenter: { x: number; y: number };
  pairZoom: number;
}

// Geometry for any aspect ratio. The subtitle pair always sits in the lower
// part of the frame, like real subtitles, and the camera does the framing.
export function layout(W: number, H: number): Layout {
  const portrait = H > W;
  const u = Math.min(W, H) / 1080;
  const boxW = Math.min(1180 * u, W * 0.9);
  const boxH = 116 * u;
  const boxY = portrait ? H * 0.6 : H * 0.626;
  const box = { x: (W - boxW) / 2, y: boxY, w: boxW, h: boxH };
  const plate = { x: box.x, y: box.y + box.h + 14 * u, w: boxW, h: 100 * u };
  const pairTop = box.y;
  const pairBottom = plate.y + plate.h;
  return {
    W,
    H,
    u,
    portrait,
    box,
    plate,
    sourceSize: 62 * u,
    plateTextSize: 50 * u,
    pairCenter: { x: W / 2, y: (pairTop + pairBottom) / 2 - 40 * u },
    pairZoom: portrait ? 0.98 : 1.22,
  };
}
