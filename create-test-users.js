// Create Test Users for TestSprite
// Run this with: node create-test-users.js

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

const testUsers = [
  {
    email: 'test-free@callwaitingai.dev',
    password: 'TestPass123!',
    user_metadata: {
      full_name: 'Test Free User',
      subscription_tier: 'free'
    }
  },
  {
    email: 'test-pro@callwaitingai.dev',
    password: 'TestPass123!',
    user_metadata: {
      full_name: 'Test Pro User',
      subscription_tier: 'pro'
    }
  },
  {
    email: 'test-promax@callwaitingai.dev',
    password: 'TestPass123!',
    user_metadata: {
      full_name: 'Test ProMax User',
      subscription_tier: 'promax'
    }
  }
];

async function createTestUsers() {
  console.log('🚀 Creating test users for TestSprite...\n');

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: user.user_metadata
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  ${user.email} - Already exists (skipping)`);
        } else {
          console.error(`❌ ${user.email} - Error: ${error.message}`);
        }
      } else {
        console.log(`✅ ${user.email} - Created successfully`);
        console.log(`   Tier: ${user.user_metadata.subscription_tier}`);
        console.log(`   Password: ${user.password}`);
        console.log('');
      }
    } catch (err) {
      console.error(`❌ ${user.email} - Exception: ${err.message}`);
    }
  }

  console.log('');
  console.log('✨ Test user creation complete!');
  console.log('');
  console.log('📋 Test Credentials Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach(user => {
    console.log(`${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Tier: ${user.user_metadata.subscription_tier}`);
    console.log('');
  });
}

createTestUsers().catch(console.error);
