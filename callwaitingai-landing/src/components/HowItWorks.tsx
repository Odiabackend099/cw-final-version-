import { Phone, FileText, Brain, Volume2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Phone,
      number: '01',
      title: 'Incoming Call',
      description: 'Customer calls your business number',
      gradient: 'from-primary-blue to-primary-green',
      image: '/images/1.png',
    },
    {
      icon: FileText,
      number: '02',
      title: 'Real-Time Transcription',
      description: 'Speech is converted to text instantly',
      gradient: 'from-primary-blue/80 to-primary-green/80',
      image: '/images/2.png',
    },
    {
      icon: Brain,
      number: '03',
      title: 'AI Processing',
      description: 'AI generates natural, context-aware responses',
      gradient: 'from-primary-green/70 to-primary-blue/70',
      image: '/images/3.png',
    },
    {
      icon: Volume2,
      number: '04',
      title: 'Voice Response',
      description: 'Natural voice response completes the conversation',
      gradient: 'from-primary-green to-primary-blue',
      image: '/images/4.png',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Simple Process</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">How It Works</span>
            <br />
            <span className="gradient-text">In 4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how CallWaiting AI transforms every customer call into a qualified opportunity.
          </p>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-[#1E3A5F]/10 via-[#10B981]/30 to-[#1E3A5F]/10"></div>

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100 group">
                    {/* Number Badge */}
                    <div className="w-20 h-20 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white font-['Playfair_Display']">{step.number}</span>
                    </div>

                    {/* Section Image */}
                    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#1E3A5F]/10 to-[#10B981]/10 rounded-2xl flex items-center justify-center group-hover:from-[#1E3A5F]/20 group-hover:to-[#10B981]/20 transition-all duration-300">
                        <step.icon className="w-10 h-10 text-[#1E3A5F]" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-[#1E3A5F] text-center leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
                  <div className="bg-white rounded-3xl p-8 shadow-premium overflow-hidden border border-gray-100">
                {/* Number Badge */}
                <div className="w-20 h-20 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl font-bold text-white font-['Playfair_Display']">{step.number}</span>
                </div>

                {/* Section Image */}
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <step.icon className="w-6 h-6 text-[#1E3A5F] mr-3" />
                    <h3 className="text-2xl font-bold text-[#1E3A5F]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line for Mobile */}
              {index < steps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#1E3A5F] to-[#10B981] opacity-30"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
