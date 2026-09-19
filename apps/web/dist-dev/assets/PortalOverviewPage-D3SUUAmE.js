import { j as jsxRuntimeExports, L as Link, a as ArrowRight, an as TrendingUp, ao as TrendingDown, ap as Bot, aq as Wallet, e as cn, ar as portalApi } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { L as LoadingBlock, E as ErrorState, S as StatCard, a as EmptyState, C as Card } from "./SessionsDialog-CsVQMlkl.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, d as demoOverview } from "./usePageTitle-DQZV654c.js";
import { b as amount, a as pnlColor, p as pct, n as num } from "./format-D2xU1sb4.js";
const roi = (v) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
function PortalOverviewPage() {
  usePageTitle("Overview");
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.overview(),
    demoOverview
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading your dashboard…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload });
  if (!data) return null;
  const dailyUp = num(data.dailyPnl) >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalHeader,
      {
        title: "Overview",
        subtitle: "How your Expert Advisors are doing today.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/app/accounts",
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
            children: [
              "Connect an account ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active Expert Advisors", value: data.activeBots, sub: `${data.linkedAccounts} linked account${data.linkedAccounts === 1 ? "" : "s"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total equity", value: amount(data.totalEquity, data.currency), sub: "Across all linked accounts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Profit / loss today",
          value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: pnlColor(data.dailyPnl), children: amount(data.dailyPnl, data.currency, { sign: true }) }),
          sub: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            dailyUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
            "since midnight"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Return today",
          value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: data.dailyRoiPct >= 0 ? "text-emerald-600" : "text-red-600", children: roi(data.dailyRoiPct) }),
          sub: "On opening equity"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 mt-10 text-lg font-bold text-gray-900", children: "Your Expert Advisors" }),
    data.performance.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-6 w-6" }),
        title: "No Expert Advisor running yet",
        description: "Once you have a licence code, connect a MetaTrader account and your bot starts trading.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/accounts",
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700",
            children: "Connect an account"
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: data.performance.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 shrink-0 place-content-center rounded-lg bg-brand-50 text-brand-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-semibold text-gray-900", children: p.productName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
            p.accountLabel
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              p.dailyRoiPct >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            ),
            children: [
              roi(p.dailyRoiPct),
              " today"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-4", children: [
        { label: "Equity", value: amount(p.equity, p.currency) },
        { label: "P/L today", value: amount(p.dailyPnl, p.currency, { sign: true }), tone: pnlColor(p.dailyPnl) },
        { label: "Total P/L", value: amount(p.totalPnl, p.currency, { sign: true }), tone: pnlColor(p.totalPnl) },
        { label: "Win rate", value: pct(p.winRate) }
      ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-gray-500", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: cn("mt-0.5 text-sm font-semibold text-gray-900", s.tone), children: s.value })
      ] }, s.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-gray-100 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
          p.openPositions,
          " open · ",
          p.trades,
          " trades"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: `/app/bots/${p.licenseId}`,
            className: "inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800",
            children: [
              "Trade statement ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] }, p.licenseId)) })
  ] });
}
export {
  PortalOverviewPage as default
};
