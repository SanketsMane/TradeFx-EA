/**
 * Submits every public URL to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting to be crawled, the site
 * tells Bing, Yandex, Seznam and Naver that URLs exist or changed. It needs
 * no account and no verification beyond a key file hosted on the domain, so
 * unlike Search Console it can run unattended from a deploy.
 *
 * Google does not participate in IndexNow. Google discovery still depends on
 * Search Console and on links from other sites. This covers everything else —
 * including Bing, which is what feeds Microsoft Copilot.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const HOST = 'tradefx.in';
const ORIGIN = `https://${HOST}`;

// The key file lives in public/ and is served at the site root; its name is
// the key, which is how the endpoint verifies we own the domain.
const publicDir = resolve(here, '../public');
const keyFile = readdirSync(publicDir).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file found in public/. Expected <32-hex>.txt');
const key = keyFile.replace('.txt', '');

// Submit exactly what the sitemap advertises, so the two can never disagree.
const sitemap = readFileSync(resolve(publicDir, 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error('sitemap.xml contained no URLs.');

const body = { host: HOST, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList };

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
  signal: AbortSignal.timeout(20_000),
});

/*
 * 200 accepted, 202 accepted but the key is still being verified. Both are
 * success. Anything else is worth seeing, but a failed submission must never
 * fail a deploy — the site is already live either way.
 */
const text = await res.text().catch(() => '');
if (res.status === 200 || res.status === 202) {
  console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
} else {
  console.warn(`IndexNow: HTTP ${res.status} ${text.slice(0, 200)}`);
}
