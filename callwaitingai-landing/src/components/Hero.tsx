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
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white pt-20 pb-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #1E3A5F 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#F5A623]/10 border border-[#D4AF37]/20 px-5 py-2.5 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#1E3A5F]">
                <span className="text-[#D4AF37]">50 Free Minutes</span> • No Credit Card Required
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight">
                <span className="text-[#1E3A5F]">Never Miss</span>
                <br />
                <span className="gradient-text">A Paying Call</span>
                <br />
                <span className="text-[#1E3A5F]">Again</span>
              </h1>

              <p className="text-2xl lg:text-3xl font-medium text-gray-700 leading-relaxed max-w-xl">
                Professional AI receptionist that answers, qualifies, and converts calls for UK businesses—24/7.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Join forward-thinking businesses using CallWaiting AI to handle every customer call with precision, 
                turning missed opportunities into qualified leads and closed deals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-[#1E3A5F] to-[#10B981] text-white font-bold px-10 py-5 rounded-xl shadow-premium-lg hover:shadow-premium-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
              >
                <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Free Trial</span>
                <span className="text-white/80 group-hover:text-white transition-colors">→</span>
              </Link>

              <button
                onClick={handleTryTextChat}
                className="bg-white text-[#1E3A5F] border-2 border-[#1E3A5F]/20 font-bold px-10 py-5 rounded-xl hover:border-[#1E3A5F] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Try AI Assistant</span>
              </button>
            </div>
            
            {/* Premium Trust Indicator */}
            <div className="pt-4 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="font-medium">98% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
            </div>

            {/* Contact Info */}
            <p className="text-gray-600 flex items-center space-x-2 pt-2">
              <Phone className="w-4 h-4 text-[#1E3A5F]" />
              <span>Questions? Call us: </span>
              <a href="tel:+12765825329" className="text-[#1E3A5F] font-semibold hover:text-[#10B981] hover:underline transition-colors">
                +1 (276) 582-5329
              </a>
            </p>
          </div>

          {/* Right Content - Premium Stats Cards */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 group border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">50</h3>
              <p className="text-[#1E3A5F] font-semibold text-base mb-1">Free Minutes</p>
              <p className="text-sm text-gray-500">Start your trial today</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 group border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">5 min</h3>
              <p className="text-[#1E3A5F] font-semibold text-base mb-1">Setup Time</p>
              <p className="text-sm text-gray-500">Get started instantly</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 group border border-gray-100">
              <div className="w-14 h-14 bg-gradient-gold rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">98%</h3>
              <p className="text-[#1E3A5F] font-semibold text-base mb-1">Accuracy</p>
              <p className="text-sm text-gray-500">AI-powered precision</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 group border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">24/7</h3>
              <p className="text-[#1E3A5F] font-semibold text-base mb-1">Always On</p>
              <p className="text-sm text-gray-500">Never miss a call</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
