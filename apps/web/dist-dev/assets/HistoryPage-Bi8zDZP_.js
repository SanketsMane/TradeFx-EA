import { d as reactExports, j as jsxRuntimeExports, D as Download, x as History, m as monitoringApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { c as Button, C as Card, F as Field, b as Select, I as Input, L as LoadingBlock, E as ErrorState, a as EmptyState, e as StatusBadge } from "./SessionsDialog-CsVQMlkl.js";
const PAGE = 50;
function HistoryPage() {
  const [status, setStatus] = reactExports.useState("");
  const [symbol, setSymbol] = reactExports.useState("");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [items, setItems] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const [exporting, setExporting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const filters = () => ({
    status: status || void 0,
    symbol: symbol.trim() || void 0,
    from: from ? new Date(from).toISOString() : void 0,
    to: to ? new Date(to).toISOString() : void 0
  });
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await monitoringApi.history({ ...filters(), limit: PAGE, offset: page * PAGE });
      setItems(r.items);
      setTotal(r.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [page]);
  const applyFilters = () => {
    setPage(0);
    load();
  };
  const exportCsv = async () => {
    setExporting(true);
    try {
      const CHUNK = 500;
      const MAX = 2e4;
      const all = [];
      let offset = 0;
      for (; ; ) {
        const r = await monitoringApi.history({ ...filters(), limit: CHUNK, offset });
        all.push(...r.items);
        offset += CHUNK;
        if (r.items.length === 0 || all.length >= r.total || all.length >= MAX) break;
      }
      const header = ["time", "symbol", "side", "lots", "action", "status", "latencyMs", "pnl", "sourceTicket", "receiverTicket"];
      const rows = all.map((e) => [
        new Date(e.ts).toISOString(),
        e.symbol,
        e.side,
        e.lots,
        e.action,
        e.status,
        e.latencyMs ?? "",
        e.pnl ?? "",
        e.sourceTicket ?? "",
        e.receiverTicket ?? ""
      ]);
      const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `copy-events-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Trade History",
        subtitle: "Every copied trade across your copiers.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: exportCsv, disabled: total === 0, loading: exporting, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Export CSV",
          total > items.length ? ` (${total})` : ""
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status, onChange: (e) => setStatus(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUCCESS", children: "Success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "FAILED", children: "Failed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "FILTERED", children: "Filtered" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Symbol", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: symbol, onChange: (e) => setSymbol(e.target.value), placeholder: "EURUSD" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "From", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "To", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: applyFilters, className: "w-full", children: "Apply" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: load }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-10 w-10" }), title: "No trades", description: "Nothing matches these filters yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Side" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Lots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Latency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "P/L" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500", children: new Date(e.ts).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: e.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: e.side }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: e.lots }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: e.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500", children: e.latencyMs != null ? `${e.latencyMs}ms` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: `px-4 py-3 font-medium ${e.pnl == null ? "text-gray-400" : Number(e.pnl) >= 0 ? "text-emerald-600" : "text-red-600"}`,
              children: e.pnl == null ? "—" : Number(e.pnl).toFixed(2)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: e.status }) })
        ] }, e.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          total,
          " event",
          total === 1 ? "" : "s",
          " · page ",
          page + 1,
          " of ",
          pages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", disabled: page === 0, onClick: () => setPage((p) => p - 1), children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", disabled: page + 1 >= pages, onClick: () => setPage((p) => p + 1), children: "Next" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  HistoryPage as default
};
