<!-- 7fce8ef4-cfe7-4ee3-9696-2639a00991bb bb7f865d-0459-44fd-abb0-7b66d3c2d179 -->
# Remove Vapi Voice - Use Only Minimax TTS

## Objective
Remove all Vapi default voice fallbacks and use Minimax TTS exclusively for voice synthesis. Vapi will remain for WebRTC/call infrastructure only.

## Changes Required

### 1. VoiceCallTester Component
**File:** `callwaitingai-landing/src/components/VoiceCallTester.tsx`

**Current Issue:**
- Lines 273-300: Falls back to Vapi default voice for free/professional tiers
- Conditional logic allows Vapi voice when Minimax not configured

**Changes:**
- Remove all Vapi default voice fallback logic
- Make Minimax TTS mandatory - require `assistant.use_minimax_tts` and `assistant.minimax_voice_id`
- Remove tier-based voice selection (use Minimax for all tiers)
- Update error messages to indicate Minimax voice is required
- If Minimax not configured, show clear error instead of falling back to Vapi

**Key changes:**
```typescript
// BEFORE: Conditional with Vapi fallback
if ((userTier === 'pro' || userTier === 'promax') && assistant.use_minimax_tts && assistant.minimax_voice_id) {
  // Minimax config
} else {
  // Vapi default fallback
}

// AFTER: Minimax only, no fallback
if (!assistant.use_minimax_tts || !assistant.minimax_voice_id) {
  throw new Error('Minimax TTS voice must be configured');
}
assistantConfig.voice = {
  provider: 'custom-provider',
  url: `${supabaseUrl}/functions/v1/minimax-tts`,
  voiceId: assistant.minimax_voice_id,
};
```

### 2. AgentSetup Page
**File:** `callwaitingai-landing/src/pages/AgentSetup.tsx`

**Current Issue:**
- Lines 605, 676: Text mentions "Vapi default voice" and "Vapi's default voice for real-time streaming"

**Changes:**
- Remove all references to "Vapi default voice" or "Vapi voices"
- Update UI text to indicate Minimax TTS is required
- Make Minimax voice selection mandatory (remove conditional checkbox)
- Update help text to clarify Minimax TTS is used for all calls

**Key changes:**
- Line ~605: Remove "Test calls use Vapi's default voice" text
- Line ~676: Remove "Using default Vapi voices" text
- Update voice selection UI to indicate Minimax is required

### 3. Voice Configuration Validation
**Files:** `callwaitingai-landing/src/components/VoiceCallTester.tsx`, `callwaitingai-landing/src/pages/AgentSetup.tsx`

**Changes:**
- Add validation to ensure Minimax voice is selected before allowing test calls
- Prevent test call if Minimax TTS not configured
- Show clear error message if Minimax voice missing

### 4. Update User Tier Logic (Optional)
**File:** `callwaitingai-landing/src/lib/userTier.ts`

**Note:** Keep tier detection but remove tier-based voice restrictions. All tiers use Minimax TTS.

## Implementation Steps

1. Update VoiceCallTester.tsx:
   - Remove tier-based voice conditional (lines 273-300)
   - Make Minimax TTS mandatory
   - Remove Vapi voice fallback
   - Update error handling

2. Update AgentSetup.tsx:
   - Remove Vapi voice references in UI text
   - Update voice selection to indicate Minimax is required
   - Remove conditional "Use Minimax TTS" checkbox (make it default/required)

3. Update validation:
   - Ensure Minimax voice selected before test call
   - Clear error messages when Minimax not configured

4. Test:
   - Verify Minimax TTS works for all tiers
   - Verify error when Minimax not configured
   - Verify no Vapi voice fallback occurs

## Files to Modify

1. `callwaitingai-landing/src/components/VoiceCallTester.tsx` - Remove Vapi voice fallback, make Minimax mandatory
2. `callwaitingai-landing/src/pages/AgentSetup.tsx` - Remove Vapi voice UI references
3. Optional: `callwaitingai-landing/src/lib/userTier.ts` - Remove tier restrictions if needed

## Success Criteria

- No Vapi default voice fallback code remains
- All calls use Minimax TTS via custom-provider
- Clear error messages when Minimax not configured
- No references to "Vapi default voice" in UI
- Minimax voice selection is mandatory for test calls

### To-dos

- [ ] Remove Vapi voice fallback logic from VoiceCallTester.tsx - make Minimax TTS mandatory
- [ ] Update AgentSetup.tsx to remove all Vapi voice UI references and text
- [ ] Add validation to require Minimax voice before test calls
- [ ] Test Minimax TTS works for all tiers without Vapi fallback