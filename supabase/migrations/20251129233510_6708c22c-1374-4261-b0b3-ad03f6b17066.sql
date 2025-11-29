-- Customer Referrals System
CREATE TABLE public.customer_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_email TEXT NOT NULL,
  referred_customer_id UUID,
  business_id UUID NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'paid', 'rejected')),
  commission_amount NUMERIC DEFAULT 0,
  commission_paid BOOLEAN DEFAULT false,
  device_fingerprint TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Referral Payouts
CREATE TABLE public.referral_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  business_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  payout_method TEXT,
  payout_account TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Disputes System
CREATE TABLE public.customer_disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  business_id UUID NOT NULL,
  order_id TEXT,
  appointment_id TEXT,
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('delivery', 'service', 'quality', 'fraud', 'other')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending_business', 'pending_customer', 'under_review', 'resolved', 'refunded', 'rejected', 'auto_refunded')),
  amount NUMERIC NOT NULL,
  refund_amount NUMERIC DEFAULT 0,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  business_response TEXT,
  business_evidence_urls TEXT[],
  admin_notes TEXT,
  auto_refund_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Dispute Timeline Events
CREATE TABLE public.dispute_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dispute_id UUID NOT NULL REFERENCES public.customer_disputes(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('customer', 'business', 'system', 'admin')),
  actor_id UUID,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer Payout Accounts
CREATE TABLE public.customer_payout_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL UNIQUE,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank', 'mobile_money', 'paypal')),
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT,
  routing_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_payout_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Customers can view their own referrals"
ON public.customer_referrals FOR SELECT
USING (referrer_id = auth.uid() OR referred_customer_id = auth.uid());

CREATE POLICY "Customers can create referrals"
ON public.customer_referrals FOR INSERT
WITH CHECK (referrer_id = auth.uid());

-- RLS Policies for payouts
CREATE POLICY "Customers can view their own payouts"
ON public.referral_payouts FOR SELECT
USING (referrer_id = auth.uid());

CREATE POLICY "Customers can request payouts"
ON public.referral_payouts FOR INSERT
WITH CHECK (referrer_id = auth.uid());

-- RLS Policies for disputes
CREATE POLICY "Customers can view their own disputes"
ON public.customer_disputes FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Customers can create disputes"
ON public.customer_disputes FOR INSERT
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update their own disputes"
ON public.customer_disputes FOR UPDATE
USING (customer_id = auth.uid());

-- RLS Policies for dispute events
CREATE POLICY "View dispute events"
ON public.dispute_events FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.customer_disputes
  WHERE id = dispute_events.dispute_id AND customer_id = auth.uid()
));

CREATE POLICY "Create dispute events"
ON public.dispute_events FOR INSERT
WITH CHECK (actor_id = auth.uid());

-- RLS Policies for payout accounts
CREATE POLICY "Customers can manage their payout account"
ON public.customer_payout_accounts FOR ALL
USING (customer_id = auth.uid());

-- Indexes
CREATE INDEX idx_referrals_referrer ON public.customer_referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.customer_referrals(referral_code);
CREATE INDEX idx_disputes_customer ON public.customer_disputes(customer_id);
CREATE INDEX idx_disputes_business ON public.customer_disputes(business_id);
CREATE INDEX idx_disputes_status ON public.customer_disputes(status);
CREATE INDEX idx_dispute_events_dispute ON public.dispute_events(dispute_id);