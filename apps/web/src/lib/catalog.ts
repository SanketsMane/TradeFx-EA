/**
 * Marketing catalogue for the public site: the four TradeFx Expert Advisors and
 * the services we sell alongside them.
 *
 * This is deliberately static content, not an API call — the public pages must
 * render for logged-out visitors and stay up when the API is down. When the
 * admin-managed catalogue lands, swap `products`/`services` for a fetch and
 * keep these as the fallback.
 *
 * Asset paths live under /product-images, not /products: the latter is a
 * client-side route, and a real directory of that name makes nginx 301 to
 * the folder instead of handing the request to the SPA.
 *
 * Two rules this file exists to enforce:
 *  1. No prices. Everything is quote-on-request; an admin sends the figure.
 *  2. The word "copy" never appears in customer-facing copy — these are Expert
 *     Advisors. The box art badges every product "EXPERT ADVISOR"; the site has
 *     to agree.
 */
import {
  Bot,
  Server,
  Network,
  Coins,
  Wrench,
  Gauge,
  Infinity as InfinityIcon,
  LineChart,
  ShieldHalf,
  type LucideIcon,
} from 'lucide-react';

export type ProductSlug = 'scalper' | 'infinity' | 'investor' | 'heddge';

export interface Product {
  slug: ProductSlug;
  /** Full product name as printed on the box. */
  name: string;
  /** The short word after "TradeFx" — used where the lockup is already implied. */
  shortName: string;
  icon: LucideIcon;
  /** Pipe-separated verbs from the box front, e.g. "Automate | Analyze | Grow". */
  kicker: string;
  /** The strapline printed on the box. */
  tagline: string;
  /** One sentence for cards and meta descriptions. */
  summary: string;
  /** Long copy for the detail page, one string per paragraph. */
  description: string[];
  /** The four icon captions along the bottom of the box. */
  highlights: string[];
  platform: string;
  /** Short badge for cards — must stay on one line at a 4-up grid width. */
  tag: string;
  /** Longer wording for the detail page spec table. */
  strategy: string;
  markets: string;
  /** Tailwind classes for the per-product accent, sampled from the artwork. */
  accent: { chip: string; glow: string };
  image: string;
  cardImage: string;
  /** ~240px wide variant, for phone-sized slots. */
  smallImage: string;
  /** Intrinsic size of cardImage — lets the browser reserve space (CLS). */
  cardSize: { w: number; h: number };
  /** Intrinsic size of image. */
  imageSize: { w: number; h: number };
  /** Side-by-side comparison attributes. Qualitative on purpose — we do not
   *  publish performance figures we have not verified. */
  compare: {
    risk: 'Higher' | 'Moderate' | 'Lower';
    frequency: string;
    horizon: string;
    accountType: string;
    bestFor: string;
  };
  /** Line items on the "what you get" panel. */
  included: string[];
  /** What the customer needs before this will run. */
  requirements: string[];
  /** Product-specific questions; the generic ones live on /how-it-works. */
  faqs: { q: string; a: string }[];
}

