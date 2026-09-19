/**
 * Product and service slugs the API accepts.
 *
 * The marketing copy lives in the web app (`apps/web/src/lib/catalog.ts`);
 * this is only the identifier list, kept here so quote requests and licences
 * cannot reference a product that does not exist. Keep the two in step — if
 * the catalogue ever becomes admin-managed, this becomes a table.
 */
export const PRODUCTS = {
  scalper: 'TradeFx Scalper',
  infinity: 'TradeFx Infinity',
  investor: 'TradeFx Investor',
  heddge: 'TradeFx Heddge',
} as const;

export type ProductSlug = keyof typeof PRODUCTS;

export const PRODUCT_SLUGS = Object.keys(PRODUCTS) as ProductSlug[];

export const SERVICE_SLUGS = [
  'ea-development',
  'trading-vps',
  'multi-account-execution',
  'crypto-p2p',
  'custom-development',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isProductSlug(v: string): v is ProductSlug {
  return v in PRODUCTS;
}

export function productName(slug: string): string {
  return isProductSlug(slug) ? PRODUCTS[slug] : slug;
}
