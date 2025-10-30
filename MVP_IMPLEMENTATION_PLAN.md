# MVP IMPLEMENTATION PLAN: 100 Users on Free Tier

**Target**: Production-ready CallWaitingAI for 100 users using only free tiers
**Timeline**: 5-7 days (P0 + P1 fixes)
**Budget**: $0 infrastructure cost

---

## Free Tier Limits (100 Users)

| Service | Free Tier | 100 User Usage | Headroom |
|---------|-----------|----------------|----------|
| **Supabase** | 500 MB DB, 1 GB storage, 50k MAU | ~200 MB DB, ~500 MB storage, 100 MAU | ✅ 60% safe |
| **Vercel** | 100 GB bandwidth, 100 serverless executions/day | ~20 GB bandwidth, ~50 executions/day | ✅ 50% safe |
| **Vapi** | Pay-as-you-go ($0.05/min) | 100 users × 300 min = $1,500/month | 💰 Revenue covers |
| **Minimax** | Pay-as-you-go ($0.015/min) | 10% adoption × 300 min = $45/month | 💰 Revenue covers |
| **Uptime Monitor** | UptimeRobot Free (50 monitors, 5-min checks) | 3 monitors | ✅ Free forever |

**Total Monthly Cost**: ~$1,545 (covered by $4,900 revenue from 100 users @ $49/month)

---

## Subtask Breakdown (Context-Optimized)

### **SUBTASK 1: Fix Critical Database Issues** (30 min)
**Goal**: Agent configuration saves without errors
**Files Changed**: 1 SQL file
**Testing**: Signup → Agent Setup → Save → Verify in Supabase

**Implementation**:
```sql
-- File: /supabase/migrations/20250130000000_fix_critical_columns.sql
-- Add missing system_prompt column
ALTER TABLE public.assistants
ADD COLUMN IF NOT EXISTS system_prompt TEXT
DEFAULT 'You are a professional AI receptionist. Answer calls warmly, capture caller info (name, phone, reason), and provide helpful assistance. Be polite and concise.';

-- Fix user_id constraint
UPDATE public.assistants SET user_id = created_by WHERE user_id IS NULL;
DELETE FROM public.assistants WHERE user_id IS NULL;
ALTER TABLE public.assistants ALTER COLUMN user_id SET NOT NULL;
```

**Validation Criteria**:
- [ ] SQL runs without errors in Supabase Dashboard
- [ ] Agent Setup saves successfully
- [ ] System prompt persists after save

---

### **SUBTASK 2: Fix Knowledge Base Upload UX** (45 min)
**Goal**: Files upload without "save agent first" error
**Files Changed**: 1 (AgentSetup.tsx)
**Testing**: Select file → Auto-save → Upload succeeds

**Implementation**:
```typescript
// File: callwaitingai-landing/src/pages/AgentSetup.tsx
// Lines 184-227 (handleKnowledgeBaseUpload function)

const handleKnowledgeBaseUpload = async () => {
  setUploading(true);
  setMessage(null);

  try {
    // AUTO-SAVE if agent not saved yet
    let currentAssistant = assistant;
    if (!currentAssistant) {
      setMessage({ type: 'info', text: 'Saving agent configuration first...' });
      const saved = await handleSave(); // Returns saved assistant
      if (!saved) {
        throw new Error('Failed to save agent configuration');
      }
      currentAssistant = saved;
    }

    // Continue with upload using currentAssistant.id...
```

**Validation Criteria**:
- [ ] Can upload file immediately after page load
- [ ] Auto-save happens before upload
- [ ] Success message shows after upload
- [ ] File appears in Supabase Storage bucket

---

### **SUBTASK 3: Add Input Validation** (1 hour)
**Goal**: Prevent invalid data crashes
**Files Changed**: 2 (validation.ts, AgentSetup.tsx)
**Testing**: Enter invalid data → See helpful error

**Implementation**:
```typescript
// File: callwaitingai-landing/src/lib/validation.ts (NEW FILE)
export const LIMITS = {
  SYSTEM_PROMPT_MAX: 10000,
  BUSINESS_NAME_MAX: 100,
  FILE_SIZE_MAX: 50 * 1024 * 1024, // 50 MB
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
};

export function validateAgentConfig(data: any): { valid: boolean; error?: string } {
  if (!data.businessName || data.businessName.length > LIMITS.BUSINESS_NAME_MAX) {
    return { valid: false, error: `Business name must be 1-${LIMITS.BUSINESS_NAME_MAX} chars` };
  }
  if (data.systemPrompt?.length > LIMITS.SYSTEM_PROMPT_MAX) {
    return { valid: false, error: `Prompt too long (max ${LIMITS.SYSTEM_PROMPT_MAX} chars)` };
  }
  return { valid: true };
}

// In AgentSetup.tsx handleSave():
const validation = validateAgentConfig({ businessName, systemPrompt });
if (!validation.valid) {
  setMessage({ type: 'error', text: validation.error });
  return;
}
```

