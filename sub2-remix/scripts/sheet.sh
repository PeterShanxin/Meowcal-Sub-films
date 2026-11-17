#!/bin/sh
# sheet.sh out.jpg a.png b.png ...   → one row of frames, for inspection
out="$1"; shift
args=""; n=0
for f in "$@"; do args="$args -i $f"; n=$((n+1)); done
ffmpeg -v error -y $args -filter_complex "hstack=inputs=$n" -q:v 3 "$out"
