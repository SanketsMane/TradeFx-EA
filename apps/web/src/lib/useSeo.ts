import { useEffect } from 'react';
import { SITE, absolute } from './seo';

export interface SeoOptions {
  /** Page title without the brand suffix. Omit on the home page. */
  title?: string;
  description?: string;
  /** Path this page canonicalises to, e.g. "/products/scalper". */
  path: string;
  /** Social preview image. Defaults to the brand mark. */
  image?: string;
  type?: 'website' | 'article';
  /** Keep this page out of the index (sign-in, forms, private areas). */
  noindex?: boolean;
  /** One or more Schema.org objects to emit as JSON-LD. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/** Tags this hook owns, so it can replace its own output and nothing else's. */
const OWNED = 'data-seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Manages the document head for a route.
 *
 * Written against the DOM rather than a head library on purpose: the build
 * prerenders each route in a real browser and snapshots the resulting
 * document, so whatever this sets lands in the static HTML a crawler is
 * served — no server-side rendering pipeline required. On client-side
 * navigation the same code keeps the head in step.
 */
export function useSeo(opts: SeoOptions) {
  const {
    title,
    description = SITE.description,
    path,
    image = SITE.logo,
    type = 'website',
    noindex = false,
    jsonLd,
  } = opts;

  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = absolute(path);
  const img = absolute(image);
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // Serialised so the effect re-runs when the schema content actually changes,
  // not on every render because the object identity is new.
  const ldKey = JSON.stringify(ld);

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:type', type);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);

    // Replace this route's structured data wholesale — leaving the previous
    // route's Product schema on a Contact page would be worse than none.
    document.head.querySelectorAll(`script[${OWNED}-ld]`).forEach((n) => n.remove());
    for (const obj of ld) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute(`${OWNED}-ld`, '');
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    }
  }, [fullTitle, description, url, img, type, noindex, ldKey]);
}
