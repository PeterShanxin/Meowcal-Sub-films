param(
    [string]$NodePath = 'node',
    [string]$BrowserPath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    [int]$Concurrency = 1
)
$ErrorActionPreference = 'Stop'
# Everything runs from the repository root, where node_modules and remotion.config.ts live.
Set-Location (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)
New-Item -ItemType Directory -Force cat-drama/out/drama, cat-drama/out/story | Out-Null
python cat-drama/audio/fetch_drama_samples.py
if ($LASTEXITCODE -ne 0) { throw 'Sample download failed' }
python cat-drama/audio/drama.py
if ($LASTEXITCODE -ne 0) { throw 'Audio rendering failed' }
& $NodePath node_modules/typescript/bin/tsc --noEmit
if ($LASTEXITCODE -ne 0) { throw 'Typecheck failed' }
# Composition, locale, picture file. Sound is muxed afterwards from the cut's master.
$films = @(
    @('CatDrama60', 'zh', 'picture-60'),
    @('CatDrama60Vertical', 'zh', 'picture-60-vertical'),
    @('CatDrama30Vertical', 'zh', 'picture-30'),
    @('CatDrama60', 'en', 'picture-60-en')
)
foreach ($film in $films) {
    Set-Content -LiteralPath cat-drama/out/drama/props.json -Value "{`"sound`":false,`"locale`":`"$($film[1])`"}"
    & $NodePath node_modules/@remotion/cli/remotion-cli.js render cat-drama/src/index.ts $film[0] "cat-drama/out/drama/$($film[2]).mp4" --public-dir=cat-drama/public --props=cat-drama/out/drama/props.json --concurrency=$Concurrency --crf=16 --x264-preset=veryfast --gl=swangle --timeout=60000 "--browser-executable=$BrowserPath"
    if ($LASTEXITCODE -ne 0) { throw "Picture rendering failed: $($film[0]) $($film[1])" }
}
python cat-drama/scripts/drama_review.py
if ($LASTEXITCODE -ne 0) { throw 'Mastering or verification failed' }
