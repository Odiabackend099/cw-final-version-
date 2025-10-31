# TestSprite Tier-Based Testing Guide

This guide explains how to use TestSprite to test subscription tier functionality with the upgraded test users.

## 📋 Overview

TestSprite can now test core functionalities with users at different subscription tiers:
- **Free Tier** (`free@test.com`) - Basic features only
- **Pro Tier** (`pro@test.com`) - Minimax TTS access ($80 payment)
- **ProMax Tier** (`promax@test.com`) - Full feature access ($180 payment)

## 🔐 Test User Credentials

All test users are configured in `callwaitingai-landing/testsprite_tests/test-credentials.json`:

```json
{
  "free_tier": {
    "email": "free@test.com",
    "password": "TestFree123!",
    "user_id": "e42cc6d0-bf87-4a53-b445-7cf5ee0076b0",
    "expected_tier": "free"
  },
  "pro_tier": {
    "email": "pro@test.com",
    "password": "TestPro123!",
    "user_id": "34a3c6db-1aa3-41fa-b1f3-7fbc06e83aeb",
    "expected_tier": "pro"
  },
  "promax_tier": {
    "email": "promax@test.com",
    "password": "TestPromax123!",
    "user_id": "89d039d4-53b6-4a62-8a64-cfddaffee0f0",
    "expected_tier": "promax"
  }
}
```

## 🧪 Tier-Specific Test Cases

### Test Case Categories

1. **TIER001 - TIER009**: Tier-specific test cases in `tier-specific-test-cases.json`
   - Free tier restrictions
   - Pro tier Minimax TTS access
   - ProMax tier full access
   - Tier detection verification
   - Feature gating
   - Payment record verification

### Key Test Scenarios

#### 1. Free Tier Testing (TIER001)
- ✅ No Minimax TTS access
- ✅ Default Vapi voices only
- ✅ Can initiate test calls with default voice
- ✅ `getUserTier()` returns 'free'

#### 2. Pro Tier Testing (TIER002)
- ✅ Minimax TTS access enabled
- ✅ `canUseMinimaxTTS()` returns true
- ✅ Can configure agent with Minimax voice
- ✅ Can initiate test calls with Minimax TTS

#### 3. ProMax Tier Testing (TIER003)
- ✅ All features available
- ✅ Minimax TTS fully functional
- ✅ `getUserTier()` returns 'promax'
- ✅ `isPaidTier()` returns true

## 🚀 Running Tests

### 1. Verify Tier Detection First

Before running TestSprite tests, verify tier detection is working:

```bash
export SUPABASE_SERVICE_ROLE_KEY="your-key"
node verify-tier-detection.js
```

Expected output:
```
🔍 Verifying Tier Detection Logic...

📧 Testing: free@test.com
   Detected Tier: FREE ✅
   
📧 Testing: pro@test.com
   Detected Tier: PRO ✅
   
📧 Testing: promax@test.com
   Detected Tier: PROMAX ✅

🎉 All tier detections are correct!
```

### 2. Run TestSprite Tests

TestSprite will use the test credentials automatically when configured. The main test plan includes tier-based scenarios:

**High Priority Tests:**
- TC010: Voice Call Testing for Paid Tier with Minimax TTS
- TC012: Subscription Tier Upgrade Unlocks Premium Features
- TIER001-TIER009: Comprehensive tier-specific tests

### 3. Manual Testing Checklist

Before running automated tests, verify:

- [ ] All test users can log in successfully
- [ ] Tier detection works (`getUserTier()`)
- [ ] Payment records exist for pro/promax users
- [ ] Free user has no payment record
- [ ] Minimax TTS is accessible for paid tiers
- [ ] Free tier is restricted from premium features

## 🔧 Test Configuration

### TestSprite Configuration

The test plan (`testsprite_frontend_test_plan.json`) includes:

1. **Standard Functional Tests (TC001-TC021)**
   - User authentication
   - Agent setup
   - Voice call testing
   - Dashboard functionality

2. **Tier-Specific Tests (TIER001-TIER009)**
   - Tier access control
   - Feature gating
   - Payment verification
   - Tier detection logic

### Test Execution Order

Recommended test execution order:

1. **Setup Phase**
   - Verify test users exist
   - Run `verify-tier-detection.js`
   - Ensure payment records are correct

