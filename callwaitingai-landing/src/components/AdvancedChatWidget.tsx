import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, PhoneCall, PhoneOff, Send, Loader2, Volume2, VolumeX, Play, Pause, Activity, Mic } from 'lucide-react';
import { chatService, ChatMessage } from '../lib/chat';
import Vapi from '@vapi-ai/web';
import CallWaitingLogo from './CallWaitingLogo';
import { VAPI_CONFIG } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
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
      id: 'welcome-msg',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `landing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // TTS state - DISABLED (auto-play removed)
  const [ttsEnabled, setTtsEnabled] = useState(false); // Always false, TTS disabled
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Browser-native STT (Speech-to-Text) state
  const [isSttActive, setIsSttActive] = useState(false);
  const [sttTranscript, setSttTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

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

  // Enhanced voice features
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<'neutral' | 'happy' | 'frustrated' | 'confused'>('neutral');
  const [conversationQuality, setConversationQuality] = useState<number>(100);
  const [responseLatency, setResponseLatency] = useState<number>(0);
  const lastSpeechTimeRef = useRef<number>(0);

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
      
      // Wait a moment for Vapi to fully initialize
      setTimeout(() => {
        setVapiClient(client);
        setIsVapiReady(true);
        console.log('✅ Vapi client initialized and ready');
      }, 500);

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
        setIsProcessing(false);
        lastSpeechTimeRef.current = Date.now();
        // Vapi automatically stops AI when user speaks (built-in interruption)
      });

      client.on('speech-end', () => {
        console.log('🎤 User stopped speaking');
        setIsListening(false);
        setIsProcessing(true); // Show processing indicator while AI generates response

        // Calculate response latency
        const latency = Date.now() - lastSpeechTimeRef.current;
        setResponseLatency(latency);
      });

      // Transcription events with emotion detection
      client.on('message', (message: any) => {
        console.log('📝 Vapi message:', message);

        if (message.type === 'transcript' && message.transcriptType === 'partial') {
          // User's speech (partial - real-time streaming)
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

            // Simple emotion detection from text patterns
            detectEmotionFromText(message.transcript);
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

            // Detect emotion from final transcript
            detectEmotionFromText(message.transcript);
          }
        }

        // Assistant response streaming
        if (message.type === 'transcript' && message.role === 'assistant') {
          setIsProcessing(false); // Response received, stop processing indicator

          setTranscripts(prev => {
            const filtered = prev.filter(t => t.isFinal || t.type !== 'assistant');
            return [...filtered, {
              type: 'assistant',
              text: message.transcript,
              timestamp: Date.now(),
              isFinal: message.transcriptType === 'final'
            }];
          });
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
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to connect. ';
        if (
          error.errorMsg?.includes('Meeting has ended') ||
          error.type === 'daily-call-join-error' ||
          error.type === 'start-method-error'
        ) {
          errorMessage += 'Connection issue. Please check your internet connection, microphone permissions, and try again.';
        } else if (error.message?.includes('permission') || error.message?.includes('microphone')) {
          errorMessage += 'Microphone access is required. Please allow microphone permissions and try again.';
        } else {
          errorMessage += error.message || error.errorMsg || 'Please try again.';
        }
        
        setConnectionError(errorMessage);
        stopAudioVisualization();
      });

      // Mark as ready after successful initialization
      
    } catch (error: any) {
      console.error('❌ Failed to initialize Vapi client:', error);
      setConnectionError('Failed to initialize voice system. Please refresh the page and try again.');
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

  // Emotion detection from text patterns
  const detectEmotionFromText = (text: string) => {
    const lowerText = text.toLowerCase();

    // Happy patterns
    const happyPatterns = ['thank', 'great', 'awesome', 'perfect', 'love', 'excellent', 'appreciate', 'wonderful'];
    if (happyPatterns.some(pattern => lowerText.includes(pattern))) {
      setDetectedEmotion('happy');
      setConversationQuality(prev => Math.min(100, prev + 5));
      return;
    }

    // Frustrated patterns
    const frustratedPatterns = ['can\'t', 'won\'t', 'frustrated', 'annoying', 'problem', 'issue', 'not working', 'help'];
    if (frustratedPatterns.some(pattern => lowerText.includes(pattern))) {
      setDetectedEmotion('frustrated');
      setConversationQuality(prev => Math.max(0, prev - 10));
      return;
    }

    // Confused patterns
    const confusedPatterns = ['what', 'how', 'confused', 'don\'t understand', 'unclear', 'explain'];
    if (confusedPatterns.some(pattern => lowerText.includes(pattern))) {
      setDetectedEmotion('confused');
      setConversationQuality(prev => Math.max(0, prev - 5));
      return;
    }

    // Default neutral
    setDetectedEmotion('neutral');
  };

  // Get emotion emoji
  const getEmotionEmoji = () => {
    switch (detectedEmotion) {
      case 'happy': return '😊';
      case 'frustrated': return '😤';
      case 'confused': return '🤔';
      default: return '😐';
    }
  };

  // Get emotion color
  const getEmotionColor = () => {
    switch (detectedEmotion) {
      case 'happy': return 'text-green-600';
      case 'frustrated': return 'text-red-600';
      case 'confused': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  // TTS Functions
  const speakText = (text: string, messageId: string) => {
    // Stop any currently playing speech
    stopSpeech();

    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      console.warn('⚠️ Speech synthesis not supported in this browser');
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings for natural, clear speech
      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume

      // Try to use a female voice for Marcy
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        setCurrentlyPlayingId(messageId);
        console.log('🔊 TTS started for message:', messageId);
      };

      utterance.onend = () => {
        setCurrentlyPlayingId(null);
        speechSynthesisRef.current = null;
        console.log('✅ TTS finished for message:', messageId);
      };

      utterance.onerror = (event) => {
        console.error('❌ TTS error:', event);
        setCurrentlyPlayingId(null);
        speechSynthesisRef.current = null;
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('❌ Failed to start TTS:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setCurrentlyPlayingId(null);
      speechSynthesisRef.current = null;
    }
  };

  const toggleTTS = (messageId: string, text: string) => {
    if (currentlyPlayingId === messageId) {
      // If this message is playing, stop it
      stopSpeech();
    } else {
      // Otherwise, play this message
      speakText(text, messageId);
    }
  };

  // Initialize Browser-native Speech Recognition (STT)
  useEffect(() => {
    // Check for browser Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          // User finished speaking - set as message
          setMessage(finalTranscript.trim());
          setSttTranscript('');
          // Auto-submit if user wants
          // handleSendMessage(new Event('submit') as any);
        } else {
          // Show interim results
          setSttTranscript(interimTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('STT error:', event.error);
        setIsSttActive(false);
        setSttTranscript('');
        
        if (event.error === 'not-allowed') {
          setConnectionError('Microphone permission denied. Please allow microphone access.');
        } else if (event.error === 'no-speech') {
          setIsSttActive(false);
        }
      };
      
      recognition.onend = () => {
        setIsSttActive(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn('⚠️ Browser Speech Recognition not supported');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeech(); // Cleanup TTS
    };
  }, [isOpen]);

  const startSTT = () => {
    if (!recognitionRef.current) {
      setConnectionError('Speech recognition not supported in this browser');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsSttActive(true);
      setSttTranscript('');
      console.log('🎤 Browser STT started');
    } catch (error: any) {
      if (error.name === 'InvalidStateError') {
        // Already started, ignore
      } else {
        console.error('Failed to start STT:', error);
        setConnectionError('Failed to start speech recognition');
      }
    }
  };

  const stopSTT = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsSttActive(false);
      setSttTranscript('');
      console.log('🛑 Browser STT stopped');
    }
  };

  useEffect(() => {
    // Stop TTS when switching modes (TTS is disabled anyway)
    if (mode === 'voice') {
      stopSpeech();
    }
    // Stop STT when switching to voice mode (voice mode uses Vapi)
    if (mode === 'voice') {
      stopSTT();
    }
  }, [mode]);

  // Chat handlers
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage, timestamp: new Date(), id: `user-${Date.now()}` },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatMessages: ChatMessage[] = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await chatService.sendMessage(chatMessages, sessionId);

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        id: assistantMessageId,
      };

      setMessages([...newMessages, assistantMessage]);

      // TTS auto-play DISABLED - removed per user request
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessageId = `error-${Date.now()}`;
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting. Please try again or call +1 (276) 582-5329.",
          timestamp: new Date(),
          id: errorMessageId,
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

      // Step 3: Start Vapi call with inline assistant configuration
      console.log('🎙️ Starting Vapi call with inline assistant...');

      // Create inline assistant with proper Vapi voice configuration
      const assistantConfig: any = {
        name: 'Marcy AI',
        model: {
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: "You are Marcy, a professional AI receptionist for CallWaitingAI. Answer questions warmly and professionally. Keep responses concise and helpful.",
            },
          ],
          temperature: 0.7,
          maxTokens: 500,
        },
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        voice: {
          provider: 'vapi',
          voiceId: 'harry', // Use Vapi's Harry voice (default)
        },
        firstMessage: "Hi! I'm Marcy, your AI assistant. How can I help you today?",
        silenceTimeoutSeconds: 30,
        responseDelaySeconds: 0.4,
        interruptionsEnabled: true,
        backgroundSound: 'off',
      };

      // Add retry logic for connection issues
      let callStarted = false;
      let lastError: any = null;
      const maxRetries = 3;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }

          await vapiClient.start(assistantConfig);
          callStarted = true;
          console.log('✅ Vapi call started successfully with inline assistant');
          break;
        } catch (startError: any) {
          lastError = startError;
          console.error(`❌ Start attempt ${attempt + 1} failed:`, startError);

          // If it's a connection error, retry
          const isConnectionError = 
            startError.message?.toLowerCase().includes('connection') ||
            startError.message?.toLowerCase().includes('network') ||
            startError.message?.toLowerCase().includes('timeout') ||
            startError.message?.toLowerCase().includes('meeting has ended') ||
            startError.type === 'daily-call-join-error';

          if (!isConnectionError || attempt === maxRetries - 1) {
            // Non-retryable error or final attempt
            throw startError;
          }
          // Otherwise continue to retry
        }
      }

      if (!callStarted && lastError) {
        throw lastError;
      }

    } catch (error: any) {
      console.error('❌ Failed to start voice call after retries:', error);

      let errorMessage = 'Failed to connect. ';
      
      // Specific error handling
      if (error.name === 'NotAllowedError' || error.message?.includes('permission') || error.message?.includes('microphone')) {
        errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.type === 'start-method-error') {
        errorMessage = 'Voice configuration error. Please try again or contact support.';
      } else if (
        error.message?.includes('Meeting has ended') ||
        error.message?.includes('connection') ||
        error.message?.includes('network') ||
        error.message?.includes('timeout') ||
        error.type === 'daily-call-join-error'
      ) {
        errorMessage = 'Connection issue. Please check your internet connection, microphone permissions, and try again.';
      } else if (error.message) {
        errorMessage = `Connection error: ${error.message}`;
      } else {
        errorMessage = 'Unable to connect. Please check your internet connection and microphone permissions.';
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
                {/* Browser STT Toggle - TTS Auto-play DISABLED */}
                <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isSttActive) {
                          stopSTT();
                        } else {
                          startSTT();
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSttActive
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                      }`}
                    >
                      {isSttActive ? (
                        <>
                          <Mic className="w-3.5 h-3.5 animate-pulse" />
                          <span>Listening...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Start Voice Input</span>
                        </>
                      )}
                    </button>
                    {sttTranscript && (
                      <span className="text-xs text-gray-500 italic">{sttTranscript}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    TTS Auto-play: Disabled
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <div
                          className={`${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          } rounded-2xl px-4 py-3 shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-60">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* TTS DISABLED - Play button removed per user request */}
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
                      value={message || sttTranscript}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setSttTranscript(''); // Clear STT when user types manually
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder={isSttActive ? "Listening... speak now" : "Type a message or use voice input..."}
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
              <div className="h-full flex flex-col p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                {/* Enhanced Status Bar */}
                {isCallActive && (
                  <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
                    {/* Emotion Indicator */}
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{getEmotionEmoji()}</span>
                        <div className="flex-1">
                          <p className="text-gray-500 text-[10px]">Mood</p>
                          <p className={`font-semibold text-xs ${getEmotionColor()}`}>
                            {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Latency Indicator */}
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-gray-500 text-[10px]">Latency</p>
                          <p className={`font-semibold text-xs ${responseLatency < 1000 ? 'text-green-600' : responseLatency < 2000 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {responseLatency}ms
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quality Score */}
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <Volume2 className="w-4 h-4 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-gray-500 text-[10px]">Quality</p>
                          <p className={`font-semibold text-xs ${conversationQuality > 80 ? 'text-green-600' : conversationQuality > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {conversationQuality}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Avatar Orb */}
                <div className="mb-4 flex items-center justify-center">
                  <AvatarOrb />
                </div>

                {/* Status */}
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {isConnecting ? '⏳ Connecting...' :
                     isCallActive ? (
                       isListening ? '🎤 Listening...' :
                       isProcessing ? '⚡ Processing...' :
                       isSpeaking ? '🔊 Marcy is speaking...' :
                       '⏸️ Call Active'
                     ) : '🎙️ Start Voice Call'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isCallActive
                      ? isProcessing
                        ? 'AI is generating response...'
                        : 'Speak naturally with Marcy'
                      : 'Ultra-low latency AI conversation'}
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

                {/* Enhanced Real-time Transcripts with Streaming */}
                {transcripts.length > 0 && (
                  <div className="w-full flex-1 overflow-y-auto bg-white rounded-xl shadow-lg p-3 mb-3 space-y-2 max-h-[200px]">
                    {transcripts.map((transcript, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded-lg transition-all ${
                          transcript.type === 'user'
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-green-50 border-l-4 border-green-500'
                        } ${!transcript.isFinal ? 'animate-pulse' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {transcript.type === 'user' ? (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              U
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                              M
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs font-semibold ${
                              transcript.type === 'user' ? 'text-blue-700' : 'text-green-700'
                            }`}>
                              {transcript.type === 'user' ? 'You' : 'Marcy'}
                            </span>
                            {!transcript.isFinal && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-500 italic">
                                <div className="flex gap-0.5">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                streaming...
                              </span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed ${
                            transcript.type === 'user' ? 'text-blue-900' : 'text-green-900'
                          } ${!transcript.isFinal ? 'opacity-70' : ''}`}>
                            {transcript.text}
                          </p>
                        </div>
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
