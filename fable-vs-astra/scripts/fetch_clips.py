"""Download the three source films from this repository's releases into
public/clips/ (git-ignored). Needs the GitHub CLI (`gh`) on PATH.

    python fable-vs-astra/scripts/fetch_clips.py
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

REPO = "PeterShanxin/Meowcal-Sub-films"
CLIPS = Path(__file__).resolve().parent.parent / "public" / "clips"

# (release tag, asset, file inside a zip or None, saved as)
SOURCES = [
    ("reading-test-v1.0.0", "meowcal-reading-test-v1.mp4", None, "astra.mp4"),
    ("talking-about-you-v1.0.0", "talking-about-you-v3-fable.zip", "video.mp4", "fable-v3.mp4"),
    ("talking-about-you-v1.0.0", "talking-about-you-v4-five-raw-films.zip", "video.mp4", "fable-v4.mp4"),
]


def main() -> None:
    CLIPS.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for tag, asset, inner, out in SOURCES:
            subprocess.run(["gh", "release", "download", tag, "-R", REPO, "-p", asset, "-D", tmp, "--clobber"], check=True)
            src = Path(tmp) / asset
            if inner:
                with zipfile.ZipFile(src) as z, z.open(inner) as f, open(CLIPS / out, "wb") as o:
                    shutil.copyfileobj(f, o)
            else:
                shutil.copyfile(src, CLIPS / out)
            print(out)


if __name__ == "__main__":
    main()
