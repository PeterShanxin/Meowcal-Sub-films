"""Mux deliverables, decode-check them, and build the bilingual film review page."""
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
TIMING = json.loads((ROOT / 'src/timeline.json').read_text(encoding='utf-8'))['dramaFilm']
ENCODER = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
FONT = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
SMALL = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 16)
LABELS = dict(world='同一晚，同一部剧', viewers='三间客厅', buildup='我已经决定了——', loss='熟悉的译文断了', pause='先暂停', magic='拿出工具，框住日文', scan='读取文字 → 本机翻译', reveal='我要再睡五分钟', punchline='拍枕头，真的睡下', deadpan='空白 → 慢眨 → 半眯', languages='英文和法文也接上', snack='机械地咬一口', privacy='字幕留在本机', world_end='各扇窗亮起译文', brand='像素成为真实品牌')


def run(args):
    return subprocess.run([str(a) for a in args], check=True, capture_output=True, text=True)


def still(video, frame):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(frame / 60), '-i', str(video), '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'])
    return Image.open(io.BytesIO(raw)).convert('RGB')


def check(video, aspect, duration, size):
    meta = json.loads(run(['ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', video]).stdout)
    picture = next(s for s in meta['streams'] if s['codec_type'] == 'video')
    sound = next(s for s in meta['streams'] if s['codec_type'] == 'audio')
    assert (picture['width'], picture['height']) == size
    assert picture['codec_name'] == 'h264' and picture['pix_fmt'] == 'yuv420p'
    assert picture['r_frame_rate'] == '60/1' and int(picture['nb_read_frames']) == duration * 60
    assert abs(float(meta['format']['duration']) - duration) < .025
    assert sound['codec_name'] == 'aac' and sound['channels'] == 2 and sound['sample_rate'] == '48000'
    assert 300000 < int(sound['bit_rate']) < 335000
    run(['ffmpeg', '-v', 'error', '-i', video, '-f', 'null', '-'])
    meter = run(['ffmpeg', '-hide_banner', '-i', video, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-']).stderr
    levels = json.loads(re.findall(r'\{[\s\S]*?\}', meter)[-1])
    assert abs(float(levels['input_i']) + 14) <= .2, levels
    assert float(levels['input_tp']) <= -.6, levels
    cursor = 0
    for shot in TIMING[aspect]:
        assert shot['from'] == cursor and 0 <= shot['sample'] < shot['duration']
        cursor += shot['duration']
    assert cursor == duration * 60
    return dict(metadata=meta, loudness=levels, decode='pass', timeline='pass', sha256=hashlib.sha256(video.read_bytes()).hexdigest())


def contact(video, aspect, suffix):
    shots = []
    # Montage blocks contain more than one camera cut; show each cut in the board.
    for shot in TIMING[aspect]:
        samples = [(shot['sample'], LABELS[shot['kind']])]
        if shot['kind'] == 'viewers':
            samples = [(48, '栗子的客厅'), (148, 'Bean 的客厅'), (248, 'Bleu 的客厅')]
        elif shot['kind'] == 'loss':
            samples = [(24, '中文消失，日文仍在'), (96, '零食停住，寻找译文')]
        elif shot['kind'] == 'magic':
            samples = [(46, 'Logo 来到掌心'), (210 if aspect == 'vertical' else 250, '鼠标框住日文')]
        elif shot['kind'] == 'languages':
            samples = [(72, '日文 → 英文'), (154, 'Bean 的反应'), (252, '日文 → 法文'), (334, 'Bleu 的反应')]
        for i, (sample, label) in enumerate(samples):
            shots.append({**shot, 'sample': sample, 'label': label, 'id': shot['id'] + (chr(97 + i) if len(samples) > 1 else '')})
    w, h, cols = (480, 270, 3) if aspect == 'landscape' else (270, 480, 3)
    sheet = Image.new('RGB', (w * cols, math.ceil(len(shots) / cols) * (h + 64)), '#121e2b')
    draw = ImageDraw.Draw(sheet)
    for i, shot in enumerate(shots):
        frame = shot['from'] + shot['sample']
        pic = still(video, frame)
        pic.save(OUT / f'drama-{shot["id"]}.jpg', quality=94)
        x, y = i % cols * w, i // cols * (h + 64)
        sheet.paste(pic.resize((w, h), Image.Resampling.LANCZOS), (x, y))
        draw.text((x + 12, y + h + 6), shot['label'], font=SMALL if aspect == 'vertical' else FONT, fill='#e1e6e4')
        draw.text((x + 12, y + h + 34), f'{shot["id"]} · {frame/60:.2f}s', font=SMALL, fill='#93a8b6')
    sheet.save(OUT / f'drama-contact-{suffix}.jpg', quality=95)
    still(video, 2 * 60 if aspect == 'vertical' else 13 * 60).save(OUT / f'drama-poster-{suffix}.jpg', quality=95)


def reactions(video):
    frames = [984, 1050, 2342, 2388, 2405, 2450, 2490, 2910]
    sheet = Image.new('RGB', (4 * 480, 2 * 330), '#121e2b')
    draw = ImageDraw.Draw(sheet)
    for i, f in enumerate(frames):
        x, y = i % 4 * 480, i // 4 * 330
        sheet.paste(still(video, f).resize((480, 270)), (x, y))
        draw.text((x + 16, y + 280), f'{f/60:.2f}s', font=FONT, fill='#e1e6e4')
    sheet.save(OUT / 'drama-acting.jpg', quality=95)


def main():
    reports = {}
    for aspect, suffix, duration, size in [('landscape', '60', 60, (1920, 1080)), ('vertical', '30', 30, (1080, 1920))]:
        video = OUT / f'meowcal-sub-{suffix}s.mp4'
        run([ENCODER, '-v', 'error', '-y', '-i', ROOT / f'out/drama/picture-{aspect}.mp4', '-i', ROOT / f'public/audio/drama-{aspect}.wav', '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'libfdk_aac', '-b:a', '320k', '-ar', '48000', '-ac', '2', '-t', duration, '-movflags', '+faststart', video])
        reports[aspect] = check(video, aspect, duration, size)
        contact(video, aspect, suffix)
        if aspect == 'landscape':
            reactions(video)
        preview = OUT / f'meowcal-sub-{suffix}s.webm'
        run([ENCODER, '-v', 'error', '-y', '-i', video, '-vf', 'scale=960:540' if aspect == 'landscape' else 'scale=540:960', '-c:v', 'libvpx-vp9', '-threads', '2', '-deadline', 'realtime', '-cpu-used', '6', '-row-mt', '1', '-crf', '25', '-b:v', '0', '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '192k', preview])
        run(['ffmpeg', '-v', 'error', '-i', preview, '-f', 'null', '-'])
        print(aspect, reports[aspect]['loudness']['input_i'], 'LUFS; full decode pass', flush=True)
    (OUT / 'drama-qc.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / 'review.html').write_text('''<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meowcal Sub · 就差这一句</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0b1420;color:#e7eeea;font:16px/1.65 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1220px;margin:auto;padding:42px 28px 80px}header{max-width:850px;margin-bottom:30px}.eyebrow{font-size:12px;letter-spacing:.16em;color:#93acae}h1{font-size:38px;line-height:1.15;font-weight:550;margin:18px 0}p{color:#b0c0c9}a{color:#c6dcc8;text-underline-offset:4px}video{display:block;width:100%;background:#070d16;border:1px solid #324353;border-radius:5px}section{margin:36px 0 56px}.grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.65fr);gap:32px;align-items:start}.portrait{max-height:750px;object-fit:contain}h2{font-size:20px;font-weight:500}details{margin-top:24px;padding-top:20px;border-top:1px solid #2b3b4d}summary{cursor:pointer;color:#ccd9dc}img{width:100%;height:auto;display:block;margin-top:18px}small{color:#90a7b5}.links{display:flex;gap:20px;flex-wrap:wrap;margin-top:15px}@media(max-width:780px){.grid{grid-template-columns:1fr}main{padding:24px 16px}.portrait{max-height:680px}h1{font-size:30px}}</style>
<main><header><div class="eyebrow">MEOWCAL SUB / ORIGINAL PIXEL FILM</div><h1>就差这一句</h1><p>终于看懂了——原来只是要再睡五分钟。</p><small>原创像素角色 · 无对白 · 60 fps · 原创室内乐与音效</small></header>
<div class="grid"><section><h2>60 秒 · 横版</h2><video controls playsinline preload="metadata" poster="drama-poster-60.jpg" src="meowcal-sub-60s.webm"></video><div class="links"><a href="meowcal-sub-60s.mp4" download>下载 1920 × 1080 MP4</a><a href="drama-contact-60.jpg" target="_blank">镜头联系表</a></div></section>
<section><h2>30 秒 · 竖版</h2><video class="portrait" controls playsinline preload="metadata" poster="drama-poster-30.jpg" src="meowcal-sub-30s.webm"></video><div class="links"><a href="meowcal-sub-30s.mp4" download>下载 1080 × 1920 MP4</a><a href="drama-contact-30.jpg" target="_blank">镜头联系表</a></div></section></div>
<p>两次停住：第一次是没看懂；第二次是看懂以后，才发现真的只有这么回事。</p>
<details><summary>表演关键帧</summary><img src="drama-acting.jpg" alt="字幕中断的睁眼与停爪，揭晓后的慢眨眼和半眯，以及最后的零食动作"></details>
<details><summary>完整横版联系表</summary><img src="drama-contact-60.jpg" alt="60 秒影片逐镜头联系表"></details>
<details><summary>完整竖版联系表</summary><img src="drama-contact-30.jpg" alt="30 秒影片逐镜头联系表"></details>
<section><div class="links"><a href="meowcal-sub-source.zip" download>下载源码与声音素材</a><a href="drama-qc.json">媒体校验报告</a></div><p><small>下载版：H.264 · AAC 320 kbps 立体声 · 48 kHz · −14 LUFS。页面使用 WebM 预览。原创乐谱使用 VSCO 2 CE 的 CC0 乐器采样，许可与出处随源码保存。<br>片中演示读取已有画面文字、Windows OCR、本机翻译与同宽译文底板。示例台词为编写文案，动作按叙事节奏剪辑。品牌变清晰是片尾设计。</small></p></section></main></html>''', encoding='utf-8')


if __name__ == '__main__':
    main()
