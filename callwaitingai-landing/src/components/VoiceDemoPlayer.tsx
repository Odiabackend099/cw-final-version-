import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  gender: string;
  accent: string;
  description: string;
  voice_id: string; // Minimax voice ID
  sampleUrl?: string; // Optional: pre-generated sample URL
}

interface VoiceDemoPlayerProps {
  voices: Voice[];
  onVoiceSelect?: (voiceId: string) => void;
  selectedVoiceId?: string;
}

// Voice configuration with correct Minimax voice IDs
const VOICE_CONFIG: Voice[] = [
  {
    id: 'odia',
    name: 'Odia',
    gender: 'Male',
    accent: 'African',
    description: 'Warm and professional, perfect for business communications',
    voice_id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
  },
  {
    id: 'marcus',
    name: 'Marcus',
    gender: 'Male',
    accent: 'American',
    description: 'Confident and clear, authoritative and trustworthy',
    voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
  },
  {
    id: 'marcy',
    name: 'Marcy',
    gender: 'Female',
    accent: 'American',
    description: 'Warm and welcoming, friendly and approachable',
    voice_id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
  },
  {
    id: 'joslyn',
    name: 'Joslyn',
    gender: 'Female',
    accent: 'African',
    description: 'Clear and professional, approachable and articulate',
    voice_id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
  },
];

const DEMO_TEXT = 'Hello! This is a demonstration of our AI voice receptionist. I can handle customer inquiries, schedule appointments, and provide information around the clock.';

export const VoiceDemoPlayer: React.FC<VoiceDemoPlayerProps> = ({
  voices,
  onVoiceSelect,
  selectedVoiceId,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bcufohulqrceytkrqpgd.supabase.co';
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI';
  const MINIMAX_ENDPOINT = `${SUPABASE_URL}/functions/v1/minimax-tts`;

  // Merge provided voices with our voice config
  const displayVoices = voices.length > 0 
    ? voices.map(v => {
        const config = VOICE_CONFIG.find(c => c.voice_id === v.voice_id);
        return config ? { ...v, ...config } : v;
      })
    : VOICE_CONFIG;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const handlePlayPause = async (voice: Voice) => {
    const audioId = voice.voice_id;

    // If this audio is already playing, pause it
    if (playingId === audioId) {
      const audio = audioRefs.current[audioId];
      if (audio) {
        audio.pause();
        setPlayingId(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (playingId) {
      const currentAudio = audioRefs.current[playingId];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // If we already have the URL cached, use it
    if (audioUrls[audioId]) {
      playAudio(audioId, audioUrls[audioId]);
      return;
    }

    // Generate new audio
    try {
      setLoadingId(audioId);

      const response = await fetch(MINIMAX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text: DEMO_TEXT,
          voiceId: voice.voice_id, // Use camelCase for Minimax endpoint
          speed: 1.0,
          volume: 5,
          pitch: 0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && (data.audio || data.audio_file)) {
        const audioUrl = data.audio || data.audio_file;
        setAudioUrls(prev => ({ ...prev, [audioId]: audioUrl }));
        playAudio(audioId, audioUrl);
      } else {
        console.error('Failed to generate audio:', data.error);
        alert(`Failed to generate audio: ${data.error || 'Unknown error'}`);
        setLoadingId(null);
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      alert(`Error: ${error.message}`);
      setLoadingId(null);
    }
  };

  const playAudio = (audioId: string, url: string) => {
    let audio = audioRefs.current[audioId];
    
    if (!audio) {
      audio = new Audio();
      audioRefs.current[audioId] = audio;
      
      audio.addEventListener('ended', () => {
        setPlayingId(null);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setPlayingId(null);
        setLoadingId(null);
      });
    }

    audio.src = url;
    audio.play()
      .then(() => {
        setPlayingId(audioId);
        setLoadingId(null);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setPlayingId(null);
        setLoadingId(null);
      });
  };

  const handleVoiceSelect = (voice: Voice) => {
    if (onVoiceSelect) {
      onVoiceSelect(voice.voice_id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          Voice Demo - Listen & Choose
        </h3>
        <p className="text-sm text-gray-600">
          Click play to hear each voice, then select your preferred one below
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayVoices.map((voice) => {
          const isPlaying = playingId === voice.voice_id;
          const isLoading = loadingId === voice.voice_id;
          const isSelected = selectedVoiceId === voice.voice_id;

          return (
            <div
              key={voice.voice_id}
              className={`relative p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                  <p className="text-sm text-gray-600">
                    {voice.gender} • {voice.accent}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayPause(voice)}
                  disabled={isLoading}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isPlaying
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{voice.description}</p>

              <button
                onClick={() => handleVoiceSelect(voice)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected ? '✓ Selected' : 'Select This Voice'}
              </button>

              {/* Hidden audio element */}
              <audio ref={(el) => { if (el) audioRefs.current[voice.voice_id] = el; }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceDemoPlayer;

