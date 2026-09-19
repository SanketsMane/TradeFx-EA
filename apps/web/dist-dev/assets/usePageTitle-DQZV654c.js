import { d as reactExports } from "./index-DS595Jt3.js";
const day = 864e5;
const ago = (ms) => new Date(Date.now() - ms).toISOString();
const demoAccounts = [
  {
    id: "acc-demo-1",
    label: "Exness — Live",
    login: "412 889 03",
    server: "Exness-MT5Real8",
    platform: "MT5",
    status: "CONNECTED",
    marginMode: "hedging"
  },
  {
    id: "acc-demo-2",
    label: "IC Markets — Live",
    login: "308 771 55",
    server: "ICMarketsSC-MT5",
    platform: "MT5",
    status: "CONNECTED",
    marginMode: "netting"
  }
];
const demoLicenses = [
  {
    id: "lic-demo-1",
    code: "K7M4XQ2R9",
    productSlug: "scalper",
    productName: "TradeFx Scalper",
    status: "ACTIVE",
    issuedAt: ago(62 * day),
    activatedAt: ago(61 * day),
    expiresAt: null,
    linkedAccount: { id: "acc-demo-1", label: "Exness — Live", login: "412 889 03", platform: "MT5" }
  },
  {
    id: "lic-demo-2",
    code: "B3H8WD5T6",
    productSlug: "infinity",
    productName: "TradeFx Infinity",
    status: "ACTIVE",
    issuedAt: ago(28 * day),
    activatedAt: ago(27 * day),
    expiresAt: null,
    linkedAccount: { id: "acc-demo-2", label: "IC Markets — Live", login: "308 771 55", platform: "MT5" }
  },
  {
    id: "lic-demo-3",
    code: "P9N2GF4V7",
    productSlug: "heddge",
    productName: "TradeFx Heddge",
    status: "UNASSIGNED",
    issuedAt: ago(2 * day),
    activatedAt: null,
    expiresAt: null,
    linkedAccount: null
  }
];
const demoPerformance = [
  {
    licenseId: "lic-demo-1",
    productName: "TradeFx Scalper",
    accountLabel: "Exness — Live",
    currency: "USD",
    balance: "12480.55",
    equity: "12612.10",
    dailyRoiPct: 1.06,
    dailyPnl: "131.55",
    totalPnl: "2480.55",
    openPositions: 2,
    trades: 318,
    winRate: 0.641,
    lastTradeAt: ago(18e5)
  },
  {
    licenseId: "lic-demo-2",
    productName: "TradeFx Infinity",
    accountLabel: "IC Markets — Live",
    currency: "USD",
    balance: "8150.00",
    equity: "8093.40",
    dailyRoiPct: -0.69,
    dailyPnl: "-56.60",
    totalPnl: "1150.00",
    openPositions: 1,
    trades: 96,
    winRate: 0.583,
    lastTradeAt: ago(54e5)
  }
];
const demoOverview = {
  activeBots: 2,
  linkedAccounts: 2,
  currency: "USD",
  totalEquity: "20705.50",
  dailyPnl: "74.95",
  dailyRoiPct: 0.36,
  performance: demoPerformance
};
const SYMBOLS = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "GBPJPY", "AUDUSD"];
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
function demoStatement(licenseId, count = 40) {
  const rnd = seeded(licenseId.length * 7919 + 13);
  const accountId = licenseId === "lic-demo-1" ? "acc-demo-1" : "acc-demo-2";
  return Array.from({ length: count }, (_, i) => {
    const win = rnd() > 0.38;
    const magnitude = Number((rnd() * 140 + 6).toFixed(2));
    return {
      id: `ev-${licenseId}-${i}`,
      copierConfigId: null,
      sourceAccountId: "master",
      receiverAccountId: accountId,
      sourceTicket: String(8e7 + i * 37),
      receiverTicket: String(9e7 + i * 41),
      symbol: SYMBOLS[Math.floor(rnd() * SYMBOLS.length)],
      side: rnd() > 0.5 ? "BUY" : "SELL",
      lots: (Math.floor(rnd() * 8 + 1) / 100).toFixed(2),
      sl: null,
      tp: null,
      action: "CLOSE",
      status: "SUCCESS",
      latencyMs: Math.floor(rnd() * 90 + 20),
      pnl: (win ? magnitude : -magnitude).toFixed(2),
      ts: ago(i * 36e5 + Math.floor(rnd() * 9e5))
    };
  });
}
const demoQuotes = [
  {
    id: "q-demo-1",
    reference: "TFX-4821",
    productSlug: "heddge",
    serviceSlug: null,
    broker: "Exness",
    accountSize: "$5,000 – $25,000",
    message: "Interested in running Heddge alongside Scalper on a second account.",
    status: "QUOTED",
    quotedNote: "Quote sent by email on 18 Sep. Valid for 14 days.",
    quotedAt: ago(2 * day),
    createdAt: ago(4 * day)
  },
  {
    id: "q-demo-2",
    reference: "TFX-4655",
    productSlug: null,
    serviceSlug: "trading-vps",
    broker: null,
    accountSize: null,
    message: "Need a VPS close to the London data centre for two terminals.",
    status: "NEW",
    quotedNote: null,
    quotedAt: null,
    createdAt: ago(1 * day)
  }
];
const demoBrokers = [
  {
    id: "brk-1",
    name: "Partner Broker",
    logo: null,
    blurb: "Our default partner for new accounts. MT4 and MT5, hedging enabled, and we can support the account directly because we see it on our side.",
    signupUrl: "https://example.com/partner-signup?ref=tradefx",
    highlights: [
      "MT4 and MT5, hedging enabled",
      "Accounts usually approved same day",
      "Works with every TradeFx Expert Advisor",
      "We can assist with setup directly"
    ]
  }
];
const SUFFIX = "TradeFx";
function usePageTitle(title) {
  reactExports.useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
export {
  demoLicenses as a,
  demoPerformance as b,
  demoStatement as c,
  demoOverview as d,
  demoAccounts as e,
  demoBrokers as f,
  demoQuotes as g,
  usePageTitle as u
};
