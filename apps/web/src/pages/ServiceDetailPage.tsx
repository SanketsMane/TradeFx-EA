import { Link, Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check, ChevronRight, Send } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { serviceBySlug, services } from '@/lib/catalog';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo';
import { TELEGRAM_URL } from '@/lib/contact';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = serviceBySlug(slug);

  useSeo({
    title: service?.pageTitle,
    path: `/services/${slug ?? ''}`,
    description: service?.metaDescription,
    jsonLd: service
      ? [
          serviceSchema({
            name: service.name,
            slug: service.slug,
            description: service.metaDescription,
          }),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!service) return <Navigate to="/services" replace />;

  const others = services.filter((s) => s.slug !== service.slug);

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
            <Link to="/services" className="text-gray-500 hover:text-gray-900">
              Services
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          <li aria-current="page" className="truncate font-medium text-gray-900">
            {service.name}
          </li>
        </ol>
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="grid h-12 w-12 place-content-center rounded-xl bg-brand-50 text-brand-700">
          <service.icon className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {service.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">{service.summary}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={`/quote?service=${service.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Request a quotation <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Send className="h-4 w-4" /> Ask on Telegram
          </a>
        </div>
      </section>

      {/* ---------------- What it is ---------------- */}
      <section className="mx-auto max-w-4xl px-4 pb-4">
        <div className="space-y-4">
          {service.description.map((para) => (
            <p key={para.slice(0, 40)} className="text-base leading-relaxed text-gray-700">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">How it works</h2>
        <ol className="mt-6 space-y-5">
          {service.process.map((p, i) => (
            <li key={p.step} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-content-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="font-semibold text-gray-900">{p.step}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{p.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Deliverables ---------------- */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">What you get</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3.5"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-content-center rounded-full bg-brand-50 text-brand-700">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                <span className="text-sm leading-relaxed text-gray-700">{d}</span>
              </li>
            ))}
          </ul>

          {/* Stating the limitation is the point — buyers here screen for it. */}
          <div className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">{service.caveat.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
                {service.caveat.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Questions</h2>
        <dl className="mt-6 space-y-4">
          {service.faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
              <dt className="font-semibold text-gray-900">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- Other services ---------------- */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Other services</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-content-center rounded-lg bg-brand-50 text-brand-700">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{s.name}</h3>
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-gray-600">
                  {s.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
