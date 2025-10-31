import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, PhoneCall, PhoneOff, Send, Loader2 } from 'lucide-react';
import { chatService, ChatMessage } from '../lib/chat';
import Vapi from '@vapi-ai/web';
import CallWaitingLogo from './CallWaitingLogo';
import { VAPI_CONFIG } from '../lib/supabase';

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
  const [isVapiReady, setIsVapiReady] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Listen for external widget open events
  useEffect(() => {
    const handleOpenWidget = (event: any) => {
      const { mode: requestedMode } = event.detail;
      setMode(requestedMode);
      setIsOpen(true);

      // If voice mode requested, auto-start call after opening
      if (requestedMode === 'voice') {
        setTimeout(() => {
          if (!isCallActive && !isConnecting) {
            startVoiceCall();
          }
        }, 500);
      }
    };

    window.addEventListener('openChatWidget', handleOpenWidget);
    return () => window.removeEventListener('openChatWidget', handleOpenWidget);
  }, [isCallActive, isConnecting]);

  // Initialize Vapi
  useEffect(() => {
    // Use env variable if set, otherwise fallback to VAPI_CONFIG
    const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey;

    if (!VAPI_PUBLIC_KEY) {
      console.error('❌ Vapi public key not configured');
      setConnectionError('Voice system not configured');
      return;
    }

    try {
      console.log('🚀 Initializing Vapi client...');
      const client = new Vapi(VAPI_PUBLIC_KEY);
      setVapiClient(client);
      console.log('✅ Vapi client initialized successfully');

      // Voice call events
      client.on('call-start', () => {
        console.log('✅ Voice call started');
        setIsCallActive(true);
        setIsConnecting(false);
        setIsListening(true);
        setConnectionError('');
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
        console.log('🎤 User started speaking - AI WILL BE INTERRUPTED');
        setIsListening(true);
        setIsSpeaking(false);
        // Vapi automatically stops AI when user speaks (built-in interruption)
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
        setConnectionError(error.message || 'Failed to connect. Please try again.');
        stopAudioVisualization();
      });

      // Mark as ready after successful initialization
      setIsVapiReady(true);

    } catch (error: any) {
      console.error('Failed to initialize Vapi:', error);
      setConnectionError('Failed to initialize voice system');
      setIsVapiReady(false);
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
      console.log('🎵 Starting audio visualization...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('✅ Microphone access granted');

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      updateAudioLevel();
    } catch (error: any) {
      console.error('Failed to get audio stream:', error);
      setConnectionError('Microphone access denied. Please allow microphone access and try again.');
      throw error;
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

  // Voice handlers - FIXED for better connection
  const startVoiceCall = async () => {
    if (!vapiClient || !isVapiReady) {
      setConnectionError('Voice system is not ready. Please wait a moment and try again.');
      console.error('❌ Vapi client not initialized or not ready');
      return;
    }

    if (isConnecting || isCallActive) {
      console.log('⚠️ Call already in progress');
      return;
    }

    console.log('📞 Starting voice call...');
    setIsConnecting(true);
    setTranscripts([]);
    setConnectionError('');

    try {
      // Step 1: Request microphone permission
      console.log('🎤 Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('✅ Microphone permission granted');

      // Step 2: Setup audio visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        updateAudioLevel();
      }

      // Step 3: Start Vapi call with assistant ID (uses pre-configured assistant)
      console.log('🎙️ Starting Vapi call with assistant ID...');

      // Use the assistant ID from VAPI_CONFIG - it already has all configuration on Vapi dashboard
      await vapiClient.start(VAPI_CONFIG.assistantId);
      console.log('✅ Vapi call started successfully');

    } catch (error: any) {
      console.error('❌ Failed to start voice call:', error);

      let errorMessage = 'Failed to connect. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check your connection and try again.';
      }

      setConnectionError(errorMessage);
      setIsConnecting(false);
      setIsCallActive(false);
      stopAudioVisualization();
    }
  };

  const stopVoiceCall = () => {
    console.log('🛑 Stopping voice call...');
    if (vapiClient) {
      vapiClient.stop();
    }
    setIsCallActive(false);
    setIsConnecting(false);
    stopAudioVisualization();
  };

  // Modern avatar orb (replaces microphone icon)
  const AvatarOrb = () => {
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

    return (
      <div className="relative w-32 h-32">
        {waves}
        <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center shadow-2xl overflow-hidden p-4">
          {isCallActive ? (
            <div className="text-4xl animate-pulse">
              {isListening ? '🎤' : isSpeaking ? '🔊' : '⏸️'}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CallWaitingLogo size="lg" showText={false} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-20 h-20 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          aria-label="Open chat"
        >
          <MessageSquare className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            1
          </div>
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
              aria-label="Close chat widget"
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
                {/* Avatar Orb */}
                <div className="mb-6 flex items-center justify-center">
                  <AvatarOrb />
                </div>

                {/* Status */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isConnecting ? '⏳ Connecting...' :
                     isCallActive ? (
                       isListening ? '🎤 Listening...' :
                       isSpeaking ? '🔊 Marcy is speaking...' :
                       '⏸️ Call Active'
                     ) : '🎙️ Start Voice Call'}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {isCallActive ? 'Speak naturally with Marcy' : 'Experience AI voice assistant'}
                  </p>
                </div>

                {/* Error Message */}
                {connectionError && (
                  <div className="w-full bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-700 text-center font-medium">
                      ⚠️ {connectionError}
                    </p>
                  </div>
                )}

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
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  } text-white font-bold px-10 py-5 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-3 text-lg hover:scale-105 disabled:hover:scale-100`}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : isCallActive ? (
                    <>
                      <PhoneOff className="w-6 h-6" />
                      <span>End Call</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-6 h-6" />
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
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }

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
