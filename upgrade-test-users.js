// Upgrade Test Users for TestSprite
// Run this with: node upgrade-test-users.js
// This script upgrades existing test users by creating payment records
// that assign them to the correct subscription tiers

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bcufohulqrceytkrqpgd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.log('');
  console.log('To get your service role key:');
  console.log('1. Go to: https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd/settings/api');
  console.log('2. Copy the "service_role" key (secret)');
  console.log('3. Run: export SUPABASE_SERVICE_ROLE_KEY="your-key-here"');
  console.log('4. Then run this script again');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test users to upgrade - using UIDs directly from Supabase Auth dashboard
const testUsersToUpgrade = [
  {
    email: 'pro@test.com',
    userId: '34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb', // Direct UID from dashboard
    targetTier: 'pro',
    amount: 80, // $80 = Pro tier
    description: 'Pro tier user - gets Minimax TTS access'
  },
  {
    email: 'promax@test.com',
    userId: '89d039d4-53b6-4a62-8a64-cfddaffee0f0', // Direct UID from dashboard (fixed: 's' -> 'e')
    targetTier: 'promax',
    amount: 180, // $180 = ProMax tier
    description: 'ProMax tier user - gets all features including Minimax TTS'
  },
  // free@test.com (e42cc6d0-bf87-4a53-b445-7cf5ee0076b0) stays as free tier (no payment record needed)
];

async function findUserByEmail(email, userId) {
  try {
    // If we have userId directly, use it (more reliable)
    if (userId) {
      try {
        const { data, error } = await supabase.auth.admin.getUserById(userId);
        if (!error && data) {
          return data.user;
        }
      } catch (err) {
        // If getUserById fails, return a minimal user object with the ID
        console.log(`   ⚠️  Could not fetch user details, using provided ID...`);
        return { id: userId, email: email };
      }
    }

    // Fallback: Try to find by email using admin API
    try {
      const { data, error } = await supabase.auth.admin.getUserByEmail(email);
      if (!error && data) {
        return data.user;
      }
    } catch (err) {
      console.log(`   ⚠️  getUserByEmail failed: ${err.message}`);
    }

    // If all else fails but we have userId, return minimal user object
    if (userId) {
      return { id: userId, email: email };
    }

    return null;
  } catch (err) {
    console.error(`❌ Exception finding user ${email}: ${err.message}`);
    return null;
  }
}

async function checkExistingPayment(userId) {
  try {
    // Try with 'status' column first (seems to be what works in production)
    let { data: payment, error } = await supabase
      .from('payments')
      .select('id, amount, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'successful')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If that works and has data, return it
    if (!error && payment && payment.status === 'successful') {
      return payment;
    }

    // If status column query failed, try payment_status
    if (error && (error.code === 'PGRST116' || error.code === '42703' || error.message?.includes('column'))) {
      const result = await supabase
        .from('payments')
        .select('id, amount, payment_status, created_at')
        .eq('user_id', userId)
        .eq('payment_status', 'successful')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!result.error && result.data) {
        return result.data;
      }
    }

    // Also try without filtering by status (get any payment and check)
    const { data: anyPayment, error: anyError } = await supabase
      .from('payments')
      .select('id, amount, status, payment_status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!anyError && anyPayment) {
      const status = anyPayment.status || anyPayment.payment_status;
      if (status === 'successful') {
        return anyPayment;
      }
    }

    return null;
  } catch (err) {
    console.warn(`⚠️  Warning checking payments for user ${userId}: ${err.message}`);
    return null;
  }
}

async function createPaymentRecord(userId, amount, targetTier) {
  try {
    // Generate a unique transaction reference
    const txRef = `test-upgrade-${userId}-${Date.now()}`;
    
    // Start with minimum required fields - add optional ones only if they exist
    // Required: user_id, amount, payment_status
    const minimalData = {
      user_id: userId,
      amount: amount,
      payment_status: 'successful'
    };

    // Try with 'status' column first (production uses 'status', not 'payment_status')
    const statusData = {
      user_id: userId,
      amount: amount,
      status: 'successful'
    };

    let { data, error } = await supabase
      .from('payments')
      .insert(statusData)
      .select()
      .single();

    // If status column works, return success
    if (!error && data) {
      const extendedData = {
        ...minimalData,
        flutterwave_tx_ref: txRef,
        plan_type: targetTier,
        metadata: {
          test_user: true,
          upgraded_by: 'upgrade-test-users-script',
          upgraded_at: new Date().toISOString()
        },
        paid_at: new Date().toISOString()
      };

      // Try to update with additional fields (only if columns exist)
      try {
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            flutterwave_tx_ref: txRef,
            plan_type: targetTier,
            metadata: {
              test_user: true,
              upgraded_by: 'upgrade-test-users-script',
              upgraded_at: new Date().toISOString()
            },
            paid_at: new Date().toISOString()
          })
          .eq('id', data.id);

        if (!updateError) {
          // Fetch updated record
          const { data: updatedData } = await supabase
            .from('payments')
            .select()
            .eq('id', data.id)
            .single();
          
          return updatedData || data;
        }
      } catch (updateErr) {
        // Update failed, but insert succeeded - that's fine
        console.log(`   ⚠️  Could not add optional fields, but payment created`);
      }

      return data;
    }

    // If status column failed, try payment_status as fallback
    if (error && (error.message?.includes('column') || error.code === '42703' || error.code === 'PGRST204')) {
      console.log(`   ⚠️  'status' column failed, trying 'payment_status' column as fallback...`);
      const paymentStatusData = {
        user_id: userId,
        amount: amount,
        payment_status: 'successful'
      };
      
      const result = await supabase
        .from('payments')
        .insert(paymentStatusData)
        .select()
        .single();
      
      if (!result.error) {
        return result.data;
      }
      
      // Show the actual last error
      console.error(`   ❌ Both 'status' and 'payment_status' columns failed`);
      error = result.error; // Update to show the last error
    }

    if (error) {
      console.error(`   ❌ Error creating payment: ${error.message}`);
      console.error(`   Error code: ${error.code}`);
      console.error(`   Full error:`, JSON.stringify(error, null, 2));
      return null;
    }

    return data;
  } catch (err) {
    console.error(`   ❌ Exception creating payment: ${err.message}`);
    return null;
  }
}

