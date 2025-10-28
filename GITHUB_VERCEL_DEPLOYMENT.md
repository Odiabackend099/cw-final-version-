# GitHub & Vercel Deployment Guide

## Project Overview

CallWaitingAI is organized as a **monorepo** with two separate frontend applications:

1. **Landing Page** - `/callwaitingai-landing` (Public marketing site)
2. **Dashboard** - `/frontend/callwaitingai-frontend` (User dashboard/app)

Both applications share the same **Supabase backend** for authentication, database, and Edge Functions.

---

## GitHub Repository Setup

### Step 1: Initialize Git Repository

```bash
cd /Users/odiadev/Downloads/cwlunch

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CallWaitingAI platform with landing page and dashboard

- Landing page with chat and voice widgets
- Dashboard with authentication flows
- Supabase Edge Functions for secure API integrations
- Complete email verification and password reset flows
- Production-ready builds (96% test pass rate)"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named: `callwaitingai`
3. **Do NOT initialize with README** (we already have files)
4. Keep it private for now (can make public later)

### Step 3: Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/callwaitingai.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Vercel Deployment Setup

### Project Structure

You will deploy **TWO separate Vercel projects**:

1. **Landing Page Project** (Main/Production Site)
   - Root Directory: `callwaitingai-landing`
   - Domain: `callwaitingai.com` or `callwaitingai.vercel.app`

2. **Dashboard Project** (User Application)
   - Root Directory: `frontend/callwaitingai-frontend`
   - Domain: `app.callwaitingai.com` or `callwaitingai-dashboard.vercel.app`

---

## Deploying Landing Page to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `callwaitingai`

### Step 2: Configure Landing Page Build

**Framework Preset**: Vite
**Root Directory**: `callwaitingai-landing` ⚠️ **IMPORTANT**
**Build Command**: `pnpm build`
**Output Directory**: `dist`
**Install Command**: `pnpm install`

### Step 3: Configure Environment Variables

Add these environment variables in Vercel project settings:

```
VITE_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQyMDksImV4cCI6MjA2MDY2MDIwOX0.X1V1DPAZHfzQ6a3D8G7XeaqJM7FS2-TqDYtpzXt1KeM
VITE_VAPI_PUBLIC_KEY=ddd720c5-6fb8-4174-b7a6-729d7b308cb9
VITE_VAPI_ASSISTANT_ID=fdaaa6f7-a204-4c08-99fd-20451c96fc74
```

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## Deploying Dashboard to Vercel

### Step 1: Create New Project

1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Import the **SAME** GitHub repository: `callwaitingai`

### Step 2: Configure Dashboard Build

**Framework Preset**: Vite
**Root Directory**: `frontend/callwaitingai-frontend` ⚠️ **IMPORTANT**
**Build Command**: `pnpm build`
**Output Directory**: `dist`
**Install Command**: `pnpm install`

### Step 3: Configure Environment Variables

Add the **SAME** environment variables as the landing page:

```
VITE_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQyMDksImV4cCI6MjA2MDY2MDIwOX0.X1V1DPAZHfzQ6a3D8G7XeaqJM7FS2-TqDYtpzXt1KeM
VITE_VAPI_PUBLIC_KEY=ddd720c5-6fb8-4174-b7a6-729d7b308cb9
VITE_VAPI_ASSISTANT_ID=fdaaa6f7-a204-4c08-99fd-20451c96fc74
```

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## Post-Deployment Configuration

### 1. Update Supabase Auth Redirect URLs

After deployment, update Supabase with production URLs:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd)
2. Navigate to: **Authentication** → **URL Configuration**
3. Add these URLs to **Redirect URLs**:

```
# Landing Page
https://your-landing-page.vercel.app/auth/callback
https://your-landing-page.vercel.app/auth/confirm

# Dashboard
https://your-dashboard.vercel.app/auth/callback
https://your-dashboard.vercel.app/auth/confirm
https://your-dashboard.vercel.app/dashboard

# If using custom domains:
https://callwaitingai.com/auth/callback
https://callwaitingai.com/auth/confirm
https://app.callwaitingai.com/auth/callback
https://app.callwaitingai.com/auth/confirm
https://app.callwaitingai.com/dashboard
```

4. Update **Site URL** to your landing page URL

### 2. Update Auth Redirect in Landing Page Code

After deployment, you'll need to update the hardcoded localhost URL in the landing page:

**File**: `callwaitingai-landing/src/components/Navigation.tsx`

```typescript
// BEFORE (Development):
onSuccess={() => {
  window.location.href = 'http://localhost:5174/dashboard';
}}

