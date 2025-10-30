-- ============================================================================
-- CRITICAL FIX: Run this SQL NOW in Supabase Dashboard
-- Purpose: Fix "system_prompt column not found" and knowledge base upload issues
-- Time: 30 seconds
-- ============================================================================

-- Fix 1: Add missing system_prompt column
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS system_prompt TEXT
DEFAULT 'You are a professional AI receptionist. Your role is to answer incoming calls warmly, capture caller information (name, phone, reason for calling), and provide helpful assistance. Always be polite, concise, and professional.';

-- Fix 2: Populate user_id from created_by (if needed)
UPDATE public.assistants
SET user_id = created_by
WHERE user_id IS NULL AND created_by IS NOT NULL;

-- Fix 3: Delete orphaned assistants
DELETE FROM public.assistants
WHERE user_id IS NULL;

-- Fix 4: Enforce user_id NOT NULL
ALTER TABLE public.assistants
ALTER COLUMN user_id SET NOT NULL;

-- ============================================================================
-- VERIFICATION (Results will show below)
-- ============================================================================

-- Should return 1 row showing system_prompt exists
SELECT COUNT(*) as system_prompt_column_exists
FROM information_schema.columns
WHERE table_name = 'assistants' AND column_name = 'system_prompt';

-- Should show is_nullable='NO' for user_id
SELECT is_nullable
FROM information_schema.columns
WHERE table_name = 'assistants' AND column_name = 'user_id';

-- Should show 0 orphaned_assistants
SELECT
  COUNT(*) as total_assistants,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as orphaned_assistants
FROM public.assistants;

-- ✅ If all above queries return expected values, you're done!
-- Next step: Test Agent Setup page → should save successfully now
