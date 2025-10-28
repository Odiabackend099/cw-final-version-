import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Phone, Send, Loader2 } from 'lucide-react';
import { chatService, ChatMessage } from '../lib/chat';
import { vapiService } from '../lib/vapi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Marcy, your AI receptionist. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallingVapi, setIsCallingVapi] = useState(false);
  const [sessionId] = useState(() => `landing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to chat
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Get AI response
      const chatMessages: ChatMessage[] = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await chatService.sendMessage(chatMessages, sessionId);

      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: aiResponse },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting right now. Please try calling us directly at +1 (276) 582-5329 or email support.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessage(action);
    // Simulate a small delay before sending
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleVoiceCall = async () => {
    setIsCallingVapi(true);
    
    try {
      await vapiService.initiateCall();
    } catch (error) {
      console.error('Vapi call failed, using fallback:', error);
      // Fallback to direct phone call
      vapiService.dialDirect();
    } finally {
      setIsCallingVapi(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 gradient-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden border border-gray-200 max-w-[calc(100vw-3rem)]">
          {/* Header */}
          <div className="gradient-bg text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Chat with Marcy</h3>
                <p className="text-sm text-white/80">AI Receptionist</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setIsVoiceMode(false)}
              className={`flex-1 py-3 font-semibold transition-colors ${
                !isVoiceMode
                  ? 'text-brand-purple border-b-2 border-brand-purple'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setIsVoiceMode(true)}
              className={`flex-1 py-3 font-semibold transition-colors ${
                isVoiceMode
                  ? 'text-brand-purple border-b-2 border-brand-purple'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Voice
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {!isVoiceMode ? (
              <div className="space-y-4">
                {/* Chat Messages */}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${
                      msg.role === 'user'
                        ? 'ml-auto bg-gradient-to-r from-brand-purple to-brand-blue text-white'
                        : 'bg-white text-gray-700'
                    } rounded-2xl p-4 shadow-sm max-w-[85%] ${
                      msg.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%]">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Marcy is typing...</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions (only show initially) */}
                {messages.length === 1 && !isLoading && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Quick actions:</p>
                    <button
                      onClick={() => handleQuickAction('I would like to schedule a demo')}
                      className="w-full text-left bg-white rounded-xl p-3 hover:bg-purple-50 transition-colors text-gray-700 text-sm"
                    >
                      Schedule a demo
                    </button>
                    <button
                      onClick={() => handleQuickAction('Can you tell me about your pricing plans?')}
                      className="w-full text-left bg-white rounded-xl p-3 hover:bg-purple-50 transition-colors text-gray-700 text-sm"
                    >
                      Get pricing information
                    </button>
                    <button
                      onClick={() => handleQuickAction('I need help getting started')}
                      className="w-full text-left bg-white rounded-xl p-3 hover:bg-purple-50 transition-colors text-gray-700 text-sm"
                    >
                      Talk to support
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className={`w-32 h-32 gradient-bg rounded-full flex items-center justify-center ${isCallingVapi ? 'animate-pulse' : ''}`}>
                  <Phone className="w-16 h-16 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Talk to Marcy
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Experience our AI voice assistant firsthand
                  </p>
                  <button
                    onClick={handleVoiceCall}
                    disabled={isCallingVapi}
                    className="gradient-bg text-white font-bold px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center mx-auto"
                  >
                    {isCallingVapi ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Start Voice Call'
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Or call: +1 (276) 582-5329
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area (only in chat mode) */}
          {!isVoiceMode && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="gradient-bg text-white p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
