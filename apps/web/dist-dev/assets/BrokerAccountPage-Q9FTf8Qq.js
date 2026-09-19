import { j as jsxRuntimeExports, X as Building2, f as Check, av as ArrowUpRight, a6 as Info, $ as ShieldCheck, ar as portalApi } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { L as LoadingBlock, E as ErrorState, C as Card } from "./SessionsDialog-CsVQMlkl.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, f as demoBrokers } from "./usePageTitle-DQZV654c.js";
const steps = [
  "Open the broker account through the link below.",
  "Fund it with whatever you intend to trade — the money stays in your name.",
  "Come back to Trading Accounts and connect it with your licence code."
];
function BrokerAccountPage() {
  usePageTitle("Open a broker account");
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.brokers(),
    demoBrokers
  );
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading partner brokers…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalHeader,
      {
        title: "Open a broker account",
        subtitle: "You need a MetaTrader account for the Expert Advisor to trade on."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        data == null ? void 0 : data.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 shrink-0 place-content-center rounded-xl bg-brand-50 text-brand-700", children: b.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.logo, alt: "", className: "h-7 w-7 object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: b.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-gray-600", children: b.blurb })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 grid gap-2.5 border-t border-gray-100 pt-5 sm:grid-cols-2", children: b.highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand-600", strokeWidth: 3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700", children: h })
          ] }, h)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: b.signupUrl,
              target: "_blank",
              rel: "noreferrer",
              className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
              children: [
                "Open an account with ",
                b.name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" })
              ]
            }
          )
        ] }, b.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-gray-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-gray-600", children: "These are affiliate links. If you open an account through one, we may receive a commission from the broker at no extra cost to you. You are free to use any MT4 or MT5 broker you like — our Expert Advisors work the same either way." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-gray-500", children: "What happens next" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-4 space-y-3", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 shrink-0 place-content-center rounded-full bg-brand-600 text-xs font-bold text-white", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-relaxed text-gray-700", children: s })
          ] }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-semibold text-gray-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-brand-600" }),
            " Your money stays yours"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-gray-600", children: "The broker account is in your name and under your control. TradeFx never holds your funds and cannot withdraw from your account — we only place trades on it. Deposit and withdraw whenever you want." })
        ] })
      ] })
    ] })
  ] });
}
export {
  BrokerAccountPage as default
};
