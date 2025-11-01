import { Check, Sparkles } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      paymentLink: 'https://flutterwave.com/pay/li0eqvf5i9xx',
      features: [
        '500 call minutes per month',
        '$0.15/min overage rate',
        'Basic AI responses',
        'Email support (48h response)',
        'Analytics dashboard',
        'Lead capture',
        'Call recording & transcripts',
        'Basic voice assistant',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$80',
      period: '/month',
      description: 'For growing businesses that need more',
      paymentLink: 'https://flutterwave.com/pay/gickbfzxhjyt',
      features: [
        '1,500 call minutes per month',
        '$0.12/min overage rate',
        'Advanced AI with custom training',
        'Priority support (24h response)',
        'Advanced analytics & reporting',
        'CRM integration',
        'Custom voice personalities (ODIADEV TTS)',
        'Telegram notifications',
        'API access',
        'Advanced voice assistant',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Pro',
      price: '$180',
      period: '/month',
      description: 'For high-volume businesses',
      paymentLink: 'https://flutterwave.com/pay/fw9btqrzmeq8',
      features: [
        '5,000 call minutes per month',
        '$0.10/min overage rate',
        'Everything in Professional',
        'Phone + email support (4h response)',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solution',
        'SLA guarantee (99.5% uptime)',
        'Advanced security & compliance',
        'Custom AI models',
        'Voice cloning (with consent)',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
  ];

  const handlePayment = (paymentLink: string, planName: string) => {
    // Track payment intent
    if (import.meta.env.DEV) console.log(`Redirecting to payment for ${planName}`);

    // Redirect to Flutterwave payment link
    window.open(paymentLink, '_blank');
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Transparent Pricing</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">Simple,</span>
            <br />
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your business needs. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-500 animate-fade-in ${
                plan.highlighted
                  ? 'shadow-premium-lg border-2 border-[#D4AF37] scale-105 hover:scale-[1.07]'
                  : 'shadow-premium border border-gray-100 hover:border-[#1E3A5F]/30 hover:shadow-premium-lg hover:-translate-y-3'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Featured Badge */}
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-gold px-6 py-2.5 rounded-full flex items-center space-x-2 shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="text-3xl font-bold text-[#1E3A5F] mb-3 font-['Playfair_Display']">{plan.name}</h3>
                <p className="text-gray-600 mb-8">{plan.description}</p>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-6xl font-bold text-[#1E3A5F] font-['Playfair_Display']">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xl text-gray-500 ml-2 font-medium">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center mr-3 mt-0.5 shadow-md">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan.paymentLink, plan.name)}
                className={`w-full font-bold py-5 rounded-xl transition-all duration-300 text-lg ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-[#1E3A5F] to-[#10B981] text-white hover:shadow-premium-lg hover:scale-[1.02] shadow-premium'
                    : 'border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white hover:shadow-lg'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-20 text-center animate-fade-in">
          <p className="text-gray-600 mb-8 text-lg font-medium">
            Trusted by businesses across the UK
          </p>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-6">
            <div className="flex items-center space-x-2 text-[#1E3A5F]">
              <div className="w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 text-[#1E3A5F]">
              <div className="w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2 text-[#1E3A5F]">
              <div className="w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-[#1E3A5F]">
              <div className="w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
