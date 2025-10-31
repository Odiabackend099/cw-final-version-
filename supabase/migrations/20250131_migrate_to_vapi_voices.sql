-- Migration: Remove Minimax TTS fields and add Vapi voice configuration
-- Date: 2025-01-31
-- Purpose: Transition from Minimax TTS to Vapi native voices

-- Step 1: Add new Vapi voice fields to assistants table
ALTER TABLE assistants
ADD COLUMN IF NOT EXISTS vapi_voice_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS vapi_voice_provider VARCHAR(50) DEFAULT 'vapi';

-- Step 2: Migrate existing minimax_voice_id to vapi_voice_id (set to default voice)
-- Users with Minimax configured will be reset to default Vapi voice
UPDATE assistants
SET vapi_voice_id = 'vapi-harry',
    vapi_voice_provider = 'vapi'
WHERE use_minimax_tts = true AND minimax_voice_id IS NOT NULL;

-- Step 3: Set default voice for assistants without any voice configured
UPDATE assistants
SET vapi_voice_id = 'vapi-harry',
    vapi_voice_provider = 'vapi'
WHERE vapi_voice_id IS NULL;

-- Step 4: Drop old Minimax TTS columns (keep for now, mark as deprecated)
-- NOTE: We'll keep these columns for 30 days to allow rollback if needed
-- After 30 days, run: ALTER TABLE assistants DROP COLUMN minimax_voice_id, DROP COLUMN use_minimax_tts;

-- Add comments to deprecated columns
COMMENT ON COLUMN assistants.minimax_voice_id IS 'DEPRECATED: Use vapi_voice_id instead. Will be removed after 2025-02-28';
COMMENT ON COLUMN assistants.use_minimax_tts IS 'DEPRECATED: Minimax TTS reserved for 1804 plan with voice cloning. Will be removed after 2025-02-28';

-- Step 5: Add index for faster voice lookups
CREATE INDEX IF NOT EXISTS idx_assistants_vapi_voice ON assistants(vapi_voice_id, vapi_voice_provider);

-- Step 6: Add constraint to ensure valid voice provider
ALTER TABLE assistants
ADD CONSTRAINT check_vapi_voice_provider
CHECK (vapi_voice_provider IN ('vapi', 'elevenlabs', 'playht', 'azure', 'deepgram', 'cartesia', 'openai'));

-- Notification
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: Minimax TTS fields deprecated, Vapi voices enabled';
  RAISE NOTICE 'Minimax TTS reserved for future 1804 plan with voice cloning feature';
END $$;
