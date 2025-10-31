// Minimax TTS Voice Types and Configuration

export interface MinimaxVoice {
  id: string;
  voice_id: string;
  voice_name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  description: string;
  is_active: boolean;
  is_premium: boolean;
  sample_audio_url?: string;
  created_at: string;
  updated_at: string;
}

export const MINIMAX_VOICES = [
  {
    voice_id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    voice_name: 'Odia',
    gender: 'male' as const,
    accent: 'African',
    description: 'Deep, authoritative African male voice. Professional and commanding tone.',
    sample_audio: '/voices/minimax-odia-30s.mp3',
    is_premium: false,
  },
  {
    voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
    voice_name: 'Marcus',
    gender: 'male' as const,
    accent: 'American',
    description: 'Friendly American male voice. Warm and approachable, perfect for customer service.',
    sample_audio: '/voices/minimax-marcus-30s.mp3',
    is_premium: false,
  },
  {
    voice_id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
    voice_name: 'Marcy',
    gender: 'female' as const,
    accent: 'American',
    description: 'Professional American female voice. Clear and engaging, ideal for receptionists.',
    sample_audio: '/voices/minimax-marcy-30s.mp3',
    is_premium: false,
  },
  {
    voice_id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
    voice_name: 'Joslyn',
    gender: 'female' as const,
    accent: 'African',
    description: 'Energetic African female voice. Vibrant and friendly, great for customer engagement.',
    sample_audio: '/voices/minimax-joslyn-30s.mp3',
    is_premium: false,
  },
] as const;

export type MinimaxVoiceId = typeof MINIMAX_VOICES[number]['voice_id'];
