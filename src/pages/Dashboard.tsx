import { useBusinessContext } from '@/contexts/BusinessContext';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { businessProfile } = useBusinessContext();
  const navigate = useNavigate();

  const getMetrics = () => {
    if (businessProfile.type === 'ecommerce') {
      return [
        { title: 'Revenue', value: '$12,345', change: '+12.5%', icon: DollarSign, trending: 'up' },
        { title: 'Orders', value: '156', change: '+8.2%', icon: ShoppingCart, trending: 'up' },
        { title: 'Products', value: '89', change: '+3', icon: Package, trending: 'up' },
        { title: 'Customers', value: '1,234', change: '+15.3%', icon: Users, trending: 'up' },
      ];
    } else if (businessProfile.type === 'services') {
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
    if (businessProfile.type === 'ecommerce') {
      return [
        { text: 'New order #1842 - $234.99', time: '5 minutes ago', type: 'order' },
        { text: 'Low stock alert: Running Shoes', time: '1 hour ago', type: 'alert' },
        { text: '3 new customer signups', time: '2 hours ago', type: 'customer' },
        { text: 'Product "Yoga Mat" went live', time: '3 hours ago', type: 'product' },
      ];
    } else if (businessProfile.type === 'services') {
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
  const businessHealth = 8.5;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Welcome back! Here's an overview of your {businessProfile.type} business.
            </p>
          </div>
          <Card className="p-3 md:w-auto flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{businessHealth}</div>
                <p className="text-[10px] text-muted-foreground">Health Score</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="space-y-1 min-w-[100px]">
                <Progress value={businessHealth * 10} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground">Excellent</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl md:text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <p className="text-[10px] text-success font-medium">{metric.change}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Recent Activity</CardTitle>
                <CardDescription className="text-xs">
                  {businessProfile.type === 'ecommerce' && 'Latest orders, inventory, and customer updates'}
                  {businessProfile.type === 'services' && 'Today\'s appointments and client interactions'}
                  {businessProfile.type === 'blog' && 'Subscriber growth and post performance'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {activityData.map((activity, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{activity.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                      {activity.type === 'alert' && (
                        <AlertCircle className="w-3 h-3 text-warning flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                    <CardDescription className="text-xs">Common tasks and shortcuts</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {businessProfile.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      if (businessProfile.type === 'ecommerce') navigate('/products');
                      else if (businessProfile.type === 'services') navigate('/calendar');
                      else navigate('/posts');
                    }}
                    className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors">
                          {businessProfile.type === 'ecommerce' && 'Add New Product'}
                          {businessProfile.type === 'services' && 'Create New Booking'}
                          {businessProfile.type === 'blog' && 'Write New Post'}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Start creating content</p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {businessProfile.type === 'ecommerce' && <Package className="w-3 h-3 text-primary" />}
                        {businessProfile.type === 'services' && <Calendar className="w-3 h-3 text-primary" />}
                        {businessProfile.type === 'blog' && <FileText className="w-3 h-3 text-primary" />}
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/build')}
                    className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors">Customize Your Site</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Edit design and layout</p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors">View Full Analytics</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Track your performance</p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
