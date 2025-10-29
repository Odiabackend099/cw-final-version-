-- Create minimax_voices table for voice library
CREATE TABLE IF NOT EXISTS public.minimax_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id TEXT NOT NULL UNIQUE,
  voice_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'neutral')),
  accent TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  sample_audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on voice_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_minimax_voices_voice_id ON public.minimax_voices(voice_id);
CREATE INDEX IF NOT EXISTS idx_minimax_voices_is_active ON public.minimax_voices(is_active);

-- Enable RLS
ALTER TABLE public.minimax_voices ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active voices
CREATE POLICY "Anyone can read active minimax voices"
  ON public.minimax_voices
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage voices
CREATE POLICY "Admins can manage minimax voices"
  ON public.minimax_voices
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Insert default Minimax voices
INSERT INTO public.minimax_voices (voice_id, voice_name, gender, accent, description, is_premium) VALUES
  (
    'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    'Odia',
    'male',
    'African',
    'Deep, authoritative African male voice. Professional and commanding tone.',
    false
  ),
  (
    'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
    'Marcus',
    'male',
    'American',
    'Friendly American male voice. Warm and approachable, perfect for customer service.',
    false
  ),
  (
    'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
    'Marcy',
    'female',
    'American',
    'Professional American female voice. Clear and engaging, ideal for receptionists.',
    false
  ),
  (
    'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
    'Joslyn',
    'female',
    'African',
    'Energetic African female voice. Vibrant and friendly, great for customer engagement.',
    false
  )
ON CONFLICT (voice_id) DO NOTHING;

-- Add minimax_voice_id column to assistants table
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS minimax_voice_id TEXT REFERENCES public.minimax_voices(voice_id);

-- Add use_minimax_tts flag to assistants table
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS use_minimax_tts BOOLEAN DEFAULT false;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_minimax_voices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_minimax_voices_updated_at ON public.minimax_voices;
CREATE TRIGGER set_minimax_voices_updated_at
  BEFORE UPDATE ON public.minimax_voices
  FOR EACH ROW
  EXECUTE FUNCTION update_minimax_voices_updated_at();

-- Grant permissions
GRANT SELECT ON public.minimax_voices TO anon, authenticated;
GRANT ALL ON public.minimax_voices TO service_role;

COMMENT ON TABLE public.minimax_voices IS 'Library of available Minimax TTS voices';
COMMENT ON COLUMN public.minimax_voices.voice_id IS 'Minimax voice ID from their API';
COMMENT ON COLUMN public.minimax_voices.is_premium IS 'Whether this voice requires a paid subscription';
COMMENT ON COLUMN public.assistants.minimax_voice_id IS 'Custom Minimax voice for this assistant (Professional/Pro plans only)';
COMMENT ON COLUMN public.assistants.use_minimax_tts IS 'Use Minimax TTS instead of Vapi default voices';
