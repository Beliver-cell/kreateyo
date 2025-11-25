-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  business_id UUID,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'free'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create business_client_messages table for chat
CREATE TABLE IF NOT EXISTS public.business_client_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  client_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('business', 'client')),
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_client_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Business owners can view their messages"
  ON public.business_client_messages FOR SELECT
  USING (
    business_id IN (
      SELECT business_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clients can view their messages"
  ON public.business_client_messages FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Business owners can send messages"
  ON public.business_client_messages FOR INSERT
  WITH CHECK (
    sender_type = 'business' AND
    business_id IN (
      SELECT business_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clients can send messages"
  ON public.business_client_messages FOR INSERT
  WITH CHECK (
    sender_type = 'client' AND
    client_id = auth.uid()
  );

CREATE POLICY "Users can mark their messages as read"
  ON public.business_client_messages FOR UPDATE
  USING (
    (sender_type = 'client' AND business_id IN (
      SELECT business_id FROM public.profiles WHERE id = auth.uid()
    )) OR
    (sender_type = 'business' AND client_id = auth.uid())
  );

-- Create index for performance
CREATE INDEX idx_messages_business_client ON public.business_client_messages(business_id, client_id);
CREATE INDEX idx_messages_created_at ON public.business_client_messages(created_at DESC);

-- Update trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();