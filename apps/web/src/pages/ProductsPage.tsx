import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, KeyRound, LifeBuoy } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import ProductCard from '@/components/marketing/ProductCard';
import { products } from '@/lib/catalog';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';

const included = [
  { icon: KeyRound, title: 'A licence code', desc: 'Nine characters, issued the moment your purchase is confirmed.' },
  { icon: BadgeCheck, title: 'Managed execution', desc: 'The Expert Advisor runs on our infrastructure — no VPS to babysit.' },
  { icon: LifeBuoy, title: 'Setup and support', desc: 'We walk you through linking your MT4 or MT5 account.' },
];

export default function ProductsPage() {
  useSeo({
    title: 'Forex Expert Advisors for MT4 and MT5',
    path: '/products',
    description:
      'Compare the four TradeFx Expert Advisors — Scalper for gold intraday, Infinity for a four-pair currency basket, Investor for gold held long, and Heddge for two-sided hedging. Managed execution, no VPS required.',
    jsonLd: [
      itemListSchema(products.map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Expert Advisors', path: '/products' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            Expert Advisors
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Four Expert Advisors. One licence away.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Each one is a different answer to the same question — how much risk you want to take,
            and how often. Pick the one that matches how you trade, and we will set it up against
            your MetaTrader account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Every licence includes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {included.map((i) => (
              <div key={i.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="grid h-10 w-10 place-content-center rounded-lg bg-brand-50 text-brand-700">
                  <i.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{i.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Not sure which one fits?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Tell us your account size, your broker and how much drawdown you are willing to sit
          through. We will tell you which Expert Advisor to start with — and quote you for it.
        </p>
        <Link
          to="/quote"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Request a quotation <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
