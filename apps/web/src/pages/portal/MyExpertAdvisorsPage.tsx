import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CircleCheck, Link2, ShoppingBag } from 'lucide-react';
import { PortalHeader, PreviewBanner } from '@/components/layout/PortalLayout';
import { Card, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/misc';
import LicenseCode from '@/components/portal/LicenseCode';
import { portalApi, type LicenseStatus } from '@/lib/api';
import { usePortalResource } from '@/lib/portalData';
import { demoLicenses } from '@/lib/demoPortalData';
import { productBySlug } from '@/lib/catalog';
import { usePageTitle } from '@/lib/usePageTitle';
import { cn } from '@/lib/utils';

const STATUS: Record<LicenseStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Active', className: 'bg-emerald-50 text-emerald-700' },
  UNASSIGNED: { label: 'Ready to connect', className: 'bg-amber-50 text-amber-700' },
  SUSPENDED: { label: 'Suspended', className: 'bg-gray-100 text-gray-600' },
  EXPIRED: { label: 'Expired', className: 'bg-gray-100 text-gray-600' },
  REVOKED: { label: 'Revoked', className: 'bg-red-50 text-red-700' },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function MyExpertAdvisorsPage() {
  usePageTitle('My Expert Advisors');
  const { data, loading, error, preview, reload } = usePortalResource(
    () => portalApi.licenses(),
    demoLicenses,
  );

  if (loading) return <LoadingBlock label="Loading your Expert Advisors…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  return (
    <>
      {preview && <PreviewBanner />}
      <PortalHeader
        title="My Expert Advisors"
        subtitle="Everything you own, with the licence code for each one."
        actions={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" /> Browse the range
          </Link>
        }
      />

      {data.length === 0 ? (
        <EmptyState
          icon={<Bot className="h-6 w-6" />}
          title="You do not own an Expert Advisor yet"
          description="Request a quotation for the one you want. Once the purchase is confirmed, your licence code appears here."
          action={
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Browse Expert Advisors
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.map((lic) => {
            const product = productBySlug(lic.productSlug);
            const status = STATUS[lic.status];
            return (
              <Card key={lic.id} className="overflow-hidden">
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                  {product && (
                    <img
                      src={product.cardImage}
                      alt=""
                      loading="lazy"
                      className="h-24 w-auto shrink-0 self-start object-contain sm:h-28"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-semibold text-gray-900">{lic.productName}</h2>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', status.className)}>
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">Issued {date(lic.issuedAt)}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Licence
                      </span>
                      <LicenseCode code={lic.code} />
                    </div>

                    <div className="mt-3 text-sm">
                      {lic.linkedAccount ? (
                        <span className="inline-flex items-center gap-1.5 text-gray-600">
                          <CircleCheck className="h-4 w-4 text-emerald-600" />
                          Running on {lic.linkedAccount.label} ({lic.linkedAccount.platform}{' '}
                          {lic.linkedAccount.login})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700">
                          <Link2 className="h-4 w-4" />
                          Not connected to a trading account yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 sm:self-center">
                    {lic.linkedAccount ? (
                      <Link
                        to={`/app/bots/${lic.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Trade statement <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        to={`/app/accounts?license=${lic.code}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        <Link2 className="h-4 w-4" /> Connect account
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
