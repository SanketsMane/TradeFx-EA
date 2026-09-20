import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { otpApi } from '@/lib/api';
import { trackLogin, trackSignUp } from '@/lib/analytics';

const FIELD =
  'h-12 w-full rounded-xl bg-[#f4f4f5] px-4 text-[15px] text-[#131316] outline-none transition-shadow placeholder:text-[#9b9ba1] focus:ring-2 focus:ring-brand-500';

/** Display-only grouping: 98765 43210. */
function pretty(digits: string): string {
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

type Step = 'phone' | 'code';

/**
 * Mobile sign-in by one-time code, shared by the login and sign-up pages.
 *
 * `askName` is what differs between them: the sign-up page collects a name up
 * front, the login page does not. If a number turns out to be new, the API
 * answers PROFILE_REQUIRED and we ask for the name then rather than sending a
 * second code.
 */
export default function PhoneOtpForm({ askName }: { askName: boolean }) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [needsName, setNeedsName] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const codeRef = useRef<HTMLInputElement>(null);

  // Resend countdown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  const sendCode = async (resend = false) => {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const res = await otpApi.request(phone);
      setStep('code');
      setCooldown(res.resendAfterSeconds);
      if (resend) setNotice('A new code is on its way.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send a code just now.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPhone = (e: FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Enter your 10-digit mobile number.');
      return;
    }
    if (askName && !fullName.trim()) {
      setError('Enter your full name.');
      return;
    }
    void sendCode();
  };

  const onSubmitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (code.length !== 6) {
      setError('Enter the 6-digit code we texted you.');
      return;
    }
    if (needsName && !fullName.trim()) {
      setError('Enter your full name to finish creating your account.');
      return;
    }

    setLoading(true);
    try {
      const res = await otpApi.verify(phone, code, fullName.trim() || undefined);
      if (res.status === 'PROFILE_REQUIRED') {
        // Correct code, but this number is new — collect a name and retry.
        setNeedsName(true);
        setNotice('Almost there — tell us your name and we will finish setting up your account.');
        return;
      }
      // `needsName` means this number had no account until a moment ago.
      if (needsName || askName) trackSignUp('phone');
      else trackLogin('phone');

      // A full reload lets the router pick the landing route up from the
      // freshly stored session, the same as password sign-in.
      window.location.assign(res.user.role === 'CUSTOMER' ? '/app' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code did not work.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form className="mt-5" onSubmit={onSubmitPhone}>
        {askName && (
          <>
            <label htmlFor="otp-name" className="sr-only">
              Full name
            </label>
            <input
              id="otp-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className={`${FIELD} mb-3`}
            />
          </>
        )}

        <label htmlFor="otp-phone" className="sr-only">
          Mobile number
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[15px] text-[#6b6b70]">
            +91
          </span>
          <input
            id="otp-phone"
            type="tel"
            inputMode="numeric"
            value={pretty(phone)}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            autoComplete="tel-national"
            className={`${FIELD} pl-14`}
          />
        </div>

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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending code…
            </>
          ) : (
            'Send verification code'
          )}
        </button>

        <p className="mt-3 text-[13px] leading-snug text-[#8a8a8e]">
          We will text you a 6-digit code. Standard message rates may apply.
        </p>
      </form>
    );
  }

  return (
    <form className="mt-5" onSubmit={onSubmitCode}>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#f4f4f5] px-4 py-3">
        <span className="text-[14px] text-[#131316]">
          Code sent to <span className="font-semibold">+91 {pretty(phone)}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setStep('phone');
            setCode('');
            setNeedsName(false);
            setError(null);
            setNotice(null);
          }}
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-700 hover:text-brand-800"
        >
          <Pencil className="h-3.5 w-3.5" /> Change
        </button>
      </div>

      {needsName && (
        <>
          <label htmlFor="otp-name-late" className="sr-only">
            Full name
          </label>
          <input
            id="otp-name-late"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className={`${FIELD} mb-3`}
          />
        </>
      )}

      <label htmlFor="otp-code" className="sr-only">
        Verification code
      </label>
      <input
        ref={codeRef}
        id="otp-code"
        inputMode="numeric"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="6-digit code"
        autoComplete="one-time-code"
        className={`${FIELD} text-center text-[20px] font-semibold tracking-[0.5em]`}
      />

      {notice && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-[14px] text-brand-800"
        >
          {notice}
        </div>
      )}
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
          </>
        ) : (
          'Verify and continue'
        )}
      </button>

      <button
        type="button"
        onClick={() => void sendCode(true)}
        disabled={cooldown > 0 || loading}
        className="mt-4 text-[14px] text-[#131316] underline decoration-[#bcbcc0] underline-offset-4 disabled:cursor-not-allowed disabled:text-[#8a8a8e] disabled:no-underline"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
    </form>
  );
}
