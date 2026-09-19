import { d as reactExports, j as jsxRuntimeExports, K as KeyRound, B as CircleCheck, a2 as CircleX, a3 as LoaderCircle, Y as ExternalLink, a4 as settingsApi, M as Mail, a5 as Send } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, C as Card, B as Badge, L as LoadingBlock, F as Field, b as Select, I as Input, c as Button, d as Switch } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
const REGIONS = ["new-york", "london", "singapore"];
function SettingsPage() {
  const toast = useToast();
  const { data: status, loading, reload } = useAsync(() => settingsApi.status(), []);
  const [token, setToken] = reactExports.useState("");
  const [region, setRegion] = reactExports.useState("new-york");
  const [testing, setTesting] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [clearing, setClearing] = reactExports.useState(false);
  const [testResult, setTestResult] = reactExports.useState(null);
  const onTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await settingsApi.test(token || void 0, region);
      setTestResult(r);
    } catch (e) {
      setTestResult({ ok: false, message: e instanceof Error ? e.message : "Test failed" });
    } finally {
      setTesting(false);
    }
  };
  const onSave = async () => {
    if (token.trim().length < 20) {
      toast("Enter a valid MetaApi token (paste the full token).", "error");
      return;
    }
    setSaving(true);
    try {
      await settingsApi.set(token.trim(), region);
      toast("MetaApi token saved — the platform will now use live MetaApi.", "success");
      setToken("");
      setTestResult(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const onClear = async () => {
    setClearing(true);
    try {
      await settingsApi.clear();
      toast("MetaApi token removed — back to mock mode.", "success");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Remove failed", "error");
    } finally {
      setClearing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", subtitle: "Connect MetaApi for live trading and configure email delivery." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 text-brand-600" }),
            " MetaApi Connection"
          ] }),
          !loading && ((status == null ? void 0 : status.configured) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "green", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
            " Connected"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "Not configured" }))
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          (status == null ? void 0 : status.configured) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-emerald-800", children: [
              "Token configured",
              status.source === "env" ? " (from environment)" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-emerald-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: status.tokenPreview }),
              " · region",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: status.region }),
              status.updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                " · updated ",
                new Date(status.updatedAt).toLocaleString()
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-5 rounded-lg border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-800", children: "No MetaApi token yet. Paste your token below to connect real MT4/MT5 accounts. Until then the platform runs in mock mode." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Region", hint: "The MetaApi region closest to your accounts.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: region, onChange: (e) => setRegion(e.target.value), children: REGIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                label: "MetaApi Token",
                hint: "One token manages all your accounts. Stored encrypted — never shown again.",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "password",
                    value: token,
                    onChange: (e) => setToken(e.target.value),
                    placeholder: (status == null ? void 0 : status.configured) ? "Paste a new token to replace" : "Paste your MetaApi token"
                  }
                )
              }
            ),
            testResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${testResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`,
                children: [
                  testResult.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: testResult.message })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: onTest, disabled: testing, children: [
                testing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null,
                "Test connection"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSave, loading: saving, children: "Save token" }),
              (status == null ? void 0 : status.configured) && status.source === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", onClick: onClear, loading: clearing, children: "Remove" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmtpCard, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-gray-800", children: "How it works" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• You create ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "one" }),
            " MetaApi token — it manages every account (masters + slaves), across any number of brokers."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Get it from your MetaApi dashboard, paste it here once." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• After saving, adding accounts provisions them live via MetaApi + CopyFactory." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://app.metaapi.cloud",
            target: "_blank",
            rel: "noreferrer",
            className: "mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800",
            children: [
              "Open MetaApi dashboard ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
function SmtpCard() {
  const toast = useToast();
  const { data: status, loading, reload } = useAsync(() => settingsApi.smtpStatus(), []);
  const [host, setHost] = reactExports.useState("");
  const [port, setPort] = reactExports.useState("587");
  const [secure, setSecure] = reactExports.useState(false);
  const [user, setUser] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fromName, setFromName] = reactExports.useState("TradeFx");
  const [alertEmail, setAlertEmail] = reactExports.useState("");
  const [alertsEnabled, setAlertsEnabled] = reactExports.useState(true);
  const [testTo, setTestTo] = reactExports.useState("");
  const [testing, setTesting] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [clearing, setClearing] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!status) return;
    if (status.host) setHost(status.host);
    if (status.port) setPort(String(status.port));
    setSecure(status.secure);
    if (status.user) setUser(status.user);
    if (status.fromName) setFromName(status.fromName);
    if (status.alertEmail) setAlertEmail(status.alertEmail);
    setAlertsEnabled(status.alertsEnabled);
    if (status.user && !testTo) setTestTo(status.user);
  }, [status]);
  const connPayload = () => ({
    host: host.trim(),
    port: Number(port) || 587,
    secure,
    user: user.trim(),
    password: password.trim() || void 0,
    fromName: fromName.trim() || void 0
  });
  const savePayload = () => ({
    ...connPayload(),
    alertEmail: alertEmail.trim() || void 0,
    alertsEnabled
  });
  const onTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const r = await settingsApi.smtpTest(connPayload());
      setResult(r);
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Test failed" });
    } finally {
      setTesting(false);
    }
  };
  const onSendTest = async () => {
    if (!testTo.trim()) {
      toast("Enter an address to send the test email to.", "error");
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const r = await settingsApi.smtpTest({ ...connPayload(), to: testTo.trim() });
      setResult(r);
      if (r.ok) toast("Test email sent.", "success");
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Send failed" });
    } finally {
      setSending(false);
    }
  };
  const onSave = async () => {
    if (!host.trim() || !user.trim()) {
      toast("Enter at least the SMTP host and sender email.", "error");
      return;
    }
    if (!(status == null ? void 0 : status.configured) && !password.trim()) {
      toast("Enter the SMTP / app password.", "error");
      return;
    }
    setSaving(true);
    try {
      await settingsApi.smtpSet(savePayload());
      toast("Email settings saved.", "success");
      setPassword("");
      setResult(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const onClear = async () => {
    setClearing(true);
    try {
      await settingsApi.smtpClear();
      toast("Email settings removed.", "success");
      setPassword("");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Remove failed", "error");
    } finally {
      setClearing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-brand-600" }),
        " Email / SMTP"
      ] }),
      !loading && (status && status.transport !== "none" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "green", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
        status.transport === "resend" ? "Resend" : "SMTP"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "Not configured" }))
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (status == null ? void 0 : status.resend.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-emerald-800", children: "Sending through Resend (from the environment)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-emerald-700", children: [
          "From ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: status.resend.from })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-emerald-700/90", children: "Resend takes priority over the SMTP settings below, which stay available as a fallback. The API key lives in the server environment, not on this screen — the sender domain has to be verified in your Resend account or mail is rejected." })
      ] }),
      (status == null ? void 0 : status.configured) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-emerald-800", children: [
          "Email configured",
          status.source === "env" ? " (from environment)" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-emerald-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
            status.host,
            ":",
            status.port
          ] }),
          " ",
          "· ",
          status.user,
          status.updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " · updated ",
            new Date(status.updatedAt).toLocaleString()
          ] })
        ] })
      ] }) : !(status == null ? void 0 : status.resend.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-5 rounded-lg border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-800", children: "No email configured. Set RESEND_API_KEY in the server environment, or add SMTP details below, to send admin invites, password-reset notices and failure alerts. For Gmail, use an app password (not your normal password)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "SMTP host", hint: "e.g. smtp.gmail.com", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: host, onChange: (e) => setHost(e.target.value), placeholder: "smtp.gmail.com" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Port", hint: "587 or 465", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: port,
              onChange: (e) => setPort(e.target.value),
              placeholder: "587"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-800", children: "SSL/TLS (secure)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: "On for port 465, off for 587 (STARTTLS)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: secure, onChange: setSecure })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sender email (SMTP user)", hint: "The account that authenticates and sends mail.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "email",
            value: user,
            onChange: (e) => setUser(e.target.value),
            placeholder: "you@gmail.com"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "App password",
            hint: (status == null ? void 0 : status.configured) ? "Stored encrypted. Leave blank to keep the current password." : "Gmail: create an app password under Google Account → Security. Stored encrypted.",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: (status == null ? void 0 : status.configured) ? "Leave blank to keep current" : "App password"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "From name", hint: "Display name shown on outgoing emails.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fromName, onChange: (e) => setFromName(e.target.value), placeholder: "TradeFx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-800", children: "Execution alerts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: "Email when a copy fails (errors only)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: alertsEnabled, onChange: setAlertsEnabled })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Alert recipient",
            hint: "Where execution-failure alerts go. Leave blank to notify all super-admins.",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "email",
                value: alertEmail,
                onChange: (e) => setAlertEmail(e.target.value),
                placeholder: "alerts@yourdomain.com"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Send test email to", hint: "Verifies the whole path by delivering a real message.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "email",
            value: testTo,
            onChange: (e) => setTestTo(e.target.value),
            placeholder: "you@example.com"
          }
        ) }),
        result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`,
            children: [
              result.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: onTest, disabled: testing, children: [
            testing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null,
            "Test connection"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: onSendTest, disabled: sending, children: [
            sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
            "Send test email"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSave, loading: saving, children: "Save settings" }),
          (status == null ? void 0 : status.configured) && status.source === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "danger", onClick: onClear, loading: clearing, children: "Remove" })
        ] })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as default
};
