import { b as accountsApi, d as reactExports, c as copierApi, j as jsxRuntimeExports, i as useParams, L as Link, k as ArrowLeft, o as ShieldAlert, P as Plus, p as TriangleAlert, U as Users, h as Pencil, T as Trash2 } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { u as useToast, D as Dialog, F as Field, b as Select, I as Input, c as Button, d as Switch, L as LoadingBlock, E as ErrorState, e as StatusBadge, B as Badge, C as Card, a as EmptyState } from "./SessionsDialog-CsVQMlkl.js";
import { u as useAsync } from "./useAsync-DpdfLE3J.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cv3tX9aX.js";
const defaults = {
  receiverAccountId: "",
  sizingMode: "MULTIPLIER",
  multiplier: "1",
  copySl: true,
  copyTp: true,
  reverse: false,
  mapping: "",
  filterMode: "NONE",
  filterList: "",
  minVolume: "",
  maxVolume: "",
  windowEnabled: false,
  windowStart: "00:00",
  windowEnd: "23:59"
};
const minToHHMM = (m) => {
  if (m == null) return "";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
const hhmmToMin = (s) => {
  const [h, m] = s.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
};
function formatMapping(mapping) {
  return (mapping ?? []).map((m) => `${m.from}=${m.to}`).join(", ");
}
function parseMapping(text) {
  return text.split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
    const [from, to] = p.split("=").map((s) => s.trim());
    return from && to ? { from, to } : null;
  }).filter((m) => m !== null);
}
const multiplierLabel = {
  FIXED_LOT: "Fixed lot size",
  MULTIPLIER: "Lot multiplier (×)",
  BALANCE_RATIO: "Multiplier (ignored for balance ratio)"
};
function ReceiverFormDialog({
  open,
  onClose,
  config,
  subscription,
  onSaved
}) {
  const toast = useToast();
  const isEdit = !!subscription;
  const { data: accounts } = useAsync(() => accountsApi.list(), [open]);
  const [form, setForm] = reactExports.useState(defaults);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!open) return;
    setError(null);
    if (subscription) {
      const hasWindow = subscription.tradeWindowStart != null && subscription.tradeWindowEnd != null;
      setForm({
        receiverAccountId: subscription.receiverAccountId,
        sizingMode: subscription.sizingMode,
        multiplier: String(subscription.multiplier),
        copySl: subscription.copySl,
        copyTp: subscription.copyTp,
        reverse: subscription.reverse,
        mapping: formatMapping(subscription.symbolMapping),
        filterMode: subscription.symbolFilterMode,
        filterList: (subscription.symbolFilterList ?? []).join(", "),
        minVolume: subscription.minVolume != null ? String(subscription.minVolume) : "",
        maxVolume: subscription.maxVolume != null ? String(subscription.maxVolume) : "",
        windowEnabled: hasWindow,
        windowStart: hasWindow ? minToHHMM(subscription.tradeWindowStart) : "00:00",
        windowEnd: hasWindow ? minToHHMM(subscription.tradeWindowEnd) : "23:59"
      });
    } else {
      setForm(defaults);
    }
  }, [open, subscription]);
  const usedIds = new Set(config.subscriptions.map((s) => s.receiverAccountId));
  const available = (accounts ?? []).filter(
    (a) => a.id !== config.sourceAccountId && !usedIds.has(a.id)
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async () => {
    setError(null);
    const multiplier = Number(form.multiplier);
    if (!Number.isFinite(multiplier) || multiplier <= 0)
      return setError("Multiplier must be a positive number.");
    const minVolume = form.minVolume.trim() ? Number(form.minVolume) : void 0;
    const maxVolume = form.maxVolume.trim() ? Number(form.maxVolume) : void 0;
    if (minVolume != null && (!Number.isFinite(minVolume) || minVolume <= 0))
      return setError("Min volume must be a positive number.");
    if (maxVolume != null && (!Number.isFinite(maxVolume) || maxVolume <= 0))
      return setError("Max volume must be a positive number.");
    if (minVolume != null && maxVolume != null && minVolume > maxVolume)
      return setError("Min volume cannot exceed max volume.");
    let tradeWindowStart;
    let tradeWindowEnd;
    if (form.windowEnabled) {
      const s = hhmmToMin(form.windowStart);
      const e = hhmmToMin(form.windowEnd);
      if (s == null || e == null) return setError("Enter a valid trading window (HH:MM).");
      if (s === e) return setError("Trading window start and end cannot be the same.");
      tradeWindowStart = s;
      tradeWindowEnd = e;
    }
    const filterSymbols = form.filterList.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const rules = {
      sizingMode: form.sizingMode,
      multiplier,
      copySl: form.copySl,
      copyTp: form.copyTp,
      reverse: form.reverse,
      symbolMapping: parseMapping(form.mapping),
      symbolFilterMode: form.filterMode,
      symbolFilterList: form.filterMode === "NONE" ? [] : filterSymbols,
      // On edit, an empty field clears the value (null); on add, omit it.
      minVolume: minVolume ?? (isEdit ? null : void 0),
      maxVolume: maxVolume ?? (isEdit ? null : void 0),
      ...form.windowEnabled ? { tradeWindowStart, tradeWindowEnd } : isEdit ? { tradeWindowStart: null, tradeWindowEnd: null } : {}
    };
    setLoading(true);
    try {
      if (isEdit && subscription) {
        await copierApi.updateReceiver(subscription.id, rules);
        toast("Receiver updated", "success");
      } else {
        if (!form.receiverAccountId) throw new Error("Select a receiver account.");
        await copierApi.addReceiver(config.id, form.receiverAccountId, rules);
        toast("Receiver added", "success");
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save receiver");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onClose,
      size: "lg",
      title: isEdit ? "Edit Receiver" : "Add Receiver",
      description: isEdit ? "Update copy rules for this receiver." : "Add an account that copies this source.",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { loading, onClick: submit, children: isEdit ? "Save Changes" : "Add Receiver" })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        !isEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Receiver account", children: available.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-700", children: "No available accounts to add as a receiver." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.receiverAccountId,
            onChange: (e) => set("receiverAccountId", e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select an account…" }),
              available.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: a.id, children: [
                a.label,
                " · ",
                a.platform,
                " · ",
                a.login
              ] }, a.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-gray-100 bg-gray-50/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-sm font-semibold text-gray-700", children: "Copy Rules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sizing mode", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.sizingMode, onChange: (e) => set("sizingMode", e.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MULTIPLIER", children: "Multiplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "FIXED_LOT", children: "Fixed lot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BALANCE_RATIO", children: "Balance ratio" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: multiplierLabel[form.sizingMode], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: form.multiplier,
                onChange: (e) => set("multiplier", e.target.value),
                disabled: form.sizingMode === "BALANCE_RATIO"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Copy Stop Loss", checked: form.copySl, onChange: (v) => set("copySl", v) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Copy Take Profit", checked: form.copyTp, onChange: (v) => set("copyTp", v) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Reverse copy (mirror opposite direction)", checked: form.reverse, onChange: (v) => set("reverse", v) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Symbol mapping", hint: "Comma-separated, e.g. EURUSD=EURUSD.r, GBPUSD=GBPUSD.r", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.mapping, onChange: (e) => set("mapping", e.target.value), placeholder: "EURUSD=EURUSD.r" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-gray-100 bg-gray-50/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-sm font-semibold text-gray-700", children: "Trade Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Symbol filter", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.filterMode,
                onChange: (e) => set("filterMode", e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "NONE", children: "Copy all symbols" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INCLUDE", children: "Whitelist (only these)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EXCLUDE", children: "Blacklist (all except)" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                label: "Symbols",
                hint: form.filterMode === "NONE" ? "Disabled while copying all" : "Comma-separated, e.g. XAUUSD, EURUSD",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.filterList,
                    onChange: (e) => set("filterList", e.target.value),
                    placeholder: "XAUUSD, EURUSD",
                    disabled: form.filterMode === "NONE"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Min volume (lots)", hint: "Skip smaller trades. Blank = no minimum.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: form.minVolume,
                onChange: (e) => set("minVolume", e.target.value),
                placeholder: "e.g. 0.01"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Max volume (lots)", hint: "Cap copied lot size. Blank = no cap.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: form.maxVolume,
                onChange: (e) => set("maxVolume", e.target.value),
                placeholder: "e.g. 1.00"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-gray-100 bg-gray-50/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToggleRow,
            {
              label: "Trading-hours window (UTC)",
              checked: form.windowEnabled,
              onChange: (v) => set("windowEnabled", v)
            }
          ),
          form.windowEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Open (UTC)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: form.windowStart, onChange: (e) => set("windowStart", e.target.value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Close (UTC)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: form.windowEnd, onChange: (e) => set("windowEnd", e.target.value) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-gray-500", children: "New copied trades open only inside this window. Overnight windows (e.g. 22:00→06:00) are supported. Existing trades are not force-closed." })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error })
      ] })
    }
  );
}
function ToggleRow({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked, onChange })
  ] });
}
const MAX_RECEIVERS = 10;
function sizingText(s) {
  if (s.sizingMode === "FIXED_LOT") return `${s.multiplier} lots (fixed)`;
  if (s.sizingMode === "MULTIPLIER") return `× ${s.multiplier}`;
  return "balance ratio";
}
const pad = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
function CopierDetailPage() {
  const { id = "" } = useParams();
  const toast = useToast();
  const { data: config, loading, error, reload } = useAsync(() => copierApi.get(id), [id]);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editSub, setEditSub] = reactExports.useState(null);
  const [toDelete, setToDelete] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [closeAllOpen, setCloseAllOpen] = reactExports.useState(false);
  const [closing, setClosing] = reactExports.useState(false);
  const receivers = (config == null ? void 0 : config.subscriptions) ?? [];
  const srcMode = (config == null ? void 0 : config.sourceAccount.marginMode) ?? null;
  const mismatched = receivers.filter(
    (s) => s.receiverAccount.marginMode && srcMode && s.receiverAccount.marginMode !== srcMode
  );
  const toggleEnabled = async () => {
    if (!config) return;
    try {
      await copierApi.update(config.id, { enabled: !config.enabled });
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    }
  };
  const toggleReceiver = async (s) => {
    try {
      if (s.enabled) await copierApi.pauseReceiver(s.id);
      else await copierApi.resumeReceiver(s.id);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    }
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await copierApi.removeReceiver(toDelete.id);
      toast("Receiver removed", "success");
      setToDelete(null);
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };
  const confirmCloseAll = async () => {
    if (!config) return;
    setClosing(true);
    try {
      const res = await copierApi.closeAll(config.id);
      toast(`Close-all sent to ${res.closed} account(s)`, "success");
      setCloseAllOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Close-all failed", "error");
    } finally {
      setClosing(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {});
  if (error || !config) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error ?? "EA master not found", onRetry: reload });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/dashboard/copiers",
        className: "mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Back to copiers"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: config.name,
        subtitle: `Source: ${config.sourceAccount.label} · ${config.sourceAccount.platform} · ${config.sourceAccount.login}`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: config.enabled, onChange: toggleEnabled }),
            config.enabled ? "Enabled" : "Disabled"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "danger", onClick: () => setCloseAllOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4" }),
            " Close All"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), disabled: receivers.length >= MAX_RECEIVERS, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Receiver"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: config.sourceAccount.status }),
      config.sourceAccount.marginMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "gray", children: [
        "source: ",
        config.sourceAccount.marginMode
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "gray", children: [
        receivers.length,
        "/",
        MAX_RECEIVERS,
        " receivers"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
        "Strategy ",
        config.copyfactoryStrategyId
      ] })
    ] }),
    mismatched.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Margin-mode mismatch." }),
        " The source is",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: srcMode }),
        ", but",
        " ",
        mismatched.map((s) => s.receiverAccount.label).join(", "),
        " ",
        mismatched.length === 1 ? "is" : "are",
        " on a different mode. Copies may not reproduce faithfully — a hedging source’s opposite trades net out on a netting receiver. For reliable copying, keep source and receivers on the same mode (ideally both hedging)."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 p-4 text-sm font-semibold text-gray-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-brand-600" }),
        " Receivers"
      ] }),
      receivers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10" }),
          title: "No receivers",
          description: "Add a client account to start mirroring this master's trades.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Receiver"
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Sizing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Rules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Enabled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: receivers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: s.receiverAccount.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-gray-500", children: [
            s.receiverAccount.platform,
            " · ",
            s.receiverAccount.login
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-700", children: sizingText(s) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
            s.copySl && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "gray", children: "SL" }),
            s.copyTp && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "gray", children: "TP" }),
            s.reverse && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "Reverse" }),
            s.symbolFilterMode === "INCLUDE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "blue", children: [
              "only ",
              s.symbolFilterList.join("/")
            ] }),
            s.symbolFilterMode === "EXCLUDE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "blue", children: [
              "excl ",
              s.symbolFilterList.join("/")
            ] }),
            s.minVolume != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "gray", children: [
              "min ",
              s.minVolume
            ] }),
            s.maxVolume != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "gray", children: [
              "max ",
              s.maxVolume
            ] }),
            s.tradeWindowStart != null && s.tradeWindowEnd != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "gray", children: [
              pad(s.tradeWindowStart),
              "–",
              pad(s.tradeWindowEnd),
              " UTC"
            ] }),
            s.receiverAccount.marginMode && srcMode && s.receiverAccount.marginMode !== srcMode && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: s.receiverAccount.marginMode })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: s.enabled, onChange: () => toggleReceiver(s) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setEditSub(s),
                className: "rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700",
                title: "Edit",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setToDelete(s),
                className: "rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600",
                title: "Remove",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, s.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiverFormDialog, { open: addOpen, onClose: () => setAddOpen(false), config, onSaved: reload }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceiverFormDialog,
      {
        open: !!editSub,
        onClose: () => setEditSub(null),
        config,
        subscription: editSub,
        onSaved: reload
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!toDelete,
        onClose: () => setToDelete(null),
        onConfirm: confirmDelete,
        loading: deleting,
        danger: true,
        title: "Remove receiver?",
        confirmLabel: "Remove",
        message: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Stop ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: toDelete == null ? void 0 : toDelete.receiverAccount.label }),
          " from copying this source."
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: closeAllOpen,
        onClose: () => setCloseAllOpen(false),
        onConfirm: confirmCloseAll,
        loading: closing,
        danger: true,
        title: "Close all open positions?",
        confirmLabel: "Close All",
        message: "This sends an emergency close to the source and every receiver in this copier. This cannot be undone."
      }
    )
  ] });
}
export {
  CopierDetailPage as default
};
