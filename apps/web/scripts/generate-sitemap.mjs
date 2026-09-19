/**
 * Generates public/sitemap.xml at build time.
 *
 * Product URLs are read out of the catalogue rather than hardcoded — a static
 * sitemap silently goes stale the first time a product is added or renamed,
 * and a sitemap listing a 404 is worse than no sitemap.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://tradefx.in';

const catalog = readFileSync(resolve(here, '../src/lib/catalog.ts'), 'utf8');

/*
 * Only the `products` array. Services share the same `slug:` shape at the same
 * indent, but they are anchors on /services, not pages — matching the whole
 * file put /products/ea-development in the sitemap, pointing at a 404.
 */
const productsBlock = catalog.match(/export const products: Product\[\] = \[([\s\S]*?)\n\];/);
if (!productsBlock) throw new Error('Could not locate the products array in catalog.ts.');

const productSlugs = [...productsBlock[1].matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);

// Services now have their own pages rather than being anchors on /services.
const servicesBlock = catalog.match(/export const services: Service\[\] = \[([\s\S]*?)\n\];/);
if (!servicesBlock) throw new Error('Could not locate the services array in catalog.ts.');
const serviceSlugs = [...servicesBlock[1].matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);
if (serviceSlugs.length === 0) throw new Error('No service slugs found in catalog.ts.');
if (productSlugs.length === 0) {
  throw new Error('No product slugs found in catalog.ts — the sitemap would be incomplete.');
}

const guidesSrc = readFileSync(resolve(here, '../src/lib/guides.ts'), 'utf8');
const guidesBlock = guidesSrc.match(/export const guides: Guide\[\] = \[([\s\S]*?)\n\];/);
if (!guidesBlock) throw new Error('Could not locate the guides array in guides.ts.');
const guideSlugs = [...guidesBlock[1].matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);

/** Public, indexable routes. Anything behind a login is deliberately absent. */
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/products', priority: '0.9', changefreq: 'weekly' },
  { path: '/products/compare', priority: '0.9', changefreq: 'monthly' },
  ...productSlugs.map((s) => ({ path: `/products/${s}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  ...serviceSlugs.map((s) => ({ path: `/services/${s}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/supported-brokers', priority: '0.8', changefreq: 'monthly' },
  { path: '/how-it-works', priority: '0.7', changefreq: 'monthly' },
  { path: '/guides', priority: '0.7', changefreq: 'weekly' },
  ...guideSlugs.map((g) => ({ path: `/guides/${g}`, priority: '0.7', changefreq: 'monthly' })),
  { path: '/quote', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${ORIGIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(here, '../public/sitemap.xml'), xml);
console.log(
  `sitemap.xml: ${routes.length} URLs (${productSlugs.length} products, ${serviceSlugs.length} services, ${guideSlugs.length} guides)`,
);
