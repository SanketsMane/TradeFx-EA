import { j as jsxRuntimeExports, L as Link, H as HeartPulse, A as Activity, a as ArrowRight, b as accountsApi, c as copierApi, r as reportsApi, m as monitoringApi, u as usersApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { L as LoadingBlock, E as ErrorState, S as StatCard, C as Card, B as Badge, a as EmptyState } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { n as num, p as pct, m as money, a as pnlColor } from "./format-D2xU1sb4.js";
function MiniStat({ label, value, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 text-2xl font-semibold ${tone ?? "text-gray-900"}`, children: value })
  ] });
}
function OverviewPage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { data, loading, error, reload } = useAsync(async () => {
    const [accounts2, copiers2, overview2] = await Promise.all([
      accountsApi.list(),
      copierApi.list(),
      reportsApi.overview().catch(() => null)
    ]);
    const [eventLists, snapshots2] = await Promise.all([
      Promise.all(copiers2.map((c) => monitoringApi.copierEvents(c.id, 20).catch(() => []))),
      Promise.all(accounts2.map((a) => monitoringApi.snapshot(a.id).catch(() => null)))
    ]);
    const recent2 = eventLists.flat().sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 8);
    return { accounts: accounts2, copiers: copiers2, overview: overview2, recent: recent2, snapshots: snapshots2 };
  }, []);
  const platform = useAsync(() => usersApi.stats(), []);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {});
  if (error || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error ?? "Failed to load", onRetry: reload });
  const { accounts, copiers, overview, recent, snapshots } = data;
  const connected = accounts.filter((a) => a.status === "CONNECTED").length;
  const errored = accounts.filter((a) => a.status === "ERROR").length;
  const activeCopiers = copiers.filter((c) => c.enabled).length;
  const receivers = copiers.reduce((n, c) => n + c._count.subscriptions, 0);
  const copierName = (id) => {
    var _a2;
    return ((_a2 = copiers.find((c) => c.id === id)) == null ? void 0 : _a2.name) ?? "—";
  };
  const s = overview == null ? void 0 : overview.summary;
  const realized = (s == null ? void 0 : s.realizedPnl) ?? "0";
  const totalEquity = snapshots.reduce((t, snap) => t + (snap ? num(snap.equity) : 0), 0);
  const hasEquity = snapshots.some((snap) => snap != null);
  const health = errored > 0 ? { tone: "red", label: "Attention", dot: "bg-red-500" } : activeCopiers > 0 && connected > 0 ? { tone: "green", label: "Stable", dot: "bg-emerald-500" } : { tone: "gray", label: "Idle", dot: "bg-gray-400" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard", subtitle: "Platform health, customers and execution at a glance." }),
    (((_a = platform.data) == null ? void 0 : _a.openQuotes) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/dashboard/quotes",
        className: "mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 transition-colors hover:bg-amber-100",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-amber-900", children: [
              (_b = platform.data) == null ? void 0 : _b.openQuotes,
              " quotation",
              ((_c = platform.data) == null ? void 0 : _c.openQuotes) === 1 ? "" : "s",
              " waiting for a reply"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-amber-800", children: "A customer is waiting on a price before they can buy." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-sm font-semibold text-amber-900", children: "Open inbox →" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Customers",
          value: ((_d = platform.data) == null ? void 0 : _d.customers) ?? "—",
          sub: `${((_e = platform.data) == null ? void 0 : _e.activeCustomers) ?? 0} active`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active licences",
          value: ((_f = platform.data) == null ? void 0 : _f.activeLicenses) ?? "—",
          sub: `${((_g = platform.data) == null ? void 0 : _g.licenses) ?? 0} issued in total`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Accounts", value: accounts.length, sub: `${connected} connected` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "EA Masters", value: copiers.length, sub: `${activeCopiers} active` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Client accounts", value: receivers, sub: "attached to a master" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Realized P/L",
          value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: pnlColor(realized), children: money(realized, { sign: true }) }),
          sub: `${(s == null ? void 0 : s.closed) ?? 0} closed · ${pct(s == null ? void 0 : s.winRate)} win rate`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "h-4 w-4 text-brand-600" }),
            " Performance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: health.tone, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${health.dot}` }),
            " ",
            health.label
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Trades (closed)", value: (s == null ? void 0 : s.closed) ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Win rate", value: pct(s == null ? void 0 : s.winRate) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MiniStat,
            {
              label: "Max drawdown",
              value: money(s == null ? void 0 : s.maxDrawdown),
              tone: num(s == null ? void 0 : s.maxDrawdown) > 0 ? "text-red-600" : void 0
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Avg latency", value: (s == null ? void 0 : s.avgLatencyMs) != null ? `${s.avgLatencyMs} ms` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Volume", value: `${money(s == null ? void 0 : s.volumeLots)} lots` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MiniStat,
            {
              label: "Total equity",
              value: hasEquity ? money(totalEquity) : "—"
            }
          )
        ] }),
        errored > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-red-600", children: [
          errored,
          " account",
          errored > 1 ? "s are" : " is",
          " in an error state — check Accounts."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-brand-600" }),
            " Recent Copy Activity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/dashboard/monitor",
              className: "inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800",
              children: [
                "Live monitor ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
              ]
            }
          )
        ] }),
        recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-10 w-10" }),
            title: "No activity yet",
            description: "Copy events appear here as trades are mirrored."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Master" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Symbol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right", children: "P/L" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recent.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-gray-700", children: copierName(e.copierConfigId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-gray-800", children: e.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: e.action === "OPEN" ? "green" : "gray", children: e.action }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: e.pnl != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: Number(e.pnl) >= 0 ? "text-emerald-600" : "text-red-600", children: [
              Number(e.pnl) >= 0 ? "+" : "",
              e.pnl
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "—" }) })
          ] }, e.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  OverviewPage as default
};
