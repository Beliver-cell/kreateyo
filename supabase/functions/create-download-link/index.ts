import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate secure download token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { licenseKey } = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(`Creating download link for license: ${licenseKey}`);

    // Verify license key and get product details
    const { data: license, error: licenseError } = await supabaseClient
      .from('license_keys')
      .select('*, digital_products(*)')
      .eq('license_key', licenseKey)
      .single();

    if (licenseError || !license) {
      return new Response(JSON.stringify({ error: 'Invalid license key' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check license validity
    if (license.status !== 'active') {
      return new Response(JSON.stringify({ error: `License is ${license.status}` }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await supabaseClient
        .from('license_keys')
        .update({ status: 'expired' })
        .eq('id', license.id);

      return new Response(JSON.stringify({ error: 'License has expired' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (license.download_count >= license.max_downloads) {
      // Create piracy alert
      await supabaseClient
        .from('piracy_alerts')
        .insert({
          user_id: license.user_id,
          digital_product_id: license.digital_product_id,
          license_key_id: license.id,
          alert_type: 'excessive_downloads',
          severity: 'medium',
          details: { download_count: license.download_count, ip_address: ipAddress }
        });

      return new Response(JSON.stringify({ error: 'Download limit exceeded' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for suspicious activity (multiple IPs)
    const ipAddresses = license.ip_addresses as string[] || [];
    if (!ipAddresses.includes(ipAddress)) {
      if (ipAddresses.length >= 3) {
        await supabaseClient
          .from('piracy_alerts')
          .insert({
            user_id: license.user_id,
            digital_product_id: license.digital_product_id,
            license_key_id: license.id,
            alert_type: 'multiple_ips',
            severity: 'high',
            details: { ip_addresses: [...ipAddresses, ipAddress] }
          });
      }
      ipAddresses.push(ipAddress);
    }

    // Generate secure download token
    const secureToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Create signed URL for file download
    const { data: signedUrlData, error: urlError } = await supabaseClient
      .storage
      .from('digital-products')
      .createSignedUrl(license.digital_products.file_url, 3600); // 1 hour

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      return new Response(JSON.stringify({ error: 'Failed to create download link' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create download link record
    const { data: downloadLink, error: linkError } = await supabaseClient
      .from('download_links')
      .insert({
        license_key_id: license.id,
        digital_product_id: license.digital_product_id,
        secure_token: secureToken,
        download_url: signedUrlData.signedUrl,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (linkError) {
      console.error('Error creating download link:', linkError);
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update license metadata
    await supabaseClient
      .from('license_keys')
      .update({
        download_count: license.download_count + 1,
        last_accessed_at: new Date().toISOString(),
        ip_addresses: JSON.stringify(ipAddresses)
      })
      .eq('id', license.id);

    // Log the download
    await supabaseClient
      .from('download_logs')
      .insert({
        license_key_id: license.id,
        digital_product_id: license.digital_product_id,
        customer_email: license.customer_email,
        download_link_id: downloadLink.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        success: true
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        downloadLink: {
          url: downloadLink.download_url,
          expiresAt: downloadLink.expires_at,
          productName: license.digital_products.name
        },
        license: {
          downloadsRemaining: license.max_downloads - license.download_count - 1,
          expiresAt: license.expires_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create download link error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
