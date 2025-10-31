import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CallWaitingLogo from '../components/CallWaitingLogo';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signUp(email, password, fullName);
      
      // Check if user is immediately authenticated (no email verification required)
      if (result.session) {
        // User is authenticated, redirect to dashboard
        navigate('/dashboard');
      } else {
        // Email verification is required
        setError('Account created! Please check your email to verify your account before signing in.');
      }
    } catch (err: any) {
      // Handle rate limit errors specifically
      const errorMessage = err.message || '';
      const isRateLimitError = 
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('too many') ||
        errorMessage.toLowerCase().includes('429') ||
        errorMessage.toLowerCase().includes('email rate') ||
        err.status === 429 ||
        err.code === '429';

      if (isRateLimitError) {
        setIsRateLimited(true);
        setRetryAfter(300); // 5 minutes default
        setError(
          'Email rate limit reached. Please wait 5 minutes before trying again. If you need immediate access, please contact support at odiabackend@gmail.com.'
        );
        
        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        // Start countdown timer
        intervalRef.current = setInterval(() => {
          setRetryAfter((prev) => {
            if (prev === null || prev <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setIsRateLimited(false);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (errorMessage.toLowerCase().includes('email')) {
        // Other email-related errors
        setError(err.message || 'Email error. Please check your email address and try again.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CallWaitingLogo size="xl" showText={false} />
            </div>
            <div className="flex justify-center mb-2">
              <CallWaitingLogo size="xl" showText={true} />
            </div>
            <p className="mt-2 text-gray-600">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-3 border rounded-lg text-sm ${
              isRateLimited 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="font-medium mb-1">{error}</div>
              {isRateLimited && retryAfter !== null && retryAfter > 0 && (
                <div className="text-xs mt-2">
                  You can try again in {Math.floor(retryAfter / 60)}m {retryAfter % 60}s
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (isRateLimited && retryAfter !== null && retryAfter > 0)}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 
               (isRateLimited && retryAfter !== null && retryAfter > 0) 
                 ? `Wait ${Math.floor(retryAfter / 60)}m ${retryAfter % 60}s` 
                 : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
