import { Link } from 'react-router-dom';
import { ArrowRight, Bot, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, EmptyState, ErrorState, LoadingBlock, StatCard } from '@/components/ui/misc';
import { portalApi } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoOverview } from '@/lib/demoPortalData';
import { amount, num, pct, pnlColor } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { cn } from '@/lib/utils';

const roi = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;

export default function PortalOverviewPage() {
  usePageTitle('Overview');
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.overview(),
    demoOverview,
  );

  if (loading) return <LoadingBlock label="Loading your dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  const dailyUp = num(data.dailyPnl) >= 0;

  return (
    <>
      {preview && <PreviewBanner />}
      <PortalHeader
        title="Overview"
        subtitle="How your Expert Advisors are doing today."
        actions={
          <Link
            to="/app/accounts"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Connect an account <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Expert Advisors" value={data.activeBots} sub={`${data.linkedAccounts} linked account${data.linkedAccounts === 1 ? '' : 's'}`} />
        <StatCard label="Total equity" value={amount(data.totalEquity, data.currency)} sub="Across all linked accounts" />
        <StatCard
          label="Profit / loss today"
          value={<span className={pnlColor(data.dailyPnl)}>{amount(data.dailyPnl, data.currency, { sign: true })}</span>}
          sub={
            <span className="inline-flex items-center gap-1">
              {dailyUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              since midnight
            </span>
          }
        />
        <StatCard
          label="Return today"
          value={<span className={data.dailyRoiPct >= 0 ? 'text-emerald-600' : 'text-red-600'}>{roi(data.dailyRoiPct)}</span>}
          sub="On opening equity"
        />
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold text-gray-900">Your Expert Advisors</h2>

      {data.performance.length === 0 ? (
        <EmptyState
          icon={<Bot className="h-6 w-6" />}
          title="No Expert Advisor running yet"
          description="Once you have a licence code, connect a MetaTrader account and your bot starts trading."
          action={
            <Link
              to="/app/accounts"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Connect an account
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.performance.map((p) => (
            <Card key={p.licenseId} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-content-center rounded-lg bg-brand-50 text-brand-700">
                      <Bot className="h-4 w-4" />
                    </span>
                    <h3 className="truncate font-semibold text-gray-900">{p.productName}</h3>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <Wallet className="h-3.5 w-3.5" />
                    {p.accountLabel}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                    p.dailyRoiPct >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                  )}
                >
                  {roi(p.dailyRoiPct)} today
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-4">
                {[
                  { label: 'Equity', value: amount(p.equity, p.currency) },
                  { label: 'P/L today', value: amount(p.dailyPnl, p.currency, { sign: true }), tone: pnlColor(p.dailyPnl) },
                  { label: 'Total P/L', value: amount(p.totalPnl, p.currency, { sign: true }), tone: pnlColor(p.totalPnl) },
                  { label: 'Win rate', value: pct(p.winRate) },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs text-gray-500">{s.label}</dt>
                    <dd className={cn('mt-0.5 text-sm font-semibold text-gray-900', s.tone)}>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-500">
                  {p.openPositions} open · {p.trades} trades
                </span>
                <Link
                  to={`/app/bots/${p.licenseId}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Trade statement <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
