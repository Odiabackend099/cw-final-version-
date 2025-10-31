import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CallWaitingLogo from './CallWaitingLogo';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-lg shadow-premium border-b border-gray-100'
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <CallWaitingLogo size="lg" showText={true} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors text-sm uppercase tracking-wide"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors text-sm uppercase tracking-wide"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors text-sm uppercase tracking-wide"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors text-sm uppercase tracking-wide"
            >
              Testimonials
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#1E3A5F] to-[#10B981] text-white font-bold px-8 py-2.5 rounded-full hover:shadow-premium-lg hover:scale-105 transition-all duration-300 text-sm"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-premium animate-slide-down">
          <div className="px-6 py-6 space-y-4">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors py-2"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors py-2"
            >
              Testimonials
            </button>
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left text-[#1E3A5F] hover:text-[#10B981] font-semibold transition-colors py-2"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-[#1E3A5F] to-[#10B981] text-white font-bold px-6 py-3 rounded-full hover:shadow-premium-lg transition-all"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
