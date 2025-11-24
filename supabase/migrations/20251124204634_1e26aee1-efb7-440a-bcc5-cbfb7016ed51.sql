-- Create contacts table for WhatsApp contact management
CREATE TABLE IF NOT EXISTS public.whatsapp_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create contact groups table
CREATE TABLE IF NOT EXISTS public.whatsapp_contact_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create junction table for contacts and groups
CREATE TABLE IF NOT EXISTS public.whatsapp_contact_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.whatsapp_contact_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contact_id, group_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.whatsapp_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#10b981',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create junction table for contacts and tags
CREATE TABLE IF NOT EXISTS public.whatsapp_contact_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.whatsapp_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contact_id, tag_id)
);

-- Create message templates table
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'marketing',
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create scheduled messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  message_content TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('contact', 'group', 'all')),
  recipient_ids JSONB DEFAULT '[]'::jsonb,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create message logs table for tracking sent messages
CREATE TABLE IF NOT EXISTS public.whatsapp_message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contact_id UUID REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  scheduled_message_id UUID REFERENCES public.whatsapp_scheduled_messages(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  message_content TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  whatsapp_message_id TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contact_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_message_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contacts
CREATE POLICY "Users can manage their own contacts"
  ON public.whatsapp_contacts
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for groups
CREATE POLICY "Users can manage their own groups"
  ON public.whatsapp_contact_groups
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for group members
CREATE POLICY "Users can manage their own group members"
  ON public.whatsapp_contact_group_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_contact_groups
      WHERE id = group_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for tags
CREATE POLICY "Users can manage their own tags"
  ON public.whatsapp_tags
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for contact tags
CREATE POLICY "Users can manage their own contact tags"
  ON public.whatsapp_contact_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.whatsapp_contacts
      WHERE id = contact_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for templates
CREATE POLICY "Users can manage their own templates"
  ON public.whatsapp_templates
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for scheduled messages
CREATE POLICY "Users can manage their own scheduled messages"
  ON public.whatsapp_scheduled_messages
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for message logs
CREATE POLICY "Users can view their own message logs"
  ON public.whatsapp_message_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_whatsapp_contacts_user_id ON public.whatsapp_contacts(user_id);
CREATE INDEX idx_whatsapp_contacts_phone ON public.whatsapp_contacts(phone_number);
CREATE INDEX idx_whatsapp_groups_user_id ON public.whatsapp_contact_groups(user_id);
CREATE INDEX idx_whatsapp_scheduled_status ON public.whatsapp_scheduled_messages(status, scheduled_for);
CREATE INDEX idx_whatsapp_message_logs_user_id ON public.whatsapp_message_logs(user_id);
CREATE INDEX idx_whatsapp_message_logs_status ON public.whatsapp_message_logs(status);

-- Create trigger for updated_at
CREATE TRIGGER update_whatsapp_contacts_updated_at
  BEFORE UPDATE ON public.whatsapp_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_groups_updated_at
  BEFORE UPDATE ON public.whatsapp_contact_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at
  BEFORE UPDATE ON public.whatsapp_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_scheduled_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_scheduled_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();