import { Suspense, lazy, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CompareProductsPage from './pages/CompareProductsPage';
import SupportedBrokersPage from './pages/SupportedBrokersPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import { getUser, isAuthenticated } from './lib/api';

/*
 * Everything behind a sign-in is split out. Marketing visitors — who are
 * the ones search engines measure — should not download the admin
 * dashboard and the customer portal before the page paints.
 */
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'));
const AccountsPage = lazy(() => import('./pages/dashboard/AccountsPage'));
const AccountDetailPage = lazy(() => import('./pages/dashboard/AccountDetailPage'));
const CopiersPage = lazy(() => import('./pages/dashboard/CopiersPage'));
const CopierDetailPage = lazy(() => import('./pages/dashboard/CopierDetailPage'));
const MonitorPage = lazy(() => import('./pages/dashboard/MonitorPage'));
const HistoryPage = lazy(() => import('./pages/dashboard/HistoryPage'));
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage'));
const UsersPage = lazy(() => import('./pages/dashboard/UsersPage'));
const UserDetailPage = lazy(() => import('./pages/dashboard/UserDetailPage'));
const QuotesPage = lazy(() => import('./pages/dashboard/QuotesPage'));
const LicensesPage = lazy(() => import('./pages/dashboard/LicensesPage'));
const BrokersPage = lazy(() => import('./pages/dashboard/BrokersPage'));
const AdminsPage = lazy(() => import('./pages/dashboard/AdminsPage'));
const AuditPage = lazy(() => import('./pages/dashboard/AuditPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const PortalLayout = lazy(() => import('./components/layout/PortalLayout'));
const PortalOverviewPage = lazy(() => import('./pages/portal/PortalOverviewPage'));
const MyExpertAdvisorsPage = lazy(() => import('./pages/portal/MyExpertAdvisorsPage'));
const BotDetailPage = lazy(() => import('./pages/portal/BotDetailPage'));
const TradingAccountsPage = lazy(() => import('./pages/portal/TradingAccountsPage'));
const BrokerAccountPage = lazy(() => import('./pages/portal/BrokerAccountPage'));
const MyQuotesPage = lazy(() => import('./pages/portal/MyQuotesPage'));


function RequireAuth({ children }: { children: ReactElement }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/** Staff only. A customer who lands on /dashboard is sent to their own portal. */
function RequireStaff({ children }: { children: ReactElement }) {
  const role = getUser()?.role;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return role === 'CUSTOMER' ? <Navigate to="/app" replace /> : children;
}

function RequireSuperAdmin({ children }: { children: ReactElement }) {
  return getUser()?.role === 'SUPER_ADMIN' ? children : <Navigate to="/dashboard" replace />;
}

/** Shown while a lazily-loaded private route downloads. */
function RouteFallback() {
  return (
    <div className="grid min-h-screen place-content-center bg-slate-50">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* ---- Public marketing site ---- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/compare" element={<CompareProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/supported-brokers" element={<SupportedBrokersPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* ---- Customer portal ---- */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <PortalLayout />
            </RequireAuth>
          }
        >
          <Route index element={<PortalOverviewPage />} />
          <Route path="bots" element={<MyExpertAdvisorsPage />} />
          <Route path="bots/:id" element={<BotDetailPage />} />
          <Route path="accounts" element={<TradingAccountsPage />} />
          <Route path="broker" element={<BrokerAccountPage />} />
          <Route path="quotes" element={<MyQuotesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ---- Staff dashboard ---- */}
        <Route
          path="/dashboard"
          element={
            <RequireStaff>
              <DashboardLayout />
            </RequireStaff>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="accounts/:id" element={<AccountDetailPage />} />
          <Route path="copiers" element={<CopiersPage />} />
          <Route path="copiers/:id" element={<CopierDetailPage />} />
          <Route path="monitor" element={<MonitorPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          {/* Customer-facing administration — readable by any staff member;
              the destructive actions are gated server-side to SUPER_ADMIN. */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="licenses" element={<LicensesPage />} />
          <Route path="brokers" element={<BrokersPage />} />
          <Route
            path="admins"
            element={
              <RequireSuperAdmin>
                <AdminsPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="audit"
            element={
              <RequireSuperAdmin>
                <AuditPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="settings"
            element={
              <RequireSuperAdmin>
                <SettingsPage />
              </RequireSuperAdmin>
            }
          />
          {/* Unknown dashboard path → 404 inside the shell, not a bounce to marketing. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
