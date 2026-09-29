"""Build WebM review files and one still per shot for the pixel story."""
import io
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out/story'
TIMING = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['pixelFilm']
ENCODER = ROOT.parent / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
FONT = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 18)


def still(video, frame):
    raw = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(frame / 60), '-i', str(video),
        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'
    ])
    return Image.open(io.BytesIO(raw)).convert('RGB')


def encode_webm(source, destination):
    subprocess.run([
        str(ENCODER), '-v', 'error', '-y', '-i', str(source), '-an',
        '-c:v', 'libvpx-vp9', '-threads', '2', '-deadline', 'realtime',
        '-cpu-used', '6', '-row-mt', '1', '-crf', '25', '-b:v', '0',
        '-pix_fmt', 'yuv420p', str(destination)
    ], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(destination), '-f', 'null', '-'], check=True)


def wrap(text, limit):
    lines, line = [], ''
    for char in text:
        if FONT.getlength(line + char) > limit:
            lines.append(line)
            line = ''
        line += char
    return lines + [line]


def main():
    checks = {}
    for direction, suffix, expected, tile in [
        ('landscape', '60', 3600, (480, 270, 4)),
        ('vertical', '30', 1800, (270, 480, 3)),
    ]:
        shots = TIMING[direction]
        cursor = 0
        for shot in shots:
            assert shot['from'] == cursor, f'Timeline gap at {shot["id"]}'
            assert 0 <= shot['sample'] < shot['duration']
            cursor += shot['duration']
        assert cursor == expected
        video = OUT / f'pixel-story-{suffix}.mp4'
        metadata = json.loads(subprocess.check_output([
            'ffprobe', '-v', 'error', '-count_frames', '-show_streams',
            '-show_format', '-of', 'json', str(video)
        ]))
        stream = metadata['streams'][0]
        assert len(metadata['streams']) == 1
        assert stream['codec_name'] == 'h264'
        assert stream['r_frame_rate'] == '60/1'
        assert int(stream['nb_read_frames']) == expected
        encode_webm(video, video.with_suffix('.webm'))
        w, h, columns = tile
        sheet = Image.new('RGB', (w * columns, (h + 66) * math.ceil(len(shots) / columns)), '#101a29')
        draw = ImageDraw.Draw(sheet)
        for i, shot in enumerate(shots):
            frame = shot['from'] + shot['sample']
            image = still(video, frame)
            image.save(OUT / f'pixel-{shot["id"]}.png')
            x, y = i % columns * w, i // columns * (h + 66)
            sheet.paste(image.resize((w, h), Image.Resampling.NEAREST), (x, y))
            label = f'{shot["id"]} · {shot["from"] / 60:g}s  {shot["label"]}'
            for row, line in enumerate(wrap(label, w - 24)):
                draw.text((x + 12, y + h + 7 + row * 24), line, font=FONT, fill='#d0d9e4')
        sheet.save(OUT / f'pixel-contact-{direction}.jpg', quality=96)
        final = still(video, expected - 1)
        reference = Image.open(ROOT / f'public/pixel-film/brand-{direction}.png').convert('RGB').resize(final.size, Image.Resampling.LANCZOS)
        difference = float(np.abs(np.asarray(final).astype(float) - np.asarray(reference).astype(float)).mean())
        assert difference < 8, 'Final brand must match the canonical clean lockup'
        checks[direction] = {
            'duration': float(metadata['format']['duration']), 'frames': expected,
            'fps': stream['r_frame_rate'], 'size': [stream['width'], stream['height']],
            'shots': len(shots), 'timeline_contiguous': True, 'silent': True,
            'webm_decode': 'pass', 'final_brand_mean_rgb_difference': round(difference, 3),
        }
    movie = OUT / 'pixel-story-60.mp4'
    strip = Image.new('RGB', (1920, 316), '#101a29')
    draw = ImageDraw.Draw(strip)
    for i, (frame, label) in enumerate([(3372, '像素品牌'), (3420, '像素逐步细化'), (3468, '轮廓变清晰'), (3540, '真实品牌落版')]):
        image = still(movie, frame)
        strip.paste(image.resize((480, 270), Image.Resampling.LANCZOS), (i * 480, 0))
        draw.text((i * 480 + 16, 284), label, font=FONT, fill='#d0d9e4')
    strip.save(OUT / 'pixel-brand-resolve.jpg', quality=97)
    subprocess.run([
        str(ENCODER), '-v', 'error', '-y', '-ss', '55', '-i', str(movie), '-t', '5',
        '-an', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
        str(OUT / 'pixel-ending-5.mp4')
    ], check=True)
    encode_webm(OUT / 'pixel-ending-5.mp4', OUT / 'pixel-ending-5.webm')
    (OUT / 'pixel-verification.json').write_text(json.dumps(checks, indent=2), encoding='utf-8')
    html = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meowcal Sub · 像素故事</title>
