# Test User Upgrade Script

This script automatically upgrades test users in your Supabase project by creating payment records that assign them to the correct subscription tiers.

## Purpose

TestSprite needs users with different subscription tiers to test core functionalities:
- **Free tier**: No payment record (default)
- **Pro tier**: $80 payment record
- **ProMax tier**: $180 payment record

## Prerequisites

1. **Supabase Service Role Key**: You need the service role key to run this script
   - Go to: https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd/settings/api
   - Copy the **service_role** key (secret)
   - This key has admin access to create payment records

## Setup

1. Set the environment variable:
```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

2. Verify Node.js is installed:
```bash
node --version
```

3. Install dependencies (if not already installed):
```bash
npm install @supabase/supabase-js
```

## Usage

Run the script:
```bash
node upgrade-test-users.js
```

## What It Does

The script will:

1. **Find test users** by email:
   - `pro@test.com` → Upgrades to **Pro tier** ($80 payment)
   - `promax@test.com` → Upgrades to **ProMax tier** ($180 payment)
   - `free@test.com` → Stays as **Free tier** (no action needed)

2. **Check existing payments**: If a user already has a successful payment matching their target tier, it will skip them.

3. **Create payment records**: Inserts payment records in the `payments` table with:
   - `user_id`: The user's UUID
   - `amount`: $80 (Pro) or $180 (ProMax)
   - `payment_status`: 'successful'
   - `paid_at`: Current timestamp
   - Metadata indicating it's a test upgrade

4. **Verify results**: Shows a summary of all test users and their final tiers.

## Expected Output

```
🚀 Upgrading test users for TestSprite...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Processing: pro@test.com
   Target Tier: pro ($80)
   Description: Pro tier user - gets Minimax TTS access
   ✅ Found user: 34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb
   Email confirmed: Yes
   Creating payment record...
   ✅ Payment record created successfully!
      Payment ID: [uuid]
      Amount: $80

📧 Processing: promax@test.com
   Target Tier: promax ($180)
   Description: ProMax tier user - gets all features including Minimax TTS
   ✅ Found user: 89d039d4-53b6-4a62-8a64-cfddaffes0f0
   Email confirmed: Yes
   Creating payment record...
   ✅ Payment record created successfully!
      Payment ID: [uuid]
      Amount: $180

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Upgrade Summary:
   ✅ Successfully upgraded: 2
   ⏭️  Skipped (already upgraded): 0
   ❌ Errors: 0

📋 Test Users Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
free@test.com: FREE (no payment)
pro@test.com: PRO ($80 payment)
promax@test.com: PROMAX ($180 payment)

🎉 Test user upgrade complete!
```

## Troubleshooting

### Error: SUPABASE_SERVICE_ROLE_KEY not set
- Make sure you've exported the environment variable
- Check that the key is correct and hasn't expired

### Error: User not found
- Verify the user exists in Supabase Auth dashboard
- Check the email address is correct

### Error: Column 'status' not found
- The script automatically tries both `payment_status` and `status` columns
- If both fail, check your database schema

### Error: Permission denied
- Ensure you're using the **service_role** key, not the anon key
- Check that RLS policies allow inserts to the payments table

## Tier Mapping

Based on `userTier.ts`:
- **Free**: No payment or payment < $49
- **Professional**: Payment ≥ $49 and < $80
- **Pro**: Payment ≥ $80 and < $180
- **ProMax**: Payment ≥ $180

## Notes

- The script is idempotent: running it multiple times won't create duplicate payments
- It checks for existing payments before creating new ones
- Test users will have metadata indicating they were upgraded by this script
- The payment records are marked as `successful` and include a `paid_at` timestamp

## Related Files

- `create-test-users.js`: Creates test users (run this first if users don't exist)
- `callwaitingai-landing/src/lib/userTier.ts`: Contains tier determination logic
- `callwaitingai-landing/src/lib/supabase.ts`: Database schema definitions

## Next Steps

After running this script:
1. ✅ Test users are upgraded to appropriate tiers
2. ✅ TestSprite can test core functionalities with different user tiers
3. ✅ Verify tier access in the application dashboard
4. ✅ Test Minimax TTS features with pro/promax users

