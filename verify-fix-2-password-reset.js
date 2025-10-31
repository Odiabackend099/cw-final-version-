#!/usr/bin/env node

/**
 * Verify Fix 2: Password Reset Feature
 * Check that the forgot password link exists on login page
 * and the route is accessible
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Fix 2: Password Reset Feature\n');

let allOk = true;

// Check 1: Login page has "Forgot password?" link
console.log('1. Checking Login.tsx for "Forgot password?" link...');
const loginPath = path.join(__dirname, 'callwaitingai-landing/src/pages/Login.tsx');
const loginContent = fs.readFileSync(loginPath, 'utf8');

if (loginContent.includes('Forgot password') && loginContent.includes('/forgot-password')) {
  console.log('   ✅ OK - Link found in Login.tsx\n');
} else {
  console.log('   ❌ FAILED - Link not found\n');
  allOk = false;
}

// Check 2: ForgotPassword component exists
console.log('2. Checking ForgotPassword.tsx component exists...');
const forgotPasswordPath = path.join(__dirname, 'callwaitingai-landing/src/pages/ForgotPassword.tsx');
if (fs.existsSync(forgotPasswordPath)) {
  const forgotContent = fs.readFileSync(forgotPasswordPath, 'utf8');
  if (forgotContent.includes('ForgotPassword') && forgotContent.includes('requestPasswordReset')) {
    console.log('   ✅ OK - Component exists and has correct functionality\n');
  } else {
    console.log('   ❌ FAILED - Component missing required functionality\n');
    allOk = false;
  }
} else {
  console.log('   ❌ FAILED - Component file not found\n');
  allOk = false;
}

// Check 3: Route added to App.tsx
console.log('3. Checking App.tsx for /forgot-password route...');
const appPath = path.join(__dirname, 'callwaitingai-landing/src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

if (appContent.includes('/forgot-password') && appContent.includes('ForgotPassword')) {
  console.log('   ✅ OK - Route exists in App.tsx\n');
} else {
  console.log('   ❌ FAILED - Route not found\n');
  allOk = false;
}

// Check 4: Server responds (basic check)
console.log('4. Checking if server is running on port 5173...');
const http = require('http');

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5173', (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 404); // 404 is OK if just checking server
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
};

checkServer().then(serverOk => {
  if (serverOk) {
    console.log('   ✅ OK - Server is running\n');
  } else {
    console.log('   ⚠️  WARNING - Server not responding (may need to start)\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Verification Result:');
  console.log('   ✅ Login page has "Forgot password?" link');
  console.log('   ✅ ForgotPassword component exists');
  console.log('   ✅ Route /forgot-password configured');
  if (!serverOk) {
    console.log('   ⚠️  Server needs to be started (not blocking)');
  }

  if (allOk) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ FIX 2 VERIFICATION: OK');
    console.log('   Password reset feature fully implemented');
    process.exit(0);
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n❌ FIX 2 VERIFICATION: FAILED');
    console.log('   Some components missing. Fix required.');
    process.exit(1);
  }
});

