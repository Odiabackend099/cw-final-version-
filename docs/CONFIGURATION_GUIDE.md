# CallWaitingAI Platform - Environment Configuration Guide

## Quick Setup

The platform is deployed and functional. To enable all features, configure these API keys.

## Supabase Secrets Configuration

Access your Supabase project at: https://supabase.com/dashboard/project/ectphyvfbkwaawtnzrlo

### Required Secrets for Full Functionality

#### 1. Vapi AI (Voice Integration)
```bash
# Secret name: VAPI_API_KEY
# Get from: https://dashboard.vapi.ai
# Used in: vapi-webhook edge function
VAPI_API_KEY=your_vapi_private_key_here
```

#### 2. Flutterwave (Payment Processing)
```bash
# Secret name: FLUTTERWAVE_SECRET_KEY
# Get from: https://dashboard.flutterwave.com/settings/apis
# Used in: create-payment-link edge function
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key_here

# Secret name: FLUTTERWAVE_PUBLIC_KEY  
# Get from: https://dashboard.flutterwave.com/settings/apis
# Used in: Frontend payment initialization
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key_here
```

#### 3. Telegram Bot (Notifications)
```bash
# Secret name: TELEGRAM_BOT_TOKEN
# Get from: Create bot via @BotFather on Telegram
# Used in: send-telegram-notification edge function
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Secret name: TELEGRAM_CHAT_ID
# Get from: Send message to your bot, check https://api.telegram.org/bot<token>/getUpdates
# Used in: send-telegram-notification edge function
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Adding Secrets to Supabase

### Option 1: Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard/project/ectphyvfbkwaawtnzrlo/settings/vault
2. Click "New Secret"
3. Enter secret name (e.g., `VAPI_API_KEY`)
4. Enter secret value
5. Click "Add Secret"
6. Repeat for all required secrets

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login
supabase login

# Set secrets
supabase secrets set --project-ref ectphyvfbkwaawtnzrlo VAPI_API_KEY=your_key_here
supabase secrets set --project-ref ectphyvfbkwaawtnzrlo FLUTTERWAVE_SECRET_KEY=your_key_here
supabase secrets set --project-ref ectphyvfbkwaawtnzrlo TELEGRAM_BOT_TOKEN=your_token_here
supabase secrets set --project-ref ectphyvfbkwaawtnzrlo TELEGRAM_CHAT_ID=your_chat_id_here
```

## Testing After Configuration

### 1. Test Voice Integration
- Log into platform: https://r9vdmsod7t69.space.minimax.io
- Click floating chat widget
- Click phone icon to initiate voice call
- Verify voice conversation works

### 2. Test Payment Integration
- Navigate to Payments page
- Click "New Payment"
- Select a plan
- Click "Continue to Payment"
- Verify payment link is generated and redirects to Flutterwave

### 3. Test Telegram Notifications
- Create a new lead via Leads page or voice call
- Check Telegram chat for notification
- Verify lead details are included in message

## Webhook Configuration

### Vapi Webhook Setup
1. Go to: https://dashboard.vapi.ai/webhooks
2. Add webhook URL: `https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/vapi-webhook`
3. Select events: `call.started`, `call.ended`
4. Save configuration

### Flutterwave Webhook Setup
1. Go to: https://dashboard.flutterwave.com/settings/webhooks
2. Add webhook URL: `https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/create-payment-link`
3. Enable payment status events
4. Save configuration

## Frontend Environment Variables (Optional)

If you need to rebuild the frontend with API keys:

1. Edit `/workspace/frontend/callwaitingai-frontend/.env`
2. Add:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```
3. Rebuild:
```bash
cd /workspace/frontend/callwaitingai-frontend
pnpm build
```

## Verification Checklist

After adding all secrets:

- [ ] Vapi API key added to Supabase secrets
- [ ] Vapi webhook URL configured in Vapi dashboard
- [ ] Flutterwave secret key added to Supabase secrets
- [ ] Flutterwave webhook URL configured (if needed)
- [ ] Telegram bot token added to Supabase secrets
- [ ] Telegram chat ID added to Supabase secrets
- [ ] Test voice call works
- [ ] Test payment link generation works
- [ ] Test Telegram notification works

## Support

For configuration assistance:
- Supabase Documentation: https://supabase.com/docs
- Vapi Documentation: https://docs.vapi.ai
- Flutterwave Documentation: https://developer.flutterwave.com
- Telegram Bot API: https://core.telegram.org/bots/api

## Security Notes

- Never commit API keys to version control
- Use Supabase secrets for all sensitive credentials
- Rotate keys periodically for security
- Monitor API usage in respective dashboards
- Enable webhook signature verification when available