<style>*{box-sizing:border-box}body{margin:0;background:#07090f;color:#f5f7ff;font:16px/1.65 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1160px;padding:30px 26px 70px;margin:auto}small{color:#8d9ab4;font-size:12px;letter-spacing:2px}h1{font-size:31px;font-weight:500;line-height:1.35}h2{font-size:21px;font-weight:500;margin:36px 0 12px}p{color:#c0c9dc}video{display:block;width:100%;background:#121927;border-radius:5px}a{color:#c0c9dc;text-underline-offset:4px}button{font:inherit;border:1px solid #465268;background:#151b28;color:#e8eef7;padding:9px 16px;border-radius:7px;margin:0 8px 15px 0;cursor:pointer}button:first-child{background:#e8eef7;color:#10141d}.portrait{max-width:360px;margin:20px auto}img{width:100%;display:block}details{margin:25px 0}summary{cursor:pointer;color:#c0c9dc;padding:10px 0}footer{font-size:14px;color:#8d9ab4;margin-top:20px}.downloads{font-size:14px;margin-top:10px}.strip{margin:24px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}@media(max-width:700px){main{padding:22px 18px}h1{font-size:25px}.pair{grid-template-columns:1fr}}</style>
<main><small>MEOWCAL SUB / PIXEL STORY</small><h1>像素世界，清晰落版。</h1><p>开头进入猫猫的客厅，遇到字幕障碍后再让 App 登场。结尾从像素品牌逐渐细化为真实 Logo 和字标。</p>
<p>60 秒横版 / 30 秒竖版 · 动态分镜 · 无配乐<br><small>演示按叙事节奏剪辑，不是处理速度测量。</small></p>
<button id="start">横版从头播放</button><button id="ending">直接看 55 秒结尾</button>
<video id="main" controls playsinline preload="metadata" poster="pixel-P02.png" src="pixel-story-60.webm"></video>
<div class="downloads"><a href="pixel-story-60.mp4" download>横版 MP4</a> · <a href="pixel-story-30.mp4" download>竖版 MP4</a> · <a href="pixel-ending-5.mp4" download>单独下载 5 秒结尾</a></div>
<div class="strip"><a href="pixel-brand-resolve.jpg"><img src="pixel-brand-resolve.jpg" alt="像素品牌逐步细化，成为真实品牌"></a></div>
<section class="pair"><div><h2>30 秒竖版</h2><div class="portrait"><video controls playsinline preload="metadata" poster="pixel-V01.png" src="pixel-story-30.webm"></video></div></div><div><h2>5 秒结尾</h2><video controls playsinline preload="metadata" poster="pixel-P20.png" src="pixel-ending-5.webm"></video><p>选框收拢，像素变细，清晰品牌停留约 2 秒。变化只发生在品牌收尾。</p><p>创意概念：让不同语言的猫，看懂彼此的小日常。</p></div></section>
<details><summary>展开 60 秒完整联系表 · 20 镜</summary><a href="pixel-contact-landscape.jpg"><img src="pixel-contact-landscape.jpg" alt="横版每镜一帧，20 镜"></a></details>
<details><summary>展开 30 秒完整联系表 · 9 镜</summary><a href="pixel-contact-vertical.jpg"><img src="pixel-contact-vertical.jpg" alt="竖版每镜一帧，9 镜"></a></details>
<footer>当前用于确认叙事、镜头和品牌收尾；正式交付仍需配乐、音效、混音和全分辨率导出。<br><a href="style-review.html">前一轮风格对比</a></footer>
</main><script>const video=document.getElementById('main');document.getElementById('start').onclick=()=>{video.currentTime=0;video.play()};document.getElementById('ending').onclick=()=>{video.currentTime=55;video.play();video.scrollIntoView({block:'center',behavior:'smooth'})};</script></html>'''
    (OUT / 'pixel-review.html').write_text(html, encoding='utf-8')
    (OUT / 'review.html').write_text(html, encoding='utf-8')
    print(json.dumps(checks, indent=2))


if __name__ == '__main__':
    main()
