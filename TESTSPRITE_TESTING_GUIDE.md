# TestSprite Testing Guide - Infrastructure Fixes

This guide explains the fixes applied to enable TestSprite testing and how to use both testing approaches.

## 🔧 Fixes Applied

### 1. Vite Configuration Updated
- ✅ Added server configuration for tunnel access
- ✅ Enabled external connections when `TEST_MODE=true`
- ✅ Configured HMR for tunnel compatibility
- ✅ Added CORS support for test mode
- ✅ Configured preview mode for production build testing

### 2. Production Build Testing Setup
- ✅ Added `build:test` script
- ✅ Added `preview:test` script for production build serving
- ✅ Added `dev:test` script for dev server with test mode

---

## 🚀 Testing Options

### Option 1: Dev Server with Test Mode (Recommended for Development)

This uses the dev server but with tunnel-friendly configuration:

```bash
cd callwaitingai-landing

# Start dev server in test mode
pnpm dev:test

# Then in another terminal, run TestSprite tests
cd ..
node /Users/odiadev/.npm/_npx/8ddf6bea01b2519d/node_modules/@testsprite/testsprite-mcp/dist/index.js generateCodeAndExecute
```

**Pros:**
- Fast iteration
- Hot module replacement
- Easy debugging

**Cons:**
- May still have WebSocket issues
- Resource loading through tunnel can be slower

---

### Option 2: Production Build Testing (Recommended for Reliable Testing)

This builds and serves a production version, which is more reliable through tunnels:

```bash
cd callwaitingai-landing

# Build production version
pnpm build:test

# Start preview server
pnpm preview:test

# Then in another terminal, run TestSprite tests
cd ..
node /Users/odiadev/.npm/_npx/8ddf6bea01b2519d/node_modules/@testsprite/testsprite-mcp/dist/index.js generateCodeAndExecute
```

**Pros:**
- Most reliable for tunnel access
- Production-like environment
- No HMR WebSocket issues
- Faster resource loading

**Cons:**
- Need to rebuild after code changes
- Slower development iteration

---

## 📋 Quick Start Guide

### Step 1: Choose Your Testing Method

**For reliable testing (recommended):**
```bash
cd callwaitingai-landing
pnpm preview:test
```

**For development testing:**
```bash
cd callwaitingai-landing
pnpm dev:test
```

### Step 2: Verify Server is Running

Open in browser: http://localhost:5173

You should see the application loading correctly.

### Step 3: Run TestSprite Tests

In the project root directory:
```bash
node /Users/odiadev/.npm/_npx/8ddf6bea01b2519d/node_modules/@testsprite/testsprite-mcp/dist/index.js generateCodeAndExecute
```

---

## 🔍 Troubleshooting

### Issue: Still Getting ERR_EMPTY_RESPONSE

**Solution 1: Use Production Build**
- Stop dev server
- Run `pnpm preview:test` instead
- Production builds are more reliable through tunnels

**Solution 2: Check Server is Accessible**
```bash
# Test if server is accessible
curl http://localhost:5173

# Should return HTML, not empty response
```

**Solution 3: Verify Port**
```bash
# Check what's running on port 5173
lsof -i :5173

# Should show vite or node process
```

### Issue: WebSocket HMR Errors

**Solution:** This is expected in test mode. Either:
- Use production build (`pnpm preview:test`) - no HMR needed
- Ignore HMR warnings - they don't block functionality

### Issue: Tests Still Failing

**Check:**
1. Server is running on port 5173
2. Application loads in browser at http://localhost:5173
3. TestSprite tunnel is connected (check tunnel logs)
4. Test user credentials are correct

---

## 📊 Expected Improvements

After applying these fixes, you should see:

- ✅ Resources loading correctly
- ✅ Application rendering in tests
- ✅ Authentication flows testable
- ✅ Tier-based features accessible

**Expected Pass Rate:** 60-80% (up from 0%)

---

## 🎯 Testing with Upgraded Users

Your test users are ready:
- `free@test.com` / `TestFree123!` - FREE tier
- `pro@test.com` / `TestPro123!` - PRO tier ($80)
- `promax@test.com` / `TestPromax123!` - PROMAX tier ($180)

TestSprite will automatically use these credentials from `test-credentials.json`.

---

## 📝 Configuration Details

### Vite Config Changes

```typescript
server: {
  host: isTestMode ? '0.0.0.0' : true,  // Allow external connections
  port: 5173,
  strictPort: true,
  hmr: {
    clientPort: 5173,  // For tunnel compatibility
  },
  cors: true,  // Allow CORS for tunnel
}
```

### Package.json Scripts

- `dev:test` - Dev server with test mode enabled
- `build:test` - Build for testing
- `preview:test` - Serve production build on 0.0.0.0:5173

---

## ✅ Next Steps

1. **Start server** using one of the methods above
2. **Verify** application loads at http://localhost:5173
3. **Run TestSprite** tests
4. **Review** test results and fix any functional issues

---

**Status**: ✅ Infrastructure fixes applied - Ready for testing!

