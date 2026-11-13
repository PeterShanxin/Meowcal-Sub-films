"""Package the approved video, cover and UTF-8 publication copy."""
from hashlib import sha256
from html import escape
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'out'


def main():
    text = (ROOT / 'description.zh-CN.md').read_text(encoding='utf-8')
    copy = OUT / 'description.zh-CN.txt'
    copy.write_bytes(text.encode('utf-8-sig'))
    (OUT / 'description.html').write_text(
        '<!doctype html><html lang="zh-CN"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>发布文案 · Meowcal Sub</title>'
        '<style>body{max-width:48em;margin:40px auto;padding:0 24px;'
        'font:18px/1.8 "Microsoft YaHei",sans-serif;color:#20252a;background:#efe9dc}'
        'pre{white-space:pre-wrap;font:inherit}a{color:#4b4377}</style>'
        '<pre>' + escape(text) + '</pre>'
        '<a href="description.zh-CN.txt" download>下载文案 TXT</a></html>',
        encoding='utf-8',
    )
    files = [OUT / 'meowcal-reading-test-v1.mp4', OUT / 'cover-v1.png', copy]
    bundle = OUT / 'Meowcal-Sub-reading-test-v1.zip'
    with ZipFile(bundle, 'w', ZIP_DEFLATED) as archive:
        for file in files:
            archive.write(file, arcname=file.name)
    with ZipFile(bundle) as archive:
        assert archive.testzip() is None
        assert archive.namelist() == [p.name for p in files]
        for file in files:
            assert sha256(archive.read(file.name)).digest() == sha256(file.read_bytes()).digest()
        assert archive.read(copy.name).decode('utf-8-sig') == text
    print(f'Verified three-file package: {bundle}')


if __name__ == '__main__':
    main()
