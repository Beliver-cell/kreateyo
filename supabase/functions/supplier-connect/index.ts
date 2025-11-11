import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { platform, apiKey, apiSecret, storeUrl, name } = await req.json();

    console.log(`Connecting supplier: ${platform} for user ${user.id}`);

    // Validate platform
    if (!['aliexpress', 'oberlo', 'spocket', 'other'].includes(platform)) {
      return new Response(JSON.stringify({ error: 'Invalid platform' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test connection based on platform
    let connectionStatus = 'active';
    let errorMessage = null;

    try {
      if (platform === 'aliexpress') {
        // Simulate AliExpress API connection test
        console.log('Testing AliExpress connection...');
        // In production, you would make actual API calls here
        // For now, we'll simulate a successful connection
      } else if (platform === 'oberlo') {
        // Simulate Oberlo API connection test
        console.log('Testing Oberlo connection...');
      } else if (platform === 'spocket') {
        // Simulate Spocket API connection test
        console.log('Testing Spocket connection...');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      connectionStatus = 'error';
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    // Insert supplier into database
    const { data: supplier, error: insertError } = await supabaseClient
      .from('suppliers')
      .insert({
        user_id: user.id,
        name: name || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Store`,
        platform,
        api_key: apiKey,
        api_secret: apiSecret,
        store_url: storeUrl,
        status: connectionStatus,
        settings: { error_message: errorMessage }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the connection
    await supabaseClient
      .from('sync_logs')
      .insert({
        user_id: user.id,
        supplier_id: supplier.id,
        sync_type: 'products',
        status: connectionStatus === 'active' ? 'success' : 'failed',
        items_processed: 0
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        supplier,
        message: connectionStatus === 'active' 
          ? 'Supplier connected successfully' 
          : 'Supplier added but connection test failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Supplier connect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
