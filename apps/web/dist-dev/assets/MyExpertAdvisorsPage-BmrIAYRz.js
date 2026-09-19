import { j as jsxRuntimeExports, L as Link, as as ShoppingBag, ap as Bot, N as productBySlug, e as cn, B as CircleCheck, at as Link2, a as ArrowRight, ar as portalApi } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card } from "./SessionsDialog-CsVQMlkl.js";
import { L as LicenseCode } from "./LicenseCode-MoVLS2Uc.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, a as demoLicenses } from "./usePageTitle-DQZV654c.js";
const STATUS = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700" },
  UNASSIGNED: { label: "Ready to connect", className: "bg-amber-50 text-amber-700" },
  SUSPENDED: { label: "Suspended", className: "bg-gray-100 text-gray-600" },
  EXPIRED: { label: "Expired", className: "bg-gray-100 text-gray-600" },
  REVOKED: { label: "Revoked", className: "bg-red-50 text-red-700" }
};
const date = (iso) => new Date(iso).toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric" });
function MyExpertAdvisorsPage() {
  usePageTitle("My Expert Advisors");
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.licenses(),
    demoLicenses
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading your Expert Advisors…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload });
  if (!data) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalHeader,
      {
        title: "My Expert Advisors",
        subtitle: "Everything you own, with the licence code for each one.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/products",
            className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
              " Browse the range"
            ]
          }
        )
      }
    ),
    data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-6 w-6" }),
        title: "You do not own an Expert Advisor yet",
        description: "Request a quotation for the one you want. Once the purchase is confirmed, your licence code appears here.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/products",
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700",
            children: "Browse Expert Advisors"
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: data.map((lic) => {
      const product = productBySlug(lic.productSlug);
      const status = STATUS[lic.status];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-5 sm:flex-row sm:items-center", children: [
        product && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.cardImage,
            alt: "",
            loading: "lazy",
            className: "h-24 w-auto shrink-0 self-start object-contain sm:h-28"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: lic.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.className), children: status.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
            "Issued ",
            date(lic.issuedAt)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-gray-400", children: "Licence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LicenseCode, { code: lic.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm", children: lic.linkedAccount ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-600" }),
            "Running on ",
            lic.linkedAccount.label,
            " (",
            lic.linkedAccount.platform,
            " ",
            lic.linkedAccount.login,
            ")"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-amber-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
            "Not connected to a trading account yet"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 sm:self-center", children: lic.linkedAccount ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: `/app/bots/${lic.id}`,
            className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
            children: [
              "Trade statement ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: `/app/accounts?license=${lic.code}`,
            className: "inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
              " Connect account"
            ]
          }
        ) })
      ] }) }, lic.id);
    }) })
  ] });
}
export {
  MyExpertAdvisorsPage as default
};
