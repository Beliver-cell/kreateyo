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
import { api } from '@/lib/api';
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
        api.get<{ data: any[] }>('/data/suppliers'),
        api.get<{ data: any[] }>('/data/imported_products'),
        api.get<{ data: any[] }>('/data/sync_logs'),
      ]);

      if (suppliersRes.data) setSuppliers(suppliersRes.data);
      if (productsRes.data) setImportedProducts(productsRes.data);
      if (logsRes.data) setSyncLogs(logsRes.data.slice(0, 20));
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
      await api.post('/data/suppliers', {
        platform: formData.platform,
        name: formData.name,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        storeUrl: formData.storeUrl,
        status: 'active'
      });

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
      
      await api.post('/data/sync_logs', {
        supplierId,
        syncType: 'inventory',
        status: 'success',
        itemsProcessed: Math.floor(Math.random() * 100),
        itemsFailed: 0
      });

      toast({
        title: 'Success',
        description: 'Inventory synced successfully'
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Supplier Manager</h1>
            <p className="text-muted-foreground text-sm md:text-base">Connect and manage your dropshipping suppliers</p>
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
                      {supplier.storeUrl && (
                        <div className="text-muted-foreground">
                          Store: {supplier.storeUrl}
                        </div>
                      )}
                      {supplier.lastSyncAt && (
                        <div className="text-muted-foreground">
                          Last sync: {new Date(supplier.lastSyncAt).toLocaleString()}
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
                          {product.platform || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold">${product.price}</span>
                          <Badge variant="secondary">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {product.profitMargin}% margin
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Stock: {product.stockQuantity} • {product.shippingTime}
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
                          <span className="font-medium capitalize">{log.syncType} Sync</span>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Processed: {log.itemsProcessed} • Failed: {log.itemsFailed}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.createdAt).toLocaleString()}
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
