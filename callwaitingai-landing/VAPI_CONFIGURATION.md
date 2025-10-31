# Vapi Configuration Guide

## Overview

All Vapi integrations in this project use centralized configuration defined in `src/lib/supabase.ts`. This ensures consistent API keys across all components and simplifies maintenance.

## Configuration Source of Truth

**File**: [src/lib/supabase.ts](src/lib/supabase.ts)

```typescript
export const VAPI_CONFIG = {
  publicKey: 'ddd720c5-6fb8-4174-b7a6-729d7b308cb9',
  assistantId: 'fdaaa6f7-a204-4c08-99fd-20451c96fc74'
};
```

## API Keys

### Frontend (Public Key)
- **Key**: `ddd720c5-6fb8-4174-b7a6-729d7b308cb9`
- **Usage**: Chat widgets, voice call components, test interfaces
- **Safe to expose**: Yes, this is a public key designed for frontend use

### Backend (Private Key)
- **Key**: `27dbe3f9-8abd-4894-8d2f-0d70f19c8374`
- **Usage**: Supabase Edge Functions for creating/managing assistants
- **Safe to expose**: NO - Keep this secret!

### Assistant ID
- **ID**: `fdaaa6f7-a204-4c08-99fd-20451c96fc74`
- **Usage**: Pre-configured assistant on Vapi dashboard

## Component Integration

### 1. AdvancedChatWidget.tsx
**Location**: [src/components/AdvancedChatWidget.tsx](src/components/AdvancedChatWidget.tsx)

```typescript
import { VAPI_CONFIG } from '../lib/supabase';

// Uses VAPI_CONFIG with environment variable fallback
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey;

// Uses assistant ID directly
await vapiClient.start(VAPI_CONFIG.assistantId);
```

**Features**:
- Supports environment variable override
- Falls back to VAPI_CONFIG if env var not set
- Uses VAPI_CONFIG.assistantId for starting calls

### 2. vapi.ts
**Location**: [src/lib/vapi.ts](src/lib/vapi.ts)

```typescript
import { VAPI_CONFIG } from './supabase';

const VAPI_PUBLIC_KEY = VAPI_CONFIG.publicKey;
const VAPI_ASSISTANT_ID = VAPI_CONFIG.assistantId;
```

**Features**:
- Direct import from VAPI_CONFIG
- Used for legacy vapiService compatibility

### 3. advancedVapi.ts
**Location**: [src/lib/advancedVapi.ts](src/lib/advancedVapi.ts)

```typescript
import { VAPI_CONFIG } from './supabase';

const VAPI_PUBLIC_KEY = VAPI_CONFIG.publicKey;
const VAPI_ASSISTANT_ID = VAPI_CONFIG.assistantId;
```

**Features**:
- Advanced service with full event handling
- Centralized configuration management
- Singleton instance pattern

### 4. VoiceCallTester.tsx
**Location**: [src/components/VoiceCallTester.tsx](src/components/VoiceCallTester.tsx)

```typescript
import { VAPI_CONFIG } from '../lib/supabase';

const vapiApiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || VAPI_CONFIG.publicKey;
```

**Features**:
- Environment variable support with fallback
- Uses inline assistant configuration (not VAPI_CONFIG.assistantId)

### 5. Supabase Edge Function
**Location**: [supabase/functions/create-vapi-assistant/index.ts](../supabase/functions/create-vapi-assistant/index.ts)

```typescript
const VAPI_API_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
```

**Environment Variable Required**:
- `VAPI_PRIVATE_KEY`: Must be set in Supabase Dashboard
- Value: `27dbe3f9-8abd-4894-8d2f-0d70f19c8374`
- Location: Supabase Dashboard → Project Settings → Edge Functions → Secrets

## Environment Variables

### Optional Frontend Overrides
You can override the default VAPI_CONFIG values by setting environment variables:

**File**: `.env` (create from `.env.example`)

```bash
# Optional: Override default Vapi configuration
VITE_VAPI_PUBLIC_KEY=ddd720c5-6fb8-4174-b7a6-729d7b308cb9
VITE_VAPI_ASSISTANT_ID=fdaaa6f7-a204-4c08-99fd-20451c96fc74
```

### Required Backend Configuration
**Supabase Edge Function Secret**:
1. Go to Supabase Dashboard
2. Navigate to: Project Settings → Edge Functions → Secrets
3. Add secret:
   - Name: `VAPI_PRIVATE_KEY`
   - Value: `27dbe3f9-8abd-4894-8d2f-0d70f19c8374`

## Implementation Strategy

### Centralized Configuration
- All components import `VAPI_CONFIG` from `src/lib/supabase.ts`
- Single source of truth for API keys and assistant ID
- Easy to update across entire application

### Environment Variable Support
- Components check for `VITE_VAPI_PUBLIC_KEY` first
- Fall back to `VAPI_CONFIG.publicKey` if not set
- Allows per-environment customization without code changes

### Backend Security
- Private key stored only in Supabase Edge Function secrets
- Never exposed in frontend code or version control
- Managed through Supabase Dashboard UI

## Testing Checklist

After configuration, verify:

- [ ] Chat widget initializes without errors
- [ ] Voice calls start successfully
- [ ] Assistant responds correctly
- [ ] No console errors about missing API keys
- [ ] Test calls use correct assistant configuration
- [ ] Edge function can create new assistants

## Troubleshooting

### "Vapi public key not configured"
- Check that `VAPI_CONFIG` is defined in `src/lib/supabase.ts`
- Verify the publicKey value is correct
- Clear browser cache and rebuild

### "Voice system not configured"
- Ensure Vapi SDK is installed: `@vapi-ai/web`
- Check console for initialization errors
- Verify network connectivity

### "VAPI_PRIVATE_KEY not configured" (Edge Function)
- Log into Supabase Dashboard
- Go to Project Settings → Edge Functions → Secrets
- Add `VAPI_PRIVATE_KEY` secret with correct value

### Assistant not responding
- Verify assistant ID is correct in VAPI_CONFIG
- Check Vapi dashboard for assistant status
- Review assistant configuration on Vapi platform

## Best Practices

1. **Use VAPI_CONFIG as Default**: Always import from `VAPI_CONFIG` rather than hardcoding
2. **Support Environment Overrides**: Allow env vars to override for flexibility
3. **Keep Private Keys Secret**: Never commit private keys to version control
4. **Document Changes**: Update this file when configuration changes
5. **Test After Updates**: Run full test suite after changing keys

## Related Files

- [src/lib/supabase.ts](src/lib/supabase.ts) - Configuration source
- [src/lib/vapi.ts](src/lib/vapi.ts) - Legacy Vapi service
- [src/lib/advancedVapi.ts](src/lib/advancedVapi.ts) - Advanced Vapi service
- [src/components/AdvancedChatWidget.tsx](src/components/AdvancedChatWidget.tsx) - Chat widget
- [src/components/VoiceCallTester.tsx](src/components/VoiceCallTester.tsx) - Voice call tester
- [supabase/functions/create-vapi-assistant/index.ts](../supabase/functions/create-vapi-assistant/index.ts) - Edge function
- [.env.example](.env.example) - Environment variables template
