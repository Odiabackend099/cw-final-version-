// Vapi Voice Configuration
// Supported voice providers and their voices

export interface VapiVoice {
  id: string;
  name: string;
  provider: 'vapi' | 'elevenlabs' | 'playht' | 'azure' | 'deepgram' | 'cartesia' | 'openai';
  voiceId: string;
  gender: 'male' | 'female';
  accent: string;
  age: number;
  description: string;
  isPremium: boolean;
  previewUrl?: string;
}

// Vapi Native Voices (Free tier)
export const VAPI_NATIVE_VOICES: VapiVoice[] = [
  {
    id: 'vapi-rohan',
    name: 'Rohan',
    provider: 'vapi',
    voiceId: 'rohan',
    gender: 'male',
    accent: 'Indian American',
    age: 24,
    description: 'Bright, optimistic, cheerful, energetic',
    isPremium: false,
  },
  {
    id: 'vapi-neha',
    name: 'Neha',
    provider: 'vapi',
    voiceId: 'neha',
    gender: 'female',
    accent: 'Indian American',
    age: 30,
    description: 'Professional, charming',
    isPremium: false,
  },
  {
    id: 'vapi-hana',
    name: 'Hana',
    provider: 'vapi',
    voiceId: 'hana',
    gender: 'female',
    accent: 'American',
    age: 22,
    description: 'Soft, soothing, gentle',
    isPremium: false,
  },
  {
    id: 'vapi-harry',
    name: 'Harry',
    provider: 'vapi',
    voiceId: 'harry',
    gender: 'male',
    accent: 'American',
    age: 24,
    description: 'Clear, energetic, professional',
    isPremium: false,
  },
  {
    id: 'vapi-elliot',
    name: 'Elliot',
    provider: 'vapi',
    voiceId: 'elliot',
    gender: 'male',
    accent: 'Canadian',
    age: 25,
    description: 'Soothing, friendly, professional',
    isPremium: false,
  },
  {
    id: 'vapi-lily',
    name: 'Lily',
    provider: 'vapi',
    voiceId: 'lily',
    gender: 'female',
    accent: 'Asian American',
    age: 25,
    description: 'Bright personality, bubbly, cheerful',
    isPremium: false,
  },
  {
    id: 'vapi-paige',
    name: 'Paige',
    provider: 'vapi',
    voiceId: 'paige',
    gender: 'female',
    accent: 'American',
    age: 26,
    description: 'Deeper tone, calming, professional',
    isPremium: false,
  },
  {
    id: 'vapi-cole',
    name: 'Cole',
    provider: 'vapi',
    voiceId: 'cole',
    gender: 'male',
    accent: 'American',
    age: 22,
    description: 'Deeper tone, calming, professional',
    isPremium: false,
  },
  {
    id: 'vapi-savannah',
    name: 'Savannah',
    provider: 'vapi',
    voiceId: 'savannah',
    gender: 'female',
    accent: 'Southern American',
    age: 25,
    description: 'Warm, Southern hospitality',
    isPremium: false,
  },
  {
    id: 'vapi-spencer',
    name: 'Spencer',
    provider: 'vapi',
    voiceId: 'spencer',
    gender: 'female',
    accent: 'American',
    age: 26,
    description: 'Energetic, quippy, lighthearted, cheeky',
    isPremium: false,
  },
];

// ElevenLabs Voices (Premium tier - requires ElevenLabs API key)
// Note: These require user to configure their own ElevenLabs API key in Vapi dashboard
export const ELEVENLABS_VOICES: VapiVoice[] = [
  {
    id: 'elevenlabs-rachel',
    name: 'Rachel (ElevenLabs)',
    provider: 'elevenlabs',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    gender: 'female',
    accent: 'American',
    age: 30,
    description: 'Calm, professional, versatile narrator',
    isPremium: true,
  },
  {
    id: 'elevenlabs-adam',
    name: 'Adam (ElevenLabs)',
    provider: 'elevenlabs',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    gender: 'male',
    accent: 'American',
    age: 35,
    description: 'Deep, confident, professional narrator',
    isPremium: true,
  },
];

// PlayHT Voices (Premium tier - requires PlayHT API key)
export const PLAYHT_VOICES: VapiVoice[] = [
  {
    id: 'playht-jennifer',
    name: 'Jennifer (PlayHT)',
    provider: 'playht',
    voiceId: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
    gender: 'female',
    accent: 'American',
    age: 28,
    description: 'Professional customer service voice',
    isPremium: true,
  },
];

// Azure Voices (Premium tier)
export const AZURE_VOICES: VapiVoice[] = [
  {
    id: 'azure-jenny',
    name: 'Jenny (Azure)',
    provider: 'azure',
    voiceId: 'en-US-JennyNeural',
    gender: 'female',
    accent: 'American',
    age: 28,
    description: 'Friendly, customer service optimized',
    isPremium: true,
  },
  {
    id: 'azure-guy',
    name: 'Guy (Azure)',
    provider: 'azure',
    voiceId: 'en-US-GuyNeural',
    gender: 'male',
    accent: 'American',
    age: 32,
    description: 'Professional, clear, trustworthy',
    isPremium: true,
  },
];

// All available voices
export const ALL_VAPI_VOICES: VapiVoice[] = [
  ...VAPI_NATIVE_VOICES,
  ...ELEVENLABS_VOICES,
  ...PLAYHT_VOICES,
  ...AZURE_VOICES,
];

// Get voice by ID
export const getVoiceById = (id: string): VapiVoice | undefined => {
  return ALL_VAPI_VOICES.find(voice => voice.id === id);
};

// Get voices by provider
export const getVoicesByProvider = (provider: string): VapiVoice[] => {
  return ALL_VAPI_VOICES.filter(voice => voice.provider === provider);
};

// Get free voices only
export const getFreeVoices = (): VapiVoice[] => {
  return ALL_VAPI_VOICES.filter(voice => !voice.isPremium);
};

// Get premium voices only
export const getPremiumVoices = (): VapiVoice[] => {
  return ALL_VAPI_VOICES.filter(voice => voice.isPremium);
};

// Default voice (recommended starting point)
export const DEFAULT_VOICE_ID = 'vapi-harry'; // Professional, clear, energetic
