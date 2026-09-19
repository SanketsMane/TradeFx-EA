#!/usr/bin/env bash
#
# Redeploy TradeFx on the shared server. Safe to re-run.
#
# This box also runs hcfinvest and refilify. Nothing here touches them: we
# build into our own tree, restart only our pm2 app, and reload nginx only
# after `nginx -t` passes.
set -euo pipefail

APP=/var/www/tradefx/app
WEB=/var/www/tradefx/web

cd "$APP"

echo "==> Fetching"
git fetch --quiet origin
git reset --hard origin/main --quiet
git log --oneline -1

echo "==> Installing"
corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile --silent

echo "==> Migrating"
pnpm --filter @tcp/api exec prisma migrate deploy 2>&1 | grep -viE "^$|prisma:|update available|npm i " || true

echo "==> Building"
pnpm --filter @tcp/api build
pnpm --filter @tcp/web build

echo "==> Publishing web"
mkdir -p "$WEB"
rsync -a --delete "$APP/apps/web/dist/" "$WEB/"

echo "==> Restarting API"
pm2 restart tradefx-api --update-env
pm2 save --force >/dev/null

echo "==> nginx"
cp "$APP/deploy/nginx/tradefx.in.conf" /etc/nginx/sites-available/tradefx.in
# Certbot rewrites the live file when HTTPS is on; do not clobber its 443 block.
if grep -q "listen 443" /etc/nginx/sites-enabled/tradefx.in 2>/dev/null; then
  echo "    (443 block present — leaving certbot's config in place)"
  git checkout -- deploy/nginx/tradefx.in.conf 2>/dev/null || true
fi
if nginx -t >/dev/null 2>&1; then
  systemctl reload nginx
  echo "    reloaded"
else
  echo "    NGINX CONFIG INVALID — not reloaded"
  nginx -t
  exit 1
fi

echo "==> Health"
sleep 4
curl -fsS -m 10 http://127.0.0.1:3200/api/v1/health && echo
echo "Done."
