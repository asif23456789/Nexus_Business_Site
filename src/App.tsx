import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages - Loaded eagerly (critical path)
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import TwoFactorPage from './pages/auth/TwoFactorPage';

// Dashboard Pages - Loaded eagerly (shown immediately)
import EntrepreneurDashboard from './pages/dashboard/EntrepreneurDashboard';
import InvestorDashboard from './pages/dashboard/InvestorDashboard';

// Lazy-loaded pages (reduce initial bundle)
const EntrepreneurProfile = lazy(() => import('./pages/profile/EntrepreneurProfile').then(m => ({ default: m.EntrepreneurProfile })));
const InvestorProfile = lazy(() => import('./pages/profile/InvestorProfile').then(m => ({ default: m.InvestorProfile })));
const InvestorsPage = lazy(() => import('./pages/investors/InvestorsPage').then(m => ({ default: m.InvestorsPage })));
const EntrepreneursPage = lazy(() => import('./pages/entrepreneurs/EntrepreneursPage').then(m => ({ default: m.EntrepreneursPage })));
const MessagesPage = lazy(() => import('./pages/messages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const DocumentsPage = lazy(() => import('./pages/documents/DocumentsPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/help/HelpPage').then(m => ({ default: m.HelpPage })));
const DealsPage = lazy(() => import('./pages/deals/DealsPage').then(m => ({ default: m.DealsPage })));
const WalletPage = lazy(() => import('./components/wallet/WalletPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatPage').then(m => ({ default: m.ChatPage })));
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage'));
const VideoCallPage = lazy(() => import('./pages/video/VideoCallPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="investor" element={<InvestorDashboard />} />
          </Route>
          
          {/* Profile Routes */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route path="entrepreneur/:id" element={<Suspense fallback={<PageLoader />}><EntrepreneurProfile /></Suspense>} />
            <Route path="investor/:id" element={<Suspense fallback={<PageLoader />}><InvestorProfile /></Suspense>} />
          </Route>
          
          {/* Feature Routes */}
          <Route path="/investors" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><InvestorsPage /></Suspense>} />
          </Route>
          
          <Route path="/entrepreneurs" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><EntrepreneursPage /></Suspense>} />
          </Route>
          
          <Route path="/messages" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><MessagesPage /></Suspense>} />
          </Route>
          
          <Route path="/notifications" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>} />
          </Route>
          
          <Route path="/documents" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><DocumentsPage /></Suspense>} />
          </Route>
          
          <Route path="/settings" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
          </Route>
          
          <Route path="/help" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><HelpPage /></Suspense>} />
          </Route>
          
          <Route path="/deals" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><DealsPage /></Suspense>} />
          </Route>
          
          <Route path="/wallet" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><WalletPage /></Suspense>} />
          </Route>
          
          <Route path="/calendar" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><CalendarPage /></Suspense>} />
          </Route>
          
          <Route path="/chat" element={<DashboardLayout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><ChatPage /></Suspense>} />
            <Route path=":userId" element={<Suspense fallback={<PageLoader />}><ChatPage /></Suspense>} />
          </Route>
          
          <Route path="/video/:meetingId" element={<Suspense fallback={<PageLoader />}><VideoCallPage /></Suspense>} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;