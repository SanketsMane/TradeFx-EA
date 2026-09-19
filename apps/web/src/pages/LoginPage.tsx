import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '@/components/auth/AuthShell';
import { useSeo } from '@/lib/useSeo';
import AuthTabs, { type AuthMode } from '@/components/auth/AuthTabs';
import PhoneOtpForm from '@/components/auth/PhoneOtpForm';
import { login } from '@/lib/api';

/** Telegram's circular glyph — lucide ships no brand marks. */
export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#2AABEE" />
      <path
        d="M5.6 11.8c3.7-1.6 6.2-2.7 7.4-3.2 3.5-1.5 4.3-1.7 4.8-1.7.1 0 .3 0 .5.2.1.1.1.3.2.4v.5c-.2 1.9-.9 6.4-1.3 8.4-.2.9-.5 1.2-.8 1.2-.7.1-1.2-.4-1.9-.8-1-.7-1.6-1.1-2.6-1.8-1.1-.8-.4-1.2.2-1.9.2-.2 3-2.7 3-2.9 0 0 0-.1-.1-.2h-.2c-.1 0-1.7 1.1-4.8 3.2-.5.3-.9.5-1.2.5-.4 0-1.2-.2-1.7-.4-.7-.2-1.2-.3-1.2-.7s.3-.6.9-.8Z"
        fill="#fff"
      />
    </svg>
  );
}

const FIELD =
  'h-12 w-full rounded-xl bg-[#f4f4f5] px-4 text-[15px] text-[#131316] outline-none transition-shadow placeholder:text-[#9b9ba1] focus:ring-2 focus:ring-brand-500';

export default function LoginPage() {
  const navigate = useNavigate();
  useSeo({ title: 'Sign in', path: '/login', noindex: true });

  const [mode, setMode] = useState<AuthMode>('email');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      // Customers get their own portal; staff keep the admin dashboard.
      navigate(user.role === 'CUSTOMER' ? '/app' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#131316] sm:text-[30px]">
        Log In to TradeFx
      </h1>

      <AuthTabs mode={mode} onChange={setMode} />

      {mode === 'phone' ? (
        <PhoneOtpForm askName={false} />
      ) : (
      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Please enter your email"
          required
          autoComplete="email"
          className={FIELD}
        />

        <div className="relative mt-3">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password 8-16 characters"
            required
            autoComplete="current-password"
            className={`${FIELD} pr-12`}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-[#6b6b70] transition-colors hover:text-[#131316]"
          >
            {isPasswordVisible ? (
              <EyeOff size={18} strokeWidth={1.75} />
            ) : (
              <Eye size={18} strokeWidth={1.75} />
            )}
          </button>
        </div>

        <Link
          to="/forgot-password"
          className="mt-4 inline-block text-[14px] text-[#131316] [text-decoration-color:#bcbcc0] [text-decoration-line:underline] [text-decoration-style:dotted] underline-offset-4"
        >
          Forgot Password?
        </Link>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in…
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>
      )}

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#eaeaec]" />
        <span className="text-[13px] text-[#8a8a8e]">or</span>
        <span className="h-px flex-1 bg-[#eaeaec]" />
      </div>

      {/* Placeholder for a future Telegram auth provider — nothing wired yet. */}
      <button
        type="button"
        aria-disabled="true"
        title="Telegram sign-in is not enabled yet"
        className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl bg-[#f4f4f5] text-[15px] font-semibold text-[#131316] transition-colors hover:bg-[#ebebec]"
      >
        <TelegramIcon className="h-5 w-5" />
        Telegram
      </button>

      <p className="mt-6 text-[14px] text-[#8a8a8e]">
        <span>New user? </span>
        <Link
          to="/register"
          className="font-semibold text-[#131316] underline decoration-[#bcbcc0] underline-offset-4"
        >
          Sign Up
        </Link>
      </p>
    </AuthShell>
  );
}
