# 🚀 Vercel Deployment Guide - CallWaitingAI

**Quick Deploy**: 15 minutes to live!

---

## 📋 Prerequisites

1. **GitHub Account** - Repository created
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables** - Ready from `.env` files

---

## 🎯 Deployment Strategy

**IMPORTANT**: You need **TWO separate Vercel projects** from the same GitHub repository!

### Project 1: Landing Page
- **URL**: `callwaitingai.vercel.app` (or custom domain)
- **Root Directory**: `callwaitingai-landing`
- **Purpose**: Public marketing site with voice/chat widgets

### Project 2: Dashboard
- **URL**: `callwaitingai-dashboard.vercel.app` (or `app.callwaitingai.com`)
- **Root Directory**: `frontend/callwaitingai-frontend`
- **Purpose**: User dashboard application

---

## 📦 Step 1: Push to GitHub

```bash
# If not already done
git remote add origin https://github.com/YOUR_USERNAME/callwaitingai.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy Landing Page

### 2.1 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **Import Git Repository**
4. Choose your GitHub repository: `callwaitingai`
5. Click **"Import"**

### 2.2 Configure Build Settings

**CRITICAL SETTINGS** (Copy these exactly):

```
Framework Preset: Vite
Root Directory: callwaitingai-landing    ⚠️ IMPORTANT!
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Node Version: 18.x
```

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQyMDksImV4cCI6MjA2MDY2MDIwOX0.X1V1DPAZHfzQ6a3D8G7XeaqJM7FS2-TqDYtpzXt1KeM
VITE_VAPI_PUBLIC_KEY=ddd720c5-6fb8-4174-b7a6-729d7b308cb9
VITE_VAPI_ASSISTANT_ID=fdaaa6f7-a204-4c08-99fd-20451c96fc74
```

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Note your deployment URL (e.g., `your-app.vercel.app`)

---

## 🎨 Step 3: Deploy Dashboard

### 3.1 Create Second Project

1. Go back to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"** again
3. **Import the SAME repository**: `callwaitingai`
4. Click **"Import"**

### 3.2 Configure Build Settings

**DIFFERENT ROOT DIRECTORY**:

```
Framework Preset: Vite
Root Directory: frontend/callwaitingai-frontend    ⚠️ DIFFERENT!
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Node Version: 18.x
```

### 3.3 Add Environment Variables

**SAME variables as landing page**:

```env
VITE_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQyMDksImV4cCI6MjA2MDY2MDIwOX0.X1V1DPAZHfzQ6a3D8G7XeaqJM7FS2-TqDYtpzXt1KeM
VITE_VAPI_PUBLIC_KEY=ddd720c5-6fb8-4174-b7a6-729d7b308cb9
VITE_VAPI_ASSISTANT_ID=fdaaa6f7-a204-4c08-99fd-20451c96fc74
```

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Note your dashboard URL (e.g., `your-dashboard.vercel.app`)

---

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update Navigation Redirect

After getting your dashboard URL, update the landing page code:

**File**: `callwaitingai-landing/src/components/Navigation.tsx` (Lines 68 & 109)

```typescript
// Change from:
href="http://localhost:5175/login"

// To:
href="https://your-dashboard.vercel.app/login"
```

**Commit and push**:
```bash
git add .
git commit -m "Update dashboard URL for production"
git push origin main
```

Vercel will automatically redeploy the landing page.

### 4.2 Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd)
2. Navigate to: **Authentication** → **URL Configuration**
3. Add these URLs to **Redirect URLs**:

```
https://your-landing-page.vercel.app/auth/callback
https://your-landing-page.vercel.app/auth/confirm
https://your-dashboard.vercel.app/auth/callback
https://your-dashboard.vercel.app/auth/confirm
https://your-dashboard.vercel.app/dashboard
```

4. Update **Site URL** to your landing page URL

---

## ✅ Step 5: Verify Deployment

### Landing Page Tests

Visit: `https://your-landing-page.vercel.app`

- [ ] Page loads successfully
- [ ] Voice widget displays
- [ ] Chat widget displays
- [ ] "Sign In" button visible
- [ ] Click "Sign In" → redirects to dashboard login
- [ ] Voice call connects (allow microphone)
- [ ] Chat responds to messages
- [ ] No console errors

### Dashboard Tests

Visit: `https://your-dashboard.vercel.app/login`

