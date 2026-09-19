import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Gauge,
  KeyRound,
  Link2,
  LineChart,
  MonitorOff,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import ProductCard from '@/components/marketing/ProductCard';
import { products, services } from '@/lib/catalog';
import { useSeo } from '@/lib/useSeo';
import { organizationSchema, websiteSchema, itemListSchema } from '@/lib/seo';

const steps = [
  { icon: KeyRound, title: 'Choose and get quoted', desc: 'Pick an Expert Advisor, request a quotation and we come back with a price.' },
  { icon: Link2, title: 'Link your account', desc: 'Enter your licence code and your MT4 or MT5 details. We handle the rest.' },
  { icon: LineChart, title: 'Follow the results', desc: 'Daily return, running P&L and every trade, in one dashboard.' },
];

const assurances = [
  { icon: Wallet, title: 'Your funds stay yours', desc: 'Money never leaves your own broker account. We place trades; we do not hold capital.' },
  { icon: MonitorOff, title: 'Nothing to install', desc: 'The Expert Advisor runs on our infrastructure. No VPS, no terminal left running overnight.' },
  { icon: ShieldCheck, title: 'Risk limits built in', desc: 'Stops, exposure ceilings and a daily loss limit are enforced by the bot, not by willpower.' },
  { icon: Building2, title: 'Use any MT4/MT5 broker', desc: 'Keep the broker you have, or open one through us in a few minutes.' },
];

export default function LandingPage() {
  useSeo({
    path: '/',
    description:
      'Four Expert Advisors for MetaTrader — scalping, multi-asset, long-term and hedged. Link your own MT4 or MT5 broker account, enter a licence code, and let the bot trade.',
    jsonLd: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(products.map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
    ],
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-brand-50/60 via-gray-50 to-white" />

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
                <Gauge className="h-3.5 w-3.5" />
                Forex Expert Advisors
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              <span>Your strategy, </span>
              <span className="bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent">
                running without you
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Four Expert Advisors for MetaTrader — scalping, multi-asset, long-term and hedged.
              Link your own broker account, enter a licence code, and let the bot trade while you
              get on with your day.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                Explore Expert Advisors <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                See how it works
              </Link>
            </div>
          </div>

          {/* Product line-up, fanned out */}
          <div className="reveal mt-14 flex items-end justify-center gap-2 sm:gap-6" style={{ "--reveal-delay": "360ms" } as CSSProperties}>
            {products.map((p, i) => (
              <div
                key={p.slug}
                className="relative transition-transform duration-300 ease-out hover:-translate-y-2.5"
                style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
              >
                <Link to={`/products/${p.slug}`} aria-label={p.name}>
                  <img
                    src={p.cardImage}
                    srcSet={`${p.smallImage} 240w, ${p.cardImage} 440w`}
                    sizes="(max-width: 639px) 90px, (max-width: 1023px) 140px, 175px"
                    alt={`${p.name} Expert Advisor`}
                    width={p.cardSize.w}
                    height={p.cardSize.h}
                    /* The hero line-up is the LCP candidate above the fold. */
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    className="h-32 w-auto object-contain drop-shadow-xl sm:h-48 lg:h-60"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Products ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The range</h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Same infrastructure underneath, four different appetites for risk.
            </p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
            Compare all four <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Trading in three steps
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-gray-200 bg-white p-6">
                <span className="absolute right-5 top-5 text-3xl font-bold text-gray-100">
                  {i + 1}
                </span>
                <div className="grid h-11 w-11 place-content-center rounded-xl bg-brand-50 text-brand-700">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              Read the detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Assurances ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why traders pick us</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map((a) => (
            <div key={a.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="grid h-11 w-11 place-content-center rounded-xl bg-gray-900 text-white">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="border-t border-gray-100 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Services
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                We build the rest of it too
              </h2>
              <p className="mt-2 max-w-xl text-gray-400">
                Expert Advisors are what we sell off the shelf. Everything here we build to order.
              </p>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-500/50 hover:bg-white/10"
              >
                <div className="grid h-11 w-11 place-content-center rounded-xl bg-brand-600/20 text-brand-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{s.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start with a quotation
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Tell us which Expert Advisor interests you and a little about your account. An advisor
          reads it and sends you a price — usually the next business day.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
            Request a quotation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Create an account
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
