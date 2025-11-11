import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Note: To enable email sending, add RESEND_API_KEY to your Supabase secrets
// Visit https://resend.com to create an API key

function createEmailHTML(props: {
  productName: string;
  licenseKey: string;
  downloadUrl: string;
  expiresAt: string | null;
  maxDownloads: number;
  instructions: string;
}): string {
  const { productName, licenseKey, downloadUrl, expiresAt, maxDownloads, instructions } = props;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #333;">🎉 Your Purchase is Complete!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 20px;">
                    <p style="margin: 0; font-size: 16px; line-height: 26px; color: #333;">
                      Thank you for your purchase of <strong>${productName}</strong>. 
                      Your digital product is ready for instant download!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px; background-color: #f9fafb;">
                    <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold; color: #333;">Your License Key:</p>
                    <div style="padding: 16px; background-color: #f4f4f4; border-radius: 8px; border: 1px solid #e1e8ed; text-align: center;">
                      <code style="font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #333; font-family: monospace;">${licenseKey}</code>
                    </div>
                    <p style="margin: 8px 0 0; font-size: 14px; color: #666;">
                      Keep this key safe - you'll need it to access your downloads.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; text-align: center;">
                    <a href="${downloadUrl}?license=${licenseKey}" style="display: inline-block; padding: 16px 48px; background-color: #5e6ad2; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
                      Download Now
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px; border-top: 1px solid #e6ebf1;">
                    <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: bold; color: #333;">Important Information</h2>
                    <p style="margin: 8px 0; font-size: 16px; line-height: 26px; color: #333;">
                      <strong>Download Limit:</strong> ${maxDownloads} downloads
                    </p>
                    ${expiresAt ? `
                      <p style="margin: 8px 0; font-size: 16px; line-height: 26px; color: #333;">
                        <strong>Access Expires:</strong> ${new Date(expiresAt).toLocaleDateString()}
                      </p>
                    ` : ''}
                    <p style="margin: 8px 0; font-size: 16px; line-height: 26px; color: #333;">
                      <strong>Instructions:</strong><br>${instructions}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px;">
                    <div style="background-color: #fffbea; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                      <p style="margin: 0 0 8px; font-size: 16px; font-weight: bold; color: #333;">💡 Pro Tips:</p>
                      <ul style="margin: 8px 0; padding-left: 20px; font-size: 14px; line-height: 22px; color: #666;">
                        <li>Save your license key in a secure location</li>
                        <li>Download your files within the expiration period</li>
                        <li>Contact support if you experience any issues</li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #e6ebf1;">
                    <p style="margin: 0; font-size: 12px; line-height: 16px; color: #8898aa;">
                      If you didn't make this purchase, please contact us immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendEmailViaResend(to: string, subject: string, html: string): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured. Please add it to Supabase secrets.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Digital Products <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
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

    const { licenseKeyId } = await req.json();

    console.log(`Sending digital product for license: ${licenseKeyId}`);

    // Get license and product details
    const { data: license, error: licenseError } = await supabaseClient
      .from('license_keys')
      .select('*, digital_products(*)')
      .eq('id', licenseKeyId)
      .eq('user_id', user.id)
      .single();

    if (licenseError || !license) {
      return new Response(JSON.stringify({ error: 'License not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const product = license.digital_products;
    const downloadUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/create-download-link`;

    // Create email HTML
    const html = createEmailHTML({
      productName: product.name,
      licenseKey: license.license_key,
      downloadUrl,
      expiresAt: license.expires_at,
      maxDownloads: license.max_downloads,
      instructions: product.metadata?.instructions || 'Thank you for your purchase!'
    });

    // Send email
    await sendEmailViaResend(
      license.customer_email,
      `Your ${product.name} is Ready!`,
      html
    );

    console.log(`Email sent successfully to ${license.customer_email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Digital product delivered successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send digital product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
