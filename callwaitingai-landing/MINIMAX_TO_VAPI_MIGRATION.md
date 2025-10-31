# Minimax TTS to Vapi Voices Migration Plan

## Overview

This document outlines the complete migration from Minimax TTS to Vapi native voices, reserving Minimax TTS for the future 1804 plan with voice cloning capabilities.

## Current Status

### ✅ Completed
1. **Research** - Documented all available Vapi voice providers
2. **Vapi Voices Config** - Created `src/config/vapiVoices.ts` with 10 Vapi native voices + premium provider options
3. **Database Migration** - Created `supabase/migrations/20250131_migrate_to_vapi_voices.sql`
4. **AgentSetup Partial Update** - Updated imports, interfaces, and data loading

### ⚠️ In Progress
- AgentSetup.tsx refactoring (partially complete)
- Need to complete voice selection UI replacement

### ❌ Not Started
- VoiceCallTester.tsx updates
- Database migration execution
- Full testing
- Minimax TTS documentation for 1804 plan

## Error Analysis

### Original Error
```
Meeting ended due to ejection: Meeting has ended
```

**Root Cause**: Invalid voice configuration using `provider: 'playht'` with Minimax voice ID

**Why This Happened**:
- Vapi doesn't recognize PlayHT provider with Minimax IDs
- Daily.co WebRTC immediately rejects invalid configurations
- Minimax TTS requires custom-voice provider setup (production only)

## Migration Strategy

### Phase 1: Database (READY TO EXECUTE)

**Migration File**: `supabase/migrations/20250131_migrate_to_vapi_voices.sql`

**Actions**:
1. Add `vapi_voice_id` and `vapi_voice_provider` columns
2. Migrate existing users to default Vapi voice (`vapi-harry`)
3. Mark `minimax_voice_id` and `use_minimax_tts` as DEPRECATED
4. Add index and constraints

**Execute**:
```bash
# Run migration via Supabase CLI or Dashboard
supabase db push
```

### Phase 2: Frontend (PARTIALLY COMPLETE)

#### Files Modified So Far:
1. ✅ `src/config/vapiVoices.ts` - Voice configuration
2. ⚠️ `src/pages/AgentSetup.tsx` - Partially updated
3. ❌ `src/components/VoiceCallTester.tsx` - Not yet updated

#### AgentSetup.tsx Changes Needed:

**Remove** (lines 306-383):
- `testVoiceId()` function (Minimax TTS testing)
- Minimax voice API calls

**Remove** (lines 577-680):
- Minimax TTS checkbox and UI
- VoiceDemoPlayer component (Minimax-specific)
- Minimax voice dropdown

**Add** - New Vapi Voice Selection UI:
```tsx
{/* Vapi Voice Selection */}
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Volume2 className="w-5 h-5" />
    Voice Selection
  </h3>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Voice Provider
      </label>
      <select
        value={selectedVoiceProvider}
        onChange={(e) => {
          setSelectedVoiceProvider(e.target.value);
          // Reset to first voice of new provider
          const firstVoice = ALL_VAPI_VOICES.find(v => v.provider === e.target.value);
          if (firstVoice) setSelectedVoiceId(firstVoice.id);
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="vapi">Vapi Native (Free)</option>
        <option value="elevenlabs">ElevenLabs (Premium)</option>
        <option value="playht">PlayHT (Premium)</option>
        <option value="azure">Azure (Premium)</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Voice
      </label>
      <select
        value={selectedVoiceId}
        onChange={(e) => setSelectedVoiceId(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      >
        {ALL_VAPI_VOICES
          .filter(v => v.provider === selectedVoiceProvider)
          .map(voice => (
            <option key={voice.id} value={voice.id}>
              {voice.name} - {voice.description}
              {voice.isPremium && ' (Premium)'}
            </option>
          ))}
      </select>
    </div>

    {/* Voice Preview */}
    {selectedVoice && (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">{selectedVoice.name}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Gender:</strong> {selectedVoice.gender}</p>
          <p><strong>Accent:</strong> {selectedVoice.accent}</p>
          <p><strong>Age:</strong> {selectedVoice.age}</p>
          <p><strong>Style:</strong> {selectedVoice.description}</p>
        </div>
      </div>
    )}
  </div>
</div>
```

#### VoiceCallTester.tsx Changes Needed:

**Update Interface** (line 8):
```tsx
interface Assistant {
  id: string;
  business_name: string;
  business_industry: string;
  business_hours: string;
  timezone: string;
  system_prompt: string;
  vapi_voice_id: string | null;
  vapi_voice_provider: string | null;
}
```

**Update Voice Configuration** (lines 270-278):
```tsx
// Configure voice from Vapi voices config
if (assistant.vapi_voice_id && assistant.vapi_voice_provider) {
  const selectedVoice = getVoiceById(assistant.vapi_voice_id);

  if (selectedVoice) {
    assistantConfig.voice = {
      provider: selectedVoice.provider,
      voiceId: selectedVoice.voiceId,
    };
    console.log('🎤 Using Vapi Voice:', selectedVoice.name, `(${selectedVoice.provider})`);
  }
}
```

