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
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            <span className="gradient-text">See it in action</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize how CallWaitingAI runs for your business
          </p>
        </div>

        {/* Visualization Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {visualizations.map((viz, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border-2 border-primary-blue/20 rounded-3xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon with Animation */}
              <div
                className={`w-20 h-20 bg-gradient-to-r ${viz.gradient} rounded-2xl flex items-center justify-center mb-6 animate-pulse-slow`}
              >
                <viz.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {viz.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {viz.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-r from-primary-blue to-primary-green opacity-10 rounded-full blur-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Visualization;
