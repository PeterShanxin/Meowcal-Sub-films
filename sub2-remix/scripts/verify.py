"""Measure a rendered film and write out/qc.json.

    python sub2-remix/scripts/verify.py sub2-remix/out/<film>.mp4

Probes the streams, decodes the whole file, measures EBU R128 loudness and
true peak, and records the SHA-256. Exits non-zero if the file is not the
release format. Needs FFmpeg and FFprobe on PATH.
"""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

EXPECT = {"codec_name": "h264", "width": 1080, "height": 1920, "pix_fmt": "yuv420p", "r_frame_rate": "60/1"}


def run(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def main() -> None:
    film = Path(sys.argv[1])
    probe = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(film)]).stdout)
    video = next(s for s in probe["streams"] if s["codec_type"] == "video")
    audio = next(s for s in probe["streams"] if s["codec_type"] == "audio")
    decode = run(["ffmpeg", "-v", "error", "-i", str(film), "-f", "null", "-"])
    meter = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(film), "-map", "0:a", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    summary = meter[meter.rindex("Summary:"):]
    number = lambda label: float(re.search(label + r":\s+(-?[\d.]+)", summary).group(1))  # noqa: E731

    qc = {
        "file": film.name,
        "bytes": film.stat().st_size,
        "sha256": hashlib.sha256(film.read_bytes()).hexdigest(),
        "seconds": round(float(probe["format"]["duration"]), 3),
        "video": {k: video.get(k) for k in ("codec_name", "profile", "width", "height", "pix_fmt", "r_frame_rate", "nb_frames", "color_space", "color_transfer", "color_primaries", "color_range")},
        "audio": {k: audio.get(k) for k in ("codec_name", "sample_rate", "channels", "channel_layout", "bit_rate")},
        "fullDecodeErrors": decode.stderr.strip() or None,
        "integratedLufs": number("I"),
        "loudnessRangeLu": number("LRA"),
        "truePeakDbtp": number("Peak"),
    }
    out = film.parent / "qc.json"
    out.write_text(json.dumps(qc, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(qc, indent=2))

    problems = [f"{k}: {video.get(k)}" for k, v in EXPECT.items() if video.get(k) != v]
    if audio["codec_name"] != "aac" or audio["sample_rate"] != "48000" or audio["channels"] != 2:
        problems.append("audio is not AAC stereo 48 kHz")
    if video.get("color_space") != "bt709":
        problems.append(f"color_space: {video.get('color_space')}")
    if decode.returncode or decode.stderr.strip():
        problems.append("decode errors")
    if not -15 <= qc["integratedLufs"] <= -13:
        problems.append(f"loudness {qc['integratedLufs']} LUFS")
    if qc["truePeakDbtp"] > -1:
        problems.append(f"true peak {qc['truePeakDbtp']} dBTP")
    if problems:
        sys.exit("NOT RELEASE FORMAT: " + "; ".join(problems))


if __name__ == "__main__":
    main()
