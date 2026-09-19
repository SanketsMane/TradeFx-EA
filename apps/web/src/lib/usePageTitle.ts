import { useEffect } from 'react';

const SUFFIX = 'TradeFx';

/** Sets `document.title` for the life of the component. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
