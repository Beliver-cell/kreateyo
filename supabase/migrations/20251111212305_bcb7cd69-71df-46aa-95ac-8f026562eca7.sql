-- Create marketing campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL, -- 'google_ads', 'facebook', 'instagram', 'email', 'other'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed'
  budget NUMERIC(10,2),
  spent NUMERIC(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create design projects table
CREATE TABLE public.design_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  project_type TEXT, -- 'logo', 'website', 'branding', 'ui_ux', 'print', 'other'
  status TEXT NOT NULL DEFAULT 'planning', -- 'planning', 'in_progress', 'review', 'completed', 'on_hold'
  budget NUMERIC(10,2),
  start_date TIMESTAMP WITH TIME ZONE,
  deadline TIMESTAMP WITH TIME ZONE,
  completion_percentage INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create design milestones table
CREATE TABLE public.design_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.design_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content calendar table
CREATE TABLE public.content_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'blog', 'social', 'email', 'video', 'podcast', 'other'
  platform TEXT, -- 'website', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'other'
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'archived'
  word_count INTEGER,
  author TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order notifications table
CREATE TABLE public.order_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'order_confirmed', 'shipped', 'out_for_delivery', 'delivered', 'tracking_update'
  customer_email TEXT NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_campaigns
CREATE POLICY "Users can manage their own campaigns"
  ON public.marketing_campaigns
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for design_projects
CREATE POLICY "Users can manage their own projects"
  ON public.design_projects
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for design_milestones
CREATE POLICY "Users can manage milestones for their projects"
  ON public.design_milestones
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.design_projects
    WHERE design_projects.id = design_milestones.project_id
    AND design_projects.user_id = auth.uid()
  ));

-- RLS Policies for content_calendar
CREATE POLICY "Users can manage their own content"
  ON public.content_calendar
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for order_notifications
CREATE POLICY "Users can view their own order notifications"
  ON public.order_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert order notifications"
  ON public.order_notifications
  FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_marketing_campaigns_user_id ON public.marketing_campaigns(user_id);
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);
CREATE INDEX idx_design_projects_user_id ON public.design_projects(user_id);
CREATE INDEX idx_design_projects_status ON public.design_projects(status);
CREATE INDEX idx_design_milestones_project_id ON public.design_milestones(project_id);
CREATE INDEX idx_content_calendar_user_id ON public.content_calendar(user_id);
CREATE INDEX idx_content_calendar_scheduled_date ON public.content_calendar(scheduled_date);
CREATE INDEX idx_order_notifications_order_id ON public.order_notifications(order_id);

-- Triggers for updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_projects_updated_at
  BEFORE UPDATE ON public.design_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_milestones_updated_at
  BEFORE UPDATE ON public.design_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_calendar_updated_at
  BEFORE UPDATE ON public.content_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();