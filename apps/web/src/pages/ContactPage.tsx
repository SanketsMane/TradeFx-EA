import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Mail, MessageCircle, Send } from 'lucide-react';
import SiteHeader from '@/components/marketing/SiteHeader';
import SiteFooter from '@/components/marketing/SiteFooter';
import { useSeo } from '@/lib/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { TELEGRAM_URL } from '@/lib/contact';

/**
 * Contact details are placeholders until the real ones are supplied — they are
 * gathered here so there is one place to change them.
 */
const CONTACT = {
  email: 'support@tradefx.com',
  telegram: TELEGRAM_URL,
  hours: 'Monday to Friday, 09:00–18:00 GMT',
};

const channels = [
  {
    icon: Mail,
    title: 'Email',
    body: 'For quotes, licences and account questions.',
    action: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: Send,
    title: 'Telegram',
    body: 'The quickest way to reach us during market hours.',
    action: 'Message us on Telegram',
    href: CONTACT.telegram,
  },
  {
    icon: MessageCircle,
    title: 'Existing customer?',
    body: 'Raise it from inside your dashboard and we will have your account details to hand.',
    action: 'Go to my dashboard',
    href: '/app',
  },
];

export default function ContactPage() {
  useSeo({
    title: 'Contact TradeFx',
    path: '/contact',
    description:
      'Questions about which Expert Advisor suits your account, whether your broker is supported, or a project you want built. Reach TradeFx by email or Telegram.',
    jsonLd: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  });

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Talk to us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Questions about which Expert Advisor suits your account, whether your broker is
            supported, or a project you want built — all of it goes to the same people.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 ring-1 ring-gray-200">
            <Clock className="h-4 w-4 text-brand-600" />
            {CONTACT.hours}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {channels.map((c) => {
            const internal = c.href.startsWith('/');
            const inner = (
              <>
                <div className="grid h-11 w-11 place-content-center rounded-xl bg-brand-50 text-brand-700">
                  <c.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold text-gray-900">{c.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  {c.action} <ArrowRight className="h-4 w-4" />
                </span>
              </>
            );
            const className =
              'flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md';
            return internal ? (
              <Link key={c.title} to={c.href} className={className}>
                {inner}
              </Link>
            ) : (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className={className}
              >
                {inner}
              </a>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
          <h2 className="text-xl font-bold text-brand-900">
            After a price rather than a conversation?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-brand-900/80">
            The quote form asks the handful of questions we would otherwise ask you by email, so
            the first reply you get already has a figure in it.
          </p>
          <Link
            to="/quote"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Request a quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
