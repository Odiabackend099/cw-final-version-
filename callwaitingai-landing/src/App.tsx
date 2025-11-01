import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

// Landing pages - eagerly loaded for initial page view
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Lazy load chat widget to reduce initial bundle size
const AdvancedChatWidget = lazy(() => import('./components/AdvancedChatWidget'));

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

// Auth pages - lazy loaded
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const SignUp = lazy(() => import('./pages/SignUp').then(module => ({ default: module.SignUp })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));

// Dashboard pages - lazy loaded
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Calls = lazy(() => import('./pages/Calls').then(module => ({ default: module.Calls })));
const Leads = lazy(() => import('./pages/Leads').then(module => ({ default: module.Leads })));
const Payments = lazy(() => import('./pages/Payments').then(module => ({ default: module.Payments })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const AgentSetup = lazy(() => import('./pages/AgentSetup'));

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-lightBg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        <p className="text-neutral-darkGray">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Landing Page Routes */}
        <Route path="/" element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-neutral-lightBg">
              <Navigation />
              <Home />
              <Footer />
            </div>
          )
        } />
        <Route path="/privacy" element={
          <div className="min-h-screen bg-neutral-lightBg">
            <Navigation />
            <Privacy />
            <Footer />
          </div>
        } />
        <Route path="/terms" element={
          <div className="min-h-screen bg-neutral-lightBg">
            <Navigation />
            <Terms />
            <Footer />
          </div>
        } />

        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            loading ? (
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            loading ? (
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignUp />
            )
          } 
        />
        <Route path="/auth/confirm" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<PasswordReset />} />
        {/* Legacy route aliases for password reset - support both old and test formats */}
        <Route path="/password-reset" element={<Navigate to="/auth/reset-password" replace />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <Layout>
                <Calls />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout>
                <Leads />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent-setup"
          element={
            <ProtectedRoute>
              <Layout>
                <AgentSetup />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>

      {/* Advanced Chat Widget for all pages */}
      <AdvancedChatWidget />
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
