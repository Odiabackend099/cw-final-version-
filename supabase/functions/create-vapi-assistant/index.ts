import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Create Vapi Assistant with Minimax TTS Configuration
// This function creates a Vapi assistant that uses Minimax TTS for voice calls

const VAPI_API_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
const VAPI_API_URL = 'https://api.vapi.ai/assistant';
const MINIMAX_TTS_URL = Deno.env.get('VITE_SUPABASE_URL') + '/functions/v1/minimax-tts';

interface CreateAssistantRequest {
  business_name: string;
  system_prompt: string;
  minimax_voice_id: string;
  first_message?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    if (!VAPI_API_KEY) {
      throw new Error('VAPI_PRIVATE_KEY not configured');
    }

    const body: CreateAssistantRequest = await req.json();
    const { business_name, system_prompt, minimax_voice_id, first_message } = body;

    if (!business_name || !system_prompt || !minimax_voice_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Vapi assistant with custom voice configuration
    const vapiAssistant = {
      name: business_name,
      model: {
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: system_prompt,
          },
        ],
        temperature: 0.7,
        maxTokens: 500,
      },
      voice: {
        provider: 'custom-voice',
        server: {
          url: MINIMAX_TTS_URL,
          secret: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        },
        // Pass voice ID in metadata that will be sent to our endpoint
        metadata: {
          voiceId: minimax_voice_id,
        },
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en-US',
      },
      firstMessage: first_message || `Hello! I'm the AI assistant for ${business_name}. How can I help you today?`,
      silenceTimeoutSeconds: 30,
      responseDelaySeconds: 0.4,
      interruptionsEnabled: true,
      backgroundSound: 'off',
    };

    console.log('Creating Vapi assistant:', {
      name: business_name,
      voice_id: minimax_voice_id,
    });

    // Call Vapi API to create assistant
    const response = await fetch(VAPI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiAssistant),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vapi API error:', errorText);
      throw new Error(`Vapi API returned ${response.status}: ${errorText}`);
    }

    const vapiData = await response.json();

    console.log('✅ Vapi assistant created:', vapiData.id);

    return new Response(
      JSON.stringify({
        success: true,
        vapi_assistant_id: vapiData.id,
        assistant: vapiData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error creating Vapi assistant:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create assistant',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/*
 * Create Vapi Assistant with Minimax TTS
 *
 * This endpoint creates a Vapi assistant configured with Minimax TTS voices.
 * The assistant can then be used for test calls that use the selected Minimax voice.
 *
 * Request:
 * {
 *   "business_name": "Smith & Co",
 *   "system_prompt": "You are a professional AI receptionist...",
 *   "minimax_voice_id": "moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc",
 *   "first_message": "Hello! How can I help you?"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "vapi_assistant_id": "asst_xxx",
 *   "assistant": { ... }
 * }
 */
