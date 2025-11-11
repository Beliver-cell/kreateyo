import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, TrendingUp, DollarSign, MousePointer, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function MarketingCampaigns() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "google_ads",
    budget: "",
    start_date: "",
    end_date: ""
  });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["marketing-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("marketing_campaigns").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      setDialogOpen(false);
      toast.success("Campaign created successfully");
      setFormData({ name: "", description: "", platform: "google_ads", budget: "", start_date: "", end_date: "" });
    },
    onError: () => toast.error("Failed to create campaign")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null
    });
  };

  const stats = campaigns?.reduce((acc, c) => ({
    totalBudget: acc.totalBudget + (Number(c.budget) || 0),
    totalSpent: acc.totalSpent + (Number(c.spent) || 0),
    totalImpressions: acc.totalImpressions + (c.impressions || 0),
    totalClicks: acc.totalClicks + (c.clicks || 0),
    totalConversions: acc.totalConversions + (c.conversions || 0),
    totalRevenue: acc.totalRevenue + (Number(c.revenue) || 0)
  }), { totalBudget: 0, totalSpent: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0, totalRevenue: 0 });

  const avgCTR = stats && stats.totalImpressions > 0 
    ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2) 
    : "0.00";
  const avgROI = stats && stats.totalSpent > 0 
    ? (((stats.totalRevenue - stats.totalSpent) / stats.totalSpent) * 100).toFixed(2) 
    : "0.00";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Campaign Performance Tracker</h1>
            <p className="text-muted-foreground">Track and optimize your marketing campaigns</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Platform</Label>
                  <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Budget</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input 
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input 
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Campaign</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalImpressions.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">CTR: {avgCTR}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Budget: ${stats?.totalBudget.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgROI}%</div>
              <p className="text-xs text-muted-foreground">Revenue: ${stats?.totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : campaigns && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{campaign.platform.replace('_', ' ')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-semibold">{campaign.impressions?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-semibold">{campaign.clicks?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-semibold">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-semibold">${Number(campaign.spent).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No campaigns yet. Create your first campaign!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}