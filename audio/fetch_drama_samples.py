"""Fetch the pinned CC0 / public-domain recordings used by the drama score and cat voices."""
import hashlib
import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

HERE = Path(__file__).resolve().parent / 'samples'
AGENT = {'User-Agent': 'meowcal-sub-launch-film/1.0 (https://github.com/PeterShanxin/Meowcal-Sub-launch-film)'}

VSCO_REV = '440300901dfe9275fd84e0b7763af1f8443ae62e'
VSCO_BASE = f'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/{VSCO_REV}/'
# name: (path in the pinned VSCO 2 CE tree, MIDI root measured from the recording; 0 = unpitched)
VSCO = {
    'violin_c4': ('Strings/Violin Section/Pizz/VlnEns_Pizz_C4_v1_rr1.wav', 72),
    'violin_a2': ('Strings/Violin Section/Pizz/VlnEns_Pizz_A2_v1_rr1.wav', 57),
    'cello_b1': ('Strings/Cello Section/pizzT/pizzT_B1_v1_RR1.wav', 47),
    'cello_sus_b1': ('Strings/Cello Section/susvib/susvib_B1_v1_1.wav', 47),
    'glock_c5': ('Percussion/Glock/glock_medium_C5.wav', 84),
    'marimba_c4': ('Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav', 72),
    'violins_sus_e4': ('Strings/Violin Section/susVib/VlnEns_susVib_E4_v2.wav', 76),
    'violins_sus_b4': ('Strings/Violin Section/susVib/VlnEns_susVib_B4_v2.wav', 83),
    'violins_trem_e4': ('Strings/Violin Section/Trem/VlnEns_Trem_E4_v2.wav', 76),
    'violas_sus_b2': ('Strings/Viola Section/susvib/ViolaEns_susvib_B2_v2_1.wav', 59),
    'violas_sus_f3': ('Strings/Viola Section/susvib/ViolaEns_susvib_F3_v2_1.wav', 65),
    'cellos_sus_e1': ('Strings/Cello Section/susvib/susvib_E1_v3_1.wav', 40),
    'cellos_sus_g1': ('Strings/Cello Section/susvib/susvib_G1_v3_1.wav', 43),
    'timpani_roll': ('Percussion/Timpani/Rolls/Timpani3_Roll_v5_rr1_Sum.wav', 50),
    'timpani_hit': ('Percussion/Timpani/Timpani2_Hit_v4_rr1_Sum.wav', 47),
    'cymbal_swell': ('VSCO 1 Percussion/varMetal/Cymbals/susp/susp_hit_softmall_roll2_cresc.wav', 0),
    'harp_e3': ('Strings/Harp/KSHarp_E3_mf.wav', 52),
    'harp_b3': ('Strings/Harp/KSHarp_B3_mf.wav', 59),
    'harp_e5': ('Strings/Harp/KSHarp_E5_mf.wav', 76),
}

# Wikimedia Commons recordings, each marked CC0 or public domain on its file page.
COMMONS = {
    'meow_siamese': 'Meow of a Siamese cat - freemaster2.wav',
    'meow_young': 'Maullido de gata hembra joven.ogg',
    'meow_usa': 'MeowUSA.wav',
    'meow_impatient': 'GettingOutImpatient.ogg',
    'meow_pleading': 'Meow of a pleading cat.oga',
    'meow_notrip': 'NoTrip.ogg',
}
FREE = {'CC0', 'Public domain'}


def fetch(url):
    return urlopen(Request(url, headers=AGENT), timeout=60).read()


def vsco():
    root = HERE / 'vsco'
    root.mkdir(parents=True, exist_ok=True)
    manifest = []
    for name, (path, midi) in VSCO.items():
        url = VSCO_BASE + quote(path)
        dest = root / f'{name}.wav'
        if not dest.exists():
            dest.write_bytes(fetch(url))
        manifest.append(dict(file=dest.name, url=url, midi=midi, sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
        print(name, dest.stat().st_size)
    (root / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    license_text = root / 'LICENSE.txt'
    if not license_text.exists():
        license_text.write_bytes(fetch(VSCO_BASE + 'LICENSE'))


def commons():
    root = HERE / 'cats'
    root.mkdir(parents=True, exist_ok=True)
    titles = '|'.join(f'File:{t}' for t in COMMONS.values())
    api = ('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo'
           f'&iiprop=url|extmetadata&titles={quote(titles)}')
    pages = json.loads(fetch(api))['query']['pages'].values()
    info = {p['title'][5:]: p['imageinfo'][0] for p in pages}
    manifest = []
    for name, title in COMMONS.items():
        meta = info[title]['extmetadata']
        license_name = meta['LicenseShortName']['value']
        if license_name not in FREE:
            raise SystemExit(f'{title}: license is {license_name}, expected CC0 or public domain')
        url = info[title]['url'].split('?')[0]
        dest = root / f'{name}{Path(title).suffix}'
        if not dest.exists():
            dest.write_bytes(fetch(url))
        manifest.append(dict(file=dest.name, title=title,
                             page=f'https://commons.wikimedia.org/wiki/File:{quote(title.replace(" ", "_"))}',
                             url=url, license=license_name, sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
        print(name, license_name, dest.stat().st_size)
    (root / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')


if __name__ == '__main__':
    vsco()
    commons()
