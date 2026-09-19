import { d as reactExports, j as jsxRuntimeExports, D as Download, a0 as ScrollText, a1 as auditApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { c as Button, C as Card, F as Field, I as Input, L as LoadingBlock, E as ErrorState, a as EmptyState, B as Badge } from "./SessionsDialog-CsVQMlkl.js";
const PAGE = 50;
function AuditPage() {
  const [action, setAction] = reactExports.useState("");
  const [entityType, setEntityType] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [items, setItems] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const [exporting, setExporting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const filters = () => ({
    action: action.trim() || void 0,
    entityType: entityType.trim() || void 0
  });
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await auditApi.list({ ...filters(), limit: PAGE, offset: page * PAGE });
      setItems(r.items);
      setTotal(r.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  };
  const exportCsv = async () => {
    setExporting(true);
    try {
      const CHUNK = 500;
      const MAX = 2e4;
      const all = [];
      let offset = 0;
      for (; ; ) {
        const r = await auditApi.list({ ...filters(), limit: CHUNK, offset });
        all.push(...r.items);
        offset += CHUNK;
        if (r.items.length === 0 || all.length >= r.total || all.length >= MAX) break;
      }
      const header = ["time", "actor", "action", "entityType", "entityId", "meta"];
      const rows = all.map((e) => {
        var _a;
        return [
          new Date(e.ts).toISOString(),
          ((_a = e.user) == null ? void 0 : _a.email) ?? "system",
          e.action,
          e.entityType ?? "",
          e.entityId ?? "",
          e.meta ? JSON.stringify(e.meta) : ""
        ];
      });
      const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [page]);
  const apply = () => {
    setPage(0);
    load();
  };
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Audit Log",
        subtitle: "A record of every state-changing action on the platform.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: exportCsv, disabled: total === 0, loading: exporting, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Export CSV",
          total > items.length ? ` (${total})` : ""
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Action", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: action, onChange: (e) => setAction(e.target.value), placeholder: "e.g. ACCOUNT_CREATED" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Entity type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: entityType, onChange: (e) => setEntityType(e.target.value), placeholder: "e.g. Account" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: apply, className: "w-full", children: "Apply" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: load }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "h-10 w-10" }), title: "No audit entries", description: "Nothing matches these filters." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Actor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Entity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Details" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((e) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 align-top hover:bg-gray-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-gray-500", children: new Date(e.ts).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-700", children: ((_a = e.user) == null ? void 0 : _a.email) ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "system" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: e.action.includes("FAILED") || e.action.includes("DELETED") ? "red" : "gray", children: e.action }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-gray-500", children: [
              e.entityType ?? "—",
              e.entityId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-300", children: [
                " · ",
                e.entityId.slice(0, 8)
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-gray-500", children: e.meta ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "whitespace-pre-wrap break-all", children: JSON.stringify(e.meta) }) : "—" })
          ] }, e.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          total,
          " entr",
          total === 1 ? "y" : "ies",
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
  AuditPage as default
};
