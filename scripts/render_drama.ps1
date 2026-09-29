param(
    [string]$NodePath = 'node',
    [string]$BrowserPath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    [int]$Concurrency = 1
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
New-Item -ItemType Directory -Force out/drama, out/story | Out-Null
python audio/fetch_drama_samples.py
if ($LASTEXITCODE -ne 0) { throw 'Sample download failed' }
python audio/synth.py --drama
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
    Set-Content -LiteralPath out/drama/props.json -Value "{`"sound`":false,`"locale`":`"$($film[1])`"}"
    & $NodePath node_modules/@remotion/cli/remotion-cli.js render $film[0] "out/drama/$($film[2]).mp4" --props=out/drama/props.json --concurrency=$Concurrency --crf=16 --x264-preset=veryfast --gl=swangle --timeout=60000 "--browser-executable=$BrowserPath"
    if ($LASTEXITCODE -ne 0) { throw "Picture rendering failed: $($film[0]) $($film[1])" }
}
python scripts/drama_review.py
if ($LASTEXITCODE -ne 0) { throw 'Mastering or verification failed' }
