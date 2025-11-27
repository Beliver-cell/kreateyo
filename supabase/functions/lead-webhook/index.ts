import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get webhook secret from header or query param
    const webhookSecret = req.headers.get('x-webhook-secret') || 
      new URL(req.url).searchParams.get('secret');

    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing webhook secret' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook secret against stored webhooks
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('user_id, events')
      .eq('secret', webhookSecret)
      .eq('active', true)
      .single();

    if (webhookError || !webhook) {
      return new Response(JSON.stringify({ error: 'Invalid webhook secret' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if webhook is configured for lead imports
    if (!webhook.events.includes('lead.import') && !webhook.events.includes('*')) {
      return new Response(JSON.stringify({ error: 'Webhook not configured for lead imports' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    
    // Support multiple lead formats
    let leads: any[] = [];
    
    // Apify format
    if (body.items || body.data) {
      leads = body.items || body.data;
    }
    // Direct array
    else if (Array.isArray(body)) {
      leads = body;
    }
    // Single lead object
    else if (body.email || body.phone || body.name) {
      leads = [body];
    }
    // Wrapped in leads key
    else if (body.leads) {
      leads = body.leads;
    }

    if (leads.length === 0) {
      return new Response(JSON.stringify({ error: 'No leads found in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize lead data
    const normalizedLeads = leads.map(lead => ({
      user_id: webhook.user_id,
      name: lead.name || lead.fullName || lead.full_name || lead.firstName || null,
      email: lead.email || lead.emailAddress || lead.mail || null,
      phone: lead.phone || lead.phoneNumber || lead.mobile || lead.tel || null,
      platform: lead.platform || lead.source_platform || lead.network || 'webhook',
      source: body.source || lead.source || 'webhook',
      tags: lead.tags || (lead.category ? [lead.category] : []),
      notes: lead.notes || lead.description || lead.bio || null,
      metadata: {
        original: lead,
        webhook_received_at: new Date().toISOString(),
      },
      status: 'new',
      score: 0,
      segment: 'general',
    }));

    // Deduplicate by email/phone
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email, phone')
      .eq('user_id', webhook.user_id);

    const existingEmails = new Set((existingLeads || []).map(l => l.email).filter(Boolean));
    const existingPhones = new Set((existingLeads || []).map(l => l.phone).filter(Boolean));

    const newLeads = normalizedLeads.filter(lead => {
      if (lead.email && existingEmails.has(lead.email)) return false;
      if (lead.phone && existingPhones.has(lead.phone)) return false;
      return lead.email || lead.phone; // Must have at least one contact method
    });

    if (newLeads.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        imported: 0, 
        duplicates: normalizedLeads.length,
        message: 'All leads were duplicates or invalid' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert leads
    const { data: insertedLeads, error: insertError } = await supabase
      .from('leads')
      .insert(newLeads)
      .select();

    if (insertError) throw insertError;

    // Log the webhook import
    await supabase.from('automation_logs').insert({
      user_id: webhook.user_id,
      action: 'webhook_lead_import',
      status: 'success',
      details: {
        total_received: leads.length,
        imported: insertedLeads?.length || 0,
        duplicates: leads.length - (insertedLeads?.length || 0),
        source: body.source || 'webhook',
      },
    });

    // Auto-trigger outreach if user has active campaign
    const { data: activeCampaign } = await supabase
      .from('lead_campaigns')
      .select('id')
      .eq('user_id', webhook.user_id)
      .eq('status', 'active')
      .single();

    if (activeCampaign && insertedLeads && insertedLeads.length > 0) {
      // Mark leads for processing
      await supabase
        .from('leads')
        .update({ status: 'queued' })
        .in('id', insertedLeads.map(l => l.id));
    }

    return new Response(JSON.stringify({
      success: true,
      imported: insertedLeads?.length || 0,
      duplicates: leads.length - (insertedLeads?.length || 0),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
