import { i as useParams, d as reactExports, b as accountsApi, m as monitoringApi, j as jsxRuntimeExports, L as Link, k as ArrowLeft } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { L as LoadingBlock, E as ErrorState, e as StatusBadge, S as StatCard, C as Card, a as EmptyState, B as Badge } from "./SessionsDialog-CsVQMlkl.js";
import { m as money, a as pnlColor } from "./format-D2xU1sb4.js";
function AccountDetailPage() {
  const { id = "" } = useParams();
  const [account, setAccount] = reactExports.useState(null);
  const [snapshot, setSnapshot] = reactExports.useState(null);
  const [events, setEvents] = reactExports.useState([]);
  const [positions, setPositions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [acc, snap, evts, pos] = await Promise.all([
        accountsApi.get(id),
        monitoringApi.snapshot(id).catch(() => null),
        monitoringApi.accountEvents(id, 50).catch(() => []),
        accountsApi.positions(id).catch(() => [])
      ]);
      setAccount(acc);
      setSnapshot(snap);
      setEvents(evts);
      setPositions(pos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load account");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
    const t = setInterval(() => {
      accountsApi.positions(id).then(setPositions).catch(() => void 0);
      monitoringApi.snapshot(id).then(setSnapshot).catch(() => void 0);
    }, 15e3);
    return () => clearInterval(t);
  }, [id]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {});
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: load });
  if (!account) return null;
  const fmt = (v) => v == null ? "—" : Number(v).toLocaleString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/accounts", className: "mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Accounts"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: account.label,
        subtitle: `${account.login} · ${account.server} · ${account.platform}`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: account.status })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Balance", value: fmt(snapshot == null ? void 0 : snapshot.balance), sub: snapshot ? "latest snapshot" : "no data yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Equity", value: fmt(snapshot == null ? void 0 : snapshot.equity), sub: snapshot ? "latest snapshot" : "no data yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open Positions", value: positions.length || ((snapshot == null ? void 0 : snapshot.openPositions) ?? "—"), sub: "live" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Trades", value: events.length, sub: "most recent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 p-4 text-sm font-semibold text-gray-800", children: [
        "Open Positions",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs font-normal text-gray-400", children: "live · refreshes every 15s" })
      ] }),
      positions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No open positions", description: "This account has no open trades right now." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Side" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Volume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Open" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Current" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "SL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "TP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Swap" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "P/L" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: positions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: p.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: p.type === "BUY" ? "green" : "red", children: p.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-700", children: p.volume }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-600", children: p.openPrice }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-600", children: p.currentPrice ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-500", children: p.stopLoss ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-500", children: p.takeProfit ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-500", children: money(p.swap) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 text-right tabular-nums font-medium ${pnlColor(p.profit)}`, children: money(p.profit, { sign: true }) })
        ] }, p.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 p-4 text-sm font-semibold text-gray-800", children: "Recent copy activity" }),
      events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No trades", description: "This account has no recorded trade activity yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Side" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Lots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500", children: new Date(e.ts).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: e.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: e.side }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: e.lots }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: e.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: e.sourceAccountId === id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "blue", children: "Source" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "gray", children: "Receiver" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: e.status }) })
        ] }, e.id)) })
      ] }) })
    ] })
  ] });
}
export {
  AccountDetailPage as default
};
