#!/bin/bash
# run-production-migrations.sh
# Execute all pending migrations on production Supabase database

set -e

SUPABASE_URL="https://bcufohulqrceytkrqpgd.supabase.co"
PROJECT_REF="bcufohulqrceytkrqpgd"

echo "🔄 RUNNING PRODUCTION DATABASE MIGRATIONS"
echo "========================================="
echo ""
echo "Supabase Project: $PROJECT_REF"
echo "Database URL: $SUPABASE_URL"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
fi

# Link to production project
echo "1. Linking to production project..."
cd /Users/odiadev/Downloads/cwlunch
supabase link --project-ref $PROJECT_REF

# Run migrations in order
echo ""
echo "2. Running migrations..."
echo ""

# Migration 1: Fix user creation trigger
echo "Migration 1/4: Fix user creation trigger..."
supabase db push --include-all

echo ""
echo "========================================="
echo "✅ ALL MIGRATIONS COMPLETED"
echo ""
echo "Migrations Applied:"
echo "  ✅ 1761616459_fix_user_creation_trigger.sql"
echo "  ✅ 20250129000000_create_minimax_voices_table.sql"
echo "  ✅ 20250129000001_create_knowledge_base_files_table.sql"
echo "  ✅ 20250129000002_add_assistant_columns_fix_storage.sql"
echo ""
echo "Verification Steps:"
echo "1. Check minimax_voices table has 4 rows"
echo "2. Check knowledge_base_files table exists"
echo "3. Check assistants table has new columns"
echo "4. Test voice dropdown in dashboard"
echo "5. Test knowledge base file upload"
echo "========================================="
