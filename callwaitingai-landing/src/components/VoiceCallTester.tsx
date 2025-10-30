import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Activity, AlertCircle, Loader2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';

interface VoiceCallTesterProps {
  assistantId: string;
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
  latency: number;
}

export function VoiceCallTester({ assistantId, onClose }: VoiceCallTesterProps) {
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
    latency: 0,
  });

  // Buffering state
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);

  // Refs
  const vapiRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Vapi client
  useEffect(() => {
    const vapiApiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

    if (!vapiApiKey) {
      setCallError('Vapi API key not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.');
      return;
    }

    vapiRef.current = new Vapi(vapiApiKey);

    // Event listeners
    vapiRef.current.on('call-start', handleCallStart);
    vapiRef.current.on('call-end', handleCallEnd);
    vapiRef.current.on('speech-start', handleSpeechStart);
    vapiRef.current.on('speech-end', handleSpeechEnd);
    vapiRef.current.on('message', handleMessage);
    vapiRef.current.on('error', handleError);
    vapiRef.current.on('volume-level', handleVolumeLevel);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Event handlers
  const handleCallStart = () => {
    console.log('Call started');
    setIsConnecting(false);
    setIsConnected(true);
    setCallError(null);

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Initialize audio visualization
    initAudioVisualization();
  };

  const handleCallEnd = () => {
    console.log('Call ended');
    setIsConnected(false);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const handleSpeechStart = () => {
    console.log('Speech started');
    setMetrics(prev => ({ ...prev, isSpeaking: true }));
  };

  const handleSpeechEnd = () => {
    console.log('Speech ended');
    setMetrics(prev => ({ ...prev, isSpeaking: false }));
  };

  const handleMessage = (message: any) => {
    console.log('Message received:', message);

    // Handle transcript messages
    if (message.type === 'transcript') {
      const newMessage: TranscriptMessage = {
        role: message.role,
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

    // Handle buffering events
    if (message.type === 'speech-update') {
      if (message.status === 'started') {
        setIsBuffering(true);
        setBufferProgress(0);
      } else if (message.status === 'stopped') {
        setIsBuffering(false);
        setBufferProgress(100);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('Vapi error:', error);
    setCallError(error.message || 'An error occurred during the call');
    setIsConnecting(false);
    setIsConnected(false);
  };

  const handleVolumeLevel = (volume: number) => {
    setMetrics(prev => ({ ...prev, volume }));
  };

  // Audio visualization
  const initAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      animateVolumeLevel();
    } catch (error) {
      console.error('Failed to initialize audio visualization:', error);
    }
  };

  const animateVolumeLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedVolume = Math.min(100, (average / 255) * 100);

    setMetrics(prev => ({ ...prev, volume: normalizedVolume }));

    animationFrameRef.current = requestAnimationFrame(animateVolumeLevel);
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

      // Start call with assistant configuration
      await vapiRef.current.start({
        assistantId: assistantId,
        // Enable real-time transcription
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        // Enable voice activity detection
        silenceTimeoutSeconds: 30,
        responseDelaySeconds: 0.4,
        interruptionsEnabled: true,
      });
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setCallError(error.message || 'Failed to start call');
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
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
              {/* Volume Level */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-100"
                    style={{ width: `${metrics.volume}%` }}
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
                  <span className="text-xs text-gray-600">Buffering...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {callError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{callError}</p>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {transcript.length === 0 && !isConnected && (
            <div className="text-center py-12 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a call to see live transcription</p>
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
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
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
                disabled={isConnecting}
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
            This is a test call using your AI assistant configuration
          </p>
        </div>
      </div>
    </div>
  );
}
