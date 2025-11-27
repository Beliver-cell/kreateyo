import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Outreach scripts based on segment
const OUTREACH_SCRIPTS: Record<string, { subject: string; template: string }> = {
  business_owners: {
    subject: "Let's Grow Your Business Together",
    template: `Hi {{name}},

I noticed you're running a business and wanted to reach out personally. We help business owners like you streamline operations and increase revenue.

Would you be open to a quick chat about how we might be able to help?

Best regards`
  },
  digital_buyers: {
    subject: "Exclusive Digital Resources for You",
    template: `Hi {{name}},

Based on your interest in digital products, I thought you'd appreciate knowing about our latest offerings designed specifically for creators and digital entrepreneurs.

Would you like me to share some exclusive resources?

Cheers`
  },
  service_leads: {
    subject: "Free Consultation Available",
    template: `Hi {{name}},

I'd love to offer you a complimentary consultation to discuss how our services can help you achieve your goals.

When would be a good time for a quick call?

Best`
  },
  cold_leads: {
    subject: "Quick Question",
    template: `Hi {{name}},

I hope this message finds you well. I'm reaching out because I believe we might be able to help you with [specific value proposition].

Do you have 5 minutes for a quick chat this week?

Thanks`
  },
  general: {
    subject: "Introduction",
    template: `Hi {{name}},

I wanted to personally reach out and introduce myself. We offer solutions that might be valuable for you.

Would you be interested in learning more?

Best regards`
  }
};

async function generateAIMessage(lead: any, segment: string): Promise<{ subject: string; content: string }> {
  const script = OUTREACH_SCRIPTS[segment] || OUTREACH_SCRIPTS.general;
  
  if (!LOVABLE_API_KEY) {
    // Fallback to template if no AI
    return {
      subject: script.subject,
      content: script.template.replace(/{{name}}/g, lead.name || 'there'),
    };
  }

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a professional outreach specialist. Generate a personalized, warm, and professional outreach message. Keep it concise (under 100 words). Don't be salesy. Be genuine and helpful.`
          },
          {
            role: 'user',
            content: `Generate an outreach message for:
Name: ${lead.name || 'Prospect'}
Segment: ${segment}
Platform: ${lead.platform || 'unknown'}
Notes: ${lead.notes || 'none'}

Base template for reference: ${script.template}

Generate a subject line and message body. Format as:
SUBJECT: [subject line]
BODY: [message body]`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('AI generation failed');
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    const subjectMatch = text.match(/SUBJECT:\s*(.+)/i);
    const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);
    
    return {
      subject: subjectMatch?.[1]?.trim() || script.subject,
      content: bodyMatch?.[1]?.trim() || script.template.replace(/{{name}}/g, lead.name || 'there'),
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      subject: script.subject,
      content: script.template.replace(/{{name}}/g, lead.name || 'there'),
    };
  }
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

    const { lead_ids, campaign_id, channel = 'email' } = await req.json();

    // Fetch leads to process
    let query = supabase.from('leads').select('*').eq('user_id', user.id);
    
    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else {
      query = query.in('status', ['new', 'queued']).limit(50);
    }

    const { data: leads, error: leadsError } = await query;
    if (leadsError) throw leadsError;

    if (!leads || leads.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0, message: 'No leads to process' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    
    for (const lead of leads) {
      try {
        // Generate AI message
        const { subject, content } = await generateAIMessage(lead, lead.segment || 'general');

        // Create conversation record
        const { data: conversation, error: convError } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            lead_id: lead.id,
            campaign_id: campaign_id || null,
            channel,
            status: 'active',
            messages: [{
              role: 'assistant',
              content,
              subject,
              sent_at: new Date().toISOString(),
              channel,
            }],
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;

        // Update lead status
        await supabase
          .from('leads')
          .update({ 
            status: 'contacted',
            last_contact: new Date().toISOString(),
          })
          .eq('id', lead.id);

        // Log the outreach
        await supabase.from('automation_logs').insert({
          user_id: user.id,
          lead_id: lead.id,
          campaign_id: campaign_id || null,
          action: 'outreach_sent',
          channel,
          status: 'success',
          details: { subject, message_preview: content.substring(0, 100) },
        });

        results.push({ lead_id: lead.id, status: 'sent', conversation_id: conversation?.id });

        // Update campaign stats - simple update instead of rpc
        if (campaign_id) {
          const { data: campaignData } = await supabase
            .from('lead_campaigns')
            .select('stats')
            .eq('id', campaign_id)
            .single();
          
          if (campaignData?.stats) {
            const stats = campaignData.stats as Record<string, number>;
            stats.sent = (stats.sent || 0) + 1;
            await supabase
              .from('lead_campaigns')
              .update({ stats })
              .eq('id', campaign_id);
          }
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error processing lead ${lead.id}:`, err);
        results.push({ lead_id: lead.id, status: 'error', error: errorMessage });
        
        await supabase.from('automation_logs').insert({
          user_id: user.id,
          lead_id: lead.id,
          action: 'outreach_failed',
          channel,
          status: 'error',
          details: { error: errorMessage },
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      sent: results.filter(r => r.status === 'sent').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI outreach:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
