import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
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
import DashboardLayout from './components/layout/DashboardLayout';
import PortalLayout from './components/layout/PortalLayout';
import PortalOverviewPage from './pages/portal/PortalOverviewPage';
import MyExpertAdvisorsPage from './pages/portal/MyExpertAdvisorsPage';
import BotDetailPage from './pages/portal/BotDetailPage';
import TradingAccountsPage from './pages/portal/TradingAccountsPage';
import BrokerAccountPage from './pages/portal/BrokerAccountPage';
import MyQuotesPage from './pages/portal/MyQuotesPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import AccountsPage from './pages/dashboard/AccountsPage';
import AccountDetailPage from './pages/dashboard/AccountDetailPage';
import CopiersPage from './pages/dashboard/CopiersPage';
import CopierDetailPage from './pages/dashboard/CopierDetailPage';
import MonitorPage from './pages/dashboard/MonitorPage';
import HistoryPage from './pages/dashboard/HistoryPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import UsersPage from './pages/dashboard/UsersPage';
import UserDetailPage from './pages/dashboard/UserDetailPage';
import QuotesPage from './pages/dashboard/QuotesPage';
import LicensesPage from './pages/dashboard/LicensesPage';
import BrokersPage from './pages/dashboard/BrokersPage';
import AdminsPage from './pages/dashboard/AdminsPage';
import AuditPage from './pages/dashboard/AuditPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import { getUser, isAuthenticated } from './lib/api';

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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <Routes>
        {/* ---- Public marketing site ---- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
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
    </BrowserRouter>
  );
}
