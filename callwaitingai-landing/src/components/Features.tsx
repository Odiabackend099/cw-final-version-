import { Phone, Brain, Target, BarChart3, Zap, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Phone,
      title: '24/7 Call Handling',
      description: 'Never miss a call again. Our AI answers instantly, any time of day or night.',
      gradient: 'from-primary-blue to-primary-green',
    },
    {
      icon: Brain,
      title: 'Smart AI Responses',
      description: 'Natural conversations powered by advanced LLMs that understand your business.',
      gradient: 'from-primary-blue/80 to-primary-green/80',
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'Automatically qualify and categorize leads based on conversation intent.',
      gradient: 'from-primary-green/70 to-primary-blue/70',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track call volume, conversions, and performance with live dashboards.',
      gradient: 'from-primary-green to-primary-blue',
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Get your AI receptionist running in under 5 minutes. No technical knowledge required.',
      gradient: 'from-primary-blue/60 to-primary-green/60',
    },
    {
      icon: Shield,
      title: 'UK Data Security',
      description: 'GDPR compliant with all data stored securely within the UK.',
      gradient: 'from-primary-green/50 to-primary-blue/50',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Enterprise-Grade Features</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">Everything You Need</span>
            <br />
            <span className="gradient-text">To Convert Every Call</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful features crafted for UK businesses that understand the value of exceptional customer experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-premium-lg hover:-translate-y-3 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1E3A5F] leading-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
