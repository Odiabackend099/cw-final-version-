# API Configuration Guide

**Total Estimated Time: 45-60 minutes**

This guide will walk you through setting up all the external services needed for Call Waiting AI. No technical experience required - just follow the steps!

---

## Table of Contents

1. [Groq API Setup](#1-groq-api-setup) (10-15 minutes)
2. [Flutterwave Payment Setup](#2-flutterwave-payment-setup) (15-20 minutes)
3. [Telegram Bot Setup](#3-telegram-bot-setup) (5-10 minutes)
4. [Adding Keys to Supabase Vault](#4-adding-keys-to-supabase-vault) (10-15 minutes)
5. [Testing Your Configuration](#5-testing-your-configuration) (5 minutes)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Groq API Setup

**What it's for:** Powers the AI voice assistant that handles phone calls

**Estimated Time:** 10-15 minutes

### Steps:

- [ ] **Step 1:** Go to [https://console.groq.com](https://console.groq.com)

- [ ] **Step 2:** Click the "Sign Up" or "Get Started" button in the top right corner

- [ ] **Step 3:** Create your account using:
  - Your email address, OR
  - Sign in with Google, OR
  - Sign in with GitHub

- [ ] **Step 4:** Check your email and verify your account (if required)

- [ ] **Step 5:** Once logged in, look for "API Keys" in the left sidebar menu
  - If you don't see a sidebar, click the menu icon (three lines) in the top left

- [ ] **Step 6:** Click the "Create API Key" button

- [ ] **Step 7:** Give your key a name (e.g., "Call Waiting AI Production")

- [ ] **Step 8:** Click "Create" or "Generate"

- [ ] **Step 9:** **IMPORTANT:** Copy the API key immediately
  - It looks like: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - You won't be able to see it again!
  - Paste it into a secure note or password manager temporarily

- [ ] **Step 10:** Save the key somewhere safe - you'll need it in Step 4

**Screenshot Reference:** Look for a page titled "API Keys" with a green "Create API Key" button

---

## 2. Flutterwave Payment Setup

**What it's for:** Processes credit card payments for premium subscriptions

**Estimated Time:** 15-20 minutes

### Steps:

- [ ] **Step 1:** Go to [https://flutterwave.com](https://flutterwave.com)

- [ ] **Step 2:** Click "Get Started" or "Sign Up"

- [ ] **Step 3:** Fill in your business information:
  - Business name
  - Your name
  - Email address
  - Phone number
  - Password

- [ ] **Step 4:** Verify your email address (check your inbox)

- [ ] **Step 5:** Complete your business profile:
  - Business type
  - Country
  - Business category
  - Website (you can use your Call Waiting AI domain)

- [ ] **Step 6:** Submit required documents (may vary by country):
  - Business registration
  - ID verification
  - Bank account details

  **Note:** This step may take 1-3 business days for approval

- [ ] **Step 7:** Once approved, log into your Flutterwave dashboard

- [ ] **Step 8:** Click on "Settings" in the left sidebar

- [ ] **Step 9:** Click on "API Keys" or "API Settings"

- [ ] **Step 10:** You'll see two types of keys - we need both:

### For Testing (Sandbox Keys):

- [ ] **Step 11:** Switch to "Test Mode" or "Sandbox" (usually a toggle at the top)

- [ ] **Step 12:** Copy your **Test Public Key**
  - Starts with `FLWPUBK_TEST-`
  - Save it as "Flutterwave Test Public Key"

- [ ] **Step 13:** Copy your **Test Secret Key**
  - Starts with `FLWSECK_TEST-`
  - Save it as "Flutterwave Test Secret Key"

### For Production (Live Keys):

- [ ] **Step 14:** Switch to "Live Mode" or "Production"

- [ ] **Step 15:** Copy your **Live Public Key**
  - Starts with `FLWPUBK-`
  - Save it as "Flutterwave Live Public Key"

- [ ] **Step 16:** Copy your **Live Secret Key**
  - Starts with `FLWSECK-`
  - Save it as "Flutterwave Live Secret Key"

**IMPORTANT:** Keep these keys extremely secure. Never share them or commit them to code.

**Screenshot Reference:** Look for a page with "API Keys" showing two sections: "Test Keys" and "Live Keys"

---

## 3. Telegram Bot Setup

**What it's for:** Sends notifications and alerts to your Telegram account

**Estimated Time:** 5-10 minutes

### Steps:

- [ ] **Step 1:** Open Telegram app on your phone or computer
  - Don't have Telegram? Download it from [https://telegram.org](https://telegram.org)

- [ ] **Step 2:** In the search bar, type: `@BotFather`

- [ ] **Step 3:** Click on the official BotFather (it has a blue checkmark)

- [ ] **Step 4:** Click "START" or send the message `/start`

- [ ] **Step 5:** Send the command: `/newbot`

- [ ] **Step 6:** BotFather will ask for a name for your bot
  - Type something like: `Call Waiting AI Bot`
  - This is just a display name - you can change it later

- [ ] **Step 7:** Now choose a username for your bot
  - Must end in "bot"
  - Example: `callwaitingai_bot` or `cw_alerts_bot`
  - Must be unique (try different names if taken)

- [ ] **Step 8:** Success! BotFather will send you a message with your bot token
  - It looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
  - **IMPORTANT:** Copy this token immediately

- [ ] **Step 9:** Save the token somewhere safe - you'll need it in Step 4

### Optional - Get Your Chat ID (for personal notifications):

- [ ] **Step 10:** Search for your new bot username in Telegram

- [ ] **Step 11:** Click "START" to activate it

- [ ] **Step 12:** Send any message to your bot (e.g., "Hello")

- [ ] **Step 13:** Open this URL in your browser (replace YOUR_BOT_TOKEN):
  ```
  https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
  ```

- [ ] **Step 14:** Look for `"chat":{"id":` followed by a number
  - This is your Chat ID (e.g., `123456789`)
  - Save it as "Telegram Chat ID"

**Screenshot Reference:** BotFather chat showing "Done! Congratulations on your new bot" with a token below

---

## 4. Adding Keys to Supabase Vault

**What it's for:** Securely stores all your API keys in one encrypted place

**Estimated Time:** 10-15 minutes

### Steps:

- [ ] **Step 1:** Log into your Supabase dashboard at [https://supabase.com](https://supabase.com)

- [ ] **Step 2:** Select your Call Waiting AI project

- [ ] **Step 3:** Click on "Settings" (gear icon) in the bottom left sidebar

- [ ] **Step 4:** Click on "Vault" in the settings menu

- [ ] **Step 5:** Click "New Secret" button

Now you'll add each API key one by one:

### Adding Groq API Key:

- [ ] **Step 6:** Click "New Secret"
  - **Name:** `groq_api_key`
  - **Secret:** Paste your Groq API key (from Step 1)
  - Click "Save"

### Adding Flutterwave Keys:

- [ ] **Step 7:** Click "New Secret" again
  - **Name:** `flutterwave_public_key_test`
  - **Secret:** Paste your Flutterwave Test Public Key
  - Click "Save"

- [ ] **Step 8:** Click "New Secret"
  - **Name:** `flutterwave_secret_key_test`
  - **Secret:** Paste your Flutterwave Test Secret Key
  - Click "Save"

- [ ] **Step 9:** Click "New Secret"
  - **Name:** `flutterwave_public_key_live`
  - **Secret:** Paste your Flutterwave Live Public Key
  - Click "Save"

- [ ] **Step 10:** Click "New Secret"
  - **Name:** `flutterwave_secret_key_live`
  - **Secret:** Paste your Flutterwave Live Secret Key
  - Click "Save"

### Adding Telegram Bot Token:

- [ ] **Step 11:** Click "New Secret"
  - **Name:** `telegram_bot_token`
  - **Secret:** Paste your Telegram Bot Token
  - Click "Save"

### Adding Telegram Chat ID (Optional):

- [ ] **Step 12:** Click "New Secret"
  - **Name:** `telegram_chat_id`
  - **Secret:** Paste your Telegram Chat ID
  - Click "Save"

### Verify All Keys Are Added:

- [ ] **Step 13:** You should now see all these secrets in your Vault:
  - `groq_api_key`
  - `flutterwave_public_key_test`
  - `flutterwave_secret_key_test`
  - `flutterwave_public_key_live`
  - `flutterwave_secret_key_live`
  - `telegram_bot_token`
  - `telegram_chat_id` (if added)

**Screenshot Reference:** A table showing secret names with masked values (••••••••)

---

## 5. Testing Your Configuration

**What it's for:** Make sure everything is connected and working

**Estimated Time:** 5 minutes

### Test Groq API:

- [ ] **Step 1:** Open your terminal/command prompt

- [ ] **Step 2:** Run this command (replace YOUR_GROQ_KEY):
  ```bash
  curl "https://api.groq.com/openai/v1/models" \
    -H "Authorization: Bearer YOUR_GROQ_KEY"
  ```

- [ ] **Step 3:** ✅ **Success:** You see a list of AI models
  - ❌ **Failed:** See [Troubleshooting - Groq](#groq-api-issues)

### Test Flutterwave API:

- [ ] **Step 4:** Run this command (replace YOUR_PUBLIC_KEY):
  ```bash
  curl "https://api.flutterwave.com/v3/banks/NG" \
    -H "Authorization: Bearer YOUR_PUBLIC_KEY"
  ```

- [ ] **Step 5:** ✅ **Success:** You see a list of Nigerian banks
  - ❌ **Failed:** See [Troubleshooting - Flutterwave](#flutterwave-api-issues)

### Test Telegram Bot:

- [ ] **Step 6:** Send a test message using this URL in your browser:
  ```
  https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage?chat_id=YOUR_CHAT_ID&text=Test%20from%20Call%20Waiting%20AI
  ```

- [ ] **Step 7:** ✅ **Success:** You receive a message in Telegram from your bot
  - ❌ **Failed:** See [Troubleshooting - Telegram](#telegram-bot-issues)

### Test Supabase Vault Access:

- [ ] **Step 8:** In Supabase dashboard, go to SQL Editor

- [ ] **Step 9:** Run this query:
  ```sql
  SELECT * FROM vault.decrypted_secrets;
  ```

- [ ] **Step 10:** ✅ **Success:** You see all your secrets listed
  - ❌ **Failed:** See [Troubleshooting - Supabase](#supabase-vault-issues)

---

## 6. Troubleshooting

### Groq API Issues

**Problem:** "Invalid API Key" or "Unauthorized" error

**Solutions:**
- [ ] Double-check you copied the entire API key (starts with `gsk_`)
- [ ] Make sure there are no extra spaces before or after the key
- [ ] Try regenerating a new API key from Groq console
- [ ] Verify your Groq account is active and verified

**Problem:** "Rate limit exceeded"

**Solutions:**
- [ ] Wait 60 seconds and try again
- [ ] Check your Groq dashboard for usage limits
- [ ] Consider upgrading your Groq plan if needed

---

### Flutterwave API Issues

**Problem:** "Invalid key" error

**Solutions:**
- [ ] Make sure you're using the correct key type (Test vs Live)
- [ ] Test keys start with `FLWPUBK_TEST-` or `FLWSECK_TEST-`
- [ ] Live keys start with `FLWPUBK-` or `FLWSECK-`
- [ ] Verify your Flutterwave account is fully approved

**Problem:** "Account not approved" error

**Solutions:**
- [ ] Check your email for Flutterwave approval status
- [ ] Complete all required verification steps
- [ ] Contact Flutterwave support if approval is taking too long
- [ ] Use test keys while waiting for live approval

**Problem:** Payments not processing

**Solutions:**
- [ ] Verify you're using the Secret Key (not Public Key) for server-side calls
- [ ] Check that your business account has payment processing enabled
- [ ] Test with test keys first before going live
- [ ] Review Flutterwave dashboard for any failed transaction details

---

### Telegram Bot Issues

**Problem:** "Unauthorized" error

**Solutions:**
- [ ] Verify you copied the complete bot token from BotFather
- [ ] Token format should be: numbers:letters (e.g., `123456:ABC-xyz`)
- [ ] Try creating a new bot and getting a new token
- [ ] Make sure you sent `/start` to your bot

**Problem:** Not receiving messages

**Solutions:**
- [ ] Verify your Chat ID is correct
- [ ] Make sure you started a conversation with your bot
- [ ] Check that your bot hasn't been blocked
- [ ] Try sending a test message directly to your bot first

**Problem:** Can't find BotFather

**Solutions:**
- [ ] Search for `@BotFather` (with the @ symbol)
- [ ] Make sure you're using official Telegram (not a third-party app)
- [ ] The real BotFather has a blue verification checkmark
- [ ] Try this direct link: [https://t.me/BotFather](https://t.me/BotFather)

---

### Supabase Vault Issues

**Problem:** Can't access Vault section

**Solutions:**
- [ ] Make sure you're on a paid Supabase plan (Vault is not available on free tier)
- [ ] Verify you have admin/owner permissions on the project
- [ ] Try refreshing the page or logging out and back in
- [ ] Check Supabase status page for any outages

**Problem:** "Permission denied" when querying secrets

**Solutions:**
- [ ] Make sure you're using the correct database role
- [ ] Verify RLS policies allow access to vault secrets
- [ ] Check that secrets were saved correctly (no typos in names)
- [ ] Try accessing through the Supabase API instead of SQL

**Problem:** Secrets not showing up in application

**Solutions:**
- [ ] Verify environment variables are properly configured
- [ ] Check that your application is reading from Supabase Vault correctly
- [ ] Restart your application server after adding new secrets
- [ ] Review application logs for any vault access errors

---

### General Troubleshooting Tips

**Problem:** Still stuck after trying solutions

**Next Steps:**
- [ ] Check the official documentation for each service:
  - Groq: [https://console.groq.com/docs](https://console.groq.com/docs)
  - Flutterwave: [https://developer.flutterwave.com/docs](https://developer.flutterwave.com/docs)
  - Telegram Bots: [https://core.telegram.org/bots](https://core.telegram.org/bots)
  - Supabase Vault: [https://supabase.com/docs/guides/database/vault](https://supabase.com/docs/guides/database/vault)

- [ ] Check your application logs for detailed error messages

- [ ] Verify your internet connection is stable

- [ ] Try using a different browser or device

- [ ] Contact support for the specific service having issues

**Need Help?**
- Review the main project README.md for additional setup instructions
- Check if there are any known issues in the project repository
- Reach out to the development team with specific error messages

---

## Checklist: Configuration Complete

Before launching to production, verify:

- [ ] All API keys are saved in Supabase Vault
- [ ] Groq API test passed successfully
- [ ] Flutterwave test transactions work (using test keys)
- [ ] Flutterwave live keys added (after account approval)
- [ ] Telegram bot sends notifications
- [ ] All secrets can be accessed from Supabase
- [ ] Application successfully reads secrets from vault
- [ ] No API keys are hardcoded in the application code
- [ ] No API keys are committed to version control

---

## Security Best Practices

**DO:**
- ✅ Store all keys in Supabase Vault only
- ✅ Use test keys for development/testing
- ✅ Use live keys only in production
- ✅ Regenerate keys if they are ever exposed
- ✅ Limit API key permissions where possible
- ✅ Monitor API usage regularly

**DON'T:**
- ❌ Share API keys via email, chat, or messages
- ❌ Commit API keys to Git/GitHub
- ❌ Use live keys for testing
- ❌ Store keys in plain text files
- ❌ Reuse the same keys across multiple projects
- ❌ Give keys to third parties

---

## Next Steps

After completing this configuration:

1. **Test Everything:** Run through all test commands above
2. **Document:** Note down which keys are for test vs. production
3. **Backup:** Store a backup of key names (not values) in a safe place
4. **Monitor:** Set up alerts for API usage and errors
5. **Launch:** You're ready to deploy to production!

---

**Questions or Issues?**

If you encounter problems not covered in this guide, please:
1. Check the troubleshooting section above
2. Review the official documentation for each service
3. Contact the development team with specific error messages

---

**Last Updated:** 2025-11-01
**Version:** 1.0
