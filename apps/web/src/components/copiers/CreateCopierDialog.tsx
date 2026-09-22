import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { useAsync } from '@/hooks/useAsync';
import { accountsApi, copierApi } from '@/lib/api';
import { products } from '@/lib/catalog';

export function CreateCopierDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const toast = useToast();
  const { data: accounts } = useAsync(() => accountsApi.list(), [open]);
  const { data: existing } = useAsync(() => copierApi.list(), [open]);
  const [name, setName] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A source can only drive one copier, so exclude accounts already used as a source.
  const available = (accounts ?? []).filter((a) => !a.sourceForConfig);

  // One master per product: a slug already attached elsewhere can't be reused.
  const takenBy = new Map((existing ?? []).flatMap((c) => (c.productSlug ? [[c.productSlug, c.name] as const] : [])));

  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError('Enter a copier name.');
    if (!sourceId) return setError('Select a source account.');
    setLoading(true);
    try {
      await copierApi.create(name.trim(), sourceId, productSlug);
      toast('EA master created', 'success');
      setName('');
      setSourceId('');
      setProductSlug('');
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create copier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create EA Master"
      description="Pick the source account whose trades will be copied to receivers."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={submit} disabled={available.length === 0}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Master name">
          <Input placeholder="e.g. TradeFx Scalper Master" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Source account (master)" hint="The account whose trades are copied.">
          {available.length === 0 ? (
            <p className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-700">
              No available accounts. <Link to="/dashboard/accounts" className="font-medium underline">Add an account</Link> first
              (accounts already used as a source can't be reused).
            </p>
          ) : (
            <Select value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
              <option value="">Select an account…</option>
              {available.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} · {a.platform} · {a.login}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          label="Expert Advisor"
          hint="Customers who own a licence for this EA are attached to this master. Leave unset for an internal master no customer can reach."
        >
          <Select value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
            <option value="">Internal — not linked to a product</option>
            {products.map((p) => {
              const owner = takenBy.get(p.slug);
              return (
                <option key={p.slug} value={p.slug} disabled={Boolean(owner)}>
                  {p.name}
                  {owner ? ` — already served by ${owner}` : ''}
                </option>
              );
            })}
          </Select>
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Dialog>
  );
}
