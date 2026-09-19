import { Link, Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, ChevronRight, Clock } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { guideBySlug, guides } from '@/lib/guides';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export default function GuidePage() {
  const { slug } = useParams();
  const guide = guideBySlug(slug);

  useSeo({
    title: guide?.pageTitle,
    path: `/guides/${slug ?? ''}`,
    description: guide?.metaDescription,
    type: 'article',
    jsonLd: guide
      ? [
          faqSchema(guide.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!guide) return <Navigate to="/guides" replace />;

  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-gray-50">
        <ol className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 py-3 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <li>
            <Link to="/guides" className="text-gray-500 hover:text-gray-900">
              Guides
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          <li aria-current="page" className="truncate font-medium text-gray-900">
            {guide.title}
          </li>
        </ol>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          {`${guide.readingMinutes} minute read`}
        </p>

        <div className="mt-6 space-y-4">
          {guide.intro.map((para) => (
            <p key={para.slice(0, 40)} className="text-lg leading-relaxed text-gray-700">
              {para}
            </p>
          ))}
        </div>

        {guide.sections.map((sec) => (
          <section key={sec.heading} className="mt-11">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{sec.heading}</h2>

            {sec.bullets && (
              <ul className="mt-4 space-y-2.5">
                {sec.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-base leading-relaxed text-gray-700">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {sec.table && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-left">
                    <tr>
                      {sec.table.head.map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sec.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) => (
                          <td
                            key={cell}
                            className={
                              i === 0
                                ? 'px-4 py-3 font-medium text-gray-900'
                                : 'px-4 py-3 text-gray-600'
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sec.body && (
              <div className="mt-4 space-y-4">
                {sec.body.map((para) => (
                  <p key={para.slice(0, 40)} className="text-base leading-relaxed text-gray-700">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* The limitation is stated deliberately — see lib/guides.ts. */}
        <div className="mt-11 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h2 className="font-semibold text-amber-900">{guide.caveat.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">{guide.caveat.body}</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Questions</h2>
          <dl className="mt-5 space-y-4">
            {guide.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <dt className="font-semibold text-gray-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="mt-10 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
          {guide.related.map((r) => (
            <Link
              key={r.path}
              to={r.path}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span>{r.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </nav>
      </article>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
            <BookOpen className="h-5 w-5 text-brand-600" /> More guides
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {others.map((g) => (
              <Link
                key={g.slug}
                to={`/guides/${g.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-gray-900">{g.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{g.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
