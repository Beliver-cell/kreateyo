import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, TrendingUp, Package, Globe, Link2, Plus, Eye, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EcommerceDropshippingDashboard() {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Profit Margin', value: '32.5%', change: '+5.2%', icon: TrendingUp, trending: 'up' as const },
    { title: 'Imported Products', value: '234', change: '+12 today', icon: Package, trending: 'up' as const },
    { title: 'Orders Processing', value: '45', change: 'Auto-sync active', icon: Truck, trending: 'neutral' as const },
    { title: 'Suppliers', value: '8', change: 'All connected', icon: Globe, trending: 'neutral' as const }
  ];

  const supplierPerformance = [
    { supplier: 'AliExpress - Electronics', orders: 23, avgShipping: '12 days', rating: 4.8 },
    { supplier: 'Oberlo - Fashion', orders: 18, avgShipping: '8 days', rating: 4.9 },
    { supplier: 'Spocket - Home Decor', orders: 15, avgShipping: '6 days', rating: 4.7 }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dropshipping Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your dropshipping business and supplier connections</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">{metric.title}</span>
              <metric.icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </div>
            <div className="text-xl md:text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-xs text-green-600">{metric.change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Supplier Performance</h2>
          <div className="space-y-3 md:space-y-4">
            {supplierPerformance.map((supplier, index) => (
              <div key={index} className="p-3 md:p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-xs md:text-sm">{supplier.supplier}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">★ {supplier.rating}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Orders: {supplier.orders}</div>
                  <div>Shipping: {supplier.avgShipping}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Dropshipping Tools</h2>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            <Button onClick={() => navigate('/suppliers')} className="w-full justify-start" variant="outline">
              <Link2 className="h-4 w-4 mr-2" />
              Connect Supplier
            </Button>
            <Button onClick={() => navigate('/products')} className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Import Products
            </Button>
            <Button onClick={() => navigate('/analytics')} className="w-full justify-start" variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Profit Calculator
            </Button>
            <Button onClick={() => navigate('/orders')} className="w-full justify-start" variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Track Shipments
            </Button>
            <Button onClick={() => navigate('/inventory')} className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Inventory Sync
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
