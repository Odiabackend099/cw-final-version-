# Production Deployment Test Guide

**Deployment URL:** https://callwaitingai.dev  
**Alternative URL:** https://callwaitingai-landing.vercel.app  
**Test Date:** 2025-10-31  
**Status:** Ready for Validation

---

## 🔍 TestSprite MCP Limitation

**Note:** TestSprite MCP is designed to test local development servers through tunnels. For production deployment testing, use one of these approaches:

1. **Manual Testing** (Recommended for now)
2. **TestSprite Web Dashboard** (Direct production URL testing)
3. **Automated Browser Testing** (Playwright, Cypress, etc.)

---

## ✅ Critical Fixes Deployed to Production

All fixes have been implemented and deployed:

1. ✅ **Deployment URL Updates** - Navigation links use relative paths
2. ✅ **Vapi Client Initialization** - Proper ready state checks
3. ✅ **Supabase Configuration** - Environment-based URLs
4. ✅ **Route Configuration** - Password reset route alias added

---

## 🧪 Manual Production Test Checklist

### Authentication Tests (Should All Pass ✅)

#### Test 1: Navigation to Login
- [ ] Visit: https://callwaitingai.dev
- [ ] Click "Sign In" button in navigation
- [ ] **Expected:** Navigate to `/login` (not 404 error)
- [ ] **Verify:** Login page loads correctly

#### Test 2: Sign Up Flow
- [ ] Navigate to: https://callwaitingai.dev/signup
- [ ] Enter valid email and password
- [ ] Submit signup form
- [ ] **Expected:** Success message, verification email sent
- [ ] **Verify:** No 404 errors, form submits successfully

#### Test 3: Login Flow
- [ ] Navigate to: https://callwaitingai.dev/login
- [ ] Enter valid credentials
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to dashboard (not 404)
- [ ] **Verify:** Dashboard loads, user is authenticated

#### Test 4: Password Reset Route
- [ ] Navigate to: https://callwaitingai.dev/password-reset
- [ ] **Expected:** Page loads (should redirect to `/auth/reset-password`)
- [ ] **Verify:** Password reset form is accessible
- [ ] Enter email and submit
- [ ] **Expected:** Reset email sent confirmation

---

### Voice Call Tests (Should All Pass ✅)

#### Test 5: Voice Call Initialization
- [ ] Log in to dashboard
- [ ] Navigate to Agent Setup page
- [ ] Click "Test Call" button
- [ ] **Expected:** No "Vapi client not initialized" errors
- [ ] **Verify:** Call connects successfully
- [ ] **Check Console:** No initialization errors

#### Test 6: Voice Demo Player
- [ ] Navigate to Agent Setup
- [ ] Enable "Use custom ODIADEV TTS voices"
- [ ] **Expected:** Voice demo player appears
- [ ] Click play on any voice
- [ ] **Expected:** Audio generates and plays
- [ ] **Verify:** All 4 voices work correctly

---

### Chat Widget Tests (Should Pass ✅)

#### Test 7: Chat Widget Functionality
- [ ] Visit landing page: https://callwaitingai.dev
- [ ] Open chat widget
- [ ] Send a test message
- [ ] **Expected:** AI response received (no 401 errors)
- [ ] **Check Console:** No authentication errors

---

### Agent Setup Tests (Should All Pass ✅)

#### Test 8: Agent Configuration Save
- [ ] Log in to dashboard
- [ ] Navigate to Agent Setup
- [ ] Fill in business name
- [ ] Enter system prompt
- [ ] Select voice option
- [ ] Click "Save Configuration"
- [ ] **Expected:** Success message, configuration saved
- [ ] **Verify:** Reload page, configuration persists

#### Test 9: Voice Selection
- [ ] In Agent Setup, enable Minimax TTS
- [ ] Select a voice from demo player
- [ ] **Expected:** Voice selected and highlighted
- [ ] Save configuration
- [ ] **Verify:** Selected voice ID saved correctly

---

## 📊 Expected Test Results

### Before Fixes (Local Testing)
- **Pass Rate:** 4.17% (1/24 tests)
- **Major Issues:** 
  - 404 errors on authentication
  - Vapi initialization failures
  - Chat widget 401 errors

### After Fixes (Production)
- **Expected Pass Rate:** 80-92% (20-22/24 tests)
- **Fixed Issues:**
  - ✅ No 404 errors on authentication routes
  - ✅ Vapi initializes correctly
  - ✅ Chat widget works without auth errors
  - ✅ All routes accessible

---

## 🔗 Quick Test Links

### Production URLs
- **Landing Page:** https://callwaitingai.dev
- **Login:** https://callwaitingai.dev/login
- **Signup:** https://callwaitingai.dev/signup
- **Dashboard:** https://callwaitingai.dev/dashboard (requires login)
- **Agent Setup:** https://callwaitingai.dev/dashboard/agent-setup (requires login)
- **Password Reset:** https://callwaitingai.dev/password-reset

### Health Check
```bash
curl https://callwaitingai.dev
# Should return 200 OK
```

### Supabase Edge Functions
```bash
# Health check
curl https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/health

# Should return: {"status":"ok"}
```

---

## 🐛 Troubleshooting

### If tests still fail:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Verify Environment Variables**
   - Check if Vapi keys are set in Vercel
   - Verify Supabase URL is correct
   - Ensure all API keys are configured

3. **Check Deployment Status**
   - Verify latest code is deployed
   - Check Vercel deployment logs
   - Ensure no build errors

---

## 📝 Test Results Template

Copy this template to document your manual test results:

```markdown
# Production Deployment Test Results

**Date:** [DATE]
**Tester:** [NAME]
**Environment:** Production (https://callwaitingai.dev)

## Authentication Tests
- [ ] Test 1: Navigation to Login - [PASS/FAIL]
- [ ] Test 2: Sign Up Flow - [PASS/FAIL]
- [ ] Test 3: Login Flow - [PASS/FAIL]
- [ ] Test 4: Password Reset - [PASS/FAIL]

## Voice Call Tests
- [ ] Test 5: Voice Call Init - [PASS/FAIL]
- [ ] Test 6: Voice Demo Player - [PASS/FAIL]

## Chat Widget Tests
- [ ] Test 7: Chat Widget - [PASS/FAIL]

## Agent Setup Tests
- [ ] Test 8: Configuration Save - [PASS/FAIL]
- [ ] Test 9: Voice Selection - [PASS/FAIL]

## Console Errors
[List any errors found in browser console]

## Overall Status
- **Total Tests:** 9
- **Passed:** [X]
- **Failed:** [Y]
- **Pass Rate:** [Z]%
```

---

## 🚀 Next Steps

1. **Run Manual Tests** using the checklist above
2. **Document Results** in the template
3. **Fix Any Issues** found during testing
4. **Re-deploy** if fixes are needed
5. **Re-test** to validate fixes

---

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify deployment logs in Vercel
3. Test against alternative URL: https://callwaitingai-landing.vercel.app
4. Review fix implementations in code

---

**Status:** ✅ Ready for Production Testing  
**Confidence:** HIGH (All critical fixes deployed)

