import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from URL - Supabase sends these parameters
      const type = searchParams.get('type');
      const token_hash = searchParams.get('token_hash');
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');

      // Check if this is an email confirmation callback
      if (type === 'signup' || type === 'email_confirmation' || type === 'email' || access_token) {
        try {
          // Exchange the tokens
          const { data, error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash: token_hash || '',
          });

          if (error) {
            // Try alternative method if OTP verification fails
            if (access_token && refresh_token) {
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

              if (sessionError) throw sessionError;

              setStatus('success');
              setMessage('Email verified successfully! You can now access your dashboard.');

              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
              return;
            }
            throw error;
          }

          setStatus('success');
          setMessage('Email verified successfully! You can now access your dashboard.');

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (error: any) {
          console.error('Email verification error:', error);
          setStatus('error');

          if (error.message?.includes('expired')) {
            setMessage('This verification link has expired. Please request a new one.');
          } else if (error.message?.includes('already confirmed') || error.message?.includes('already been verified')) {
            setMessage('Your email is already verified. You can sign in to your account.');
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else {
            setMessage(error.message || 'Failed to verify email. Please try again.');
          }
        }
      } else {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email for the correct link.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate, supabase]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' ? (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : status === 'success' ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          {status === 'loading' ? (
            'Verifying Your Email...'
          ) : status === 'success' ? (
            'Email Verified!'
          ) : (
            'Verification Failed'
          )}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="space-y-4">
          {status === 'success' ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                Redirecting to dashboard in a few seconds...
              </div>
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard Now
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Go to Login
              </button>
              <button
                onClick={handleGoHome}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
              Please wait while we verify your email address...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
