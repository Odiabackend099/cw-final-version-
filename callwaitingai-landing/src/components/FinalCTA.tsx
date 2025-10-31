import { Link } from 'react-router-dom';
import { UserPlus, Sparkles, Shield, Clock } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#0F2438] relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
      
      {/* Gold accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 px-6 py-2.5 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-semibold text-white">
              Start Your Free Trial Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="font-['Playfair_Display']">Ready to Never</span>
            <br />
            <span className="font-['Playfair_Display'] bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Miss a Call?</span>
          </h2>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join forward-thinking UK businesses using CallWaiting AI to handle every customer call with precision and professionalism—24/7.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="group bg-white text-[#1E3A5F] font-bold px-12 py-5 rounded-xl shadow-premium-lg hover:shadow-premium-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Start Free Trial</span>
              <span className="text-[#1E3A5F]/60 group-hover:text-[#1E3A5F] transition-colors">→</span>
            </Link>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'chat' } }))}
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 font-bold px-12 py-5 rounded-xl hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>Try AI Assistant</span>
            </button>
          </div>

          {/* Premium Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-semibold text-white">GDPR Compliant</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <Clock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-semibold text-white">5 Min Setup</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-semibold text-white">50 Free Minutes</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-semibold text-white">No Credit Card</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

