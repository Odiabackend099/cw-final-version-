import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, User, Check } from 'lucide-react';
import { MINIMAX_VOICES } from '../types/minimax';

interface VoiceDemoPlayerProps {
  selectedVoiceId?: string | null;
  onVoiceSelect: (voiceId: string) => void;
  userTier?: string;
}

export const VoiceDemoPlayer: React.FC<VoiceDemoPlayerProps> = ({
  selectedVoiceId,
  onVoiceSelect,
  userTier,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const handlePlayPause = (voice: typeof MINIMAX_VOICES[number]) => {
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

    // Play the local audio file
    playAudio(audioId, voice.sample_audio);
  };

  const playAudio = (audioId: string, audioPath: string) => {
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
        alert('Failed to load audio sample. Please try again.');
      });
    }

    audio.src = audioPath;
    audio.play()
      .then(() => {
        setPlayingId(audioId);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setPlayingId(null);
        alert('Failed to play audio. Please check your browser settings.');
      });
  };

  const handleVoiceSelect = (voiceId: string) => {
    onVoiceSelect(voiceId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-primary-base" />
          Voice Demo - Listen & Choose Your AI Agent
        </h3>
        <p className="text-sm text-gray-600">
          Click play to hear each voice sample, then select your preferred voice for your AI agent
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MINIMAX_VOICES.map((voice) => {
          const isPlaying = playingId === voice.voice_id;
          const isSelected = selectedVoiceId === voice.voice_id;

          return (
            <div
              key={voice.voice_id}
              className={`relative p-5 border-2 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'border-primary-base bg-primary-base/5 shadow-md'
                  : 'border-gray-200 hover:border-primary-base/50 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <span className="bg-primary-base text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selected
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h4 className="font-bold text-gray-900 text-lg">{voice.voice_name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)} • {voice.accent}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayPause(voice)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-md ${
                    isPlaying
                      ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
                      : 'bg-primary-base text-white hover:bg-primary-dark'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play Sample'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{voice.description}</p>

              <button
                onClick={() => handleVoiceSelect(voice.voice_id)}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-base text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Voice Selected
                  </span>
                ) : (
                  'Select This Voice'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Choose a voice that matches your brand personality. Each voice has been optimized for clear communication and natural conversation flow.
        </p>
      </div>
    </div>
  );
};

export default VoiceDemoPlayer;

