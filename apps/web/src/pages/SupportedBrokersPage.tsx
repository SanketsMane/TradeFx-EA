import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check, ChevronRight, X } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';
import { cn } from '@/lib/utils';

/**
 * Broker compatibility is stated by capability, not by brand.
 *
 * Naming specific brokers as "supported" would imply a relationship we may
 * not have and would go stale the moment a broker changes its account types.
 * What actually determines compatibility is the account's capabilities, so
 * that is what this page lists.
 */
const REQUIREMENTS = [
  {
    need: 'MetaTrader 4 or MetaTrader 5',
    why: 'Our execution layer connects over MetaTrader. A broker with only a proprietary web platform cannot be used.',
    ok: true,
  },
  {
    need: 'A live account (not investor-password only)',
    why: 'The Expert Advisor has to place orders, so a read-only investor password will not work.',
    ok: true,
  },
  {
    need: 'Automated trading permitted',
    why: 'A handful of brokers restrict algorithmic trading or scalping in their terms. Check before you buy.',
    ok: true,
  },
  {
    need: 'Hedging enabled — for TradeFx Heddge only',
    why: 'Heddge holds both sides of a market at once. A netting account closes one against the other, so it cannot run.',
    ok: true,
  },
  {
    need: 'Raw-spread or ECN — recommended for Scalper',
    why: 'Scalping edges are small. On a wide-spread standard account the spread eats the edge.',
    ok: true,
  },
];

const WONT_WORK = [
  'Brokers with no MetaTrader access (proprietary platforms only)',
  'Demo-only accounts, if you want the bot trading real money',
  'Accounts where the broker forbids automated trading in its terms',
  'Netting-only MT5 accounts, for TradeFx Heddge specifically',
];

const FAQS = [
  {
    q: 'Which brokers work with TradeFx Expert Advisors?',
    a: 'Any broker offering a live MetaTrader 4 or MetaTrader 5 account where automated trading is permitted. That covers the large majority of retail forex brokers. We check your specific account automatically when you connect it, and tell you before anything starts trading if something is wrong.',
  },
  {
    q: 'Can I keep my existing broker?',
    a: 'Usually, yes. Most customers keep the account they already trade on. Send us your broker and account type with your quotation request and we will confirm compatibility before you buy.',
  },
  {
    q: 'How do I know if my MT5 account is hedging or netting?',
    a: 'Your broker states it when you open the account, and it is shown in the MetaTrader terminal under account properties. We also detect it automatically when you link the account — if it is netting and you bought Heddge, we tell you rather than letting it fail silently.',
  },
  {
    q: 'Do I need a VPS?',
    a: 'No. The Expert Advisor runs on our infrastructure, not in a terminal on your machine. There is no VPS to rent and nothing to leave switched on. We do sell a VPS separately for traders who want to run their own terminals, but it is not required for our Expert Advisors.',
  },
  {
    q: 'Does TradeFx hold my money?',
    a: 'No. The broker account is in your name and under your control. We place trades on it; we cannot deposit or withdraw. You can stop the Expert Advisor or withdraw your funds at any time.',
  },
  {
    q: 'What happens if I switch brokers?',
    a: 'Disconnect the old trading account in your dashboard and connect the new one with the same licence code. One licence covers one trading account at a time, not one broker forever.',
  },
];

export default function SupportedBrokersPage() {
  useSeo({
    title: 'Supported Brokers — MT4 and MT5 Compatibility',
    path: '/supported-brokers',
    description:
      'TradeFx Expert Advisors work with any live MetaTrader 4 or MT5 account where automated trading is permitted. Check hedging, spread type and account requirements before you buy.',
    jsonLd: [
      faqSchema(FAQS),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Supported brokers', path: '/supported-brokers' },
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
          <li aria-current="page" className="font-medium text-gray-900">
            Supported brokers
          </li>
        </ol>
      </nav>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Will it work with my broker?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
          Almost certainly. TradeFx Expert Advisors run on any live MetaTrader 4 or MetaTrader 5
          account where the broker permits automated trading — which is the large majority of
          retail forex brokers.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          We list requirements by capability rather than by brand name. Brokers change their
          account types, and a list of logos would be out of date within a quarter — what actually
          decides whether an Expert Advisor can run is what your account can do.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">What your account needs</h2>
        <ul className="mt-6 space-y-3">
          {REQUIREMENTS.map((r) => (
            <li key={r.need} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-content-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <div>
                <div className="font-semibold text-gray-900">{r.need}</div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{r.why}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
          What will not work
        </h2>
        <ul className="mt-6 space-y-2.5">
          {WONT_WORK.map((w) => (
            <li key={w} className="flex gap-3 text-sm text-gray-700">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
              {w}
            </li>
          ))}
        </ul>

        <div className={cn('mt-10 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4')}>
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>We check before anything trades.</strong> When you connect an account we verify
            the platform, the account type and whether hedging is available. If something is
            incompatible you are told at that point — not after a trade has failed.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Broker questions</h2>
          <dl className="mt-6 space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <dt className="font-semibold text-gray-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Send us your broker and we will confirm
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Include your broker and account type with a quotation request. We check compatibility
          before you buy anything.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Request a quotation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/products/compare"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Compare the Expert Advisors
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
