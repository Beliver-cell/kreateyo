-- Create digital_products table
CREATE TABLE public.digital_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  price DECIMAL(10,2) NOT NULL,
  download_limit INTEGER DEFAULT 5,
  access_duration_days INTEGER DEFAULT 30,
  license_type TEXT NOT NULL DEFAULT 'single' CHECK (license_type IN ('single', 'multi', 'unlimited', 'subscription')),
  requires_activation BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create license_keys table
CREATE TABLE public.license_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  digital_product_id UUID NOT NULL REFERENCES public.digital_products(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_order_id TEXT,
  license_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended')),
  activation_count INTEGER DEFAULT 0,
  max_activations INTEGER DEFAULT 1,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  ip_addresses JSONB DEFAULT '[]',
  device_fingerprints JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create download_links table
CREATE TABLE public.download_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key_id UUID NOT NULL REFERENCES public.license_keys(id) ON DELETE CASCADE,
  digital_product_id UUID NOT NULL REFERENCES public.digital_products(id) ON DELETE CASCADE,
  secure_token TEXT NOT NULL UNIQUE,
  download_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  downloaded BOOLEAN DEFAULT false,
  downloaded_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create download_logs table
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key_id UUID NOT NULL REFERENCES public.license_keys(id) ON DELETE CASCADE,
  digital_product_id UUID NOT NULL REFERENCES public.digital_products(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  download_link_id UUID REFERENCES public.download_links(id),
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_info JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create piracy_alerts table
CREATE TABLE public.piracy_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  digital_product_id UUID REFERENCES public.digital_products(id) ON DELETE CASCADE,
  license_key_id UUID REFERENCES public.license_keys(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('excessive_downloads', 'multiple_ips', 'expired_access', 'suspicious_activity', 'key_sharing')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piracy_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for digital_products
CREATE POLICY "Users can manage their own digital products"
  ON public.digital_products
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for license_keys
CREATE POLICY "Users can manage their own license keys"
  ON public.license_keys
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can view their own licenses"
  ON public.license_keys
  FOR SELECT
  USING (auth.jwt() ->> 'email' = customer_email);

-- Create RLS policies for download_links
CREATE POLICY "Users can manage their download links"
  ON public.download_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.license_keys
      WHERE license_keys.id = download_links.license_key_id
      AND license_keys.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can access valid download links"
  ON public.download_links
  FOR SELECT
  USING (expires_at > now() AND NOT downloaded);

-- Create RLS policies for download_logs
CREATE POLICY "Users can view their download logs"
  ON public.download_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.license_keys
      WHERE license_keys.id = download_logs.license_key_id
      AND license_keys.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert download logs"
  ON public.download_logs
  FOR INSERT
  WITH CHECK (true);

-- Create RLS policies for piracy_alerts
CREATE POLICY "Users can view their own piracy alerts"
  ON public.piracy_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert piracy alerts"
  ON public.piracy_alerts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own piracy alerts"
  ON public.piracy_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_digital_products_user_id ON public.digital_products(user_id);
CREATE INDEX idx_license_keys_user_id ON public.license_keys(user_id);
CREATE INDEX idx_license_keys_customer_email ON public.license_keys(customer_email);
CREATE INDEX idx_license_keys_license_key ON public.license_keys(license_key);
CREATE INDEX idx_license_keys_status ON public.license_keys(status);
CREATE INDEX idx_download_links_secure_token ON public.download_links(secure_token);
CREATE INDEX idx_download_links_expires_at ON public.download_links(expires_at);
CREATE INDEX idx_download_logs_license_key_id ON public.download_logs(license_key_id);
CREATE INDEX idx_piracy_alerts_user_id ON public.piracy_alerts(user_id);
CREATE INDEX idx_piracy_alerts_resolved ON public.piracy_alerts(resolved);

-- Create triggers for updating timestamps
CREATE TRIGGER update_digital_products_updated_at
  BEFORE UPDATE ON public.digital_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_license_keys_updated_at
  BEFORE UPDATE ON public.license_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for digital products
INSERT INTO storage.buckets (id, name, public)
VALUES ('digital-products', 'digital-products', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for digital products
CREATE POLICY "Users can upload their digital products"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'digital-products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their digital products"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'digital-products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their digital products"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'digital-products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Authenticated users can download with valid token"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'digital-products');