import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  FileText,
  KeyRound,
  LineChart,
  Link2,
  UserPlus,
} from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    body: 'Register with your email. That gets you the dashboard, where everything below happens.',
  },
  {
    icon: FileText,
    title: 'Request a quotation',
    body: 'Pick the Expert Advisor you want and send us your account size and broker. We quote per account, so the figure comes back from an advisor rather than a price list.',
  },
  {
    icon: Building2,
    title: 'Open a broker account',
    body: 'Already trading? Use the account you have. If not, open one through the link in your dashboard — it takes a few minutes and we can support it directly.',
  },
  {
    icon: KeyRound,
    title: 'Get your licence code',
    body: 'Once your purchase is confirmed we issue a nine-character licence code, one per trading account. It appears in your dashboard and you can copy it from there.',
  },
  {
    icon: Link2,
    title: 'Link your MT4 or MT5 account',
    body: 'Enter your licence code along with your MetaTrader login and server. We verify the account, attach the Expert Advisor and it starts trading.',
  },
  {
    icon: LineChart,
    title: 'Watch it work',
    body: 'Your dashboard shows the active Expert Advisor, daily return, running profit and loss, and a full statement of every trade it has placed.',
  },
];

const faqs = [
  {
    q: 'Do I need to leave my computer on?',
    a: 'No. The Expert Advisor runs on our infrastructure, not in a terminal on your desk. Your machine can be off and it keeps trading.',
  },
  {
    q: 'Can I use my existing broker?',
    a: 'Usually, yes — anything offering MT4 or MT5 will work. TradeFx Heddge is the one exception: it needs a hedging-enabled account, which some brokers do not offer. Send us your broker when you request a quote and we will confirm.',
  },
  {
    q: 'What exactly is a licence code?',
    a: 'A nine-character code, letters and numbers, issued per trading account. It is what ties your MetaTrader account to the Expert Advisor you bought. One code, one account.',
  },
  {
    q: 'Can I run more than one Expert Advisor?',
    a: 'Yes, though we would normally put each on its own account so the results stay readable. Each one needs its own licence.',
  },
  {
    q: 'Do you take my money or trade on my behalf?',
    a: 'Neither. Your funds stay with your broker in your own account, in your name. We supply the software that places the trades. You can withdraw or stop at any time.',
  },
  {
    q: 'Why is there no price on the site?',
    a: 'Because the right figure depends on the Expert Advisor, your account size and how many accounts you are running. Request a quote and an advisor sends you a number.',
  },
];

export default function HowItWorksPage() {
  useSeo({
    title: 'How TradeFx Expert Advisors Work',
    path: '/how-it-works',
    description:
      'From sign-up to your first automated trade in six steps. Keep your own broker account and funds; TradeFx supplies the Expert Advisor and runs it — no VPS to maintain.',
    jsonLd: [
      faqSchema(faqs),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'How it works', path: '/how-it-works' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            How it works
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            From sign-up to your first automated trade
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Six steps. You keep your own broker account and your own funds throughout — we supply
            the Expert Advisor and the infrastructure it runs on.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <ol className="relative space-y-8 before:absolute before:left-6 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-gray-200 sm:before:left-7">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 sm:gap-6">
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-content-center rounded-full border border-gray-200 bg-white text-brand-700 shadow-sm sm:h-14 sm:w-14">
                <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="pt-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {`Step ${i + 1}`}
                </span>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{s.title}</h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Questions we get asked
          </h2>
          <dl className="mt-8 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <dt className="font-semibold text-gray-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Create an account to see the dashboard, or send us a quote request and we will come back
          with a figure and a recommendation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Create an account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Request a quotation
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
