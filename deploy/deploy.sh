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
# The shared header snippet is always refreshed — both the bootstrap config
# and certbot's rewritten one include it by path.
mkdir -p /etc/nginx/snippets
cp "$APP/deploy/nginx/tradefx-security-headers.conf" /etc/nginx/snippets/tradefx-security-headers.conf

# The site file is only installed while certbot has NOT taken it over. Once a
# certificate is issued, certbot owns this file: copying the HTTP-only
# bootstrap over it would delete the 443 block and take the site off HTTPS.
# (The check must come before any copy — testing afterwards is useless.)
if grep -q "listen 443" /etc/nginx/sites-available/tradefx.in 2>/dev/null; then
  echo "    site is certbot-managed — leaving it untouched"
else
  cp "$APP/deploy/nginx/tradefx.in.conf" /etc/nginx/sites-available/tradefx.in
  ln -sfn /etc/nginx/sites-available/tradefx.in /etc/nginx/sites-enabled/tradefx.in
  echo "    installed bootstrap site config"
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