2. **Authentication Tests**
   - TC002: User Login (test with all tier users)
   - Verify users can access dashboard

3. **Tier Detection Tests**
   - TIER004: Payment Amount Mapping
   - TIER009: Payment Record Verification

4. **Feature Access Tests**
   - TIER001: Free Tier Restrictions
   - TIER002: Pro Tier Access
   - TIER003: ProMax Tier Access

5. **Integration Tests**
   - TC010: Voice Call Testing (Paid Tier)
   - TIER007: Voice Call Testing - Tier Restrictions

6. **End-to-End Tests**
   - TC021: Complete User Workflow
   - TIER006: Tier Upgrade Flow

## 📊 Expected Test Results

### Free Tier User (`free@test.com`)
- ✅ Can login and access dashboard
- ✅ Can create agent with default voice
- ✅ Can initiate test calls
- ❌ Cannot access Minimax TTS
- ❌ `canUseMinimaxTTS()` returns false

### Pro Tier User (`pro@test.com`)
- ✅ Can login and access dashboard
- ✅ Can create agent with Minimax TTS
- ✅ Can initiate test calls with Minimax voice
- ✅ `canUseMinimaxTTS()` returns true
- ✅ `getUserTier()` returns 'pro'

### ProMax Tier User (`promax@test.com`)
- ✅ Can login and access dashboard
- ✅ Full access to all features
- ✅ Can use all Minimax TTS voices
- ✅ `getUserTier()` returns 'promax'
- ✅ `isPaidTier()` returns true

## 🐛 Troubleshooting

### Issue: Tier Detection Returns Wrong Tier

**Solution:**
1. Run `verify-tier-detection.js` to check payment records
2. Verify payment status is 'successful' (not 'pending')
3. Check payment amounts match tier thresholds:
   - Pro: $80+
   - ProMax: $180+
4. Ensure `userTier.ts` uses correct column name ('status' not 'payment_status')

### Issue: Test Users Cannot Login

**Solution:**
1. Verify email addresses are correct in test-credentials.json
2. Check if passwords are correct (they may need reset)
3. Ensure users exist in Supabase Auth dashboard
4. Verify email confirmation status

### Issue: Minimax TTS Not Accessible for Paid Tiers

**Solution:**
1. Verify payment records exist and are 'successful'
2. Run tier verification script
3. Check `canUseMinimaxTTS()` function logic
4. Verify agent setup page checks tier correctly

### Issue: Payment Records Not Found

**Solution:**
1. Run `upgrade-test-users.js` to create payment records
2. Verify script completed successfully
3. Check payments table has records with correct user_ids
4. Ensure payment status column is 'status' (not 'payment_status')

## 📝 Maintenance

### Updating Test Users

If test users need to be recreated or passwords changed:

1. **Create Users:**
   ```bash
   node create-test-users.js
   ```

2. **Upgrade Users:**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your-key"
   node upgrade-test-users.js
   ```

3. **Verify Setup:**
   ```bash
   node verify-tier-detection.js
   ```

### Adding New Tier Tests

To add new tier-specific tests:

1. Add test case to `tier-specific-test-cases.json`
2. Follow naming convention: `TIER###`
3. Include user tier, test user credentials, and steps
4. Update test execution documentation

## 🔗 Related Files

- `test-credentials.json` - Test user credentials
- `tier-specific-test-cases.json` - Tier test cases
- `testsprite_frontend_test_plan.json` - Main test plan
- `verify-tier-detection.js` - Tier verification script
- `upgrade-test-users.js` - User upgrade script
- `callwaitingai-landing/src/lib/userTier.ts` - Tier detection logic

## ✅ Success Criteria

Tests are successful when:

1. ✅ All tier detections return correct values
2. ✅ Free tier users are restricted from premium features
3. ✅ Paid tier users can access Minimax TTS
4. ✅ Payment records are correctly mapped to tiers
5. ✅ Feature gating works on all relevant pages
6. ✅ Voice call testing respects tier restrictions

## 📞 Support

If tests fail:
1. Check this guide's troubleshooting section
2. Run verification scripts
3. Check Supabase dashboard for payment records
4. Verify test user credentials are correct

---

**Last Updated:** After test user upgrade completion
**Status:** ✅ Ready for TestSprite testing

