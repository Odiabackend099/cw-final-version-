#!/bin/bash
# run-critical-fix-v2.sh
# Execute ONLY the critical system_prompt fix on production database using psql

set -e

PROJECT_REF="bcufohulqrceytkrqpgd"
SQL_FILE="/Users/odiadev/Downloads/cwlunch/RUN_THIS_NOW.sql"

echo "🔄 RUNNING CRITICAL DATABASE FIX"
echo "================================"
echo ""
echo "Supabase Project: $PROJECT_REF"
echo ""

# Get database connection string
echo "Getting database connection details..."
DB_URL=$(supabase db remote get --project-ref $PROJECT_REF)

if [ -z "$DB_URL" ]; then
    echo "❌ Failed to get database URL"
    echo ""
    echo "MANUAL STEPS REQUIRED:"
    echo "1. Go to https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd/settings/database"
    echo "2. Copy the Connection String (URI)"
    echo "3. Run: psql YOUR_CONNECTION_STRING -f $SQL_FILE"
    echo ""
    echo "OR"
    echo ""
    echo "1. Go to https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd/editor"
    echo "2. Click 'SQL Editor' → 'New Query'"
    echo "3. Copy and paste the contents of $SQL_FILE"
    echo "4. Click 'Run'"
    exit 1
fi

echo "Executing SQL fix..."
psql "$DB_URL" -f "$SQL_FILE"

echo ""
echo "================================"
echo "✅ CRITICAL FIX COMPLETED"
echo ""
echo "Next: Test Agent Setup page at https://callwaitingai.dev/agent-setup"
echo "================================"
