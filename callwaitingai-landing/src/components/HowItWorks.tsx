import { Phone, FileText, Brain, Volume2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Phone,
      number: '01',
      title: 'Incoming Call',
      description: 'Customer calls your business number',
      gradient: 'from-primary-blue to-primary-green',
    },
    {
      icon: FileText,
      number: '02',
      title: 'Real-Time Transcription',
      description: 'Speech is converted to text instantly',
      gradient: 'from-primary-blue/80 to-primary-green/80',
    },
    {
      icon: Brain,
      number: '03',
      title: 'AI Processing',
      description: 'AI generates natural, context-aware responses',
      gradient: 'from-primary-green/70 to-primary-blue/70',
    },
    {
      icon: Volume2,
      number: '04',
      title: 'Voice Response',
      description: 'Natural voice response completes the conversation',
      gradient: 'from-primary-green to-primary-blue',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            <span className="gradient-text">How it works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualizing the customer journey step by step
          </p>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-24 left-0 right-0 h-1 gradient-bg opacity-20"></div>

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Number Badge */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mb-6 mx-auto`}
                    >
                      <span className="text-2xl font-black text-white">{step.number}</span>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} opacity-10 rounded-2xl flex items-center justify-center`}>
                        <step.icon className="w-10 h-10 text-primary-blue" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">
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
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-start space-x-6">
                  {/* Number Badge */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-2xl font-black text-white">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <step.icon className="w-6 h-6 text-primary-blue mr-3" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Line for Mobile */}
              {index < steps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 gradient-bg opacity-30"></div>
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
