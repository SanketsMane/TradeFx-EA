/** Shared number/money/percent formatting for dashboards + reports. */

export const num = (v: string | number | null | undefined): number => {
  const n = typeof v === 'number' ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

/** Fixed 2-decimal money. `sign` prefixes a "+" on positive values. */
export function money(v: string | number | null | undefined, opts: { sign?: boolean } = {}): string {
  const n = num(v);
  const s = Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (n < 0) return `-${s}`;
  return opts.sign && n > 0 ? `+${s}` : s;
}

/** A 0–1 fraction rendered as a whole-number percentage. */
export const pct = (fraction: number | null | undefined): string => `${Math.round(num(fraction) * 100)}%`;

/** Tailwind text color for a P/L value. */
export const pnlColor = (v: string | number | null | undefined): string =>
  num(v) > 0 ? 'text-emerald-600' : num(v) < 0 ? 'text-red-600' : 'text-gray-500';

/**
 * Money with its account currency, e.g. "$12,612.10" or "AED 4,500.00".
 *
 * Trading accounts are not all denominated in dollars, so anything shown to a
 * customer needs the currency attached — a bare "12,612.10" invites them to
 * read it as whatever they expect. Falls back to a prefixed code if the broker
 * reports a currency `Intl` does not recognise.
 */
export function amount(
  v: string | number | null | undefined,
  currency = 'USD',
  opts: { sign?: boolean } = {},
): string {
  const n = num(v);
  let body: string;
  try {
    body = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(n));
  } catch {
    body = `${currency} ${money(Math.abs(n))}`;
  }
  if (n < 0) return `-${body}`;
  return opts.sign && n > 0 ? `+${body}` : body;
}
