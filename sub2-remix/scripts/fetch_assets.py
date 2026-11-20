"""Fetch and verify the third-party material this film needs, then cut every
clip into the frame sequences the composition reads.

    python sub2-remix/scripts/fetch_assets.py

Everything written here is git-ignored: public/fonts/*.ttf, public/frames/,
out/source/. Hashes are pinned in assets.json; a mismatch stops the build.
Needs FFmpeg on PATH (or the FFMPEG environment variable). Sintel is a
1.2 GB download.

Each clip becomes public/frames/<clip>/f0000.jpg ... at 24 fps, cropped to the
2.4:1 centre of its source and scaled to 1440 x 600 (the cinema window shows
the middle 1080 x 600 of it). Cold-open clips ("tall") are cut to 4:5 instead,
1080 x 1350, around the clip's horizontal focus.
"""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = json.loads((ROOT / "scripts" / "assets.json").read_text(encoding="utf-8"))
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FPS = 24


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def fetch(url: str, target: Path, expected: str) -> None:
    if target.exists() and sha256(target) == expected:
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": "film-asset-fetch"})
    with urllib.request.urlopen(request) as response, target.open("wb") as out:
        while block := response.read(1 << 20):
            out.write(block)
    actual = sha256(target)
    if actual != expected:
        target.unlink()
        sys.exit(f"checksum mismatch for {target.name}: {actual}")
    print("fetched", target.name)


def main() -> None:
    for font in ASSETS["fonts"]:
        fetch(font["url"], ROOT / "public" / "fonts" / font["file"], font["sha256"])

    source_dir = ROOT / "out" / "source"
    sources = {s["id"]: s for s in ASSETS["sources"]}
    for source in ASSETS["sources"]:
        fetch(source["url"], source_dir / source["file"], source["sha256"])

    # The film's own English subtitle stream, and the Chinese file as UTF-8.
    english = source_dir / "sintel_en_embedded.srt"
    if not english.exists():
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(source_dir / sources["sintel"]["file"]), "-map", "0:s:m:language:eng", str(english)], check=True)
    chinese = source_dir / "sintel_chs.utf8.srt"
    if not chinese.exists():
        chinese.write_text((source_dir / sources["sintel-chs"]["file"]).read_bytes().decode("gbk"), encoding="utf-8")

    for name, clip in ASSETS["clips"].items():
        frames = ROOT / "public" / "frames" / name
        count = round(clip["seconds"] * FPS)
        stamp = frames / "cut.json"
        spec = json.dumps(clip, sort_keys=True)
        if len(list(frames.glob("f*.jpg"))) == count and stamp.exists() and stamp.read_text() == spec:
            continue
        frames.mkdir(parents=True, exist_ok=True)
        for old in frames.glob("f*.jpg"):
            old.unlink()
        movie = source_dir / sources[clip["source"]]["file"]
        if clip.get("tall"):
            fx = clip.get("focusX", 0.5)
            crop = f"crop=ih*0.8:ih:max(0\\,min(iw-ih*0.8\\,iw*{fx}-ih*0.4)):0,scale=1080:1350:flags=lanczos,setsar=1"
        else:
            crop = "crop=iw:min(ih\\,iw/2.4):(iw-ow)/2:(ih-oh)/2,scale=1440:600:flags=lanczos,setsar=1"
        subprocess.run(
            [
                FFMPEG, "-v", "error", "-y", "-ss", f"{clip['start']:.3f}", "-i", str(movie), "-an",
                "-vf", f"fps={FPS},{crop}", "-frames:v", str(count), "-q:v", "3", "-start_number", "0",
                str(frames / "f%04d.jpg"),
            ],
            check=True,
        )
        stamp.write_text(spec)
        print("frames", name, len(list(frames.glob("f*.jpg"))))

    # The search result's poster, as the app shows one from TMDB: a 2:3 crop of
    # Sintel on the rooftop at sunset (5:40), from the same CC BY 3.0 film.
    poster = ROOT / "public" / "frames" / "poster.jpg"
    if not poster.exists():
        subprocess.run(
            [FFMPEG, "-v", "error", "-y", "-ss", "340", "-i", str(source_dir / sources["sintel"]["file"]), "-frames:v", "1",
             "-vf", "crop=ih*2/3:ih:iw*0.7-ih/3:0,scale=300:450:flags=lanczos,setsar=1", "-q:v", "2", str(poster)],
            check=True,
        )
        print("poster", poster.name)


if __name__ == "__main__":
    main()
