"""Mux deliverables, decode-check them, and build the film review page."""
import hashlib
import io
import json
import math
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out/story'
OUT.mkdir(exist_ok=True, parents=True)
CUTS = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['dramaFilm']['cuts']
ENCODER = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
FONT = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
SMALL = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 16)
LABELS = dict(world='同一晚，同一部剧', viewers='三间客厅', buildup='我已经决定了——', loss='熟悉的译文断了', pause='先暂停', magic='拿出工具，框住日文',
              scan='读取文字 → 本机翻译', reveal='我要再睡五分钟', punchline='拍枕头，真的睡下', deadpan='瞳孔缩成缝 → 慢眨 → 飞机耳', languages='英文和法文也接上',
              snack='机械地咬一口', privacy='小云来偷字幕', world_end='小云悻悻离开', brand='像素成为真实品牌')
# picture file, cut, deliverable name, frame size, contact-sheet suffix (None: no sheet)
DELIVERABLES = [
    ('picture-60', 'full', 'meowcal-sub-60s', (1920, 1080), '60'),
    ('picture-60-vertical', 'full', 'meowcal-sub-60s-vertical', (1080, 1920), '60v'),
    ('picture-30', 'short', 'meowcal-sub-30s', (1080, 1920), '30'),
    ('picture-60-en', 'full', 'meowcal-sub-60s-en', (1920, 1080), None),
]


def run(args):
    return subprocess.run([str(a) for a in args], check=True, capture_output=True, text=True)


def still(video, frame):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(frame / 60), '-i', str(video), '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'])
    return Image.open(io.BytesIO(raw)).convert('RGB')


def check(video, cut, size):
    duration = cut['duration'] // 60
    meta = json.loads(run(['ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', video]).stdout)
    picture = next(s for s in meta['streams'] if s['codec_type'] == 'video')
    sound = next(s for s in meta['streams'] if s['codec_type'] == 'audio')
    assert (picture['width'], picture['height']) == size
    assert picture['codec_name'] == 'h264' and picture['pix_fmt'] == 'yuv420p'
    assert picture['r_frame_rate'] == '60/1' and int(picture['nb_read_frames']) == cut['duration']
    assert abs(float(meta['format']['duration']) - duration) < .025
    assert sound['codec_name'] == 'aac' and sound['channels'] == 2 and sound['sample_rate'] == '48000'
    assert 300000 < int(sound['bit_rate']) < 335000
    run(['ffmpeg', '-v', 'error', '-i', video, '-f', 'null', '-'])
    meter = run(['ffmpeg', '-hide_banner', '-i', video, '-af', 'loudnorm=I=-14:TP=-1:LRA=15:print_format=json', '-f', 'null', '-']).stderr
    levels = json.loads(re.findall(r'\{[\s\S]*?\}', meter)[-1])
    assert abs(float(levels['input_i']) + 14) <= .3, levels
    assert float(levels['input_tp']) <= -1, levels
    cursor = 0
    for shot in cut['shots']:
        assert shot['from'] == cursor and 0 <= shot['sample'] < shot['duration']
        cursor += shot['duration']
    assert cursor == cut['duration']
    return dict(metadata=meta, loudness=levels, decode='pass', timeline='pass', sha256=hashlib.sha256(video.read_bytes()).hexdigest())


def samples(shot, short):
    # Montage blocks contain more than one camera set-up; show each in the board.
    kind = shot['kind']
    if kind == 'viewers':
        return [(48, '栗子的客厅'), (148, 'Bean 的客厅（砖墙）'), (248, 'Bleu 的客厅（石墙）')]
    if kind == 'buildup':
        return [(40, 'Momo 开口（猫语）'), (shot['sample'], LABELS[kind])]
    if kind == 'loss':
        return [(24, '中文消失，日文仍在'), (56, '一愣：炸毛、圆瞳'), (150, '寻找译文')]
    if kind == 'magic':
        return [(46, 'Logo 来到掌心'), (210 if short else 250, '鼠标框住日文')]
    if kind == 'scan':
        return [(10, 'Windows OCR 读取'), (60, '本机翻译')]
    if kind == 'deadpan':
        picks = [(20, '瞳孔缩成缝'), (60, '慢眨'), (128, '飞机耳，尾巴瘫下')]
        return picks if short else picks + [(165, '小云在窗外偷看')]
    if kind == 'snack' and not short:
        return [(32, '机械地咬一口'), (90, '小云贴上玻璃')]
    if kind == 'languages':
        return [(72, '日文 → 英文'), (154, 'Bean 的反应'), (252, '日文 → 法文'), (334, 'Bleu 的反应')]
    if kind == 'privacy':
        return [(20, '小云在窗外'), (52, '挤进窗户'), (120, '踮脚飘过客厅'), (185, '拽住译文'), (220, '眼珠斜过去'), (247, '一爪拍开'), (300, '本地 AI，字幕不上云')]
    return [(shot['sample'], LABELS[kind])]


