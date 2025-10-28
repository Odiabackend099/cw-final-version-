import { useState } from 'react';
import { Phone, Sparkles, Clock, Target, Loader2 } from 'lucide-react';
import { vapiService } from '../lib/vapi';

const Hero = () => {
  const [isCallingVapi, setIsCallingVapi] = useState(false);
  const [callError, setCallError] = useState('');

  const handleVapiCall = async () => {
    setIsCallingVapi(true);
    setCallError('');
    
    try {
      await vapiService.initiateCall();
    } catch (error: any) {
      console.error('Vapi call failed:', error);
      setCallError('Voice call unavailable. Using direct dial...');
      // Fallback to direct phone call
      setTimeout(() => {
        vapiService.dialDirect();
      }, 1500);
    } finally {
      setIsCallingVapi(false);
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden circuit-pattern bg-gradient-to-b from-neutral-lightBg to-white pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 gradient-subtle px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-blue" />
              <span className="text-sm font-medium text-primary-blue">
                100% Free to Start - No Credit Card Required
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span className="gradient-text">AI-Powered Voice</span>
              <br />
              Receptionist
            </h1>

            <p className="text-2xl font-semibold text-gray-700">
              Never miss a paying call again
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              AI voice receptionist that answers, qualifies, and books calls for your business 24/7. 
              Built for UK businesses that value every customer.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleVapiCall}
                disabled={isCallingVapi}
                className="bg-gradient-primary text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCallingVapi ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    <span>Talk to Our AI - Free Demo</span>
                  </>
                )}
              </button>
            </div>

            {/* Call Error Message */}
            {callError && (
              <div className="bg-status-info/10 border border-status-info/20 text-status-info px-4 py-3 rounded-xl text-sm">
                {callError}
              </div>
            )}

            {/* Contact Info */}
            <p className="text-gray-600 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Or call us directly: </span>
              <a href="tel:+12765825329" className="text-primary-blue font-semibold hover:underline">
                +1 (276) 582-5329
              </a>
            </p>
          </div>

          {/* Right Content - Trust Badges */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100</h3>
              <p className="text-gray-600 font-medium">Free Calls</p>
              <p className="text-sm text-gray-500 mt-1">No credit card required</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-green/80 to-primary-blue/80 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5 min</h3>
              <p className="text-gray-600 font-medium">Setup Time</p>
              <p className="text-sm text-gray-500 mt-1">Get started instantly</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-primary-green rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600 font-medium">Accuracy Rate</p>
              <p className="text-sm text-gray-500 mt-1">AI-powered precision</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-blue/70 to-primary-green/70 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600 font-medium">Always Available</p>
              <p className="text-sm text-gray-500 mt-1">Never miss a call</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
