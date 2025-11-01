import { useState, useRef, useEffect } from 'react';
import { Phone, Mic, MicOff, X, Volume2, Loader2, Activity, MessageCircle } from 'lucide-react';
import { advancedVapiService } from '../lib/advancedVapi';

interface TranscriptSegment {
  text: string;
  isFinal: boolean;
  timestamp: number;
}

const AdvancedVoiceWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const callStartTime = useRef<number | null>(null);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentTranscript]);

  // Update call duration
  useEffect(() => {
    if (isCallActive && !durationInterval.current) {
      callStartTime.current = Date.now();
      durationInterval.current = setInterval(() => {
        if (callStartTime.current) {
          setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
        }
      }, 1000);
    }

    return () => {
      if (durationInterval.current) {
        window.clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    };
  }, [isCallActive]);

  // Format call duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start voice call
  const handleStartCall = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await advancedVapiService.startCall({
        onStart: () => {
          setIsCallActive(true);
          setIsConnecting(false);
          setTranscript([{
            text: 'Call connected! You can start speaking with Marcy.',
            isFinal: true,
            timestamp: Date.now(),
          }]);
        },
        onEnd: () => {
          handleEndCall();
        },
        onSpeechStart: () => {
          setIsSpeaking(true);
        },
        onSpeechEnd: () => {
          setIsSpeaking(false);
        },
        onTranscript: (text: string, isFinal: boolean) => {
          if (isFinal) {
            setTranscript(prev => [...prev, {
              text,
              isFinal: true,
              timestamp: Date.now(),
            }]);
            setCurrentTranscript('');
          } else {
            setCurrentTranscript(text);
          }
        },
        onMessage: (message: any) => {
          if (import.meta.env.DEV) console.log('Vapi message:', message);
          if (message.type === 'transcript' && message.role === 'assistant') {
            setTranscript(prev => [...prev, {
              text: message.transcript,
              isFinal: true,
              timestamp: Date.now(),
            }]);
          }
        },
        onError: (err: Error) => {
          setError(err.message);
          setIsConnecting(false);
          setIsCallActive(false);
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start call');
      setIsConnecting(false);
    }
  };

  // End voice call
  const handleEndCall = async () => {
    try {
      await advancedVapiService.endCall();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error ending call:', err);
    }
    
    setIsCallActive(false);
    setIsConnecting(false);
    setIsMuted(false);
    setIsSpeaking(false);
    setCallDuration(0);
    callStartTime.current = null;
    
    if (durationInterval.current) {
      window.clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    advancedVapiService.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  // Simulate audio level (in production, connect to actual audio analysis)
  useEffect(() => {
    let interval: number;
    if (isCallActive && isSpeaking) {
      interval = window.setInterval(() => {
        // More realistic audio level simulation
        setAudioLevel(30 + Math.random() * 70);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isCallActive, isSpeaking]);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 bg-gradient-primary hover:bg-gradient-primary-hover hover:scale-110 animate-bounce"
        >
          <div className="absolute inset-0 rounded-full bg-brand-blue opacity-75 animate-pulse-ring"></div>
          <Phone className="w-8 h-8 text-white relative z-10" />
        </button>
      )}

      {/* Voice Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden border border-neutral-lightGray max-w-[calc(100vw-3rem)]">
          {/* Header */}
          <div className="bg-gradient-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                {isCallActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-success rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-bold">Voice AI Assistant</h3>
                <p className="text-sm text-white/80">
                  {isCallActive ? `Connected • ${formatDuration(callDuration)}` : 'Marcy is ready to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (isCallActive) handleEndCall();
                setIsOpen(false);
              }}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-neutral-lightBg min-h-[24rem] max-h-[32rem]">
            {!isCallActive && !isConnecting ? (
              /* Call Start Screen */
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                    <Phone className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-brand-blue opacity-50 animate-pulse-ring"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-neutral-darker mb-2">
                    Talk to Marcy
                  </h3>
                  <p className="text-neutral-darkGray mb-6">
                    Experience ultra-low latency voice AI with real-time responses
                  </p>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={handleStartCall}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Start Voice Call</span>
                  </button>
                  
                  <p className="text-sm text-neutral-gray mt-4">
                    Or call: <a href="tel:+12765825329" className="text-brand-blue hover:underline">+1 (276) 582-5329</a>
                  </p>
                </div>
              </div>
            ) : isConnecting ? (
              /* Connecting Screen */
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
                <p className="text-neutral-darkGray font-medium">Connecting to Marcy...</p>
                <p className="text-sm text-neutral-gray">Initializing voice channel</p>
              </div>
            ) : (
              /* Active Call Screen */
              <div className="space-y-4">
                {/* Voice Activity Indicator */}
                <div className="bg-white rounded-xl p-4 border border-neutral-lightGray shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-brand-blue" />
                      <span className="text-sm font-medium text-neutral-darker">
                        {isSpeaking ? 'You are speaking' : 'Listening...'}
                      </span>
                    </div>
                    <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-status-success' : 'text-neutral-gray'}`} />
                  </div>
                  
                  {/* Waveform Visualization */}
                  <div className="flex items-center justify-center space-x-1 h-16 bg-neutral-lightBg rounded-lg p-2">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-primary rounded-full transition-all duration-75"
                        style={{
                          height: isSpeaking ? `${Math.max(10, Math.random() * audioLevel)}%` : '10%',
                          animationDelay: `${i * 0.03}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcript */}
                <div className="bg-white rounded-xl p-4 border border-neutral-lightGray max-h-64 overflow-y-auto shadow-sm">
                  <h4 className="text-sm font-semibold text-neutral-darker mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Conversation
                  </h4>
                  <div className="space-y-3">
                    {transcript.map((segment, index) => (
                      <div
                        key={index}
                        className={`text-sm p-3 rounded-lg transition-all ${
                          segment.text.includes('Call connected') || segment.text.includes('Marcy')
                            ? 'bg-gradient-subtle text-neutral-darker border border-blue-100'
                            : 'bg-neutral-lightBg text-neutral-darkGray'
                        }`}
                      >
                        {segment.text}
                      </div>
                    ))}
                    
                    {currentTranscript && (
                      <div className="text-sm p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">
                        {currentTranscript}...
                      </div>
                    )}
                    
                    <div ref={transcriptEndRef} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls (only during active call) */}
          {isCallActive && (
            <div className="p-4 bg-white border-t border-neutral-lightGray flex items-center justify-center space-x-4">
              <button
                onClick={handleToggleMute}
                className={`p-4 rounded-full transition-all ${
                  isMuted
                    ? 'bg-status-warning text-white'
                    : 'bg-neutral-lightBg text-neutral-darkGray hover:bg-neutral-lightGray'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <button
                onClick={handleEndCall}
                className="p-4 rounded-full bg-status-error text-white hover:bg-status-error/90 transition-all"
              >
                <Phone className="w-6 h-6 transform rotate-135" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdvancedVoiceWidget;
