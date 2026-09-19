import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Link2, Plus, Wallet } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, EmptyState, ErrorState, LoadingBlock, StatusBadge } from '@/components/ui/misc';
import ConnectAccountDialog from '@/components/portal/ConnectAccountDialog';
import { portalApi } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoAccounts, demoLicenses } from '@/lib/demoPortalData';
import { usePageTitle } from '@/lib/usePageTitle';

export default function TradingAccountsPage() {
  usePageTitle('Trading Accounts');
  const [params] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(Boolean(params.get('license')));

  const accounts = usePortalResource(() => portalApi.accounts(), demoAccounts);
  const licenses = usePortalResource(() => portalApi.licenses(), demoLicenses);

  const preview = accounts.preview || licenses.preview;

  return (
    <>
      {preview && <PreviewBanner />}
      <PortalHeader
        title="Trading Accounts"
        subtitle="The MetaTrader accounts your Expert Advisors run on."
        actions={
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Connect account
          </button>
        }
      />

      {accounts.loading ? (
        <LoadingBlock label="Loading your accounts…" />
      ) : accounts.error ? (
        <ErrorState message={accounts.error} onRetry={accounts.reload} />
      ) : (accounts.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<Wallet className="h-6 w-6" />}
          title="No trading account connected"
          description="Connect the MT4 or MT5 account you want your Expert Advisor to trade on. You will need your licence code."
          action={
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Link2 className="h-4 w-4" /> Connect account
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.data?.map((a) => {
            const lic = licenses.data?.find((l) => l.linkedAccount?.id === a.id);
            return (
              <Card key={a.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">{a.label}</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {a.platform} · {a.login}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Server</dt>
                    <dd className="truncate font-medium text-gray-900">{a.server}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500">Expert Advisor</dt>
                    <dd className="truncate font-medium text-gray-900">
                      {lic ? lic.productName : <span className="text-gray-400">None yet</span>}
                    </dd>
                  </div>
                  {a.marginMode && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Account type</dt>
                      <dd className="font-medium capitalize text-gray-900">{a.marginMode}</dd>
                    </div>
                  )}
                </dl>

                {lic && (
                  <Link
                    to={`/app/bots/${lic.id}`}
                    className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View trade statement →
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-content-center rounded-xl bg-brand-50 text-brand-700">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-gray-900">Do not have a broker account yet?</h2>
            <p className="mt-1 max-w-lg text-sm text-gray-600">
              Open one through our partner and we can support your setup directly, because the
              account is visible on our side.
            </p>
          </div>
        </div>
        <Link
          to="/app/broker"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Open a broker account
        </Link>
      </div>

      <ConnectAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConnected={() => {
          accounts.reload();
          licenses.reload();
        }}
        licenses={licenses.data ?? []}
        presetCode={params.get('license') ?? undefined}
      />
    </>
  );
}