export const products: Product[] = [
  {
    slug: 'scalper',
    name: 'TradeFx Scalper',
    shortName: 'Scalper',
    icon: Gauge,
    kicker: 'Fast | Precise | Automated',
    tagline: 'Trade Smarter',
    summary:
      'A high-frequency Expert Advisor that works the short intraday swings on gold and the major pairs.',
    description: [
      'TradeFx Scalper is built for traders who want to be in and out of the market quickly. It reads short-term momentum on XAUUSD and the major currency pairs, opens tightly-scoped positions and manages them to a defined target without manual input.',
      'Every position carries a stop from the moment it is opened. Exposure limits, spread filters and a daily loss ceiling are enforced by the Expert Advisor itself, so a bad session closes the bot down rather than compounding.',
      'Setup is a single licence code. Once your MT5 account is linked the Expert Advisor runs on our infrastructure — nothing to install, no VPS to keep alive, no terminal to leave running on your own machine.',
    ],
    highlights: ['High accuracy', 'Automated trading', 'Risk management', 'Easy setup'],
    platform: 'MetaTrader 5',
    tag: 'Scalping',
    strategy: 'Intraday scalping',
    markets: 'XAUUSD · FX majors',
    accent: { chip: 'bg-amber-50 text-amber-800 ring-amber-200', glow: 'from-amber-200/40' },
    image: '/product-images/scalper.webp',
    cardImage: '/product-images/scalper-card.webp',
    smallImage: '/product-images/scalper-sm.webp',
    cardSize: { w: 440, h: 689 },
    imageSize: { w: 900, h: 1410 },
    compare: {
      risk: 'Higher',
      frequency: 'Several trades a session',
      horizon: 'Intraday',
      accountType: 'Raw-spread / ECN, MT5',
      bestFor: 'Traders who want activity and can sit through fast swings',
    },
    included: [
      'One 9-character licence code',
      'Managed execution on our infrastructure',
      'Guided setup for your MT4 or MT5 account',
      'Live dashboard with daily return and full trade statement',
      'CSV export of every trade',
      'Support over email and Telegram',
    ],
    requirements: [
      'An MT5 account with a broker of your choice',
      'A raw-spread or ECN account type — wide spreads erode scalping edges',
      'Sensible leverage; we will advise on the day',
    ],
    faqs: [
      {
        q: 'How often does it trade?',
        a: 'Scalper is the busiest of the range. On an active session it may open and close positions several times an hour; on a quiet one it can sit out entirely. It will not trade for the sake of it.',
      },
      {
        q: 'Why MT5 rather than MT4?',
        a: 'The execution and symbol handling it relies on are cleaner on MT5. An MT4 build is not currently offered.',
      },
      {
        q: 'What happens when spreads widen?',
        a: 'It stops. A spread filter blocks new entries above a threshold, because a scalping edge disappears the moment the spread eats it.',
      },
    ],
  },
  {
    slug: 'infinity',
    name: 'TradeFx Infinity',
    shortName: 'Infinity',
    icon: InfinityIcon,
    kicker: 'Automate | Analyze | Grow',
    tagline: 'Trade Without Limits',
    summary:
      'Our multi-asset Expert Advisor, designed for consistent performance across currencies, metals and indices.',
    description: [
      'TradeFx Infinity is the generalist of the range. Rather than specialising in one instrument it spreads activity across currencies, metals and index CFDs, so a quiet stretch in one market does not leave the account idle.',
      'The Expert Advisor sizes each position against the account balance and keeps total exposure inside a fixed ceiling. Correlated positions are counted together, which stops the familiar problem of holding what looks like four trades but is really one bet repeated.',
      'Infinity is the right starting point if you want steady participation across a broad market rather than a single concentrated strategy.',
    ],
    highlights: ['High accuracy', 'Fully automated', 'Risk management', 'Multi-asset support'],
    platform: 'MetaTrader 4 · MetaTrader 5',
    tag: 'Multi-asset',
    strategy: 'Multi-asset trend and momentum',
    markets: 'FX · Metals · Indices',
    accent: { chip: 'bg-orange-50 text-orange-800 ring-orange-200', glow: 'from-orange-200/40' },
    image: '/product-images/infinity.webp',
    cardImage: '/product-images/infinity-card.webp',
    smallImage: '/product-images/infinity-sm.webp',
    cardSize: { w: 440, h: 668 },
    imageSize: { w: 900, h: 1366 },
    compare: {
      risk: 'Moderate',
      frequency: 'A few trades a day',
      horizon: 'Days to weeks',
      accountType: 'Standard MT4 or MT5',
      bestFor: 'A first Expert Advisor, spread across many markets',
    },
    included: [
      'One 9-character licence code',
      'Managed execution on our infrastructure',
      'Guided setup for your MT4 or MT5 account',
      'Live dashboard with daily return and full trade statement',
      'CSV export of every trade',
      'Support over email and Telegram',
    ],
    requirements: [
      'An MT4 or MT5 account',
      'A broker offering FX, metals and index CFDs',
      'Enough balance to hold several positions at once',
    ],
    faqs: [
      {
        q: 'How many markets does it trade?',
        a: 'It spreads activity across currencies, metals and index CFDs rather than concentrating on one instrument, so a quiet stretch in one market does not leave the account idle.',
      },
      {
        q: 'Can I restrict it to certain symbols?',
        a: 'Yes. Tell us which instruments you want in or out when you set up, and we apply the filter to your account.',
      },
      {
        q: 'Does it hold positions overnight?',
        a: 'It can. Positions are held as long as the setup holds, so expect swap charges on longer holds.',
      },
    ],
  },
  {
    slug: 'investor',
    name: 'TradeFx Investor',
    shortName: 'Investor',
    icon: LineChart,
    kicker: 'Invest | Compound | Grow',
    tagline: 'Long Term. Real Results.',
    summary:
      'A low-intensity Expert Advisor for capital you intend to leave alone — built around stability and compounding.',
    description: [
      'TradeFx Investor trades far less often than the rest of the range, and that is the point. It targets a small number of higher-conviction positions and holds them, aiming to compound steadily rather than to post a busy trade log.',
      'Position sizes stay conservative and scale with the account as it grows, so the risk taken on each trade stays proportionate instead of drifting upward after a good run.',
      'This is the Expert Advisor to look at if your horizon is measured in quarters rather than sessions, and drawdown matters more to you than trade count.',
    ],
    highlights: ['Low-risk strategies', 'Automated investing', 'Portfolio management', 'Long-term growth'],
    platform: 'MetaTrader 4 · MetaTrader 5',
    tag: 'Long term',
    strategy: 'Position trading and compounding',
    markets: 'FX majors · Metals',
    accent: { chip: 'bg-yellow-50 text-yellow-800 ring-yellow-200', glow: 'from-yellow-200/40' },
    image: '/product-images/investor.webp',
    cardImage: '/product-images/investor-card.webp',
    smallImage: '/product-images/investor-sm.webp',
    cardSize: { w: 440, h: 665 },
    imageSize: { w: 900, h: 1360 },
    compare: {
      risk: 'Lower',
      frequency: 'A handful a month',
      horizon: 'Months to quarters',
      accountType: 'Standard MT4 or MT5',
      bestFor: 'Capital you intend to leave alone and compound',
    },
    included: [
      'One 9-character licence code',
      'Managed execution on our infrastructure',
      'Guided setup for your MT4 or MT5 account',
      'Live dashboard with daily return and full trade statement',
      'CSV export of every trade',
      'Support over email and Telegram',
    ],
    requirements: [
      'An MT4 or MT5 account',
      'A horizon measured in months rather than sessions',
      'Capital you can leave in place while it compounds',
    ],
    faqs: [
      {
        q: 'Why so few trades?',
        a: 'That is the design. Investor waits for higher-conviction setups and holds them, aiming to compound steadily rather than post a busy trade log.',
      },
      {
        q: 'Does position size grow with the account?',
        a: 'Yes. Sizing scales with balance, so risk per trade stays proportionate instead of drifting upward after a good run.',
      },
      {
        q: 'Can I withdraw while it is running?',
        a: 'Whenever you like — it is your broker account. Position sizes adjust to the new balance automatically.',
      },
    ],
  },
  {
    slug: 'heddge',
    name: 'TradeFx Heddge',
    shortName: 'Heddge',
    icon: ShieldHalf,
    kicker: 'Hedge | Protect | Balance | Grow',
    tagline: 'Hedge Today. Trade Tomorrow.',
    summary:
      'A hedging Expert Advisor that holds both sides of a market to smooth out volatility and control drawdown.',
    description: [
      'TradeFx Heddge runs offsetting positions rather than picking a single direction, so a sharp move against one leg is cushioned by the other. The aim is a flatter equity curve, not the largest possible win on any one trade.',
      'The Expert Advisor rebalances the two sides as price moves and closes the pair once the combined position reaches its target. Total exposure per hedge is capped, and the bot will sit out entirely when spreads widen beyond a safe threshold.',
      'Heddge suits accounts where protecting capital through volatile conditions matters more than maximising a single directional call. It requires a hedging-enabled broker account — netting accounts cannot hold both sides at once.',
    ],
    highlights: ['Hedge strategies', 'Risk management', 'Automated trading', 'Consistent growth'],
    platform: 'MetaTrader 5 (hedging accounts)',
    tag: 'Hedging',
    strategy: 'Two-sided hedging',
    markets: 'FX majors · XAUUSD',
    accent: { chip: 'bg-amber-50 text-amber-900 ring-amber-300', glow: 'from-amber-300/40' },
    image: '/product-images/heddge.webp',
    cardImage: '/product-images/heddge-card.webp',
    smallImage: '/product-images/heddge-sm.webp',
    cardSize: { w: 440, h: 652 },
    imageSize: { w: 900, h: 1333 },
    compare: {
      risk: 'Moderate',
      frequency: 'Paired positions, held',
      horizon: 'Days to weeks',
      accountType: 'MT5 with hedging enabled',
      bestFor: 'Protecting capital through volatile conditions',
    },
    included: [
      'One 9-character licence code',
      'Managed execution on our infrastructure',
      'Guided setup for your MT4 or MT5 account',
      'Live dashboard with daily return and full trade statement',
      'CSV export of every trade',
      'Support over email and Telegram',
    ],
    requirements: [
      'An MT5 account with hedging enabled — netting accounts cannot hold both sides',
      'A broker that permits hedged positions',
      'Margin headroom, since two legs are open at once',
    ],
    faqs: [
      {
        q: 'How do I know if my account supports hedging?',
        a: 'Your broker states it when you open the account, and we check it automatically when you link. If the account is netting, we tell you before anything starts trading.',
      },
      {
        q: 'Does hedging mean I cannot lose?',
        a: 'No. Hedging smooths volatility and limits how fast a position moves against you; it does not remove risk, and both legs carry cost. Anyone telling you otherwise is selling something.',
      },
      {
        q: 'Why does it need more margin?',
        a: 'Two legs are open at the same time, so the broker reserves margin for both. We size accordingly, but headroom matters more here than elsewhere in the range.',
      },
    ],
  },
];

