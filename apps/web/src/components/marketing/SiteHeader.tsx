import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isAuthenticated } from '@/lib/api';

const links = [
  { to: '/products', label: 'Expert Advisors' },
  { to: '/products/compare', label: 'Compare' },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/contact', label: 'Contact' },
];

/** Sticky nav shared by every public marketing page. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const signedIn = isAuthenticated();

  // Route change closes the drawer — otherwise it hangs open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="shrink-0">
          <img src="/logo-dark.webp" alt="TradeFx" className="h-7 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-brand-700' : 'text-gray-600 hover:text-gray-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to={signedIn ? '/app' : '/login'}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            {signedIn ? 'My dashboard' : 'Sign in'}
          </Link>
          <Link
            to="/quote"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="grid h-10 w-10 place-content-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 grid gap-2 border-t border-gray-100 pt-3">
              <Link
                to={signedIn ? '/app' : '/login'}
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm font-medium text-gray-700"
              >
                {signedIn ? 'My dashboard' : 'Sign in'}
              </Link>
              <Link
                to="/quote"
                className="rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Request a quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
