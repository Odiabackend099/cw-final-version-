import { Link } from 'react-router-dom';
import CallWaitingLogo from './CallWaitingLogo';

const Footer = () => {
  return (
    <footer className="bg-[#0F2438] text-gray-300 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <CallWaitingLogo size="md" showText={true} invertColors={true} />
            </div>
            <p className="text-gray-400 leading-relaxed text-base">
              Premium AI-powered voice receptionist built for UK businesses that value every customer interaction.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:odiabackend@gmail.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="tel:+12765825329" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Call Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  UK GDPR Compliant
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Statement */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <p className="text-gray-500 text-sm leading-relaxed max-w-4xl">
            <strong className="text-gray-300">PECR Compliance:</strong> We will only send you marketing emails or SMS messages with your explicit consent. You can opt out at any time. Service-related communications (call logs, billing alerts) are sent as part of our contractual obligation. We process your data in accordance with UK GDPR and PECR regulations. Data is stored securely in EU/UK regions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © 2025 CallWaitingAI Limited. All rights reserved.
          </p>
          <div className="flex items-center space-x-8">
            <a href="tel:+12765825329" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-medium">
              +1 (276) 582-5329
            </a>
            <a href="mailto:odiabackend@gmail.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
