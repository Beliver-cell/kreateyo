import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a secure license key
function generateLicenseKey(prefix = 'DL'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 4;
  const segmentLength = 4;
  
  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(segment);
  }
  
  return `${prefix}-${parts.join('-')}`;
}

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

    const { 
      digitalProductId, 
      customerEmail, 
      customerOrderId,
      customSettings 
    } = await req.json();

    console.log(`Generating license for product ${digitalProductId}, customer ${customerEmail}`);

    // Get digital product details
    const { data: product, error: productError } = await supabaseClient
      .from('digital_products')
      .select('*')
      .eq('id', digitalProductId)
      .eq('user_id', user.id)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate unique license key
    let licenseKey = generateLicenseKey();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure uniqueness
    while (attempts < maxAttempts) {
      const { data: existing } = await supabaseClient
        .from('license_keys')
        .select('id')
        .eq('license_key', licenseKey)
        .single();

      if (!existing) break;
      licenseKey = generateLicenseKey();
      attempts++;
    }

    // Calculate expiration date
    const expiresAt = product.access_duration_days 
      ? new Date(Date.now() + product.access_duration_days * 24 * 60 * 60 * 1000)
      : null;

    // Create license key record
    const { data: license, error: licenseError } = await supabaseClient
      .from('license_keys')
      .insert({
        user_id: user.id,
        digital_product_id: digitalProductId,
        customer_email: customerEmail,
        customer_order_id: customerOrderId,
        license_key: licenseKey,
        max_downloads: customSettings?.maxDownloads || product.download_limit,
        max_activations: customSettings?.maxActivations || (product.license_type === 'unlimited' ? 999 : 1),
        expires_at: expiresAt
      })
      .select()
      .single();

    if (licenseError) {
      console.error('Error creating license:', licenseError);
      return new Response(JSON.stringify({ error: licenseError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`License created successfully: ${licenseKey}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        license,
        message: 'License generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Generate license error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
