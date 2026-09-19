import { useState } from 'react';
import { FileText, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/layout/DashboardLayout';
import { Card, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field, Select } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { useAsync } from '@/hooks/useAsync';
import { adminQuotesApi, type AdminQuoteRequest, type QuoteStatus } from '@/lib/api';
import { productBySlug, serviceBySlug } from '@/lib/catalog';
import { cn } from '@/lib/utils';

const STATUS: Record<QuoteStatus, { label: string; className: string }> = {
  NEW: { label: 'New', className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  IN_REVIEW: { label: 'In review', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  QUOTED: { label: 'Quoted', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  ACCEPTED: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  DECLINED: { label: 'Declined', className: 'bg-gray-100 text-gray-600 ring-gray-200' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-600 ring-gray-200' },
};

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

function subjectOf(q: AdminQuoteRequest): string {
  return (
    productBySlug(q.productSlug ?? '')?.name ??
    serviceBySlug(q.serviceSlug ?? '')?.name ??
    'General enquiry'
  );
}

export default function QuotesPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<'' | QuoteStatus>('');
  const { data, loading, error, reload } = useAsync(
    () => adminQuotesApi.list(filter || undefined),
    [filter],
  );

  const [active, setActive] = useState<AdminQuoteRequest | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<QuoteStatus>('QUOTED');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const openReply = (q: AdminQuoteRequest) => {
    setActive(q);
    setNote(q.quotedNote ?? '');
    setStatus(q.status === 'NEW' || q.status === 'IN_REVIEW' ? 'QUOTED' : q.status);
    setErr(null);
  };

  const submit = async () => {
    if (!active) return;
    if (status === 'QUOTED' && !note.trim()) {
      setErr('Write the quotation before sending — this text is what the customer receives.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await adminQuotesApi.update(active.id, { status, quotedNote: note.trim() || undefined });
      toast(status === 'QUOTED' ? 'Quotation sent to the customer' : 'Request updated', 'success');
      setActive(null);
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not update the request.');
    } finally {
      setBusy(false);
    }
  };

  const open = data?.filter((q) => q.status === 'NEW' || q.status === 'IN_REVIEW').length ?? 0;

  return (
    <>
      <PageHeader
        title="Quotations"
        subtitle="Requests from the public site and the customer portal."
        actions={
          <div className="w-44">
            <Select value={filter} onChange={(e) => setFilter(e.target.value as QuoteStatus | '')}>
              <option value="">All requests</option>
              <option value="NEW">New</option>
              <option value="IN_REVIEW">In review</option>
              <option value="QUOTED">Quoted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </div>
        }
      />

      {open > 0 && !filter && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>{open}</strong> request{open === 1 ? '' : 's'} waiting for a reply.
        </div>
      )}

      {loading ? (
        <LoadingBlock label="Loading quotations…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No quotation requests"
          description={filter ? 'Nothing with that status.' : 'Requests from the site will appear here.'}
        />
      ) : (
        <div className="space-y-4">
          {data?.map((q) => {
            const s = STATUS[q.status];
            return (
              <Card key={q.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-semibold text-gray-900">{subjectOf(q)}</h2>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
                          s.className,
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      <span className="font-mono text-gray-700">{q.reference}</span> · {when(q.createdAt)}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => openReply(q)}>
                    {q.status === 'QUOTED' ? 'Update reply' : 'Reply with a price'}
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                  <span className="font-medium text-gray-900">{q.name}</span>
                  <a
                    href={`mailto:${q.email}`}
                    className="inline-flex items-center gap-1.5 text-gray-600 hover:text-brand-700"
                  >
                    <Mail className="h-3.5 w-3.5" /> {q.email}
                  </a>
                  {q.phone && (
                    <a
                      href={`tel:${q.phone}`}
                      className="inline-flex items-center gap-1.5 text-gray-600 hover:text-brand-700"
                    >
                      <Phone className="h-3.5 w-3.5" /> {q.phone}
                    </a>
                  )}
                </div>

                <p className="mt-3 border-l-2 border-gray-200 pl-3 text-sm leading-relaxed text-gray-600">
                  {q.message}
                </p>

                {(q.broker || q.accountSize) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                    {q.broker && (
                      <span>
                        Broker: <span className="font-medium text-gray-700">{q.broker}</span>
                      </span>
                    )}
                    {q.accountSize && (
                      <span>
                        Account size: <span className="font-medium text-gray-700">{q.accountSize}</span>
                      </span>
                    )}
                  </div>
                )}

                {q.quotedNote && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Sent to the customer
                    </div>
                    <p className="mt-1 whitespace-pre-line text-sm text-emerald-900">{q.quotedNote}</p>
                    {q.quotedAt && (
                      <p className="mt-1.5 text-xs text-emerald-700">Replied {when(q.quotedAt)}</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={`Reply to ${active?.reference ?? ''}`}
        description="What you write here is emailed to the customer and shown in their portal."
        footer={
          <>
            <Button variant="secondary" onClick={() => setActive(null)} disabled={busy}>
              Cancel
            </Button>
            <Button loading={busy} onClick={submit}>
              {status === 'QUOTED' ? 'Send quotation' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Status" htmlFor="q-status">
            <Select id="q-status" value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)}>
              <option value="IN_REVIEW">In review — no email sent</option>
              <option value="QUOTED">Quoted — emails the customer</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </Field>

          <Field
            label="Message to the customer"
            htmlFor="q-note"
            hint="Include the figure, what it covers and how long it is valid."
          >
            <textarea
              id="q-note"
              rows={6}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                'For a $10,000 account, TradeFx Heddge is USD 349 for a perpetual licence on one trading account.\nThe quote is valid for 14 days.'
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </Field>

          <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-900">
            The platform stores no price field — this text is the quotation. Nothing else in the
            product will ever show the customer a number.
          </p>

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
