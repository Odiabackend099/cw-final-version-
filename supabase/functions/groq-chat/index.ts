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
    const { messages, sessionId } = await req.json();

    if (!messages || messages.length === 0) {
      throw new Error('Messages are required');
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Call Groq API for chat completion
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are Marcy, a professional and friendly AI assistant for CallWaitingAI. Your role is to help capture leads, answer questions about the platform, and provide excellent customer service. Be warm, professional, and efficient. When users show interest or ask questions, naturally ask for their contact information to better assist them.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API error:', errorData);
      throw new Error('Failed to get AI response');
    }

    const groqData = await groqResponse.json();
    const assistantMessage = groqData.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

    // Save assistant message to database
    if (sessionId) {
      await fetch(`${supabaseUrl}/rest/v1/chat_messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          sender_type: 'assistant',
          message_text: assistantMessage,
          message_type: 'text',
          metadata: { model: 'groq-llama-3.3-70b' }
        })
      });

      // Attempt to extract lead information from conversation
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const emailMatch = lastUserMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = lastUserMessage.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/);
      
      // If email or phone detected, check if we should create a lead
      if (emailMatch || phoneMatch) {
        // Check if lead already exists for this session
        const existingLeadResponse = await fetch(
          `${supabaseUrl}/rest/v1/leads?metadata->>session_id=eq.${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const existingLeads = await existingLeadResponse.json();
        
        if (!existingLeads || existingLeads.length === 0) {
          // Create new lead from chat
          await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              full_name: 'Chat Widget Lead',
              email: emailMatch ? emailMatch[0] : null,
              phone_number: phoneMatch ? phoneMatch[0] : null,
              source: 'chat_widget',
              status: 'new',
              message: lastUserMessage.substring(0, 500),
              metadata: {
                session_id: sessionId,
                ai_model: 'groq-llama-3.3-70b'
              }
            })
          });

          // Send Telegram notification
          try {
            await fetch(`${supabaseUrl}/functions/v1/send-telegram-notification`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `New Chat Lead\nEmail: ${emailMatch ? emailMatch[0] : 'N/A'}\nPhone: ${phoneMatch ? phoneMatch[0] : 'N/A'}\nMessage: ${lastUserMessage.substring(0, 200)}`,
                type: 'new_lead'
              })
            });
          } catch (notifError) {
            console.error('Notification error:', notifError);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      data: {
        message: assistantMessage,
        model: 'groq-llama-3.3-70b-versatile'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Groq chat error:', error);
    
    return new Response(JSON.stringify({
      error: {
        code: 'CHAT_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