**Update UI Message** (lines 479-489):
```tsx
{/* Voice Info */}
{assistant.vapi_voice_id && (
  <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
    <Volume2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm text-blue-800 font-medium">Voice Configured</p>
      <p className="text-xs text-blue-700 mt-1">
        Using {getVoiceById(assistant.vapi_voice_id)?.name} for production calls.
      </p>
    </div>
  </div>
)}
```

### Phase 3: Testing

**Test Checklist**:
- [ ] Database migration executes without errors
- [ ] Existing assistants load with default voice (`vapi-harry`)
- [ ] Voice selection dropdown works
- [ ] Save configuration persists voice selection
- [ ] Test call uses selected Vapi voice
- [ ] No "Meeting has ended" errors
- [ ] Console shows TRUE/OK for agent test

### Phase 4: Deployment

1. Run database migration
2. Deploy updated frontend code
3. Verify production calls work
4. Monitor for errors

## Available Vapi Voices

### Free Tier (Vapi Native)
1. **Rohan** - Male, Indian American, 24 - Bright, optimistic, energetic
2. **Neha** - Female, Indian American, 30 - Professional, charming
3. **Hana** - Female, American, 22 - Soft, soothing, gentle
4. **Harry** - Male, American, 24 - Clear, energetic, professional (DEFAULT)
5. **Elliot** - Male, Canadian, 25 - Soothing, friendly, professional
6. **Lily** - Female, Asian American, 25 - Bright, bubbly, cheerful
7. **Paige** - Female, American, 26 - Deeper tone, calming, professional
8. **Cole** - Male, American, 22 - Deeper tone, calming, professional
9. **Savannah** - Female, Southern American, 25 - Warm, Southern hospitality
10. **Spencer** - Female, American, 26 - Energetic, quippy, lighthearted

### Premium Tiers (Requires API Keys)
- **ElevenLabs**: Ultra-realistic, voice cloning, low-latency
- **PlayHT**: Emotionally expressive, multilingual
- **Azure**: Enterprise-grade, SSML support
- **Deepgram**: Real-time STT/TTS optimization
- **Cartesia**: High-speed neural TTS

## Minimax TTS - Future 1804 Plan

### Requirements for Minimax Integration

**Plan**: 1804 Premium Plan with Voice Cloning

**Features**:
1. **Custom Voice Cloning** - Upload voice samples to create custom voices
2. **Production-Only** - Minimax via custom-voice provider in Edge Function
3. **Voice Library** - Store and manage cloned voices
4. **Advanced Controls** - Speed, pitch, volume, emotion control

**Technical Requirements**:
1. Minimax API subscription
2. Custom-voice provider configuration in Vapi
3. Voice cloning interface in dashboard
4. Voice sample upload and processing
5. Edge Function for Minimax TTS synthesis
6. Webhook integration for production calls

**Implementation Steps** (Future):
1. Restore `minimax_voice_id` and `use_minimax_tts` fields
2. Create voice cloning UI
3. Implement voice sample processing
4. Configure custom-voice provider in Vapi
5. Update Edge Function for Minimax synthesis
6. Add 1804 plan gating logic

## Next Steps

### Immediate (Complete Migration)
1. Finish AgentSetup.tsx refactoring
2. Update VoiceCallTester.tsx
3. Execute database migration
4. Test thoroughly
5. Deploy to production

### Short-term (Enhance)
1. Add voice preview/playback
2. Implement voice favorites
3. Add voice search/filter
4. Create voice comparison tool

### Long-term (1804 Plan)
1. Design voice cloning UI/UX
2. Research Minimax API integration
3. Plan custom-voice provider setup
4. Develop voice management system
5. Implement voice cloning feature

## Files Reference

### Created
- `src/config/vapiVoices.ts` - Voice configuration
- `supabase/migrations/20250131_migrate_to_vapi_voices.sql` - Database migration
- `MINIMAX_TO_VAPI_MIGRATION.md` - This document

### Modified (Partial)
- `src/pages/AgentSetup.tsx` - Imports, interfaces, data loading updated
- `src/components/VoiceCallTester.tsx` - Removed invalid PlayHT provider

### Needs Modification
- `src/pages/AgentSetup.tsx` - Complete voice selection UI
- `src/components/VoiceCallTester.tsx` - Use Vapi voice config
- `src/lib/supabase.ts` - Update database types if needed

## Summary

This migration removes the problematic Minimax TTS integration that was causing "Meeting has ended" errors due to invalid voice provider configuration. By switching to Vapi native voices, we ensure:

1. ✅ Reliable voice calls without configuration errors
2. ✅ 10 high-quality free voices to choose from
3. ✅ Option for premium providers (ElevenLabs, Azure, etc.)
4. ✅ Future-ready for Minimax TTS in 1804 plan with voice cloning
5. ✅ Clean, maintainable codebase

The "Meeting has ended" error will be resolved because we're no longer using invalid provider combinations. All voices will use proper Vapi-supported providers.
