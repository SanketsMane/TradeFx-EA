import { ArrowUpRight, Building2, Check, Info, ShieldCheck } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, ErrorState, LoadingBlock } from '@/components/ui/misc';
import { portalApi } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoBrokers } from '@/lib/demoPortalData';
import { usePageTitle } from '@/lib/usePageTitle';

const steps = [
  'Open the broker account through the link below.',
  'Fund it with whatever you intend to trade — the money stays in your name.',
  'Come back to Trading Accounts and connect it with your licence code.',
];

export default function BrokerAccountPage() {
  usePageTitle('Open a broker account');
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.brokers(),
    demoBrokers,
  );

  if (loading) return <LoadingBlock label="Loading partner brokers…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      {preview && <PreviewBanner />}
      <PortalHeader
        title="Open a broker account"
        subtitle="You need a MetaTrader account for the Expert Advisor to trade on."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {data?.map((b) => (
            <Card key={b.id} className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-content-center rounded-xl bg-brand-50 text-brand-700">
                  {b.logo ? (
                    <img src={b.logo} alt="" className="h-7 w-7 object-contain" />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900">{b.name}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{b.blurb}</p>
                </div>
              </div>

              <ul className="mt-5 grid gap-2.5 border-t border-gray-100 pt-5 sm:grid-cols-2">
                {b.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
                    <span className="text-sm text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>

              <a
                href={b.signupUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Open an account with {b.name} <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          ))}

          {/*
            Required disclosure: we are paid by the broker when someone signs up
            through this link. Saying so plainly is both the honest thing and
            what affiliate-marketing rules expect.
          */}
          <div className="flex gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <p className="text-xs leading-relaxed text-gray-600">
              These are affiliate links. If you open an account through one, we may receive a
              commission from the broker at no extra cost to you. You are free to use any MT4 or
              MT5 broker you like — our Expert Advisors work the same either way.
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              What happens next
            </h2>
            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-content-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-gray-700">{s}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" /> Your money stays yours
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The broker account is in your name and under your control. TradeFx never holds your
              funds and cannot withdraw from your account — we only place trades on it. Deposit
              and withdraw whenever you want.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
