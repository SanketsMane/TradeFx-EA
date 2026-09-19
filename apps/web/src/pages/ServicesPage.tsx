import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { services } from '@/lib/catalog';
import { usePageTitle } from '@/lib/usePageTitle';

export default function ServicesPage() {
  usePageTitle('Services');

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            Services
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The work behind the trading
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Our Expert Advisors are the product you can buy off the shelf. Everything else here we
            build to order — for traders, for funds, and for the brokers who serve them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="space-y-6">
          {services.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-brand-200 sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-content-center rounded-xl bg-brand-50 text-brand-700">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900">{s.name}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">{s.summary}</p>
                  <Link
                    to={`/quote?service=${s.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                  >
                    Request a quotation <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <ul className="space-y-2.5 rounded-xl bg-gray-50 p-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
                      <span className="text-sm leading-relaxed text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Something else in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            This list is where most projects start, not where they end. If it touches trading,
            describe it and we will tell you whether we can build it.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
