import { Link } from 'react-router-dom';
import { UserPlus, Sparkles, Shield, Clock } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-20 bg-transparent relative">

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Start your free trial today
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Ready to never miss a call?
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join UK businesses using CallWaitingAI to handle every customer call professionally, 24/7.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="bg-white text-primary-blue font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Start Free Trial</span>
            </Link>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openChatWidget', { detail: { mode: 'chat' } }))}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold px-8 py-4 rounded-xl hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Try the AI Now</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-white">GDPR Compliant</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-white">5 Min Setup</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-center mb-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-white">50 Free Minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-white">No Credit Card</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

