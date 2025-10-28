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
    const { amount, currency, email, planType, userId } = await req.json();

    if (!amount || !email) {
      throw new Error('Amount and email are required');
    }

    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    const flutterwaveEncKey = Deno.env.get('FLUTTERWAVE_ENCRYPTION_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Generate unique transaction reference
    const txRef = `CW-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const origin = req.headers.get('origin') || 'https://callwaitingai.com';

    // Create payment link with Flutterwave
    let paymentLink = null;
    let flutterwaveStatus = 'configured';
    
    if (flutterwaveSecretKey) {
      try {
        const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tx_ref: txRef,
            amount: amount,
            currency: currency || 'USD',
            redirect_url: `${origin}/payment/callback`,
            customer: {
              email: email,
              name: email.split('@')[0]
            },
            customizations: {
              title: 'CallWaitingAI Subscription',
              description: `${planType || 'Subscription'} plan payment`,
              logo: `${origin}/logo.jpeg`
            },
            meta: {
              consumer_id: userId,
              plan_type: planType
            }
          })
        });

        if (flutterwaveResponse.ok) {
          const flutterwaveData = await flutterwaveResponse.json();
          paymentLink = flutterwaveData.data?.link;
          
          if (!paymentLink) {
            console.error('Flutterwave response missing link:', flutterwaveData);
            throw new Error('Payment link not generated');
          }
        } else {
          const errorText = await flutterwaveResponse.text();
          console.error('Flutterwave API error:', errorText);
          flutterwaveStatus = 'error';
          paymentLink = `${origin}/payment/error?ref=${txRef}`;
        }
      } catch (fwError) {
        console.error('Flutterwave integration error:', fwError);
        flutterwaveStatus = 'error';
        paymentLink = `${origin}/payment/error?ref=${txRef}`;
      }
    } else {
      // Fallback for testing
      paymentLink = `https://checkout.flutterwave.com/test/${txRef}`;
      flutterwaveStatus = 'not_configured';
      console.log('Flutterwave API key not configured');
    }

    // Store payment record in database (optional - table may not exist yet)
    let paymentData = null;
    try {
      const paymentResponse = await fetch(`${supabaseUrl}/rest/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: userId || null,
          flutterwave_tx_ref: txRef,
          amount: amount,
          currency: currency || 'USD',
          payment_status: 'pending',
          payment_link: paymentLink,
          plan_type: planType || 'unknown',
          metadata: {
            email,
            flutterwave_status: flutterwaveStatus,
            encryption_enabled: !!flutterwaveEncKey
          }
        })
      });

      if (paymentResponse.ok) {
        paymentData = await paymentResponse.json();
      } else {
        const errorText = await paymentResponse.text();
        console.warn('Database payment record creation failed:', errorText);
        // Don't throw error - payment link still works
      }
    } catch (dbError) {
      console.warn('Database operation failed:', dbError);
      // Continue anyway - payment link generation is more important
    }

    return new Response(JSON.stringify({
      data: {
        paymentLink: paymentLink,
        txRef: txRef,
        payment: paymentData ? paymentData[0] : null,
        status: flutterwaveStatus
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment link creation error:', error);
    
    return new Response(JSON.stringify({
      error: {
        code: 'PAYMENT_LINK_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
