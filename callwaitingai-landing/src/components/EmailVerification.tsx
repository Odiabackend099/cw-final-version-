import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../lib/auth';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const tokenHash = searchParams.get('token_hash');
      
      if (!token && !tokenHash) {
        setStatus('error');
        setMessage('Invalid verification link. Please try signing up again.');
        return;
      }

      try {
        const verificationToken = tokenHash || token;
        if (verificationToken) {
          const result = await authService.verifyEmail(verificationToken);
          
          // Create user profile after successful email verification
          if (result.user) {
            try {
              await authService.createUserProfile(result.user);
            } catch (profileError) {
              if (import.meta.env.DEV) console.error('Failed to create user profile:', profileError);
              // Don't fail the verification if profile creation fails
            }
          }
          
          setStatus('success');
          setMessage('Email verified successfully! You can now sign in to your account.');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        if (error.message.includes('expired')) {
          setMessage('This verification link has expired. Please request a new one.');
        } else if (error.message.includes('already confirmed')) {
          setMessage('Your email is already verified. You can sign in to your account.');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setMessage(error.message || 'Failed to verify email. Please try again.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendVerification = () => {
    // This would need the user's email, which we might not have here
    // Better to redirect to sign in page
    navigate('/?auth=signin');
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
        <h1 className="text-3xl font-bold mb-4">
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
                onClick={handleGoHome}
                className="w-full gradient-bg text-white font-bold py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard Now
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full gradient-bg text-white font-bold py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Try Signing In
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