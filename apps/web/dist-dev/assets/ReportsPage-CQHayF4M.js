import { d as reactExports, j as jsxRuntimeExports, b as accountsApi, D as Download, y as ChartColumn, r as reportsApi } from "./index-DS595Jt3.js";
import { PageHeader } from "./DashboardLayout-D6YtQJLu.js";
import { c as Button, C as Card, F as Field, b as Select, I as Input, L as LoadingBlock, E as ErrorState, S as StatCard, a as EmptyState } from "./SessionsDialog-CsVQMlkl.js";
import { n as num } from "./format-D2xU1sb4.js";
const W = 720;
const PADX = 10;
function EquityCurve({ points, height = 220 }) {
  const H = height;
  const padT = 14;
  const padB = 22;
  const geo = reactExports.useMemo(() => {
    if (points.length === 0) return null;
    const vals = points.map((p) => num(p.value));
    let min = Math.min(0, ...vals);
    let max = Math.max(0, ...vals);
    if (min === max) max = min + 1;
    const innerH = H - padT - padB;
    const n = points.length;
    const x = (i) => PADX + (n === 1 ? (W - 2 * PADX) / 2 : i / (n - 1) * (W - 2 * PADX));
    const y = (v) => padT + (max - v) / (max - min) * innerH;
    const coords = points.map((p, i) => ({ x: x(i), y: y(num(p.value)) }));
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    const zeroY = y(0);
    const area = `${line} L ${coords[n - 1].x.toFixed(1)} ${zeroY.toFixed(1)} L ${coords[0].x.toFixed(1)} ${zeroY.toFixed(1)} Z`;
    const up = num(points[n - 1].value) >= 0;
    return { line, area, zeroY, coords, min, max, up };
  }, [points, H]);
  if (!geo) return null;
  const stroke = geo.up ? "#059669" : "#dc2626";
  const fill = geo.up ? "#059669" : "#dc2626";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full overflow-x-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, preserveAspectRatio: "none", role: "img", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "eqfill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: fill, stopOpacity: "0.18" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: fill, stopOpacity: "0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: PADX, y1: geo.zeroY, x2: W - PADX, y2: geo.zeroY, stroke: "#e5e7eb", strokeWidth: "1", strokeDasharray: "4 4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geo.area, fill: "url(#eqfill)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geo.line, fill: "none", stroke, strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round" }),
      geo.coords.length <= 30 && geo.coords.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: c.x, cy: c.y, r: "2.5", fill: stroke }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between px-1 text-[11px] text-gray-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: points[0].label }),
      points.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: points[points.length - 1].label })
    ] })
  ] });
}
function PnlBars({ points, height = 160 }) {
  const H = height;
  const padT = 10;
  const padB = 10;
  const geo = reactExports.useMemo(() => {
    if (points.length === 0) return null;
    const vals = points.map((p) => num(p.value));
    const max = Math.max(1e-9, ...vals.map((v) => Math.abs(v)));
    const innerH = H - padT - padB;
    const zeroY = padT + innerH / 2;
    const n = points.length;
    const slot = (W - 2 * PADX) / n;
    const bw = Math.min(28, slot * 0.6);
    const bars = points.map((p, i) => {
      const v = num(p.value);
      const h = Math.abs(v) / max * (innerH / 2);
      const cx = PADX + slot * i + slot / 2;
      return { x: cx - bw / 2, y: v >= 0 ? zeroY - h : zeroY, w: bw, h: Math.max(1, h), up: v >= 0 };
    });
    return { bars, zeroY };
  }, [points, H]);
  if (!geo) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, preserveAspectRatio: "none", role: "img", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: PADX, y1: geo.zeroY, x2: W - PADX, y2: geo.zeroY, stroke: "#e5e7eb", strokeWidth: "1" }),
    geo.bars.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: b.x, y: b.y, width: b.w, height: b.h, rx: "2", fill: b.up ? "#10b981" : "#ef4444" }, i))
  ] }) });
}
const money = (v) => {
  if (v == null) return "—";
  const n = Number(v);
  return `${n >= 0 ? "" : "-"}$${Math.abs(n).toFixed(2)}`;
};
const pct = (v) => `${(v * 100).toFixed(1)}%`;
const signClass = (v) => v == null ? "text-gray-400" : Number(v) >= 0 ? "text-emerald-600" : "text-red-600";
const isAccountReport = (r) => "account" in r;
function ReportsPage() {
  const [accounts, setAccounts] = reactExports.useState([]);
  const [accountId, setAccountId] = reactExports.useState("");
  const [bucket, setBucket] = reactExports.useState("day");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [report, setReport] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    accountsApi.list().then(setAccounts).catch(() => void 0);
  }, []);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = {
        bucket,
        from: from ? new Date(from).toISOString() : void 0,
        // Include the whole end day, not just its midnight boundary.
        to: to ? (/* @__PURE__ */ new Date(`${to}T23:59:59.999Z`)).toISOString() : void 0
      };
      setReport(accountId ? await reportsApi.account(accountId, q) : await reportsApi.overview(q));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const exportCsv = () => {
    if (!report || !report.summary) return;
    const esc = (c) => `"${String(c ?? "").replace(/"/g, '""')}"`;
    const line = (cells) => cells.map(esc).join(",");
    const sum = report.summary;
    const blocks = [];
    blocks.push("SUMMARY");
    blocks.push(line(["metric", "value"]));
    [
      ["Realized P/L", sum.realizedPnl],
      ["Win rate", `${(sum.winRate * 100).toFixed(1)}%`],
      ["Trades (closed)", sum.closed],
      ["Wins", sum.wins],
      ["Losses", sum.losses],
      ["Max drawdown", sum.maxDrawdown],
      ["Profit factor", sum.profitFactor ?? ""],
      ["Gross profit", sum.grossProfit],
      ["Gross loss", sum.grossLoss],
      ["Avg trade", sum.avgPnl],
      ["Best trade", sum.bestTrade ?? ""],
      ["Worst trade", sum.worstTrade ?? ""],
      ["Volume (lots)", sum.volumeLots],
      ["Opened", sum.opened],
      ["Avg latency (ms)", sum.avgLatencyMs ?? ""],
      ["Failed", sum.failed],
      ["Filtered", sum.filtered]
    ].forEach(([k, v]) => blocks.push(line([k, v])));
    blocks.push("");
    blocks.push("BY PERIOD");
    blocks.push(line(["period", "start", "trades", "wins", "losses", "winRate", "pnl", "cumulativePnl"]));
    report.periods.forEach(
      (p) => blocks.push(line([p.period, p.start, p.trades, p.wins, p.losses, p.winRate.toFixed(4), p.pnl, p.cumulativePnl]))
    );
    if (report.symbols.length) {
      blocks.push("");
      blocks.push("BY SYMBOL");
      blocks.push(line(["symbol", "trades", "winRate", "volumeLots", "pnl"]));
      report.symbols.forEach((s2) => blocks.push(line([s2.symbol, s2.trades, s2.winRate.toFixed(4), s2.volumeLots, s2.pnl])));
    }
    if (!isAccountReport(report) && report.accounts.length) {
      blocks.push("");
      blocks.push("BY ACCOUNT");
      blocks.push(line(["account", "trades", "winRate", "realizedPnl", "maxDrawdown"]));
      report.accounts.forEach(
        (a2) => blocks.push(line([a2.label, a2.trades, a2.winRate.toFixed(4), a2.realizedPnl, a2.maxDrawdown]))
      );
    }
    const url = URL.createObjectURL(new Blob([blocks.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    const who = isAccountReport(report) ? report.account.label.replace(/\s+/g, "-") : "portfolio";
    a.download = `report-${who}-${bucket}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const s = report == null ? void 0 : report.summary;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Reports",
        subtitle: "Realized P/L, win rate, drawdown and per-period performance.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: exportCsv, disabled: !report || !report.summary, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Export CSV"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Account", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: accountId, onChange: (e) => setAccountId(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All accounts (portfolio)" }),
        accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.label }, a.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Period", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: bucket, onChange: (e) => setBucket(e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "day", children: "Daily" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "week", children: "Weekly" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "month", children: "Monthly" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "From", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "To", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: load, className: "w-full", children: "Apply" }) })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBlock, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: load }) : !report || !s ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Realized P/L",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: signClass(s.realizedPnl), children: money(s.realizedPnl) }),
            sub: `${s.trades} closed trade${s.trades === 1 ? "" : "s"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Win Rate",
            value: pct(s.winRate),
            sub: `${s.wins}W / ${s.losses}L${s.breakEven ? ` / ${s.breakEven}BE` : ""}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Max Drawdown",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: money(s.maxDrawdown) }),
            sub: "peak-to-trough, realized"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Profit Factor",
            value: s.profitFactor == null ? "—" : s.profitFactor.toFixed(2),
            sub: `${money(s.grossProfit)} gross / ${money(s.grossLoss)}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Unrealized P/L",
            value: isAccountReport(report) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: signClass(report.unrealizedPnl), children: money(report.unrealizedPnl) }) : "—",
            sub: !isAccountReport(report) ? "select a single account" : report.snapshotAt ? `snapshot ${new Date(report.snapshotAt).toLocaleString()}` : "no snapshot recorded yet"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Avg Trade", value: money(s.avgPnl), sub: `best ${money(s.bestTrade)} / worst ${money(s.worstTrade)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Volume", value: `${s.volumeLots} lots`, sub: `${s.opened} opened / ${s.closed} closed` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Avg Latency",
            value: s.avgLatencyMs == null ? "—" : `${s.avgLatencyMs}ms`,
            sub: `${s.failed} failed / ${s.filtered} filtered`
          }
        )
      ] }),
      isAccountReport(report) && report.asSource && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6 p-4 text-sm text-gray-600", children: [
        "This account is a ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900", children: "copier source" }),
        ". It originated ",
        report.asSource.events,
        " copy event",
        report.asSource.events === 1 ? "" : "s",
        " to ",
        report.asSource.receivers,
        " receiver",
        report.asSource.receivers === 1 ? "" : "s",
        ", whose combined result was",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: signClass(report.asSource.aggregateReceiverPnl), children: money(report.asSource.aggregateReceiverPnl) }),
        ". That figure belongs to the receivers — the stats above are this account's own results."
      ] }),
      report.periods.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-sm font-medium text-gray-900", children: "Equity curve (cumulative P/L)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EquityCurve,
            {
              points: report.periods.map((p) => ({ label: p.period, value: Number(p.cumulativePnl) }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 text-sm font-medium text-gray-900", children: [
            "P/L per ",
            bucket === "day" ? "day" : bucket === "week" ? "week" : "month"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PnlBars, { points: report.periods.map((p) => ({ label: p.period, value: Number(p.pnl) })) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900", children: [
          "Performance by ",
          bucket === "day" ? "day" : bucket === "week" ? "week" : "month"
        ] }),
        report.periods.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-10 w-10" }),
            title: "No closed trades",
            description: "Nothing has been realized in this range yet."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Trades" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Win Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "P/L" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Cumulative" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: report.periods.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: p.period }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-gray-600", children: [
              p.trades,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
                "(",
                p.wins,
                "W/",
                p.losses,
                "L)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: pct(p.winRate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 font-medium ${signClass(p.pnl)}`, children: money(p.pnl) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 ${signClass(p.cumulativePnl)}`, children: money(p.cumulativePnl) })
          ] }, p.period)) })
        ] }) })
      ] }),
      !isAccountReport(report) && report.accounts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900", children: "By account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Trades" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Win Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Realized P/L" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Max Drawdown" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: report.accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: a.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: a.trades }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: pct(a.winRate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 font-medium ${signClass(a.realizedPnl)}`, children: money(a.realizedPnl) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-red-600", children: money(a.maxDrawdown) })
          ] }, a.accountId)) })
        ] }) })
      ] }),
      report.symbols.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900", children: "By symbol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Symbol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Trades" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Win Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Volume" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "P/L" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: report.symbols.map((sym) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: sym.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: sym.trades }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: pct(sym.winRate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-600", children: sym.volumeLots }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-3 font-medium ${signClass(sym.pnl)}`, children: money(sym.pnl) })
          ] }, sym.symbol)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ReportsPage as default
};
