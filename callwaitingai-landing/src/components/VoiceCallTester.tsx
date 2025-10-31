import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Activity, AlertCircle, Loader2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { useAuth } from '../contexts/AuthContext';
import { getUserTier } from '../lib/userTier';
import { VAPI_CONFIG, supabase } from '../lib/supabase';

interface Assistant {
  id: string;
  business_name: string;
  business_industry: string;
  business_hours: string;
  timezone: string;
  system_prompt: string;
  minimax_voice_id: string | null;
  use_minimax_tts: boolean;
}

interface VoiceCallTesterProps {
  assistant: Assistant;
  onClose: () => void;
}

interface TranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isFinal?: boolean;
}

interface VoiceMetrics {
  volume: number;
  isSpeaking: boolean;
}

export function VoiceCallTester({ assistant, onClose }: VoiceCallTesterProps) {
  const { user } = useAuth();

  // Call state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Voice state
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    volume: 0,
    isSpeaking: false,
  });

  // Buffering state
  const [isBuffering, setIsBuffering] = useState(false);

  // Refs
  const vapiRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize Vapi client
  useEffect(() => {
    // Use env variable or fallback to hardcoded key
    const vapiApiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey;

    if (!vapiApiKey) {
      setCallError('Vapi API key not configured');
      return;
    }

    try {
      vapiRef.current = new Vapi(vapiApiKey);
      console.log('✅ Vapi client initialized with key:', vapiApiKey.substring(0, 10) + '...');

      // Event listeners
      vapiRef.current.on('call-start', handleCallStart);
      vapiRef.current.on('call-end', handleCallEnd);
      vapiRef.current.on('speech-start', handleSpeechStart);
      vapiRef.current.on('speech-end', handleSpeechEnd);
      vapiRef.current.on('message', handleMessage);
      vapiRef.current.on('error', handleError);
    } catch (error: any) {
      console.error('❌ Vapi init error:', error);
      setCallError(`Vapi initialization failed: ${error.message}`);
    }

    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Event handlers
  const handleCallStart = () => {
    console.log('✅ Call started');
    setIsConnecting(false);
    setIsConnected(true);
    setCallError(null);

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleCallEnd = () => {
    console.log('📞 Call ended');
    setIsConnected(false);
    setIsBuffering(false);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const handleSpeechStart = () => {
    console.log('🎤 Speech started');
    setMetrics(prev => ({ ...prev, isSpeaking: true }));
    setIsBuffering(false);
  };

  const handleSpeechEnd = () => {
    console.log('🔇 Speech ended');
    setMetrics(prev => ({ ...prev, isSpeaking: false }));
  };

  const handleMessage = (message: any) => {
    console.log('📨 Message:', message);

    // Handle transcript messages
    if (message.type === 'transcript' && message.transcript) {
      const newMessage: TranscriptMessage = {
        role: message.role || 'assistant',
        text: message.transcript,
        timestamp: new Date(),
        isFinal: message.transcriptType === 'final',
      };

      setTranscript(prev => {
        // If it's an interim message, replace the last interim message of the same role
        if (!newMessage.isFinal) {
          const filtered = prev.filter(m => m.isFinal || m.role !== newMessage.role);
          return [...filtered, newMessage];
        }
        // If it's a final message, replace all interim messages of the same role
        const filtered = prev.filter(m => m.isFinal);
        return [...filtered, newMessage];
      });
    }

    // Handle speech events for buffering indication
    if (message.type === 'speech-update') {
      if (message.status === 'started') {
        setIsBuffering(true);
      } else if (message.status === 'stopped') {
        setIsBuffering(false);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('❌ Vapi error:', error);
    setCallError(error.message || 'An error occurred during the call');
    setIsConnecting(false);
    setIsConnected(false);
    setIsBuffering(false);
  };

  // Call actions
  const startCall = async () => {
    if (!vapiRef.current) {
      setCallError('Vapi client not initialized');
      return;
    }

    try {
      setIsConnecting(true);
      setCallError(null);
      setTranscript([]);
      setCallDuration(0);

      console.log('🚀 Starting call with assistant:', assistant.business_name);

      // Determine user's subscription tier
      if (!user) {
        throw new Error('User not authenticated');
      }

      const userTier = await getUserTier(user.id);
      console.log('👤 User tier:', userTier);

      // Get Supabase URL for Minimax TTS endpoint
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bcufohulqrceytkrqpgd.supabase.co';

      // Create inline assistant configuration
      const assistantConfig: any = {
        name: assistant.business_name || 'AI Receptionist',
        model: {
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: assistant.system_prompt || 'You are a helpful AI assistant.',
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
        firstMessage: `Hello! I'm the AI assistant for ${assistant.business_name}. How can I help you today?`,
        // Enable real-time features
        silenceTimeoutSeconds: 30,
        responseDelaySeconds: 0.4,
        interruptionsEnabled: true,
        backgroundSound: 'off',
      };

      // Configure voice based on tier and settings
      if ((userTier === 'pro' || userTier === 'promax') && assistant.use_minimax_tts && assistant.minimax_voice_id) {
        // Pro/ProMax tiers with Minimax TTS enabled: Use custom Minimax voice
        assistantConfig.voice = {
          provider: 'custom-provider',
          url: `${supabaseUrl}/functions/v1/minimax-tts`,
          voiceId: assistant.minimax_voice_id,
        };
        console.log('🎤 Voice: Minimax TTS (Custom)', assistant.minimax_voice_id);
      } else {
        // Free/Professional tiers or Minimax disabled: Use Vapi default
        console.log('🎤 Voice: Vapi default');
      }

      console.log('📋 Assistant config:', assistantConfig);

      // Start call with inline assistant
      await vapiRef.current.start(assistantConfig);

      console.log('✅ Call start request sent');
    } catch (error: any) {
      console.error('❌ Failed to start call:', error);
      setCallError(`Failed to start call: ${error.message}`);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    console.log('🛑 Ending call...');
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
      console.log(isMuted ? '🔊 Unmuted' : '🔇 Muted');
    }
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isConnected ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isConnected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Phone className={`w-5 h-5 ${
                  isConnected ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Voice Call Test</h2>
                <p className="text-sm text-gray-600">
                  {isConnecting && 'Connecting...'}
                  {isConnected && `Connected • ${formatDuration(callDuration)}`}
                  {!isConnecting && !isConnected && 'Ready to test'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Voice Metrics */}
          {isConnected && (
            <div className="mt-4 flex items-center gap-6">
              {/* Volume Level - Simulated based on speaking state */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ${
                      metrics.isSpeaking ? 'animate-pulse' : ''
                    }`}
                    style={{ width: metrics.isSpeaking ? '80%' : '20%' }}
                  />
                </div>
              </div>

              {/* Speaking Indicator */}
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${
                  metrics.isSpeaking ? 'text-blue-600 animate-pulse' : 'text-gray-400'
                }`} />
                <span className="text-xs text-gray-600">
                  {metrics.isSpeaking ? 'Speaking' : 'Listening'}
                </span>
              </div>

              {/* Buffering Indicator */}
              {isBuffering && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs text-gray-600">Processing...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {callError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Call Error</p>
              <p className="text-xs text-red-700 mt-1">{callError}</p>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {transcript.length === 0 && !isConnected && (
            <div className="text-center py-12 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Start a call to see live transcription</p>
              <p className="text-sm mt-2">Testing: {assistant.business_name}</p>
            </div>
          )}

          {transcript.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                } ${!message.isFinal ? 'opacity-60 italic' : ''}`}
              >
                <div className="text-xs font-medium mb-1 opacity-75">
                  {message.role === 'user' ? 'You' : assistant.business_name}
                </div>
                <p className="text-sm">{message.text}</p>
                <div className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          <div ref={transcriptEndRef} />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-center gap-4">
            {!isConnected ? (
              <button
                onClick={startCall}
                disabled={isConnecting || !!callError}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    <span>Start Test Call</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-all ${
                    isMuted
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={endCall}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>
              </>
            )}
          </div>

          <p className="text-xs text-center text-gray-500 mt-3">
            Powered by ODIADEV TTS
          </p>
        </div>
      </div>
    </div>
  );
}
