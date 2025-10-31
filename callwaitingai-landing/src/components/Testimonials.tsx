import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'CEO, TechStart Solutions',
      company: 'TechStart Solutions',
      content: "CallWaiting AI transformed our customer service. We've seen a 40% increase in lead conversion since implementing their AI receptionist. It's like having a dedicated team member who never sleeps.",
      rating: 5,
      image: null, // Could add avatar images later
    },
    {
      name: 'James Thompson',
      role: 'Operations Director, Prime Services',
      company: 'Prime Services',
      content: "The best investment we've made this year. Every call is answered professionally, and we never miss an opportunity. The lead qualification feature alone pays for itself.",
      rating: 5,
      image: null,
    },
    {
      name: 'Emma Williams',
      role: 'Founder, Growth Marketing Agency',
      company: 'Growth Marketing Agency',
      content: "As a small business owner, I can't afford to miss calls. CallWaiting AI ensures every potential customer is handled with care, even when I'm in meetings. It's given me peace of mind.",
      rating: 5,
      image: null,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Trusted by UK Businesses</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">What Our Clients</span>
            <br />
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of UK businesses that trust CallWaiting AI to handle their customer calls professionally.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 animate-fade-in border border-gray-100"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-12 h-12 text-[#D4AF37]/20" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-6">
                <p className="font-bold text-[#1E3A5F] text-lg mb-1">
                  {testimonial.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {testimonial.role}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">500+</div>
            <p className="text-gray-600 font-medium">Active Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">50K+</div>
            <p className="text-gray-600 font-medium">Calls Handled</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">98%</div>
            <p className="text-gray-600 font-medium">Satisfaction</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1E3A5F] mb-2 font-['Playfair_Display']">24/7</div>
            <p className="text-gray-600 font-medium">Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

