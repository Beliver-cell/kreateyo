import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Zap, Search, ShoppingCart, Play, Loader2, TrendingUp, Users, 
  Target, CheckCircle2, AlertCircle, Upload, RefreshCw, BarChart3
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ApifyLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  platform: string;
  price: number;
  category: string;
}

interface ActivationStats {
  total: number;
  contacted: number;
  engaged: number;
  converted: number;
  progress: number;
}

const SAMPLE_APIFY_LEADS: ApifyLead[] = [
  { id: '1', name: 'Business Owners Pack', email: '500 verified emails', source: 'apify', platform: 'linkedin', price: 49, category: 'B2B' },
  { id: '2', name: 'E-commerce Shoppers', email: '1000 buyer emails', source: 'apify', platform: 'instagram', price: 79, category: 'B2C' },
  { id: '3', name: 'Service Seekers', email: '300 hot leads', source: 'apify', platform: 'google', price: 39, category: 'Services' },
  { id: '4', name: 'Digital Product Buyers', email: '750 verified buyers', source: 'apify', platform: 'twitter', price: 59, category: 'Digital' },
  { id: '5', name: 'Local Business Owners', email: '400 local contacts', source: 'apify', platform: 'facebook', price: 45, category: 'Local' },
];

export default function LeadEngine() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationStats, setActivationStats] = useState<ActivationStats | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const purchaseLeadsMutation = useMutation({
    mutationFn: async (leadPack: ApifyLead) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Simulate purchasing and importing leads
      const sampleLeads = Array.from({ length: 10 }, (_, i) => ({
        user_id: user.id,
        name: `Lead ${i + 1} from ${leadPack.name}`,
        email: `lead${i + 1}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        source: leadPack.source,
        platform: leadPack.platform,
        status: 'new',
        tags: [leadPack.category],
        score: Math.floor(Math.random() * 100),
      }));

      const { error } = await supabase.from('leads').insert(sampleLeads);
      if (error) throw error;

      // Trigger auto-processing
      await supabase.functions.invoke('process-leads', {
        body: { user_id: user.id },
      });

      return leadPack;
    },
    onSuccess: (leadPack) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Successfully purchased ${leadPack.name}! Leads imported and processing...`);
    },
    onError: (error) => toast.error(error.message),
  });

  const importCSVMutation = useMutation({
    mutationFn: async (csv: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const lines = csv.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const leadsToImport = lines.slice(1).map(line => {
        const values = line.split(',');
        const lead: { user_id: string; status: string; source: string; name?: string; email?: string; phone?: string } = { 
          user_id: user.id, 
          status: 'new', 
          source: 'csv' 
        };
        headers.forEach((header, i) => {
          if (header === 'name') lead.name = values[i]?.trim();
          if (header === 'email') lead.email = values[i]?.trim();
          if (header === 'phone') lead.phone = values[i]?.trim();
        });
        return lead;
      }).filter(l => l.email);

      const { error } = await supabase.from('leads').insert(leadsToImport);
      if (error) throw error;

      await supabase.functions.invoke('process-leads', {
        body: { user_id: user.id },
      });

      return leadsToImport.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setCsvContent('');
      toast.success(`Imported ${count} leads successfully! Auto-processing started.`);
    },
    onError: (error) => toast.error(error.message),
  });

  const activateLeadsMutation = useMutation({
    mutationFn: async () => {
      setIsActivating(true);
      setActivationStats({ total: leads.length, contacted: 0, engaged: 0, converted: 0, progress: 0 });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Simulate progressive activation
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setActivationStats(prev => prev ? {
          ...prev,
          progress: i,
          contacted: Math.floor((i / 100) * leads.length * 0.8),
          engaged: Math.floor((i / 100) * leads.length * 0.3),
          converted: Math.floor((i / 100) * leads.length * 0.1),
        } : null);
      }

      // Trigger actual AI outreach
      const response = await supabase.functions.invoke('ai-outreach', {
        body: { user_id: user.id },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`AI Outreach activated! ${data?.sent || 0} messages sent.`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsActivating(false);
    },
  });

  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = leads.length > 0 ? ((convertedLeads / leads.length) * 100).toFixed(1) : '0';

  const filteredApifyLeads = SAMPLE_APIFY_LEADS.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lead Engine</h1>
            <p className="text-muted-foreground">Browse, purchase, and activate leads with AI outreach</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Import CSV</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Leads from CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>CSV Content</Label>
                    <Textarea
                      placeholder="name,email,phone&#10;John Doe,john@example.com,+1234567890"
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Headers: name, email, phone</p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => importCSVMutation.mutate(csvContent)}
                    disabled={importCSVMutation.isPending || !csvContent.trim()}
                  >
                    {importCSVMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Import & Auto-Process
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => activateLeadsMutation.mutate()}
              disabled={activateLeadsMutation.isPending || leads.length === 0}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {activateLeadsMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Activate Leads
            </Button>
          </div>
        </div>

        {/* Activation Progress */}
        {isActivating && activationStats && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 animate-pulse">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI Outreach in Progress</h3>
                  <p className="text-sm text-muted-foreground">Processing {activationStats.total} leads...</p>
                </div>
              </div>
              <Progress value={activationStats.progress} className="h-2 mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{activationStats.contacted}</p>
                  <p className="text-xs text-muted-foreground">Contacted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{activationStats.engaged}</p>
                  <p className="text-xs text-muted-foreground">Engaged</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{activationStats.converted}</p>
                  <p className="text-xs text-muted-foreground">Converted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><AlertCircle className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold">{newLeads}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><Target className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">{contactedLeads}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold">{convertedLeads}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Rate Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Instant Conversion Rate</p>
                <p className="text-3xl font-bold">{conversionRate}%</p>
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500 opacity-50" />
          </CardContent>
        </Card>

        {/* Browse Apify Leads */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Browse & Buy Leads
                </CardTitle>
                <CardDescription>Purchase lead packs from Apify marketplace</CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search lead packs..." 
                  className="pl-9 w-full sm:w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredApifyLeads.map((leadPack) => (
                <Card key={leadPack.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{leadPack.name}</h4>
                        <p className="text-sm text-muted-foreground">{leadPack.email}</p>
                      </div>
                      <Badge variant="secondary">{leadPack.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{leadPack.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${leadPack.price}</span>
                        <Button 
                          size="sm" 
                          onClick={() => purchaseLeadsMutation.mutate(leadPack)}
                          disabled={purchaseLeadsMutation.isPending}
                        >
                          {purchaseLeadsMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Buy'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recently Imported */}
        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {(lead.name || lead.email)?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{lead.name || lead.email}</p>
                        <p className="text-xs text-muted-foreground">{lead.source} • {lead.platform || 'Unknown'}</p>
                      </div>
                    </div>
                    <Badge variant={
                      lead.status === 'converted' ? 'default' :
                      lead.status === 'contacted' ? 'secondary' : 'outline'
                    }>
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
