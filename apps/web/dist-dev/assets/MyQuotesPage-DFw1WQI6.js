import { j as jsxRuntimeExports, L as Link, P as Plus, I as FileText, N as productBySlug, O as serviceBySlug, e as cn, aw as quotesApi } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card } from "./SessionsDialog-CsVQMlkl.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, g as demoQuotes } from "./usePageTitle-DQZV654c.js";
const STATUS = {
  NEW: { label: "Received", className: "bg-blue-50 text-blue-700" },
  IN_REVIEW: { label: "Being reviewed", className: "bg-amber-50 text-amber-700" },
  QUOTED: { label: "Price sent", className: "bg-emerald-50 text-emerald-700" },
  ACCEPTED: { label: "Accepted", className: "bg-emerald-50 text-emerald-700" },
  DECLINED: { label: "Declined", className: "bg-gray-100 text-gray-600" },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600" }
};
const date = (iso) => new Date(iso).toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric" });
function MyQuotesPage() {
  usePageTitle("My Quotations");
  const { data, loading, error, preview, reload } = usePortalResource(
    () => quotesApi.mine(),
    demoQuotes
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading your quotations…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalHeader,
      {
        title: "My Quotations",
        subtitle: "Requests you have sent us, and where each one stands.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/quote",
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " New request"
            ]
          }
        )
      }
    ),
    ((data == null ? void 0 : data.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6" }),
        title: "No quotation requests yet",
        description: "Tell us which Expert Advisor or service you are interested in and an advisor will send you a price.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/quote",
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700",
            children: "Request a quotation"
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data == null ? void 0 : data.map((q) => {
      var _a, _b;
      const subject = ((_a = productBySlug(q.productSlug ?? "")) == null ? void 0 : _a.name) ?? ((_b = serviceBySlug(q.serviceSlug ?? "")) == null ? void 0 : _b.name) ?? "General enquiry";
      const status = STATUS[q.status];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.className), children: status.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
            "Reference ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-gray-700", children: q.reference }),
            " · sent ",
            date(q.createdAt)
          ] })
        ] }) }),
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
        q.quotedNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-emerald-900", children: q.quotedNote }),
          q.quotedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-emerald-700", children: [
            "Replied ",
            date(q.quotedAt)
          ] })
        ] })
      ] }, q.id);
    }) })
  ] });
}
export {
  MyQuotesPage as default
};
