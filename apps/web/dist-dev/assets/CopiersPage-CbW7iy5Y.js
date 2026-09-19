import { b as accountsApi, d as reactExports, c as copierApi, j as jsxRuntimeExports, L as Link, l as useNavigate, P as Plus, n as Copy, E as Eye, T as Trash2 } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, D as Dialog, F as Field, I as Input, b as Select, c as Button, S as StatCard, C as Card, L as LoadingBlock, E as ErrorState, a as EmptyState, B as Badge, d as Switch } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
function CreateCopierDialog({
  open,
  onClose,
  onCreated
}) {
  const toast = useToast();
  const { data: accounts } = useAsync(() => accountsApi.list(), [open]);
  const [name, setName] = reactExports.useState("");
  const [sourceId, setSourceId] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const available = (accounts ?? []).filter((a) => !a.sourceForConfig);
  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError("Enter a copier name.");
    if (!sourceId) return setError("Select a source account.");
    setLoading(true);
    try {
      await copierApi.create(name.trim(), sourceId);
      toast("EA master created", "success");
      setName("");
      setSourceId("");
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create copier");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      title: "Create EA Master",
      description: "Pick the source account whose trades will be copied to receivers.",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading, onClick: submit, disabled: available.length === 0, children: "Create" })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Master name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. TradeFx Scalper Master", value: name, onChange: (e) => setName(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Source account (master)", hint: "The account whose trades are copied.", children: available.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-700", children: [
          "No available accounts. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/accounts", className: "font-medium underline", children: "Add an account" }),
          " first (accounts already used as a source can't be reused)."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sourceId, onChange: (e) => setSourceId(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select an account…" }),
          available.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: a.id, children: [
            a.label,
            " · ",
            a.platform,
            " · ",
            a.login
          ] }, a.id))
        ] }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error })
      ] })
    }
  );
}
const MAX_COPIERS = 2;
function CopiersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: copiers, loading, error, reload } = useAsync(() => copierApi.list(), []);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [toDelete, setToDelete] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const list = copiers ?? [];
  const enabled = list.filter((c) => c.enabled).length;
  const receivers = list.reduce((n, c) => n + c._count.subscriptions, 0);
  const toggleEnabled = async (c) => {
    try {
      await copierApi.update(c.id, { enabled: !c.enabled });
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    }
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await copierApi.remove(toDelete.id);
      toast("EA master deleted", "success");
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
        title: "EA Masters",
        subtitle: "Each master runs an Expert Advisor and mirrors its trades to client accounts.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), disabled: list.length >= MAX_COPIERS, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create EA Master"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "EA Masters", value: list.length, sub: `of ${MAX_COPIERS} allowed` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active", value: enabled, sub: "masters running" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Receivers", value: receivers, sub: "across all masters" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 p-4 text-sm font-semibold text-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 text-brand-600" }),
        " EA Masters"
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-10 w-10" }),
          title: "No EA masters yet",
          description: "Create a master and pick the account the Expert Advisor runs on.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Create EA Master"
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Receivers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Enabled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate(`/dashboard/copiers/${c.id}`),
              className: "font-medium text-gray-900 hover:text-brand-700",
              children: c.name
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-gray-600", children: [
            c.sourceAccount.label,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-gray-400", children: [
              "· ",
              c.sourceAccount.login
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "gray", children: c._count.subscriptions }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: c.enabled, onChange: () => toggleEnabled(c) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => navigate(`/dashboard/copiers/${c.id}`),
                className: "rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700",
                title: "View",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setToDelete(c),
                className: "rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600",
                title: "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, c.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CreateCopierDialog, { open: addOpen, onClose: () => setAddOpen(false), onCreated: reload }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!toDelete,
        onClose: () => setToDelete(null),
        onConfirm: confirmDelete,
        loading: deleting,
        danger: true,
        title: "Delete EA master?",
        confirmLabel: "Delete",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: toDelete == null ? void 0 : toDelete.name }),
          " and all its receiver subscriptions? The accounts themselves stay. This cannot be undone."
        ] })
      }
    )
  ] });
}
export {
  CopiersPage as default
};
