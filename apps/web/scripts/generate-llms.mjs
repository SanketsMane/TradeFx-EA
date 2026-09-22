/**
 * Generates public/llms.txt from the catalogue and guides.
 *
 * llms.txt is a proposed convention giving AI crawlers a plain-text map of a
 * site's meaningful pages. It is not a Google ranking factor and Google
 * ignores it — but GPTBot is already crawling this site far more than any
 * search engine, so the AI surfaces are a channel worth serving properly.
 *
 * Generated rather than hand-written, so it cannot drift from the sitemap.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://tradefx.in';

const read = (p) => readFileSync(resolve(here, p), 'utf8');
const catalog = read('../src/lib/catalog.ts');
const guidesSrc = read('../src/lib/guides.ts');

/** Pulls `slug` + `name`/`title` pairs out of an exported array literal. */
function entries(src, arrayName, typeName, nameKey) {
  const block = src.match(
    new RegExp(`export const ${arrayName}: ${typeName}\\[\\] = \\[([\\s\\S]*?)\\n\\];`),
  );
  if (!block) throw new Error(`Could not locate ${arrayName} in the source.`);
  const slugs = [...block[1].matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);
  const names = [...block[1].matchAll(new RegExp(`^\\s{4}${nameKey}: '([^']+)',$`, 'gm'))].map(
    (m) => m[1],
  );
  if (slugs.length !== names.length) {
    throw new Error(`${arrayName}: ${slugs.length} slugs but ${names.length} names — out of step.`);
  }
  return slugs.map((slug, i) => ({ slug, name: names[i] }));
}

const products = entries(catalog, 'products', 'Product', 'name');
const services = entries(catalog, 'services', 'Service', 'name');
const guides = entries(guidesSrc, 'guides', 'Guide', 'title');

const out = `# TradeFx

> Forex Expert Advisors for MetaTrader 4 and 5. Customers license an Expert
> Advisor, connect their own broker account, and the strategy runs on TradeFx
> infrastructure — there is no VPS to maintain. Pricing is quoted per trading
> account; no prices are published.

TradeFx supplies trading software. It does not hold customer funds, manage
money, or give investment advice. Trading foreign exchange on margin carries a
high level of risk and can result in the loss of more than the deposit.

## Expert Advisors
${products.map((p) => `- [${p.name}](${ORIGIN}/products/${p.slug})`).join('\n')}
- [Compare all four](${ORIGIN}/products/compare)

## Guides
${guides.map((g) => `- [${g.name}](${ORIGIN}/guides/${g.slug})`).join('\n')}

## Services
${services.map((s) => `- [${s.name}](${ORIGIN}/services/${s.slug})`).join('\n')}

## About
- [How it works](${ORIGIN}/how-it-works)
- [Supported brokers](${ORIGIN}/supported-brokers)
- [Request a quotation](${ORIGIN}/quote)
- [Contact](${ORIGIN}/contact)
`;

writeFileSync(resolve(here, '../public/llms.txt'), out);
console.log(
  `llms.txt: ${products.length} products, ${guides.length} guides, ${services.length} services`,
);
