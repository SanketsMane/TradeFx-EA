import { d as reactExports, j as jsxRuntimeExports, a6 as Info, ar as portalApi, au as useSearchParams, P as Plus, at as Link2, aq as Wallet, L as Link, X as Building2 } from "./index-DS595Jt3.js";
import { PreviewBanner, PortalHeader } from "./PortalLayout-CIXYd1bV.js";
import { u as useToast, D as Dialog, F as Field, b as Select, I as Input, c as Button, L as LoadingBlock, E as ErrorState, a as EmptyState, C as Card, e as StatusBadge } from "./SessionsDialog-CsVQMlkl.js";
import { u as usePortalResource } from "./portalData-C1l0nslE.js";
import { u as usePageTitle, e as demoAccounts, a as demoLicenses } from "./usePageTitle-DQZV654c.js";
const CODE_RE = /^[A-Z0-9]{9}$/;
const empty = {
  licenseCode: "",
  label: "",
  login: "",
  password: "",
  server: "",
  platform: "MT5"
};
function ConnectAccountDialog({
  open,
  onClose,
  onConnected,
  licenses,
  presetCode
}) {
  const toast = useToast();
  const [form, setForm] = reactExports.useState(empty);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) setForm({ ...empty, licenseCode: presetCode ?? "" });
  }, [open, presetCode]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const available = licenses.filter((l) => l.status === "UNASSIGNED" || l.status === "ACTIVE");
  const submit = async () => {
    setError(null);
    const code = form.licenseCode.toUpperCase().replace(/[\s-]/g, "");
    if (!CODE_RE.test(code)) {
      setError("A licence code is 9 characters — letters and numbers, no spaces.");
      return;
    }
    if (!form.label || !form.login || !form.password || !form.server) {
      setError("Fill in every field so we can reach your account.");
      return;
    }
    setLoading(true);
    try {
      await portalApi.linkAccount({ ...form, licenseCode: code });
      toast("Account connected — your Expert Advisor is starting up", "success");
      onConnected();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not connect that account.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      title: "Connect a trading account",
      description: "Link your MT4 or MT5 account to an Expert Advisor you own.",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading, onClick: submit, children: "Connect account" })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Licence code",
            htmlFor: "licenseCode",
            hint: "Nine characters, from My Expert Advisors.",
            children: available.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                id: "licenseCode",
                value: form.licenseCode,
                onChange: (e) => set("licenseCode")(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a licence…" }),
                  available.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: l.code, children: [
                    l.productName,
                    " — ",
                    l.code
                  ] }, l.id))
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "licenseCode",
                value: form.licenseCode,
                onChange: (e) => set("licenseCode")(e.target.value.toUpperCase()),
                placeholder: "K7M4XQ2R9",
                maxLength: 11,
                autoCapitalize: "characters",
                spellCheck: false,
                className: "font-mono tracking-[0.12em]"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Account name", htmlFor: "label", hint: "Just for you — e.g. “Exness Live”.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "label",
            value: form.label,
            onChange: (e) => set("label")(e.target.value),
            placeholder: "Exness Live"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Platform", htmlFor: "platform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              id: "platform",
              value: form.platform,
              onChange: (e) => set("platform")(e.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MT5", children: "MetaTrader 5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MT4", children: "MetaTrader 4" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Account number", htmlFor: "login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "login",
              value: form.login,
              onChange: (e) => set("login")(e.target.value),
              placeholder: "41288903",
              inputMode: "numeric"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Server", htmlFor: "server", hint: "Exactly as it appears in your terminal.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "server",
            value: form.server,
            onChange: (e) => set("server")(e.target.value),
            placeholder: "Exness-MT5Real8",
            spellCheck: false
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Trading password", htmlFor: "password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "password",
            type: "password",
            value: form.password,
            onChange: (e) => set("password")(e.target.value),
            autoComplete: "off"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-blue-900", children: "The Expert Advisor needs to place orders, so the investor password will not work here. Your password is encrypted before it is stored and is never shown again — not to you, and not to our staff. You can disconnect the account at any time." })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error })
      ] })
    }
  );
}
function TradingAccountsPage() {
  var _a, _b;
  usePageTitle("Trading Accounts");
  const [params] = useSearchParams();
  const [dialogOpen, setDialogOpen] = reactExports.useState(Boolean(params.get("license")));
  const accounts = usePortalResource(() => portalApi.accounts(), demoAccounts);
  const licenses = usePortalResource(() => portalApi.licenses(), demoLicenses);
  const preview = accounts.preview || licenses.preview;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    preview && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PortalHeader,
      {
        title: "Trading Accounts",
        subtitle: "The MetaTrader accounts your Expert Advisors run on.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialogOpen(true),
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Connect account"
            ]
          }
        )
      }
    ),
    accounts.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading your accounts…" }) : accounts.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: accounts.error, onRetry: accounts.reload }) : (((_a = accounts.data) == null ? void 0 : _a.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6" }),
        title: "No trading account connected",
        description: "Connect the MT4 or MT5 account you want your Expert Advisor to trade on. You will need your licence code.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialogOpen(true),
            className: "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
              " Connect account"
            ]
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: (_b = accounts.data) == null ? void 0 : _b.map((a) => {
      var _a2;
      const lic = (_a2 = licenses.data) == null ? void 0 : _a2.find((l) => {
        var _a3;
        return ((_a3 = l.linkedAccount) == null ? void 0 : _a3.id) === a.id;
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "truncate font-semibold text-gray-900", children: a.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
              a.platform,
              " · ",
              a.login
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-gray-500", children: "Server" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "truncate font-medium text-gray-900", children: a.server })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-gray-500", children: "Expert Advisor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "truncate font-medium text-gray-900", children: lic ? lic.productName : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "None yet" }) })
          ] }),
          a.marginMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-gray-500", children: "Account type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium capitalize text-gray-900", children: a.marginMode })
          ] })
        ] }),
        lic && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: `/app/bots/${lic.id}`,
            className: "mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800",
            children: "View trade statement →"
          }
        )
      ] }, a.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 shrink-0 place-content-center rounded-xl bg-brand-50 text-brand-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-gray-900", children: "Do not have a broker account yet?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-lg text-sm text-gray-600", children: "Open one through our partner and we can support your setup directly, because the account is visible on our side." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/app/broker",
          className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
          children: "Open a broker account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConnectAccountDialog,
      {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        onConnected: () => {
          accounts.reload();
          licenses.reload();
        },
        licenses: licenses.data ?? [],
        presetCode: params.get("license") ?? void 0
      }
    )
  ] });
}
export {
  TradingAccountsPage as default
};
