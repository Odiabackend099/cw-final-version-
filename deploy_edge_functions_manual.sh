#!/bin/bash
# Manual Deployment Script for Edge Functions
# Run this script with an account that has access to project bcufohulqrceytkrqpgd

set -e

PROJECT_REF="bcufohulqrceytkrqpgd"

echo "========================================="
echo "CallWaitingAI Edge Functions Deployment"
echo "Target Project: $PROJECT_REF"
echo "========================================="
echo ""

# Check if logged into Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged into Supabase CLI"
    echo "Please run: supabase login"
    exit 1
fi

echo "✓ Supabase CLI authenticated"
echo ""

# Deploy each function
functions=("vapi-webhook" "groq-chat" "create-payment-link" "send-telegram-notification")

for func in "${functions[@]}"; do
    echo "Deploying $func..."
    if supabase functions deploy "$func" --project-ref "$PROJECT_REF" --no-verify-jwt; then
        echo "✓ $func deployed successfully"
    else
        echo "✗ $func deployment failed"
    fi
    echo ""
done

echo "========================================="
echo "Deployment Complete!"
echo ""
echo "Next Steps:"
echo "1. Configure secrets in Supabase Dashboard"
echo "2. Test each function"
echo "3. Update Vapi webhook URL"
echo "========================================="
