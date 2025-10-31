import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mic, Send, X, Phone } from 'lucide-react';
import { supabase, VAPI_CONFIG } from '../lib/supabase';
import Vapi from '@vapi-ai/web';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [vapiClient, setVapiClient] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Vapi client - use env variable if set, otherwise fallback to VAPI_CONFIG
    const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey;
    try {
      const client = new Vapi(vapiPublicKey);
      setVapiClient(client);
      
      // Set up event listeners
      client.on('call-start', () => {
        console.log('Voice call started');
        setIsVoiceActive(true);
      });

      client.on('call-end', () => {
        console.log('Voice call ended');
        setIsVoiceActive(false);
      });

      client.on('error', (error: any) => {
        console.error('Vapi error:', error);
        setIsVoiceActive(false);
      });
    } catch (error) {
      console.error('Error initializing Vapi:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadChatHistory() {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Add welcome message from Marcy
        const welcomeMessage = {
          id: crypto.randomUUID(),
          session_id: sessionId,
          sender_type: 'assistant',
          message_text: "Hello! I'm Marcy, your CallWaitingAI assistant. I can help you manage calls, capture leads, and answer questions. How can I assist you today?",
          message_type: 'text',
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        
        // Save welcome message
        await supabase.from('chat_messages').insert(welcomeMessage);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      sender_type: 'user',
      message_text: inputMessage,
      message_type: 'text',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert(userMessage);

      // Call Groq AI chat function
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: {
          messages: [
            { role: 'user', content: currentInput }
          ],
          sessionId: sessionId
        }
      });

      if (error) {
        console.error('Chat error:', error);
        throw error;
      }

      // Add AI response to messages
      const aiResponse = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        sender_type: 'assistant',
        message_text: data?.data?.message || 'I apologize, but I encountered an error. Please try again.',
        message_type: 'text',
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackResponse = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        sender_type: 'assistant',
        message_text: "I'm currently unable to process your request. Please try again or contact support if the issue persists.",
        message_type: 'text',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsSending(false);
    }
  }

  async function startVoiceCall() {
    if (!vapiClient) {
      alert('Voice assistant is initializing. Please try again in a moment.');
      return;
    }

    try {
      setIsVoiceActive(true);
      
      // Start Vapi call with the configured assistant from VAPI_CONFIG
      await vapiClient.start(VAPI_CONFIG.assistantId);

    } catch (error) {
      console.error('Error starting voice call:', error);
      setIsVoiceActive(false);
      alert('Failed to start voice call. Please check your microphone permissions and try again.');
    }
  }

  function stopVoiceCall() {
    if (vapiClient) {
      vapiClient.stop();
    }
    setIsVoiceActive(false);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="pr-2 font-medium">Chat with Marcy</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Marcy - AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {isVoiceActive ? 'Voice call active' : 'Always here to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={isVoiceActive ? stopVoiceCall : startVoiceCall}
                className={`p-2 rounded-full transition-colors ${
                  isVoiceActive 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isVoiceActive ? 'End voice call' : 'Start voice call'}
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender_type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending}
                placeholder={isSending ? "Marcy is typing..." : "Type your message..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
