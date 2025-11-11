import { DashboardLayout } from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Key, Download, AlertTriangle, Eye, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DigitalProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    downloadLimit: '5',
    accessDurationDays: '30',
    licenseType: 'single',
    requiresActivation: false,
    instructions: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, licensesRes, logsRes, alertsRes] = await Promise.all([
        supabase.from('digital_products').select('*').order('created_at', { ascending: false }),
        supabase.from('license_keys').select('*, digital_products(name)').order('created_at', { ascending: false }),
        supabase.from('download_logs').select('*, digital_products(name)').order('created_at', { ascending: false }).limit(50),
        supabase.from('piracy_alerts').select('*, digital_products(name)').eq('resolved', false).order('created_at', { ascending: false })
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (licensesRes.data) setLicenses(licensesRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load digital products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('digital-products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      return fileName;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (fileUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('digital_products')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          file_url: fileUrl,
          price: parseFloat(formData.price),
          download_limit: parseInt(formData.downloadLimit),
          access_duration_days: parseInt(formData.accessDurationDays),
          license_type: formData.licenseType,
          requires_activation: formData.requiresActivation,
          metadata: { instructions: formData.instructions }
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Digital product created successfully'
      });

      setDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        downloadLimit: '5',
        accessDurationDays: '30',
        licenseType: 'single',
        requiresActivation: false,
        instructions: ''
      });
      fetchData();
    } catch (error) {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create digital product',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'default',
      expired: 'secondary',
      revoked: 'destructive',
      suspended: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Digital Products</h1>
            <p className="text-muted-foreground">Manage instant delivery products with license keys</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Digital Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Digital Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Premium eBook Bundle"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your digital product..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <Label>License Type</Label>
                    <Select value={formData.licenseType} onValueChange={(v) => setFormData({...formData, licenseType: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single User</SelectItem>
                        <SelectItem value="multi">Multi User</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Download Limit</Label>
                    <Input
                      type="number"
                      value={formData.downloadLimit}
                      onChange={(e) => setFormData({...formData, downloadLimit: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Access Duration (Days)</Label>
                    <Input
                      type="number"
                      value={formData.accessDurationDays}
                      onChange={(e) => setFormData({...formData, accessDurationDays: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Customer Instructions</Label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    placeholder="Installation or usage instructions..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Upload Product File</Label>
                  <Input
                    type="file"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const fileUrl = await handleFileUpload(file);
                          await handleCreate(fileUrl);
                        } catch (error) {
                          toast({
                            title: 'Error',
                            description: 'Failed to upload file',
                            variant: 'destructive'
                          });
                        }
                      }
                    }}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {alerts.length > 0 && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Piracy Alerts ({alerts.length})</h3>
                <p className="text-sm text-red-700">Suspicious activity detected on your digital products</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="licenses">License Keys ({licenses.length})</TabsTrigger>
            <TabsTrigger value="logs">Download Logs</TabsTrigger>
            <TabsTrigger value="alerts">Security Alerts ({alerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading products...</div>
              </Card>
            ) : products.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No digital products yet</div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.is_active ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-semibold">${product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Downloads:</span>
                          <span>{product.download_limit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Access:</span>
                          <span>{product.access_duration_days} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">License:</span>
                          <span className="capitalize">{product.license_type}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading licenses...</div>
              </Card>
            ) : licenses.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No license keys generated yet</div>
              </Card>
            ) : (
              <Card>
                <div className="divide-y">
                  {licenses.map((license) => (
                    <div key={license.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{license.digital_products?.name}</h3>
                          <p className="text-sm text-muted-foreground">{license.customer_email}</p>
                        </div>
                        {getStatusBadge(license.status)}
                      </div>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono">{license.license_key}</code>
                          <Key className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Downloads:</span>
                          <span className="ml-1 font-medium">{license.download_count}/{license.max_downloads}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Activations:</span>
                          <span className="ml-1 font-medium">{license.activation_count}/{license.max_activations}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>
                          <span className="ml-1 font-medium">
                            {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading logs...</div>
              </Card>
            ) : logs.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No download logs yet</div>
              </Card>
            ) : (
              <Card>
                <div className="divide-y">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.digital_products?.name}</span>
                          {log.success ? (
                            <Badge>Success</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{log.customer_email}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {log.ip_address} • {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {loading ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">Loading alerts...</div>
              </Card>
            ) : alerts.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">No security alerts</div>
              </Card>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold capitalize">{alert.alert_type.replace('_', ' ')}</span>
                          <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.digital_products?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
