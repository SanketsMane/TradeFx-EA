import { useCallback, useEffect, useState } from 'react';
import { ApiError } from './api';

/**
 * Loader for portal screens.
 *
 * The real API is always tried first. Only when the backend is genuinely
 * absent — the fetch never reached a server, or the route does not exist yet —
 * do we fall back to the preview fixtures, and we say so on screen. A 401, 403
 * or 500 is a real failure and surfaces as an error, because silently showing
 * made-up numbers in place of a broken API is how people end up trusting a
 * figure that was never real.
 */
function isBackendMissing(err: unknown): boolean {
  // TypeError is what fetch throws when it could not reach a server at all.
  if (err instanceof TypeError) return true;
  if (!(err instanceof ApiError)) return false;

  // The route genuinely does not exist.
  if (err.status === 404 || err.status === 501) return true;

  /*
   * In dev, the Vite proxy answers 500 with a plain-text body when nothing is
   * listening on the API port. Nest always replies with JSON, so `parseError`
   * falling back to its generic message is a reliable tell that we never
   * reached the API. Gated to DEV so a production 500 is always a real error.
   */
  return import.meta.env.DEV && err.status === 500 && /^Request failed \(500\)$/.test(err.message);
}

export interface PortalResource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** True when `data` came from the fixtures rather than the API. */
  preview: boolean;
  reload: () => void;
}

export function usePortalResource<T>(
  fetcher: () => Promise<T>,
  fallback: T | (() => T),
  deps: unknown[] = [],
): PortalResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setPreview(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isBackendMissing(err)) {
          setData(typeof fallback === 'function' ? (fallback as () => T)() : fallback);
          setPreview(true);
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, loading, error, preview, reload };
}

/** Groups a 9-character licence code as XXX-XXX-XXX for display only. */
export function formatLicenseCode(code: string): string {
  return code.replace(/(.{3})(?=.)/g, '$1-');
}
