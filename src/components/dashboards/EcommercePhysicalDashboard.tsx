import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, Users, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EcommercePhysicalDashboard() {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Total Sales', value: '$12,450', change: '+12.5%', icon: TrendingUp, trending: 'up' as const },
    { title: 'Products', value: '45', change: '+3 this week', icon: Package, trending: 'up' as const },
    { title: 'Orders', value: '128', change: '+8.2%', icon: ShoppingCart, trending: 'up' as const },
    { title: 'Customers', value: '342', change: '+15.3%', icon: Users, trending: 'up' as const }
  ];

  const recentActivity = [
    { text: 'New order received - $125.00', time: '5 minutes ago', type: 'order' },
    { text: 'Product "Summer T-Shirt" low stock', time: '1 hour ago', type: 'inventory' },
    { text: 'New customer registered', time: '2 hours ago', type: 'customer' },
    { text: 'Shipping label created for Order #1234', time: '3 hours ago', type: 'shipping' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Physical Products Dashboard</h1>
        <p className="text-muted-foreground">Manage your e-commerce store selling physical products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-xs text-green-600">{metric.change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => navigate('/products')} className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button onClick={() => navigate('/orders')} className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
            <Button onClick={() => navigate('/inventory-manager')} className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Manage Inventory
            </Button>
            <Button onClick={() => navigate('/customers')} className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Customers
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
