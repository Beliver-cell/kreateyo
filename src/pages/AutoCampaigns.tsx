import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Zap, Mail, MessageSquare, Phone, Play, Pause, Loader2, TrendingUp, Users, Send, Target } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  campaign_type: string;
  channel: string;
  script_template: string | null;
  rules: Record<string, unknown>;
  stats: { sent: number; opened: number; replied: number; converted: number };
  created_at: string;
}

export default function AutoCampaigns() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    channel: 'email',
    script_template: '',
  });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['lead_campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(c => ({
        ...c,
        stats: { 
          sent: ((c.stats as any)?.sent || 0), 
          opened: ((c.stats as any)?.opened || 0), 
          replied: ((c.stats as any)?.replied || 0), 
          converted: ((c.stats as any)?.converted || 0) 
        }
      })) as Campaign[];
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: typeof newCampaign) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase.from('lead_campaigns').insert({
        user_id: user.id,
        name: campaign.name,
        description: campaign.description || null,
        channel: campaign.channel,
        script_template: campaign.script_template || null,
        status: 'active',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_campaigns'] });
      setIsCreateOpen(false);
      setNewCampaign({ name: '', description: '', channel: 'email', script_template: '' });
      toast.success('Campaign created successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  const toggleCampaignMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('lead_campaigns')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_campaigns'] });
      toast.success('Campaign updated');
    },
  });

  const runCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await supabase.functions.invoke('ai-outreach', {
        body: { campaign_id: campaignId },
      });
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead_campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Campaign executed: ${data.sent} messages sent`);
    },
    onError: (error) => toast.error(error.message),
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const totalStats = campaigns.reduce((acc, c) => {
    const stats = c.stats || { sent: 0, opened: 0, replied: 0, converted: 0 };
    return {
      sent: acc.sent + stats.sent,
      opened: acc.opened + stats.opened,
      replied: acc.replied + stats.replied,
      converted: acc.converted + stats.converted,
    };
  }, { sent: 0, opened: 0, replied: 0, converted: 0 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Auto Campaigns</h1>
            <p className="text-muted-foreground">Automated AI-powered outreach campaigns</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Campaign</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input 
                    value={newCampaign.name} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} 
                    placeholder="Summer Outreach"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={newCampaign.description} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    placeholder="Campaign goals and target audience..."
                  />
                </div>
                <div>
                  <Label>Channel</Label>
                  <Select value={newCampaign.channel} onValueChange={(v) => setNewCampaign({ ...newCampaign, channel: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Script Template (optional)</Label>
                  <Textarea 
                    value={newCampaign.script_template} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, script_template: e.target.value })}
                    placeholder="Hi {{name}}, ..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use {"{{name}}"}, {"{{email}}"} for personalization. AI will enhance this.</p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => createCampaignMutation.mutate(newCampaign)} 
                  disabled={createCampaignMutation.isPending || !newCampaign.name}
                >
                  {createCampaignMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Send className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{totalStats.sent}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><Mail className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Opened</p>
                <p className="text-2xl font-bold">{totalStats.opened}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><MessageSquare className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold">{totalStats.replied}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Target className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold">{totalStats.converted}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">Create your first automated outreach campaign</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const stats = campaign.stats || { sent: 0, opened: 0, replied: 0, converted: 0 };
              return (
                <Card key={campaign.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(campaign.channel)}
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    {campaign.description && (
                      <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold">{stats.sent}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stats.opened}</p>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stats.replied}</p>
                        <p className="text-xs text-muted-foreground">Replied</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{stats.converted}</p>
                        <p className="text-xs text-muted-foreground">Converted</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => runCampaignMutation.mutate(campaign.id)}
                        disabled={runCampaignMutation.isPending || campaign.status !== 'active'}
                      >
                        {runCampaignMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Run Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCampaignMutation.mutate({ id: campaign.id, status: campaign.status })}
                      >
                        {campaign.status === 'active' ? (
                          <><Pause className="h-4 w-4 mr-2" /> Pause</>
                        ) : (
                          <><Play className="h-4 w-4 mr-2" /> Resume</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
