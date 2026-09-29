"""Score, cat voices and foley for the drama film, locked to timeline.json dramaFilm cues.

Three buses keep the story legible by ear:
- tv: the cat drama itself (Momo's meowed lines, its melodramatic strings, rain,
  the pillow and the snore). It plays through a small TV speaker in the room and
  opens to full range while the camera is inside the screen. Pausing cuts it dead.
- room: the viewer's side of the screen (keys, mouse, snack, room tone, the trill).
- score: the film's own music, used only outside the drama (opening, the product
  moment, the cloud, the ending).

Instruments are CC0 VSCO 2 CE recordings; cat voices are CC0 / public-domain
Wikimedia Commons recordings (see samples/*/manifest.json). Foley is procedural.
"""
import json
import re
import subprocess
from fractions import Fraction
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, lfilter, resample_poly, sosfilt

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['dramaFilm']
SAMPLES = ROOT / 'audio/samples'
OUT = ROOT / 'public/audio'
OUT.mkdir(exist_ok=True)
(ROOT / 'out/drama').mkdir(exist_ok=True, parents=True)


def load_instruments():
    library = {}
    for item in json.loads((SAMPLES / 'vsco/manifest.json').read_text()):
        rate, data = wavfile.read(SAMPLES / 'vsco' / item['file'])
        data = data.astype(np.float64)
        if data.ndim == 1:
            data = np.column_stack((data, data))
        data -= data.mean(axis=0)
        data /= max(np.max(np.abs(data)), 1e-9)
        library[Path(item['file']).stem] = (rate, data, item['midi'])
    return library


def load_cats():
    cats = {}
    for item in json.loads((SAMPLES / 'cats/manifest.json').read_text(encoding='utf-8')):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(SAMPLES / 'cats' / item['file']), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                             capture_output=True, check=True).stdout
        x = np.frombuffer(raw, np.float32).astype(np.float64)
        cats[Path(item['file']).stem] = x / max(np.max(np.abs(x)), 1e-9)
    return cats


LIB = load_instruments()
CATS = load_cats()

# Voiced meows cut from the recordings (source, start s, end s), located by pitch tracking.
CLIPS = {
    'pleading_1': ('meow_pleading', .28, 1.2), 'pleading_2': ('meow_pleading', 3.7, 4.78),
    'pleading_3': ('meow_pleading', 6.7, 7.58), 'pleading_5': ('meow_pleading', 10.1, 11.3),
    'impatient_1': ('meow_impatient', 2.12, 2.62), 'impatient_3': ('meow_impatient', 7.9, 9.26),
    'notrip_2': ('meow_notrip', 2.7, 3.22), 'notrip_3': ('meow_notrip', 3.98, 4.58),
}
# Instrument families as (sample, MIDI root); a note uses the nearest root.
FAMILY = {
    'violins': [('violins_sus_e4', 76), ('violins_sus_b4', 83)],
    'violas': [('violas_sus_b2', 59), ('violas_sus_f3', 65)],
    'cellos': [('cellos_sus_e1', 40), ('cellos_sus_g1', 43), ('cello_sus_b1', 47)],
    'trem': [('violins_trem_e4', 76)],
    'harp': [('harp_e3', 52), ('harp_b3', 59), ('harp_e5', 76)],
}


def filt(x, kind, hz, order=2):
    return sosfilt(butter(order, hz, btype=kind, fs=SR, output='sos'), x, axis=0)


def peak_eq(x, hz, gain_db, q=.9):
    a = 10 ** (gain_db / 40)
    w = 2 * np.pi * hz / SR
    alpha = np.sin(w) / (2 * q)
    b = np.array([1 + alpha * a, -2 * np.cos(w), 1 - alpha * a])
    den = np.array([1 + alpha / a, -2 * np.cos(w), 1 - alpha / a])
    return lfilter(b / den[0], den / den[0], x, axis=0)


