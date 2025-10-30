-- SUBTASK 1: Fix Critical Database Issues
-- Purpose: Add missing system_prompt column
-- This is the MINIMUM fix to unblock Agent Setup functionality

-- Add missing system_prompt column
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS system_prompt TEXT
DEFAULT 'You are a professional AI receptionist. Your role is to answer incoming calls warmly, capture caller information (name, phone, reason for calling), and provide helpful assistance. Always be polite, concise, and professional.';

-- Add helpful comment
COMMENT ON COLUMN public.assistants.system_prompt IS 'AI behavior instructions sent to Vapi/Groq. Max 10,000 chars recommended.';

-- VERIFICATION: Check if column was added
SELECT
  column_name,
  data_type,
  column_default IS NOT NULL as has_default
FROM information_schema.columns
WHERE table_name = 'assistants' AND column_name = 'system_prompt';
