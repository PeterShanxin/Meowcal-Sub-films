"""Hand-scored chamber miniature and dry foley, locked to dramaFilm's frame clock.

VSCO CE instruments are CC0. No generated music service, speech or vocal samples.
The deliberately empty reaction beat is part of the score.
"""
import json
import re
import subprocess
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, resample_poly, sosfilt
from fractions import Fraction

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['dramaFilm']
SAMPLES = ROOT / 'audio/samples/vsco'
OUT = ROOT / 'public/audio'
OUT.mkdir(exist_ok=True)
(ROOT / 'out/drama').mkdir(exist_ok=True, parents=True)
manifest = json.loads((SAMPLES / 'manifest.json').read_text())
library = {}
for item in manifest:
    rate, data = wavfile.read(SAMPLES / item['file'])
    data = data.astype(np.float64) / np.iinfo(data.dtype).max
    if data.ndim == 1:
        data = np.column_stack((data, data))
    data -= data.mean(axis=0)
    data /= max(np.max(np.abs(data)), .001)
    library[Path(item['file']).stem] = (rate, data, item['midi'])


def filtered(x, hz, kind='lowpass'):
    return sosfilt(butter(2, hz, btype=kind, fs=SR, output='sos'), x, axis=0)


def write_score(aspect):
    shots = {s['kind']: s for s in TL[aspect]}
    cue = TL['cues'][aspect]
    length = 30 if aspect == 'vertical' else 60
    audio = np.zeros((length * SR, 2), np.float64)
    rng = np.random.default_rng(29)
    events = []

    def add(frame, data, gain=1., pan=0., name=''):
        start = round(frame / 60 * SR)
        if data.ndim == 1:
            data = np.column_stack((data, data))
        data = data * gain * np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)])
        end = min(len(audio), start + len(data))
        audio[max(0, start):end] += data[max(0, -start):end - start]
        if name:
            events.append({'frame': frame, 'event': name})

    def note(name, frame, midi, duration, gain, pan=0., attack=.004):
        rate, src, root = library[name]
        ratio = Fraction(SR / rate / (2 ** ((midi - root) / 12))).limit_denominator(3000)
        data = resample_poly(src, ratio.numerator, ratio.denominator, axis=0)
        n = min(len(data), round(duration / 60 * SR))
        data = data[:n].copy()
        a = min(round(attack * SR), n // 3)
        data[:a] *= np.linspace(0, 1, a)[:, None]
        release = min(round(.12 * SR), n // 3)
        data[-release:] *= np.linspace(1, 0, release)[:, None] ** 2
        # Short, asymmetric room reflections retain the recorded instrument's attack.
        tail = np.zeros((len(data) + int(.15 * SR), 2))
        tail[:len(data)] = data
        for delay, wet in [(.041, .055), (.079, .028), (.121, .018)]:
            d = int(delay * SR)
            tail[d:d + len(data)] += data[:, ::-1] * wet
        add(frame, tail, gain, pan, f'{name} MIDI {midi}')

    def noise(frame, duration, gain, cutoff, name, pan=0., shape='decay'):
        n = round(duration * SR)
        data = filtered(rng.normal(0, .4, (n, 2)), cutoff)
        t = np.linspace(0, 1, n)
        env = np.sin(np.pi * t) ** 2 if shape == 'swell' else np.exp(-t * 9) * np.minimum(t * 70, 1)
        add(frame, data * env[:, None], gain, pan, name)

    # E minor: a conversational three-note idea, with air between each gesture.
    if aspect == 'landscape':
        for frame, pitch, velocity in [(34, 64, .38), (83, 67, .31), (164, 66, .24), (250, 59, .3), (354, 64, .28), (454, 67, .24)]:
            note('violin_c4', frame, pitch, 42, velocity, -.24)
        for frame, pitch in [(28, 40), (244, 43), (444, 47)]:
            note('cello_b1', frame, pitch, 83, .22, .2)
        note('marimba_c4', 168, 71, 80, .17, .24)

    start = shots['buildup']['from']
    span = cue['subtitleLoss'] - start
    # Bowed bass under the drama, pizzicato upper voices tightening toward the cut.
    note('cello_sus_b1', start, 40, span + 8, .14, .12, attack=.22)
    for fraction, pitch, velocity in [(0, 64, .23), (.22, 66, .24), (.45, 67, .28), (.64, 69, .27), (.78, 70, .32), (.9, 71, .36)]:
        note('violin_c4', start + round(span * fraction), pitch, 33, velocity, -.2)
    # The interruption stops the cadence. A single unresolved low note remains.
    note('cello_b1', cue['subtitleLoss'], 46, 56, .24, .18)
    noise(cue['pause'], .075, .13, 2400, 'space key')
    for offset, pitch, gain in [(0, 76, .105), (14, 83, .085), (32, 88, .07)]:
        note('glock_c5', cue['logoLift'] + offset, pitch, 68, gain, -.1 + offset / 80)
    noise(cue['logoLift'], .6, .09, 1600, 'logo lift', shape='swell')
    noise(cue['logoMouse'], .075, .12, 1400, 'palm to mouse')
    noise(cue['selectionPress'], .055, .17, 3400, 'mouse down')
    noise(cue['selectionEnd'], .055, .12, 3100, 'mouse up')
    noise(cue['ocr'], 1.25, .028, 4000, 'scan brush', shape='swell')
    note('marimba_c4', cue['local'], 64, 60, .19, -.15)
    note('violin_a2', cue['local'] + 24, 59, 45, .12, .2)
    for offset, pitch, gain in [(0, 64, .26), (5, 67, .2), (11, 71, .16)]:
        note('marimba_c4', cue['plate'] + offset, pitch, 76, gain, (offset - 5) / 20)
    noise(cue['plate'], .13, .13, 540, 'plate landing')
    note('cello_b1', cue['plate'], 40, 100, .21, .2)
    noise(cue['resume'], .06, .09, 2400, 'space key')
    # Last theatrical gesture, then only a pillow and a snack. No comic rimshot.
    note('violin_c4', cue['resume'] + 9, 71, 26, .19, -.2)
    note('violin_c4', cue['resume'] + 32, 76, 24, .16, -.2)
    noise(cue['pillow'], .17, .24, 620, 'pillow pat')
    noise(cue['lieDown'], .57, .12, 1100, 'body settles', shape='swell')
    # A barely audible room floor survives the intentional musical silence.
    room_n = int((cue['resolve'] - cue['lieDown']) / 60 * SR)
    room = filtered(rng.normal(0, .0018, (room_n, 2)), 1600)
    fade = min(9600, room_n // 2)
    room[:fade] *= np.linspace(0, 1, fade)[:, None]
    room[-fade:] *= np.linspace(1, 0, fade)[:, None]
    add(cue['lieDown'], room, name='room tone')
    for offset, gain, hz in [(0, .29, 6400), (2, .18, 4500), (6, .23, 7200), (11, .1, 3900), (17, .07, 3100)]:
        noise(cue['crunch'] + offset, .075, gain, hz, 'dry snack crunch', -.1)
    if 'swat' in cue:
        noise(cue['swat'] - 7, .19, .14, 2600, 'paw sweep', .35, 'swell')
        noise(cue['swat'], .07, .28, 1800, 'cloud tap', .3)
        note('violin_a2', cue['swat'] + 2, 62, 24, .12, .3)
    # The same motif resolves only when the pixel brand becomes the real mark.
    brand = shots['brand']['from']
    note('cello_b1', brand + 12, 40, 90, .25, .17)
    for offset, pitch, gain in [(20, 64, .31), (66, 67, .27), (120, 66, .23), (180, 64, .24)]:
        note('marimba_c4', brand + offset, pitch, 98, gain, -.12)
    note('glock_c5', cue['cleanBrand'], 76, 112, .065, .2)
    note('violin_a2', cue['cleanBrand'], 59, 72, .12, -.2)
    audio = filtered(audio, 35, 'highpass')
    audio[-int(.3 * SR):] *= np.linspace(1, 0, int(.3 * SR))[:, None] ** 2
    dry = ROOT / f'out/drama/drama-{aspect}-premaster.wav'
    wavfile.write(dry, SR, np.int16(np.clip(audio, -1, 1) * 32767))
    master = OUT / f'drama-{aspect}.wav'
    measure = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(dry), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    levels = json.loads(re.findall(r'\{[\s\S]*?\}', measure.stderr)[-1])
    filt = ('loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:'
            f'measured_I={levels["input_i"]}:measured_TP={levels["input_tp"]}:'
            f'measured_LRA={levels["input_lra"]}:measured_thresh={levels["input_thresh"]}:'
            f'offset={levels["target_offset"]}:print_format=json')
    render = subprocess.run(['ffmpeg', '-y', '-hide_banner', '-i', str(dry), '-af', filt, '-ar', str(SR), '-c:a', 'pcm_s24le', str(master)], capture_output=True, text=True, check=True)
    normalized = json.loads(re.findall(r'\{[\s\S]*?\}', render.stderr)[-1])
    correction = round(-14 - float(normalized['output_i']), 2)
    corrected = master.with_name(master.stem + '-trim.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(master), '-af', f'volume={correction}dB', '-c:a', 'pcm_s24le', str(corrected)], check=True)
    corrected.replace(master)
    report = {'aspect': aspect, 'firstPass': levels, 'master': normalized, 'trimDb': correction, 'events': events}
    (ROOT / f'out/drama/audio-{aspect}.json').write_text(json.dumps(report, indent=2))
    print(aspect, report['master'])


for aspect in ['landscape', 'vertical']:
    write_score(aspect)
