#!/usr/bin/env node

/**
 * Reset test user passwords to match test expectations
 * This fixes the credential mismatch issue blocking 17 tests
 */

const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bcufohulqrceytkrqpgd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.error('   Please set SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'free@test.com',
    userId: 'e42cc6d0-bf87-4a53-b445-7cf5ee0076b0',
    newPassword: 'password123',
    tier: 'free'
  },
  {
    email: 'pro@test.com',
    userId: '34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb',
    newPassword: 'password123',
    tier: 'pro'
  },
  {
    email: 'promax@test.com',
    userId: '89d039d4-53b6-4a62-8a64-cfddaffee0f0',
    newPassword: 'password123',
    tier: 'promax'
  }
];

async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = data.users.find(u => u.email === email);
    return user ? { success: true, user } : { success: false, error: 'User not found' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function resetPassword(userId, email, newPassword) {
  try {
    // First try by ID
    let result = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (result.error && result.error.message?.includes('not found')) {
      // If not found by ID, try to find by email
      console.log(`   ⚠️  User not found by ID, searching by email...`);
      const userLookup = await getUserByEmail(email);
      if (userLookup.success && userLookup.user) {
        result = await supabase.auth.admin.updateUserById(
          userLookup.user.id,
          { password: newPassword }
        );
      }
    }

    if (result.error) {
      throw result.error;
    }

    return { success: true, data: result.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function verifyPasswordReset(email, password) {
  try {
    // Try to sign in with the new password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Sign out after verification
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🔐 Resetting test user passwords...\n');

  let successCount = 0;
  let failCount = 0;

  for (const user of testUsers) {
    console.log(`📧 Processing: ${user.email} (${user.tier} tier)`);
    console.log(`   User ID: ${user.userId}`);
    console.log(`   New Password: ${user.newPassword}`);

    // Reset password
    const resetResult = await resetPassword(user.userId, user.email, user.newPassword);

    if (!resetResult.success) {
      console.log(`   ❌ Failed to reset password: ${resetResult.error}`);
      failCount++;
      console.log('');
      continue;
    }

    console.log(`   ✅ Password reset successful`);

    // Verify the password works
    console.log(`   🔍 Verifying new password...`);
    const verifyResult = await verifyPasswordReset(user.email, user.newPassword);

    if (!verifyResult.success) {
      console.log(`   ⚠️  Password reset but verification failed: ${verifyResult.error}`);
      failCount++;
    } else {
      console.log(`   ✅ Password verification successful`);
      successCount++;
    }

    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Successfully reset: ${successCount}/${testUsers.length}`);
  console.log(`   ❌ Failed: ${failCount}/${testUsers.length}`);

  if (successCount === testUsers.length) {
    console.log('\n🎉 All test user passwords reset successfully!');
    console.log('   Tests can now use password: password123');
    return 0;
  } else {
    console.log('\n⚠️  Some passwords failed to reset. Please check errors above.');
    return 1;
  }
}

main()
  .then(exitCode => process.exit(exitCode))
  .catch(err => {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
  });

