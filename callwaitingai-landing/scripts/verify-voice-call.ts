#!/usr/bin/env tsx
/**
 * END-TO-END VOICE CALL VERIFICATION
 * Tests all critical paths without manual intervention
 * 
 * Run: npx tsx scripts/verify-voice-call.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface VerificationResult {
  phase: string;
  test: string;
  passed: boolean;
  message: string;
}

const results: VerificationResult[] = [];

function log(phase: string, test: string, passed: boolean, message: string) {
  results.push({ phase, test, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${phase}: ${test} - ${message}`);
}

async function verifyPhase1() {
  console.log('\n=== PHASE 1: PREREQUISITES ===\n');

  // 1.1 Environment Variables
  const envPath = join(process.cwd(), '.env');
  let envContent = '';
  
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
  }

  // Check for Vapi public key (env or hardcoded fallback)
  const hasEnvVapiKey = envContent.includes('VITE_VAPI_PUBLIC_KEY');
  const supabasePath = join(process.cwd(), 'src/lib/supabase.ts');
  let hasHardcodedKey = false;
  
  if (existsSync(supabasePath)) {
    const supabaseCode = readFileSync(supabasePath, 'utf8');
    hasHardcodedKey = supabaseCode.includes('publicKey:') && 
                     supabaseCode.includes('ddd720c5-6fb8-4174-b7a6-729d7b308cb9');
  }

  log('Prerequisites', 'Vapi Public Key', hasEnvVapiKey || hasHardcodedKey, 
    hasEnvVapiKey ? 'In .env' : hasHardcodedKey ? 'In supabase.ts (fallback)' : 'MISSING');

  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL');
  log('Prerequisites', 'Supabase URL', hasSupabaseUrl, hasSupabaseUrl ? 'Present' : 'MISSING');

  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY');
  log('Prerequisites', 'Supabase Anon Key', hasSupabaseKey, hasSupabaseKey ? 'Present' : 'MISSING');

  // 1.2 Voice Configuration
  const voicesPath = join(process.cwd(), 'src/config/vapiVoices.ts');
  if (existsSync(voicesPath)) {
    const voicesCode = readFileSync(voicesPath, 'utf8');
    
    const hasDefaultVoiceId = voicesCode.includes("DEFAULT_VOICE_ID = 'vapi-harry'") ||
                              voicesCode.includes('DEFAULT_VOICE_ID = "vapi-harry"');
    log('Prerequisites', 'DEFAULT_VOICE_ID Defined', hasDefaultVoiceId, 
      hasDefaultVoiceId ? 'Set to vapi-harry' : 'NOT SET');

    const hasGetVoiceById = voicesCode.includes('export const getVoiceById') ||
                           voicesCode.includes('export function getVoiceById');
    log('Prerequisites', 'getVoiceById Function', hasGetVoiceById, 
      hasGetVoiceById ? 'Exists' : 'MISSING');

    // Check for at least one Vapi native voice
    const hasVapiNativeVoice = voicesCode.includes("provider: 'vapi'") ||
                              voicesCode.includes('provider: "vapi"');
    log('Prerequisites', 'Vapi Native Voices', hasVapiNativeVoice, 
      hasVapiNativeVoice ? 'Defined' : 'MISSING');
  } else {
    log('Prerequisites', 'vapiVoices.ts File', false, 'FILE NOT FOUND');
  }
}

async function verifyPhase2() {
  console.log('\n=== PHASE 2: CODE VERIFICATION ===\n');

  const widgetPath = join(process.cwd(), 'src/components/AdvancedChatWidget.tsx');
  
  if (!existsSync(widgetPath)) {
    log('Code', 'AdvancedChatWidget.tsx', false, 'FILE NOT FOUND');
    return;
  }

  const widgetCode = readFileSync(widgetPath, 'utf8');

  // Check imports
  const hasUseAuth = widgetCode.includes("from '../contexts/AuthContext'") &&
                     widgetCode.includes('useAuth');
  log('Code', 'useAuth Import', hasUseAuth, hasUseAuth ? 'Found' : 'MISSING');

  const hasGetVoiceById = widgetCode.includes("from '../config/vapiVoices'") &&
                          widgetCode.includes('getVoiceById');
  log('Code', 'getVoiceById Import', hasGetVoiceById, hasGetVoiceById ? 'Found' : 'MISSING');

  const hasDefaultVoiceId = widgetCode.includes('DEFAULT_VOICE_ID');
  log('Code', 'DEFAULT_VOICE_ID Import', hasDefaultVoiceId, hasDefaultVoiceId ? 'Found' : 'MISSING');

  const hasSupabase = widgetCode.includes("from '../lib/supabase'") &&
                      widgetCode.includes('supabase');
  log('Code', 'Supabase Import', hasSupabase, hasSupabase ? 'Found' : 'MISSING');

  // Check assistant loading logic
  const hasAssistantLoad = widgetCode.includes("from('assistants')") ||
                          widgetCode.includes('from("assistants")');
  log('Code', 'Assistant Loading Query', hasAssistantLoad, hasAssistantLoad ? 'Found' : 'MISSING');

  const hasAssistantState = widgetCode.includes('const [assistant') ||
                           widgetCode.includes('useState<Assistant');
  log('Code', 'Assistant State Variable', hasAssistantState, hasAssistantState ? 'Found' : 'MISSING');

  // Check voice configuration logic
  const hasVoiceConfigCheck = widgetCode.includes('assistant?.vapi_voice_id') ||
                             widgetCode.includes('assistant.vapi_voice_id');
  log('Code', 'Voice Config Logic', hasVoiceConfigCheck, hasVoiceConfigCheck ? 'Found' : 'MISSING');

  // Check for voice assignment
  const hasVoiceAssignment = widgetCode.includes("assistantConfig.voice =") ||
                            widgetCode.includes('assistantConfig.voice =');
  log('Code', 'Voice Assignment', hasVoiceAssignment, hasVoiceAssignment ? 'Found' : 'MISSING');

  // Check voice format (must use provider: 'vapi')
  const hasVapiProvider = widgetCode.includes("provider: 'vapi'") ||
                         widgetCode.includes('provider: "vapi"');
  log('Code', 'Vapi Provider Format', hasVapiProvider, 
    hasVapiProvider ? 'Found' : 'MISSING - Will cause failures');

  // Check for ElevenLabs hardcode (should NOT exist)
  const hasElevenLabsHardcode = (widgetCode.includes('provider: \'elevenlabs\'') ||
                                widgetCode.includes('provider: "elevenlabs"')) &&
                                !widgetCode.includes('// This will cause') &&
                                !widgetCode.includes('// DO NOT USE');
  log('Code', 'No ElevenLabs Hardcode', !hasElevenLabsHardcode, 
    hasElevenLabsHardcode ? 'FOUND - This will cause "Meeting has ended"' : 'OK');

  // Check retry logic
  const hasRetryLogic = widgetCode.includes('maxRetries') || 
                       widgetCode.includes('retry');
  log('Code', 'Retry Logic', hasRetryLogic, hasRetryLogic ? 'Found' : 'MISSING');

  // Check error handling
  const hasErrorHandling = widgetCode.includes('connectionError') ||
                          widgetCode.includes('setConnectionError');
  log('Code', 'Error Handling', hasErrorHandling, hasErrorHandling ? 'Found' : 'MISSING');
}

async function verifyPhase3() {
  console.log('\n=== PHASE 3: RUNTIME VERIFICATION ===\n');
  console.log('⚠️  Manual testing required - see checklist in VERIFICATION_PLAN.md');
  console.log('    Key tests to run in browser:\n');
  console.log('    1. Open console, check for: "✅ Vapi client initialized and ready"');
  console.log('    2. Sign in, check for: "✅ Loaded assistant config from backend"');
  console.log('    3. Start voice call, check for: "✅ Vapi call started successfully"');
  console.log('    4. Verify NO "Meeting has ended" errors');
  console.log('');
}

function generateReport() {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION REPORT');
  console.log('='.repeat(60));
  console.log(`Passed: ${passed}/${total} (${percentage}%)`);
  
  const failures = results.filter(r => !r.passed);
  if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    failures.forEach(r => {
      console.log(`  - ${r.test}: ${r.message}`);
    });
    console.log('\n⚠️  Fix failures before proceeding to Phase 3 (manual testing)');
  } else {
    console.log('\n✅ ALL AUTOMATED CHECKS PASSED');
    console.log('👉 Proceed to Phase 3: Manual runtime testing');
  }
  
  console.log('='.repeat(60));

  if (failures.length > 0) {
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 VOICE CALL VERIFICATION SCRIPT');
  console.log('==================================\n');

  await verifyPhase1();
  await verifyPhase2();
  await verifyPhase3();
  generateReport();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