**Validation Criteria**:
- [ ] 10,001 char prompt shows error
- [ ] Empty business name shows error
- [ ] 51 MB file shows error
- [ ] Valid data saves successfully

---

### **SUBTASK 4: Create Vapi Webhook Handler** (2 hours)
**Goal**: Call logs populate when calls end
**Files Changed**: 2 (vapi-webhook/index.ts, webhook-auth.ts)
**Testing**: Make test call → Webhook receives event → Call log created

**Implementation**:
```typescript
// File: supabase/functions/vapi-webhook/index.ts (NEW FILE)
import { serve } from 'std/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const body = await req.json();
  const { event, call } = body;

  if (event === 'call.ended') {
    await supabase.from('call_logs').insert({
      assistant_id: call.assistant_id,
      duration: call.duration_seconds,
      status: call.status,
      phone_number: call.customer.number,
      created_at: call.ended_at,
    });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
```

**Validation Criteria**:
- [ ] Deploy function to Supabase
- [ ] Configure URL in Vapi dashboard
- [ ] Test call creates call_logs row
- [ ] Dashboard /calls page shows call

---

### **SUBTASK 5: Add Basic Rate Limiting** (1.5 hours)
**Goal**: Prevent API abuse on free tier
**Files Changed**: 2 (rate-limit.ts, vapi-webhook/index.ts)
**Testing**: Spam requests → Get 429 error

**Implementation**:
```typescript
// File: supabase/functions/_shared/rate-limit.ts (NEW FILE)
// Simple in-memory rate limiting (good for 100 users)
const requests = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = requests.get(key) || [];

  // Remove expired timestamps
  const valid = timestamps.filter(t => now - t < windowMs);

  if (valid.length >= limit) {
    return false; // Rate limited
  }

  valid.push(now);
  requests.set(key, valid);
  return true; // Allowed
}

// In vapi-webhook/index.ts:
import { checkRateLimit } from '../_shared/rate-limit.ts';

const allowed = checkRateLimit(call.assistant_id, 100, 3600000); // 100 calls/hour
if (!allowed) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

**Validation Criteria**:
- [ ] 101st request in 1 hour returns 429
- [ ] After 1 hour, requests allowed again
- [ ] Different assistants have separate limits

---

### **SUBTASK 6: Add Health Check Endpoint** (30 min)
**Goal**: Monitor uptime with free UptimeRobot
**Files Changed**: 1 (health/index.ts)
**Testing**: curl /health → Returns 200

**Implementation**:
```typescript
// File: supabase/functions/health/index.ts (NEW FILE)
import { serve } from 'std/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Quick DB check
    const { error } = await supabase.from('users').select('id').limit(1);

    if (error) throw error;

    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      error: error.message
    }), { status: 503 });
  }
});
```

**Validation Criteria**:
- [ ] Returns 200 when healthy
- [ ] Returns 503 if DB down
- [ ] UptimeRobot configured to check every 5 min

---

### **SUBTASK 7: Deploy & Test End-to-End** (1 hour)
**Goal**: Full user flow works in production
**Files Changed**: 0 (testing only)
**Testing**: Complete signup → agent setup → file upload → call flow

**Test Script**:
```bash
# 1. Signup new user
curl -X POST https://callwaitingai.dev/api/auth/signup \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# 2. Login
curl -X POST https://callwaitingai.dev/api/auth/login \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# 3. Create agent
curl -X POST https://callwaitingai.dev/api/agents \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"businessName":"Test Salon","systemPrompt":"..."}'

# 4. Upload file
curl -X POST https://callwaitingai.dev/api/knowledge-base \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@menu.pdf"

