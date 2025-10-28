#!/bin/bash

# New backend credentials
PROJECT_REF="bcufohulqrceytkrqpgd"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20"
ACCESS_TOKEN="sbp_oauth_0653a5c3132cf7c582f16ee7d0f4cecb2edf2f07"

echo "Deploying edge functions to NEW backend: $PROJECT_REF"
echo "======================================================="

# Deploy each function using Supabase CLI with project reference
functions=("vapi-webhook" "groq-chat" "create-payment-link" "send-telegram-notification")

for func in "${functions[@]}"; do
    echo ""
    echo "Deploying $func..."
    cd /workspace
    
    # Use supabase CLI with project-ref flag
    supabase functions deploy $func \
        --project-ref $PROJECT_REF \
        --no-verify-jwt \
        2>&1 | tee -a /tmp/deploy_$func.log
    
    if [ $? -eq 0 ]; then
        echo "✓ $func deployed successfully"
    else
        echo "✗ $func deployment failed (see /tmp/deploy_$func.log)"
    fi
done

echo ""
echo "======================================================="
echo "Deployment complete!"
