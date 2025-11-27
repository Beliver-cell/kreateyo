import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  platform?: string;
  source: string;
  tags?: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

// Deduplication by email/phone
function deduplicateLeads(leads: Lead[], existingEmails: Set<string>, existingPhones: Set<string>): Lead[] {
  const seen = new Set<string>();
  return leads.filter(lead => {
    const key = lead.email || lead.phone || '';
    if (!key || seen.has(key) || existingEmails.has(key) || existingPhones.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Clean and validate lead data
function cleanLead(lead: Lead): Lead {
  return {
    ...lead,
    name: lead.name?.trim() || undefined,
    email: lead.email?.toLowerCase().trim() || undefined,
    phone: lead.phone?.replace(/[^0-9+]/g, '') || undefined,
    platform: lead.platform?.toLowerCase() || 'unknown',
    source: lead.source || 'manual',
    tags: lead.tags || [],
    notes: lead.notes?.trim() || undefined,
  };
}

// Score leads based on data completeness
function scoreLead(lead: Lead): number {
  let score = 0;
  if (lead.email) score += 30;
  if (lead.phone) score += 20;
  if (lead.name) score += 15;
  if (lead.platform && lead.platform !== 'unknown') score += 10;
  if (lead.tags && lead.tags.length > 0) score += 10;
  if (lead.notes) score += 5;
  return Math.min(score, 100);
}

// Segment lead based on source/tags
function segmentLead(lead: Lead): string {
  const source = lead.source?.toLowerCase() || '';
  const tags = lead.tags?.map(t => t.toLowerCase()) || [];
  
  if (source.includes('business') || tags.includes('b2b') || tags.includes('business')) return 'business_owners';
  if (source.includes('digital') || tags.includes('digital') || tags.includes('creator')) return 'digital_buyers';
  if (source.includes('service') || tags.includes('service') || tags.includes('consultation')) return 'service_leads';
  if (source.includes('cold') || tags.includes('cold')) return 'cold_leads';
  return 'general';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { leads, auto_campaign } = await req.json();
    
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return new Response(JSON.stringify({ error: 'No leads provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch existing leads for deduplication
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email, phone')
      .eq('user_id', user.id);

    const existingEmails = new Set((existingLeads || []).map(l => l.email).filter(Boolean));
    const existingPhones = new Set((existingLeads || []).map(l => l.phone).filter(Boolean));

    // Process leads
    const cleanedLeads = leads.map(cleanLead);
    const uniqueLeads = deduplicateLeads(cleanedLeads, existingEmails, existingPhones);
    
    const processedLeads = uniqueLeads.map(lead => ({
      ...lead,
      user_id: user.id,
      score: scoreLead(lead),
      segment: segmentLead(lead),
      status: 'new',
    }));

    if (processedLeads.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'All leads were duplicates',
        imported: 0,
        duplicates: leads.length 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert leads
    const { data: insertedLeads, error: insertError } = await supabase
      .from('leads')
      .insert(processedLeads)
      .select();

    if (insertError) throw insertError;

    // Log the import
    await supabase.from('automation_logs').insert({
      user_id: user.id,
      action: 'leads_imported',
      status: 'success',
      details: {
        total_received: leads.length,
        imported: insertedLeads?.length || 0,
        duplicates: leads.length - (insertedLeads?.length || 0),
        source: leads[0]?.source || 'unknown',
      },
    });

    // If auto_campaign is enabled, trigger outreach
    if (auto_campaign && insertedLeads && insertedLeads.length > 0) {
      // Get or create default campaign
      let { data: campaign } = await supabase
        .from('lead_campaigns')
        .select()
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!campaign) {
        const { data: newCampaign } = await supabase
          .from('lead_campaigns')
          .insert({
            user_id: user.id,
            name: 'Auto Outreach Campaign',
            status: 'active',
            campaign_type: 'outreach',
            channel: 'email',
          })
          .select()
          .single();
        campaign = newCampaign;
      }

      // Update leads with campaign assignment
      if (campaign) {
        const leadIds = insertedLeads.map(l => l.id);
        await supabase
          .from('leads')
          .update({ status: 'queued' })
          .in('id', leadIds);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      imported: insertedLeads?.length || 0,
      duplicates: leads.length - (insertedLeads?.length || 0),
      leads: insertedLeads,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing leads:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
