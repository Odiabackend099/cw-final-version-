-- Combined migration script for production
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================================================
-- MIGRATION 1: Create minimax_voices table (from 20250129000000)
-- ============================================================================

-- Create minimax_voices table
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

-- Add RLS policies for minimax_voices
ALTER TABLE public.minimax_voices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active voices" ON public.minimax_voices;
CREATE POLICY "Anyone can view active voices"
  ON public.minimax_voices FOR SELECT
  USING (is_active = true);

-- Seed default voices
INSERT INTO public.minimax_voices (voice_id, voice_name, gender, accent, description, is_active, is_premium)
VALUES
  ('moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc', 'Odia', 'male', 'African', 'Deep, authoritative African male voice. Perfect for professional greetings.', true, false),
  ('moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', 'Marcus', 'male', 'American', 'Friendly, approachable American male voice. Great for customer service.', true, false),
  ('moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a', 'Marcy', 'female', 'American', 'Professional, warm American female voice. Ideal for receptionists.', true, false),
  ('moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82', 'Joslyn', 'female', 'African', 'Energetic, engaging African female voice. Perfect for sales.', true, false)
ON CONFLICT (voice_id) DO NOTHING;

-- Add voice columns to assistants table
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS minimax_voice_id TEXT REFERENCES public.minimax_voices(voice_id);

ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS use_minimax_tts BOOLEAN DEFAULT false;

-- ============================================================================
-- MIGRATION 2: Create knowledge_base_files table (from 20250129000001)
-- ============================================================================

-- Create knowledge_base_files table
CREATE TABLE IF NOT EXISTS public.knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES public.assistants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  processed BOOLEAN DEFAULT false,
  embeddings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for knowledge_base_files
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own knowledge base files" ON public.knowledge_base_files;
CREATE POLICY "Users can manage their own knowledge base files"
  ON public.knowledge_base_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assistants
      WHERE assistants.id = knowledge_base_files.assistant_id
      AND assistants.user_id = auth.uid()
    )
  );

-- Create storage bucket for knowledge base (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-base', 'knowledge-base', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MIGRATION 3: Add assistant columns and fix storage RLS (from 20250129000002)
-- ============================================================================

-- Add missing columns to assistants table
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS business_name TEXT;

ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS business_industry TEXT;

ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS business_hours TEXT DEFAULT 'Monday-Friday 9AM-5PM';

ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_assistants_user_id ON public.assistants(user_id);

-- Update RLS policies for assistants table
DROP POLICY IF EXISTS "Anyone can view active assistants" ON public.assistants;
DROP POLICY IF EXISTS "Allow insert assistants" ON public.assistants;
DROP POLICY IF EXISTS "Allow update assistants" ON public.assistants;
DROP POLICY IF EXISTS "Users can view their own assistants" ON public.assistants;
DROP POLICY IF EXISTS "Users can create their own assistants" ON public.assistants;
DROP POLICY IF EXISTS "Users can update their own assistants" ON public.assistants;

CREATE POLICY "Users can view their own assistants"
  ON public.assistants FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can create their own assistants"
  ON public.assistants FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own assistants"
  ON public.assistants FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Fix storage RLS policies to use assistant_id folder structure
DROP POLICY IF EXISTS "Users can upload to their own assistant folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own assistant files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own assistant files" ON storage.objects;

-- Create new policies that use assistant_id folder structure (not user_id)
CREATE POLICY "Users can upload to their own assistant folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'knowledge-base'
    AND EXISTS (
      SELECT 1 FROM public.assistants
      WHERE assistants.id::text = (storage.foldername(name))[1]
      AND assistants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own assistant files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'knowledge-base'
    AND EXISTS (
      SELECT 1 FROM public.assistants
      WHERE assistants.id::text = (storage.foldername(name))[1]
      AND assistants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own assistant files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'knowledge-base'
    AND EXISTS (
      SELECT 1 FROM public.assistants
      WHERE assistants.id::text = (storage.foldername(name))[1]
      AND assistants.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify minimax_voices table has 4 voices
SELECT COUNT(*) as voice_count FROM public.minimax_voices WHERE is_active = true;

-- Verify knowledge_base_files table exists
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'knowledge_base_files';

-- Verify assistants table has new columns
SELECT column_name FROM information_schema.columns
WHERE table_name = 'assistants' AND table_schema = 'public'
AND column_name IN ('user_id', 'business_name', 'business_industry', 'business_hours', 'timezone', 'minimax_voice_id', 'use_minimax_tts');

-- Verify storage bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'knowledge-base';
