# TestSprite Automated Testing Workflow

This document outlines the automated testing workflow for TestSprite with tier-based functionality testing.

## 🔄 Workflow Overview

```
┌─────────────────────┐
│  1. Setup Phase     │
│  - Verify Users     │
│  - Check Payments   │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│  2. Tier Detection  │
│  - Run Verification │
│  - Validate Logic   │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│  3. Run Tests       │
│  - Functional Tests  │
│  - Tier Tests       │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│  4. Report Results  │
│  - Test Reports     │
│  - Failures         │
└─────────────────────┘
```

## 📋 Pre-Test Setup Checklist

Before running TestSprite tests, ensure:

- [ ] **Test Users Exist**
  ```bash
  # Verify in Supabase Auth dashboard
  # free@test.com, pro@test.com, promax@test.com
  ```

- [ ] **Payment Records Created**
  ```bash
  export SUPABASE_SERVICE_ROLE_KEY="your-key"
  node upgrade-test-users.js
  ```

- [ ] **Tier Detection Verified**
  ```bash
  node verify-tier-detection.js
  # Should show: ✅ Passed: 3/3
  ```

- [ ] **Test Credentials Updated**
  - Check `callwaitingai-landing/testsprite_tests/test-credentials.json`
  - Verify passwords are correct
  - Confirm user IDs match

## 🚀 Automated Test Execution

### Option 1: Full Test Suite

Run all tests including tier-specific tests:

```bash
# TestSprite will use:
# - testsprite_frontend_test_plan.json (main tests)
# - tier-specific-test-cases.json (tier tests)
# - test-credentials.json (user credentials)
```

### Option 2: Tier-Specific Tests Only

Run only tier-based tests:

```bash
# Configure TestSprite to run:
# - TIER001 through TIER009
# - Use tier-specific-test-cases.json
```

### Option 3: Incremental Testing

Run tests by category:

1. **Authentication Tests** (TC001-TC004)
   - User signup
   - Login with all tier users
   - Password reset

2. **Tier Detection Tests** (TIER004, TIER009)
   - Payment record verification
   - Tier mapping validation

3. **Feature Access Tests** (TIER001-TIER003, TIER005)
   - Free tier restrictions
   - Pro tier access
   - ProMax tier full access

4. **Integration Tests** (TC010, TIER007)
   - Voice call testing
   - Minimax TTS integration

## 🔧 TestSprite Configuration

### Recommended Test Configuration

```json
{
  "test_suite": "tier-based-testing",
  "base_url": "https://callwaitingai-landing-9t9w4vkvi-odia-backends-projects.vercel.app",
  "test_plans": [
    "testsprite_frontend_test_plan.json",
    "tier-specific-test-cases.json"
  ],
  "credentials_file": "callwaitingai-landing/testsprite_tests/test-credentials.json",
  "parallel_execution": false,
  "retry_failed_tests": true,
  "max_retries": 2
}
```

### Test Execution Order

1. **Prerequisites**
   - Run verification scripts
   - Ensure all test users are ready

2. **Basic Functionality**
   - TC001: User Signup
   - TC002: User Login (all tiers)
   - TC005: Agent Setup

3. **Tier Detection**
   - TIER004: Payment Amount Mapping
   - TIER009: Payment Record Verification

4. **Feature Access**
   - TIER001: Free Tier Restrictions
   - TIER002: Pro Tier Access
   - TIER003: ProMax Tier Access
   - TIER005: Tier-Based Feature Gating

5. **Integration**
   - TC010: Voice Call Testing (Paid Tier)
   - TIER007: Voice Call Testing - Tier Restrictions

6. **End-to-End**
   - TC021: Complete User Workflow
   - TIER006: Tier Upgrade Flow

## 📊 Expected Test Results Matrix

