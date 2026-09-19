import { d as reactExports, j as jsxRuntimeExports, P as Plus, K as KeyRound, L as Link, e as cn, V as products, W as adminLicensesApi, u as usersApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, c as Button, L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card, D as Dialog, F as Field, b as Select, I as Input } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { f as formatLicenseCode } from "./portalData-C1l0nslE.js";
const STATUS = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  UNASSIGNED: { label: "Not connected", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  SUSPENDED: { label: "Suspended", className: "bg-gray-100 text-gray-600 ring-gray-200" },
  EXPIRED: { label: "Expired", className: "bg-gray-100 text-gray-600 ring-gray-200" },
  REVOKED: { label: "Revoked", className: "bg-red-50 text-red-700 ring-red-200" }
};
const date = (iso) => new Date(iso).toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric" });
function LicensesPage() {
  var _a;
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => adminLicensesApi.list(), []);
  const customers = useAsync(() => usersApi.list({ role: "CUSTOMER", limit: 200 }), []);
  const [open, setOpen] = reactExports.useState(false);
  const [userId, setUserId] = reactExports.useState("");
  const [productSlug, setProductSlug] = reactExports.useState("");
  const [expiresAt, setExpiresAt] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const issue = async () => {
    setErr(null);
    if (!userId || !productSlug) {
      setErr("Choose a customer and an Expert Advisor.");
      return;
    }
    setBusy(true);
    try {
      const lic = await adminLicensesApi.issue({
        userId,
        productSlug,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : void 0
      });
      toast(`Licence ${formatLicenseCode(lic.code)} issued and emailed`, "success");
      setOpen(false);
      setUserId("");
      setProductSlug("");
      setExpiresAt("");
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not issue the licence.");
    } finally {
      setBusy(false);
    }
  };
  const setStatus = async (id, status) => {
    try {
      await adminLicensesApi.update(id, { status });
      toast(`Licence ${status.toLowerCase()}`, "success");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Licences",
        subtitle: "Expert Advisor entitlements. Issuing one emails the code to the customer.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Issue licence"
        ] })
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading licences…" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : ((data == null ? void 0 : data.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-10 w-10" }),
        title: "No licences issued",
        description: "Issue one once a customer's purchase is confirmed — the code is emailed to them straight away.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Issue licence"
        ] })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-gray-100 bg-gray-50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Code", "Expert Advisor", "Customer", "Status", "Connected to", "Issued", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: data == null ? void 0 : data.map((l) => {
        const s = STATUS[l.status];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-gray-900", children: formatLicenseCode(l.code) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-gray-900", children: l.productName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: `/dashboard/users/${l.user.id}`,
              className: "text-brand-700 hover:underline",
              children: l.user.fullName ?? l.user.email
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", s.className),
              children: s.label
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-gray-500", children: l.linkedAccount ? `${l.linkedAccount.label} (${l.linkedAccount.login})` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-gray-500", children: date(l.issuedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-4 py-3 text-right", children: l.status === "REVOKED" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "Revoked" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            l.status === "SUSPENDED" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setStatus(l.id, l.linkedAccount ? "ACTIVE" : "UNASSIGNED"),
                className: "text-xs font-semibold text-brand-700 hover:underline",
                children: "Restore"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setStatus(l.id, "SUSPENDED"),
                className: "text-xs font-semibold text-gray-600 hover:underline",
                children: "Suspend"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setStatus(l.id, "REVOKED"),
                className: "text-xs font-semibold text-red-600 hover:underline",
                children: "Revoke"
              }
            )
          ] }) })
        ] }, l.id);
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open,
        onClose: () => setOpen(false),
        title: "Issue a licence",
        description: "The code is generated, stored and emailed to the customer immediately.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setOpen(false), disabled: busy, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading: busy, onClick: issue, children: "Issue and email" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Customer", htmlFor: "lic-user", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { id: "lic-user", value: userId, onChange: (e) => setUserId(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a customer…" }),
            (_a = customers.data) == null ? void 0 : _a.items.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: u.id, children: u.fullName ? `${u.fullName} — ${u.email}` : u.email }, u.id))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expert Advisor", htmlFor: "lic-product", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { id: "lic-product", value: productSlug, onChange: (e) => setProductSlug(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select an Expert Advisor…" }),
            products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.slug, children: p.name }, p.slug))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expires", htmlFor: "lic-expiry", hint: "Leave blank for a perpetual licence.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "lic-expiry",
              type: "date",
              value: expiresAt,
              onChange: (e) => setExpiresAt(e.target.value)
            }
          ) }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700", children: err })
        ] })
      }
    )
  ] });
}
export {
  LicensesPage as default
};
