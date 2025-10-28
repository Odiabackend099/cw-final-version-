const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'bcufohulqrceytkrqpgd';
const ACCESS_TOKEN = 'sbp_oauth_0653a5c3132cf7c582f16ee7d0f4cecb2edf2f07';

const functions = [
  { slug: 'vapi-webhook', path: '/workspace/supabase/functions/vapi-webhook/index.ts' },
  { slug: 'groq-chat', path: '/workspace/supabase/functions/groq-chat/index.ts' },
  { slug: 'create-payment-link', path: '/workspace/supabase/functions/create-payment-link/index.ts' },
  { slug: 'send-telegram-notification', path: '/workspace/supabase/functions/send-telegram-notification/index.ts' }
];

async function deployFunction(func) {
  try {
    console.log(`\nDeploying ${func.slug}...`);
    
    const code = fs.readFileSync(func.path, 'utf8');
    
    // Use Supabase Management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/${func.slug}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slug: func.slug,
          name: func.slug,
          body: code,
          verify_jwt: false
        })
      }
    );
    
    const responseText = await response.text();
    console.log(`Response (${response.status}):`, responseText.substring(0, 200));
    
    if (response.ok || response.status === 201) {
      console.log(`✓ ${func.slug} deployed successfully!`);
      return true;
    } else {
      console.log(`✗ ${func.slug} deployment failed`);
      return false;
    }
  } catch (error) {
    console.error(`Error deploying ${func.slug}:`, error.message);
    return false;
  }
}

async function deployAll() {
  console.log('========================================');
  console.log('Deploying Edge Functions to NEW Backend');
  console.log(`Project: ${PROJECT_REF}`);
  console.log('========================================');
  
  let successCount = 0;
  
  for (const func of functions) {
    const success = await deployFunction(func);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n========================================');
  console.log(`Deployment Summary: ${successCount}/${functions.length} successful`);
  console.log('========================================\n');
}

deployAll();