# 5. Verify in dashboard
open https://callwaitingai.dev/agent-setup
```

**Validation Criteria**:
- [ ] Signup sends verification email
- [ ] Login returns valid JWT
- [ ] Agent saves with system_prompt
- [ ] File uploads to storage
- [ ] Dashboard shows saved data
- [ ] Voice dropdown has 4 voices
- [ ] No console errors

---

## Implementation Order (Maximize Context Efficiency)

**Day 1 (2-3 hours):**
- ✅ Subtask 1: Database fixes (SQL only)
- ✅ Subtask 2: Upload UX fix (1 file change)
- ✅ Deploy + test

**Day 2 (3-4 hours):**
- ✅ Subtask 3: Input validation (2 files)
- ✅ Subtask 4: Vapi webhook (2 files)
- ✅ Deploy + test webhooks

**Day 3 (2-3 hours):**
- ✅ Subtask 5: Rate limiting (2 files)
- ✅ Subtask 6: Health check (1 file)
- ✅ Configure UptimeRobot

**Day 4-5 (Buffer):**
- ✅ Subtask 7: End-to-end testing
- ✅ Fix bugs found
- ✅ Write deployment docs

---

## Free Tier Optimization Strategies

### Database (Supabase Free: 500 MB)
- **Current Size**: ~50 MB for schema
- **100 User Estimate**:
  - Users: 100 × 1 KB = 100 KB
  - Assistants: 100 × 2 KB = 200 KB
  - Call logs: 100 users × 300 calls × 1 KB = 30 MB
  - Leads: 100 users × 50 leads × 0.5 KB = 2.5 MB
  - **Total**: ~33 MB (6.6% of limit)
- **Optimization**: Auto-archive call logs >90 days old

### Storage (Supabase Free: 1 GB)
- **100 User Estimate**:
  - Knowledge base: 100 × 5 files × 5 MB = 2.5 GB ❌ EXCEEDS
- **FIX**: Limit to 2 files per user or 10 MB total per user
  - New limit: 100 × 10 MB = 1 GB ✅ Fits

### Bandwidth (Vercel Free: 100 GB)
- **100 User Estimate**:
  - Dashboard: 100 users × 50 visits/month × 1.2 MB = 6 GB
  - API calls: 100 × 1000 req/month × 5 KB = 500 MB
  - **Total**: ~6.5 GB (6.5% of limit) ✅ Safe

### Edge Functions (Supabase: 500k invocations/month)
- **100 User Estimate**:
  - Vapi webhooks: 100 × 300 calls = 30k
  - Health checks: 8,640/month (every 5 min)
  - **Total**: ~40k (8% of limit) ✅ Safe

---

## Monitoring Setup (100% Free)

**UptimeRobot Free Tier:**
- Monitor 1: https://callwaitingai.dev/ (every 5 min)
- Monitor 2: https://callwaitingai.dev/login (every 5 min)
- Monitor 3: https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/health (every 5 min)
- Alerts: Email when down >5 min

**Supabase Logs (Free):**
- Retention: 7 days
- Review daily for errors
- Export critical errors to Google Sheets (free)

**Manual Checks (Weekly):**
- Database size: `SELECT pg_database_size('postgres')`
- Storage usage: Supabase Dashboard → Storage
- Active users: `SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > now() - interval '30 days'`

---

## Upgrade Triggers (When to Leave Free Tier)

| Metric | Free Limit | Upgrade Trigger | Action |
|--------|------------|-----------------|---------|
| Database | 500 MB | >400 MB (80%) | Supabase Pro ($25/month) |
| Storage | 1 GB | >800 MB (80%) | Supabase Pro (gets 100 GB) |
| Bandwidth | 100 GB | >80 GB (80%) | Vercel Pro ($20/month) |
| Users | 50k MAU | >40k MAU | Supabase Pro (gets 100k MAU) |

**Estimated Timeline**:
- 100 users → Free tier safe
- 500 users → Upgrade Supabase ($25/month)
- 1,000 users → Upgrade Vercel ($20/month)
- Total: $45/month at 1k users ($49k monthly revenue)

---

## Success Criteria

**MVP Launch Ready When:**
- [ ] All 7 subtasks completed
- [ ] End-to-end test passes
- [ ] Zero critical bugs in issue tracker
- [ ] UptimeRobot shows 99%+ uptime for 48 hours
- [ ] 5 beta users successfully configure agents
- [ ] Knowledge base files upload successfully
- [ ] Call webhooks create call logs
- [ ] No rate limit false positives

**Post-Launch (Week 1):**
- [ ] Monitor Supabase dashboard daily
- [ ] Respond to support emails within 24 hours
- [ ] Fix P0 bugs within 4 hours
- [ ] Weekly backup export (Supabase → Google Drive)

---

## Context Preservation

**Git Commits** (Preserve Context):
- Subtask 1: "fix: Add system_prompt column and enforce user_id NOT NULL"
- Subtask 2: "fix: Auto-save agent before knowledge base upload"
- Subtask 3: "feat: Add input validation with helpful error messages"
- Subtask 4: "feat: Add Vapi webhook handler for call logs"
- Subtask 5: "feat: Add rate limiting to prevent abuse"
- Subtask 6: "feat: Add health check endpoint for monitoring"
- Subtask 7: "test: End-to-end production validation"

**Documentation** (Preserve Decisions):
- `MVP_IMPLEMENTATION_PLAN.md` (this file)
- `apply-new-migrations.sql` (database changes)
- `DEPLOYMENT.md` (how to deploy)
- `TROUBLESHOOTING.md` (common issues)

---

**Total Estimated Time**: 8-12 hours of focused work over 5 days
**Risk Level**: Low (small, testable changes)
**Revenue Impact**: Enables $4,900/month from 100 users
**Infrastructure Cost**: $0 (all free tiers)