async function upgradeTestUsers() {
  console.log('🚀 Upgrading test users for TestSprite...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const userConfig of testUsersToUpgrade) {
    const { email, userId, targetTier, amount, description } = userConfig;
    
    console.log(`📧 Processing: ${email}`);
    console.log(`   Target Tier: ${targetTier} ($${amount})`);
    console.log(`   Description: ${description}`);

    // Find user by email or use provided userId
    const user = await findUserByEmail(email, userId);
    
    if (!user || !user.id) {
      console.log(`   ❌ User not found (email: ${email}, userId: ${userId})`);
      errorCount++;
      console.log('');
      continue;
    }

    console.log(`   ✅ Found user: ${user.id}`);
    if (user.email_confirmed_at !== undefined) {
      console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    }

    // Check if user already has a payment
    const existingPayment = await checkExistingPayment(user.id);
    
    if (existingPayment) {
      const existingAmount = existingPayment.amount;
      const existingStatus = existingPayment.status || existingPayment.payment_status;
      console.log(`   ⚠️  User already has a payment record:`);
      console.log(`      Amount: $${existingAmount}`);
      console.log(`      Status: ${existingStatus}`);
      console.log(`      Created: ${existingPayment.created_at}`);
      
      // Check if the existing payment gives the correct tier
      let expectedAmount = amount;
      if (targetTier === 'pro') expectedAmount = 80;
      if (targetTier === 'promax') expectedAmount = 180;
      
      if (existingAmount >= expectedAmount && existingStatus === 'successful') {
        console.log(`   ✅ User already has correct tier (skipping)`);
        skipCount++;
        console.log('');
        continue;
      } else {
        console.log(`   ℹ️  Existing payment doesn't match target tier, creating new payment...`);
      }
    }

    // Create payment record
    console.log(`   Creating payment record...`);
    const payment = await createPaymentRecord(user.id, amount, targetTier);
    
    if (payment) {
      console.log(`   ✅ Payment record created successfully!`);
      console.log(`      Payment ID: ${payment.id}`);
      console.log(`      Amount: $${payment.amount || amount}`);
      successCount++;
    } else {
      console.log(`   ❌ Failed to create payment record`);
      errorCount++;
    }

    console.log('');
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Upgrade Summary:');
  console.log(`   ✅ Successfully upgraded: ${successCount}`);
  console.log(`   ⏭️  Skipped (already upgraded): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('');
  console.log('📋 Test Users Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Verify final status of all test users
  const allTestUsers = [
    { email: 'free@test.com', userId: 'e42cc6d0-bf87-4a53-b445-7cf5ee0076b0' },
    { email: 'pro@test.com', userId: '34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb' },
    { email: 'promax@test.com', userId: '89d039d4-53b6-4a62-8a64-cfddaffee0f0' }
  ];
  
  for (const testUser of allTestUsers) {
    const existingPayment = await checkExistingPayment(testUser.userId);
    if (existingPayment) {
      const paymentAmount = existingPayment.amount;
      let tier = 'free';
      if (paymentAmount >= 180) tier = 'promax';
      else if (paymentAmount >= 80) tier = 'pro';
      else if (paymentAmount >= 49) tier = 'professional';
      
      console.log(`${testUser.email}: ${tier.toUpperCase()} ($${paymentAmount} payment)`);
    } else {
      console.log(`${testUser.email}: FREE (no payment)`);
    }
  }
  
  console.log('');
  console.log('🎉 Test user upgrade complete!');
  console.log('');
  console.log('📝 Next Steps:');
  console.log('   1. TestSprite can now test core functionalities');
  console.log('   2. Verify tier access in the application');
  console.log('   3. Test Minimax TTS features with pro/promax users');
}

upgradeTestUsers().catch(console.error);

