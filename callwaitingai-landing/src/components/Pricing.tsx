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
    console.log(`Redirecting to payment for ${planName}`);
    
    // Redirect to Flutterwave payment link
    window.open(paymentLink, '_blank');
  };

  return (
    <section id="pricing" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            Simple, <span className="gradient-text-new">transparent pricing</span>
          </h2>
          <p className="text-xl text-neutral-darkGray max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/85 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 animate-fade-in shadow-lg border border-white/30 ${
                plan.highlighted
                  ? 'border-2 border-primary-blue shadow-2xl scale-105 hover:scale-105'
                  : 'border border-neutral-lightGray hover:border-primary-blue hover:shadow-xl hover:-translate-y-2'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Featured Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-neutral-darker mb-2 drop-shadow-sm">{plan.name}</h3>
                <p className="text-neutral-darkGray mb-6 drop-shadow-sm">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black text-neutral-darker drop-shadow-sm">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xl text-neutral-gray ml-2 drop-shadow-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-neutral-darkGray drop-shadow-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePayment(plan.paymentLink, plan.name)}
                className={`w-full font-bold py-4 rounded-xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-primary text-white hover:bg-gradient-primary-hover hover:shadow-xl hover:scale-105'
                    : 'border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-neutral-darkGray mb-6">
            Trusted by businesses across the UK
          </p>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-neutral-darkGray">
              <Check className="w-5 h-5 text-status-success" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-darkGray">
              <Check className="w-5 h-5 text-status-success" />
              <span className="font-medium">Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-darkGray">
              <Check className="w-5 h-5 text-status-success" />
              <span className="font-medium">GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-darkGray">
              <Check className="w-5 h-5 text-status-success" />
              <span className="font-medium">Secure payments via Flutterwave</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
