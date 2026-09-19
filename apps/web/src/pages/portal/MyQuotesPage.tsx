import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/misc';
import { quotesApi, type QuoteStatus } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoQuotes } from '@/lib/demoPortalData';
import { productBySlug, serviceBySlug } from '@/lib/catalog';
import { usePageTitle } from '@/lib/usePageTitle';
import { cn } from '@/lib/utils';

const STATUS: Record<QuoteStatus, { label: string; className: string }> = {
  NEW: { label: 'Received', className: 'bg-blue-50 text-blue-700' },
  IN_REVIEW: { label: 'Being reviewed', className: 'bg-amber-50 text-amber-700' },
  QUOTED: { label: 'Price sent', className: 'bg-emerald-50 text-emerald-700' },
  ACCEPTED: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-700' },
  DECLINED: { label: 'Declined', className: 'bg-gray-100 text-gray-600' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-600' },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function MyQuotesPage() {
  usePageTitle('My Quotations');
  const { data, loading, error, preview, reload } = usePortalResource(
    () => quotesApi.mine(),
    demoQuotes,
  );

  if (loading) return <LoadingBlock label="Loading your quotations…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      {preview && <PreviewBanner />}
      <PortalHeader
        title="My Quotations"
        subtitle="Requests you have sent us, and where each one stands."
        actions={
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> New request
          </Link>
        }
      />

      {(data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No quotation requests yet"
          description="Tell us which Expert Advisor or service you are interested in and an advisor will send you a price."
          action={
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Request a quotation
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data?.map((q) => {
            const subject =
              productBySlug(q.productSlug ?? '')?.name ??
              serviceBySlug(q.serviceSlug ?? '')?.name ??
              'General enquiry';
            const status = STATUS[q.status];
            return (
              <Card key={q.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-semibold text-gray-900">{subject}</h2>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Reference <span className="font-mono text-gray-700">{q.reference}</span> ·
                      sent {date(q.createdAt)}
                    </p>
                  </div>
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
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-sm text-emerald-900">{q.quotedNote}</p>
                    {q.quotedAt && (
                      <p className="mt-1 text-xs text-emerald-700">Replied {date(q.quotedAt)}</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
