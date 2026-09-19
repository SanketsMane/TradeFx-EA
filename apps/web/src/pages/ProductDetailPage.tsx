import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  FileText,
  KeyRound,
  LifeBuoy,
  MonitorSmartphone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import ProductCard from '@/components/marketing/ProductCard';
import { productBySlug, products } from '@/lib/catalog';
import { usePageTitle } from '@/lib/usePageTitle';
import { TELEGRAM_URL } from '@/lib/contact';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'included' | 'requirements' | 'faq';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'included', label: "What's included" },
  { id: 'requirements', label: 'Requirements' },
  { id: 'faq', label: 'FAQ' },
];

const assurances = [
  { icon: KeyRound, text: 'Licence issued as soon as your purchase is confirmed' },
  { icon: MonitorSmartphone, text: 'Runs on our infrastructure — no VPS to keep alive' },
  { icon: ShieldCheck, text: 'Your funds stay in your own broker account' },
  { icon: LifeBuoy, text: 'Setup handled with you, not left as a manual' },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = productBySlug(slug);
  const [tab, setTab] = useState<Tab>('overview');

  usePageTitle(product?.name);

  if (!product) return <Navigate to="/products" replace />;

  const others = products.filter((p) => p.slug !== product.slug);
  const spec = [
    { label: 'Platform', value: product.platform },
    { label: 'Strategy', value: product.strategy },
    { label: 'Markets', value: product.markets },
    { label: 'Licence', value: 'One 9-character code per trading account' },
    { label: 'Delivery', value: 'Instant — licence appears in your dashboard' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* ---------------- Breadcrumb ---------------- */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-gray-50">
        <ol className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-3 text-sm">
          <li>
            <Link to="/" className="text-gray-500 transition-colors hover:text-gray-900">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <li>
            <Link to="/products" className="text-gray-500 transition-colors hover:text-gray-900">
              Expert Advisors
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <li aria-current="page" className="truncate font-medium text-gray-900">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ---------------- Buy box ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Product stage */}
          <div className="relative">
            <div className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-8 sm:p-12">
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-x-8 bottom-0 h-2/3 bg-gradient-to-t to-transparent blur-3xl',
                  product.accent.glow,
                )}
              />
              <img
                src={product.image}
                alt={`${product.name} Expert Advisor`}
                width={420}
                className="relative w-full max-w-[340px] object-contain drop-shadow-2xl"
              />
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-3">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
                >
                  <BadgeCheck className="h-4 w-4 shrink-0 text-brand-600" />
                  <span className="text-xs font-medium text-gray-700">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail + CTA */}
          <div className="lg:py-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1',
                product.accent.chip,
              )}
            >
              <product.icon className="h-3.5 w-3.5" />
              Expert Advisor
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              {product.kicker}
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-600">{product.summary}</p>

            {/* Price is deliberately absent — everything is quote-on-request. */}
            <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">Priced per account</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                The right figure depends on the account size and how many accounts you run, so an
                advisor quotes it rather than a price list.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to={`/quote?product=${product.slug}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Request a quotation <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Send className="h-4 w-4" /> Ask on Telegram
                </a>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5">
              {assurances.map((a) => (
                <li key={a.text} className="flex gap-2.5">
                  <a.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span className="text-sm leading-relaxed text-gray-600">{a.text}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-7 divide-y divide-gray-100 border-y border-gray-100">
              {spec.map((sp) => (
                <div key={sp.label} className="flex justify-between gap-4 py-3">
                  <dt className="text-sm text-gray-500">{sp.label}</dt>
                  <dd className="text-right text-sm font-semibold text-gray-900">{sp.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- Tabs ---------------- */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div
            role="tablist"
            aria-label="Product details"
            className="flex gap-1 overflow-x-auto border-b border-gray-200"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  '-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                  tab === t.id
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="pt-8"
          >
            {tab === 'overview' && (
              <div className="max-w-3xl space-y-4">
                {product.description.map((para) => (
                  <p key={para.slice(0, 40)} className="text-base leading-relaxed text-gray-600">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {tab === 'included' && (
              <ul className="grid max-w-4xl gap-3 sm:grid-cols-2">
                {product.included.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3.5"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-content-center rounded-full bg-brand-50 text-brand-700">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    <span className="text-sm leading-relaxed text-gray-700">{i}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'requirements' && (
              <div className="max-w-3xl">
                <ul className="space-y-3">
                  {product.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span className="text-sm leading-relaxed text-gray-700">{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                  Not sure whether your broker qualifies? Send it with your quote request and we
                  will confirm before anything is purchased.
                </p>
              </div>
            )}

            {tab === 'faq' && (
              <dl className="max-w-3xl space-y-4">
                {product.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <dt className="font-semibold text-gray-900">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
                  </div>
                ))}
                <p className="pt-2 text-sm text-gray-500">
                  More general questions are answered on{' '}
                  <Link to="/how-it-works" className="font-semibold text-brand-700 hover:underline">
                    How it works
                  </Link>
                  .
                </p>
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Related ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Also in the range</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- Sticky mobile CTA ---------------- */}
      <div className="sticky bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">Priced per account</p>
          </div>
          <Link
            to={`/quote?product=${product.slug}`}
            className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Get a quote
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
