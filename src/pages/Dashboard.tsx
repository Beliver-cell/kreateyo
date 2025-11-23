import { useBusinessContext } from '@/contexts/BusinessContext';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { businessProfile } = useBusinessContext();
  const navigate = useNavigate();

  const isProductStore = businessProfile.type === 'physical' || businessProfile.type === 'dropship';
  const isServiceStore = businessProfile.type === 'service';
  const isDigitalStore = businessProfile.type === 'digital';

  const getMetrics = () => {
    if (isProductStore) {
      return [
        { title: 'Revenue', value: '$12,345', change: '+12.5%', icon: DollarSign, trending: 'up' },
        { title: 'Orders', value: '156', change: '+8.2%', icon: ShoppingCart, trending: 'up' },
        { title: 'Products', value: '89', change: '+3', icon: Package, trending: 'up' },
        { title: 'Customers', value: '1,234', change: '+15.3%', icon: Users, trending: 'up' },
      ];
    } else if (isServiceStore) {
      return [
        { title: 'Revenue', value: '$8,750', change: '+10.2%', icon: DollarSign, trending: 'up' },
        { title: 'Bookings', value: '42', change: '+5', icon: Calendar, trending: 'up' },
        { title: 'Services', value: '12', change: '+2', icon: TrendingUp, trending: 'up' },
        { title: 'Clients', value: '234', change: '+12%', icon: Users, trending: 'up' },
      ];
    } else {
      return [
        { title: 'Views', value: '24.5K', change: '+18.2%', icon: TrendingUp, trending: 'up' },
        { title: 'Posts', value: '48', change: '+4', icon: FileText, trending: 'up' },
        { title: 'Subscribers', value: '1,850', change: '+25%', icon: Users, trending: 'up' },
        { title: 'Engagement', value: '8.5%', change: '+2.1%', icon: DollarSign, trending: 'up' },
      ];
    }
  };

  const getActivityData = () => {
    if (isProductStore) {
      return [
        { text: 'New order #1842 - $234.99', time: '5 minutes ago', type: 'order' },
        { text: 'Low stock alert: Running Shoes', time: '1 hour ago', type: 'alert' },
        { text: '3 new customer signups', time: '2 hours ago', type: 'customer' },
        { text: 'Product "Yoga Mat" went live', time: '3 hours ago', type: 'product' },
      ];
    } else if (isServiceStore) {
      return [
        { text: 'New booking: Personal Training - 3:00 PM', time: '10 minutes ago', type: 'booking' },
        { text: 'Reminder: Client meeting in 30 mins', time: '30 minutes ago', type: 'reminder' },
        { text: 'Sarah Johnson left a 5-star review', time: '1 hour ago', type: 'review' },
        { text: 'Weekly schedule updated', time: '2 hours ago', type: 'schedule' },
      ];
    } else {
      return [
        { text: 'New subscriber from newsletter signup', time: '15 minutes ago', type: 'subscriber' },
        { text: 'Post "Getting Started" reached 1K views', time: '1 hour ago', type: 'milestone' },
        { text: '12 new comments on recent posts', time: '2 hours ago', type: 'engagement' },
        { text: 'Draft "Advanced Tips" ready for review', time: '3 hours ago', type: 'draft' },
      ];
    }
  };

  const metrics = getMetrics();
  const activityData = getActivityData();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
          Welcome back! Here's an overview of your {businessProfile.type} business.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3 space-y-0">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-3 md:pb-4">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">{metric.value}</div>
                <div className="flex items-center gap-0.5 md:gap-1 mt-1 md:mt-2">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <p className="text-xs md:text-sm text-primary font-medium">{metric.change}</p>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1 hidden sm:inline">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-border">
          <CardHeader className="space-y-1 pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl font-semibold">Recent Activity</CardTitle>
            <CardDescription>
              {isProductStore && 'Latest orders, inventory, and customer updates'}
              {isServiceStore && 'Today\'s appointments and client interactions'}
              {isDigitalStore && 'Subscriber growth and post performance'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {activityData.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary mt-1.5 md:mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-foreground">{activity.text}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="space-y-1 pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2 md:space-y-3">
              <button 
                onClick={() => {
                  if (isProductStore) navigate('/products');
                  else if (isServiceStore) navigate('/calendar');
                  else navigate('/posts');
                }}
                className="w-full text-left p-2 md:p-3 lg:p-4 border border-border rounded-lg md:rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-semibold group-hover:text-primary transition-colors">
                      {isProductStore && 'Add New Product'}
                      {isServiceStore && 'Create New Booking'}
                      {isDigitalStore && 'Write New Post'}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-1.5">Start creating content</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {isProductStore && <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    {isServiceStore && <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    {isDigitalStore && <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                  </div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/analytics')}
                className="w-full text-left p-2 md:p-3 lg:p-4 border border-border rounded-lg md:rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-semibold group-hover:text-primary transition-colors">View Analytics</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-1.5">Check performance metrics</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/settings')}
                className="w-full text-left p-2 md:p-3 lg:p-4 border border-border rounded-lg md:rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-semibold group-hover:text-primary transition-colors">Store Settings</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-1.5">Configure your store</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
