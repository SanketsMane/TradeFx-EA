import { z as getUser, d as reactExports, j as jsxRuntimeExports, P as Plus, X as Building2, e as cn, Y as ExternalLink, Z as adminBrokersApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, c as Button, L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card, D as Dialog, F as Field, I as Input, d as Switch } from "./SessionsDialog-CsVQMlkl.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
const EMPTY = {
  name: "",
  blurb: "",
  signupUrl: "",
  highlights: "",
  sortOrder: 0,
  published: true
};
function BrokersPage() {
  var _a;
  const toast = useToast();
  const isSuper = ((_a = getUser()) == null ? void 0 : _a.role) === "SUPER_ADMIN";
  const { data, loading, error, reload } = useAsync(() => adminBrokersApi.list(), []);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const [toDelete, setToDelete] = reactExports.useState(null);
  const startNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setErr(null);
    setOpen(true);
  };
  const startEdit = (b) => {
    setEditing(b);
    setForm({
      name: b.name,
      blurb: b.blurb,
      signupUrl: b.signupUrl,
      highlights: b.highlights.join("\n"),
      sortOrder: b.sortOrder,
      published: b.published
    });
    setErr(null);
    setOpen(true);
  };
  const save = async () => {
    setErr(null);
    if (!form.name.trim() || !form.blurb.trim() || !form.signupUrl.trim()) {
      setErr("Name, description and the affiliate link are all required.");
      return;
    }
    if (!/^https?:\/\//i.test(form.signupUrl.trim())) {
      setErr("The affiliate link must start with http:// or https://.");
      return;
    }
    setBusy(true);
    try {
      const body = {
        name: form.name.trim(),
        blurb: form.blurb.trim(),
        signupUrl: form.signupUrl.trim(),
        highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
        sortOrder: Number(form.sortOrder) || 0,
        published: form.published
      };
      if (editing) await adminBrokersApi.update(editing.id, body);
      else await adminBrokersApi.create(body);
      toast(editing ? "Broker updated" : "Broker added", "success");
      setOpen(false);
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Partner brokers",
        subtitle: "Shown on the customer portal's “Open a broker account” page.",
        actions: isSuper && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: startNew, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add broker"
        ] })
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading brokers…" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : ((data == null ? void 0 : data.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10" }),
        title: "No partner brokers",
        description: "Until one is added and published, the portal's broker page shows nothing to customers.",
        action: isSuper ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: startNew, children: "Add broker" }) : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: data == null ? void 0 : data.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                b.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
              ),
              children: b.published ? "Published" : "Hidden"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-gray-600", children: b.blurb })
      ] }) }),
      b.highlights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1", children: b.highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-gray-600", children: [
        "· ",
        h
      ] }, h)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: b.signupUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "mt-3 inline-flex items-center gap-1.5 break-all text-xs text-brand-700 hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            b.signupUrl
          ]
        }
      ),
      isSuper && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2 border-t border-gray-100 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", onClick: () => startEdit(b), children: "Edit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", size: "sm", onClick: () => setToDelete(b), children: "Delete" })
      ] })
    ] }, b.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open,
        onClose: () => setOpen(false),
        title: editing ? "Edit broker" : "Add a partner broker",
        description: "Customers open accounts through this link, so check it carefully.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setOpen(false), disabled: busy, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading: busy, onClick: save, children: editing ? "Save changes" : "Add broker" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", htmlFor: "b-name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "b-name",
              value: form.name,
              onChange: (e) => setForm({ ...form, name: e.target.value }),
              placeholder: "Partner Broker"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", htmlFor: "b-blurb", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "b-blurb",
              rows: 3,
              value: form.blurb,
              onChange: (e) => setForm({ ...form, blurb: e.target.value }),
              className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Affiliate sign-up link",
              htmlFor: "b-url",
              hint: "Include your referral parameters. Must be a full https:// URL.",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "b-url",
                  value: form.signupUrl,
                  onChange: (e) => setForm({ ...form, signupUrl: e.target.value }),
                  placeholder: "https://broker.example/signup?ref=tradefx",
                  spellCheck: false
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Highlights", htmlFor: "b-high", hint: "One per line, up to eight.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "b-high",
              rows: 4,
              value: form.highlights,
              onChange: (e) => setForm({ ...form, highlights: e.target.value }),
              placeholder: "MT4 and MT5, hedging enabled\nAccounts usually approved same day",
              className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sort order", htmlFor: "b-sort", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "b-sort",
                type: "number",
                value: String(form.sortOrder),
                onChange: (e) => setForm({ ...form, sortOrder: Number(e.target.value) })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: form.published,
                  onChange: (v) => setForm({ ...form, published: v })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700", children: form.published ? "Visible to customers" : "Hidden" })
            ] }) })
          ] }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700", children: err })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: Boolean(toDelete),
        onClose: () => setToDelete(null),
        danger: true,
        confirmLabel: "Delete broker",
        title: "Delete this broker?",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: toDelete == null ? void 0 : toDelete.name }),
          " will be removed from the customer portal. Anyone who already opened an account through the link keeps it — this only stops new referrals."
        ] }),
        onConfirm: async () => {
          if (!toDelete) return;
          try {
            await adminBrokersApi.remove(toDelete.id);
            toast("Broker deleted", "success");
          } catch (e) {
            toast(e instanceof Error ? e.message : "Delete failed", "error");
          } finally {
            setToDelete(null);
            reload();
          }
        }
      }
    )
  ] });
}
export {
  BrokersPage as default
};
