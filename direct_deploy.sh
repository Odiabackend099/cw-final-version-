#!/bin/bash
set -e

echo "Deploying functions to bcufohulqrceytkrqpgd..."

cd /workspace

for func in vapi-webhook groq-chat create-payment-link send-telegram-notification; do
  echo ""
  echo "=== Deploying $func ==="
  supabase functions deploy $func --project-ref bcufohulqrceytkrqpgd 2>&1 | tail -20
  echo "=== Done: $func ==="
  sleep 2
done

echo ""
echo "All functions deployed!"
