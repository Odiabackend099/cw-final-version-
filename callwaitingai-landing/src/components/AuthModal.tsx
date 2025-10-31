import { useState, useEffect } from 'react';
import { X, Loader2, Mail, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { authService } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

type AuthStep = 'auth' | 'verify-email' | 'password-reset';

const AuthModal = ({ isOpen, onClose, mode: initialMode, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep('auth');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setMode(initialMode);
    onClose();
  };

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setCurrentStep('auth');
      setError('');
      setSuccess('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password confirmation for signup
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Password strength validation
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const result = await authService.signUp(email, password);
        if (result.needsEmailVerification) {
          setSuccess('Account created! Please check your email to verify your account.');
          setCurrentStep('verify-email');
        } else {
          setSuccess('Account created and verified! You are now signed in.');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1500);
        }
      } else {
        try {
          await authService.signIn(email, password);
          setSuccess('Successfully signed in!');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 1000);
        } catch (err: any) {
          if (err.message.includes('Email not confirmed')) {
            setError('Please verify your email address before signing in.');
            setCurrentStep('verify-email');
          } else {
            throw err; // Re-throw other errors
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);

      if (err.message.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in.');
        setCurrentStep('verify-email');
      } else if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setMode('signin');
      } else if (err.status === 500 || err.message.includes('500')) {
        setError('Server error occurred. This may be a temporary issue with the authentication service. Please try again in a few moments or contact support if the problem persists.');
        console.error('Supabase 500 error details:', {
          error: err,
          message: err.message,
          status: err.status,
          endpoint: 'signup',
        });
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.resendVerificationEmail(email);
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.requestPasswordReset(email);
      setSuccess('Password reset email sent! Please check your inbox.');
      setCurrentStep('auth');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setCurrentStep('auth');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setMode(initialMode);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Dynamic Header */}
        <div className="mb-6">
          {currentStep === 'verify-email' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600">
                We've sent a verification link to <strong>{email}</strong>
              </p>
            </div>
          ) : currentStep === 'password-reset' ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600">
                Enter your email to receive a password reset link
              </p>
            </div>
          ) : (
            <>
              <h2 id="auth-modal-title" className="text-3xl font-bold gradient-text mb-2">
                {mode === 'signin' ? 'Welcome Back' : 'Get Started Free'}
              </h2>
              <p className="text-gray-600">
                {mode === 'signin'
                  ? 'Sign in to access your dashboard'
                  : 'Create your account and get 100 free calls'}
              </p>
            </>
          )}
        </div>

        {/* Dynamic Content */}
        {currentStep === 'verify-email' ? (
          /* Email Verification Step */
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm text-center">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Please click the verification link in your email to activate your account.
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Resend verification email
              </button>
            </div>
            
            <button
              onClick={resetModal}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : currentStep === 'password-reset' ? (
          /* Password Reset Step */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className="w-full gradient-bg text-white font-bold py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <button
              onClick={() => setCurrentStep('auth')}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* Main Auth Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 8 : 6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setCurrentStep('password-reset')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white font-bold py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>{mode === 'signin' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center mt-4">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center mt-4">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Toggle Mode - Only show in main auth step */}
        {currentStep === 'auth' && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-primary-blue font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
