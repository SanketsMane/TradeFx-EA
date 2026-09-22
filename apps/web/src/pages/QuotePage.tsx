import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { products, services } from '@/lib/catalog';
import { quotesApi } from '@/lib/api';
import { trackLead } from '@/lib/analytics';
import { useSeo } from '@/lib/useSeo';
import { faqSchema } from '@/lib/seo';

const FIELD =
  'h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

const ACCOUNT_SIZES = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $25,000',
  '$25,000 – $100,000',
  'Over $100,000',
];

/** Answers the questions that stop people submitting the form. */
const FAQS = [
  {
    q: 'Why is there no price list?',
    a: 'Because the right figure depends on which Expert Advisor you want, the size of the account it will run on and how many accounts you are licensing. A single published number would be wrong for most people who read it. An advisor reads your request and replies with a figure for your situation.',
  },
  {
    q: 'How long until I hear back?',
    a: 'Normally within one business day. Requests that arrive over a weekend are answered on Monday.',
  },
  {
    q: 'Am I committing to anything?',
    a: 'No. This is a request for a price, not an order. Nothing is charged, no payment details are taken on this form, and nothing starts trading until you have agreed a price and confirmed a purchase.',
  },
  {
    q: 'What happens after I accept a quote?',
    a: 'We issue a nine-character licence code to your account and email it to you. You connect your MT4 or MT5 account with that code, we verify it, and the Expert Advisor starts trading.',
  },
  {
    q: 'What if I am not sure which Expert Advisor I need?',
    a: 'Say so in the message. Tell us your account size, your broker and how much drawdown you are willing to sit through, and the reply will include a recommendation as well as a price.',
  },
  {
    q: 'Do you quote for development work too?',
    a: 'Yes. Pick the relevant service instead of an Expert Advisor and describe the project. Development quotes usually need a short conversation first, so expect a reply asking a few questions before a number.',
  },
];

export default function QuotePage() {
  useSeo({
    title: 'Request a Quotation',
    path: '/quote',
    description:
      'Tell us which Expert Advisor you want and a little about your account. We price per trading account, so an advisor replies with a figure — usually within one business day.',
    jsonLd: faqSchema(FAQS),
  });
  const [params] = useSearchParams();

  /*
   * Deep links from a product or service card pre-select the subject. The slug
   * is checked against the catalogue first: a stale or mistyped link would
   * otherwise sit in state unseen — the select shows nothing matching it — and
   * the API would reject the submission with a message about a field the
   * visitor never filled in.
   */
  const [productSlug, setProductSlug] = useState(() =>
    products.some((p) => p.slug === params.get('product')) ? params.get('product')! : '',
  );
  const [serviceSlug, setServiceSlug] = useState(() =>
    services.some((s) => s.slug === params.get('service')) ? params.get('service')! : '',
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [broker, setBroker] = useState('');
  const [accountSize, setAccountSize] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productSlug && !serviceSlug) {
      setError('Choose the Expert Advisor or service you would like quoted.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await quotesApi.submit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        productSlug: productSlug || undefined,
        serviceSlug: serviceSlug || undefined,
        broker: broker.trim() || undefined,
        accountSize: accountSize || undefined,
        message: message.trim(),
      });
      setReference(res.reference);
      trackLead({ productSlug: productSlug || undefined, serviceSlug: serviceSlug || undefined });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not send that just now. Please try again in a moment.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <section className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Request received
          </h1>
          <p className="mt-3 text-gray-600">
            <span>Your reference is </span>
            <span className="font-mono font-semibold text-gray-900">{reference}</span>
            <span>
              . An advisor will review it and send you a price by email, normally within one
              business day.
            </span>
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Expert Advisors
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create an account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Request a quotation
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              We price per account rather than from a list, because the right figure depends on
              which Expert Advisor you want, the size of the account and how many you are running.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'An advisor reads every request personally.',
                'You get a price by email, normally within one business day.',
                'No payment details are taken on this form.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <span className="text-sm leading-relaxed text-gray-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <fieldset disabled={submitting} className="space-y-4">
              <div>
                <label htmlFor="q-product" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Expert Advisor
                </label>
                <select
                  id="q-product"
                  value={productSlug}
                  onChange={(e) => {
                    setProductSlug(e.target.value);
                    if (e.target.value) setServiceSlug('');
                  }}
                  className={FIELD}
                >
                  <option value="">Select an Expert Advisor…</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="q-service" className="mb-1.5 block text-sm font-medium text-gray-700">
                  …or a service
                </label>
                <select
                  id="q-service"
                  value={serviceSlug}
                  onChange={(e) => {
                    setServiceSlug(e.target.value);
                    if (e.target.value) setProductSlug('');
                  }}
                  className={FIELD}
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    id="q-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="q-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="q-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="q-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="q-broker" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Your broker <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="q-broker"
                    value={broker}
                    onChange={(e) => setBroker(e.target.value)}
                    placeholder="e.g. Exness, IC Markets"
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="q-size" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Account size <span className="text-gray-400">(optional)</span>
                </label>
                <select
                  id="q-size"
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                  className={FIELD}
                >
                  <option value="">Prefer not to say</option>
                  {ACCOUNT_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="q-message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Anything else we should know?
                </label>
                <textarea
                  id="q-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us how you trade today and what you want the Expert Advisor to do."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </fieldset>

            {error && (
              <div
                role="alert"
                className="mt-4 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                'Send request'
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              We use your details only to answer this enquiry.
            </p>
          </form>
        </div>
      </section>

      {/* Everything below exists because "why no price?" is the objection that
          stops people submitting the form. */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            How our pricing works
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700">
            <p>
              Expert Advisors are licensed per trading account. One licence covers one MetaTrader
              account, and the code is tied to it when you connect.
            </p>
            <p>
              What changes the figure is which Expert Advisor you want, the size of the account it
              will run on, and how many accounts you are licensing at once. That is why there is no
              price list — a single published number would be wrong for most of the people reading
              it, and we would rather quote you honestly than anchor you to a figure that does not
              apply.
            </p>
            <p>
              Nothing on this page takes payment details, and nothing you send here is an order. If
              the figure does not suit you, that is the end of it.
            </p>
          </div>

          <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
            Before you ask
          </h2>
          <dl className="mt-6 space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <dt className="font-semibold text-gray-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-gray-600">
            <span>Not sure which one fits? </span>
            <Link to="/products/compare" className="font-semibold text-brand-700 hover:underline">
              Compare the four Expert Advisors
            </Link>
            <span> or check </span>
            <Link to="/supported-brokers" className="font-semibold text-brand-700 hover:underline">
              whether your broker is supported
            </Link>
            <span>.</span>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
