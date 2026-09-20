import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Quote links carry the subject in the query string. */
function quoteSubject(href: string): { item_id?: string; item_category?: string } {
  const q = href.split('?')[1] ?? '';
  const params = new URLSearchParams(q);
  const product = params.get('product');
  const service = params.get('service');
  if (product) return { item_id: product, item_category: 'expert_advisor' };
  if (service) return { item_id: service, item_category: 'service' };
  return {};
}

/**
 * Page views and click tracking.
 *
 * Page views: a single-page app navigates without a document load, so GA's
 * automatic page_view is switched off in /analytics.js and each route change
 * is reported here. Without this only the landing page would ever be counted.
 *
 * Clicks: handled by one delegated listener rather than an onClick on every
 * button. There are sixteen quote CTAs alone, and a listener keeps working
 * for CTAs added later — an onClick that has to be remembered does not.
 */
export default function Analytics() {
  const { pathname, search } = useLocation();
  // The bootstrap already reported the entry page; skip it or it counts twice.
  const first = useRef(true);
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    track('page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('a, button');
      if (!el) return;

      // An explicit name always wins: data-ga="connect_account".
      const explicit = el.getAttribute('data-ga');
      if (explicit) {
        track(explicit, { page_path: path.current });
        return;
      }

      if (el.tagName !== 'A') return;
      const href = el.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      // Off-site: mailto, tel, and any other origin.
      if (/^(mailto|tel):/i.test(href)) {
        track('contact_click', {
          method: href.startsWith('mailto') ? 'email' : 'phone',
          page_path: path.current,
        });
        return;
      }
      if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) {
        const host = (() => {
          try {
            return new URL(href).hostname;
          } catch {
            return 'unknown';
          }
        })();
        track(host.includes('t.me') ? 'contact_click' : 'click', {
          ...(host.includes('t.me') ? { method: 'telegram' } : {}),
          link_domain: host,
          link_url: href,
          outbound: true,
          page_path: path.current,
        });
        return;
      }

      // The commercially meaningful internal CTAs.
      if (href.startsWith('/quote')) {
        track('quote_cta_click', { ...quoteSubject(href), page_path: path.current });
      } else if (/^\/products\/[a-z-]+$/.test(href) && href !== '/products/compare') {
        track('select_item', {
          item_id: href.split('/').pop(),
          item_category: 'expert_advisor',
          page_path: path.current,
        });
      } else if (href.startsWith('/register')) {
        track('sign_up_start', { page_path: path.current });
      }
    };

    // Capture phase: a link that navigates away still reports before it goes.
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
