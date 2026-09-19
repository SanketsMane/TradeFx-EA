import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { guides } from '@/lib/guides';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';

export default function GuidesPage() {
  useSeo({
    title: 'Guides to Automated Forex Trading',
    path: '/guides',
    description:
      'Practical guides on running Expert Advisors — connecting an MT5 account, what gold scalping actually requires, how hedging works, and whether you need a VPS.',
    jsonLd: [
      itemListSchema(guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Guides', path: '/guides' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Guides</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            How automated trading actually works, including the parts that are inconvenient to
            mention. Written for people deciding whether to buy, not only for people who already
            have.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-5">
          {guides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-700">
                {g.title}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-gray-600">{g.blurb}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {`${g.readingMinutes} minute read`}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  <span>Read</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
