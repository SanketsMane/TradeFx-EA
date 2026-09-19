#!/usr/bin/env bash
#
# Issue the Let's Encrypt certificate for tradefx.in and switch the site to
# HTTPS. Run this ONLY once the domain's A records point at this server —
# Let's Encrypt validates over HTTP-01, so it will fail otherwise.
set -euo pipefail

DOMAIN=tradefx.in
EXPECTED_IP=$(curl -s -m 10 https://api.ipify.org)

echo "==> Checking DNS"
for h in "$DOMAIN" "www.$DOMAIN"; do
  got=$(getent hosts "$h" | awk '{print $1}' | head -1)
  if [ "$got" != "$EXPECTED_IP" ]; then
    echo "    $h resolves to ${got:-nothing}, expected $EXPECTED_IP"
    echo "    Point the A record at $EXPECTED_IP and wait for it to propagate."
    exit 1
  fi
  echo "    $h -> $got OK"
done

echo "==> Requesting certificate"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos --redirect \
  -m contactsanket1@gmail.com

echo "==> Verifying"
nginx -t && systemctl reload nginx
curl -fsS -m 10 "https://$DOMAIN/api/v1/health" && echo
echo "HTTPS is live. Renewal is handled by the certbot.timer already on this box."
