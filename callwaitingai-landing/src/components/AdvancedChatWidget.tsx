import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Mic, MicOff, Send, Loader2, Volume2 } from 'lucide-react';
import { chatService, ChatMessage } from '../lib/chat';
import Vapi from '@vapi-ai/web';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TranscriptEntry {
  type: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

const AdvancedChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');

  // Chat state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Marcy, your AI receptionist. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `landing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Voice state
  const [vapiClient, setVapiClient] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize Vapi
  useEffect(() => {
    const VAPI_PUBLIC_KEY = 'ddd720c5-6fb8-4174-b7a6-729d7b308cb9';
    const VAPI_ASSISTANT_ID = 'fdaaa6f7-a204-4c08-99fd-20451c96fc74';

    try {
      const client = new Vapi(VAPI_PUBLIC_KEY);
      setVapiClient(client);

      // Voice call events
      client.on('call-start', () => {
        console.log('✅ Voice call started');
        setIsCallActive(true);
        setIsConnecting(false);
        setIsListening(true);
      });

      client.on('call-end', () => {
        console.log('📞 Voice call ended');
        setIsCallActive(false);
        setIsConnecting(false);
        setIsListening(false);
        setIsSpeaking(false);
        stopAudioVisualization();
      });

      // Speech recognition events (user speaking)
      client.on('speech-start', () => {
        console.log('🎤 User started speaking');
        setIsListening(true);
        setIsSpeaking(false);
      });

      client.on('speech-end', () => {
        console.log('🎤 User stopped speaking');
        setIsListening(false);
      });

      // Transcription events
      client.on('message', (message: any) => {
        console.log('📝 Vapi message:', message);

        if (message.type === 'transcript' && message.transcriptType === 'partial') {
          // User's speech (partial - real-time)
          if (message.transcript && message.role === 'user') {
            setTranscripts(prev => {
              const filtered = prev.filter(t => t.isFinal || t.type !== 'user');
              return [...filtered, {
                type: 'user',
                text: message.transcript,
                timestamp: Date.now(),
                isFinal: false
              }];
            });
          }
        } else if (message.type === 'transcript' && message.transcriptType === 'final') {
          // User's speech (final)
          if (message.transcript && message.role === 'user') {
            setTranscripts(prev => {
              const filtered = prev.filter(t => !(t.type === 'user' && !t.isFinal));
              return [...filtered, {
                type: 'user',
                text: message.transcript,
                timestamp: Date.now(),
                isFinal: true
              }];
            });
          }
        }
      });

      // AI response events
      client.on('message', (message: any) => {
        // AI is speaking - but DON'T transcribe it to avoid echo
        if (message.type === 'function-call' || message.type === 'speech-update') {
          setIsSpeaking(true);
          setIsListening(false);
        }
      });

      client.on('error', (error: any) => {
        console.error('❌ Vapi error:', error);
        setIsCallActive(false);
        setIsConnecting(false);
        stopAudioVisualization();
      });

    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
    }

    return () => {
      if (vapiClient) {
        vapiClient.stop();
      }
      stopAudioVisualization();
    };
  }, []);

  // Audio visualization
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      updateAudioLevel();
    } catch (error) {
      console.error('Failed to get audio stream:', error);
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(Math.min(100, (average / 255) * 100 * 2));

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, transcripts]);

  // Chat handlers
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatMessages: ChatMessage[] = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await chatService.sendMessage(chatMessages, sessionId);

      setMessages([
        ...newMessages,
        { role: 'assistant', content: aiResponse, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting. Please try again or call +1 (276) 582-5329.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice handlers
  const startVoiceCall = async () => {
    if (!vapiClient || isConnecting || isCallActive) return;

    setIsConnecting(true);
    setTranscripts([]);

    try {
      await startAudioVisualization();
      await vapiClient.start('fdaaa6f7-a204-4c08-99fd-20451c96fc74');
    } catch (error) {
      console.error('Failed to start voice call:', error);
      setIsConnecting(false);
      stopAudioVisualization();
    }
  };

  const stopVoiceCall = () => {
    if (vapiClient) {
      vapiClient.stop();
    }
    setIsCallActive(false);
    setIsConnecting(false);
    stopAudioVisualization();
  };

  // Wave visualization component
  const WaveVisualization = () => {
    const waveCount = 5;
    const waves = Array.from({ length: waveCount }, (_, i) => {
      const scale = isListening ? 1 + (audioLevel / 100) * (i + 1) * 0.3 :
                     isSpeaking ? 1 + Math.sin(Date.now() / 500 + i) * 0.3 : 1;
      const opacity = isListening || isSpeaking ? 0.6 - (i * 0.1) : 0.3;

      return (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-4 transition-all duration-300"
          style={{
            borderColor: isListening ? 'rgba(59, 130, 246, ' + opacity + ')' :
                        isSpeaking ? 'rgba(16, 185, 129, ' + opacity + ')' :
                        'rgba(139, 92, 246, ' + opacity + ')',
            transform: `scale(${scale})`,
            animation: isCallActive ? `pulse ${2 + i * 0.3}s ease-in-out infinite` : 'none',
          }}
        />
      );
    });

    return <div className="relative w-40 h-40">{waves}</div>;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageSquare className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden border border-gray-200 max-w-[calc(100vw-3rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Marcy AI</h3>
                <p className="text-sm text-white/80">
                  {isCallActive ? '🎤 Voice call active' : 'Your AI Receptionist'}
                </p>
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
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setMode('chat')}
              className={`flex-1 py-3 font-semibold transition-all ${
                mode === 'chat'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 Chat Mode
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`flex-1 py-3 font-semibold transition-all ${
                mode === 'voice'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🎙️ Voice Mode
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {mode === 'chat' ? (
              /* CHAT MODE */
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        } rounded-2xl px-4 py-3 shadow-sm max-w-[85%]`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-60">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Marcy is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 bg-gray-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* VOICE MODE */
              <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                {/* Wave Visualization */}
                <div className="mb-6 flex items-center justify-center">
                  <WaveVisualization />
                  <div className="absolute">
                    {isCallActive ? (
                      isListening ? (
                        <Mic className="w-16 h-16 text-blue-600 animate-pulse" />
                      ) : isSpeaking ? (
                        <Volume2 className="w-16 h-16 text-green-600 animate-pulse" />
                      ) : (
                        <Mic className="w-16 h-16 text-purple-600" />
                      )
                    ) : (
                      <Mic className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isConnecting ? 'Connecting...' :
                     isCallActive ? (
                       isListening ? '🎤 Listening...' :
                       isSpeaking ? '🔊 Marcy is speaking...' :
                       '⏸️ Voice call active'
                     ) : 'Start Voice Conversation'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isCallActive ? 'Speak naturally with Marcy' : 'Experience AI voice assistant'}
                  </p>
                </div>

                {/* Real-time Transcripts */}
                {transcripts.length > 0 && (
                  <div className="w-full max-h-48 overflow-y-auto bg-white rounded-xl shadow-lg p-4 mb-4 space-y-2">
                    {transcripts.map((transcript, idx) => (
                      <div
                        key={idx}
                        className={`text-sm ${
                          transcript.type === 'user'
                            ? 'text-blue-700 font-medium'
                            : 'text-green-700 font-medium'
                        } ${!transcript.isFinal ? 'opacity-60 italic' : ''}`}
                      >
                        <span className="font-bold">{transcript.type === 'user' ? '🗣️ You:' : '🤖 Marcy:'}</span> {transcript.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Call Control Button */}
                <button
                  onClick={isCallActive ? stopVoiceCall : startVoiceCall}
                  disabled={isConnecting}
                  className={`${
                    isCallActive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105'
                  } text-white font-bold px-8 py-4 rounded-full shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-2`}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : isCallActive ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>End Call</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Start Voice Call</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Or call directly: +1 (276) 582-5329
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </>
  );
};

export default AdvancedChatWidget;
