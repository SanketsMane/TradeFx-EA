import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sends every navigation back to the top of the page.
 *
 * React Router keeps the scroll position across route changes, so following a
 * product link from halfway down a listing drops you halfway down the product
 * page. A hash link (#ea-development on /services) is left alone and scrolled
 * to its target instead.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Let the target render before trying to reach it.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
