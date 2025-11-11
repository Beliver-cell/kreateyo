-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('aliexpress', 'oberlo', 'spocket', 'other')),
  api_key TEXT,
  api_secret TEXT,
  store_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create imported_products table
CREATE TABLE public.imported_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2),
  images JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  shipping_time TEXT,
  stock_quantity INTEGER DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error')),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supplier_orders table for auto-order tracking
CREATE TABLE public.supplier_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  customer_order_id TEXT NOT NULL,
  external_order_id TEXT,
  imported_product_id UUID REFERENCES public.imported_products(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed')),
  tracking_number TEXT,
  shipping_carrier TEXT,
  total_cost DECIMAL(10,2),
  order_details JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sync_logs table
CREATE TABLE public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('products', 'inventory', 'orders', 'tracking')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for suppliers
CREATE POLICY "Users can manage their own suppliers"
  ON public.suppliers
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for imported_products
CREATE POLICY "Users can manage their own imported products"
  ON public.imported_products
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for supplier_orders
CREATE POLICY "Users can manage their own supplier orders"
  ON public.supplier_orders
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for sync_logs
CREATE POLICY "Users can view their own sync logs"
  ON public.sync_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert sync logs"
  ON public.sync_logs
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_suppliers_platform ON public.suppliers(platform);
CREATE INDEX idx_imported_products_user_id ON public.imported_products(user_id);
CREATE INDEX idx_imported_products_supplier_id ON public.imported_products(supplier_id);
CREATE INDEX idx_imported_products_external_id ON public.imported_products(external_id);
CREATE INDEX idx_supplier_orders_user_id ON public.supplier_orders(user_id);
CREATE INDEX idx_supplier_orders_status ON public.supplier_orders(status);
CREATE INDEX idx_sync_logs_user_id ON public.sync_logs(user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_imported_products_updated_at
  BEFORE UPDATE ON public.imported_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplier_orders_updated_at
  BEFORE UPDATE ON public.supplier_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();