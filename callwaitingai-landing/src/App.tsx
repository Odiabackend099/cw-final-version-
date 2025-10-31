import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { FloatingChatWidget } from './components/FloatingChatWidget';

// Landing pages
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdvancedChatWidget from './components/AdvancedChatWidget';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Dashboard pages
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Calls } from './pages/Calls';
import { Leads } from './pages/Leads';
import { Payments } from './pages/Payments';
import { Settings } from './pages/Settings';
import AgentSetup from './pages/AgentSetup';
import EmailVerification from './pages/EmailVerification';
import PasswordReset from './pages/PasswordReset';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
              <AdvancedChatWidget />
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
        <Route path="/auth/reset-password" element={<PasswordReset />} />
        {/* Legacy route alias for password reset */}
        <Route path="/password-reset" element={<Navigate to="/auth/reset-password" replace />} />

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

      {user && <FloatingChatWidget />}
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
