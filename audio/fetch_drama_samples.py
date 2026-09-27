"""Fetch the six CC0 source samples used by the original chamber score."""
import hashlib
import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent / 'samples' / 'vsco'
REV = '440300901dfe9275fd84e0b7763af1f8443ae62e'
BASE = f'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{REV}/'
SOURCES = {
    'violin_c4': ('Strings/Violin Section/Pizz/VlnEns_Pizz_C4_v1_rr1.wav', 72),
    'violin_a2': ('Strings/Violin Section/Pizz/VlnEns_Pizz_A2_v1_rr1.wav', 57),
    'cello_b1': ('Strings/Cello Section/pizzT/pizzT_B1_v1_RR1.wav', 47),
    'cello_sus_b1': ('Strings/Cello Section/susvib/susvib_B1_v1_1.wav', 47),
    'glock_c5': ('Percussion/Glock/glock_medium_C5.wav', 84),
    'marimba_c4': ('Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav', 72),
}
ROOT.mkdir(parents=True, exist_ok=True)
manifest = []
for name, (path, midi) in SOURCES.items():
    url = BASE + quote(path)
    dest = ROOT / f'{name}.wav'
    if not dest.exists():
        dest.write_bytes(urlopen(url, timeout=60).read())
    manifest.append(dict(file=dest.name, url=url, midi=midi,
                         sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
    print(name, dest.stat().st_size)
(ROOT / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
(ROOT / 'LICENSE.txt').write_bytes(urlopen(BASE + 'LICENSE', timeout=60).read())
