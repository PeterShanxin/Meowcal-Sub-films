import { spawnSync } from "node:child_process";

export function masterAudio(ffmpeg, input, output) {
  const run = (args) => {
    const result = spawnSync(ffmpeg, ["-hide_banner", "-nostdin", ...args], {
      encoding: "utf8",
      maxBuffer: 8e6,
      windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stderr;
  };
  const measure = (file) => {
    const log = run([
      "-i",
      file,
      "-af",
      "loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json",
      "-f",
      "null",
      "-",
    ]);
    const match = log.match(/\{\s*"input_i"[\s\S]*?\}/);
    if (!match) throw new Error("FFmpeg did not return loudness measurements");
    return JSON.parse(match[0]);
  };
  const m = measure(input);
  const filter = `loudnorm=I=-16:TP=-1.5:LRA=9:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
  run([
    "-y",
    "-i",
    input,
    "-af",
    filter,
    "-ar",
    "48000",
    "-ac",
    "2",
    "-c:a",
    "pcm_s16le",
    output,
  ]);
  return measure(output);
}
