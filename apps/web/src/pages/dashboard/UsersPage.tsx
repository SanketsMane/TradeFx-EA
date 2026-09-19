import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users as UsersIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/DashboardLayout';
import { Card, EmptyState, ErrorState, LoadingBlock, StatCard } from '@/components/ui/misc';
import { Input, Select } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAsync } from '@/hooks/useAsync';
import { usersApi, type Role, type UserStatus } from '@/lib/api';
import { cn } from '@/lib/utils';

const PAGE = 25;

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
};

/** Status as colour + written label — never colour alone. */
function StatusCell({ status }: { status: UserStatus }) {
  const active = status === 'ACTIVE';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-emerald-500' : 'bg-red-500')} />
      {active ? 'Active' : 'Disabled'}
    </span>
  );
}

const date = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function UsersPage() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'' | Role>('');
  const [status, setStatus] = useState<'' | UserStatus>('');
  const [page, setPage] = useState(0);

  const stats = useAsync(() => usersApi.stats(), []);
  const { data, loading, error, reload } = useAsync(
    () =>
      usersApi.list({
        q: search || undefined,
        role: role || undefined,
        status: status || undefined,
        limit: PAGE,
        offset: page * PAGE,
      }),
    [search, role, status, page],
  );

  const applySearch = () => {
    setPage(0);
    setSearch(q.trim());
  };

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <>
      <PageHeader title="Users" subtitle="Everyone on the platform — customers and staff." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Customers"
          value={stats.data?.customers ?? '—'}
          sub={`${stats.data?.activeCustomers ?? 0} active`}
        />
        <StatCard label="Staff accounts" value={stats.data?.staff ?? '—'} sub="Admins and super admins" />
        <StatCard
          label="Licences"
          value={stats.data?.licenses ?? '—'}
          sub={`${stats.data?.activeLicenses ?? 0} active`}
        />
        <StatCard
          label="Open quotations"
          value={stats.data?.openQuotes ?? '—'}
          sub={<Link to="/dashboard/quotes" className="text-brand-700 hover:underline">Go to inbox</Link>}
        />
      </div>

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <label htmlFor="user-search" className="mb-1.5 block text-xs font-medium text-gray-600">
              Search
            </label>
            <div className="flex gap-2">
              <Input
                id="user-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="Email, name or phone"
              />
              <Button variant="secondary" onClick={applySearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-40">
            <label htmlFor="user-role" className="mb-1.5 block text-xs font-medium text-gray-600">
              Role
            </label>
            <Select
              id="user-role"
              value={role}
              onChange={(e) => {
                setPage(0);
                setRole(e.target.value as Role | '');
              }}
            >
              <option value="">All roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </Select>
          </div>
          <div className="w-40">
            <label htmlFor="user-status" className="mb-1.5 block text-xs font-medium text-gray-600">
              Status
            </label>
            <Select
              id="user-status"
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value as UserStatus | '');
              }}
            >
              <option value="">Any status</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <LoadingBlock label="Loading users…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-10 w-10" />}
          title="No users match"
          description={
            search || role || status
              ? 'Try a different search or clear the filters.'
              : 'Nobody has registered yet.'
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left">
                <tr>
                  {['User', 'Role', 'Status', 'Licences', 'Accounts', 'Joined', ''].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.fullName ?? '—'}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                      {u.phone && <div className="text-xs text-gray-400">+91 {u.phone}</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-medium',
                          u.role === 'CUSTOMER' ? 'bg-gray-100 text-gray-700' : 'bg-brand-50 text-brand-700',
                        )}
                      >
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusCell status={u.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">{u._count.licenses}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">{u._count.ownedAccounts}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{date(u.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        to={`/dashboard/users/${u.id}`}
                        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <span className="text-xs text-gray-500">
                {page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} of {total}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page + 1 >= pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
