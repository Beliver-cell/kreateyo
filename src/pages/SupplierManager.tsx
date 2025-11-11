import { DashboardLayout } from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link2, RefreshCw, Package, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [importedProducts, setImportedProducts] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    platform: 'aliexpress',
    name: '',
    apiKey: '',
    apiSecret: '',
    storeUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [suppliersRes, productsRes, logsRes] = await Promise.all([
        supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
        supabase.from('imported_products').select('*, suppliers(name, platform)').order('created_at', { ascending: false }),
        supabase.from('sync_logs').select('*, suppliers(name, platform)').order('created_at', { ascending: false }).limit(20)
      ]);

      if (suppliersRes.data) setSuppliers(suppliersRes.data);
      if (productsRes.data) setImportedProducts(productsRes.data);
      if (logsRes.data) setSyncLogs(logsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load supplier data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('supplier-connect', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Supplier connected successfully'
      });

      setDialogOpen(false);
      setFormData({ platform: 'aliexpress', name: '', apiKey: '', apiSecret: '', storeUrl: '' });
      fetchData();
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect supplier',
        variant: 'destructive'
      });
    }
  };

  const handleSync = async (supplierId: string) => {
    try {
      setSyncing(supplierId);
      
      const { data, error } = await supabase.functions.invoke('sync-inventory', {
        body: { supplierId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: data.message || 'Inventory synced successfully'
      });

      fetchData();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync inventory',
        variant: 'destructive'
      });
    } finally {
      setSyncing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Supplier Manager</h1>
            <p className="text-muted-foreground">Connect and manage your dropshipping suppliers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect New Supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aliexpress">AliExpress</SelectItem>
                      <SelectItem value="oberlo">Oberlo</SelectItem>
                      <SelectItem value="spocket">Spocket</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="My Store"
                  />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input
                    value={formData.apiKey}
                    onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                    placeholder="Your API key"
                    type="password"
                  />
                </div>
                <div>
                  <Label>API Secret</Label>
                  <Input
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                    placeholder="Your API secret"
                    type="password"
                  />
                </div>
                <div>
                  <Label>Store URL</Label>
                  <Input
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                    placeholder="https://store.example.com"
                  />
                </div>
                <Button onClick={handleConnect} className="w-full">
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect Supplier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">Connected Suppliers</TabsTrigger>
            <TabsTrigger value="products">Imported Products</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading suppliers...</div>
              </Card>
            ) : suppliers.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No suppliers connected yet</div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{supplier.platform}</p>
                      </div>
                      {getStatusBadge(supplier.status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      {supplier.store_url && (
                        <div className="text-muted-foreground">
                          Store: {supplier.store_url}
                        </div>
                      )}
                      {supplier.last_sync_at && (
                        <div className="text-muted-foreground">
                          Last sync: {new Date(supplier.last_sync_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSync(supplier.id)}
                      disabled={syncing === supplier.id}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncing === supplier.id ? 'animate-spin' : ''}`} />
                      Sync Inventory
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading products...</div>
              </Card>
            ) : importedProducts.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No imported products yet</div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importedProducts.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-10 w-10 text-primary" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {product.suppliers?.platform}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold">${product.price}</span>
                          <Badge variant="secondary">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {product.profit_margin}% margin
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Stock: {product.stock_quantity} • {product.shipping_time}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading logs...</div>
              </Card>
            ) : syncLogs.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No sync logs yet</div>
              </Card>
            ) : (
              <Card>
                <div className="divide-y">
                  {syncLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-start gap-3">
                      {log.status === 'success' ? (
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{log.sync_type} Sync</span>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.suppliers?.name} • Processed: {log.items_processed} • Failed: {log.items_failed}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
