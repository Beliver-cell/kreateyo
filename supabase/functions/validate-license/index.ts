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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { licenseKey, deviceFingerprint } = await req.json();

    console.log(`Validating license: ${licenseKey}`);

    // Get license details
    const { data: license, error: licenseError } = await supabaseClient
      .from('license_keys')
      .select('*, digital_products(*)')
      .eq('license_key', licenseKey)
      .single();

    if (licenseError || !license) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid license key' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validationResult: any = {
      valid: false,
      license: {
        status: license.status,
        productName: license.digital_products.name,
        expiresAt: license.expires_at,
        downloadsRemaining: license.max_downloads - license.download_count,
        activationsRemaining: license.max_activations - license.activation_count,
      }
    };

    // Check if license is active
    if (license.status !== 'active') {
      validationResult.error = `License is ${license.status}`;
      return new Response(
        JSON.stringify(validationResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await supabaseClient
        .from('license_keys')
        .update({ status: 'expired' })
        .eq('id', license.id);

      validationResult.error = 'License has expired';
      return new Response(
        JSON.stringify(validationResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check activation limit
    if (license.digital_products.requires_activation) {
      const deviceFingerprints = license.device_fingerprints as string[] || [];
      
      if (!deviceFingerprints.includes(deviceFingerprint)) {
        if (license.activation_count >= license.max_activations) {
          // Create piracy alert
          await supabaseClient
            .from('piracy_alerts')
            .insert({
              user_id: license.user_id,
              digital_product_id: license.digital_product_id,
              license_key_id: license.id,
              alert_type: 'key_sharing',
              severity: 'high',
              details: { 
                activation_count: license.activation_count,
                device_fingerprint: deviceFingerprint 
              }
            });

          validationResult.error = 'Activation limit exceeded';
          return new Response(
            JSON.stringify(validationResult),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Register new activation
        deviceFingerprints.push(deviceFingerprint);
        await supabaseClient
          .from('license_keys')
          .update({
            activation_count: license.activation_count + 1,
            device_fingerprints: JSON.stringify(deviceFingerprints),
            last_accessed_at: new Date().toISOString()
          })
          .eq('id', license.id);

        validationResult.license.activationsRemaining = license.max_activations - license.activation_count - 1;
      }
    }

    // License is valid
    validationResult.valid = true;
    validationResult.message = 'License is valid and active';

    return new Response(
      JSON.stringify(validationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Validate license error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
