// Verify Tier Detection Script
// Tests the getUserTier() function to ensure it correctly identifies user tiers
// Run with: node verify-tier-detection.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bcufohulqrceytkrqpgd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test users from test-credentials.json
const testUsers = [
  {
    email: 'free@test.com',
    userId: 'e42cc6d0-bf87-4a53-b445-7cf5ee0076b0',
    expectedTier: 'free'
  },
  {
    email: 'pro@test.com',
    userId: '34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb',
    expectedTier: 'pro'
  },
  {
    email: 'promax@test.com',
    userId: '89d039d4-53b6-4a62-8a64-cfddaffee0f0',
    expectedTier: 'promax'
  }
];

async function getUserTier(userId) {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('user_id', userId)
      .eq('status', 'successful')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No payment found = free tier
        return 'free';
      }
      console.warn(`Warning checking payments for ${userId}: ${error.message}`);
      return 'free';
    }

    if (!payment) {
      return 'free';
    }

    const amount = payment.amount;

    if (amount >= 180) {
      return 'promax';
    } else if (amount >= 80) {
      return 'pro';
    } else if (amount >= 49) {
      return 'professional';
    }

    return 'free';
  } catch (err) {
    console.error(`Error determining tier for ${userId}: ${err.message}`);
    return 'free';
  }
}

async function verifyTierDetection() {
  console.log('🔍 Verifying Tier Detection Logic...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let passed = 0;
  let failed = 0;

  for (const user of testUsers) {
    console.log(`📧 Testing: ${user.email}`);
    console.log(`   User ID: ${user.userId}`);
    console.log(`   Expected Tier: ${user.expectedTier.toUpperCase()}`);

    const actualTier = await getUserTier(user.userId);
    console.log(`   Detected Tier: ${actualTier.toUpperCase()}`);

    if (actualTier === user.expectedTier) {
      console.log(`   ✅ PASS - Tier detection correct`);
      passed++;
    } else {
      console.log(`   ❌ FAIL - Expected ${user.expectedTier}, got ${actualTier}`);
      failed++;
    }

    // Check payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('user_id', user.userId)
      .eq('status', 'successful')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (payment) {
      console.log(`   Payment: $${payment.amount} (${payment.status})`);
    } else {
      console.log(`   Payment: None (free tier)`);
    }

    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Verification Summary:`);
  console.log(`   ✅ Passed: ${passed}/${testUsers.length}`);
  console.log(`   ❌ Failed: ${failed}/${testUsers.length}`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 All tier detections are correct!');
    console.log('✅ TestSprite can now reliably test tier-based features.');
  } else {
    console.log('⚠️  Some tier detections failed. Please check:');
    console.log('   1. Payment records exist in database');
    console.log('   2. Payment status is "successful"');
    console.log('   3. Payment amounts match tier thresholds');
    console.log('   4. getUserTier() function is using correct column names');
  }
}

verifyTierDetection().catch(console.error);