def contact(video, cut, suffix, size):
    portrait = size[1] > size[0]
    tiles = []
    for shot in cut['shots']:
        picks = samples(shot, cut['duration'] < 3000)
        for i, (sample, label) in enumerate(picks):
            tiles.append((shot['from'] + sample, label, shot['id'] + (chr(97 + i) if len(picks) > 1 else '')))
    w, h, cols = (270, 480, 5) if portrait else (480, 270, 3)
    sheet = Image.new('RGB', (w * cols, math.ceil(len(tiles) / cols) * (h + 64)), '#121e2b')
    draw = ImageDraw.Draw(sheet)
    for i, (frame, label, name) in enumerate(tiles):
        pic = still(video, frame)
        pic.save(OUT / f'drama-{suffix}-{name}.jpg', quality=92)
        x, y = i % cols * w, i // cols * (h + 64)
        sheet.paste(pic.resize((w, h), Image.Resampling.LANCZOS), (x, y))
        draw.text((x + 10, y + h + 6), label, font=SMALL if portrait else FONT, fill='#e1e6e4')
        draw.text((x + 10, y + h + 34), f'{name} · {frame / 60:.2f}s', font=SMALL, fill='#93a8b6')
    sheet.save(OUT / f'drama-contact-{suffix}.jpg', quality=93)
    still(video, 13 * 60 if cut['duration'] > 3000 else 2 * 60).save(OUT / f'drama-poster-{suffix}.jpg', quality=93)


def acting(video, cut):
    cue, at = cut['cues'], {s['kind']: s['from'] for s in cut['shots']}
    frames = [(cue['reactionCut'] + 8, '一愣'), (cue['reactionCut'] + 52, '寻找译文'), (cue['deadpan'] + 20, '瞳孔缩成缝'), (cue['slowBlink'] + 12, '慢眨'),
              (cue['deadpan'] + 128, '飞机耳 + 尾巴瘫下'), (at['languages'] + 150, 'Bean'), (at['languages'] + 330, 'Bleu'), (cue['swat'] - 30, '眼珠斜向小云')]
    sheet = Image.new('RGB', (4 * 480, 2 * 330), '#121e2b')
    draw = ImageDraw.Draw(sheet)
    for i, (f, label) in enumerate(frames):
        x, y = i % 4 * 480, i // 4 * 330
        sheet.paste(still(video, f).resize((480, 270)), (x, y))
        draw.text((x + 16, y + 280), f'{f / 60:.2f}s · {label}', font=FONT, fill='#e1e6e4')
    sheet.save(OUT / 'drama-acting.jpg', quality=93)


