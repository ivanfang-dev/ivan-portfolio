#!/usr/bin/env bash
# Rasterizes page 1 of the resume PDF into the WebP that the Resume section
# renders inline. Runs automatically as `prebuild`, so any `npm run build`
# (local or CI) regenerates it — the on-page preview can't drift from the PDF.
#
# Run it on its own with:  npm run resume:preview
#
# Requires ghostscript + imagemagick:
#   macOS:  brew install ghostscript imagemagick
#   Ubuntu: apt-get install -y ghostscript imagemagick

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PDF="$ROOT/public/Ivan_Fang_Resume.pdf"
OUT="$ROOT/public/resume-preview.webp"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if ! command -v gs >/dev/null 2>&1; then
  echo "error: ghostscript ('gs') not found — see the install line in $0" >&2
  exit 1
fi

# ImageMagick 7 ships `magick`; the `imagemagick` package on Ubuntu is v6 and
# only provides `convert`/`identify`. Support both.
if command -v magick >/dev/null 2>&1; then
  IM="magick"
  IDENTIFY="magick identify"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
  IDENTIFY="identify"
else
  echo "error: imagemagick not found ('magick' or 'convert') — see the install line in $0" >&2
  exit 1
fi

[ -f "$PDF" ] || { echo "error: $PDF is missing" >&2; exit 1; }

# Render well above the target size, then downsample — supersampling keeps the
# small serif body text crisp. Ghostscript does the PDF decoding, so this never
# trips ImageMagick's policy.xml PDF restrictions on Linux.
gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=png16m -r220 \
   -dFirstPage=1 -dLastPage=1 -dTextAlphaBits=4 -dGraphicsAlphaBits=4 \
   -sOutputFile="$TMP/page1.png" "$PDF"

# 1520px wide is ~1.7x the section's 896px render width — sharp on retina
# without the file size of a true 2x asset.
$IM "$TMP/page1.png" -filter Lanczos -resize 1520x -strip \
  -quality 80 -define webp:method=6 -define webp:sns-strength=80 "$OUT"

# `wc -c` rather than `du`, which reports allocated blocks and overstates on APFS.
DIMS="$($IDENTIFY -format '%wx%h' "$OUT")"
KB="$(( $(wc -c < "$OUT") / 1024 ))"
echo "resume preview: $DIMS, ${KB}KB -> public/resume-preview.webp"
echo "note: if that is not 1520x1967, update PREVIEW_W/PREVIEW_H in src/components/sections/Resume.tsx"
