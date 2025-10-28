# CallWaitingAI Platform

Production-ready Voice AI lead-capture and call assistant platform with comprehensive dashboard, real-time features, and multiple integrations.

## Features

- Voice AI assistant "Marcy" via Vapi API integration
- Real-time dashboard with analytics
- Lead management and tracking
- Call logs with voice recording support
- Payment processing with Flutterwave
- Telegram notifications for leads
- Floating chat widget with text and voice support
- Role-based access control (Admin, Agent, Client)
- Responsive mobile-first design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase client for real-time features
- React Router for navigation
- Recharts for data visualization
- Vapi Web SDK for voice integration

### Backend
- Supabase PostgreSQL database
- Supabase Edge Functions (Deno)
- Row Level Security (RLS) policies
- Real-time subscriptions

### Integrations
- **Vapi AI**: Voice conversations and webhooks
- **Flutterwave**: Payment processing
- **Telegram Bot**: Instant notifications

## Project Structure

```
/workspace/
├── frontend/callwaitingai-frontend/   # React application
│   ├── src/
│   │   ├── components/                # Reusable components
│   │   ├── contexts/                  # React contexts (Auth)
│   │   ├── lib/                       # Utilities and Supabase client
│   │   ├── pages/                     # Page components
│   │   └── App.tsx                    # Main app with routing
│   └── public/                        # Static assets
│
└── supabase/
    └── functions/                     # Edge functions
        ├── vapi-webhook/              # Vapi webhook handler
        ├── create-payment-link/       # Payment link generator
        └── send-telegram-notification/ # Telegram alerts

```

## Database Schema

### Tables
- **users**: User profiles with role-based access
- **assistants**: AI assistant configurations
- **leads**: Captured lead information
- **call_logs**: Voice call records and transcripts
- **payments**: Payment transactions
- **chat_messages**: Chat widget conversations
- **webhook_events**: External API event logs
- **system_settings**: Platform configuration

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- API keys for external services (optional for core features)

### Installation

1. **Frontend Setup**
```bash
cd /workspace/frontend/callwaitingai-frontend
pnpm install
```

2. **Environment Configuration**

The application is pre-configured with Supabase credentials. For full functionality, add these environment variables:

```env
# Already configured
VITE_SUPABASE_URL=https://ectphyvfbkwaawtnzrlo.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]

# Optional - Add these for full feature set
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```

3. **Start Development Server**
```bash
pnpm dev
```

The application will run at http://localhost:5173

## Edge Functions

All edge functions are deployed and active:

1. **vapi-webhook**: `https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/vapi-webhook`
   - Handles voice call events
   - Processes call transcripts
   - Captures leads from conversations

2. **create-payment-link**: `https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/create-payment-link`
   - Generates Flutterwave payment links
   - Tracks payment status
   - Supports subscription plans

3. **send-telegram-notification**: `https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/send-telegram-notification`
   - Sends lead alerts
   - Real-time notifications
   - Custom message formatting

## External API Configuration

To enable full functionality, configure these API credentials as Supabase secrets:

### Vapi AI (Voice Integration)
```bash
# Get from: https://dashboard.vapi.ai
VAPI_API_KEY=your_private_key
```

### Flutterwave (Payments)
```bash
# Get from: https://dashboard.flutterwave.com
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_public_key
```

### Telegram Bot (Notifications)
```bash
# Create bot via @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Usage

### Creating an Account
1. Navigate to `/signup`
2. Enter email, password, and full name
3. Account created with 'client' role by default

### Dashboard Features
- **Overview**: Total calls, leads, revenue, and monthly stats
- **Call Logs**: Real-time call tracking with status updates
- **Leads**: Lead management with status workflows
- **Payments**: Subscription management and payment history
- **Settings**: Profile management and API configuration

### Voice Features
- Click the floating chat widget to start a conversation
- Use the phone icon to initiate a voice call with Marcy
- Voice calls are processed through Vapi AI (requires API key)

### Payment Plans
- **Basic**: $49.99/month - Up to 100 calls
- **Professional**: $99.99/month - Up to 500 calls
- **Enterprise**: $199.99/month - Unlimited calls

## Deployment

### Build for Production
```bash
cd /workspace/frontend/callwaitingai-frontend
pnpm build
```

The build output will be in `dist/` directory.

### Deploy Options
1. **Vercel/Netlify**: Connect repository for automatic deployments
2. **Static Hosting**: Upload `dist/` folder to any static host
3. **Docker**: Use included Dockerfile for containerized deployment

## Security

- All tables have Row Level Security (RLS) enabled
- JWT-based authentication via Supabase Auth
- API keys stored as environment variables
- Webhook signature verification (when configured)
- Input validation on all forms

## Real-time Features

The platform uses Supabase real-time subscriptions for:
- Live call log updates
- Lead notifications
- Payment status changes
- Chat message delivery

## Default Assistant

The platform includes a default AI assistant named "Marcy" with:
- Professional and friendly personality
- Lead capture capabilities
- 24/7 availability
- Customizable system prompts

## API Endpoints

### Edge Functions
- POST `/functions/v1/vapi-webhook` - Vapi event handler
- POST `/functions/v1/create-payment-link` - Generate payment links
- POST `/functions/v1/send-telegram-notification` - Send notifications

### Supabase REST API
Standard Supabase REST endpoints for all tables with RLS protection.

## Troubleshooting

### Voice calls not working
- Check if VAPI_API_KEY is configured in Supabase secrets
- Verify microphone permissions in browser
- Check browser console for errors

### Payments not processing
- Ensure FLUTTERWAVE_SECRET_KEY is set
- Verify Flutterwave account is active
- Check webhook configuration

### Real-time updates not appearing
- Verify Supabase connection
- Check RLS policies allow read access
- Ensure user is authenticated

## Support

For issues or questions:
1. Check the browser console for errors
2. Review Supabase function logs
3. Verify all API credentials are configured
4. Contact system administrator

## License

Proprietary - All rights reserved

---

Built with CallWaitingAI - Intelligent Voice AI Platform
