import { Link } from 'react-router-dom';
import { Phone, Sparkles, Clock, Target, MessageSquare, Shield, UserPlus } from 'lucide-react';

const Hero = () => {
  const handleTryTextChat = () => {
    window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'chat' } }));
  };

  const handleTryVoiceCall = () => {
    window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'voice' } }));
  };

  return (
    <section id="hero" className="min-h-screen flex items-center relative pt-16">
      {/* Hero content - no background, uses parent fixed background */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium text-white">
                50 Free Call Minutes • Cancel Anytime
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span className="gradient-text drop-shadow-lg">AI-Powered Voice</span>
              <br />
              <span className="text-white drop-shadow-lg">Receptionist</span>
            </h1>

            <p className="text-2xl font-semibold text-white drop-shadow-md">
              Never miss a paying call again
            </p>

            <p className="text-lg text-gray-100 leading-relaxed drop-shadow-sm">
              AI voice receptionist that answers, qualifies, and books calls for your business 24/7.
              Built for UK businesses that value every customer.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="bg-gradient-primary text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Start Free Trial</span>
              </Link>

              <button
                onClick={handleTryTextChat}
                className="bg-white text-primary-main border-2 border-primary-main font-bold px-8 py-4 rounded-xl hover:bg-primary-light hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Try the AI (Text)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-100">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="font-medium">UK GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-100">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="font-medium">98% Uptime</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-100">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>

            {/* Contact Info */}
            <p className="text-gray-100 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Or call us directly: </span>
              <a href="tel:+12765825329" className="text-blue-300 font-semibold hover:text-blue-200 hover:underline transition-colors">
                +1 (276) 582-5329
              </a>
            </p>
          </div>

          {/* Right Content - Trust Badges */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in relative z-10">
            <div className="bg-transparent backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/30">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">50</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Free Minutes</p>
              <p className="text-sm text-gray-600 mt-1 drop-shadow-sm">Start your trial</p>
            </div>

            <div className="bg-transparent backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-green/80 to-primary-blue/80 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">5 min</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Setup Time</p>
              <p className="text-sm text-gray-600 mt-1 drop-shadow-sm">Get started instantly</p>
            </div>

            <div className="bg-transparent backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-primary-green rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">98%</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Accuracy Rate</p>
              <p className="text-sm text-gray-600 mt-1 drop-shadow-sm">AI-powered precision</p>
            </div>

            <div className="bg-transparent backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-blue/70 to-primary-green/70 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">24/7</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Always Available</p>
              <p className="text-sm text-gray-600 mt-1 drop-shadow-sm">Never miss a call</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
