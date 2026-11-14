import { readFileSync, writeFileSync } from "node:fs";

// PCM/IEEE-float WAV reader. Keep recorded attacks, stereo image and decay intact.
export function readWave(path) {
  const b = readFileSync(path);
  if (
    b.toString("ascii", 0, 4) !== "RIFF" ||
    b.toString("ascii", 8, 12) !== "WAVE"
  )
    throw new Error(`Not a RIFF WAV: ${path}`);
  let format, channels, rate, bits, block, data;
  for (let p = 12; p + 8 <= b.length; ) {
    const id = b.toString("ascii", p, p + 4),
      size = b.readUInt32LE(p + 4),
      start = p + 8;
    if (id === "fmt ") {
      format = b.readUInt16LE(start);
      channels = b.readUInt16LE(start + 2);
      rate = b.readUInt32LE(start + 4);
      block = b.readUInt16LE(start + 12);
      bits = b.readUInt16LE(start + 14);
      if (format === 65534) format = b.readUInt16LE(start + 24);
    }
    if (id === "data")
      data = b.subarray(start, Math.min(start + size, b.length));
    p = start + size + (size % 2);
  }
  if (!data || ![1, 3].includes(format) || ![16, 24, 32].includes(bits))
    throw new Error(`Unsupported WAV: ${path}`);
  const frames = Math.floor(data.length / block),
    left = new Float32Array(frames),
    right = new Float32Array(frames);
  const sample = (p) =>
    format === 3
      ? data.readFloatLE(p)
      : bits === 16
        ? data.readInt16LE(p) / 32768
        : bits === 24
          ? data.readIntLE(p, 3) / 8388608
          : data.readInt32LE(p) / 2147483648;
  let peak = 0;
  for (let i = 0; i < frames; i++) {
    left[i] = sample(i * block);
    right[i] = channels === 1 ? left[i] : sample(i * block + bits / 8);
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }
  return { left, right, rate, peak };
}

export function createMixer(seconds, rate = 48000) {
  const length = Math.round(seconds * rate),
    left = new Float64Array(length),
    right = new Float64Array(length),
    sendLeft = new Float64Array(length),
    sendRight = new Float64Array(length);
  const add = (
    wave,
    {
      at = 0,
      midi = 60,
      root = 60,
      gain = 0.2,
      hold = 2,
      release = 0.35,
      pan = 0,
      attack = 0.0015,
      sampleOffset = 0,
      swell = 0,
      crescendo = 0,
      send = 0,
    } = {},
  ) => {
    const step = (wave.rate / rate) * 2 ** ((midi - root) / 12),
      start = Math.round(at * rate);
    const offset = Math.round(sampleOffset * wave.rate);
    const duration = Math.min(
      (wave.left.length - offset) / step,
      (hold + release) * rate,
    );
    const scale = gain / Math.max(0.05, wave.peak);
    const lGain = scale * Math.sqrt(1 - Math.max(0, pan)),
      rGain = scale * Math.sqrt(1 + Math.min(0, pan));
    for (let i = 0; i < duration; i++) {
      const dest = start + i;
      if (dest < 0 || dest >= length) continue;
      const pos = offset + i * step,
        k = Math.floor(pos),
        f = pos - k;
      if (k + 1 >= wave.left.length) break;
      const t = i / rate,
        tail =
          t <= hold
            ? 1
            : Math.cos((Math.min(1, (t - hold) / release) * Math.PI) / 2) ** 2;
      const onset = Math.sin((Math.min(1, t / attack) * Math.PI) / 2) ** 2;
      const phrase =
        (1 - swell + swell * Math.sin(Math.min(1, t / hold) * Math.PI)) *
        // Rolls and swells rise toward the downbeat they lead into.
        (crescendo ? Math.min(1, t / hold) ** crescendo : 1);
      const envelope = tail * onset * phrase,
        l = (wave.left[k] * (1 - f) + wave.left[k + 1] * f) * lGain * envelope,
        r =
          (wave.right[k] * (1 - f) + wave.right[k + 1] * f) * rGain * envelope;
      left[dest] += l;
      right[dest] += r;
      sendLeft[dest] += l * send;
      sendRight[dest] += r * send;
    }
  };
  // Freeverb-style hall fed by each note's send level, so pedal piano and
  // percussion share one space while kick and bass stay dry.
  const hall = ({
    wet = 0.3,
    size = 0.82,
    damp = 0.32,
    predelay = 0.018,
  } = {}) => {
    const scaleDelay = (n) => Math.round((n * rate) / 44100);
    const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],
      allpasses = [556, 441, 341, 225];
    const pre = Math.round(predelay * rate);
    const channel = (input, spread) => {
      const out = new Float64Array(length);
      for (const n of combs) {
        const d = scaleDelay(n + spread),
          buffer = new Float64Array(d);
        let filter = 0;
        for (let i = 0, p = 0; i < length; i++, p = (p + 1) % d) {
          const y = buffer[p];
          filter = y * (1 - damp) + filter * damp;
          buffer[p] = (i >= pre ? input[i - pre] : 0) * 0.015 + filter * size;
          out[i] += y;
        }
      }
      for (const n of allpasses) {
        const d = scaleDelay(n + spread),
          buffer = new Float64Array(d);
        for (let i = 0, p = 0; i < length; i++, p = (p + 1) % d) {
          const b = buffer[p],
            x = out[i];
          buffer[p] = x + b * 0.5;
          out[i] = b - x;
        }
      }
      return out;
    };
    const l = channel(sendLeft, 0),
      r = channel(sendRight, 23);
    for (let i = 0; i < length; i++) {
      left[i] += l[i] * wet;
      right[i] += r[i] * wet;
    }
  };
  const save = (path, headroom = 0.79) => {
    let peak = 0;
    const fade = Math.round(rate * 1.5);
    for (let i = length - fade; i < length; i++) {
      const g = Math.sin((((length - 1 - i) / fade) * Math.PI) / 2) ** 2;
      left[i] *= g;
      right[i] *= g;
    }
    for (let i = 0; i < length; i++)
      peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
    const scale = headroom / Math.max(peak, 0.00001),
      out = Buffer.alloc(44 + length * 4);
    out.write("RIFF", 0);
    out.writeUInt32LE(out.length - 8, 4);
    out.write("WAVEfmt ", 8);
    out.writeUInt32LE(16, 16);
    out.writeUInt16LE(1, 20);
    out.writeUInt16LE(2, 22);
    out.writeUInt32LE(rate, 24);
    out.writeUInt32LE(rate * 4, 28);
    out.writeUInt16LE(4, 32);
    out.writeUInt16LE(16, 34);
    out.write("data", 36);
    out.writeUInt32LE(length * 4, 40);
    for (let i = 0; i < length; i++) {
      out.writeInt16LE(
        Math.round(Math.max(-1, Math.min(1, left[i] * scale)) * 32767),
        44 + i * 4,
      );
      out.writeInt16LE(
        Math.round(Math.max(-1, Math.min(1, right[i] * scale)) * 32767),
        46 + i * 4,
      );
    }
    writeFileSync(path, out);
    return {
      seconds,
      rate,
      peakDb: 20 * Math.log10(headroom),
      mixPeakDb: 20 * Math.log10(Math.max(peak, 0.00001)),
    };
  };
  return { add, hall, save };
}
