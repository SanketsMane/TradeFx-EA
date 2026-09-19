import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { portalApi, type EaLicense, type Platform } from '@/lib/api';

/** Licence codes are 9 characters, letters and digits, case-insensitive. */
const CODE_RE = /^[A-Z0-9]{9}$/;

const empty = {
  licenseCode: '',
  label: '',
  login: '',
  password: '',
  server: '',
  platform: 'MT5' as Platform,
};

/**
 * Binds one licence to one MetaTrader account. The investor (read-only)
 * password is not enough — the Expert Advisor has to place orders — so we ask
 * for the trading password and say why.
 */
export default function ConnectAccountDialog({
  open,
  onClose,
  onConnected,
  licenses,
  presetCode,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
  licenses: EaLicense[];
  presetCode?: string;
}) {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Arriving from "Connect account" on a specific licence pre-fills the code.
  useEffect(() => {
    if (open) setForm({ ...empty, licenseCode: presetCode ?? '' });
  }, [open, presetCode]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const available = licenses.filter((l) => l.status === 'UNASSIGNED' || l.status === 'ACTIVE');

  const submit = async () => {
    setError(null);
    const code = form.licenseCode.toUpperCase().replace(/[\s-]/g, '');

    if (!CODE_RE.test(code)) {
      setError('A licence code is 9 characters — letters and numbers, no spaces.');
      return;
    }
    if (!form.label || !form.login || !form.password || !form.server) {
      setError('Fill in every field so we can reach your account.');
      return;
    }

    setLoading(true);
    try {
      await portalApi.linkAccount({ ...form, licenseCode: code });
      toast('Account connected — your Expert Advisor is starting up', 'success');
      onConnected();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not connect that account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Connect a trading account"
      description="Link your MT4 or MT5 account to an Expert Advisor you own."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={submit}>
            Connect account
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Licence code"
          htmlFor="licenseCode"
          hint="Nine characters, from My Expert Advisors."
        >
          {available.length > 0 ? (
            <Select
              id="licenseCode"
              value={form.licenseCode}
              onChange={(e) => set('licenseCode')(e.target.value)}
            >
              <option value="">Select a licence…</option>
              {available.map((l) => (
                <option key={l.id} value={l.code}>
                  {l.productName} — {l.code}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              id="licenseCode"
              value={form.licenseCode}
              onChange={(e) => set('licenseCode')(e.target.value.toUpperCase())}
              placeholder="K7M4XQ2R9"
              maxLength={11}
              autoCapitalize="characters"
              spellCheck={false}
              className="font-mono tracking-[0.12em]"
            />
          )}
        </Field>

        <Field label="Account name" htmlFor="label" hint="Just for you — e.g. “Exness Live”.">
          <Input
            id="label"
            value={form.label}
            onChange={(e) => set('label')(e.target.value)}
            placeholder="Exness Live"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Platform" htmlFor="platform">
            <Select
              id="platform"
              value={form.platform}
              onChange={(e) => set('platform')(e.target.value)}
            >
              <option value="MT5">MetaTrader 5</option>
              <option value="MT4">MetaTrader 4</option>
            </Select>
          </Field>

          <Field label="Account number" htmlFor="login">
            <Input
              id="login"
              value={form.login}
              onChange={(e) => set('login')(e.target.value)}
              placeholder="41288903"
              inputMode="numeric"
            />
          </Field>
        </div>

        <Field label="Server" htmlFor="server" hint="Exactly as it appears in your terminal.">
          <Input
            id="server"
            value={form.server}
            onChange={(e) => set('server')(e.target.value)}
            placeholder="Exness-MT5Real8"
            spellCheck={false}
          />
        </Field>

        <Field label="Trading password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => set('password')(e.target.value)}
            autoComplete="off"
          />
        </Field>

        <div className="flex gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p className="text-xs leading-relaxed text-blue-900">
            The Expert Advisor needs to place orders, so the investor password will not work here.
            Your password is encrypted before it is stored and is never shown again — not to you,
            and not to our staff. You can disconnect the account at any time.
          </p>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </Dialog>
  );
}
