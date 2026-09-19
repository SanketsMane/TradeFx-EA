import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Ban, CheckCircle2, KeyRound, LogOut, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/DashboardLayout';
import { Card, ErrorState, LoadingBlock, StatusBadge } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input } from '@/components/ui/form';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/ui/toast';
import { useAsync } from '@/hooks/useAsync';
import { getUser, usersApi } from '@/lib/api';
import { formatLicenseCode } from '@/lib/portalData';
import { cn } from '@/lib/utils';

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {count !== undefined && <span className="text-xs text-gray-500">{count}</span>}
      </div>
      {children}
    </Card>
  );
}

export default function UserDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const me = getUser();
  const isSuper = me?.role === 'SUPER_ADMIN';

  const { data: user, loading, error, reload } = useAsync(() => usersApi.get(id), [id]);

  const [busy, setBusy] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [reason, setReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading) return <LoadingBlock label="Loading user…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!user) return null;

  const isSelf = me?.id === user.id;
  const disabled = user.status === 'DISABLED';
  const canAct = isSuper && !isSelf;

  const run = async (fn: () => Promise<unknown>, ok: string, done?: () => void) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
      toast(ok, 'success');
      done ? done() : reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Action failed';
      setActionError(msg);
      toast(msg, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link
        to="/dashboard/users"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> All users
      </Link>

      <PageHeader
        title={user.fullName ?? user.email}
        subtitle={`${user.role === 'CUSTOMER' ? 'Customer' : user.role === 'ADMIN' ? 'Admin' : 'Super Admin'} · joined ${when(user.createdAt)}`}
        actions={
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
              disabled ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', disabled ? 'bg-red-500' : 'bg-emerald-500')} />
            {disabled ? 'Disabled' : 'Active'}
          </span>
        }
      />

      {actionError && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Section title="Profile">
            <dl className="divide-y divide-gray-100">
              {[
                ['Email', user.email],
                ['Full name', user.fullName ?? '—'],
                ['Mobile', user.phone ? `+91 ${user.phone}` : '—'],
                ['User ID', user.id],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 px-5 py-3">
                  <dt className="w-32 shrink-0 text-sm text-gray-500">{k}</dt>
                  <dd className="break-all text-sm font-medium text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Expert Advisor licences" count={user.licenses.length}>
            {user.licenses.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">No licences issued to this user.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {user.licenses.map((l) => (
                    <tr key={l.id}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{l.productName}</div>
                        <div className="font-mono text-xs text-gray-500">{formatLicenseCode(l.code)}</div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {l.linkedAccount
                          ? `${l.linkedAccount.label} (${l.linkedAccount.login})`
                          : 'Not connected'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          <Section title="Trading accounts" count={user.ownedAccounts.length}>
            {user.ownedAccounts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">No trading accounts connected.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {user.ownedAccounts.map((a) => (
                    <tr key={a.id}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{a.label}</div>
                        <div className="text-xs text-gray-500">
                          {a.platform} · {a.login} · {a.server}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/dashboard/accounts/${a.id}`}
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          <Section title="Quotation requests" count={user.quoteRequests.length}>
            {user.quoteRequests.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">No quotation requests.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {user.quoteRequests.map((qr) => (
                    <tr key={qr.id}>
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">{qr.reference}</td>
                      <td className="px-5 py-3 text-gray-900">
                        {qr.productSlug ?? qr.serviceSlug ?? 'General'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={qr.status} />
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{when(qr.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>
        </div>

        {/* ---------------- Actions ---------------- */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-800">Actions</h2>

            {!isSuper && (
              <p className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-600">
                Only a super admin can act on an account.
              </p>
            )}
            {isSelf && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                This is your own account. Ask another super admin to act on it.
              </p>
            )}

            <div className="mt-4 space-y-2.5">
              <Button
                variant={disabled ? 'primary' : 'danger'}
                className="w-full justify-start"
                disabled={!canAct || busy}
                onClick={() => setConfirmStatus(true)}
              >
                {disabled ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                {disabled ? 'Re-enable account' : 'Disable account'}
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                disabled={!canAct || busy}
                onClick={() => {
                  setNewPassword('');
                  setPwOpen(true);
                }}
              >
                <KeyRound className="h-4 w-4" /> Set a new password
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                disabled={!canAct || busy}
                onClick={() => setConfirmRevoke(true)}
              >
                <LogOut className="h-4 w-4" /> Sign out everywhere
                {user.sessions.length > 0 && (
                  <span className="ml-auto text-xs text-gray-400">{user.sessions.length} active</span>
                )}
              </Button>

              <Button
                variant="danger"
                className="w-full justify-start"
                disabled={!canAct || busy}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete permanently
              </Button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Disabling stops sign-in, ends every session and pauses this customer&apos;s running
              Expert Advisors. Re-enabling restores sign-in only — restarting a bot is a separate,
              deliberate step.
            </p>
          </Card>

          <Section title="Active sessions" count={user.sessions.length}>
            {user.sessions.length === 0 ? (
              <p className="px-5 py-5 text-sm text-gray-500">Not signed in anywhere.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {user.sessions.map((s) => (
                  <li key={s.id} className="px-5 py-3">
                    <div className="truncate text-xs text-gray-700">{s.userAgent ?? 'Unknown device'}</div>
                    <div className="text-xs text-gray-400">
                      {s.ip ?? 'no IP'} · last used {when(s.lastUsedAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>

      {/* ---------------- Dialogs ---------------- */}
      <ConfirmDialog
        open={confirmStatus}
        onClose={() => setConfirmStatus(false)}
        loading={busy}
        danger={!disabled}
        confirmLabel={disabled ? 'Re-enable' : 'Disable account'}
        title={disabled ? 'Re-enable this account?' : 'Disable this account?'}
        message={
          disabled ? (
            <>
              <strong>{user.email}</strong> will be able to sign in again. Their Expert Advisors stay
              paused until you resume them.
            </>
          ) : (
            <>
              <strong>{user.email}</strong> will be signed out everywhere and blocked from signing in.
              {user.ownedAccounts.length > 0 && (
                <>
                  {' '}
                  Their <strong>{user.ownedAccounts.length}</strong> connected trading account
                  {user.ownedAccounts.length === 1 ? '' : 's'} will stop taking new trades.
                </>
              )}
            </>
          )
        }
        onConfirm={() =>
          run(
            () => usersApi.setStatus(user.id, disabled ? 'ACTIVE' : 'DISABLED', reason || undefined),
            disabled ? 'Account re-enabled' : 'Account disabled',
            () => {
              setConfirmStatus(false);
              setReason('');
              reload();
            },
          )
        }
      />

      <ConfirmDialog
        open={confirmRevoke}
        onClose={() => setConfirmRevoke(false)}
        loading={busy}
        confirmLabel="Sign out everywhere"
        title="Sign this user out?"
        message={
          <>
            Ends all {user.sessions.length} active session{user.sessions.length === 1 ? '' : 's'} for{' '}
            <strong>{user.email}</strong>. Their password is unchanged and they can sign back in.
          </>
        }
        onConfirm={() =>
          run(() => usersApi.revokeSessions(user.id), 'Sessions revoked', () => {
            setConfirmRevoke(false);
            reload();
          })
        }
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        loading={busy}
        danger
        confirmLabel="Delete permanently"
        title="Delete this account?"
        message={
          <>
            This permanently removes <strong>{user.email}</strong> along with their licences and
            quotation history. It cannot be undone.
            {user.ownedAccounts.length > 0 && (
              <>
                {' '}
                They still have <strong>{user.ownedAccounts.length}</strong> connected trading
                account{user.ownedAccounts.length === 1 ? '' : 's'} — disconnect those first, or the
                delete will be refused.
              </>
            )}
          </>
        }
        onConfirm={() =>
          run(() => usersApi.remove(user.id), 'Account deleted', () => {
            setConfirmDelete(false);
            navigate('/dashboard/users');
          })
        }
      />

      <Dialog
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Set a new password"
        description="The user is signed out everywhere and emailed the new password."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPwOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button
              loading={busy}
              disabled={newPassword.length < 8}
              onClick={() =>
                run(() => usersApi.resetPassword(user.id, newPassword), 'Password updated', () => {
                  setPwOpen(false);
                  setNewPassword('');
                  reload();
                })
              }
            >
              Set password
            </Button>
          </>
        }
      >
        <Field label="New password" htmlFor="new-pw" hint="At least 8 characters.">
          <Input
            id="new-pw"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="off"
            placeholder="Enter a strong password"
          />
        </Field>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">
          This password is sent to the user by email in plain text. Tell them to change it after
          signing in.
        </p>
      </Dialog>
    </>
  );
}
