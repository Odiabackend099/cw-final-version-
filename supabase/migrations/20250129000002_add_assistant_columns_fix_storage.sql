-- Migration: Add missing columns to assistants table and fix storage RLS policies
-- Created: 2025-01-29
-- Purpose: Add business profile columns and fix knowledge base storage permissions

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

-- Add helpful comments
COMMENT ON COLUMN public.assistants.user_id IS 'User who owns this assistant';
COMMENT ON COLUMN public.assistants.business_name IS 'Business name for personalized prompts';
COMMENT ON COLUMN public.assistants.business_industry IS 'Industry vertical (e.g., restaurant, salon)';
COMMENT ON COLUMN public.assistants.business_hours IS 'Operating hours for customer context';
COMMENT ON COLUMN public.assistants.timezone IS 'Timezone for accurate time-based responses';