- [ ] Login page loads
- [ ] Can sign in successfully
- [ ] Dashboard redirects to `/dashboard` after login
- [ ] All pages accessible (Calls, Leads, Payments, Settings)
- [ ] Protected routes redirect to login when not authenticated
- [ ] No console errors

---

## 🎯 Optional: Custom Domains

### Landing Page Domain

1. In Vercel project → **Settings** → **Domains**
2. Add domain: `callwaitingai.com`
3. Follow DNS configuration instructions (usually add A/CNAME records)
4. Wait for DNS propagation (5-30 minutes)

### Dashboard Domain

1. In Vercel dashboard project → **Settings** → **Domains**
2. Add subdomain: `app.callwaitingai.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation

### Update Code with Custom Domains

**Navigation.tsx**:
```typescript
href="https://app.callwaitingai.com/login"
```

**Supabase Redirect URLs**:
```
https://callwaitingai.com/auth/callback
https://callwaitingai.com/auth/confirm
https://app.callwaitingai.com/auth/callback
https://app.callwaitingai.com/auth/confirm
https://app.callwaitingai.com/dashboard
```

---

## 🐛 Troubleshooting

### Build Fails: "Module not found"

**Solution**: Ensure `pnpm-lock.yaml` is committed to Git
```bash
git add pnpm-lock.yaml
git commit -m "Add lockfile"
git push
```

### Build Fails: "Root directory not found"

**Solution**: Double-check Root Directory setting
- Landing: `callwaitingai-landing`
- Dashboard: `frontend/callwaitingai-frontend`

### Environment Variables Not Working

**Solution**:
1. Verify all `VITE_*` variables are set
2. Redeploy (Vercel → Deployments → ⋯ → Redeploy)
3. Check **Settings** → **Environment Variables**

### "Sign In" Redirects to Wrong URL

**Solution**:
1. Update `Navigation.tsx` with production dashboard URL
2. Commit and push
3. Wait for Vercel to auto-redeploy

### Chat/Voice Not Working in Production

**Solution**:
1. Open browser console (F12)
2. Check for CORS errors
3. Verify environment variables are set
4. Check Supabase Edge Function logs

### 404 on Dashboard Routes

**Solution**: Already configured in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

If missing, add this to your `vercel.json`.

---

## 📊 Monitoring

### Vercel Analytics

1. Enable in Vercel project **Settings** → **Analytics**
2. Track page views, performance, Web Vitals

### Deployment Logs

- View real-time logs: **Deployments** → Select deployment → **View Function Logs**
- Check build logs for errors

### Supabase Monitoring

- **Edge Functions**: Monitor at Supabase Dashboard → Edge Functions → Logs
- **Auth**: Track sign-ups/logins at Authentication → Logs
- **Database**: Query performance at Database → Logs

---

## 🎉 Success Checklist

- [ ] Landing page deployed to Vercel
- [ ] Dashboard deployed to Vercel
- [ ] Both deployments successful
- [ ] Environment variables configured
- [ ] Navigation redirect updated
- [ ] Supabase redirect URLs added
- [ ] Landing page accessible
- [ ] Dashboard accessible
- [ ] Voice calls working
- [ ] Chat working
- [ ] Authentication working
- [ ] All tests passing
- [ ] Monitoring enabled
- [ ] Custom domains configured (optional)
- [ ] DNS propagated (if using custom domains)
- [ ] 🚀 **LIVE!**

---

## 📞 Support

### Deployment Issues

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Backend Issues

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### Project Issues

- Check: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Review: [GITHUB_VERCEL_DEPLOYMENT.md](GITHUB_VERCEL_DEPLOYMENT.md)
- Reference: [BULLETPROOF_SOLUTION_COMPLETE.md](BULLETPROOF_SOLUTION_COMPLETE.md)

---

## 🔑 Quick Reference

### Vercel Project URLs
```
Landing: https://your-app.vercel.app
Dashboard: https://your-dashboard.vercel.app
```

### GitHub Repository
```
https://github.com/YOUR_USERNAME/callwaitingai
```

### Supabase Project
```
https://bcufohulqrceytkrqpgd.supabase.co
```

### Deployment Commands
```bash
# Trigger redeploy
git commit --allow-empty -m "Trigger redeploy"
git push

# View logs
vercel logs

# Check status
vercel ls
```

---

**🎯 Your CallWaitingAI platform is now LIVE on Vercel!**

**Deployed**: Landing + Dashboard
**Status**: Production Ready ✅
**Next**: Configure custom domains and monitor performance!

---

Last Updated: 2025-10-28
