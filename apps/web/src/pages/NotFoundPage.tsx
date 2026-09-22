import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { isAuthenticated } from '@/lib/api';
import { useSeo } from '@/lib/useSeo';

export default function NotFoundPage() {
  useSeo({
    title: 'Page not found',
    path: '/404',
    description: 'That page could not be found.',
    noindex: true,
  });

  /*
   * Resolved after mount, not during render. This page is prerendered to
   * 404.html as a logged-out visitor, so reading the token while rendering
   * would make a signed-in user's markup disagree with the served HTML and
   * force React to throw away the hydrated tree.
   */
  const [authed, setAuthed] = useState(false);
  useEffect(() => setAuthed(isAuthenticated()), []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-5xl font-bold tracking-tight text-gray-900">404</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        We couldn&rsquo;t find that page. It may have been moved, or the link is incorrect.
      </p>

      <Link
        to={authed ? '/dashboard' : '/'}
        className="mt-6 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        {authed ? 'Back to dashboard' : 'Back to home'}
      </Link>

      {/* Somewhere to go beats a dead end, and it gives the page a reason to exist. */}
      <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {[
          { to: '/products', label: 'Expert Advisors' },
          { to: '/products/compare', label: 'Compare' },
          { to: '/guides', label: 'Guides' },
          { to: '/services', label: 'Services' },
          { to: '/contact', label: 'Contact' },
        ].map((l) => (
          <Link key={l.to} to={l.to} className="text-brand-700 hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
