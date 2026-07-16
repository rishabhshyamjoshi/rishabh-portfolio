#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  extract-frames.sh — RJ Industries Portfolio
#  Extracts 192 WebP frames into public/sequence/
#  Frame format: frame_000_delay-0_041s.webp  (underscore decimal)
# ─────────────────────────────────────────────────────────────
VIDEO="${1:-make_a_video_with_them_cinem.mp4}"
OUT_DIR="public/sequence"
TOTAL=192

[ ! -f "$VIDEO" ] && { echo "❌ Video not found: $VIDEO"; exit 1; }

mkdir -p "$OUT_DIR"
echo "🎬  Extracting $TOTAL frames → $OUT_DIR/"

ffmpeg -i "$VIDEO" \
  -vf "fps=24,scale=1920:-1" \
  -frames:v $TOTAL \
  -q:v 80 \
  "$OUT_DIR/frame_%03d_delay-0_041s.webp" \
  -loglevel warning

# Re-index 1-based → 0-based
for i in $(seq $TOTAL -1 1); do
  OLD=$(printf "$OUT_DIR/frame_%03d_delay-0_041s.webp" $i)
  NEW=$(printf "$OUT_DIR/frame_%03d_delay-0_041s.webp" $((i-1)))
  [ -f "$OLD" ] && mv "$OLD" "$NEW"
done

COUNT=$(ls "$OUT_DIR"/frame_*.webp 2>/dev/null | wc -l | tr -d ' ')
echo "✅  $COUNT / $TOTAL frames ready in $OUT_DIR/"
echo "    Logo: copy your logo.png to public/logo.png"
echo "🚀  Run: npm run dev"
