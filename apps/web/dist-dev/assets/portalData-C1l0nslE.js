import { ax as ApiError, d as reactExports } from "./index-DS595Jt3.js";
function isBackendMissing(err) {
  if (err instanceof TypeError) return true;
  if (!(err instanceof ApiError)) return false;
  if (err.status === 404 || err.status === 501) return true;
  return false;
}
function usePortalResource(fetcher, fallback, deps = []) {
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState(false);
  const [nonce, setNonce] = reactExports.useState(0);
  const reload = reactExports.useCallback(() => setNonce((n) => n + 1), []);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher().then((res) => {
      if (cancelled) return;
      setData(res);
      setPreview(false);
    }).catch((err) => {
      if (cancelled) return;
      if (isBackendMissing(err)) {
        setData(typeof fallback === "function" ? fallback() : fallback);
        setPreview(true);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [...deps, nonce]);
  return { data, loading, error, preview, reload };
}
function formatLicenseCode(code) {
  return code.replace(/(.{3})(?=.)/g, "$1-");
}
export {
  formatLicenseCode as f,
  usePortalResource as u
};
