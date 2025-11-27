-- Create leads table for storing all imported leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  platform TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new',
  score INTEGER DEFAULT 0,
  segment TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead campaigns table
CREATE TABLE public.lead_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  campaign_type TEXT NOT NULL DEFAULT 'outreach',
  channel TEXT NOT NULL DEFAULT 'email',
  script_template TEXT,
  rules JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{"sent": 0, "opened": 0, "replied": 0, "converted": 0}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.lead_campaigns(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'active',
  messages JSONB DEFAULT '[]',
  sentiment TEXT DEFAULT 'neutral',
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation logs table
CREATE TABLE public.automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.lead_campaigns(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  channel TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create outreach templates table
CREATE TABLE public.outreach_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  channel TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads
CREATE POLICY "Users can manage their own leads" ON public.leads FOR ALL USING (auth.uid() = user_id);

-- RLS policies for lead_campaigns
CREATE POLICY "Users can manage their own campaigns" ON public.lead_campaigns FOR ALL USING (auth.uid() = user_id);

-- RLS policies for ai_conversations
CREATE POLICY "Users can manage their own conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- RLS policies for automation_logs
CREATE POLICY "Users can view their own logs" ON public.automation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert logs" ON public.automation_logs FOR INSERT WITH CHECK (true);

-- RLS policies for outreach_templates
CREATE POLICY "Users can manage their own templates" ON public.outreach_templates FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_leads_user_status ON public.leads(user_id, status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_lead_campaigns_user ON public.lead_campaigns(user_id);
CREATE INDEX idx_ai_conversations_lead ON public.ai_conversations(lead_id);
CREATE INDEX idx_automation_logs_user ON public.automation_logs(user_id, created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lead_campaigns_updated_at BEFORE UPDATE ON public.lead_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_outreach_templates_updated_at BEFORE UPDATE ON public.outreach_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();