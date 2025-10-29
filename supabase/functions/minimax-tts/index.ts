import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY');
const MINIMAX_GROUP_ID = Deno.env.get('MINIMAX_GROUP_ID');
const MINIMAX_MODEL = Deno.env.get('MINIMAX_MODEL') || 'speech-02-hd';
const MINIMAX_API_URL = 'https://api.minimax.chat/v1/t2a_v2';

interface TTSRequest {
  text: string;
  voice_id: string;
  speed?: number; // 0.5 to 2.0
  vol?: number; // 0 to 10
  pitch?: number; // -12 to 12
  audio_sample_rate?: number; // 16000, 24000, 32000
  bitrate?: number; // 64000, 128000, 192000
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate API credentials
    if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
      console.error('Missing Minimax credentials');
      return new Response(
        JSON.stringify({
          error: 'Minimax TTS not configured. Please set MINIMAX_API_KEY and MINIMAX_GROUP_ID.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body: TTSRequest = await req.json();
    const {
      text,
      voice_id,
      speed = 1.0,
      vol = 5,
      pitch = 0,
      audio_sample_rate = 32000,
      bitrate = 128000
    } = body;

    // Validate required fields
    if (!text || !voice_id) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: text and voice_id are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🎙️ Minimax TTS request: voice=${voice_id}, text_length=${text.length}`);

    // Prepare Minimax API request
    const minimaxRequest = {
      model: MINIMAX_MODEL,
      text: text,
      stream: false,
      voice_setting: {
        voice_id: voice_id,
        speed: speed,
        vol: vol,
        pitch: pitch,
      },
      audio_setting: {
        sample_rate: audio_sample_rate,
        bitrate: bitrate,
        format: 'mp3', // Options: mp3, wav, pcm, flac
      },
      pronunciation_dict: {
        tone: [] // Optional: custom pronunciation rules
      }
    };

    // Call Minimax API
    console.log('📡 Calling Minimax API...');
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
        'GroupId': MINIMAX_GROUP_ID,
      },
      body: JSON.stringify(minimaxRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Minimax API error (${response.status}):`, errorText);

      return new Response(
        JSON.stringify({
          error: `Minimax API error: ${response.status}`,
          details: errorText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();

    // Minimax returns base64-encoded audio or URL depending on configuration
    if (data.audio_file) {
      console.log('✅ Minimax TTS successful - audio file returned');

      // Return audio URL or base64 data
      return new Response(
        JSON.stringify({
          success: true,
          audio_file: data.audio_file, // URL or base64
          extra_info: data.extra_info || {},
          usage: data.usage || {},
          voice_id: voice_id,
          text_length: text.length,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else if (data.data && data.data.audio) {
      // Alternative response format
      console.log('✅ Minimax TTS successful - audio data returned');

      return new Response(
        JSON.stringify({
          success: true,
          audio: data.data.audio,
          extra_info: data.extra_info || {},
          usage: data.usage || {},
          voice_id: voice_id,
          text_length: text.length,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.error('❌ Unexpected Minimax response format:', data);

      return new Response(
        JSON.stringify({
          error: 'Unexpected Minimax API response format',
          details: data
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error: any) {
    console.error('❌ Minimax TTS error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/*
 * Minimax TTS Edge Function
 *
 * Usage:
 * POST https://your-project.supabase.co/functions/v1/minimax-tts
 *
 * Request body:
 * {
 *   "text": "Hello, this is a test",
 *   "voice_id": "moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a",
 *   "speed": 1.0,
 *   "vol": 5,
 *   "pitch": 0
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "audio_file": "base64_or_url",
 *   "voice_id": "...",
 *   "text_length": 123
 * }
 *
 * Available voices:
 * - Odia (African male): moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc
 * - Marcus (American male): moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc
 * - Marcy (American female): moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a
 * - Joslyn (African female): moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82
 */
