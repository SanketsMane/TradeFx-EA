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
const THIN_BY_DESIGN = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/404',
]);

const ROUTES = [
  '/',
  '/products',
  '/products/scalper',
  '/products/infinity',
  '/products/investor',
  '/products/heddge',
  '/products/compare',
  '/services',
  '/services/ea-development',
  '/services/trading-vps',
  '/services/multi-account-execution',
  '/services/crypto-p2p',
  '/services/custom-development',
  '/how-it-works',
  '/guides',
  '/guides/connect-ea-to-mt5',
  '/guides/forex-ea-without-vps',
  '/guides/gold-scalping-ea-mt5',
  '/guides/hedging-ea-mt5',
  '/supported-brokers',
  '/quote',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/404',
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

/**
 * While capturing, always serve the untouched SPA shell. During the
 * verification pass, serve the snapshots instead so we exercise exactly
 * what production will send.
 */
let serveSnapshots = false;

function serve() {
  return new Promise((ready) => {
    const server = createServer(async (req, res) => {
      const url = decodeURIComponent((req.url || '/').split('?')[0]);
      const direct = join(DIST, url);
      const asRoute = join(DIST, url, 'index.html');
      // /404 is written flat, matching how nginx serves it as the error page.
      const asError = url === '/404' ? join(DIST, '404.html') : null;
      let file;
      if (extname(url) && existsSync(direct)) file = direct;
      else if (serveSnapshots && asError && existsSync(asError)) file = asError;
      else if (serveSnapshots && existsSync(asRoute)) file = asRoute;
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


/*
 * Claims this site may not make.
 *
 * Checked against the rendered text of every public page, not the source, so
 * it holds wherever the words are written — catalogue, guides, a component, a
 * meta description. Two rules, both from the content brief:
 *
 *   - The products are Expert Advisors. "Copy trading" is the internal
 *     mechanism and never the customer-facing word.
 *   - No performance or latency figure without a verified third-party record
 *     to point at. There is none yet, so there is no number to print. If a
 *     Myfxbook or FXBlue record ever exists, relax this deliberately rather
 *     than by accident.
 *
 * Deliberately narrow: a rule that cries wolf gets commented out.
 */
const FORBIDDEN_CLAIMS = [
  [/\bcopy[ -]trading\b|\btrade copier\b/i, 'says "copy trading" — these are Expert Advisors'],
  [
    /\b\d+(?:\.\d+)?\s*%\s*(?:profit|return|returns|gain|gains|accuracy|win|roi)\b/i,
    'prints a performance percentage',
  ],
  [
    /\b(?:win rate|accuracy|roi|monthly return|annual return)\b[^.]{0,24}\b\d+(?:\.\d+)?\s*%/i,
    'prints a performance percentage',
  ],
  [/\bsub-?millisecond\b|\b\d+(?:\.\d+)?\s*(?:ms|milliseconds?)\b/i, 'prints a latency figure'],
  [/\b\d{2}(?:\.\d+)?\s*%\s*uptime\b/i, 'prints an uptime figure'],
];

for (const route of ROUTES) {
  await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  // useSeo writes the head in an effect; give React a beat to commit it.
  await page.waitForFunction(() => document.querySelector('link[rel="canonical"]') !== null, {
    timeout: 15000,
  }).catch(() => problems.push(`${route}: no canonical was set`));
  await page.waitForTimeout(250);

  const { html, title, words, h1, text } = await page.evaluate(() => {
    /*
     * Walk the text nodes rather than reading textContent.
     *
     * innerText is out: it is layout-dependent and returns an empty string
     * under chrome-headless-shell, which lays nothing out, so a fully
     * rendered page looks empty and fails the gate below.
     *
     * textContent is out too, for a subtler reason: it concatenates adjacent
     * elements with no separator, so a heading followed by a paragraph reads
     * as "...quotationSub-millisecond...". That silently joins two words into
     * one in the count, and — worse — destroys the word boundary a claim
     * check anchors on, letting a forbidden phrase through because it happens
     * to sit at the start of an element.
     */
    const root = document.getElementById('root');
    const walker = root
      ? document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) =>
            /^(script|style|noscript)$/i.test(n.parentElement?.tagName ?? '')
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT,
        })
      : null;
    const parts = [];
    while (walker?.nextNode()) parts.push(walker.currentNode.nodeValue);
    const text = parts.join(' ').replace(/\s+/g, ' ').trim();
    return {
      html: document.documentElement.outerHTML,
      title: document.title,
      words: text ? text.split(' ').length : 0,
      h1: document.querySelectorAll('h1').length,
      // The head carries claims too — a meta description is copy.
      text: `${text} ${document.querySelector('meta[name="description"]')?.content ?? ''}`,
    };
  });

  // A route that renders almost nothing means the snapshot ran before React
  // committed — the exact failure this script exists to prevent.
  if (!THIN_BY_DESIGN.has(route) && words < 150) {
    problems.push(`${route}: only ${words} words captured — did the render finish?`);
  }
  if (h1 !== 1) problems.push(`${route}: ${h1} <h1> elements, expected exactly 1`);

  for (const [pattern, why] of FORBIDDEN_CLAIMS) {
    const hit = text.match(pattern);
    if (hit) problems.push(`${route}: ${why} — "${hit[0]}"`);
  }

  // nginx serves /404 as its error page, so it is written as a flat file.
  if (route === '/404') {
    await writeFile(join(DIST, '404.html'), `<!DOCTYPE html>\n${html}\n`);
  } else {
    const outDir = route === '/' ? DIST : join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), `<!DOCTYPE html>\n${html}\n`);
  }
  written++;
  console.log(`  ${route.padEnd(22)} ${String(words).padStart(4)} words  h1=${h1}  ${title.slice(0, 44)}`);
}

await context.close();
/*
 * Load every snapshot back and confirm React hydrates it.
 *
 * A hydration mismatch makes React discard the prerendered DOM and rebuild
 * the page, which costs a second paint of the largest element and a layout
 * shift — undoing most of what prerendering is for. It is silent in
 * production, so it is checked here instead.
 */
serveSnapshots = true;
const verifier = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const vp = await verifier.newPage();
const hydrationErrors = new Map();
vp.on('pageerror', (e) => {
  const m = String(e).match(/invariant=(418|423|425)/);
  if (m || /Hydration failed|did not match/i.test(String(e))) {
    hydrationErrors.set(vp.url(), (m ? `React #${m[1]}` : String(e).slice(0, 80)));
  }
});

for (const route of ROUTES) {
  await vp.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  await vp.waitForTimeout(600);
}
for (const [url, err] of hydrationErrors) {
  const route = new URL(url).pathname;
  problems.push(`${route}: hydration failed (${err}) — React rebuilt the page`);
}
await verifier.close();

await browser.close();
server.close();

if (problems.length) {
  console.error('\nprerender problems:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`\nprerendered ${written} routes`);
