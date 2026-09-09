#!/usr/bin/env bash
set -euo pipefail

rm -rf .vercel-build dist
mkdir -p .vercel-build dist

unzip -oq outlet-mall-code.zip -d .vercel-build
unzip -oq outlet-mall-assets.zip -d .vercel-build

INDEX_PATH="$(find .vercel-build -type f -name index.html | head -n 1)"
if [ -z "${INDEX_PATH}" ]; then
  echo "ERROR: No index.html found after extracting mall ZIPs"
  find .vercel-build -maxdepth 3 -type f | head -200
  exit 1
fi

SITE_DIR="$(dirname "$INDEX_PATH")"
echo "Using site root: $SITE_DIR"

rsync -a "$SITE_DIR"/ dist/

# Merge any separately-packaged assets directories into the deployed assets folder.
while IFS= read -r ASSET_DIR; do
  if [ "$ASSET_DIR" != "$SITE_DIR/assets" ]; then
    mkdir -p dist/assets
    rsync -a "$ASSET_DIR"/ dist/assets/
  fi
done < <(find .vercel-build -type d -name assets)

if [ ! -f dist/index.html ]; then
  echo "ERROR: dist/index.html was not created"
  exit 1
fi

echo "Outlet Mall prepared successfully."
