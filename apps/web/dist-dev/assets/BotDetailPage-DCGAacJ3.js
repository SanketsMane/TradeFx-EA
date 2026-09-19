import { i as useParams, j as jsxRuntimeExports, N as productBySlug, L as Link, k as ArrowLeft, D as Download, ap as Bot, e as cn, ar as portalApi } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { L as LoadingBlock, E as ErrorState, S as StatCard, a as EmptyState, C as Card } from "./SessionsDialog-CsVQMlkl.js";
import { L as LicenseCode } from "./LicenseCode-MoVLS2Uc.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, b as demoPerformance, c as demoStatement, a as demoLicenses } from "./usePageTitle-DQZV654c.js";
import { n as num, b as amount, a as pnlColor, p as pct } from "./format-D2xU1sb4.js";
const when = (iso) => new Date(iso).toLocaleString(void 0, {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
});
function exportCsv(rows, name) {
  const head = ["Date", "Symbol", "Side", "Lots", "Profit/Loss", "Ticket"];
  const body = rows.map((r) => [
    new Date(r.ts).toISOString(),
    r.symbol,
    r.side,
    r.lots,
    r.pnl ?? "",
    r.receiverTicket ?? r.sourceTicket
  ]);
  const csv = [head, ...body].map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-statement.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function BotDetailPage() {
  var _a, _b;
  const { id = "" } = useParams();
  const perf = usePortalResource(
    () => portalApi.performance(id),
    () => demoPerformance.find((p2) => p2.licenseId === id) ?? demoPerformance[0],
    [id]
  );
  const statement = usePortalResource(
    () => portalApi.statement(id),
    () => ({ items: demoStatement(id), total: 40 }),
    [id]
  );
  const license = demoLicenses.find((l) => l.id === id);
  usePageTitle(((_a = perf.data) == null ? void 0 : _a.productName) ?? "Expert Advisor");
  if (perf.loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading performance…" });
  if (perf.error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: perf.error, onRetry: perf.reload });
  if (!perf.data) return null;
  const p = perf.data;
  const rows = ((_b = statement.data) == null ? void 0 : _b.items) ?? [];
  const product = productBySlug((license == null ? void 0 : license.productSlug) ?? "");
  const realized = rows.reduce((sum, r) => sum + num(r.pnl), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    (perf.preview || statement.preview) && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/app/bots",
        className: "mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " My Expert Advisors"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-4", children: [
      product && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.cardImage, alt: "", className: "h-20 w-auto object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PortalHeader, { title: p.productName, subtitle: `Running on ${p.accountLabel}` }),
        license && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mt-3 flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-gray-400", children: "Licence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LicenseCode, { code: license.code, size: "sm" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Equity", value: amount(p.equity, p.currency), sub: `Balance ${amount(p.balance, p.currency)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Profit / loss today",
          value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: pnlColor(p.dailyPnl), children: amount(p.dailyPnl, p.currency, { sign: true }) }),
          sub: `${p.dailyRoiPct >= 0 ? "+" : ""}${p.dailyRoiPct.toFixed(2)}% return`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total profit / loss",
          value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: pnlColor(p.totalPnl), children: amount(p.totalPnl, p.currency, { sign: true }) }),
          sub: "Since the bot went live"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Win rate", value: pct(p.winRate), sub: `${p.trades} trades · ${p.openPositions} open` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 mt-10 flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Trade statement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Every trade the Expert Advisor has placed on this account." })
      ] }),
      rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => exportCsv(rows, p.productName),
          className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            " Export CSV"
          ]
        }
      )
    ] }),
    statement.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading trades…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-6 w-6" }),
        title: "No trades yet",
        description: "As soon as the Expert Advisor opens its first position it will show up here."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-gray-100 bg-gray-50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Date", "Symbol", "Side", "Lots", "Ticket", "Profit / loss"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: cn(
            "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500",
            i === 5 && "text-right"
          ),
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-gray-500", children: when(r.ts) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-medium text-gray-900", children: r.symbol }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "rounded px-1.5 py-0.5 text-xs font-semibold",
              r.side === "BUY" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            ),
            children: r.side
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 tabular-nums text-gray-600", children: r.lots }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400", children: r.receiverTicket ?? r.sourceTicket }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: cn(
              "whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums",
              pnlColor(r.pnl)
            ),
            children: amount(r.pnl, p.currency, { sign: true })
          }
        )
      ] }, r.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "border-t border-gray-200 bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Shown on this page" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-4 py-3 text-right font-bold tabular-nums", pnlColor(realized)), children: amount(realized, p.currency, { sign: true }) })
      ] }) })
    ] }) }) })
  ] });
}
export {
  BotDetailPage as default
};
