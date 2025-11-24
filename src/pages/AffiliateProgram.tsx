import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, TrendingUp, Link as LinkIcon, Plus } from "lucide-react";

const AffiliateProgram = () => {
  const affiliates = [
    { id: 1, name: "John Marketing", sales: 45, earnings: "$2,250", commission: "20%" },
    { id: 2, name: "Jane Blogger", sales: 32, earnings: "$1,920", commission: "25%" },
    { id: 3, name: "Tech Reviews Co", sales: 78, earnings: "$4,680", commission: "15%" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Affiliate Program</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage affiliates, commissions, and payouts
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Invite Affiliate
        </Button>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87</p>
            <p className="text-xs text-green-500 mt-1">+12 this month</p>
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
            <p className="text-2xl font-bold">$127,420</p>
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
            <p className="text-2xl font-bold">$19,113</p>
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
            <p className="text-2xl font-bold">4.2%</p>
            <p className="text-xs text-green-500 mt-1">+0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Settings */}
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
                <Input id="default-rate" type="number" defaultValue="15" className="flex-1" />
                <span className="text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookie-duration">Cookie Duration</Label>
              <div className="flex items-center gap-2">
                <Input id="cookie-duration" type="number" defaultValue="30" className="flex-1" />
                <span className="text-sm">days</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Tier-Based Commissions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <span className="text-sm">Bronze (0-50 sales)</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <span className="text-sm">Silver (51-100 sales)</span>
                <span className="font-bold">20%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded">
                <span className="text-sm">Gold (101+ sales)</span>
                <span className="font-bold">25%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Affiliates */}
      <Card>
        <CardHeader>
          <CardTitle>Top Affiliates</CardTitle>
          <CardDescription>
            Your highest performing partners this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {affiliates.map((affiliate, index) => (
              <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{affiliate.name}</p>
                    <p className="text-sm text-muted-foreground">{affiliate.sales} sales</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="font-bold">{affiliate.earnings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-bold">{affiliate.commission}</p>
                  </div>
                  <Button size="sm">Pay</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout Management */}
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
                <p className="text-2xl font-bold">$19,113</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                35 affiliates eligible for payment
              </p>
              <Button className="w-full">Process All Payouts</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p className="text-2xl font-bold">$19,113</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Paid (Year)</p>
                <p className="text-2xl font-bold">$147,856</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
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
              <p className="text-2xl font-bold">45,234</p>
              <p className="text-xs text-green-500 mt-1">+18% from last month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Conversions</p>
              <p className="text-2xl font-bold">1,899</p>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold">$67.12</p>
              <p className="text-xs text-muted-foreground mt-1">From affiliate sales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateProgram;
