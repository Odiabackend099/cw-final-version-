Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    const payload = await req.json();
    const eventType = payload.type || payload.event || 'unknown';

    // Log webhook event
    const webhookLogResponse = await fetch(`${supabaseUrl}/rest/v1/webhook_events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        event_type: eventType,
        payload: payload,
        source: 'vapi',
        processed: false
      })
    });

    if (!webhookLogResponse.ok) {
      console.error('Failed to log webhook event');
    }

    // Process different event types
    if (eventType === 'call.started' || eventType === 'call-started') {
      const callId = payload.call?.id || payload.callId;
      const callerPhone = payload.call?.customer?.number || payload.phoneNumber;
      
      await fetch(`${supabaseUrl}/rest/v1/call_logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vapi_call_id: callId,
          caller_phone: callerPhone,
          call_status: 'in_progress',
          call_type: 'inbound',
          started_at: new Date().toISOString(),
          metadata: payload
        })
      });
    }

    if (eventType === 'call.ended' || eventType === 'call-ended') {
      const callId = payload.call?.id || payload.callId;
      const duration = payload.call?.duration || payload.duration || 0;
      const transcript = payload.call?.transcript || payload.transcript || '';
      
      await fetch(`${supabaseUrl}/rest/v1/call_logs?vapi_call_id=eq.${callId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          call_status: 'completed',
          duration_seconds: duration,
          transcript: transcript,
          ended_at: new Date().toISOString()
        })
      });

      // Extract lead information from transcript if available
      if (transcript && transcript.length > 0) {
        // Basic extraction - can be enhanced with NLP
        const emailMatch = transcript.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = transcript.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/);
        
        if (emailMatch || phoneMatch) {
          await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              full_name: 'Voice Call Lead',
              email: emailMatch ? emailMatch[0] : null,
              phone_number: phoneMatch ? phoneMatch[0] : null,
              source: 'voice_call',
              status: 'new',
              message: transcript.substring(0, 500),
              metadata: { vapi_call_id: callId }
            })
          });
        }
      }
    }

    // Mark webhook as processed
    await fetch(`${supabaseUrl}/rest/v1/webhook_events?event_type=eq.${eventType}&payload->call->>id=eq.${payload.call?.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ processed: true })
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Vapi webhook error:', error);
    
    return new Response(JSON.stringify({
      error: {
        code: 'WEBHOOK_PROCESSING_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
