#!/usr/bin/env bash
set -euo pipefail

rm -rf .vercel-build dist
mkdir -p .vercel-build dist

unzip -oq outlet-mall-code.zip -d .vercel-build
unzip -oq outlet-mall-assets.zip -d .vercel-build

SITE_DIR=""
while IFS= read -r INDEX_PATH; do
  CANDIDATE="$(dirname "$INDEX_PATH")"
  if [ -f "$CANDIDATE/mall.css" ] && [ -f "$CANDIDATE/mall.js" ]; then
    SITE_DIR="$CANDIDATE"
    break
  fi
done < <(find .vercel-build -type f -name index.html)

if [ -z "$SITE_DIR" ]; then
  echo "ERROR: Could not find mall root containing index.html + mall.css + mall.js"
  find .vercel-build -maxdepth 4 -type f | head -300
  exit 1
fi

echo "Using site root: $SITE_DIR"
rsync -a "$SITE_DIR"/ dist/

while IFS= read -r ASSET_DIR; do
  if [ "$ASSET_DIR" != "$SITE_DIR/assets" ]; then
    mkdir -p dist/assets
    rsync -a "$ASSET_DIR"/ dist/assets/
  fi
done < <(find .vercel-build -type d -name assets)

if [ ! -f dist/index.html ] || [ ! -f dist/mall.css ] || [ ! -f dist/mall.js ]; then
  echo "ERROR: Mall build is incomplete"
  exit 1
fi

echo "Outlet Mall prepared successfully."
