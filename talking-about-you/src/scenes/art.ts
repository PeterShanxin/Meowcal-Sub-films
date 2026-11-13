// Deterministic pseudo-random in [0, 1): every frame must draw the same scene.
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
