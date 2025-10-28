Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { leadId, message, type } = await req.json();

    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Fetch lead details if leadId provided
    let leadDetails = null;
    if (leadId) {
      const leadResponse = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (leadResponse.ok) {
        const leads = await leadResponse.json();
        leadDetails = leads[0];
      }
    }

    // Format notification message
    let notificationText = '';
    
    if (type === 'new_lead' && leadDetails) {
      notificationText = `New Lead Alert\n\n` +
        `Name: ${leadDetails.full_name}\n` +
        `Email: ${leadDetails.email || 'N/A'}\n` +
        `Phone: ${leadDetails.phone_number || 'N/A'}\n` +
        `Source: ${leadDetails.source}\n` +
        `Message: ${leadDetails.message || 'N/A'}\n\n` +
        `Created: ${new Date(leadDetails.created_at).toLocaleString()}`;
    } else {
      notificationText = message || 'New notification from CallWaitingAI';
    }

    // Send Telegram notification if configured
    if (telegramBotToken && telegramChatId) {
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: notificationText,
          parse_mode: 'HTML'
        })
      });

      if (!telegramResponse.ok) {
        console.error('Failed to send Telegram notification');
      }
    } else {
      console.log('Telegram not configured - notification skipped:', notificationText);
    }

    return new Response(JSON.stringify({
      data: {
        success: true,
        message: 'Notification processed'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Telegram notification error:', error);
    
    return new Response(JSON.stringify({
      error: {
        code: 'NOTIFICATION_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
