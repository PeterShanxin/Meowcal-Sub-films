"""Fetch the pinned CC0 recordings used by the score (VSCO 2 Community Edition)."""
import hashlib
import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

HERE = Path(__file__).resolve().parent / 'samples'
AGENT = {'User-Agent': 'meowcal-sub-films/1.0'}
REV = '440300901dfe9275fd84e0b7763af1f8443ae62e'
BASE = f'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{REV}/'

# name: (path in the pinned tree, MIDI root). Upright piano file NNN is key 21 + 2 * NNN.
FILES = {f'piano_{21 + 2 * n}': (f'Keys/Upright Piano/Player_dyn2_rr1_{n:03d}.wav', 21 + 2 * n) for n in range(4, 30, 2)}
FILES['cello_sus_40'] = ('Strings/Cello Section/susvib/susvib_E1_v3_1.wav', 40)
FILES['cello_sus_43'] = ('Strings/Cello Section/susvib/susvib_G1_v3_1.wav', 43)

HERE.mkdir(parents=True, exist_ok=True)
manifest = []
for name, (path, midi) in FILES.items():
    url = BASE + quote(path)
    dest = HERE / f'{name}.wav'
    if not dest.exists():
        dest.write_bytes(urlopen(Request(url, headers=AGENT), timeout=60).read())
    manifest.append({'file': dest.name, 'url': url, 'midi': midi, 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()})
    print(dest.name, dest.stat().st_size)
(HERE / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
