#!/bin/bash
# Query new Supabase backend to check existing tables

NEW_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20"

# Check what tables exist
curl -X POST \
  "https://bcufohulqrceytkrqpgd.supabase.co/rest/v1/rpc/exec" \
  -H "apikey: $NEW_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $NEW_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT tablename FROM pg_tables WHERE schemaname = '"'"'public'"'"' ORDER BY tablename;"}'

# Also try direct query to information_schema
curl -s -X POST \
  "https://bcufohulqrceytkrqpgd.supabase.co/rest/v1/rpc" \
  -H "apikey: $NEW_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $NEW_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"

