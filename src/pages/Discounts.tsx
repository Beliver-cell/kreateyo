import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Percent, Gift, Ticket, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Discounts() {
  const [autoApply, setAutoApply] = useState(false);
  const [stackable, setStackable] = useState(false);

  const handleSaveDiscount = () => {
    toast({
      title: "Discount saved",
      description: "Your discount has been created successfully"
    });
  };

  const activeCoupons = [
    { code: "WELCOME10", type: "Percentage", value: "10%", uses: "45/100", status: "Active" },
    { code: "SUMMER25", type: "Fixed Amount", value: "$25", uses: "12/50", status: "Active" },
    { code: "FREESHIP", type: "Free Shipping", value: "-", uses: "89/∞", status: "Active" },
  ];

  const giftCards = [
    { code: "GC-2024-001", balance: "$100.00", used: "$35.00", remaining: "$65.00" },
    { code: "GC-2024-002", balance: "$50.00", used: "$0.00", remaining: "$50.00" },
    { code: "GC-2024-003", balance: "$75.00", used: "$75.00", remaining: "$0.00" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discounts & Promotions</h1>
        <p className="text-muted-foreground">
          Create and manage discount codes, coupons, and gift cards
        </p>
      </div>

      {/* Create New Discount */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Create New Discount</CardTitle>
                <CardDescription>Set up a discount code or automatic discount</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-code">Discount Code</Label>
              <Input id="discount-code" placeholder="e.g., SAVE20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select>
                <SelectTrigger id="discount-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                  <SelectItem value="shipping">Free Shipping</SelectItem>
                  <SelectItem value="bogo">Buy One Get One</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-value">Discount Value</Label>
              <Input id="discount-value" type="number" placeholder="e.g., 20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-purchase">Minimum Purchase</Label>
              <Input id="min-purchase" type="number" placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit</Label>
              <Input id="usage-limit" type="number" placeholder="Unlimited" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="auto-apply" className="cursor-pointer font-semibold">
                Auto-apply at Checkout
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically apply this discount to eligible orders
              </p>
            </div>
            <Switch id="auto-apply" checked={autoApply} onCheckedChange={setAutoApply} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="stackable" className="cursor-pointer font-semibold">
                Stackable with Other Discounts
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow combining with other discount codes
              </p>
            </div>
            <Switch id="stackable" checked={stackable} onCheckedChange={setStackable} />
          </div>

          <Button onClick={handleSaveDiscount} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Discount Code
          </Button>
        </CardContent>
      </Card>

      {/* Active Coupons */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Active Coupon Codes</CardTitle>
              <CardDescription>Manage your active discount codes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeCoupons.map((coupon, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <code className="px-2 py-1 bg-primary/10 text-primary rounded font-mono text-sm">
                      {coupon.code}
                    </code>
                    <span className="text-sm text-muted-foreground">{coupon.type}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="font-semibold text-primary">{coupon.value}</span>
                    <span className="text-muted-foreground">Used: {coupon.uses}</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">
                      {coupon.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gift Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Gift Cards</CardTitle>
                <CardDescription>Manage and issue gift cards for customers</CardDescription>
              </div>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Issue New Gift Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {giftCards.map((card, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <code className="text-sm font-mono">{card.code}</code>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Balance: </span>
                      <span className="font-semibold">{card.balance}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Used: </span>
                      <span className="font-semibold">{card.used}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining: </span>
                      <span className="font-semibold text-primary">{card.remaining}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discount Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">3 expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground mt-1">+23% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Discount Value Given
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$8,450</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gift Card Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$4,225</p>
            <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
