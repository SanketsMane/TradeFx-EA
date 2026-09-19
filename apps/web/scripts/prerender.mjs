/**
 * Prerenders the public routes to static HTML after `vite build`.
 *
 * Why this and not SSR: the app is a client-rendered SPA, so every URL was
 * served the same 83-word empty shell. Google eventually renders JavaScript;
 * Bing, LinkedIn, WhatsApp, Facebook and the AI crawlers largely do not — so
 * link previews showed the homepage for every product and most crawlers saw
 * nothing at all.
 *
 * Each route is loaded in a real browser and the resulting document is
 * snapshotted, which means whatever `useSeo` set — title, description,
 * canonical, OG tags, JSON-LD — lands in the static file. No SSR pipeline,
 * no framework migration, and the client keeps hydrating exactly as before.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '../dist');
const PORT = 4179;

/**
 * Routes that are short by design — sign-in forms carry a noindex, so a
 * thin-content warning on them is noise, not a signal.
 */
const THIN_BY_DESIGN = new Set(['/login', '/register']);

const ROUTES = [
  '/',
  '/products',
  '/products/scalper',
  '/products/infinity',
  '/products/investor',
  '/products/heddge',
  '/products/compare',
  '/services',
  '/how-it-works',
  '/supported-brokers',
  '/quote',
  '/contact',
  '/login',
  '/register',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

/** Static server with an SPA fallback, so client routing works while capturing. */
function serve() {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent((req.url || '/').split('?')[0]);
      const candidate = join(DIST, url);
      let file = null;
      if (extname(url) && existsSync(candidate)) file = candidate;
      else file = join(DIST, 'index.html');
      try {
        const body = await readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(PORT, () => ready(server));
  });
}

const server = await serve();
const browser = await chromium.launch();
/*
 * Reduced motion is emulated so scroll-reveal animations render their
 * content immediately. Without it the homepage snapshots as one word: the
 * reveal wrappers sit at opacity 0 waiting for a scroll that never happens
 * in a headless capture.
 */
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();

let written = 0;
const problems = [];

for (const route of ROUTES) {
  await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  // useSeo writes the head in an effect; give React a beat to commit it.
  await page.waitForFunction(() => document.querySelector('link[rel="canonical"]') !== null, {
    timeout: 15000,
  }).catch(() => problems.push(`${route}: no canonical was set`));
  await page.waitForTimeout(250);

  const { html, title, words, h1 } = await page.evaluate(() => {
    /*
     * textContent, not innerText. innerText is layout-dependent and returns
     * an empty string under chrome-headless-shell, which lays nothing out —
     * a fully rendered page then looks empty and fails the gate below.
     */
    const root = document.getElementById('root');
    const text = (root?.textContent || '').replace(/\s+/g, ' ').trim();
    return {
      html: document.documentElement.outerHTML,
      title: document.title,
      words: text ? text.split(' ').length : 0,
      h1: document.querySelectorAll('h1').length,
    };
  });

  // A route that renders almost nothing means the snapshot ran before React
  // committed — the exact failure this script exists to prevent.
  if (!THIN_BY_DESIGN.has(route) && words < 150) {
    problems.push(`${route}: only ${words} words captured — did the render finish?`);
  }
  if (h1 !== 1) problems.push(`${route}: ${h1} <h1> elements, expected exactly 1`);

  const outDir = route === '/' ? DIST : join(DIST, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), `<!DOCTYPE html>\n${html}\n`);
  written++;
  console.log(`  ${route.padEnd(22)} ${String(words).padStart(4)} words  h1=${h1}  ${title.slice(0, 44)}`);
}

await context.close();
await browser.close();
server.close();

if (problems.length) {
  console.error('\nprerender problems:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`\nprerendered ${written} routes`);
