
-- Messages and Broadcasts System
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email', -- email, whatsapp, sms, in_app
  segment_type TEXT NOT NULL DEFAULT 'all', -- all, paid, segment, tags
  segment_filters JSONB DEFAULT '{}',
  template_id UUID,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, sending, sent, cancelled
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.broadcast_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, failed, bounced, unsubscribed
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.message_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  channel TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'open', -- open, closed, archived
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  is_ai_handled BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.thread_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'business', -- business, customer, ai
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_email TEXT NOT NULL,
  email_opted_in BOOLEAN DEFAULT true,
  whatsapp_opted_in BOOLEAN DEFAULT true,
  sms_opted_in BOOLEAN DEFAULT true,
  in_app_opted_in BOOLEAN DEFAULT true,
  suppressed BOOLEAN DEFAULT false,
  suppression_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, customer_email)
);

-- Reviews System
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  order_id TEXT,
  appointment_id TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  device_fingerprint TEXT,
  ip_address TEXT,
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.review_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Branded Email System
CREATE TABLE public.email_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, failed
  dkim_record TEXT,
  spf_record TEXT,
  dkim_verified BOOLEAN DEFAULT false,
  spf_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_check_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, domain)
);

CREATE TABLE public.email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  broadcast_id UUID REFERENCES public.broadcasts(id),
  recipient_id UUID REFERENCES public.broadcast_recipients(id),
  event_type TEXT NOT NULL, -- sent, delivered, opened, clicked, bounced, complained, unsubscribed
  email_address TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate System
CREATE TABLE public.affiliate_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  affiliate_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  target_url TEXT,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.affiliate_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_link_id UUID NOT NULL REFERENCES public.affiliate_links(id),
  affiliate_id UUID NOT NULL,
  order_id TEXT,
  order_amount NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 0.10,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid, rejected
  paid_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  payout_method TEXT,
  payout_details JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Escrow/Payment Hold for Anti-Scam
CREATE TABLE public.payment_holds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id TEXT,
  appointment_id TEXT,
  customer_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'held', -- held, released, refunded, disputed
  hold_reason TEXT DEFAULT 'delivery_pending',
  release_after TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_holds ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their broadcasts" ON public.broadcasts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view broadcast recipients" ON public.broadcast_recipients FOR SELECT USING (EXISTS (SELECT 1 FROM public.broadcasts WHERE broadcasts.id = broadcast_recipients.broadcast_id AND broadcasts.user_id = auth.uid()));
CREATE POLICY "System can manage recipients" ON public.broadcast_recipients FOR ALL USING (true);
CREATE POLICY "Users can manage their threads" ON public.message_threads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage thread messages" ON public.thread_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.message_threads WHERE message_threads.id = thread_messages.thread_id AND message_threads.user_id = auth.uid()));
CREATE POLICY "Users can manage customer preferences" ON public.customer_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can manage review photos" ON public.review_photos FOR ALL USING (EXISTS (SELECT 1 FROM public.reviews WHERE reviews.id = review_photos.review_id AND reviews.user_id = auth.uid()));
CREATE POLICY "Users can manage email domains" ON public.email_domains FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their email events" ON public.email_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert email events" ON public.email_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can manage affiliate links" ON public.affiliate_links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their commissions" ON public.affiliate_commissions FOR SELECT USING (affiliate_id = auth.uid());
CREATE POLICY "System can manage commissions" ON public.affiliate_commissions FOR ALL USING (true);
CREATE POLICY "Users can view their payouts" ON public.affiliate_payouts FOR SELECT USING (affiliate_id = auth.uid());
CREATE POLICY "Users can request payouts" ON public.affiliate_payouts FOR INSERT WITH CHECK (affiliate_id = auth.uid());
CREATE POLICY "Users can manage payment holds" ON public.payment_holds FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_broadcasts_user_status ON public.broadcasts(user_id, status);
CREATE INDEX idx_broadcast_recipients_broadcast ON public.broadcast_recipients(broadcast_id);
CREATE INDEX idx_message_threads_user ON public.message_threads(user_id, status);
CREATE INDEX idx_thread_messages_thread ON public.thread_messages(thread_id);
CREATE INDEX idx_reviews_user_status ON public.reviews(user_id, status);
CREATE INDEX idx_email_events_user ON public.email_events(user_id, created_at);
CREATE INDEX idx_affiliate_links_user ON public.affiliate_links(user_id);
CREATE INDEX idx_payment_holds_user ON public.payment_holds(user_id, status);
