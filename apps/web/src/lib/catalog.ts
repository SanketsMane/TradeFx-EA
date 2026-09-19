/**
 * Marketing catalogue for the public site: the four TradeFx Expert Advisors and
 * the services we sell alongside them.
 *
 * This is deliberately static content, not an API call — the public pages must
 * render for logged-out visitors and stay up when the API is down. When the
 * admin-managed catalogue lands, swap `products`/`services` for a fetch and
 * keep these as the fallback.
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
    image: '/products/scalper.webp',
    cardImage: '/products/scalper-card.webp',
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
    image: '/products/infinity.webp',
    cardImage: '/products/infinity-card.webp',
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
    image: '/products/investor.webp',
    cardImage: '/products/investor-card.webp',
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
    image: '/products/heddge.webp',
    cardImage: '/products/heddge-card.webp',
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
  },
];

export function serviceBySlug(slug: string | undefined): Service | undefined {
  return services.find((s) => s.slug === slug);
}
