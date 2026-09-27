param(
    [string]$NodePath = 'node',
    [string]$BrowserPath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
New-Item -ItemType Directory -Force out/drama, out/story | Out-Null
Set-Content -LiteralPath out/drama/silent.json -Value '{"sound":false}'
python audio/fetch_drama_samples.py
if ($LASTEXITCODE -ne 0) { throw 'Sample download failed' }
python audio/synth.py --drama
if ($LASTEXITCODE -ne 0) { throw 'Audio rendering failed' }
& $NodePath node_modules/typescript/bin/tsc --noEmit
if ($LASTEXITCODE -ne 0) { throw 'Typecheck failed' }
foreach ($film in @(@('CatDrama60', 'landscape'), @('CatDrama30Vertical', 'vertical'))) {
    & $NodePath node_modules/@remotion/cli/remotion-cli.js render $film[0] "out/drama/picture-$($film[1]).mp4" --props=out/drama/silent.json --concurrency=1 --crf=17 --x264-preset=veryfast --gl=swangle --timeout=60000 "--browser-executable=$BrowserPath"
    if ($LASTEXITCODE -ne 0) { throw "Picture rendering failed: $($film[0])" }
}
python scripts/drama_review.py
if ($LASTEXITCODE -ne 0) { throw 'Mastering or verification failed' }
