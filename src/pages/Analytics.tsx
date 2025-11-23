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
    { title: 'Total Views', value: '48,567', change: '+32.5%', icon: Eye, trend: 'up' },
    { title: 'Published Posts', value: '127', change: '+12', icon: FileText, trend: 'up' },
    { title: 'Subscribers', value: '2,345', change: '+18.7%', icon: Users, trend: 'up' },
    { title: 'Engagement Rate', value: '4.8%', change: '+0.9%', icon: Target, trend: 'up' },
  ];

  const topPosts = [
    { title: 'How to Build a Successful Online Business', views: 8234, engagement: '6.2%' },
    { title: '10 Tips for Better Productivity', views: 5678, engagement: '5.4%' },
    { title: 'The Future of AI Technology', views: 4521, engagement: '4.9%' },
  ];

  const renderMetrics = () => {
    let metrics = ecommerceMetrics;
    if (businessProfile.type === 'services') metrics = servicesMetrics;
    if (businessProfile.type === 'digital' || businessProfile.type === 'community') metrics = blogMetrics;

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
    if (businessProfile.type === 'ecommerce') {
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

    if (businessProfile.type === 'services') {
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
          <CardDescription>Most viewed articles this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="space-y-1">
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.views.toLocaleString()} views</span>
                  <span>Engagement: {post.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {businessProfile.type === 'ecommerce' && 'Track your store performance and sales metrics'}
            {businessProfile.type === 'services' && 'Monitor your service bookings and client engagement'}
            {(businessProfile.type === 'digital' || businessProfile.type === 'community') && 'Analyze your content performance and audience growth'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Last 7 Days</Button>
          <Button variant="outline">Last 30 Days</Button>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetrics()}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTopPerformers()}

        <Card>
          <CardHeader>
            <CardTitle>
              {businessProfile.type === 'ecommerce' && 'Customer Behavior'}
              {businessProfile.type === 'services' && 'Client Insights'}
              {(businessProfile.type === 'digital' || businessProfile.type === 'community') && 'Audience Insights'}
            </CardTitle>
            <CardDescription>Key behavioral metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessProfile.type === 'ecommerce' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Order Value</span>
                    <span className="text-sm font-bold">$124.50</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Repeat Purchase Rate</span>
                    <span className="text-sm font-bold">34%</span>
                  </div>
                  <Progress value={34} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cart Abandonment</span>
                    <span className="text-sm font-bold">28%</span>
                  </div>
                  <Progress value={28} className="bg-red-100" />
                </div>
              </>
            )}
            {businessProfile.type === 'services' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Session Value</span>
                    <span className="text-sm font-bold">$285.00</span>
                  </div>
                  <Progress value={72} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Repeat Client Rate</span>
                    <span className="text-sm font-bold">58%</span>
                  </div>
                  <Progress value={58} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cancellation Rate</span>
                    <span className="text-sm font-bold">8%</span>
                  </div>
                  <Progress value={8} className="bg-red-100" />
                </div>
              </>
            )}
            {(businessProfile.type === 'digital' || businessProfile.type === 'community') && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Avg. Time on Page</span>
                    <span className="text-sm font-bold">4m 32s</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Return Visitor Rate</span>
                    <span className="text-sm font-bold">42%</span>
                  </div>
                  <Progress value={42} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <span className="text-sm font-bold">35%</span>
                  </div>
                  <Progress value={35} className="bg-red-100" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where your visitors are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Organic Search</span>
                <span className="text-sm font-bold">45%</span>
              </div>
              <Progress value={45} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Direct</span>
                <span className="text-sm font-bold">28%</span>
              </div>
              <Progress value={28} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Social Media</span>
                <span className="text-sm font-bold">18%</span>
              </div>
              <Progress value={18} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Referrals</span>
                <span className="text-sm font-bold">9%</span>
              </div>
              <Progress value={9} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
