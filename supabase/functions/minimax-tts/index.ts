import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Default Minimax TTS model.
 * speech-02-hd: High-definition speech model with improved quality
 */
const DEFAULT_MINIMAX_MODEL = 'speech-02-hd';

/**
 * Default voice parameters based on Minimax API specifications
 */
const DEFAULT_VOICE_PARAMS = {
  speed: 1.0,      // Normal speech rate (range: 0.5-2.0)
  volume: 5,       // Mid-range volume (range: 0-10)
  pitch: 0,        // Neutral pitch (range: -12 to 12 semitones)
  sampleRate: 32000,  // 32kHz for good quality/size balance
  bitrate: 128000,    // 128kbps MP3
} as const;

/**
 * Request limits for security and cost control
 */
const REQUEST_LIMITS = {
  MAX_TEXT_LENGTH: 5000,        // Maximum characters in text
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB maximum request body size
  API_TIMEOUT_MS: 30000,       // 30 second timeout for Minimax API
} as const;

/**
 * Voice ID pattern validation (UUID-like format)
 */
const VOICE_ID_PATTERN = /^[a-f0-9-]{36}$/i;

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY');
const MINIMAX_GROUP_ID = Deno.env.get('MINIMAX_GROUP_ID');
const MINIMAX_MODEL = Deno.env.get('MINIMAX_MODEL') || DEFAULT_MINIMAX_MODEL;
const MINIMAX_API_URL = 'https://api.minimax.io/v1/t2a_v2';
const IS_PRODUCTION = Deno.env.get('DENO_ENV') === 'production' || Deno.env.get('ENVIRONMENT') === 'production';

/**
 * Allowed origins for CORS (restrict in production)
 */
