import { Link } from 'react-router-dom';
import { products, services } from '@/lib/catalog';
import FloatingTelegram from './FloatingTelegram';

/**
 * Public footer. The risk disclosure is not decoration — we market leveraged
 * FX products, so it belongs on every public page.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/logo-dark.webp" alt="TradeFx" className="h-6 w-auto object-contain" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
              Expert Advisors and trading infrastructure for traders who would rather their
              strategy ran itself.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Expert Advisors
            </h3>
            <ul className="mt-3 space-y-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="text-sm text-gray-600 transition-colors hover:text-brand-700"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Services
            </h3>
            <ul className="mt-3 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services#${s.slug}`}
                    className="text-sm text-gray-600 transition-colors hover:text-brand-700"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { to: '/how-it-works', label: 'How it works' },
                { to: '/contact', label: 'Contact' },
                { to: '/quote', label: 'Request a quote' },
                { to: '/login', label: 'Sign in' },
                { to: '/register', label: 'Create an account' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-600 transition-colors hover:text-brand-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-xs leading-relaxed text-gray-500">
            <span className="font-semibold text-gray-600">Risk warning.</span> Trading foreign
            exchange and CFDs on margin carries a high level of risk and can result in the loss of
            more than your deposit. Automated strategies do not remove that risk. Past performance
            is not a reliable indicator of future results. Only trade with capital you can afford
            to lose, and seek independent advice if you are unsure. TradeFx supplies trading
            software and infrastructure; we do not provide investment advice or manage client
            funds.
          </p>
          <p className="mt-4 text-xs text-gray-500">© {year} TradeFx. All rights reserved.</p>
        </div>
      </div>

      <FloatingTelegram />
    </footer>
  );
}
