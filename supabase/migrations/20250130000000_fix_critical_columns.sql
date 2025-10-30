-- SUBTASK 1: Fix Critical Database Issues
-- Run this in Supabase Dashboard > SQL Editor
-- Purpose: Add missing system_prompt column and enforce user_id NOT NULL

-- Step 1: Add missing system_prompt column
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS system_prompt TEXT
DEFAULT 'You are a professional AI receptionist. Your role is to answer incoming calls warmly, capture caller information (name, phone, reason for calling), and provide helpful assistance. Always be polite, concise, and professional.';

-- Step 2: Populate user_id from created_by for existing rows
UPDATE public.assistants
SET user_id = created_by
WHERE user_id IS NULL AND created_by IS NOT NULL;

-- Step 3: Delete orphaned assistants with no owner
DELETE FROM public.assistants
WHERE user_id IS NULL;

-- Step 4: Enforce user_id NOT NULL constraint
ALTER TABLE public.assistants
ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Add helpful comments
COMMENT ON COLUMN public.assistants.system_prompt IS 'AI behavior instructions sent to Vapi/Groq. Max 10,000 chars recommended.';
COMMENT ON COLUMN public.assistants.user_id IS 'Owner of this assistant. Cannot be NULL for security (RLS policies).';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify system_prompt column exists and has default
SELECT
  column_name,
  data_type,
  character_maximum_length,
  column_default IS NOT NULL as has_default
FROM information_schema.columns
WHERE table_name = 'assistants' AND column_name = 'system_prompt';

-- Verify user_id is NOT NULL
SELECT
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'assistants' AND column_name = 'user_id';

-- Count assistants (should be 0 orphans)
SELECT
  COUNT(*) as total_assistants,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as orphaned_assistants,
  COUNT(CASE WHEN system_prompt IS NOT NULL THEN 1 END) as has_system_prompt
FROM public.assistants;

-- Expected results:
-- 1. system_prompt: text, unlimited length, has_default=true
-- 2. user_id: is_nullable=NO
-- 3. orphaned_assistants=0, has_system_prompt=total_assistants
