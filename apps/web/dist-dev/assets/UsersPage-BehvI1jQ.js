import { d as reactExports, j as jsxRuntimeExports, L as Link, g as Search, U as Users, e as cn, u as usersApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { S as StatCard, C as Card, I as Input, c as Button, b as Select, L as LoadingBlock, E as ErrorState, a as EmptyState } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
const PAGE = 25;
const ROLE_LABEL = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  CUSTOMER: "Customer"
};
function StatusCell({ status }) {
  const active = status === "ACTIVE";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-red-500") }),
        active ? "Active" : "Disabled"
      ]
    }
  );
}
const date = (iso) => new Date(iso).toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric" });
function UsersPage() {
  var _a, _b, _c, _d, _e, _f;
  const [q, setQ] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const stats = useAsync(() => usersApi.stats(), []);
  const { data, loading, error, reload } = useAsync(
    () => usersApi.list({
      q: search || void 0,
      role: role || void 0,
      status: status || void 0,
      limit: PAGE,
      offset: page * PAGE
    }),
    [search, role, status, page]
  );
  const applySearch = () => {
    setPage(0);
    setSearch(q.trim());
  };
  const total = (data == null ? void 0 : data.total) ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Users", subtitle: "Everyone on the platform — customers and staff." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Customers",
          value: ((_a = stats.data) == null ? void 0 : _a.customers) ?? "—",
          sub: `${((_b = stats.data) == null ? void 0 : _b.activeCustomers) ?? 0} active`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Staff accounts", value: ((_c = stats.data) == null ? void 0 : _c.staff) ?? "—", sub: "Admins and super admins" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Licences",
          value: ((_d = stats.data) == null ? void 0 : _d.licenses) ?? "—",
          sub: `${((_e = stats.data) == null ? void 0 : _e.activeLicenses) ?? 0} active`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Open quotations",
          value: ((_f = stats.data) == null ? void 0 : _f.openQuotes) ?? "—",
          sub: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/quotes", className: "text-brand-700 hover:underline", children: "Go to inbox" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-4 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[240px] flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "user-search", className: "mb-1.5 block text-xs font-medium text-gray-600", children: "Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "user-search",
              value: q,
              onChange: (e) => setQ(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && applySearch(),
              placeholder: "Email, name or phone"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: applySearch, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "user-role", className: "mb-1.5 block text-xs font-medium text-gray-600", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            id: "user-role",
            value: role,
            onChange: (e) => {
              setPage(0);
              setRole(e.target.value);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All roles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CUSTOMER", children: "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ADMIN", children: "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUPER_ADMIN", children: "Super Admin" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "user-status", className: "mb-1.5 block text-xs font-medium text-gray-600", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            id: "user-status",
            value: status,
            onChange: (e) => {
              setPage(0);
              setStatus(e.target.value);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Any status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACTIVE", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DISABLED", children: "Disabled" })
            ]
          }
        )
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading users…" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : ((data == null ? void 0 : data.items.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10" }),
        title: "No users match",
        description: search || role || status ? "Try a different search or clear the filters." : "Nobody has registered yet."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-gray-100 bg-gray-50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["User", "Role", "Status", "Licences", "Accounts", "Joined", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: data == null ? void 0 : data.items.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-gray-900", children: u.fullName ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: u.email }),
            u.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
              "+91 ",
              u.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "rounded px-1.5 py-0.5 text-xs font-medium",
                u.role === "CUSTOMER" ? "bg-gray-100 text-gray-700" : "bg-brand-50 text-brand-700"
              ),
              children: ROLE_LABEL[u.role]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusCell, { status: u.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 tabular-nums text-gray-600", children: u._count.licenses }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 tabular-nums text-gray-600", children: u._count.ownedAccounts }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-gray-500", children: date(u.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: `/dashboard/users/${u.id}`,
              className: "text-sm font-semibold text-brand-700 hover:text-brand-800",
              children: "Manage"
            }
          ) })
        ] }, u.id)) })
      ] }) }),
      pages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-gray-100 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
          page * PAGE + 1,
          "–",
          Math.min((page + 1) * PAGE, total),
          " of ",
          total
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", disabled: page === 0, onClick: () => setPage((p) => p - 1), children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              disabled: page + 1 >= pages,
              onClick: () => setPage((p) => p + 1),
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  UsersPage as default
};
