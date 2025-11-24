import { useState } from 'react';
import { Plus, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';

export default function Upsells() {
  const [upsells, setUpsells] = useState([
    {
      id: 1,
      name: 'Premium Support Package',
      triggerProduct: 'Website Hosting',
      upsellProducts: ['Priority Support', 'Site Backup'],
      conversionRate: 23,
      revenue: 2340,
      active: true,
    },
    {
      id: 2,
      name: 'Extended Warranty Bundle',
      triggerProduct: 'Electronics',
      upsellProducts: ['2-Year Warranty', 'Protection Plan'],
      conversionRate: 18,
      revenue: 1890,
      active: true,
    },
  ]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Upsells & Cross-sells</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              Boost revenue with strategic product recommendations
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Upsell
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Upsell Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,230</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20.5%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Upsells</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upsells.length}</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {upsells.map(upsell => (
            <Card key={upsell.id} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{upsell.name}</h3>
                      <Badge variant={upsell.active ? 'default' : 'secondary'}>
                        {upsell.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Trigger:</span> {upsell.triggerProduct}
                      </div>
                      <div>
                        <span className="font-medium">Offers:</span>{' '}
                        {upsell.upsellProducts.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{upsell.conversionRate}%</div>
                      <div className="text-xs text-muted-foreground">Conversion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">${upsell.revenue}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Stats
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Upsell</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upsellName">Upsell Name</Label>
                <Input id="upsellName" placeholder="e.g., Premium Bundle Offer" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="triggerProduct">Trigger Product</Label>
                  <Input id="triggerProduct" placeholder="Select product that triggers upsell" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upsellProduct">Upsell Products</Label>
                  <Input id="upsellProduct" placeholder="Select products to offer" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="autoActivate" />
                <Label htmlFor="autoActivate">Activate immediately</Label>
              </div>

              <Button type="submit" size="lg">
                Create Upsell
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
