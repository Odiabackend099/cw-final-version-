import { Phone, MessageSquare, Users, Bell } from 'lucide-react';

const Visualization = () => {
  const visualizations = [
    {
      icon: Phone,
      title: 'Call Reception',
      description: 'AI assistant greeting and qualifying incoming calls',
      gradient: 'from-primary-blue to-primary-green',
    },
    {
      icon: MessageSquare,
      title: 'Conversation Flow',
      description: 'Natural dialogue between customer and AI receptionist',
      gradient: 'from-primary-blue/80 to-primary-green/80',
    },
    {
      icon: Users,
      title: 'Lead Qualification',
      description: 'AI identifies high-value prospects in real-time',
      gradient: 'from-primary-green/70 to-primary-blue/70',
    },
    {
      icon: Bell,
      title: 'Team Notification',
      description: 'Instant alerts sent to sales and support teams',
      gradient: 'from-primary-green to-primary-blue',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Real-Time Operation</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">See It In</span>
            <br />
            <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Visualize how CallWaiting AI seamlessly operates for your business, delivering exceptional customer experiences.
          </p>
        </div>

        {/* Visualization Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {visualizations.map((viz, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-10 hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-3 animate-fade-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon with Animation */}
              <div className="w-20 h-20 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <viz.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3 leading-tight">
                {viz.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {viz.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-r from-[#1E3A5F] to-[#10B981] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Visualization;
