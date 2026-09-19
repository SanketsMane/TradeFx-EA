import { j as jsxRuntimeExports, a6 as Info, a7 as Wifi, a8 as WifiOff, a2 as CircleX, d as reactExports, a9 as notificationsApi, aa as Bell, e as cn, z as getUser, ab as X, ac as LayoutDashboard, ad as SlidersHorizontal, U as Users, I as FileText, K as KeyRound, X as Building2, n as Copy, A as Activity, x as History, y as ChartColumn, $ as ShieldCheck, a0 as ScrollText, ae as Settings, af as NavLink, ag as Menu, ah as PanelLeftOpen, ai as PanelLeftClose, aj as Outlet, l as useNavigate, ak as logoutServer, al as logout, C as ChevronDown, am as MonitorSmartphone, G as LogOut } from "./index-DS595Jt3.js";
import { T as ToastProvider, A as Avatar, f as ChangePasswordDialog, g as SessionsDialog } from "./SessionsDialog-CsVQMlkl.js";
function iconFor(type) {
  switch (type) {
    case "COPY_FAILED":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" });
    case "ACCOUNT_OFFLINE":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-4 w-4 text-amber-500" });
    case "ACCOUNT_ONLINE":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4 text-emerald-500" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-gray-400" });
  }
}
function NotificationBell() {
  const [open, setOpen] = reactExports.useState(false);
  const [items, setItems] = reactExports.useState([]);
  const [unread, setUnread] = reactExports.useState(0);
  const ref = reactExports.useRef(null);
  const loadCount = () => notificationsApi.unreadCount().then((r) => setUnread(r.count)).catch(() => void 0);
  reactExports.useEffect(() => {
    loadCount();
    const t = setInterval(loadCount, 3e4);
    return () => clearInterval(t);
  }, []);
  reactExports.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      const list = await notificationsApi.list().catch(() => []);
      setItems(list);
      if (unread > 0) {
        await notificationsApi.markAllRead().catch(() => void 0);
        setUnread(0);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: toggle,
        className: "relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
          unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white", children: unread > 9 ? "9+" : unread })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800", children: "Notifications" }),
      items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 text-center text-sm text-gray-400", children: "No notifications yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto", children: items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn("border-b border-gray-50 px-4 py-3", !n.readAt && "bg-brand-50/40"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 shrink-0", children: iconFor(n.type) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-900", children: n.title }),
              n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-gray-500", children: n.body }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] text-gray-400", children: new Date(n.createdAt).toLocaleString() })
            ] })
          ] })
        },
        n.id
      )) })
    ] })
  ] });
}
function PageHeader({
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs leading-tight text-gray-400", children: (user == null ? void 0 : user.role) === "SUPER_ADMIN" ? "Super Admin" : "Admin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-100 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium text-gray-800", children: user == null ? void 0 : user.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand-700", children: user == null ? void 0 : user.role })
      ] }),
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
function DashboardLayout() {
  const user = getUser();
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [collapsed, setCollapsed] = reactExports.useState(
    () => localStorage.getItem("sidebar_collapsed") === "1"
  );
  const toggleCollapsed = () => setCollapsed((v) => {
    localStorage.setItem("sidebar_collapsed", v ? "0" : "1");
    return !v;
  });
  const groups = [
    {
      label: "General",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/dashboard/accounts", label: "Accounts", icon: SlidersHorizontal }
      ]
    },
    {
      label: "Customers",
      items: [
        { to: "/dashboard/users", label: "Users", icon: Users },
        { to: "/dashboard/quotes", label: "Quotations", icon: FileText },
        { to: "/dashboard/licenses", label: "Licences", icon: KeyRound },
        { to: "/dashboard/brokers", label: "Partner Brokers", icon: Building2 }
      ]
    },
    {
      label: "Expert Advisors",
      items: [
        { to: "/dashboard/copiers", label: "EA Masters", icon: Copy },
        { to: "/dashboard/monitor", label: "Live Monitor", icon: Activity },
        { to: "/dashboard/history", label: "Trade History", icon: History },
        { to: "/dashboard/reports", label: "Reports", icon: ChartColumn }
      ]
    },
    ...(user == null ? void 0 : user.role) === "SUPER_ADMIN" ? [
      {
        label: "Administration",
        items: [
          { to: "/dashboard/admins", label: "Admins", icon: ShieldCheck },
          { to: "/dashboard/audit", label: "Audit Log", icon: ScrollText },
          { to: "/dashboard/settings", label: "Settings", icon: Settings }
        ]
      }
    ] : []
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-[transform,width] md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex h-16 items-center border-b border-gray-100",
                collapsed ? "justify-between px-5 md:justify-center md:px-2" : "justify-between px-5"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/logo.png",
                      alt: "TradeFx",
                      className: cn("hidden h-8 w-8 shrink-0 object-contain", collapsed && "md:block")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/logo-dark.webp",
                      alt: "TradeFx",
                      className: cn("h-7 w-auto shrink-0 object-contain", collapsed && "md:hidden")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "text-gray-400 md:hidden",
                    onClick: () => setMobileOpen(false),
                    "aria-label": "Close menu",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-6 overflow-y-auto px-3 py-5", children: groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400",
                  collapsed && "md:hidden"
                ),
                children: group.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: group.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              NavLink,
              {
                to: item.to,
                end: item.end,
                title: collapsed ? item.label : void 0,
                onClick: () => setMobileOpen(false),
                className: ({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "md:justify-center md:px-2",
                  isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-[18px] w-[18px] shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(collapsed && "md:hidden"), children: item.label })
                ]
              },
              item.to
            )) })
          ] }, group.label)) })
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex min-h-screen flex-col transition-[padding]",
          collapsed ? "md:pl-16" : "md:pl-64"
        ),
        children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: toggleCollapsed,
                className: "hidden text-gray-500 hover:text-gray-800 md:inline-flex",
                "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
                title: collapsed ? "Expand sidebar" : "Collapse sidebar",
                children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftOpen, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-dark.webp", alt: "TradeFx", className: "h-6 w-auto object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {})
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-gray-100 px-4 py-4 text-center text-xs text-gray-400 sm:px-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "TradeFx · v",
              "1.1.14"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Developed by ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-500", children: "Sanket Patil" }),
              " · 9270507170"
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
export {
  PageHeader,
  DashboardLayout as default
};
