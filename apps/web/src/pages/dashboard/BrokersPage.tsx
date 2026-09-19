import { useState } from 'react';
import { Building2, ExternalLink, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/DashboardLayout';
import { Card, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Switch } from '@/components/ui/form';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/ui/toast';
import { useAsync } from '@/hooks/useAsync';
import { adminBrokersApi, getUser, type AdminBroker } from '@/lib/api';
import { cn } from '@/lib/utils';

const EMPTY = {
  name: '',
  blurb: '',
  signupUrl: '',
  highlights: '',
  sortOrder: 0,
  published: true,
};

export default function BrokersPage() {
  const toast = useToast();
  const isSuper = getUser()?.role === 'SUPER_ADMIN';
  const { data, loading, error, reload } = useAsync(() => adminBrokersApi.list(), []);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBroker | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminBroker | null>(null);

  const startNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setErr(null);
    setOpen(true);
  };

  const startEdit = (b: AdminBroker) => {
    setEditing(b);
    setForm({
      name: b.name,
      blurb: b.blurb,
      signupUrl: b.signupUrl,
      highlights: b.highlights.join('\n'),
      sortOrder: b.sortOrder,
      published: b.published,
    });
    setErr(null);
    setOpen(true);
  };

  const save = async () => {
    setErr(null);
    if (!form.name.trim() || !form.blurb.trim() || !form.signupUrl.trim()) {
      setErr('Name, description and the affiliate link are all required.');
      return;
    }
    if (!/^https?:\/\//i.test(form.signupUrl.trim())) {
      setErr('The affiliate link must start with http:// or https://.');
      return;
    }
    setBusy(true);
    try {
      const body = {
        name: form.name.trim(),
        blurb: form.blurb.trim(),
        signupUrl: form.signupUrl.trim(),
        highlights: form.highlights
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        sortOrder: Number(form.sortOrder) || 0,
        published: form.published,
      };
      if (editing) await adminBrokersApi.update(editing.id, body);
      else await adminBrokersApi.create(body);
      toast(editing ? 'Broker updated' : 'Broker added', 'success');
      setOpen(false);
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Partner brokers"
        subtitle="Shown on the customer portal's “Open a broker account” page."
        actions={
          isSuper && (
            <Button onClick={startNew}>
              <Plus className="h-4 w-4" /> Add broker
            </Button>
          )
        }
      />

      {loading ? (
        <LoadingBlock label="Loading brokers…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<Building2 className="h-10 w-10" />}
          title="No partner brokers"
          description="Until one is added and published, the portal's broker page shows nothing to customers."
          action={isSuper ? <Button onClick={startNew}>Add broker</Button> : undefined}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-semibold text-gray-900">{b.name}</h2>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        b.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
                      )}
                    >
                      {b.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{b.blurb}</p>
                </div>
              </div>

              {b.highlights.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {b.highlights.map((h) => (
                    <li key={h} className="text-xs text-gray-600">
                      · {h}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href={b.signupUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 break-all text-xs text-brand-700 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {b.signupUrl}
              </a>

              {isSuper && (
                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                  <Button variant="secondary" size="sm" onClick={() => startEdit(b)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setToDelete(b)}>
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit broker' : 'Add a partner broker'}
        description="Customers open accounts through this link, so check it carefully."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button loading={busy} onClick={save}>
              {editing ? 'Save changes' : 'Add broker'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name" htmlFor="b-name">
            <Input
              id="b-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Partner Broker"
            />
          </Field>

          <Field label="Description" htmlFor="b-blurb">
            <textarea
              id="b-blurb"
              rows={3}
              value={form.blurb}
              onChange={(e) => setForm({ ...form, blurb: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </Field>

          <Field
            label="Affiliate sign-up link"
            htmlFor="b-url"
            hint="Include your referral parameters. Must be a full https:// URL."
          >
            <Input
              id="b-url"
              value={form.signupUrl}
              onChange={(e) => setForm({ ...form, signupUrl: e.target.value })}
              placeholder="https://broker.example/signup?ref=tradefx"
              spellCheck={false}
            />
          </Field>

          <Field label="Highlights" htmlFor="b-high" hint="One per line, up to eight.">
            <textarea
              id="b-high"
              rows={4}
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder={'MT4 and MT5, hedging enabled\nAccounts usually approved same day'}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </Field>

          <div className="flex items-center justify-between gap-4">
            <Field label="Sort order" htmlFor="b-sort">
              <Input
                id="b-sort"
                type="number"
                value={String(form.sortOrder)}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </Field>
            <div className="pt-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.published}
                  onChange={(v) => setForm({ ...form, published: v })}
                />
                <span className="text-sm text-gray-700">
                  {form.published ? 'Visible to customers' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>

          {err && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {err}
            </div>
          )}
        </div>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        danger
        confirmLabel="Delete broker"
        title="Delete this broker?"
        message={
          <>
            <strong>{toDelete?.name}</strong> will be removed from the customer portal. Anyone who
            already opened an account through the link keeps it — this only stops new referrals.
          </>
        }
        onConfirm={async () => {
          if (!toDelete) return;
          try {
            await adminBrokersApi.remove(toDelete.id);
            toast('Broker deleted', 'success');
          } catch (e) {
            toast(e instanceof Error ? e.message : 'Delete failed', 'error');
          } finally {
            setToDelete(null);
            reload();
          }
        }}
      />
    </>
  );
}
