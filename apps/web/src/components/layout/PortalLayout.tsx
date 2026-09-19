import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bot,
  Building2,
  ChevronDown,
  FileText,
  Info,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MonitorSmartphone,
  ShoppingBag,
  Wallet,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUser, logout, logoutServer } from '@/lib/api';
import { ToastProvider } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/misc';
import FloatingTelegram from '@/components/marketing/FloatingTelegram';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { SessionsDialog } from '@/components/SessionsDialog';

export function PortalHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

/**
 * Shown whenever a screen is rendering fixture data because the portal API is
 * not reachable. Deliberately loud — nobody should mistake these numbers for
 * their own.
 */
export function PreviewBanner() {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <p className="text-sm text-amber-900">
        <span className="font-semibold">Preview data.</span> The portal API is not running, so
        these figures are samples for laying out the page — not your account.
      </p>
    </div>
  );
}

const nav = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/bots', label: 'My Expert Advisors', icon: Bot },
  { to: '/app/accounts', label: 'Trading Accounts', icon: Wallet },
  { to: '/app/broker', label: 'Open Broker Account', icon: Building2 },
  { to: '/app/quotes', label: 'My Quotations', icon: FileText },
];

function UserMenu() {
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onLogout = async () => {
    await logoutServer();
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100"
      >
        <Avatar name={user?.email ?? '?'} className="h-9 w-9 text-sm" />
        <div className="hidden text-left sm:block">
          <div className="text-sm font-semibold leading-tight text-gray-900">
            {user?.email?.split('@')[0]}
          </div>
          <div className="text-xs leading-tight text-gray-400">Client</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="truncate text-sm font-medium text-gray-800">{user?.email}</div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              setPwOpen(true);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <KeyRound className="h-4 w-4" /> Change password
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setSessionsOpen(true);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <MonitorSmartphone className="h-4 w-4" /> Active sessions
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}

      <ChangePasswordDialog open={pwOpen} onClose={() => setPwOpen(false)} />
      <SessionsDialog open={sessionsOpen} onClose={() => setSessionsOpen(false)} />
    </div>
  );
}

/** Shell for everything under /app — the customer's own area. */
export default function PortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform md:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
            <Link to="/">
              <img src="/logo-dark.webp" alt="TradeFx" className="h-7 w-auto object-contain" />
            </Link>
            <button
              className="text-gray-400 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {item.label}
              </NavLink>
            ))}

            <div className="!mt-6 border-t border-gray-100 pt-4">
              <Link
                to="/products"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                <ShoppingBag className="h-[18px] w-[18px] shrink-0" />
                Browse Expert Advisors
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                <LifeBuoy className="h-[18px] w-[18px] shrink-0" />
                Support
              </Link>
            </div>
          </nav>

          <div className="border-t border-gray-100 p-3">
            <Link
              to="/quote"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Request a quotation
            </Link>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-900/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="flex min-h-screen flex-col md:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-gray-600 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <img src="/logo-dark.webp" alt="TradeFx" className="h-6 w-auto object-contain" />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <UserMenu />
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
            <Outlet />
          </main>

          <footer className="border-t border-gray-100 px-4 py-4 text-center text-xs text-gray-400 sm:px-6">
            TradeFx · Trading involves risk. Only trade with capital you can afford to lose.
          </footer>
        </div>

        <FloatingTelegram />
      </div>
    </ToastProvider>
  );
}
