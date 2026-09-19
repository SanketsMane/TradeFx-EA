import { d as reactExports, _ as adminsApi, j as jsxRuntimeExports, P as Plus, $ as ShieldCheck, K as KeyRound, T as Trash2 } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, D as Dialog, F as Field, I as Input, c as Button, C as Card, L as LoadingBlock, E as ErrorState, a as EmptyState, e as StatusBadge, d as Switch } from "./SessionsDialog-CsVQMlkl.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
function AddAdminDialog({
  open,
  onClose,
  onCreated
}) {
  const toast = useToast();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const submit = async () => {
    setError(null);
    if (!email || password.length < 8) {
      setError("Enter an email and a password of at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await adminsApi.create(email, password);
      toast("Admin created", "success");
      setEmail("");
      setPassword("");
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      title: "Create Admin",
      description: "Admins can manage master & slave accounts.",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading, onClick: submit, children: "Create Admin" })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "email",
            placeholder: "admin@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Temporary Password", hint: "At least 8 characters. The admin can change it later.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value)
          }
        ) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error })
      ] })
    }
  );
}
function AdminsPage() {
  const toast = useToast();
  const { data: admins, loading, error, reload } = useAsync(() => adminsApi.list(), []);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [resetFor, setResetFor] = reactExports.useState(null);
  const [newPass, setNewPass] = reactExports.useState("");
  const [resetting, setResetting] = reactExports.useState(false);
  const [deleteFor, setDeleteFor] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const list = admins ?? [];
  const doDelete = async () => {
    if (!deleteFor) return;
    setDeleting(true);
    try {
      await adminsApi.remove(deleteFor.id);
      toast("Admin deleted", "success");
      setDeleteFor(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };
  const toggleStatus = async (a, active) => {
    try {
      await adminsApi.setStatus(a.id, active ? "ACTIVE" : "DISABLED");
      toast(active ? "Admin enabled" : "Admin disabled", "success");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    }
  };
  const doReset = async () => {
    if (!resetFor) return;
    if (newPass.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    setResetting(true);
    try {
      await adminsApi.resetPassword(resetFor.id, newPass);
      toast("Password reset", "success");
      setResetFor(null);
      setNewPass("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Reset failed", "error");
    } finally {
      setResetting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Admins",
        subtitle: "Create and manage admin users.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create Admin"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 p-4 text-sm font-semibold text-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-brand-600" }),
        " Admin Users"
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-10 w-10" }),
          title: "No admins yet",
          description: "Create an admin to delegate account management.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Create Admin"
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Created" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Enabled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: list.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: a.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-500", children: new Date(a.createdAt).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: a.status === "ACTIVE",
              onChange: (v) => toggleStatus(a, v)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setResetFor(a);
                  setNewPass("");
                },
                className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3.5 w-3.5" }),
                  " Reset password"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setDeleteFor(a),
                className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  " Delete"
                ]
              }
            )
          ] }) })
        ] }, a.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddAdminDialog, { open: addOpen, onClose: () => setAddOpen(false), onCreated: reload }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!resetFor,
        onClose: () => setResetFor(null),
        title: "Reset password",
        description: resetFor == null ? void 0 : resetFor.email,
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setResetFor(null), disabled: resetting, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading: resetting, onClick: doReset, children: "Reset" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "New password", hint: "At least 8 characters. This signs the admin out everywhere.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "password",
            value: newPass,
            onChange: (e) => setNewPass(e.target.value),
            placeholder: "••••••••"
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteFor,
        onClose: () => setDeleteFor(null),
        onConfirm: doDelete,
        title: "Delete admin",
        confirmLabel: "Delete",
        danger: true,
        loading: deleting,
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Permanently delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900", children: deleteFor == null ? void 0 : deleteFor.email }),
          "? They must own no accounts. This cannot be undone."
        ] })
      }
    )
  ] });
}
export {
  AdminsPage as default
};
