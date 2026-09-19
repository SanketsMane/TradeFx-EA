import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '@/components/auth/AuthShell';
import { useSeo } from '@/lib/useSeo';
import AuthTabs, { type AuthMode } from '@/components/auth/AuthTabs';
import PhoneOtpForm from '@/components/auth/PhoneOtpForm';
import { register } from '@/lib/api';
import { TelegramIcon } from './LoginPage';

/**
 * Customer sign-up. Creates a CUSTOMER account and drops straight into the
 * portal — staff accounts are still provisioned by an admin and cannot be
 * created here.
 */
const FIELD =
  'h-12 w-full rounded-xl bg-[#f4f4f5] px-4 text-[15px] text-[#131316] outline-none transition-shadow placeholder:text-[#9b9ba1] focus:ring-2 focus:ring-brand-500';

export default function RegisterPage() {
  const navigate = useNavigate();
  useSeo({ title: 'Create an account', path: '/register', noindex: true });

  const [mode, setMode] = useState<AuthMode>('email');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8 || password.length > 16) {
      setError('Password must be 8-16 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!accepted) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password });
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#131316] sm:text-[30px]">
        Sign Up to TradeFx
      </h1>

      <AuthTabs mode={mode} onChange={setMode} />

      {mode === 'phone' ? (
        <PhoneOtpForm askName />
      ) : (
      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor="fullName" className="sr-only">
          Full name
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          required
          autoComplete="name"
          className={`${FIELD} mb-3`}
        />

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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password 8-16 characters"
            required
            autoComplete="new-password"
            className={`${FIELD} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-[#6b6b70] transition-colors hover:text-[#131316]"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
          </button>
        </div>

        <div className="relative mt-3">
          <label htmlFor="confirm" className="sr-only">
            Confirm password
          </label>
          <input
            id="confirm"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            className={`${FIELD} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-[#6b6b70] transition-colors hover:text-[#131316]"
          >
            {showConfirm ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-[#6b6b70]">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-px h-4 w-4 shrink-0 accent-brand-600"
          />
          <span>
            I agree to the{' '}
            <span className="text-[#131316] underline decoration-[#bcbcc0] underline-offset-2">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-[#131316] underline decoration-[#bcbcc0] underline-offset-2">
              Privacy Policy
            </span>
          </span>
        </label>

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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating your account…
            </>
          ) : (
            'Sign up'
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
        title="Telegram sign-up is not enabled yet"
        className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl bg-[#f4f4f5] text-[15px] font-semibold text-[#131316] transition-colors hover:bg-[#ebebec]"
      >
        <TelegramIcon className="h-5 w-5" />
        Telegram
      </button>

      <p className="mt-6 text-[14px] text-[#8a8a8e]">
        Already registered?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#131316] underline decoration-[#bcbcc0] underline-offset-4"
        >
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}
