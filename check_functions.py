import requests

PROJECT_REF = 'bcufohulqrceytkrqpgd'
ACCESS_TOKEN = 'sbp_oauth_0653a5c3132cf7c582f16ee7d0f4cecb2edf2f07'

print("Checking deployed functions on new backend...")
print("=" * 60)

url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/functions"
headers = {'Authorization': f'Bearer {ACCESS_TOKEN}'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        functions = response.json()
        print(f"\nFound {len(functions)} functions:")
        for func in functions:
            print(f"\n  ✓ {func.get('slug', 'unknown')}")
            print(f"    Status: {func.get('status', 'unknown')}")
            print(f"    URL: https://{PROJECT_REF}.supabase.co/functions/v1/{func.get('slug', 'unknown')}")
    else:
        print(f"Failed to list functions: {response.status_code}")
        print(response.text[:500])
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 60)
