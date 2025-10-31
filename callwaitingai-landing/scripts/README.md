# Test User Seeding Scripts

This directory contains scripts to help set up test data for automated testing.

## Prerequisites

1. Install required dependencies:
   ```bash
   npm install -D tsx dotenv
   ```

2. Set up your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   **Important:** The `SUPABASE_SERVICE_ROLE_KEY` is required for admin operations. You can find it in your Supabase project settings under "API" → "Service Role Key". **Never commit this key to version control!**

## Usage

### Seed Test Users

Create test users in your Supabase database:

```bash
npx tsx scripts/seed-test-users.ts
```

This will create the following test users:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `registered_user@example.com` | `TestPassword123!` | client | General authentication tests |
| `admin_user@example.com` | `AdminPassword123!` | admin | Admin/RBAC tests |
| `telegram_user@example.com` | `TelegramTest123!` | client | Telegram integration tests |
| `rbac_user@example.com` | `RBACTest123!` | client | Role-based access control tests |

### Clean Up Test Users

Remove all test users from the database:

```bash
npx tsx scripts/seed-test-users.ts cleanup
```

## Using Test Credentials in Tests

After seeding, you can use these credentials in your TestSprite tests or manual testing:

```python
# Example: Update your test files to use these credentials
email = "registered_user@example.com"
password = "TestPassword123!"
```

## Notes

- Test users are created with `email_confirm: true` so no email verification is needed
- If a user already exists, the script will skip creating them
- The cleanup command will remove both the auth user and their profile data
- All operations use the Supabase Admin API to bypass Row Level Security (RLS)

## Troubleshooting

### "Missing required environment variables"
- Make sure you have both `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file

### "User already exists"
- Run the cleanup command first: `npx tsx scripts/seed-test-users.ts cleanup`
- Then re-run the seed command

### "Permission denied" or RLS errors
- Make sure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key)
- The service role key bypasses RLS policies

## Security Warning

🚨 **Never use these test credentials in production!**

These are test-only accounts with well-known passwords. Always use the cleanup script after testing is complete, especially if testing on a shared/staging environment.
