import { i as useParams, l as useNavigate, z as getUser, d as reactExports, j as jsxRuntimeExports, L as Link, k as ArrowLeft, e as cn, B as CircleCheck, F as Ban, K as KeyRound, G as LogOut, T as Trash2, u as usersApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, L as LoadingBlock, E as ErrorState, e as StatusBadge, C as Card, c as Button, D as Dialog, F as Field, I as Input } from "./SessionsDialog-CsVQMlkl.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { f as formatLicenseCode } from "./portalData-C1l0nslE.js";
const when = (iso) => new Date(iso).toLocaleString(void 0, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});
function Section({ title, count, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-gray-800", children: title }),
      count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: count })
    ] }),
    children
  ] });
}
function UserDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const me = getUser();
  const isSuper = (me == null ? void 0 : me.role) === "SUPER_ADMIN";
  const { data: user, loading, error, reload } = useAsync(() => usersApi.get(id), [id]);
  const [busy, setBusy] = reactExports.useState(false);
  const [confirmStatus, setConfirmStatus] = reactExports.useState(false);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  const [confirmRevoke, setConfirmRevoke] = reactExports.useState(false);
  const [pwOpen, setPwOpen] = reactExports.useState(false);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [actionError, setActionError] = reactExports.useState(null);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, { label: "Loading user…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: reload });
  if (!user) return null;
  const isSelf = (me == null ? void 0 : me.id) === user.id;
  const disabled = user.status === "DISABLED";
  const canAct = isSuper && !isSelf;
  const run = async (fn, ok, done) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
      toast(ok, "success");
      done ? done() : reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Action failed";
      setActionError(msg);
      toast(msg, "error");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/dashboard/users",
        className: "mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " All users"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: user.fullName ?? user.email,
        subtitle: `${user.role === "CUSTOMER" ? "Customer" : user.role === "ADMIN" ? "Admin" : "Super Admin"} · joined ${when(user.createdAt)}`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
              disabled ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-2 w-2 rounded-full", disabled ? "bg-red-500" : "bg-emerald-500") }),
              disabled ? "Disabled" : "Active"
            ]
          }
        )
      }
    ),
    actionError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: actionError }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-[1.6fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "divide-y divide-gray-100", children: [
          ["Email", user.email],
          ["Full name", user.fullName ?? "—"],
          ["Mobile", user.phone ? `+91 ${user.phone}` : "—"],
          ["User ID", user.id]
        ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "w-32 shrink-0 text-sm text-gray-500", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "break-all text-sm font-medium text-gray-900", children: v })
        ] }, k)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Expert Advisor licences", count: user.licenses.length, children: user.licenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-6 text-sm text-gray-500", children: "No licences issued to this user." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: user.licenses.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-gray-900", children: l.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-gray-500", children: formatLicenseCode(l.code) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: l.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-gray-500", children: l.linkedAccount ? `${l.linkedAccount.label} (${l.linkedAccount.login})` : "Not connected" })
        ] }, l.id)) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Trading accounts", count: user.ownedAccounts.length, children: user.ownedAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-6 text-sm text-gray-500", children: "No trading accounts connected." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: user.ownedAccounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-gray-900", children: a.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500", children: [
              a.platform,
              " · ",
              a.login,
              " · ",
              a.server
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: `/dashboard/accounts/${a.id}`,
              className: "text-xs font-semibold text-brand-700 hover:underline",
              children: "Open"
            }
          ) })
        ] }, a.id)) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Quotation requests", count: user.quoteRequests.length, children: user.quoteRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-6 text-sm text-gray-500", children: "No quotation requests." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-100", children: user.quoteRequests.map((qr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-mono text-xs text-gray-700", children: qr.reference }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-gray-900", children: qr.productSlug ?? qr.serviceSlug ?? "General" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: qr.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-gray-500", children: when(qr.createdAt) })
        ] }, qr.id)) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-gray-800", children: "Actions" }),
          !isSuper && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-600", children: "Only a super admin can act on an account." }),
          isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800", children: "This is your own account. Ask another super admin to act on it." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: disabled ? "primary" : "danger",
                className: "w-full justify-start",
                disabled: !canAct || busy,
                onClick: () => setConfirmStatus(true),
                children: [
                  disabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
                  disabled ? "Re-enable account" : "Disable account"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "secondary",
                className: "w-full justify-start",
                disabled: !canAct || busy,
                onClick: () => {
                  setNewPassword("");
                  setPwOpen(true);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }),
                  " Set a new password"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "secondary",
                className: "w-full justify-start",
                disabled: !canAct || busy,
                onClick: () => setConfirmRevoke(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
                  " Sign out everywhere",
                  user.sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-gray-400", children: [
                    user.sessions.length,
                    " active"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "danger",
                className: "w-full justify-start",
                disabled: !canAct || busy,
                onClick: () => setConfirmDelete(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                  " Delete permanently"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs leading-relaxed text-gray-500", children: "Disabling stops sign-in, ends every session and pauses this customer's running Expert Advisors. Re-enabling restores sign-in only — restarting a bot is a separate, deliberate step." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Active sessions", count: user.sessions.length, children: user.sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 py-5 text-sm text-gray-500", children: "Not signed in anywhere." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-gray-100", children: user.sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-gray-700", children: s.userAgent ?? "Unknown device" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
            s.ip ?? "no IP",
            " · last used ",
            when(s.lastUsedAt)
          ] })
        ] }, s.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: confirmStatus,
        onClose: () => setConfirmStatus(false),
        loading: busy,
        danger: !disabled,
        confirmLabel: disabled ? "Re-enable" : "Disable account",
        title: disabled ? "Re-enable this account?" : "Disable this account?",
        message: disabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.email }),
          " will be able to sign in again. Their Expert Advisors stay paused until you resume them."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.email }),
          " will be signed out everywhere and blocked from signing in.",
          user.ownedAccounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "Their ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.ownedAccounts.length }),
            " connected trading account",
            user.ownedAccounts.length === 1 ? "" : "s",
            " will stop taking new trades."
          ] })
        ] }),
        onConfirm: () => run(
          () => usersApi.setStatus(user.id, disabled ? "ACTIVE" : "DISABLED", reason || void 0),
          disabled ? "Account re-enabled" : "Account disabled",
          () => {
            setConfirmStatus(false);
            setReason("");
            reload();
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: confirmRevoke,
        onClose: () => setConfirmRevoke(false),
        loading: busy,
        confirmLabel: "Sign out everywhere",
        title: "Sign this user out?",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Ends all ",
          user.sessions.length,
          " active session",
          user.sessions.length === 1 ? "" : "s",
          " for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.email }),
          ". Their password is unchanged and they can sign back in."
        ] }),
        onConfirm: () => run(() => usersApi.revokeSessions(user.id), "Sessions revoked", () => {
          setConfirmRevoke(false);
          reload();
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: confirmDelete,
        onClose: () => setConfirmDelete(false),
        loading: busy,
        danger: true,
        confirmLabel: "Delete permanently",
        title: "Delete this account?",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "This permanently removes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.email }),
          " along with their licences and quotation history. It cannot be undone.",
          user.ownedAccounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "They still have ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.ownedAccounts.length }),
            " connected trading account",
            user.ownedAccounts.length === 1 ? "" : "s",
            " — disconnect those first, or the delete will be refused."
          ] })
        ] }),
        onConfirm: () => run(() => usersApi.remove(user.id), "Account deleted", () => {
          setConfirmDelete(false);
          navigate("/dashboard/users");
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dialog,
      {
        open: pwOpen,
        onClose: () => setPwOpen(false),
        title: "Set a new password",
        description: "The user is signed out everywhere and emailed the new password.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setPwOpen(false), disabled: busy, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              loading: busy,
              disabled: newPassword.length < 8,
              onClick: () => run(() => usersApi.resetPassword(user.id, newPassword), "Password updated", () => {
                setPwOpen(false);
                setNewPassword("");
                reload();
              }),
              children: "Set password"
            }
          )
        ] }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "New password", htmlFor: "new-pw", hint: "At least 8 characters.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "new-pw",
              type: "text",
              value: newPassword,
              onChange: (e) => setNewPassword(e.target.value),
              autoComplete: "off",
              placeholder: "Enter a strong password"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800", children: "This password is sent to the user by email in plain text. Tell them to change it after signing in." })
        ]
      }
    )
  ] });
}
export {
  UserDetailPage as default
};
