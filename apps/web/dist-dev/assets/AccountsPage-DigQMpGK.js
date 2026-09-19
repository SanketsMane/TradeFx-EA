import { d as reactExports, j as jsxRuntimeExports, C as ChevronDown, e as cn, f as Check, b as accountsApi, P as Plus, S as Server, g as Search, L as Link, h as Pencil, T as Trash2, m as monitoringApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, D as Dialog, F as Field, I as Input, b as Select, c as Button, S as StatCard, C as Card, L as LoadingBlock, E as ErrorState, a as EmptyState, B as Badge, d as Switch, e as StatusBadge } from "./SessionsDialog-CsVQMlkl.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { n as num, m as money } from "./format-D2xU1sb4.js";
function Combobox({
  value,
  onChange,
  options,
  placeholder,
  loading
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [active, setActive] = reactExports.useState(0);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = value.trim().toLowerCase();
    const list = q ? options.filter((o) => o.value.toLowerCase().includes(q)) : options;
    return list.slice(0, 50);
  }, [value, options]);
  reactExports.useEffect(() => setActive(0), [value]);
  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };
  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[active]) {
        e.preventDefault();
        pick(filtered[active].value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value,
          onChange: (e) => {
            onChange(e.target.value);
            setOpen(true);
          },
          onFocus: () => setOpen(true),
          onKeyDown,
          placeholder,
          autoComplete: "off",
          spellCheck: false,
          role: "combobox",
          "aria-expanded": open,
          className: "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          tabIndex: -1,
          onClick: () => setOpen((v) => !v),
          className: "absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 hover:text-gray-600",
          "aria-label": "Show suggestions",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("h-4 w-4 transition-transform", open && "rotate-180") })
        }
      )
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-sm text-gray-400", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 text-sm text-gray-400", children: [
      "No match — press Enter to use “",
      value,
      "” as typed."
    ] }) : filtered.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onMouseEnter: () => setActive(i),
        onClick: () => pick(o.value),
        className: cn(
          "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm",
          i === active ? "bg-gray-50 text-gray-900" : "text-gray-700"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: o.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex shrink-0 items-center gap-2", children: [
            o.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700", children: o.hint }),
            value === o.value && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-brand-600" })
          ] })
        ]
      },
      o.value
    )) })
  ] });
}
function useBrokerServers(enabled) {
  const [options, setOptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!enabled || options.length > 0) return;
    let cancelled = false;
    setLoading(true);
    accountsApi.servers().then((rows) => {
      if (cancelled) return;
      setOptions(rows.map((r) => ({ value: r.server, hint: r.inUse ? "in use" : void 0 })));
    }).catch(() => void 0).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return { options, loading };
}
const empty = { label: "", login: "", password: "", server: "", platform: "MT5" };
function AddAccountDialog({
  open,
  onClose,
  onCreated
}) {
  const toast = useToast();
  const [form, setForm] = reactExports.useState(empty);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const servers = useBrokerServers(open);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async () => {
    setError(null);
    if (!form.label || !form.login || !form.password || !form.server) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await accountsApi.create(form);
      toast("Account connected", "success");
      setForm(empty);
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add account");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      title: "Add Account",
      description: "Connect a MetaTrader account. Assign it as a source or receiver in a copier afterwards.",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading, onClick: submit, children: "Add Account" })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Account name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Sanket Master", value: form.label, onChange: (e) => set("label")(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "MT Login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 5001234", value: form.login, onChange: (e) => set("login")(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Platform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.platform, onChange: (e) => set("platform")(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MT5", children: "MT5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MT4", children: "MT4" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Broker Server",
            hint: "Start typing to search. Not listed? Type the exact name from your MT terminal.",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Combobox,
              {
                value: form.server,
                onChange: set("server"),
                options: servers.options,
                loading: servers.loading,
                placeholder: "e.g. ICMarkets-Live02"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Password",
            hint: "Receivers need the trade (master) password; sources can use investor. Encrypted at rest.",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Account password", value: form.password, onChange: (e) => set("password")(e.target.value) })
          }
        ),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error })
      ] })
    }
  );
}
function RoleBadges({ a }) {
  const isSource = !!a.sourceForConfig;
  const isReceiver = a._count.receiverSubscriptions > 0;
  if (!isSource && !isReceiver) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "Unused" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
    isSource && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "blue", children: "Source" }),
    isReceiver && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "gray", children: "Receiver" })
  ] });
}
function AccountsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(async () => {
    const accounts = await accountsApi.list();
    const snaps = await Promise.all(
      accounts.map((a) => monitoringApi.snapshot(a.id).catch(() => null))
    );
    const balances2 = {};
    accounts.forEach((a, i) => {
      balances2[a.id] = snaps[i];
    });
    return { accounts, balances: balances2 };
  }, []);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [toDelete, setToDelete] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [editFor, setEditFor] = reactExports.useState(null);
  const [editLabel, setEditLabel] = reactExports.useState("");
  const [editServer, setEditServer] = reactExports.useState("");
  const [editPassword, setEditPassword] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const serverOpts = useBrokerServers(!!editFor);
  reactExports.useEffect(() => {
    if (editFor) {
      setEditLabel(editFor.label);
      setEditServer(editFor.server);
      setEditPassword("");
    }
  }, [editFor]);
  const saveEdit = async () => {
    if (!editFor) return;
    if (!editLabel.trim() || !editServer.trim()) {
      toast("Name and server are required.", "error");
      return;
    }
    const body = {};
    if (editLabel.trim() !== editFor.label) body.label = editLabel.trim();
    if (editServer.trim() !== editFor.server) body.server = editServer.trim();
    if (editPassword.trim()) body.password = editPassword.trim();
    if (Object.keys(body).length === 0) {
      setEditFor(null);
      return;
    }
    setSaving(true);
    try {
      await accountsApi.update(editFor.id, body);
      toast("Account updated", "success");
      setEditFor(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const list = (data == null ? void 0 : data.accounts) ?? [];
  const balances = (data == null ? void 0 : data.balances) ?? {};
  const connected = list.filter((a) => a.status === "CONNECTED").length;
  const sources = list.filter((a) => a.sourceForConfig).length;
  const receivers = list.filter((a) => a._count.receiverSubscriptions > 0).length;
  const totalEquity = list.reduce((t, a) => {
    var _a;
    return t + num((_a = balances[a.id]) == null ? void 0 : _a.equity);
  }, 0);
  const hasEquity = list.some((a) => balances[a.id] != null);
  const filtered = list.filter(
    (a) => a.label.toLowerCase().includes(q.toLowerCase()) || a.login.includes(q) || a.server.toLowerCase().includes(q.toLowerCase())
  );
  const toggleConnection = async (a) => {
    try {
      if (a.status === "CONNECTED") await accountsApi.disconnect(a.id);
      else await accountsApi.connect(a.id);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    }
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await accountsApi.remove(toDelete.id);
      toast("Account removed", "success");
      setToDelete(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Account Configuration",
        subtitle: "Connect your MetaTrader accounts. Wire them into copiers next.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Account"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Accounts", value: list.length, sub: `${connected} connected` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Equity",
          value: hasEquity ? money(totalEquity) : "—",
          sub: "across all accounts"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Sources", value: sources, sub: "acting as masters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Receivers", value: receivers, sub: "copying a source" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-4 w-4 text-brand-600" }),
          " Accounts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: "Search accounts", value: q, onChange: (e) => setQ(e.target.value) })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "h-10 w-10" }),
          title: "No accounts yet",
          description: "Add your first MetaTrader account to get started.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Account"
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Platform" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Equity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Connection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/dashboard/accounts/${a.id}`, className: "text-gray-900 hover:text-brand-700 hover:underline", children: a.label }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500", children: a.login }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "blue", children: a.platform }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-gray-700", children: balances[a.id] ? money(balances[a.id].balance) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums font-medium text-gray-900", children: balances[a.id] ? money(balances[a.id].equity) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadges, { a }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: a.status === "CONNECTED", onChange: () => toggleConnection(a) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setEditFor(a),
                  className: "rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700",
                  title: "Edit",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setToDelete(a),
                  className: "rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600",
                  title: "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] }) })
          ] }, a.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 9, className: "px-4 py-10 text-center text-sm text-gray-400", children: [
            "No accounts match “",
            q,
            "”."
          ] }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddAccountDialog, { open: addOpen, onClose: () => setAddOpen(false), onCreated: reload }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!editFor,
        onClose: () => setEditFor(null),
        title: "Edit account",
        description: editFor ? `${editFor.login} · ${editFor.platform}` : void 0,
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setEditFor(null), disabled: saving, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading: saving, onClick: saveEdit, children: "Save changes" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editLabel, onChange: (e) => setEditLabel(e.target.value), placeholder: "Account label" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Broker server",
              hint: "Start typing to search. Not listed? Type the exact name from your MT terminal.",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Combobox,
                {
                  value: editServer,
                  onChange: setEditServer,
                  options: serverOpts.options,
                  loading: serverOpts.loading,
                  placeholder: "e.g. ICMarkets-Live02"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Broker password",
              hint: "Leave blank to keep the current password. Stored encrypted.",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "password",
                  value: editPassword,
                  onChange: (e) => setEditPassword(e.target.value),
                  placeholder: "Enter to rotate the password",
                  autoComplete: "new-password"
                }
              )
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!toDelete,
        onClose: () => setToDelete(null),
        onConfirm: confirmDelete,
        loading: deleting,
        danger: true,
        title: "Delete account?",
        confirmLabel: "Delete",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Remove ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: toDelete == null ? void 0 : toDelete.label }),
          "? Any copier using it (as source or receiver) will be updated. This cannot be undone."
        ] })
      }
    )
  ] });
}
export {
  AccountsPage as default
};
