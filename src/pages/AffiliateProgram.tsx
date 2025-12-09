import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, TrendingUp, Link as LinkIcon, Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Affiliate {
  id: string;
  affiliateId: string;
  code: string;
  salesCount: number;
  earnings: string;
  commissionRate: string;
  metadata?: {
    name?: string;
    email?: string;
  };
}

interface Stats {
  totalAffiliates: number;
  totalSales: string;
  commissionsOwed: string;
  clickThroughRate: string;
}

interface Settings {
  defaultRate: number;
  cookieDuration: number;
  tiers: Array<{
    name: string;
    minSales: number;
    maxSales: number | null;
    rate: number;
  }>;
}

const AffiliateProgram = () => {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAffiliates: 0,
    totalSales: "0",
    commissionsOwed: "0",
    clickThroughRate: "0%",
  });
  const [settings, setSettings] = useState<Settings>({
    defaultRate: 15,
    cookieDuration: 30,
    tiers: [
      { name: "Bronze", minSales: 0, maxSales: 50, rate: 15 },
      { name: "Silver", minSales: 51, maxSales: 100, rate: 20 },
      { name: "Gold", minSales: 101, maxSales: null, rate: 25 },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", name: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState<string | null>(null);
  const [processAllLoading, setProcessAllLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [affiliatesRes, statsRes, settingsRes] = await Promise.all([
        api.get("/affiliates"),
        api.get("/affiliates/stats"),
        api.get("/affiliates/settings"),
      ]);
      setAffiliates(affiliatesRes.data.affiliates || []);
      setStats(statsRes.data);
      setSettings(settingsRes.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load affiliate data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAffiliate = async () => {
    if (!inviteForm.email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setInviteLoading(true);
    try {
      await api.post("/affiliates/invite", inviteForm);
      toast({
        title: "Success",
        description: "Affiliate invitation sent successfully",
      });
      setInviteDialogOpen(false);
      setInviteForm({ email: "", name: "" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to invite affiliate",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handlePayout = async (affiliateId: string) => {
    setPayoutLoading(affiliateId);
    try {
      await api.post(`/affiliates/${affiliateId}/payout`);
      toast({
        title: "Success",
        description: "Payout processed successfully",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to process payout",
        variant: "destructive",
      });
    } finally {
      setPayoutLoading(null);
    }
  };

  const handleProcessAllPayouts = async () => {
    setProcessAllLoading(true);
    try {
      const response = await api.post("/affiliates/payout-all");
      toast({
        title: "Success",
        description: `Processed ${response.data.payoutsProcessed} payouts totaling $${response.data.totalAmount}`,
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to process payouts",
        variant: "destructive",
      });
    } finally {
      setProcessAllLoading(false);
    }
  };

  const handleSettingsChange = async (field: string, value: number) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    
    setSettingsLoading(true);
    try {
      await api.put("/affiliates/settings", { [field]: value });
      toast({
        title: "Settings Updated",
        description: "Commission settings saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "$0" : `$${num.toLocaleString()}`;
  };

  const getAffiliateName = (affiliate: Affiliate) => {
    return affiliate.metadata?.name || affiliate.metadata?.email || `Affiliate ${affiliate.code}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Affiliate Program</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage affiliates, commissions, and payouts
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setInviteDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Affiliate
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Affiliates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalAffiliates}</p>
              <p className="text-xs text-muted-foreground mt-1">Total affiliates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</p>
              <p className="text-xs text-muted-foreground mt-1">Generated this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Commissions Owed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(stats.commissionsOwed)}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending payout</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Click-Through Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.clickThroughRate}</p>
              <p className="text-xs text-muted-foreground mt-1">Conversion rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>
              Configure how affiliates earn commissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-rate">Default Commission Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="default-rate"
                    type="number"
                    value={settings.defaultRate}
                    onChange={(e) => handleSettingsChange("defaultRate", parseInt(e.target.value) || 0)}
                    className="flex-1"
                    disabled={settingsLoading}
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookie-duration">Cookie Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="cookie-duration"
                    type="number"
                    value={settings.cookieDuration}
                    onChange={(e) => handleSettingsChange("cookieDuration", parseInt(e.target.value) || 0)}
                    className="flex-1"
                    disabled={settingsLoading}
                  />
                  <span className="text-sm">days</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Tier-Based Commissions</h4>
              <div className="space-y-2">
                {settings.tiers.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                    <span className="text-sm">
                      {tier.name} ({tier.minSales}-{tier.maxSales ?? "∞"} sales)
                    </span>
                    <span className="font-bold">{tier.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Affiliates</CardTitle>
            <CardDescription>
              Your highest performing partners this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No affiliates yet. Invite your first affiliate to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {affiliates.map((affiliate, index) => (
                  <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{getAffiliateName(affiliate)}</p>
                        <p className="text-sm text-muted-foreground">{affiliate.salesCount} sales</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                        <p className="font-bold">{formatCurrency(affiliate.earnings)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rate</p>
                        <p className="font-bold">{(parseFloat(affiliate.commissionRate) * 100).toFixed(0)}%</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handlePayout(affiliate.id)}
                        disabled={payoutLoading === affiliate.id}
                      >
                        {payoutLoading === affiliate.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Pay"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout Processing</CardTitle>
            <CardDescription>
              Manage affiliate commission payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Ready for Payout</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.commissionsOwed)}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {affiliates.length} affiliates eligible for payment
                </p>
                <Button
                  className="w-full"
                  onClick={handleProcessAllPayouts}
                  disabled={processAllLoading || parseFloat(stats.commissionsOwed) <= 0}
                >
                  {processAllLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process All Payouts"
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.commissionsOwed)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Paid (Year)</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Track affiliate program success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
                <p className="text-2xl font-bold">
                  {affiliates.reduce((sum, a) => sum + (a.salesCount || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">From affiliate links</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                <p className="text-2xl font-bold">
                  {affiliates.reduce((sum, a) => sum + (a.salesCount || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Successful sales</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  {affiliates.length > 0
                    ? formatCurrency(
                        parseFloat(stats.totalSales) /
                          Math.max(affiliates.reduce((sum, a) => sum + (a.salesCount || 0), 0), 1)
                      )
                    : "$0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">From affiliate sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Affiliate</DialogTitle>
            <DialogDescription>
              Send an invitation to join your affiliate program
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="affiliate@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-name">Name (Optional)</Label>
              <Input
                id="invite-name"
                placeholder="John Doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteAffiliate} disabled={inviteLoading}>
              {inviteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AffiliateProgram;
