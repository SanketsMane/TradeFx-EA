const num = (v) => {
  const n = typeof v === "number" ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};
function money(v, opts = {}) {
  const n = num(v);
  const s = Math.abs(n).toLocaleString(void 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  if (n < 0) return `-${s}`;
  return opts.sign && n > 0 ? `+${s}` : s;
}
const pct = (fraction) => `${Math.round(num(fraction) * 100)}%`;
const pnlColor = (v) => num(v) > 0 ? "text-emerald-600" : num(v) < 0 ? "text-red-600" : "text-gray-500";
function amount(v, currency = "USD", opts = {}) {
  const n = num(v);
  let body;
  try {
    body = new Intl.NumberFormat(void 0, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(n));
  } catch {
    body = `${currency} ${money(Math.abs(n))}`;
  }
  if (n < 0) return `-${body}`;
  return opts.sign && n > 0 ? `+${body}` : body;
}
export {
  pnlColor as a,
  amount as b,
  money as m,
  num as n,
  pct as p
};