| Test ID | Test Name | Free Tier | Pro Tier | ProMax Tier |
|---------|-----------|-----------|----------|-------------|
| TIER001 | Free Tier Restrictions | ✅ Pass | N/A | N/A |
| TIER002 | Pro Tier Access | N/A | ✅ Pass | N/A |
| TIER003 | ProMax Tier Access | N/A | N/A | ✅ Pass |
| TIER004 | Tier Detection | ✅ Pass | ✅ Pass | ✅ Pass |
| TC010 | Voice Call (Paid) | ❌ Skip | ✅ Pass | ✅ Pass |
| TIER007 | Voice Call Restrictions | ✅ Pass | ✅ Pass | ✅ Pass |

## 🔍 Monitoring and Debugging

### Real-Time Monitoring

During test execution, monitor:

1. **Tier Detection**
   - Check console logs for `getUserTier()` calls
   - Verify correct tier returned for each user

2. **Feature Access**
   - Verify UI elements show/hide correctly
   - Check Minimax TTS availability

3. **Payment Verification**
   - Query payments table after tests
   - Verify payment records unchanged

### Debug Commands

```bash
# Check tier detection
node verify-tier-detection.js

# View payment records
# Query Supabase: SELECT * FROM payments WHERE user_id IN (...)

# Verify user exists
# Check Supabase Auth dashboard
```

## 📈 Success Metrics

### Test Success Criteria

- ✅ **100% Tier Detection Accuracy**
  - All users return correct tier
  - Payment records correctly mapped

- ✅ **Feature Gating Works**
  - Free tier restricted from premium features
  - Paid tiers can access Minimax TTS

- ✅ **Authentication Works**
  - All test users can login
  - Sessions maintained correctly

- ✅ **Voice Testing Works**
  - Free tier: Default voice only
  - Paid tiers: Minimax TTS accessible

### Expected Pass Rate

- **Tier-Specific Tests**: 100% (9/9)
- **Functional Tests**: 80%+ (17/21)
- **Overall**: 85%+ (26/30)

## 🔄 Continuous Integration

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: TestSprite Tier Tests

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Verify Tier Detection
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: node verify-tier-detection.js
      
      - name: Run TestSprite Tests
        run: |
          # Configure TestSprite
          # Run test suite
          # Generate reports
```

### Scheduled Testing

Recommended schedule:
- **Hourly**: Tier detection verification
- **Every 6 hours**: Full test suite
- **Daily**: Comprehensive tier testing
- **On deploy**: Full validation

## 📝 Test Reports

### Report Generation

TestSprite generates reports including:

1. **Tier Detection Report**
   - Which users detected correctly
   - Payment record verification
   - Tier mapping accuracy

2. **Feature Access Report**
   - What features are accessible per tier
   - Feature gating validation
   - UI element visibility

3. **Integration Report**
   - Voice call testing results
   - Minimax TTS functionality
   - API endpoint responses

### Report Analysis

After test runs, review:

- ❌ Failed tests (why did they fail?)
- ⚠️ Warnings (potential issues)
- ✅ Passed tests (confirm expected behavior)
- 📊 Coverage (all tiers tested?)

## 🛠️ Maintenance Tasks

### Weekly Maintenance

1. **Verify Test Users**
   ```bash
   node verify-tier-detection.js
   ```

2. **Check Payment Records**
   - Ensure no accidental deletions
   - Verify payment amounts correct

3. **Update Test Cases**
   - Add new tier-specific scenarios
   - Update test credentials if needed

### Monthly Maintenance

1. **Review Test Results**
   - Analyze failure patterns
   - Update test cases based on findings

2. **Update Documentation**
   - Update this guide
   - Refresh troubleshooting section

3. **Optimize Test Suite**
   - Remove redundant tests
   - Add missing coverage

## 🚨 Alert Conditions

Set up alerts for:

- ❌ Tier detection failures
- ❌ Payment record missing
- ❌ Test user cannot login
- ❌ Feature gating broken
- ❌ Minimax TTS not accessible for paid tiers

## 📞 Support Resources

- **Documentation**: `TESTSPRITE_TIER_TESTING_GUIDE.md`
- **Verification Script**: `verify-tier-detection.js`
- **Upgrade Script**: `upgrade-test-users.js`
- **Test Credentials**: `callwaitingai-landing/testsprite_tests/test-credentials.json`

---

**Status**: ✅ Ready for automated testing
**Last Updated**: After test user upgrade completion

