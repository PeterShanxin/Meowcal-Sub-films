"""Score and sound for the film, placed on the frames in src/timeline.json.

Upright piano and cello are CC0 recordings (see README). Everything else is
procedural: each film's room tone, the crossing bell, rain, projector, slides,
rewind, key and mouse clicks. Run from the repository root:
python talking-about-you/audio/score.py
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, resample_poly, sosfilt

FILM = Path(__file__).resolve().parent.parent
SAMPLES = FILM / 'audio' / 'samples'
OUT = FILM / 'public' / 'audio' / 'score.wav'
SR = 48000
T = json.loads((FILM / 'src' / 'timeline.json').read_text(encoding='utf-8'))
FPS = T['fps']
N = int(T['duration'] / FPS * SR)
rng = np.random.default_rng(7)


def at(frame):
    return int(frame / FPS * SR)


def load(name):
    sr, x = wavfile.read(SAMPLES / f'{name}.wav')
    x = x.astype(np.float64)
    x /= np.abs(x).max()
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    onset = int(np.argmax(np.abs(x).max(axis=1) > 0.05))
    return sr, x[max(0, onset - 64):]


_cache = {}


def voice(prefix, roots, midi, seconds):
    """A recording of the nearest root, resampled to the wanted pitch at 48 kHz."""
    root = min(roots, key=lambda r: abs(r - midi))
    key = (prefix, root, midi)
    if key not in _cache:
        sr, x = load(f'{prefix}_{root}')
        ratio = 2 ** ((midi - root) / 12) * sr / SR
        _cache[key] = resample_poly(x, 1000, int(round(1000 * ratio)), axis=0)
    return _cache[key][: int(seconds * SR)].copy()


PIANO_ROOTS = list(range(29, 78, 4))
CELLO_ROOTS = [40, 43]


def put(mix, frame, x, gain, pan=0.0):
    start = at(frame)
    x = x[: max(0, N - start)]
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[start:start + len(x), 0] += x[:, 0] * gain * left * 1.414
    mix[start:start + len(x), 1] += x[:, 1] * gain * right * 1.414


def piano(mix, frame, midi, gain, seconds=9.0, pan=0.0):
    x = voice('piano', PIANO_ROOTS, midi, seconds)
    fade = int(1.5 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    put(mix, frame, x, gain, pan)


def cello(mix, start, end, midi, gain):
    x = voice('cello_sus', CELLO_ROOTS, midi, (end - start) / FPS)
    n = len(x)
    env = np.minimum(1, np.arange(n) / (1.6 * SR)) * np.minimum(1, (n - np.arange(n)) / (1.8 * SR))
    put(mix, start, x * env[:, None], gain)


def noise(seconds, low, high, seed):
    g = np.random.default_rng(seed)
    x = g.standard_normal((max(1, int(seconds * SR)), 2))
    x = sosfilt(butter(2, [low, high], btype='band', fs=SR, output='sos'), x, axis=0)
    return x / np.abs(x).max()


def stereo(x):
    return np.stack([x, x], axis=1)


def click(mix, frame, gain, bright):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    x = 0.6 * np.sin(2 * np.pi * bright * t) * np.exp(-t / 0.0035) + 0.5 * rng.standard_normal(n) * np.exp(-t / 0.0012)
    put(mix, frame, stereo(x), gain)


def room(scene, frames):
    """The sound of one film for `frames` frames, starting at its own zero."""
    seconds = frames / FPS
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    if scene == 0:  # crossing: rail rumble and the warning bell
        out += 0.1 * noise(seconds, 30, 220, 1)[:n]
        beat = (t * 2.2) % 1.0
        tone = np.where((t * 2.2).astype(int) % 2 == 0, 698.0, 740.0)
        bell = np.sin(2 * np.pi * np.cumsum(tone) / SR) * np.exp(-beat / 0.16)
        out += stereo(0.05 * bell)
    elif scene == 1:  # rain on a street
        out += 0.05 * noise(seconds, 900, 9000, 2)[:n] + 0.035 * noise(seconds, 150, 600, 3)[:n]
    elif scene == 2:  # office: a quiet room and a ceiling fan
        out += 0.03 * noise(seconds, 80, 400, 4)[:n] * (0.7 + 0.3 * np.sin(2 * np.pi * 2.6 * t))[:, None]
    elif scene == 3:  # rooftops: open air
        out += 0.028 * noise(seconds, 200, 1800, 5)[:n] * (0.75 + 0.25 * np.sin(2 * np.pi * 0.31 * t))[:, None]
    else:  # silent film: the projector
        out += 0.02 * noise(seconds, 300, 2400, 6)[:n]
        tick = ((t * 16) % 1.0)
        out += stereo(0.035 * np.exp(-tick / 0.012) * np.sin(2 * np.pi * 1900 * t))
    return out


def bed(mix, start, end, scene, gain=1.0):
    x = room(scene, end - start) * gain
    ramp = int(0.03 * SR)
    x[:ramp] *= np.linspace(0, 1, ramp)[:, None]
    x[-ramp:] *= np.linspace(1, 0, ramp)[:, None]
    put(mix, start, x, 1.0)


def sweep(mix, start, frames, low, high, gain, flutter=0.0):
    """Filtered noise moving in pitch: a film sliding past, or a tape winding back."""
    n = int(frames / FPS * SR)
    t = np.arange(n) / n
    x = rng.standard_normal(n)
    centre = low * (high / low) ** t
    phase = np.cumsum(2 * np.pi * centre / SR)
    body = np.sin(phase) * 0.6 + x * 0.25
    env = np.sin(np.pi * t) ** 1.5
    if flutter:
        env = env * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * flutter * np.arange(n) / SR)))
    put(mix, start, stereo(body * env), gain)


def main():
    cuts = T['pass2']['cuts']
    plates = T['pass2']['plates']
    step = T['pass1']['step']
    slide = T['slide']
    end = T['end']
    music = np.zeros((N, 2))
    world = np.zeros((N, 2))

    # First pass: five films in eight seconds, one rising bass note each.
    for i, note in enumerate([38, 42, 45, 47, 50]):
        stop = step * (i + 1) if i < 4 else T['twist']['dim']
        bed(world, step * i, stop, i)
        piano(music, step * i, note, 0.4)
        piano(music, step * i + 3, note + 7, 0.2)
        if i:
            sweep(world, step * i - slide, slide + 4, 500, 1800, 0.07)
    # Fable speaks over the fifth film, held quieter.
    bed(world, T['twist']['dim'], T['rewind']['start'], 4, gain=0.35)
    piano(music, T['twist']['says'][1]['start'], 33, 0.34)
    sweep(world, T['rewind']['start'], T['rewind']['end'] - T['rewind']['start'], 300, 2600, 0.09, flutter=22)

    # Second pass: the box is drawn and each film answers with one melody note.
    for i in range(5):
        stop = cuts[i + 1] if i < 4 else end['start'] + 20
        bed(world, cuts[i], stop, i)
        if i:
            sweep(world, cuts[i] - slide, slide + 4, 500, 1800, 0.06)
    for cut, bass in zip(cuts, [38, 35, 31, 33, 33]):
        piano(music, cut, bass, 0.38)
    for plate, note in zip(plates[:4], [66, 64, 69, 67]):
        piano(music, plate, note, 0.4, pan=0.15)
    last = plates[4]
    cello(music, cuts[4] + 6, last + 30, 45, 0.15)
    cello(music, last - 6, end['wordmark'] + 60, 38, 0.2)
    piano(music, last, 38, 0.5)
    piano(music, last + 2, 45, 0.3)
    for i, note in enumerate([66, 69, 74]):
        piano(music, last + i * 20, note, 0.44 - i * 0.03, pan=0.15)

    piano(music, end['mark'], 50, 0.3)
    piano(music, end['wordmark'], 57, 0.26)
    piano(music, end['wordmark'] + 25, 66, 0.26, pan=0.15)
    outro = T['outro'][0]
    piano(music, outro['start'], 45, 0.28)
    piano(music, outro['signAt'], 38, 0.3)
    for i, note in enumerate([62, 66, 69]):
        piano(music, outro['signAt'] + i * 12, note, 0.32, pan=0.15)

    # Fable types: one key per character, at the picture's typing rate.
    for say in T['twist']['says'] + T['outro']:
        for i in range(len(say['big'])):
            click(world, say['start'] + i * 3, 0.09 + 0.06 * rng.random(), 1100 + 500 * rng.random())
    click(world, T['drag']['press'], 0.22, 2400)
    click(world, T['drag']['release'], 0.16, 3100)

    # One small room around the instruments.
    tail = np.arange(int(1.6 * SR)) / SR
    impulse = np.random.default_rng(11).standard_normal((len(tail), 2)) * np.exp(-tail / 0.38)[:, None]
    impulse /= np.sqrt((impulse ** 2).sum(axis=0))
    wet = np.stack([fftconvolve(music[:, c], impulse[:, c])[:N] for c in (0, 1)], axis=1)
    mix = music + 0.16 * wet + world

    fade = int(0.6 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
    mix *= 0.7 / np.abs(mix).max()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    raw = OUT.with_name('score-raw.wav')
    wavfile.write(raw, SR, (mix * 32767).astype(np.int16))
    # Online loudness: -14 LUFS integrated, true peak under -1 dBTP.
    measure = subprocess.run(
        ['ffmpeg', '-hide_banner', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
        capture_output=True, text=True, check=True,
    ).stderr
    m = json.loads(measure[measure.rindex('{'):measure.rindex('}') + 1])
    chain = (
        f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
        f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    )
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(raw), '-af', chain, '-ar', str(SR), '-c:a', 'pcm_s24le', str(OUT)], check=True)
    raw.unlink()
    print('wrote', OUT)


if __name__ == '__main__':
    main()