// AFTER (Production):
onSuccess={() => {
  window.location.href = 'https://your-dashboard.vercel.app/dashboard';
  // OR with custom domain:
  // window.location.href = 'https://app.callwaitingai.com/dashboard';
}}
```

Then commit and push:
```bash
git add .
git commit -m "Update dashboard URL for production"
git push origin main
```

Vercel will automatically redeploy with the updated URL.

### 3. Configure Custom Domains (Optional)

**Landing Page**:
1. In Vercel project settings → Domains
2. Add: `callwaitingai.com`
3. Follow DNS configuration instructions

**Dashboard**:
1. In Vercel project settings → Domains
2. Add: `app.callwaitingai.com`
3. Follow DNS configuration instructions

---

## Deployment Verification Checklist

After deployment, verify these functionalities:

### Landing Page
- [ ] Page loads successfully
- [ ] Navigation works (Sign In / Sign Up buttons)
- [ ] Auth modal opens and closes
- [ ] Chat widget opens and connects to Supabase function
- [ ] Voice widget UI displays correctly
- [ ] Sign up creates user and sends verification email
- [ ] Sign in redirects to dashboard URL

### Dashboard
- [ ] Login page loads
- [ ] Sign in authenticates correctly
- [ ] Email verification page works (`/auth/confirm`)
- [ ] Password reset page works (`/auth/reset-password`)
- [ ] Dashboard pages load (Overview, Calls, Leads, etc.)
- [ ] User can log out
- [ ] Protected routes redirect to login when not authenticated

### Backend
- [ ] Supabase Edge Functions responding
- [ ] Email verification emails being sent
- [ ] Password reset emails being sent
- [ ] Database operations working (user creation, RLS policies)

---

## Troubleshooting

### Build Fails with "Module not found"
**Solution**: Ensure `pnpm-lock.yaml` is committed to Git. Vercel needs it to install dependencies correctly.

### Environment Variables Not Working
**Solution**:
1. Check that all `VITE_*` prefixed variables are set in Vercel
2. Redeploy after adding environment variables
3. Clear Vercel cache and redeploy

### Auth Redirect Not Working
**Solution**:
1. Verify redirect URLs in Supabase Dashboard
2. Check that dashboard URL is correct in Navigation.tsx
3. Ensure CORS is configured in Supabase

### Chat Widget Returns Error
**Solution**:
1. Verify Supabase Edge Functions are deployed
2. Check that GROQ_API_KEY is set in Supabase secrets
3. Test Edge Function directly with curl

### Voice Calls Not Working
**Solution**:
1. Verify VAPI_PUBLIC_KEY and VAPI_ASSISTANT_ID are correct
2. Test voice call on HTTPS (required for microphone access)
3. Check browser console for Vapi SDK errors

---

## Monitoring and Logs

### Vercel Logs
- View deployment logs in Vercel Dashboard → Deployments
- View function logs in Vercel Dashboard → Functions
- Monitor performance in Vercel Analytics

### Supabase Logs
- View Edge Function logs in Supabase Dashboard → Edge Functions → Logs
- View auth logs in Supabase Dashboard → Authentication → Logs
- Monitor database queries in Supabase Dashboard → Database → Logs

---

## Production Best Practices

1. **Enable Vercel Analytics** for both projects
2. **Set up error monitoring** (Sentry, LogRocket, etc.)
3. **Configure CORS** properly in Supabase
4. **Use custom domains** for better branding
5. **Enable HTTPS** (automatic with Vercel)
6. **Monitor API usage** in Groq, Vapi, and Supabase dashboards
7. **Set up backup strategies** for Supabase database
8. **Create staging environments** for testing before production

---

## Quick Reference Commands

```bash
# Build locally to test
cd callwaitingai-landing && pnpm build
cd frontend/callwaitingai-frontend && pnpm build

# Deploy to Vercel via CLI (alternative method)
vercel --cwd callwaitingai-landing
vercel --cwd frontend/callwaitingai-frontend

# Update environment variables
vercel env add VITE_SUPABASE_URL production

# View logs
vercel logs
```

---

## Support

For issues:
1. Check Vercel deployment logs
2. Check Supabase Edge Function logs
3. Review browser console errors
4. Refer to `COMPREHENSIVE_TEST_REPORT.md` for known issues

---

**Deployment Status**: ✅ Ready for Production
**Test Pass Rate**: 96% (26/27 tests passing)
**Last Updated**: 2025-10-28
