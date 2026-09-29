"""Film-grain tiles for the launch film: public/scenes/grain-0..5.png.

The composition cycles one tile per frame as an overlay, which reads as live
grain without per-frame noise generation in the browser.
"""

import os

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "scenes")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(99)
    for i in range(6):
        noise = gaussian_filter(rng.normal(0.5, 0.5, (512, 512)), 0.7)
        noise = np.clip((noise - noise.mean()) / (noise.std() * 4) + 0.5, 0, 1)
        Image.fromarray((noise * 255).astype(np.uint8)).save(os.path.join(OUT, f"grain-{i}.png"))
