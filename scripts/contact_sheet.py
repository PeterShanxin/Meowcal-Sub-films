"""Review aid: pull chosen frames out of a render into labelled contact sheets.

usage: python scripts/contact_sheet.py out/preview.mp4 0 60 120 ...
writes out/sheet0.jpg, out/sheet1.jpg, ... (16 frames per sheet)
"""

import os
import subprocess
import sys

from PIL import Image, ImageDraw

video, frames = sys.argv[1], [int(f) for f in sys.argv[2:]]
out_dir = os.path.dirname(os.path.abspath(video))
tiles = []
for f in frames:
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", video, "-vf", f"select=eq(n\\,{f}),scale=480:-2",
         "-vframes", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        capture_output=True, check=True,
    ).stdout
    tile = Image.open(__import__("io").BytesIO(raw)).convert("RGB")
    ImageDraw.Draw(tile).text((8, 6), f"f{f}", fill=(255, 255, 0))
    tiles.append(tile)

w, h = tiles[0].size
for k in range(0, len(tiles), 16):
    group = tiles[k : k + 16]
    sheet = Image.new("RGB", (w * 4, h * ((len(group) + 3) // 4)))
    for i, tile in enumerate(group):
        sheet.paste(tile, ((i % 4) * w, (i // 4) * h))
    sheet.save(os.path.join(out_dir, f"sheet{k // 16}.jpg"), quality=90)
print("sheets:", (len(tiles) + 15) // 16)