export function productBySlug(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export interface Service {
  slug: string;
  name: string;
  icon: LucideIcon;
  summary: string;
  bullets: string[];
  /** Page title for the standalone service page. */
  pageTitle: string;
  metaDescription: string;
  /** Long copy, one string per paragraph. */
  description: string[];
  /** Ordered steps of how the engagement runs. */
  process: { step: string; detail: string }[];
  /** What the client ends up owning. */
  deliverables: string[];
  faqs: { q: string; a: string }[];
  /** The limitation this page states plainly. Buyers in this market screen for it. */
  caveat: { title: string; body: string };
}

export const services: Service[] = [
  {
    slug: 'ea-development',
    name: 'Forex Expert Advisor Development',
    icon: Bot,
    summary:
      'We turn a written strategy into a tested MT4 or MT5 Expert Advisor, with the risk controls built in rather than bolted on.',
    bullets: [
      'Strategy review before a line of code is written',
      'MQL4 and MQL5, coded to your entry and exit rules',
      'Backtesting and optimisation over historical data',
      'Source code handed over on delivery',
    ],
    pageTitle: "Forex Expert Advisor Development for MT4 and MT5",
    metaDescription: "Turn a written strategy into a tested Expert Advisor. Strategy review, MQL4 and MQL5, backtesting and optimisation, and the source code handed over on delivery.",
    description: [
      "You bring the strategy; we turn it into an Expert Advisor that trades it exactly as written. Most of the work is not the coding — it is pinning down the rules precisely enough that a machine can follow them without interpretation.",
      "We write in MQL4 and MQL5, natively for whichever platform you are on rather than porting between them. A port carries execution differences that only show up in live trading, which is the worst place to find them.",
      "Risk controls are built in from the start, not bolted on at the end. Position sizing, exposure limits and a daily loss ceiling are part of the specification we agree before any code is written.",
    ],
    process: [
      {
        step: "Strategy review",
        detail: "We read your rules and come back with the ambiguities. Almost every strategy has two or three places where a human would use judgement and a machine cannot.",
      },
      {
        step: "Specification",
        detail: "A written spec covering entries, exits, sizing, risk limits and edge cases. You sign it off before coding starts, and it is what we are judged against.",
      },
      {
        step: "Build",
        detail: "Written natively in MQL4 or MQL5, with the risk controls in the specification rather than added afterwards.",
      },
      {
        step: "Backtest and optimise",
        detail: "Tested over historical data across varied market conditions, with the parameter sensitivity reported rather than only the best run.",
      },
      {
        step: "Forward test",
        detail: "Run on a demo account so you see behaviour on live prices before committing capital.",
      },
      {
        step: "Handover",
        detail: "Source code, the specification, the test results and a walkthrough. The code is yours.",
      },
    ],
    deliverables: [
      "Full MQL4 or MQL5 source code, owned by you",
      "The signed-off written specification",
      "Backtest and forward-test reports, including the runs that went badly",
      "A walkthrough session covering parameters and how to change them",
      "Thirty days of bug fixes after handover",
    ],
    faqs: [
      {
        q: "Do I own the source code?",
        a: "Yes. The full MQL source is handed over on delivery and it is yours to modify, resell or take to another developer. We keep no licence over it. Many developers in this market retain the code and rent you a compiled file; we do not.",
      },
      {
        q: "How long does a typical Expert Advisor take?",
        a: "A single-entry strategy with clear rules is usually two to three weeks including testing. Multi-instrument logic, custom indicators or portfolio-level risk management push it to six or more. We give a range after the strategy review, not before.",
      },
      {
        q: "What do you need from me to quote?",
        a: "Entry and exit rules, how position size is decided, which instruments and timeframes, and what should happen in the awkward cases — gaps, news, a position still open at the weekend. If you have those written down, we can quote.",
      },
      {
        q: "Can you make my strategy profitable?",
        a: "No, and anyone who says otherwise is selling something. We can implement a strategy faithfully, test it honestly and tell you what the tests show. Whether the underlying edge exists is a property of the strategy, not of the code.",
      },
      {
        q: "Will you build any strategy?",
        a: "Not any. We decline martingale systems, grids without a hard stop, and anything intended to be marketed as risk-free or guaranteed. They are straightforward to write and they eventually take the account to zero.",
      },
    ],
    caveat: {
      title: "A good backtest is not a forecast",
      body: "Optimisation can fit a strategy to the past so closely that it describes history rather than the market. We report parameter sensitivity alongside results so you can see whether performance depends on one lucky setting, and we forward-test on demo before anyone risks money. A developer who shows you only a smooth equity curve is showing you a curve they fitted.",
    },
  },
  {
    slug: 'trading-vps',
    name: 'Forex Trading VPS',
    icon: Server,
    summary:
      'Low-latency Windows servers next door to the major broker data centres, so your terminal runs whether your laptop is on or not.',
    bullets: [
      'Sub-millisecond routes to London, New York and Tokyo',
      'Runs continuously, monitored around the clock',
      'MT4 and MT5 pre-installed and configured',
      'Scale the plan as you add accounts',
    ],
    pageTitle: "Forex Trading VPS — Low-Latency MT4 and MT5 Hosting",
    metaDescription: "Windows VPS near the major broker data centres with MetaTrader pre-installed, so your terminal keeps running whether your own machine is on or not.",
    description: [
      "A trading VPS is a Windows server that runs your MetaTrader terminal continuously, in a data centre close to your broker. Your strategy keeps trading when your laptop is asleep, your power cuts out or your home connection drops.",
      "Ours sit near the major broker hubs in London, New York and Tokyo, which is where the round trip to your broker is shortest. You pick the location that matches where your broker executes, not where you happen to live.",
      "MetaTrader 4 and 5 come pre-installed and configured. We handle the Windows updates, the monitoring and the restarts.",
    ],
    process: [
      {
        step: "Pick a location",
        detail: "Tell us your broker and we will tell you which of our locations is nearest to their execution servers.",
      },
      {
        step: "Provisioning",
        detail: "The server is ready the same working day, with MetaTrader installed and configured.",
      },
      {
        step: "Setup",
        detail: "We install your terminal, log it into your broker and confirm your Expert Advisor or strategy is running.",
      },
      {
        step: "Ongoing",
        detail: "Monitored continuously. We patch Windows, watch the terminal and restart it if it stops.",
      },
    ],
    deliverables: [
      "Windows Server with full remote desktop access",
      "MetaTrader 4 and 5 pre-installed",
      "A location chosen to match your broker",
      "Continuous monitoring with automatic terminal restart",
      "Scale the plan as you add accounts or terminals",
    ],
    faqs: [
      {
        q: "Do I need a VPS to run a TradeFx Expert Advisor?",
        a: "No. Our Expert Advisors run on our own infrastructure — there is nothing for you to host and no VPS to rent. This service is for traders running their own terminals, their own EAs, or software from another vendor.",
      },
      {
        q: "How much latency should I expect?",
        a: "It depends on your broker and which location you choose, so we measure it for your specific broker before you commit rather than quoting a number that may not apply to you.",
      },
      {
        q: "Does lower latency actually matter?",
        a: "It matters a great deal to a scalper working small targets, where a few milliseconds changes the fill. It matters very little to a swing strategy holding for days. Be honest with yourself about which you are before paying for the fastest option.",
      },
      {
        q: "Can I run other software on it?",
        a: "Yes. It is a normal Windows server with remote desktop. Most clients run several terminals, charting tools or their own scripts.",
      },
      {
        q: "What happens if the server goes down?",
        a: "Monitoring alerts us and the terminal restarts automatically. A VPS removes your home connection and your laptop as points of failure; it does not remove every point of failure, and no honest provider will tell you otherwise.",
      },
    ],
    caveat: {
      title: "Most of our Expert Advisor customers do not need this",
      body: "If you bought a TradeFx Expert Advisor, it already runs on our infrastructure and a VPS adds nothing. Buy one only if you are hosting your own terminals or software from elsewhere. We would rather turn down the sale than sell you something you will not use.",
    },
  },
  {
    slug: 'multi-account-execution',
    name: 'Multi-Account Execution System',
    icon: Network,
    summary:
      'Mirror one set of trading decisions across many MetaTrader accounts, with per-account sizing, filters and trading hours.',
    bullets: [
      'One managed account fans out to many client accounts',
      'Fixed-lot, multiplier or balance-ratio sizing per account',
      'Symbol mapping across brokers with different suffixes',
      'Live execution log and a full audit trail',
    ],
    pageTitle: "Multi-Account Trade Execution System for MT4 and MT5",
    metaDescription: "Mirror one set of trading decisions across many MetaTrader accounts, with per-account sizing, symbol mapping, trade filters and a full audit trail.",
    description: [
      "One managed account makes the decisions and every connected account follows, each with its own sizing rules. It is the infrastructure behind managing money for several clients, running a family of accounts, or servicing a signal group without anyone placing orders by hand.",
      "Sizing is per account, not global: fixed lots, a multiplier of the source, or a ratio of account balance. A client with a tenth of the capital takes a tenth of the position, automatically.",
      "Brokers name instruments differently, so symbol mapping translates between them — EURUSD on one, EURUSD.r on another — and per-account filters restrict which instruments, volumes and trading hours apply.",
    ],
    process: [
      {
        step: "Scope",
        detail: "How many accounts, which brokers, what sizing model, and who is permitted to see what.",
      },
      {
        step: "Build and connect",
        detail: "The source account is configured and receiving accounts are attached with their own rules.",
      },
      {
        step: "Paper run",
        detail: "Run against demo accounts first to confirm sizing and mapping behave as expected before real money.",
      },
      {
        step: "Go live and monitor",
        detail: "A live execution log, per-account reporting and alerting when a trade fails to reach an account.",
      },
    ],
    deliverables: [
      "One source account fanning out to many receiving accounts",
      "Per-account sizing: fixed lot, multiplier or balance ratio",
      "Symbol mapping across brokers with differing suffixes",
      "Instrument, volume and trading-hours filters per account",
      "Live execution log and a full audit trail",
    ],
    faqs: [
      {
        q: "How many accounts can follow one source?",
        a: "The platform is built for tens of accounts per source. Beyond that the constraint is usually your brokers rate-limiting order flow rather than our side, which is something we test during the paper run.",
      },
      {
        q: "Can accounts be on different brokers?",
        a: "Yes, and most setups are. Symbol mapping handles the naming differences, and each account keeps its own sizing rules.",
      },
      {
        q: "What happens when a trade fails on one account?",
        a: "It is recorded in the execution log and an alert is raised. That account is then out of step with the source, which is precisely why the alert exists rather than the failure being swallowed quietly.",
      },
      {
        q: "Do I need regulatory permission to manage other people\u2019s accounts?",
        a: "Very possibly, depending on where you and your clients are. Trading other people\u2019s money is a regulated activity in most jurisdictions. We supply software; we do not supply a licence, and you should take your own advice before taking on client funds.",
      },
    ],
    caveat: {
      title: "Following accounts will not match the source exactly",
      body: "Different brokers fill at different prices, spreads vary, and an account short of margin will reject a trade the source took. Expect close tracking, not identical results. Anyone promising exact replication across brokers is describing something that cannot happen.",
    },
  },
  {
    slug: 'crypto-p2p',
    name: 'Crypto P2P Platforms',
    icon: Coins,
    summary:
      'Peer-to-peer exchange platforms with escrow, dispute handling, KYC and merchant tooling, built to your rules.',
    bullets: [
      'Escrow-backed order matching',
      'Dispute resolution and admin arbitration',
      'KYC, tiered limits and risk scoring',
      'Merchant accounts and settlement reporting',
    ],
    pageTitle: "Crypto P2P Exchange Platform Development",
    metaDescription: "Peer-to-peer crypto trading platforms with escrow, dispute resolution, KYC and merchant tooling — built to your rules and handed over as source.",
    description: [
      "A peer-to-peer exchange matches buyers and sellers directly and holds the asset in escrow until both sides are satisfied. We build the whole platform: matching, escrow, disputes, identity checks, merchant accounts and the admin tooling to run it.",
      "The hard part is not the trading screen. It is the dispute flow, the evidence handling and the admin tooling, because that is what decides whether the platform is trusted after something goes wrong.",
      "Everything is built to your rules on limits, fees, supported assets and payment methods, and handed over as source.",
    ],
    process: [
      {
        step: "Rules workshop",
        detail: "Assets, payment methods, fee model, limits, KYC tiers and exactly how a dispute is decided.",
      },
      {
        step: "Architecture",
        detail: "Escrow model, custody approach and the security review, agreed in writing before implementation.",
      },
      {
        step: "Build",
        detail: "Order matching, escrow, dispute handling, KYC, merchant accounts and the admin console.",
      },
      {
        step: "Security review",
        detail: "An independent review of the custody and escrow paths before anything touches real funds.",
      },
      {
        step: "Handover",
        detail: "Source code, deployment and operational documentation for the people who will run it.",
      },
    ],
    deliverables: [
      "Escrow-backed peer-to-peer order matching",
      "Dispute resolution with evidence capture and admin arbitration",
      "KYC with tiered limits and risk scoring",
      "Merchant accounts and settlement reporting",
      "Admin console, full source code and operational documentation",
    ],
    faqs: [
      {
        q: "Do you handle custody of funds?",
        a: "We build the platform; we never hold your users\u2019 funds. Custody is architected with you and normally uses a provider you select and contract with directly.",
      },
      {
        q: "Can you help with the licensing?",
        a: "No. Operating a crypto exchange is a regulated activity in most jurisdictions and frequently requires registration or a licence. We are software developers, not a law firm — engage counsel in your operating jurisdictions early, because the answer often changes the product.",
      },
      {
        q: "How long does a platform take?",
        a: "A focused single-market platform is typically three to four months. Multiple fiat currencies, several custody integrations or a mobile app extend that. We scope it properly before quoting.",
      },
      {
        q: "Is it audited?",
        a: "We commission an independent security review of the custody and escrow paths before launch, and we will not hand over a platform that has skipped it.",
      },
    ],
    caveat: {
      title: "Regulation will shape this more than the code",
      body: "Peer-to-peer crypto is regulated very differently across jurisdictions, and the requirements frequently change what the product can be. Get legal advice for every market you intend to operate in before you commission a build. We will happily build to a specification; we cannot make an unlicensed operation lawful.",
    },
  },
  {
    slug: 'custom-development',
    name: 'Custom Trading Development',
    icon: Wrench,
    summary:
      'Dashboards, broker and exchange integrations, reporting pipelines, bespoke indicators — if it touches trading, ask us.',
    bullets: [
      'Broker and exchange API integrations',
      'Client portals and reporting dashboards',
      'Custom indicators and analysis tools',
      'Ongoing maintenance and support',
    ],
    pageTitle: "Custom Trading Software Development",
    metaDescription: "Broker and exchange integrations, client portals, reporting pipelines and custom indicators — trading software built to order and handed over as source.",
    description: [
      "The work that does not fit the other categories. Broker and exchange API integrations, client-facing portals, reporting pipelines, custom indicators and analysis tools, internal dashboards — if it touches trading, it is probably something we have built.",
      "We work the same way regardless of size: agree what it must do, build it, hand over the source. You own what we write.",
      "Small pieces of work are welcome. Not everything needs to be a project.",
    ],
    process: [
      {
        step: "Conversation",
        detail: "Tell us the problem rather than the solution. Often there is a smaller piece of work that solves it.",
      },
      {
        step: "Scope and quote",
        detail: "A written scope with a fixed quote, or a rate and an estimate for open-ended work.",
      },
      {
        step: "Build",
        detail: "Delivered in reviewable pieces so you see progress rather than waiting for one large drop.",
      },
      {
        step: "Handover",
        detail: "Source code, documentation and a walkthrough.",
      },
    ],
    deliverables: [
      "Broker and exchange API integrations",
      "Client portals and reporting dashboards",
      "Custom indicators and analysis tools",
      "Data pipelines and scheduled reporting",
      "Full source code and documentation",
    ],
    faqs: [
      {
        q: "Is there a minimum project size?",
        a: "No. Some of our best client relationships started with a two-day piece of work. If it is genuinely small we will say so and quote accordingly.",
      },
      {
        q: "Can you work with our existing codebase?",
        a: "Usually. We will want to read it before quoting, because inherited code is where estimates go wrong and we would rather find that out before giving you a number.",
      },
      {
        q: "Do you offer ongoing maintenance?",
        a: "Yes, either on retainer or ad hoc. You own the source either way, so you are never locked in to us.",
      },
    ],
    caveat: {
      title: "We will tell you when not to build it",
      body: "A reasonable share of enquiries are better solved by configuring something that already exists, or by not building anything at all. We will say so, even though it costs us the work. It is cheaper for both of us than delivering software you did not need.",
    },
  },
];

export function serviceBySlug(slug: string | undefined): Service | undefined {
  return services.find((s) => s.slug === slug);
}
