import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, CheckCircle, AlertCircle, ArrowLeft, Star, Quote } from 'lucide-react';
import { authService } from '../lib/auth';

type SignUpStep = 'signup' | 'verify-email' | 'payment-setup';

const testimonials = [
  {
    quote: "CallWaitingAI transformed our business. We went from missing 30% of calls to capturing every lead. Revenue up 45% in 3 months.",
    author: "Sarah Johnson",
    role: "Owner, Johnson Plumbing",
    metric: "45% revenue increase",
    logo: "🔧"
  },
  {
    quote: "The AI receptionist handles calls better than our previous answering service. Customers love the instant response, and we save £2,000/month.",
    author: "David Chen",
    role: "Director, Chen Legal Services",
    metric: "£2,000 saved monthly",
    logo: "⚖️"
  },
  {
    quote: "First response time went from 4 hours to instant. Our booking rate increased by 60%. This AI pays for itself 10x over.",
    author: "Emma Williams",
    role: "Practice Manager, Williams Dental",
    metric: "60% booking increase",
    logo: "🦷"
  }
];

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('signup');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Consent state
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Rotate testimonials
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Sign up user (metadata will be stored after email verification in trigger)
      const result = await authService.signUp(email, password);

      if (result.needsEmailVerification) {
        setSuccess('Account created! Check your email to verify.');
        setCurrentStep('verify-email');
      } else {
        setSuccess('Account created successfully!');
        // After successful signup, redirect to payment setup or dashboard
        setTimeout(() => {
          navigate('/dashboard'); // Or payment setup page
        }, 1500);
      }
    } catch (err: any) {
      if (err.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.resendVerificationEmail(email);
      setSuccess('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-neutral-lightBg to-secondary-light/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-main hover:text-primary-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-darkText mb-2">
                {currentStep === 'signup' ? 'Start Your Free Trial' : 'Verify Your Email'}
              </h1>
              <p className="text-neutral-mediumText">
                {currentStep === 'signup'
                  ? '50 free call minutes • No credit card required initially'
                  : 'We sent a verification link to your email'}
              </p>
            </div>

            {currentStep === 'signup' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error/Success Messages */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-darkText mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-mediumText/30 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                    placeholder="John Smith"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-neutral-darkText mb-2">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-mediumText/30 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                    placeholder="Smith & Co."
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-darkText mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-mediumText/30 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-darkText mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-neutral-mediumText/30 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                    placeholder="At least 8 characters"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-darkText mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-neutral-mediumText/30 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                    placeholder="Re-enter password"
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3 border-t border-neutral-mediumText/20 pt-6">
                  <div className="flex items-start gap-3">
                    <input
                      id="termsAccepted"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-1 w-4 h-4 text-primary-main border-neutral-mediumText/30 rounded focus:ring-2 focus:ring-primary-main"
                    />
                    <label htmlFor="termsAccepted" className="text-sm text-neutral-mediumText">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-main hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-main hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      *
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="emailConsent"
                      type="checkbox"
                      checked={emailConsent}
                      onChange={(e) => setEmailConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-main border-neutral-mediumText/30 rounded focus:ring-2 focus:ring-primary-main"
                    />
                    <label htmlFor="emailConsent" className="text-sm text-neutral-mediumText">
                      Send me marketing emails about new features and tips (optional, PECR compliant)
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="smsConsent"
                      type="checkbox"
                      checked={smsConsent}
                      onChange={(e) => setSmsConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-main border-neutral-mediumText/30 rounded focus:ring-2 focus:ring-primary-main"
                    />
                    <label htmlFor="smsConsent" className="text-sm text-neutral-mediumText">
                      Send me SMS notifications for important updates (optional, PECR compliant)
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-main hover:bg-primary-dark text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>Start Free Trial</>
                  )}
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-neutral-mediumText">
                  Already have an account?{' '}
                  <a
                    href="https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app/login"
                    className="text-primary-main hover:underline font-medium"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            ) : (
              // Email Verification Step
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary-main" />
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-neutral-mediumText">
                    We've sent a verification email to:
                  </p>
                  <p className="text-lg font-semibold text-neutral-darkText">{email}</p>
                  <p className="text-sm text-neutral-mediumText">
                    Click the link in the email to verify your account and start your free trial.
                  </p>
                </div>

                {success && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full bg-neutral-lightBg hover:bg-neutral-mediumText/10 text-neutral-darkText font-medium py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>Resend Verification Email</>
                  )}
                </button>

                <p className="text-center text-sm text-neutral-mediumText">
                  Didn't receive the email? Check your spam folder or resend.
                </p>
              </div>
            )}
          </div>

          {/* Right: Testimonial Rail */}
          <div className="lg:sticky lg:top-8 space-y-6">
            {/* Social Proof Banner */}
            <div className="bg-gradient-to-r from-primary-main to-secondary-main text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
              </div>
              <p className="text-lg font-semibold mb-1">Trusted by 500+ UK businesses</p>
              <p className="text-white/90 text-sm">Join companies saving an average of £2,400/month</p>
            </div>

            {/* Rotating Testimonials */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-light/20" />

              <div className="relative z-10 space-y-6">
                {/* Testimonial Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-secondary-light rounded-full flex items-center justify-center text-3xl">
                      {testimonials[currentTestimonial].logo}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-darkText">
                        {testimonials[currentTestimonial].author}
                      </p>
                      <p className="text-sm text-neutral-mediumText">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>

                  <p className="text-neutral-mediumText leading-relaxed italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>

                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    {testimonials[currentTestimonial].metric}
                  </div>
                </div>

                {/* Testimonial Dots */}
                <div className="flex justify-center gap-2 pt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'bg-primary-main w-8'
                          : 'bg-neutral-mediumText/30'
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <p className="text-2xl font-bold text-primary-main mb-1">98%</p>
                <p className="text-xs text-neutral-mediumText">Accuracy Rate</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <p className="text-2xl font-bold text-primary-main mb-1">24/7</p>
                <p className="text-xs text-neutral-mediumText">AI Availability</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <p className="text-2xl font-bold text-primary-main mb-1">GDPR</p>
                <p className="text-xs text-neutral-mediumText">UK Compliant</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <p className="text-2xl font-bold text-primary-main mb-1">5 min</p>
                <p className="text-xs text-neutral-mediumText">Setup Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
