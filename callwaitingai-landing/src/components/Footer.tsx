import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/images/callwaiting ai logo.jpeg"
              alt="CallWaitingAI"
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 leading-relaxed">
              AI-powered voice receptionist built for UK businesses that value every customer interaction.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:odiabackend@gmail.com" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="tel:+12765825329" className="hover:text-white transition-colors">
                  Call Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  UK GDPR Compliant
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Statement */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-gray-500 text-xs leading-relaxed max-w-4xl">
            <strong className="text-gray-400">PECR Compliance:</strong> We will only send you marketing emails or SMS messages with your explicit consent. You can opt out at any time. Service-related communications (call logs, billing alerts) are sent as part of our contractual obligation. We process your data in accordance with UK GDPR and PECR regulations. Data is stored securely in EU/UK regions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2025 CallWaitingAI Limited. All rights reserved. Company Registration: [TBD]
          </p>
          <div className="flex items-center space-x-6">
            <a href="tel:+12765825329" className="text-gray-400 hover:text-white transition-colors text-sm">
              +1 (276) 582-5329
            </a>
            <a href="mailto:odiabackend@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
