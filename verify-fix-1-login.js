#!/usr/bin/env node

/**
 * Verify Fix 1: Test that login works with reset passwords
 * This verifies that the credential fix is working
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bcufohulqrceytkrqpgd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testUsers = [
  { email: 'free@test.com', password: 'password123', tier: 'free' },
  { email: 'pro@test.com', password: 'password123', tier: 'pro' },
  { email: 'promax@test.com', password: 'password123', tier: 'promax' }
];

async function verifyLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data?.session && data?.user) {
      await supabase.auth.signOut();
      return { ok: true };
    }

    return { ok: false, error: 'No session created' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('🔐 Verifying Fix 1: Test User Login with Reset Passwords\n');

  let allOk = true;
  const results = [];

  for (const user of testUsers) {
    console.log(`Testing: ${user.email} (${user.tier} tier)...`);
    const result = await verifyLogin(user.email, user.password);
    
    if (result.ok) {
      console.log(`  ✅ OK - Login successful\n`);
      results.push({ email: user.email, status: 'OK' });
    } else {
      console.log(`  ❌ FAILED - ${result.error}\n`);
      results.push({ email: user.email, status: 'FAILED', error: result.error });
      allOk = false;
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Verification Result:');
  results.forEach(r => {
    if (r.status === 'OK') {
      console.log(`  ✅ ${r.email}: OK`);
    } else {
      console.log(`  ❌ ${r.email}: FAILED - ${r.error}`);
    }
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (allOk) {
    console.log('\n✅ FIX 1 VERIFICATION: OK');
    console.log('   All test users can login with password123');
    process.exit(0);
  } else {
    console.log('\n❌ FIX 1 VERIFICATION: FAILED');
    console.log('   Some users cannot login. Fix required.');
    process.exit(1);
  }
}

main();