def ramp(n, a, b):
    t = np.clip((np.arange(n) - a) / max(b - a, 1), 0, 1)
    return t * t * (3 - 2 * t)


def impulse(rt60, predelay, damp, seed):
    rng = np.random.default_rng(seed)
    n = int(rt60 * SR)
    t = np.arange(n) / SR
    ir = filt(rng.normal(0, 1, (n, 2)) * np.exp(-6.91 * t / rt60)[:, None], 'lowpass', damp)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0))
    return np.vstack((np.zeros((int(predelay * SR), 2)), ir))


def reverb(x, ir, wet):
    tail = np.column_stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)])
    return x + wet * tail


def pitched(src, rate, semitones):
    ratio = Fraction(SR / rate / (2 ** (semitones / 12))).limit_denominator(3000)
    return resample_poly(src, ratio.numerator, ratio.denominator, axis=0)


def fade(x, fin, fout):
    x = x.copy()
    a, b = min(int(fin * SR), len(x) // 3), min(int(fout * SR), len(x) // 2)
    shape = (lambda v: v[:, None]) if x.ndim > 1 else (lambda v: v)
    if a:
        x[:a] *= shape(np.linspace(0, 1, a))
    if b:
        x[-b:] *= shape(np.linspace(1, 0, b) ** 2)
    return x


def cut_clip(clip):
    source, a, b = CLIPS[clip]
    return fade(CATS[source][int(a * SR):int(b * SR)], .015, .06)


class Mix:
    def __init__(self, seconds, seed):
        self.n = int(seconds * SR)
        self.bus = {k: np.zeros((self.n, 2)) for k in ('tv', 'room', 'score')}
        self.rng = np.random.default_rng(seed)
        self.events = []

    def add(self, bus, frame, data, gain=1., pan=0., name=''):
        start = round(frame / 60 * SR)
        if data.ndim == 1:
            data = np.column_stack((data, data))
        data = data * gain * np.array([np.sqrt(1 - pan), np.sqrt(1 + pan)])
        a, b = max(0, start), min(self.n, start + len(data))
        if b > a:
            self.bus[bus][a:b] += data[a - start:b - start]
        if name:
            self.events.append({'frame': frame, 'bus': bus, 'event': name})

    def note(self, bus, family, frame, midi, frames, gain, pan=0., attack=.01, release=.25, name=None):
        roots = FAMILY[family] if family in FAMILY else [(family, LIB[family][2])]
        sample, root = min(roots, key=lambda s: abs(s[1] - midi))
        rate, src, _ = LIB[sample]
        n = round(frames / 60 * SR)
        data = pitched(src[:int(rate * (frames / 60 + release + .5))], rate, midi - root)[:n + int(release * SR)]
        env = np.ones(len(data))
        a = min(int(attack * SR), len(data) // 2)
        env[:a] = np.linspace(0, 1, a) ** 1.5
        r = min(int(release * SR), len(data) - a)
        env[len(data) - r:] *= np.linspace(1, 0, r) ** 2
        self.add(bus, frame, data * env[:, None], gain, pan, f'{family} {midi}' if name is None else name)

    def chord(self, bus, frame, frames, voices, attack=.35, release=.6):
        for family, midi, gain, pan in voices:
            self.note(bus, family, frame, midi, frames, gain, pan, attack, release)

    def noise(self, bus, frame, seconds, gain, band, name, pan=0., shape='decay'):
        n = int(seconds * SR)
        data = self.rng.normal(0, .4, (n, 2))
        data = filt(data, 'bandpass', band) if isinstance(band, tuple) else filt(data, 'lowpass', band)
        t = np.linspace(0, 1, n)
        env = {'decay': np.exp(-t * 9) * np.minimum(t * 70, 1), 'swell': np.sin(np.pi * t) ** 2,
               'rise': t ** 2 * np.minimum((1 - t) * 30, 1), 'flat': np.minimum(np.minimum(t, 1 - t) * 12, 1)}[shape]
        self.add(bus, frame, data * env[:, None], gain, pan, name)

    def thump(self, bus, frame, hz, seconds, gain, name, pan=0.):
        t = np.arange(int(seconds * SR)) / SR
        body = np.sin(2 * np.pi * np.cumsum(hz * (1 + .6 * np.exp(-t * 40))) / SR) * np.exp(-t / (seconds / 5))
        self.add(bus, frame, body, gain, pan, name)

    def squeak(self, bus, frame, seconds, f0, f1, gain, name, pan=0.):
        # Rubbery cartoon squeak: a gliding, wobbling sine.
        t = np.arange(int(seconds * SR)) / SR
        hz = f0 + (f1 - f0) * t / seconds + 25 * np.sin(2 * np.pi * 14 * t)
        self.add(bus, frame, np.sin(2 * np.pi * np.cumsum(hz) / SR) * np.sin(np.pi * t / seconds) ** 2, gain, pan, name)

    def click(self, bus, frame, gain, name, bright=4200):
        # Key or mouse: a sharp contact, a small plastic body, then the release.
        for offset, g in [(0, 1.), (5, .45)]:
            self.noise(bus, frame + offset, .018, gain * g, (bright * .6, min(bright * 1.8, 16000)), '' if offset else name)
        self.thump(bus, frame, 190, .05, gain * .35, '')

    def voice(self, bus, frame, frames, clip, semitones, gain, pan=0., name=''):
        if clip == 'trill':
            # A questioning chirp: a rising meow (the recording reversed) rolled at 27 Hz.
            data = pitched(CATS['meow_impatient'][int(2.18 * SR):int(2.5 * SR)][::-1], SR, semitones)
            t = np.arange(len(data)) / SR
            data = data * (.62 + .38 * np.sin(2 * np.pi * 27 * t)) * np.minimum(1, t / .03)
        elif clip == 'yawn':
            data = pitched(cut_clip('pleading_5'), SR, semitones)
            half = len(data) // 2
            # The mouth closes through the yawn, so the vowel darkens from the midpoint.
            data = np.concatenate([data[:half], filt(data[half:], 'lowpass', 900)]) * np.linspace(1, .55, len(data))
            breath = self.rng.normal(0, .02, int(.35 * SR)) * np.linspace(1, 0, int(.35 * SR))
            data = np.concatenate([data, filt(breath, 'lowpass', 2500)])
        else:
            data = pitched(cut_clip(clip), SR, semitones)
        limit = round(frames / 60 * SR) + int(.12 * SR)
        self.add(bus, frame, fade(peak_eq(data, 320, 2.5)[:limit], .012, .09), gain, pan, name or f'meow {clip}')

    def purr(self, bus, start, end, gain):
        # Sleeping purr-snore: a ~24 Hz glottal pulse, louder and lower on each exhale.
        n = round((end - start) / 60 * SR)
        t = np.arange(n) / SR
        breath = .5 - .5 * np.cos(2 * np.pi * t / 3.4)
        pulse = np.exp(-((np.cumsum(22 + 5 * breath) / SR) % 1) * 9) - .11
        air = filt(self.rng.normal(0, 1, n), 'bandpass', (180, 900)) * .35
        sound = filt(pulse * (.35 + .65 * breath) + air * breath, 'lowpass', 1100)
        sound *= ramp(n, 0, SR) * (1 - ramp(n, n - SR // 2, n))
        self.add(bus, start, sound / max(np.max(np.abs(sound)), 1e-9), gain, name='snore')

    def bed(self, bus, frame, frames, gain, band, name):
        n = round(frames / 60 * SR)
        if n > 0:
            data = filt(self.rng.normal(0, 1, (n, 2)), 'bandpass', band)
            self.add(bus, frame, data * (ramp(n, 0, SR // 3) * (1 - ramp(n, n - SR // 3, n)))[:, None], gain, name=name)

    def room_tone(self, frame, frames, gain):
        n = round(frames / 60 * SR)
        t = np.arange(n) / SR
        hum = .12 * np.sin(2 * np.pi * 100 * t) + .05 * np.sin(2 * np.pi * 150 * t)
        tone = filt(self.rng.normal(0, 1, (n, 2)), 'lowpass', 1400) + hum[:, None]
        self.add('room', frame, tone * (ramp(n, 0, SR // 4) * (1 - ramp(n, n - SR // 4, n)))[:, None], gain, name='room tone')


def perspective(cut, n):
    """Per-sample TV gate plus near (inside the screen) and distant (the planet) weights."""
    cue = cut['cues']
    gate, near, distant = np.ones(n), np.zeros(n), np.zeros(n)
    s = lambda frame: min(n, max(0, round(frame / 60 * SR)))
    short = cut['duration'] < 3000
    for shot in cut['shots']:
        a, b, kind = s(shot['from']), s(shot['from'] + shot['duration']), shot['kind']
        if kind == 'world':
            distant[a:b] = 1
        elif kind == 'buildup':
            near[a:b] = ramp(b - a, *(round(x / 60 * SR) for x in ((0, 180) if short else (20, 240))))
        elif kind in ('loss', 'punchline'):
            near[a:b] = 1
        elif kind == 'languages':
            for block in range(2):
                o = shot['from'] + block * 180
                near[s(o):s(o + 118)] = 1
        elif kind in ('world_end', 'brand'):
            gate[a:b] = 0
    near[s(cue['reactionCut']):s(cue['pause'])] = 0
    gate[s(cue['pause']):s(cue['resume'])] = 0
    return gate, near, distant


def tv_master(mix, cut):
    dry = mix.bus['tv']
    # Picture cuts are sound cuts; the 2 ms smoothing only prevents clicks.
    smooth = lambda w: np.convolve(w, np.ones(96) / 96, 'same')
    gate, near, distant = (smooth(w) for w in perspective(cut, mix.n))
    full = reverb(dry, impulse(1.9, .025, 7000, 3), .22)
    speaker = peak_eq(filt(filt(dry.mean(axis=1), 'highpass', 330, 3), 'lowpass', 4800, 3), 2100, 4)
    speaker = reverb(np.column_stack((speaker * .92, speaker * 1.08)), impulse(.42, .006, 5200, 4), .5)
    far_away = filt(reverb(speaker, impulse(2.6, .05, 2400, 5), 1.2), 'lowpass', 1500)
    far = (1 - near) * (1 - distant)
    return (full * near[:, None] + speaker * .5 * far[:, None] + far_away * .25 * distant[:, None]) * gate[:, None]


def score_drama(mix, cut):
    """The fictional drama's own melodramatic strings, heard through the TV."""
    shots = {s['kind']: s for s in cut['shots']}
    cue = cut['cues']
    loss, tv = cue['subtitleLoss'], 'tv'
    first = shots['viewers']['from'] if 'viewers' in shots else 0
    mix.bed(tv, first, cue['pause'] - first, .01, (500, 5000), 'drama rain')
    mix.bed(tv, cue['resume'], cue['snoreEnd'] - cue['resume'], .008, (500, 5000), '')
    if 'viewers' in shots:
        mix.chord(tv, first + 8, 300, [('cellos', 40, .16, .1), ('violas', 59, .1, -.1), ('violins', 67, .06, -.25)], attack=1.4, release=1.)
    build = shots['buildup']['from']
    span = loss - build
    # Em - C - Am - B, climbing toward the declaration.
    steps = [[('cellos', 40, .2, .1), ('violas', 59, .12, -.1), ('violins', 76, .09, -.3), ('violins', 79, .07, -.2)],
             [('cellos', 36, .22, .1), ('violas', 60, .13, -.1), ('violins', 76, .1, -.3), ('violins', 79, .09, -.2)],
             [('cellos', 45, .23, .1), ('violas', 64, .14, -.1), ('violins', 81, .12, -.3), ('violins', 84, .1, -.2)],
             [('cellos', 47, .26, .1), ('violas', 63, .15, -.1), ('violins', 83, .14, -.3), ('violins', 87, .12, -.2)]]
    for i, voices in enumerate(steps):
        mix.chord(tv, build + round(span * i / 4), round(span / 4) + 16, voices, attack=.5 if i else 1.1, release=.35)
    rate, roll, _ = LIB['timpani_roll']
    timp = build + round(span * .45)
    body = pitched(roll[:int(rate * ((loss - timp) / 60 + .5))], rate, -3)[:round((loss - timp) / 60 * SR)]
    mix.add(tv, timp, body * (ramp(len(body), 0, len(body)) ** 1.6 * .9 + .1)[:, None], .5, .15, 'timpani roll crescendo')
    rate, cym, _ = LIB['cymbal_swell']
    peak = int(np.argmax(np.abs(cym).max(axis=1)))
    swell = cym[max(0, peak - round(span * .5 / 60 * rate)):peak]
    mix.add(tv, loss - round(len(swell) / rate * 60), fade(swell, .5, .02), .3, -.1, 'cymbal swell')
    # The declaration lands: timpani and a full dominant, then a trembling hold that never resolves.
    mix.note(tv, 'timpani_hit', loss, 47, 150, .75, .1, attack=.002, release=1.2, name='timpani hit')
    mix.chord(tv, loss, 26, [('cellos', 35, .3, .15), ('cellos', 47, .3, .1), ('violas', 63, .2, -.1), ('violins', 83, .2, -.3), ('violins', 87, .16, -.2)], attack=.004, release=.5)
    mix.chord(tv, loss + 20, cue['pause'] - loss + 60, [('trem', 83, .13, -.25), ('trem', 78, .1, -.1), ('cellos', 47, .15, .12)], attack=.3, release=.1)
    # Played again, the hold swells toward the big moment... which is a pillow. Only a harp answers.
    resume, pillow = cue['resume'], cue['pillow']
    mix.chord(tv, resume, pillow - resume + 4, [('trem', 83, .12, -.25), ('trem', 78, .1, -.1), ('cellos', 47, .2, .12), ('violas', 63, .12, -.1)], attack=.9, release=.04)
    body = pitched(roll[:rate * 2], rate, -3)[:round((pillow - resume) / 60 * SR)]
    mix.add(tv, resume, body * ramp(len(body), 0, len(body))[:, None], .45, .15, 'timpani roll')
    mix.note(tv, 'harp', pillow + 26, 64, 160, .22, -.1, attack=.003, release=1.4, name='harp answers')
    mix.note(tv, 'harp', pillow + 26, 52, 160, .12, .1, attack=.003, release=1.4, name='')


def score_film(mix, cut):
    """Non-diegetic music: the opening motif, the product moment, the cloud and the ending."""
    shots = {s['kind']: s for s in cut['shots']}
    cue, sc = cut['cues'], 'score'
    if 'world' in shots:
        for frame, pitch, velocity in [(34, 64, .38), (83, 67, .31), (164, 66, .24)]:
            mix.note(sc, 'violin_c4', frame, pitch, 42, velocity, -.24, attack=.004, release=.15)
        mix.note(sc, 'cello_b1', 28, 40, 83, .22, .2, attack=.004, release=.2)
        mix.note(sc, 'harp', 150, 76, 90, .14, .3, attack=.002, release=.8)
        mix.noise(sc, 0, 4, .02, (180, 1400), 'space air', shape='swell')
    lift = cue['logoLift']
    for offset, pitch, gain in [(0, 76, .13), (7, 79, .11), (14, 83, .1), (22, 88, .09), (32, 91, .07)]:
        mix.note(sc, 'glock_c5', lift + offset, pitch, 70, gain, -.2 + offset / 60, attack=.002, release=.5)
    mix.noise(sc, lift, .7, .11, (600, 5000), 'logo lift', shape='swell')
    mix.noise(sc, cue['logoMouse'] - 12, .3, .1, (400, 3000), 'logo to mouse', shape='rise')
    # A light pizzicato walk carries selection -> OCR -> translation.
    walk = [64, 71, 67, 71]
    for i, frame in enumerate(range(cue['selectionPress'], cue['plate'] - 20, 24)):
        mix.note(sc, 'violin_c4', frame, walk[i % 4], 20, .12 if i % 2 else .16, -.15, attack=.003, release=.1)
        if i % 4 == 0:
            mix.note(sc, 'cello_b1', frame, 40, 40, .16, .2, attack=.003, release=.15)
    mix.noise(sc, cue['ocr'], 1.3, .035, (5000, 11000), 'scan shimmer', shape='swell')
    mix.note(sc, 'marimba_c4', cue['local'], 64, 60, .2, -.15, attack=.002, release=.3)
    plate = cue['plate']
    for offset, pitch, gain in [(0, 64, .26), (5, 68, .2), (11, 71, .16)]:
        mix.note(sc, 'marimba_c4', plate + offset, pitch, 76, gain, (offset - 5) / 20, attack=.002, release=.4)
    for i, pitch in enumerate([52, 59, 64, 68, 71, 76]):
        mix.note(sc, 'harp', plate + 4 + i * 5, pitch, 110, .13, -.3 + i * .12, attack=.002, release=1.2)
    mix.chord(sc, plate, 150, [('cellos', 40, .12, .1), ('violas', 59, .08, -.1)], attack=.25, release=1.2)
    if 'cloudIn' in cue:
        # Tiptoeing pizzicato while the cloud crosses the room, creeping upward.
        steps = range(cue['cloudIn'] + 30, cue['privacyCut'] - 45, 14)
        for i, frame in enumerate(steps):
            mix.note(sc, 'violin_a2', frame, [52, 55, 53, 56, 54, 57, 55, 58, 56, 59][i % 10], 10, .13, -.3 + .6 * i / len(steps), attack=.002, release=.06)
        mix.note(sc, 'violin_c4', cue['swat'] + 1, 79, 20, .22, .2, attack=.002, release=.2)
        mix.note(sc, 'violin_c4', cue['swat'] + 9, 76, 20, .18, .25, attack=.002, release=.2)
    if 'world_end' in shots:
        a = shots['world_end']['from']
        mix.chord(sc, a - 40, 240, [('cellos', 40, .13, .1), ('violas', 59, .09, -.1), ('violins', 76, .06, -.3)], attack=1.2, release=1.)
        for i, pitch in enumerate([76, 79, 83, 81, 79, 83]):
            mix.note(sc, 'glock_c5', a + 25 + i * 20, pitch, 50, .07, -.5 + i * .2, attack=.002, release=.6)
    brand = shots['brand']['from']
    mix.note(sc, 'cello_b1', brand + 12, 40, 90, .25, .17, attack=.004, release=.3)
    for offset, pitch, gain in [(20, 64, .31), (66, 67, .27), (120, 66, .23), (180, 64, .24)]:
        mix.note(sc, 'marimba_c4', brand + offset, pitch, 98, gain, -.12, attack=.002, release=.4)
    mix.chord(sc, brand + 110, 190, [('cellos', 40, .12, .12), ('violas', 59, .08, -.08), ('violins', 76, .05, -.25)], attack=1.4, release=1.2)
    clean = cue['cleanBrand']
    for i, pitch in enumerate([52, 59, 64, 71, 76]):
        mix.note(sc, 'harp', clean - 30 + i * 6, pitch, 100, .1, -.25 + i * .12, attack=.002, release=1.2)
    mix.note(sc, 'glock_c5', clean, 76, 112, .08, .2, attack=.002, release=1.)
    mix.voice(sc, clean + 14, 18, 'trill', 3, .16, .05, 'sonic logo chirp')


def foley(mix, cut):
    shots = {s['kind']: s for s in cut['shots']}
    cue = cut['cues']
    rooms = [s for s in cut['shots'] if s['kind'] not in ('world', 'world_end', 'brand')]
    mix.room_tone(rooms[0]['from'], rooms[-1]['from'] + rooms[-1]['duration'] - rooms[0]['from'], .016)
    # The awkward silence after the reveal gets a clock.
    for frame in range(cue['deadpan'] + 7, cue['crunch'] + 40, 60):
        mix.noise('room', frame, .012, .045, (2500, 7000), 'clock tick' if frame == cue['deadpan'] + 7 else '', -.55)
    mix.click('room', cue['pause'], .3, 'space key (pause)')
    mix.click('room', cue['logoMouse'], .18, 'palm meets mouse', 2600)
    mix.click('room', cue['selectionPress'], .26, 'mouse down', 5000)
    mix.click('room', cue['selectionEnd'], .2, 'mouse up', 4400)
    mix.thump('score', cue['plate'], 150, .09, .18, 'plate lands')
    mix.click('room', cue['resume'], .26, 'space key (play)')
    for offset in (0, 22):
        mix.thump('tv', cue['pillow'] - 20 + offset, 95, .12, .3, 'pillow pat')
        mix.noise('tv', cue['pillow'] - 20 + offset, .1, .12, 500, '')
    mix.noise('tv', cue['lieDown'], .6, .1, 900, 'body settles', shape='swell')
    mix.thump('room', cue['earDrop'] + 30, 70, .14, .14, 'tail flop')
    for offset, gain, hz in [(0, .29, 6400), (2, .18, 4500), (6, .23, 7200), (11, .1, 3900), (17, .07, 3100)]:
        mix.noise('room', cue['crunch'] + offset, .075, gain, hz, 'snack crunch' if offset == 0 else '', -.1)
    for k in range(3):
        mix.noise('room', cue['crunch'] + 34 + k * 14, .06, .06, 2600, 'chew' if k == 0 else '', -.1)
    if 'cloudIn' in cue:
        mix.noise('score', cue['cloudPeek'], .9, .03, (250, 2000), 'cloud peeks in', -.6, 'swell')
        mix.squeak('room', cue['cloudGlass'] + 20, .22, 520, 430, .03, 'cloud presses on the glass', -.5)
        mix.squeak('room', cue['cloudIn'], .32, 640, 1150, .05, 'cloud squeezes through', -.6)
        mix.noise('room', cue['cloudIn'] + 18, .12, .1, (300, 2500), 'pop', -.5)
        mix.squeak('score', cue['privacyCut'] - 35, .45, 900, 700, .04, 'cloud tugs', .3)
        mix.noise('room', cue['swat'] - 6, .15, .14, (1200, 6000), 'paw sweep', .3, 'rise')
        mix.thump('room', cue['swat'], 210, .08, .32, 'swat')
        mix.noise('room', cue['swat'], .07, .3, 2200, '', .3)
        mix.noise('score', cue['swat'] + 3, .8, .1, (600, 3200), 'cloud poof', .5)
    if 'world_end' in shots:
        mix.noise('score', shots['world_end']['from'] + 110, 1.5, .03, (300, 1800), 'cloud sulks away', .7, 'swell')


def voices(mix, cut):
    for line in cut['voice']:
        bus = 'tv' if line['who'] == 'momo' else 'room'
        mix.voice(bus, line['at'], line['len'], line['clip'], line['semitones'], .3 * line['gain'], 0, f"{line['who']} {line['clip']}")
    mix.purr('tv', cut['cues']['snore'], cut['cues']['snoreEnd'], .16)
    if any(s['kind'] == 'world' for s in cut['shots']):
        # Every window on the planet plays the same drama: faint, far and overlapping.
        for delay, clip, st, pan in [(30, 'pleading_1', -3, -.6), (70, 'impatient_3', -5, .5), (118, 'notrip_2', -2, -.2), (160, 'pleading_3', -4, .7)]:
            mix.voice('tv', delay, 60, clip, st, .12, pan, 'planet murmur')


def loudness(path, chain):
    run = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-af', chain, '-f', 'null', '-'], capture_output=True, text=True, check=True)
    return json.loads(re.findall(r'\{[\s\S]*?\}', run.stderr)[-1])


def limit(audio, ceiling):
    """Lookahead peak limiter (1.5 ms attack, 120 ms release) so loudnorm can stay linear."""
    need = np.maximum(1, np.max(np.abs(audio), axis=1) / ceiling)
    look = int(.0015 * SR)
    need = np.array([need[max(0, i - look):i + 1].max() for i in range(0, len(need), look)]).repeat(look)[:len(need)]
    gain = 1 / need
    release = np.exp(-1 / (.12 * SR))
    smoothed = np.empty_like(gain)
    g = 1.
    for i, target in enumerate(gain):
        g = target if target < g else target + (g - target) * release
        smoothed[i] = g
    return audio * np.roll(smoothed, -look)[:, None]


def master(cut_name, cut):
    mix = Mix(cut['duration'] / 60, 29)
    score_drama(mix, cut)
    voices(mix, cut)
    foley(mix, cut)
    score_film(mix, cut)
    room = reverb(mix.bus['room'], impulse(.5, .004, 6000, 6), .18)
    score = reverb(mix.bus['score'], impulse(2.2, .02, 6500, 7), .3)
    audio = filt(tv_master(mix, cut) * 1.05 + room + score * .9, 'highpass', 30)
    audio[-int(.3 * SR):] *= np.linspace(1, 0, int(.3 * SR))[:, None] ** 2
    audio = audio / max(np.max(np.abs(audio)), 1e-9) * .89
    dry = ROOT / f'out/drama/drama-{cut_name}-premaster.wav'
    wavfile.write(dry, SR, np.float32(audio))
    for attempt in range(5):
        levels = loudness(dry, 'loudnorm=I=-14:TP=-1.5:LRA=15:print_format=json')
        excess = float(levels['input_tp']) - 14 - float(levels['input_i']) + 1.5 + .4
        if excess <= 0:
            break
        audio = limit(audio, np.max(np.abs(audio)) * 10 ** (-(excess + .3 * attempt) / 20))
        wavfile.write(dry, SR, np.float32(audio))
    chain = ('loudnorm=I=-14:TP=-1.5:LRA=15:linear=true:'
             f'measured_I={levels["input_i"]}:measured_TP={levels["input_tp"]}:'
             f'measured_LRA={levels["input_lra"]}:measured_thresh={levels["input_thresh"]}:'
             f'offset={levels["target_offset"]}:print_format=json')
    out = OUT / f'drama-{cut_name}.wav'
    render = subprocess.run(['ffmpeg', '-y', '-hide_banner', '-i', str(dry), '-af', chain, '-ar', str(SR), '-c:a', 'pcm_s24le', str(out)], capture_output=True, text=True, check=True)
    normalized = json.loads(re.findall(r'\{[\s\S]*?\}', render.stderr)[-1])
    correction = round(-14 - float(normalized['output_i']), 2)
    trimmed = out.with_name(out.stem + '-trim.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(out), '-af', f'volume={correction}dB', '-c:a', 'pcm_s24le', str(trimmed)], check=True)
    trimmed.replace(out)
    report = {'cut': cut_name, 'firstPass': levels, 'master': normalized, 'trimDb': correction,
              'events': sorted(mix.events, key=lambda e: e['frame'])}
    (ROOT / f'out/drama/audio-{cut_name}.json').write_text(json.dumps(report, indent=2))
    print(cut_name, normalized['output_i'], 'LUFS', normalized['output_tp'], 'dBTP', normalized.get('normalization_type'))


if __name__ == '__main__':
    for name, cut in TL['cuts'].items():
        master(name, cut)
