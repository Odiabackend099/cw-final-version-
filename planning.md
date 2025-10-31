# Feature: Fix Vapi Voice Call for All User Tiers

## Problem Statement
- Selected Minimax TTS voice ID didn't work
- Call starts but immediately ends with "Meeting has ended" error
- User on FREE tier trying to use custom voices

## Root Causes Identified
1. VoiceCallTester looks for `VITE_VAPI_PUBLIC_KEY` env variable
2. Actual Vapi key is hardcoded in `supabase.ts` as `VAPI_CONFIG.publicKey`
3. Free tier might not support ElevenLabs voices
4. Voice configuration might be incompatible with Vapi setup

## Subtask Breakdown
- [x] Subtask A: Diagnose Vapi API Key Issue (COMPLETE)
- [x] Subtask B: Fix Vapi Key Import (COMPLETE)
- [x] Subtask C: Simplify Voice Config for All Tiers (COMPLETE)
- [ ] Subtask D: Test End-to-End (READY FOR TESTING)

## Current Subtask: D - Test End-to-End

### Implementation Phases
1. Phase 1: Import VAPI_CONFIG from supabase.ts
2. Phase 2: Use hardcoded key as fallback
3. Phase 3: Remove ElevenLabs voice config (use Vapi defaults)
4. Phase 4: Test with free tier user

### Technical Requirements
- Import: `VAPI_CONFIG` from `../lib/supabase`
- Fallback logic: `import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey`
- Voice: Use Vapi default (no provider specified) for all tiers
- Testing: Free tier user + Paid tier user

### Testing Criteria
- Free tier: Call connects with default voice
- Paid tier: Call connects with default voice
- No "Meeting has ended" error
- Console shows successful call start

### Dependencies
- Requires: VAPI_CONFIG from supabase.ts
- Blocks: Minimax TTS integration (future enhancement)

## Success Criteria
✅ Call connects for both free and paid tiers
✅ No immediate "Meeting has ended" error
✅ User can have conversation with AI
✅ Console logs show successful call

