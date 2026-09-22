import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { products } from '@/lib/catalog';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, faqSchema, itemListSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

const RISK_TONE: Record<string, string> = {
  Lower: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 ring-amber-200',
  Higher: 'bg-red-50 text-red-700 ring-red-200',
};

const ROWS: { label: string; get: (p: (typeof products)[number]) => string }[] = [
  { label: 'Strategy', get: (p) => p.strategy },
  { label: 'Markets', get: (p) => p.markets },
  { label: 'Platform', get: (p) => p.platform },
  { label: 'Trade frequency', get: (p) => p.compare.frequency },
  { label: 'Typical horizon', get: (p) => p.compare.horizon },
  { label: 'Risk controls', get: () => 'A stop loss and a take profit on every trade' },
  { label: 'Account needed', get: (p) => p.compare.accountType },
  { label: 'Best for', get: (p) => p.compare.bestFor },
];

const FAQS = [
  {
    q: 'Which TradeFx Expert Advisor should I start with?',
    a: 'Infinity, in most cases. It works a fixed basket of four currency pairs and sets risk as a share of your balance rather than a lot size, so it can start deliberately low while you get used to how an Expert Advisor behaves on your own account.',
  },
  {
    q: 'Can I run more than one Expert Advisor at the same time?',
    a: 'Yes, though we would normally put each on its own trading account so the results stay readable. Each Expert Advisor needs its own 9-character licence, and one licence covers one account.',
  },
  {
    q: 'What is the difference between Scalper and Heddge?',
    a: 'Scalper takes a direction and exits quickly, several times a session. Heddge holds both sides of a market at once and closes the pair on a combined target. Scalper aims for frequent small wins; Heddge aims for a flatter equity curve through volatility.',
  },
  {
    q: 'Do any of them need a special broker account?',
    a: 'Heddge does — it needs an MT5 account with hedging enabled, because a netting account cannot hold both sides at once. Scalper works best on a raw-spread or ECN account, since wide spreads erode a scalping edge. Infinity and Investor run on a standard MT4 or MT5 account.',
  },
  {
    q: 'How much do the Expert Advisors cost?',
    a: 'They are priced per trading account rather than from a price list, because the right figure depends on which Expert Advisor you want, your account size and how many accounts you run. Request a quotation and an advisor replies with a figure.',
  },
];

export default function CompareProductsPage() {
  useSeo({
    title: 'Compare TradeFx Expert Advisors — Scalper vs Infinity vs Investor vs Heddge',
    path: '/products/compare',
    description:
      'Side-by-side comparison of the four TradeFx Expert Advisors: strategy, markets, trade frequency, risk profile and the broker account each one needs. Pick the right EA for how you trade.',
    jsonLd: [
      itemListSchema(products.map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
      faqSchema(FAQS),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Expert Advisors', path: '/products' },
        { name: 'Compare', path: '/products/compare' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-gray-50">
        <ol className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-3 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <li>
            <Link to="/products" className="text-gray-500 hover:text-gray-900">
              Expert Advisors
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <li aria-current="page" className="font-medium text-gray-900">
            Compare
          </li>
        </ol>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Which Expert Advisor is right for you?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          All four run on the same managed infrastructure and all four are licensed per trading
          account. What differs is how often they trade, how much movement you have to sit through,
          and what kind of broker account they need.
        </p>
        <p className="mt-4 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          Every Expert Advisor here opens each position with a stop loss and a take profit, so no
          trade is left to run unbounded. That is not the same as safety: the risk labels below are
          relative to each other rather than a promise, all of these trade on margin, and a gap or
          fast market can carry a price past a stop. You can lose money, including more than your
          deposit.
        </p>
      </section>

      {/* ---------------- Comparison table ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">
              Comparison of TradeFx Scalper, Infinity, Investor and Heddge Expert Advisors
            </caption>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="w-40 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  &nbsp;
                </th>
                {products.map((p) => (
                  <th key={p.slug} scope="col" className="px-4 py-4 text-left align-top">
                    <img
                      src={p.cardImage}
                      alt={`${p.name} Expert Advisor`}
                      width={p.cardSize.w}
                      height={p.cardSize.h}
                      loading="lazy"
                      className="mb-3 h-24 w-auto object-contain"
                    />
                    <Link
                      to={`/products/${p.slug}`}
                      className="block text-base font-bold text-gray-900 hover:text-brand-700"
                    >
                      {p.name}
                    </Link>
                    <span className="mt-1 block text-xs font-normal text-gray-500">{p.tagline}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <th scope="row" className="bg-gray-50/60 px-4 py-3 text-left font-medium text-gray-600">
                  Relative risk
                </th>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                        RISK_TONE[p.compare.risk],
                      )}
                    >
                      {p.compare.risk}
                    </span>
                  </td>
                ))}
              </tr>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="bg-gray-50/60 px-4 py-3 text-left font-medium text-gray-600">
                    {row.label}
                  </th>
                  {products.map((p) => (
                    <td key={p.slug} className="px-4 py-3 align-top text-gray-800">
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="bg-gray-50/60 px-4 py-3 text-left font-medium text-gray-600">
                  Built in
                </th>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-3 align-top">
                    <ul className="space-y-1">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-1.5 text-xs text-gray-700">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-600" strokeWidth={3} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="bg-gray-50/60 px-4 py-3" />
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-4">
                    <Link
                      to={`/quote?product=${p.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Written guidance ---------------- */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Choosing between them</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">Start with Infinity</strong> if this is your first
              Expert Advisor. It works four currency pairs rather than one instrument, and risk is
              set as a share of your balance rather than a lot size — so it can begin deliberately
              low while you watch how an Expert Advisor behaves on your own account.
            </p>
            <p>
              <strong className="text-gray-900">Choose Scalper</strong> if you want the account
              working intraday and you are comfortable with a busy trade log. It trades gold and
              nothing else, and it needs a raw-spread or ECN account — on a wide-spread account the
              edge disappears into the spread.
            </p>
            <p>
              <strong className="text-gray-900">Choose Investor</strong> if the money is capital you
              intend to leave alone. It trades the same instrument as Scalper — gold — but holds
              positions for weeks instead of minutes and lets them compound. If you will be checking
              the account daily and want to see activity, this is the wrong one.
            </p>
            <p>
              <strong className="text-gray-900">Choose Heddge</strong> if protecting capital through
              volatile conditions matters more to you than catching a single big directional move.
              It holds both sides of a market and closes the pair on a combined target. It needs an
              MT5 account with hedging enabled — check this before you buy, because netting
              accounts cannot run it.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Common questions</h2>
        <dl className="mt-6 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
              <dt className="font-semibold text-gray-900">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
          <h2 className="text-xl font-bold text-brand-900">Still not sure?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-brand-900/80">
            Tell us your account size, your broker and how much drawdown you are willing to sit
            through. We will tell you which one to start with.
          </p>
          <Link
            to="/quote"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Ask an advisor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
