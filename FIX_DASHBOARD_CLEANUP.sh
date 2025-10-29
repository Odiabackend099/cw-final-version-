#!/bin/bash
# FIX_DASHBOARD_CLEANUP.sh
# Delete all conflicting, unnecessary files and fix dashboard deployment

set -e

echo "🔥 CLEANING UP CONFLICTING FILES"
echo "================================="
echo ""

# Kill all running Vercel deployments
echo "1. Killing all running Vercel background deployments..."
pkill -f "vercel --token" || true
sleep 2
echo "✅ All Vercel processes killed"
echo ""

# Delete all unnecessary markdown documentation files in root
echo "2. Deleting unnecessary documentation files..."
rm -f ADVANCED_CHAT_WIDGET_DEPLOYED.md
rm -f BULLETPROOF_SOLUTION_COMPLETE.md
rm -f DEPLOYMENT_CHECKLIST.md
rm -f DEPLOYMENT_SUCCESS.md
rm -f GITHUB_PUSH_SUCCESS.md
rm -f GITHUB_VERCEL_DEPLOYED.md
rm -f GITHUB_VERCEL_DEPLOYMENT.md
rm -f PRODUCTION_LIVE.md
rm -f READY_FOR_DEPLOYMENT.md
rm -f VERCEL_DEPLOYMENT.md
rm -f VERCEL_DEPLOY_NOW.md
echo "✅ Documentation files deleted"
echo ""

# Delete old migration/deployment scripts
echo "3. Deleting old migration and deployment scripts..."
rm -f check_functions.py
rm -f check_new_backend.sh
rm -f check_schema.js
rm -f deploy_edge_functions_manual.sh
rm -f deploy_functions.py
rm -f deploy_functions_new_backend.sh
rm -f deploy_to_new_backend.js
rm -f direct_deploy.sh
rm -f execute_migration.js
rm -f migrate_to_new_backend.sql
rm -f query_tables.js
rm -f run_migration.mjs
echo "✅ Old scripts deleted"
echo ""

# Delete user_input_files directory (not needed in production)
echo "4. Deleting user_input_files directory..."
rm -rf user_input_files
echo "✅ user_input_files deleted"
echo ""

# Delete docs directory (not needed in production)
echo "5. Deleting docs directory..."
rm -rf docs
echo "✅ docs deleted"
echo ""

# Check for duplicate App.tsx or conflicting route files
echo "6. Checking for duplicate or conflicting files..."

# Check if there are multiple App.tsx files
APP_COUNT=$(find . -name "App.tsx" -type f | wc -l | tr -d ' ')
echo "   Found $APP_COUNT App.tsx files"

if [ "$APP_COUNT" -gt 1 ]; then
    echo "   ⚠️  WARNING: Multiple App.tsx files found:"
    find . -name "App.tsx" -type f
fi
echo ""

# Clean up Vercel cache and rebuild
echo "7. Cleaning dashboard build artifacts..."
cd frontend/callwaitingai-frontend
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Build cache cleaned"
echo ""

echo "8. Rebuilding dashboard..."
pnpm build
echo "✅ Dashboard rebuilt"
echo ""

# Go back to root
cd ../..

echo "================================="
echo "✅ CLEANUP COMPLETE"
echo ""
echo "Files Deleted:"
echo "  ✅ 11 unnecessary .md documentation files"
echo "  ✅ 12 old migration/deployment scripts"
echo "  ✅ user_input_files directory"
echo "  ✅ docs directory"
echo "  ✅ All Vercel background processes killed"
echo "  ✅ Dashboard build cache cleaned and rebuilt"
echo ""
echo "Next Step: Deploy clean dashboard"
echo "================================="
