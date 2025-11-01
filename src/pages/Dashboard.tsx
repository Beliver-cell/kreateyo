import { useBusinessContext } from '@/contexts/BusinessContext';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { businessProfile } = useBusinessContext();

  const getMetrics = () => {
    if (businessProfile.type === 'ecommerce') {
      return [
        { title: 'Revenue', value: '$12,345', change: '+12.5%', icon: DollarSign },
        { title: 'Orders', value: '156', change: '+8.2%', icon: ShoppingCart },
        { title: 'Products', value: '89', change: '+3', icon: TrendingUp },
        { title: 'Customers', value: '1,234', change: '+15.3%', icon: Users },
      ];
    } else if (businessProfile.type === 'services') {
      return [
        { title: 'Revenue', value: '$8,750', change: '+10.2%', icon: DollarSign },
        { title: 'Bookings', value: '42', change: '+5', icon: ShoppingCart },
        { title: 'Services', value: '12', change: '+2', icon: TrendingUp },
        { title: 'Clients', value: '234', change: '+12%', icon: Users },
      ];
    } else {
      return [
        { title: 'Views', value: '24.5K', change: '+18.2%', icon: TrendingUp },
        { title: 'Posts', value: '48', change: '+4', icon: ShoppingCart },
        { title: 'Subscribers', value: '1,850', change: '+25%', icon: Users },
        { title: 'Engagement', value: '8.5%', change: '+2.1%', icon: DollarSign },
      ];
    }
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your {businessProfile.type} business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-success mt-1">{metric.change} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity {i}</p>
                    <p className="text-xs text-muted-foreground">{i} hour{i > 1 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
                <p className="font-medium">
                  {businessProfile.type === 'ecommerce' && 'Add New Product'}
                  {businessProfile.type === 'services' && 'Create New Service'}
                  {businessProfile.type === 'blog' && 'Write New Post'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Start creating content</p>
              </button>
              <button className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
                <p className="font-medium">Customize Your Site</p>
                <p className="text-sm text-muted-foreground mt-1">Edit design and layout</p>
              </button>
              <button className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground mt-1">Track your performance</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
