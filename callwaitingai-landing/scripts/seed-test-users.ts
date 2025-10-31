/**
 * Test User Seeding Script
 *
 * This script creates test users in Supabase for automated testing.
 * Run with: npx tsx scripts/seed-test-users.ts
 *
 * Requirements:
 * - Install tsx: npm install -D tsx
 * - Set SUPABASE_SERVICE_ROLE_KEY in .env for admin access
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test users to create
const testUsers = [
  {
    email: 'registered_user@example.com',
    password: 'TestPassword123!',
    fullName: 'Registered Test User',
    role: 'client'
  },
  {
    email: 'admin_user@example.com',
    password: 'AdminPassword123!',
    fullName: 'Admin Test User',
    role: 'admin'
  },
  {
    email: 'telegram_user@example.com',
    password: 'TelegramTest123!',
    fullName: 'Telegram Test User',
    role: 'client'
  },
  {
    email: 'rbac_user@example.com',
    password: 'RBACTest123!',
    fullName: 'RBAC Test User',
    role: 'client'
  }
];

async function seedTestUsers() {
  console.log('Starting test user seeding...\n');

  for (const testUser of testUsers) {
    try {
      console.log(`Creating user: ${testUser.email}`);

      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email', testUser.email)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        console.log(`  ⚠️  User ${testUser.email} already exists, skipping...`);
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true, // Auto-confirm email for test users
        user_metadata: {
          full_name: testUser.fullName
        }
      });

      if (authError) {
        console.error(`  ❌ Error creating auth user: ${authError.message}`);
        continue;
      }

      if (!authData.user) {
        console.error(`  ❌ No user data returned`);
        continue;
      }

      // Create user profile in users table
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: testUser.email,
          full_name: testUser.fullName,
          role: testUser.role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`  ❌ Error creating user profile: ${profileError.message}`);
        // Try to clean up auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        continue;
      }

      console.log(`  ✅ Successfully created user: ${testUser.email}`);
      console.log(`     Password: ${testUser.password}`);
      console.log(`     Role: ${testUser.role}\n`);

    } catch (error: any) {
      console.error(`  ❌ Unexpected error: ${error.message}\n`);
    }
  }

  console.log('Test user seeding completed!');
  console.log('\nYou can now use these credentials in your tests:');
  testUsers.forEach(user => {
    console.log(`  - ${user.email} / ${user.password}`);
  });
}

async function cleanupTestUsers() {
  console.log('Cleaning up test users...\n');

  for (const testUser of testUsers) {
    try {
      console.log(`Removing user: ${testUser.email}`);

      // Get user by email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        console.error(`  ❌ Error listing users: ${listError.message}`);
        continue;
      }

      const user = users?.find(u => u.email === testUser.email);

      if (!user) {
        console.log(`  ⚠️  User ${testUser.email} not found`);
        continue;
      }

      // Delete from users table first
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error(`  ⚠️  Error deleting profile: ${profileError.message}`);
      }

      // Delete auth user
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error(`  ❌ Error deleting auth user: ${authError.message}`);
        continue;
      }

      console.log(`  ✅ Successfully removed user: ${testUser.email}\n`);

    } catch (error: any) {
      console.error(`  ❌ Unexpected error: ${error.message}\n`);
    }
  }

  console.log('Test user cleanup completed!');
}

// Main execution
const command = process.argv[2];

if (command === 'cleanup' || command === 'clean') {
  cleanupTestUsers()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
} else {
  seedTestUsers()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
