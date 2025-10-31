import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Test database connection - use a simpler query that works with any table
    // Try payments table first (most likely to exist), fallback to users
    let dbConnected = false
    let dbError = null
    
    // Try payments table (most reliable)
    const paymentsTest = await supabaseClient
      .from('payments')
      .select('id')
      .limit(1)
    
    if (!paymentsTest.error) {
      dbConnected = true
    } else {
      // Fallback to users table
      const usersTest = await supabaseClient
        .from('users')
        .select('id')
        .limit(1)
      
      if (!usersTest.error) {
        dbConnected = true
      } else {
        dbError = usersTest.error.message
      }
    }

    if (!dbConnected) {
      return new Response(
        JSON.stringify({
          status: 'unhealthy',
          database: 'Not available',
          error: dbError || 'Database connection failed',
          timestamp: new Date().toISOString()
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: err.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