def main():
    reports = {}
    for picture, cut_name, name, size, suffix in DELIVERABLES:
        cut = CUTS[cut_name]
        video = OUT / f'{name}.mp4'
        run([ENCODER, '-v', 'error', '-y', '-i', ROOT / f'out/drama/{picture}.mp4', '-i', ROOT / f'public/audio/drama-{cut_name}.wav',
             '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'libfdk_aac', '-b:a', '320k', '-ar', '48000', '-ac', '2',
             '-t', cut['duration'] // 60, '-movflags', '+faststart', video])
        reports[name] = check(video, cut, size)
        if suffix:
            contact(video, cut, suffix, size)
        if name == 'meowcal-sub-60s':
            acting(video, cut)
        preview = OUT / f'{name}.webm'
        scale = 'scale=960:540' if size[0] > size[1] else 'scale=540:960'
        run([ENCODER, '-v', 'error', '-y', '-i', video, '-vf', scale, '-c:v', 'libvpx-vp9', '-threads', '2', '-deadline', 'realtime', '-cpu-used', '6', '-row-mt', '1',
             '-crf', '25', '-b:v', '0', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '192k', preview])
        run(['ffmpeg', '-v', 'error', '-i', preview, '-f', 'null', '-'])
        print(name, reports[name]['loudness']['input_i'], 'LUFS; full decode pass', flush=True)
    (OUT / 'drama-qc.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / 'review.html').write_text('''<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meowcal Sub · 就差这一句</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0b1420;color:#e7eeea;font:16px/1.65 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1260px;margin:auto;padding:42px 28px 80px}header{max-width:850px;margin-bottom:30px}.eyebrow{font-size:12px;letter-spacing:.16em;color:#93acae}h1{font-size:38px;line-height:1.15;font-weight:550;margin:18px 0}p{color:#b0c0c9}a{color:#c6dcc8;text-underline-offset:4px}video{display:block;width:100%;background:#070d16;border:1px solid #324353;border-radius:5px}section{margin:30px 0 48px}.row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(220px,.55fr) minmax(220px,.55fr);gap:26px;align-items:start}.portrait{max-height:720px;object-fit:contain}h2{font-size:19px;font-weight:500}details{margin-top:24px;padding-top:20px;border-top:1px solid #2b3b4d}summary{cursor:pointer;color:#ccd9dc}img{width:100%;height:auto;display:block;margin-top:18px}small{color:#90a7b5}.links{display:flex;gap:18px;flex-wrap:wrap;margin-top:12px}@media(max-width:900px){.row{grid-template-columns:1fr}main{padding:24px 16px}h1{font-size:30px}}</style>
<main><header><div class="eyebrow">MEOWCAL SUB / ORIGINAL PIXEL FILM</div><h1>就差这一句</h1><p>终于看懂了——原来只是要再睡五分钟。</p><small>原创像素角色 · 猫语台词 · 60 fps · 原创配乐与音效</small></header>
<div class="row">
<section><h2>60 秒 · 横版</h2><video controls playsinline preload="metadata" poster="drama-poster-60.jpg" src="meowcal-sub-60s.webm"></video><div class="links"><a href="meowcal-sub-60s.mp4" download>1920 × 1080 MP4</a><a href="meowcal-sub-60s-en.mp4" download>English MP4</a><a href="drama-contact-60.jpg" target="_blank">联系表</a></div></section>
<section><h2>60 秒 · 竖版</h2><video class="portrait" controls playsinline preload="metadata" poster="drama-poster-60v.jpg" src="meowcal-sub-60s-vertical.webm"></video><div class="links"><a href="meowcal-sub-60s-vertical.mp4" download>1080 × 1920 MP4</a><a href="drama-contact-60v.jpg" target="_blank">联系表</a></div></section>
<section><h2>30 秒 · 竖版</h2><video class="portrait" controls playsinline preload="metadata" poster="drama-poster-30.jpg" src="meowcal-sub-30s.webm"></video><div class="links"><a href="meowcal-sub-30s.mp4" download>1080 × 1920 MP4</a><a href="drama-contact-30.jpg" target="_blank">联系表</a></div></section>
</div>
<p>电视里的剧有自己的声音：Momo 用猫语念台词，剧内弦乐一路推到“我已经决定了——”。按下暂停，所有声音一起停。</p>
<details><summary>表演关键帧</summary><img src="drama-acting.jpg" alt="一愣、寻找译文、瞳孔缩成缝、慢眨、飞机耳与尾巴瘫下、Bean 与 Bleu 的反应、机械地咬一口"></details>
<details><summary>60 秒横版联系表</summary><img src="drama-contact-60.jpg" alt="60 秒横版逐镜头联系表"></details>
<details><summary>60 秒竖版联系表</summary><img src="drama-contact-60v.jpg" alt="60 秒竖版逐镜头联系表"></details>
<details><summary>30 秒竖版联系表</summary><img src="drama-contact-30.jpg" alt="30 秒竖版逐镜头联系表"></details>
<section><div class="links"><a href="drama-qc.json">媒体校验报告</a></div><p><small>下载版：H.264 · AAC 320 kbps 立体声 · 48 kHz · −14 LUFS。页面使用 WebM 预览。乐器采样来自 VSCO 2 CE（CC0），猫叫录音来自 Wikimedia Commons（CC0 / 公有领域），出处与校验值随源码保存。<br>片中演示读取已有画面文字、Windows OCR、本机翻译与同宽译文底板；翻译发生在暂停之后，画面里没有声音在播。示例台词为编写文案，动作按叙事节奏剪辑。品牌变清晰是片尾设计。</small></p></section></main></html>''', encoding='utf-8')


if __name__ == '__main__':
    main()
