import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Reports page views to Google Analytics on every route change.
 *
 * A single-page app navigates without a document load, so GA's automatic
 * page_view only ever fires once — every route after the landing page would
 * be invisible. `/analytics.js` disables the automatic view and sends the
 * first one itself; this sends the rest.
 *
 * Renders nothing, and does nothing at all when gtag is absent (local
 * development, or a visitor blocking analytics).
 */
export default function Analytics() {
  const { pathname, search } = useLocation();
  // The bootstrap already reported the entry page; skip it here or it counts twice.
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
