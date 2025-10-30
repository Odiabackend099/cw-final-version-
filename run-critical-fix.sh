#!/bin/bash
# run-critical-fix.sh
# Execute ONLY the critical system_prompt fix on production database

set -e

PROJECT_REF="bcufohulqrceytkrqpgd"

echo "🔄 RUNNING CRITICAL DATABASE FIX"
echo "================================"
echo ""
echo "Supabase Project: $PROJECT_REF"
echo ""

# Run the SQL fix directly
echo "Executing RUN_THIS_NOW.sql..."
supabase db execute --project-ref $PROJECT_REF --file /Users/odiadev/Downloads/cwlunch/RUN_THIS_NOW.sql

echo ""
echo "================================"
echo "✅ CRITICAL FIX COMPLETED"
echo ""
echo "Verification:"
echo "1. system_prompt column should exist"
echo "2. user_id should be NOT NULL"
echo "3. No orphaned assistants"
echo ""
echo "Next: Test Agent Setup page at https://callwaitingai.dev/agent-setup"
echo "================================"
