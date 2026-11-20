#!/usr/bin/env bash
# Builds Kelimat and publishes dist/ to the gh-pages branch (served at https://<owner>.github.io/<repo>/).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
remote="$(git remote get-url origin)"
src="$(git rev-parse --short HEAD)"
tmp="$(mktemp -d)"
cp -r dist/. "$tmp"
touch "$tmp/.nojekyll"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -qm "Deploy Kelimat (built from $src)"
git push -f "$remote" gh-pages
rm -rf "$tmp"
echo "Deployed. Live in ~1 minute."
