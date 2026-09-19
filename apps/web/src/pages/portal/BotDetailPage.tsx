import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bot, Download } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, EmptyState, ErrorState, LoadingBlock, StatCard } from '@/components/ui/misc';
import LicenseCode from '@/components/portal/LicenseCode';
import { portalApi, type CopyEvent } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoLicenses, demoPerformance, demoStatement } from '@/lib/demoPortalData';
import { productBySlug } from '@/lib/catalog';
import { amount, num, pct, pnlColor } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { cn } from '@/lib/utils';

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Downloads the statement as CSV — the format every accountant asks for. */
function exportCsv(rows: CopyEvent[], name: string) {
  const head = ['Date', 'Symbol', 'Side', 'Lots', 'Profit/Loss', 'Ticket'];
  const body = rows.map((r) => [
    new Date(r.ts).toISOString(),
    r.symbol,
    r.side,
    r.lots,
    r.pnl ?? '',
    r.receiverTicket ?? r.sourceTicket,
  ]);
  const csv = [head, ...body]
    .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-statement.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BotDetailPage() {
  const { id = '' } = useParams();

  const perf = usePortalResource(
    () => portalApi.performance(id),
    () => demoPerformance.find((p) => p.licenseId === id) ?? demoPerformance[0],
    [id],
  );
  const statement = usePortalResource(
    () => portalApi.statement(id),
    () => ({ items: demoStatement(id), total: 40 }),
    [id],
  );

  const license = demoLicenses.find((l) => l.id === id);
  usePageTitle(perf.data?.productName ?? 'Expert Advisor');

  if (perf.loading) return <LoadingBlock label="Loading performance…" />;
  if (perf.error) return <ErrorState message={perf.error} onRetry={perf.reload} />;
  if (!perf.data) return null;

  const p = perf.data;
  const rows = statement.data?.items ?? [];
  const product = productBySlug(license?.productSlug ?? '');
  const realized = rows.reduce((sum, r) => sum + num(r.pnl), 0);

  return (
    <>
      {(perf.preview || statement.preview) && <PreviewBanner />}

      <Link
        to="/app/bots"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> My Expert Advisors
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        {product && <img src={product.cardImage} alt="" className="h-20 w-auto object-contain" />}
        <div className="min-w-0 flex-1">
          <PortalHeader title={p.productName} subtitle={`Running on ${p.accountLabel}`} />
          {license && (
            <div className="-mt-3 flex items-center gap-2.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Licence
              </span>
              <LicenseCode code={license.code} size="sm" />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Equity" value={amount(p.equity, p.currency)} sub={`Balance ${amount(p.balance, p.currency)}`} />
        <StatCard
          label="Profit / loss today"
          value={<span className={pnlColor(p.dailyPnl)}>{amount(p.dailyPnl, p.currency, { sign: true })}</span>}
          sub={`${p.dailyRoiPct >= 0 ? '+' : ''}${p.dailyRoiPct.toFixed(2)}% return`}
        />
        <StatCard
          label="Total profit / loss"
          value={<span className={pnlColor(p.totalPnl)}>{amount(p.totalPnl, p.currency, { sign: true })}</span>}
          sub="Since the bot went live"
        />
        <StatCard label="Win rate" value={pct(p.winRate)} sub={`${p.trades} trades · ${p.openPositions} open`} />
      </div>

      <div className="mb-4 mt-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Trade statement</h2>
          <p className="mt-1 text-sm text-gray-500">
            Every trade the Expert Advisor has placed on this account.
          </p>
        </div>
        {rows.length > 0 && (
          <button
            type="button"
            onClick={() => exportCsv(rows, p.productName)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        )}
      </div>

      {statement.loading ? (
        <LoadingBlock label="Loading trades…" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Bot className="h-6 w-6" />}
          title="No trades yet"
          description="As soon as the Expert Advisor opens its first position it will show up here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left">
                <tr>
                  {['Date', 'Symbol', 'Side', 'Lots', 'Ticket', 'Profit / loss'].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500',
                        i === 5 && 'text-right',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{when(r.ts)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{r.symbol}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-semibold',
                          r.side === 'BUY'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700',
                        )}
                      >
                        {r.side}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-600">{r.lots}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400">
                      {r.receiverTicket ?? r.sourceTicket}
                    </td>
                    <td
                      className={cn(
                        'whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums',
                        pnlColor(r.pnl),
                      )}
                    >
                      {amount(r.pnl, p.currency, { sign: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Shown on this page
                  </td>
                  <td className={cn('px-4 py-3 text-right font-bold tabular-nums', pnlColor(realized))}>
                    {amount(realized, p.currency, { sign: true })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
