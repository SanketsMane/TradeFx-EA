/**
 * SEO primitives: site constants and Schema.org builders.
 *
 * Structured data is emitted as JSON-LD because it is the only format Google
 * documents as preferred, and because it keeps markup out of the render tree
 * — the page stays readable and the schema stays reviewable in one place.
 */
export const SITE = {
  name: 'TradeFx',
  origin: 'https://tradefx.in',
  tagline: 'Forex Expert Advisors',
  description:
    'TradeFx builds Expert Advisors for MetaTrader — scalping, multi-pair, long-term and hedged. Link your own broker account and let the bot trade.',
  logo: 'https://tradefx.in/logo.png',
  telegram: 'https://t.me/TradeFx7170',
} as const;

export const absolute = (path: string): string =>
  path.startsWith('http') ? path : `${SITE.origin}${path.startsWith('/') ? path : `/${path}`}`;

type Json = Record<string, unknown>;

/** Publisher identity. Emitted once, on the home page. */
export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.origin}/#organization`,
    name: SITE.name,
    url: SITE.origin,
    logo: { '@type': 'ImageObject', url: SITE.logo },
    description: SITE.description,
    sameAs: [SITE.telegram],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${SITE.origin}/contact`,
      availableLanguage: ['English'],
    },
  };
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.origin}/#website`,
    name: SITE.name,
    url: SITE.origin,
    publisher: { '@id': `${SITE.origin}/#organization` },
  };
}

/**
 * A product with no price.
 *
 * Everything here is quote-on-request, so there is no `offers.price` to give.
 * Google accepts an Offer with `availability` and no price; inventing one to
 * win a rich result would be both a lie and a policy violation.
 */
export function productSchema(p: {
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE.origin}/products/${p.slug}/#product`,
    name: p.name,
    description: p.description,
    image: absolute(p.image),
    category: p.category,
    brand: { '@type': 'Brand', name: SITE.name },
    url: `${SITE.origin}/products/${p.slug}`,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${SITE.origin}/quote?product=${p.slug}`,
      seller: { '@id': `${SITE.origin}/#organization` },
      // Quote-on-request: no price is published anywhere in the product.
      priceSpecification: {
        '@type': 'PriceSpecification',
        valueAddedTaxIncluded: false,
        description: 'Priced per trading account. Request a quotation.',
      },
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absolute(t.path),
    })),
  };
}

export function serviceSchema(s: { name: string; slug: string; description: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    provider: { '@id': `${SITE.origin}/#organization` },
    url: `${SITE.origin}/services/${s.slug}`,
    areaServed: 'Worldwide',
  };
}

export function itemListSchema(items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absolute(it.path),
    })),
  };
}
