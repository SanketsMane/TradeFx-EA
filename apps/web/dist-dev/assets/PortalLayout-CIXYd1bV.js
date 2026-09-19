import { d as reactExports, j as jsxRuntimeExports, L as Link, ab as X, ac as LayoutDashboard, ap as Bot, aq as Wallet, X as Building2, I as FileText, af as NavLink, e as cn, as as ShoppingBag, ay as LifeBuoy, ag as Menu, aj as Outlet, az as FloatingTelegram, a6 as Info, z as getUser, l as useNavigate, ak as logoutServer, al as logout, C as ChevronDown, K as KeyRound, am as MonitorSmartphone, G as LogOut } from "./index-DS595Jt3.js";
import { T as ToastProvider, A as Avatar, f as ChangePasswordDialog, g as SessionsDialog } from "./SessionsDialog-CsVQMlkl.js";
function PortalHeader({
  title,
  subtitle,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-gray-900", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: subtitle })
    ] }),
    actions
  ] });
}
function PreviewBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-600" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Preview data." }),
      " The portal API is not running, so these figures are samples for laying out the page — not your account."
    ] })
  ] });
}
const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/bots", label: "My Expert Advisors", icon: Bot },
  { to: "/app/accounts", label: "Trading Accounts", icon: Wallet },
  { to: "/app/broker", label: "Open Broker Account", icon: Building2 },
  { to: "/app/quotes", label: "My Quotations", icon: FileText }
];
function UserMenu() {
  var _a;
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  const [pwOpen, setPwOpen] = reactExports.useState(false);
  const [sessionsOpen, setSessionsOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const onLogout = async () => {
    await logoutServer();
    logout();
    navigate("/login");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        className: "flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { name: (user == null ? void 0 : user.email) ?? "?", className: "h-9 w-9 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden text-left sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold leading-tight text-gray-900", children: (_a = user == null ? void 0 : user.email) == null ? void 0 : _a.split("@")[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs leading-tight text-gray-400", children: "Client" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium text-gray-800", children: user == null ? void 0 : user.email }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setOpen(false);
            setPwOpen(true);
          },
          className: "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }),
            " Change password"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setOpen(false);
            setSessionsOpen(true);
          },
          className: "flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorSmartphone, { className: "h-4 w-4" }),
            " Active sessions"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onLogout,
          className: "flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            " Sign out"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePasswordDialog, { open: pwOpen, onClose: () => setPwOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SessionsDialog, { open: sessionsOpen, onClose: () => setSessionsOpen(false) })
  ] });
}
function PortalLayout() {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 items-center justify-between border-b border-gray-100 px-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-dark.webp", alt: "TradeFx", className: "h-7 w-auto object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "text-gray-400 md:hidden",
                onClick: () => setMobileOpen(false),
                "aria-label": "Close menu",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 space-y-1 overflow-y-auto px-3 py-5", children: [
            nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              NavLink,
              {
                to: item.to,
                end: item.end,
                onClick: () => setMobileOpen(false),
                className: ({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-[18px] w-[18px] shrink-0" }),
                  item.label
                ]
              },
              item.to
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "!mt-6 border-t border-gray-100 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/products",
                  className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-[18px] w-[18px] shrink-0" }),
                    "Browse Expert Advisors"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/contact",
                  className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "h-[18px] w-[18px] shrink-0" }),
                    "Support"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-gray-100 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/quote",
              className: "flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
              children: "Request a quotation"
            }
          ) })
        ]
      }
    ),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-30 bg-gray-900/40 md:hidden",
        onClick: () => setMobileOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col md:pl-64", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur sm:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setMobileOpen(true),
            className: "text-gray-600 md:hidden",
            "aria-label": "Open menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-dark.webp", alt: "TradeFx", className: "h-6 w-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-gray-100 px-4 py-4 text-center text-xs text-gray-400 sm:px-6", children: "TradeFx · Trading involves risk. Only trade with capital you can afford to lose." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingTelegram, {})
  ] }) });
}
export {
  PortalHeader,
  PreviewBanner,
  PortalLayout as default
};