const ALLOWED_ORIGINS = [
  'https://bcufohulqrceytkrqpgd.supabase.co',
  'https://callwaitingai-frontend-gyn1kc42u-odia-backends-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

// ============================================================================
// Type Definitions
// ============================================================================

interface TTSRequest {
  text: string;
  /** @deprecated Use voiceId instead. Provided for backward compatibility. */
  voice_id?: string;
  /** Primary voice identifier (Vapi format: camelCase) */
  voiceId?: string;
  speed?: number; // 0.5 to 2.0
  vol?: number; // 0 to 10 (deprecated, use volume)
  volume?: number; // 0 to 10
  pitch?: number; // -12 to 12
  audio_sample_rate?: number; // 16000, 24000, 32000
  bitrate?: number; // 64000, 128000, 192000
}

interface MinimaxResponse {
  audio?: string;
  audio_file?: string;
  data?: {
    audio?: string;
  };
  extra_info?: any;
  usage?: any;
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get CORS headers based on request origin
 */
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : (IS_PRODUCTION ? 'null' : '*');
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

/**
 * Validate and sanitize text input
 */
function validateText(text: unknown): { valid: boolean; sanitized?: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'text field is required and must be a string' };
  }
  
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'text field cannot be empty' };
  }
  
  if (trimmed.length > REQUEST_LIMITS.MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text exceeds maximum length of ${REQUEST_LIMITS.MAX_TEXT_LENGTH} characters`,
    };
  }
  
  return { valid: true, sanitized: trimmed };
}

/**
 * Validate voice ID format
 */
function validateVoiceId(voiceId: string): boolean {
  return VOICE_ID_PATTERN.test(voiceId);
}

/**
 * Clamp numeric value between min and max
 */
function clamp(value: number | undefined, min: number, max: number, defaultValue: number): number {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return Math.max(min, Math.min(max, value));
}

/**
 * Validate audio URL format
 */
function isValidAudioUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Create success response
 */
function createSuccessResponse(
  audioUrl: string,
  voiceId: string,
  textLength: number,
  extraData?: any,
  requestId?: string
): Response {
  const response: any = {
    success: true,
    audio: audioUrl,
    audio_file: audioUrl,
    extra_info: extraData?.extra_info || {},
    usage: extraData?.usage || {},
    voice_id: voiceId,
    text_length: textLength,
  };

  if (requestId) {
    response.request_id = requestId;
  }

  return new Response(
    JSON.stringify(response),
    {
      status: 200,
      headers: getCorsHeaders(null),
    }
  );
}

/**
 * Create error response
 */
function createErrorResponse(
  error: string,
  status: number,
  details?: any,
  requestId?: string
): Response {
  const response: any = {
    error,
  };

  if (requestId) {
    response.request_id = requestId;
  }

  if (details && !IS_PRODUCTION) {
    response.details = details;
  } else if (details && status >= 500) {
    // In production, only include safe error details for 5xx errors
    response.details = typeof details === 'object' && details.base_resp?.status_code
      ? { error_code: details.base_resp.status_code }
      : { status_code: status };
  } else if (details) {
    // For 4xx errors, include user-friendly details
    response.details = details;
  }

  return new Response(
    JSON.stringify(response),
    {
      status,
      headers: getCorsHeaders(null),
    }
  );
}

/**
 * Structured logging
 */
function log(level: 'info' | 'warn' | 'error', event: string, data: any, requestId?: string) {
  const logEntry = {
    level,
    event,
    request_id: requestId,
    timestamp: new Date().toISOString(),
    ...data,
  };
  console.log(JSON.stringify(logEntry));
}

// ============================================================================
// Main Handler
// ============================================================================

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const requestStartTime = Date.now();
  const origin = req.headers.get('origin');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(origin) });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return createErrorResponse(
      'Method not allowed. Use POST.',
      405,
      undefined,
      requestId
    );
  }

  try {
    // Validate API credentials
    if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
      log('error', 'missing_credentials', {}, requestId);
      return createErrorResponse(
        'Voice service not configured',
        500,
        undefined,
        requestId
      );
    }

    // Check request body size
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > REQUEST_LIMITS.MAX_REQUEST_SIZE) {
      return createErrorResponse(
        'Request body too large',
        413,
        { max_size: REQUEST_LIMITS.MAX_REQUEST_SIZE },
        requestId
      );
    }

    // Parse request body with error handling
    let body: TTSRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      log('error', 'invalid_json', { error: String(parseError) }, requestId);
      return createErrorResponse(
        'Invalid JSON in request body',
        400,
        undefined,
        requestId
      );
    }

    // Validate and sanitize text
    const textValidation = validateText(body.text);
    if (!textValidation.valid) {
      return createErrorResponse(
        textValidation.error || 'Invalid text',
        400,
        { field: 'text' },
        requestId
      );
    }
    const sanitizedText = textValidation.sanitized!;

    // Resolve voice ID with explicit precedence
    const finalVoiceId = body.voice_id ?? body.voiceId;
    
    if (body.voice_id && body.voiceId && body.voice_id !== body.voiceId) {
      log('warn', 'voice_id_conflict', {
        voice_id: body.voice_id,
        voiceId: body.voiceId,
      }, requestId);
    }

    if (!finalVoiceId) {
      return createErrorResponse(
        'Missing required field: voice_id or voiceId is required',
        400,
        { field: 'voice_id' },
        requestId
      );
    }

    if (!validateVoiceId(finalVoiceId)) {
      return createErrorResponse(
        'Invalid voice_id format',
        400,
        { field: 'voice_id', format: 'UUID-like string' },
        requestId
      );
    }

    // Validate and clamp numeric parameters
    const clampedSpeed = clamp(
      body.speed,
      0.5,
      2.0,
      DEFAULT_VOICE_PARAMS.speed
    );
    const clampedVolume = clamp(
      body.volume ?? body.vol,
      0,
      10,
      DEFAULT_VOICE_PARAMS.volume
    );
    const clampedPitch = clamp(
      body.pitch,
      -12,
      12,
      DEFAULT_VOICE_PARAMS.pitch
    );
    const clampedSampleRate = body.audio_sample_rate || DEFAULT_VOICE_PARAMS.sampleRate;
    const clampedBitrate = body.bitrate || DEFAULT_VOICE_PARAMS.bitrate;

    log('info', 'minimax_tts_request', {
      voice_id: finalVoiceId,
      text_length: sanitizedText.length,
    }, requestId);

    // Prepare Minimax API request
    const minimaxRequest = {
      model: MINIMAX_MODEL,
      text: sanitizedText,
      stream: false,
      voice_setting: {
        voice_id: finalVoiceId,
        speed: clampedSpeed,
        vol: clampedVolume,
        pitch: clampedPitch,
      },
      audio_setting: {
        sample_rate: clampedSampleRate,
        bitrate: clampedBitrate,
        format: 'mp3',
      },
      output_format: 'url',
      pronunciation_dict: {
        tone: [],
      },
    };

    // Call Minimax API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_LIMITS.API_TIMEOUT_MS);

    let response: Response;
    try {
      log('info', 'minimax_api_call_start', {}, requestId);
      
      response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MINIMAX_API_KEY}`,
          'Content-Type': 'application/json',
          'GroupId': MINIMAX_GROUP_ID!,
        },
        body: JSON.stringify(minimaxRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        log('error', 'minimax_api_timeout', {}, requestId);
        return createErrorResponse(
          'Voice service request timeout',
          504,
          { timeout_ms: REQUEST_LIMITS.API_TIMEOUT_MS },
          requestId
        );
      }

      log('error', 'minimax_api_fetch_error', {
        error: String(fetchError),
        message: fetchError.message,
      }, requestId);
      
      throw fetchError; // Re-throw to be caught by outer catch
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorDetails: any = {};
      try {
        const errorText = await response.text();
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          errorDetails = { raw_response: errorText.slice(0, 200) }; // Limit length
        }
      } catch {
        // Ignore parsing errors
      }

      log('error', 'minimax_api_error', {
        status: response.status,
        error_details: errorDetails,
      }, requestId);

      // Sanitize error details before sending to client
      const safeErrorDetails = {
        status_code: response.status,
        ...(errorDetails.base_resp?.status_code
          ? { error_code: errorDetails.base_resp.status_code }
          : {}),
      };

      return createErrorResponse(
        'Voice service error',
        response.status >= 400 && response.status < 500 ? response.status : 502,
        safeErrorDetails,
        requestId
      );
    }

    // Parse response JSON with error handling
    let data: MinimaxResponse;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (parseError) {
      log('error', 'minimax_response_parse_error', {
        error: String(parseError),
        status: response.status,
      }, requestId);
      
      return createErrorResponse(
        'Invalid response from voice service',
        502,
        { status: response.status },
        requestId
      );
    }

    // Extract audio URL from various response formats
    let audioUrl: string | undefined;

    if (data.audio) {
      audioUrl = data.audio;
    } else if (data.audio_file) {
      audioUrl = data.audio_file;
    } else if (data.data?.audio) {
      audioUrl = data.data.audio;
    }

    if (!audioUrl) {
      log('error', 'unexpected_response_format', {
        response_keys: Object.keys(data),
      }, requestId);

      return createErrorResponse(
        'Unexpected response format from voice service',
        502,
        IS_PRODUCTION ? undefined : { received_keys: Object.keys(data) },
        requestId
      );
    }

    // Validate audio URL
    if (!isValidAudioUrl(audioUrl)) {
      log('error', 'invalid_audio_url', {
        url: audioUrl.slice(0, 100), // Log first 100 chars only
      }, requestId);

      return createErrorResponse(
        'Invalid audio URL received from voice service',
        502,
        undefined,
        requestId
      );
    }

    const duration = Date.now() - requestStartTime;
    log('info', 'minimax_tts_success', {
      voice_id: finalVoiceId,
      text_length: sanitizedText.length,
      duration_ms: duration,
    }, requestId);

    return createSuccessResponse(
      audioUrl,
      finalVoiceId,
      sanitizedText.length,
      data,
      requestId
    );

  } catch (error: any) {
    const duration = Date.now() - requestStartTime;
    log('error', 'unexpected_error', {
      error: String(error),
      message: error.message,
      duration_ms: duration,
    }, requestId);

    // Never expose stack traces in production
    return createErrorResponse(
      IS_PRODUCTION
        ? 'An error occurred processing your request'
        : error.message || 'Internal server error',
      500,
      IS_PRODUCTION ? undefined : { message: error.message },
      requestId
    );
  }
});

/*
 * Minimax TTS Edge Function - Production Ready
 *
 * Features:
 * - Input validation and sanitization
 * - Timeout handling for external API calls
 * - Secure error handling (no stack traces in production)
 * - CORS with origin restrictions
 * - Request ID for tracing
 * - Structured logging
 * - Request size limits
 * - Audio URL validation
 *
 * Usage:
 * POST https://your-project.supabase.co/functions/v1/minimax-tts
 *
 * Request body:
 * {
 *   "text": "Hello, this is a test",
 *   "voiceId": "moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a",
 *   "speed": 1.0,
 *   "volume": 5,
 *   "pitch": 0
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "audio": "https://...",
 *   "audio_file": "https://...",
 *   "voice_id": "...",
 *   "text_length": 123,
 *   "request_id": "..."
 * }
 *
 * Available voices:
 * - Odia (African male): moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc
 * - Marcus (American male): moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc
 * - Marcy (American female): moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a
 * - Joslyn (African female): moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82
 */
