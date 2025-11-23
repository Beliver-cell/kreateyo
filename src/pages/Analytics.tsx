import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye, Calendar, FileText, Target } from 'lucide-react';
import { useBusinessContext } from '@/contexts/BusinessContext';

export default function Analytics() {
  const { businessProfile } = useBusinessContext();

  // Ecommerce metrics
  const ecommerceMetrics = [
    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign, trend: 'up' },
    { title: 'Total Orders', value: '1,847', change: '+15.3%', icon: ShoppingCart, trend: 'up' },
    { title: 'New Customers', value: '234', change: '+12.5%', icon: Users, trend: 'up' },
    { title: 'Conversion Rate', value: '3.24%', change: '-0.5%', icon: Target, trend: 'down' },
  ];

  const topProducts = [
    { name: 'Premium Headphones', sales: '$12,450', units: 145 },
    { name: 'Smart Watch Pro', sales: '$9,870', units: 87 },
    { name: 'Wireless Earbuds', sales: '$7,230', units: 203 },
  ];

  // Services metrics
  const servicesMetrics = [
    { title: 'Total Revenue', value: '$32,450', change: '+18.2%', icon: DollarSign, trend: 'up' },
    { title: 'Appointments', value: '156', change: '+24.1%', icon: Calendar, trend: 'up' },
    { title: 'Active Clients', value: '89', change: '+8.5%', icon: Users, trend: 'up' },
    { title: 'Booking Rate', value: '76%', change: '+3.2%', icon: Target, trend: 'up' },
  ];

  const topServices = [
    { name: 'Consultation', bookings: 45, revenue: '$9,000' },
    { name: 'Design Service', bookings: 32, revenue: '$12,800' },
    { name: 'Development', bookings: 28, revenue: '$14,000' },
  ];

  // Blog metrics
  const blogMetrics = [
    { title: 'Total Views', value: '$48,567', change: '+32.5%', icon: Eye, trend: 'up' },
    { title: 'Published Posts', value: '127', change: '+12', icon: FileText, trend: 'up' },
    { title: 'Subscribers', value: '2,345', change: '+18.7%', icon: Users, trend: 'up' },
    { title: 'Engagement Rate', value: '4.8%', change: '+0.9%', icon: Target, trend: 'up' },
  ];

  const topPosts = [
    { title: 'How to Build a Successful Online Business', views: 8234, engagement: '6.2%' },
    { title: '10 Tips for Better Productivity', views: 5678, engagement: '5.4%' },
    { title: 'The Future of AI Technology', views: 4521, engagement: '4.9%' },
  ];

  const isProductStore = businessProfile.type === 'physical' || businessProfile.type === 'dropship';
  const isServiceStore = businessProfile.type === 'service';
  const isDigitalStore = businessProfile.type === 'digital';

  const renderMetrics = () => {
    let metrics = ecommerceMetrics;
    if (isServiceStore) metrics = servicesMetrics;
    if (isDigitalStore) metrics = blogMetrics;

    return metrics.map((metric, index) => (
      <Card key={index}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <metric.icon className="w-4 h-4" />
            {metric.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold">{metric.value}</p>
            <span className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {metric.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {metric.change}
            </span>
          </div>
          <Progress value={75} className="mt-2" />
        </CardContent>
      </Card>
    ));
  };

  const renderTopPerformers = () => {
    if (isProductStore) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                  </div>
                  <p className="font-bold text-primary">{product.sales}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (isServiceStore) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                  </div>
                  <p className="font-bold text-primary">{service.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Posts</CardTitle>
          <CardDescription>Most viewed content this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.views.toLocaleString()} views</p>
                </div>
                <p className="font-bold text-primary ml-2">{post.engagement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          {isProductStore && 'Track your store performance and sales metrics'}
          {isServiceStore && 'Monitor your service bookings and client engagement'}
          {isDigitalStore && 'Analyze your content performance and audience growth'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {renderMetrics()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {renderTopPerformers()}
        
        <Card>
          <CardHeader>
            <CardTitle>
              {isProductStore && 'Customer Behavior'}
              {isServiceStore && 'Client Insights'}
              {isDigitalStore && 'Audience Insights'}
            </CardTitle>
            <CardDescription>Key behavioral metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProductStore && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Cart Abandonment Rate</span>
                    <span className="text-sm font-bold">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Avg. Order Value</span>
                    <span className="text-sm font-bold">$87.50</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Return Customer Rate</span>
                    <span className="text-sm font-bold">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
              </>
            )}
            {isServiceStore && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Booking Completion Rate</span>
                    <span className="text-sm font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Avg. Session Duration</span>
                    <span className="text-sm font-bold">45 min</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Client Retention Rate</span>
                    <span className="text-sm font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </>
            )}
            {isDigitalStore && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="text-sm font-bold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Avg. Time on Page</span>
                    <span className="text-sm font-bold">3:24</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Email Open Rate</span>
                    <span className="text-sm font-bold">24%</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered recommendations</CardDescription>
            </div>
            <Button size="sm" variant="outline">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Trending Up</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your {isProductStore ? 'sales' : isServiceStore ? 'bookings' : 'engagement'} have increased by 24% compared to last month
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Optimization Tip</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider running a promotion during peak hours to maximize {isProductStore || isDigitalStore ? 'sales' : 'bookings'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
