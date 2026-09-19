import { d as reactExports, j as jsxRuntimeExports, I as FileText, e as cn, M as Mail, J as Phone, N as productBySlug, O as serviceBySlug, Q as adminQuotesApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, b as Select, L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card, c as Button, D as Dialog, F as Field } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
const STATUS = {
  NEW: { label: "New", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  IN_REVIEW: { label: "In review", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  QUOTED: { label: "Quoted", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  ACCEPTED: { label: "Accepted", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  DECLINED: { label: "Declined", className: "bg-gray-100 text-gray-600 ring-gray-200" },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600 ring-gray-200" }
};
const when = (iso) => new Date(iso).toLocaleString(void 0, {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
});
function subjectOf(q) {
  var _a, _b;
  return ((_a = productBySlug(q.productSlug ?? "")) == null ? void 0 : _a.name) ?? ((_b = serviceBySlug(q.serviceSlug ?? "")) == null ? void 0 : _b.name) ?? "General enquiry";
}
function QuotesPage() {
  const toast = useToast();
  const [filter, setFilter] = reactExports.useState("");
  const { data, loading, error, reload } = useAsync(
    () => adminQuotesApi.list(filter || void 0),
    [filter]
  );
  const [active, setActive] = reactExports.useState(null);
  const [note, setNote] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("QUOTED");
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const openReply = (q) => {
    setActive(q);
    setNote(q.quotedNote ?? "");
    setStatus(q.status === "NEW" || q.status === "IN_REVIEW" ? "QUOTED" : q.status);
    setErr(null);
  };
  const submit = async () => {
    if (!active) return;
    if (status === "QUOTED" && !note.trim()) {
      setErr("Write the quotation before sending — this text is what the customer receives.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await adminQuotesApi.update(active.id, { status, quotedNote: note.trim() || void 0 });
      toast(status === "QUOTED" ? "Quotation sent to the customer" : "Request updated", "success");
      setActive(null);
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update the request.");
    } finally {
      setBusy(false);
    }
  };
  const open = (data == null ? void 0 : data.filter((q) => q.status === "NEW" || q.status === "IN_REVIEW").length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Quotations",
        subtitle: "Requests from the public site and the customer portal.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filter, onChange: (e) => setFilter(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "NEW", children: "New" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IN_REVIEW", children: "In review" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "QUOTED", children: "Quoted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACCEPTED", children: "Accepted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DECLINED", children: "Declined" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CLOSED", children: "Closed" })
        ] }) })
      }
    ),
    open > 0 && !filter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: open }),
      " request",
      open === 1 ? "" : "s",
      " waiting for a reply."
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading quotations…" }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload }) : ((data == null ? void 0 : data.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10" }),
        title: "No quotation requests",
        description: filter ? "Nothing with that status." : "Requests from the site will appear here."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data == null ? void 0 : data.map((q) => {
      const s = STATUS[q.status];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: subjectOf(q) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                    s.className
                  ),
                  children: s.label
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-gray-700", children: q.reference }),
              " · ",
              when(q.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => openReply(q), children: q.status === "QUOTED" ? "Update reply" : "Reply with a price" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900", children: q.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `mailto:${q.email}`,
              className: "inline-flex items-center gap-1.5 text-gray-600 hover:text-brand-700",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
                " ",
                q.email
              ]
            }
          ),
          q.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `tel:${q.phone}`,
              className: "inline-flex items-center gap-1.5 text-gray-600 hover:text-brand-700",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
                " ",
                q.phone
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 border-l-2 border-gray-200 pl-3 text-sm leading-relaxed text-gray-600", children: q.message }),
        (q.broker || q.accountSize) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500", children: [
          q.broker && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Broker: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700", children: q.broker })
          ] }),
          q.accountSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Account size: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700", children: q.accountSize })
          ] })
        ] }),
        q.quotedNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-emerald-700", children: "Sent to the customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-line text-sm text-emerald-900", children: q.quotedNote }),
          q.quotedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-emerald-700", children: [
            "Replied ",
            when(q.quotedAt)
          ] })
        ] })
      ] }, q.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: Boolean(active),
        onClose: () => setActive(null),
        title: `Reply to ${(active == null ? void 0 : active.reference) ?? ""}`,
        description: "What you write here is emailed to the customer and shown in their portal.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setActive(null), disabled: busy, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading: busy, onClick: submit, children: status === "QUOTED" ? "Send quotation" : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", htmlFor: "q-status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { id: "q-status", value: status, onChange: (e) => setStatus(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "IN_REVIEW", children: "In review — no email sent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "QUOTED", children: "Quoted — emails the customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACCEPTED", children: "Accepted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DECLINED", children: "Declined" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CLOSED", children: "Closed" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Message to the customer",
              htmlFor: "q-note",
              hint: "Include the figure, what it covers and how long it is valid.",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "q-note",
                  rows: 6,
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  placeholder: "For a $10,000 account, TradeFx Heddge is USD 349 for a perpetual licence on one trading account.\nThe quote is valid for 14 days.",
                  className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-900", children: "The platform stores no price field — this text is the quotation. Nothing else in the product will ever show the customer a number." }),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700", children: err })
        ] })
      }
    )
  ] });
}
export {
  QuotesPage as default
};
