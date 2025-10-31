import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does CallWaitingAI work?',
      answer: 'CallWaitingAI uses advanced AI to answer your business calls 24/7. When a customer calls, our AI receptionist greets them, understands their needs, qualifies leads, and can even book appointments or take messages. All conversations are transcribed and saved to your dashboard.',
    },
    {
      question: 'How long does setup take?',
      answer: 'Setup takes just 5 minutes. Simply sign up, configure your AI assistant with custom instructions, and connect your phone number. Our system will be ready to handle calls immediately.',
    },
    {
      question: 'Can I customize the AI responses?',
      answer: 'Yes! You can fully customize your AI receptionist\'s personality, responses, and behavior through our dashboard. Add custom instructions, set up call routing rules, and define how leads should be qualified.',
    },
    {
      question: 'What happens if the AI can\'t answer a question?',
      answer: 'The AI is designed to handle most common questions. If it encounters something it can\'t handle, it can take a message, schedule a callback, or transfer the call to your team based on your preferences.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All data is stored securely in UK/EU regions, and we\'re fully GDPR compliant. Call recordings and transcripts are encrypted and only accessible to authorized users in your account.',
    },
    {
      question: 'Can I try it before committing?',
      answer: 'Yes! All plans include a 14-day free trial with 50 free call minutes. No credit card required to start your trial. Cancel anytime.',
    },
    {
      question: 'What phone numbers are supported?',
      answer: 'We support UK phone numbers. You can port your existing number or get a new one through our platform. Contact us for details on number setup.',
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our AI achieves 98% accuracy in understanding customer intent and responding appropriately. It uses advanced language models trained specifically for business conversations.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#1E3A5F]">Get Answers</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1E3A5F]">Frequently Asked</span>
            <br />
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about CallWaiting AI and how it can transform your customer service.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-[#1E3A5F] pr-4 leading-tight">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:odiabackend@gmail.com"
              className="text-primary-blue font-semibold hover:underline"
            >
              Email Support
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="tel:+12765825329"
              className="text-primary-blue font-semibold hover:underline"
            >
              Call Us: +1 (276) 582-5329
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

