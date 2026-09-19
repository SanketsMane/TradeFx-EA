import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/DashboardLayout';
import { Card, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Select } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { useAsync } from '@/hooks/useAsync';
import { adminLicensesApi, usersApi, type LicenseStatus } from '@/lib/api';
import { products } from '@/lib/catalog';
import { formatLicenseCode } from '@/lib/portalData';
import { cn } from '@/lib/utils';

const STATUS: Record<LicenseStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  UNASSIGNED: { label: 'Not connected', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  SUSPENDED: { label: 'Suspended', className: 'bg-gray-100 text-gray-600 ring-gray-200' },
  EXPIRED: { label: 'Expired', className: 'bg-gray-100 text-gray-600 ring-gray-200' },
  REVOKED: { label: 'Revoked', className: 'bg-red-50 text-red-700 ring-red-200' },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function LicensesPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => adminLicensesApi.list(), []);
  const customers = useAsync(() => usersApi.list({ role: 'CUSTOMER', limit: 200 }), []);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const issue = async () => {
    setErr(null);
    if (!userId || !productSlug) {
      setErr('Choose a customer and an Expert Advisor.');
      return;
    }
    setBusy(true);
    try {
      const lic = await adminLicensesApi.issue({
        userId,
        productSlug,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
      toast(`Licence ${formatLicenseCode(lic.code)} issued and emailed`, 'success');
      setOpen(false);
      setUserId('');
      setProductSlug('');
      setExpiresAt('');
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not issue the licence.');
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (id: string, status: LicenseStatus) => {
    try {
      await adminLicensesApi.update(id, { status });
      toast(`Licence ${status.toLowerCase()}`, 'success');
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Update failed', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Licences"
        subtitle="Expert Advisor entitlements. Issuing one emails the code to the customer."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Issue licence
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock label="Loading licences…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<KeyRound className="h-10 w-10" />}
          title="No licences issued"
          description="Issue one once a customer's purchase is confirmed — the code is emailed to them straight away."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Issue licence
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left">
                <tr>
                  {['Code', 'Expert Advisor', 'Customer', 'Status', 'Connected to', 'Issued', ''].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.map((l) => {
                  const s = STATUS[l.status];
                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-gray-900">
                        {formatLicenseCode(l.code)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-900">{l.productName}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/dashboard/users/${l.user.id}`}
                          className="text-brand-700 hover:underline"
                        >
                          {l.user.fullName ?? l.user.email}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', s.className)}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {l.linkedAccount
                          ? `${l.linkedAccount.label} (${l.linkedAccount.login})`
                          : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">{date(l.issuedAt)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {l.status === 'REVOKED' ? (
                          <span className="text-xs text-gray-400">Revoked</span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {l.status === 'SUSPENDED' ? (
                              <button
                                onClick={() => setStatus(l.id, l.linkedAccount ? 'ACTIVE' : 'UNASSIGNED')}
                                className="text-xs font-semibold text-brand-700 hover:underline"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => setStatus(l.id, 'SUSPENDED')}
                                className="text-xs font-semibold text-gray-600 hover:underline"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => setStatus(l.id, 'REVOKED')}
                              className="text-xs font-semibold text-red-600 hover:underline"
                            >
                              Revoke
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Issue a licence"
        description="The code is generated, stored and emailed to the customer immediately."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button loading={busy} onClick={issue}>
              Issue and email
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Customer" htmlFor="lic-user">
            <Select id="lic-user" value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select a customer…</option>
              {customers.data?.items.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName ? `${u.fullName} — ${u.email}` : u.email}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Expert Advisor" htmlFor="lic-product">
            <Select id="lic-product" value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
              <option value="">Select an Expert Advisor…</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Expires" htmlFor="lic-expiry" hint="Leave blank for a perpetual licence.">
            <Input
              id="lic-expiry"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </Field>

          {err && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {err}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
