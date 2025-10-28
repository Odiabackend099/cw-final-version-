import requests
import json
import os
import time

PROJECT_REF = 'bcufohulqrceytkrqpgd'
ACCESS_TOKEN = 'sbp_oauth_0653a5c3132cf7c582f16ee7d0f4cecb2edf2f07'

functions = [
    {'slug': 'vapi-webhook', 'path': 'supabase/functions/vapi-webhook/index.ts'},
    {'slug': 'groq-chat', 'path': 'supabase/functions/groq-chat/index.ts'},
    {'slug': 'create-payment-link', 'path': 'supabase/functions/create-payment-link/index.ts'},
    {'slug': 'send-telegram-notification', 'path': 'supabase/functions/send-telegram-notification/index.ts'}
]

print("=" * 60)
print(f"Deploying Edge Functions to NEW Backend: {PROJECT_REF}")
print("=" * 60)

success_count = 0

for func in functions:
    print(f"\n[{func['slug']}] Reading function code...")
    
    try:
        with open(func['path'], 'r') as f:
            code = f.read()
        
        print(f"[{func['slug']}] Code loaded ({len(code)} bytes)")
        print(f"[{func['slug']}] Deploying via Supabase Management API...")
        
        # Try to deploy using Management API
        url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/functions/{func['slug']}"
        
        headers = {
            'Authorization': f'Bearer {ACCESS_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'slug': func['slug'],
            'name': func['slug'],
            'body': code,
            'verify_jwt': False
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"[{func['slug']}] Response: {response.status_code}")
        
        if response.status_code in [200, 201, 204]:
            print(f"✓ [{func['slug']}] Deployed successfully!")
            success_count += 1
        else:
            print(f"✗ [{func['slug']}] Failed: {response.text[:300]}")
            
        time.sleep(1)
            
    except Exception as e:
        print(f"✗ [{func['slug']}] Error: {str(e)}")

print("\n" + "=" * 60)
print(f"Deployment Summary: {success_count}/{len(functions)} successful")
print("=" * 60)
