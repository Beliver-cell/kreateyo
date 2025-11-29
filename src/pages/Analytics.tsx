import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye, 
  Calendar, FileText, Target, Download, BarChart3, PieChart,
  Clock, XCircle, CheckCircle, Truck, Star, Zap, Globe,
  Smartphone, Monitor, Tablet, ArrowUpRight, ArrowDownRight,
  Activity, RefreshCw
} from 'lucide-react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30d');
  const [exporting, setExporting] = useState(false);

  // E-commerce metrics
  const ecommerceMetrics = [
    { title: 'Total Revenue', value: '₦4,523,100', change: '+20.1%', icon: DollarSign, trend: 'up' },
    { title: 'Total Orders', value: '1,847', change: '+15.3%', icon: ShoppingCart, trend: 'up' },
    { title: 'New Customers', value: '234', change: '+12.5%', icon: Users, trend: 'up' },
    { title: 'Conversion Rate', value: '3.24%', change: '-0.5%', icon: Target, trend: 'down' },
  ];

  const topProducts = [
    { name: 'Premium Headphones', sales: '₦1,245,000', units: 145, growth: '+12%' },
    { name: 'Smart Watch Pro', sales: '₦987,000', units: 87, growth: '+8%' },
    { name: 'Wireless Earbuds', sales: '₦723,000', units: 203, growth: '+24%' },
    { name: 'Phone Case Premium', sales: '₦456,000', units: 312, growth: '+5%' },
  ];

  const abandonedCarts = {
    rate: '28%',
    value: '₦2,340,000',
    recovered: '₦890,000',
    recoveryRate: '38%'
  };

  const shippingMetrics = {
    avgDeliveryTime: '3.2 days',
    onTimeRate: '94%',
    pendingShipments: 23,
    inTransit: 156
  };

  // Services metrics
  const servicesMetrics = [
    { title: 'Total Revenue', value: '₦3,245,000', change: '+18.2%', icon: DollarSign, trend: 'up' },
    { title: 'Appointments', value: '156', change: '+24.1%', icon: Calendar, trend: 'up' },
    { title: 'Active Clients', value: '89', change: '+8.5%', icon: Users, trend: 'up' },
    { title: 'Booking Rate', value: '76%', change: '+3.2%', icon: Target, trend: 'up' },
  ];

  const topServices = [
    { name: 'Consultation', bookings: 45, revenue: '₦900,000', rating: 4.9 },
    { name: 'Design Service', bookings: 32, revenue: '₦1,280,000', rating: 4.8 },
    { name: 'Development', bookings: 28, revenue: '₦1,400,000', rating: 4.7 },
    { name: 'Training Session', bookings: 24, revenue: '₦480,000', rating: 4.9 },
  ];

  const appointmentMetrics = {
    completionRate: '92%',
    noShowRate: '5%',
    cancellationRate: '3%',
    avgDuration: '45 min'
  };

  const staffPerformance = [
    { name: 'Sarah Johnson', appointments: 34, revenue: '₦680,000', rating: 4.9 },
    { name: 'Michael Chen', appointments: 28, revenue: '₦560,000', rating: 4.8 },
    { name: 'Emily Davis', appointments: 25, revenue: '₦500,000', rating: 4.7 },
  ];

  // Shared metrics
  const trafficSources = [
    { source: 'Organic Search', value: 45, visitors: 12450 },
    { source: 'Direct', value: 28, visitors: 7840 },
    { source: 'Social Media', value: 18, visitors: 5040 },
    { source: 'Referrals', value: 9, visitors: 2520 },
  ];

  const deviceBreakdown = [
    { device: 'Mobile', icon: Smartphone, value: 58, color: 'bg-blue-500' },
    { device: 'Desktop', icon: Monitor, value: 32, color: 'bg-purple-500' },
    { device: 'Tablet', icon: Tablet, value: 10, color: 'bg-green-500' },
  ];

  const visibilityScore = 78; // Out of 100

  const activityTimeline = [
    { time: '2 min ago', event: 'New order #1847 placed', type: 'order' },
    { time: '15 min ago', event: 'Customer John D. signed up', type: 'signup' },
    { time: '32 min ago', event: 'Payment received ₦45,000', type: 'payment' },
    { time: '1 hour ago', event: 'Product "Smart Watch" restocked', type: 'inventory' },
    { time: '2 hours ago', event: 'New 5-star review received', type: 'review' },
  ];

  const aiRecommendations = [
    { 
      title: 'Optimize Checkout Flow', 
      description: 'Your cart abandonment is 28%. Adding express checkout could recover ₦500k+/month.',
      impact: 'high'
    },
    { 
      title: 'Peak Hours Promotion', 
      description: 'Most traffic occurs 6-9 PM. Schedule promotions during this window.',
      impact: 'medium'
    },
    { 
      title: 'Mobile Experience', 
      description: '58% of visitors use mobile. Ensure all pages are mobile-optimized.',
      impact: 'high'
    },
  ];

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExporting(false);
    toast({
      title: `Report Exported`,
      description: `Your ${format.toUpperCase()} report has been downloaded.`,
    });
  };

  const renderMetrics = () => {
    const metrics = businessProfile.type === 'services' ? servicesMetrics : ecommerceMetrics;
    
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
            <p className="text-xl sm:text-2xl font-bold">{metric.value}</p>
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {businessProfile.type === 'ecommerce' && 'Track your store performance and sales metrics'}
            {businessProfile.type === 'services' && 'Monitor your service bookings and client engagement'}
            {(businessProfile.type === 'digital' || businessProfile.type === 'community') && 'Analyze your content performance and audience growth'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button size="sm" onClick={() => handleExport('pdf')} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetrics()}
      </div>

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">
            {businessProfile.type === 'services' ? 'Staff' : 'Products'}
          </TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>{businessProfile.type === 'services' ? 'Top Services' : 'Top Products'}</CardTitle>
                <CardDescription>Best performers this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(businessProfile.type === 'services' ? topServices : topProducts).map((item: any, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {businessProfile.type === 'services' 
                              ? `${item.bookings} bookings` 
                              : `${item.units} units sold`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {businessProfile.type === 'services' ? item.revenue : item.sales}
                        </p>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Star className="h-3 w-3 fill-current" />
                            {item.rating}
                          </div>
                        )}
                        {item.growth && (
                          <span className="text-sm text-green-600">{item.growth}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Type-Specific Metrics */}
            {businessProfile.type === 'ecommerce' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Cart & Shipping</CardTitle>
                  <CardDescription>Checkout and delivery performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Abandoned Carts
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-red-500/10">
                        <p className="text-sm text-muted-foreground">Abandonment Rate</p>
                        <p className="text-xl font-bold text-red-600">{abandonedCarts.rate}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <p className="text-sm text-muted-foreground">Recovered</p>
                        <p className="text-xl font-bold text-green-600">{abandonedCarts.recovered}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Avg. Delivery</p>
                        <p className="text-xl font-bold">{shippingMetrics.avgDeliveryTime}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">On-Time Rate</p>
                        <p className="text-xl font-bold text-green-600">{shippingMetrics.onTimeRate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Metrics</CardTitle>
                  <CardDescription>Booking and attendance stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">{appointmentMetrics.completionRate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-muted-foreground">No-Show Rate</p>
                      </div>
                      <p className="text-xl font-bold text-red-600">{appointmentMetrics.noShowRate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm text-muted-foreground">Cancellation</p>
                      </div>
                      <p className="text-xl font-bold text-yellow-600">{appointmentMetrics.cancellationRate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{appointmentMetrics.avgDuration}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Utilization Rate</h4>
                    <Progress value={76} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">76% of available slots booked</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Visibility Score & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Visibility Score
                </CardTitle>
                <CardDescription>Your online discoverability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${visibilityScore * 3.52} 352`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{visibilityScore}</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Good visibility! Optimize SEO to reach 90+
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
                <CardDescription>Recent events on your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>
                {businessProfile.type === 'services' ? 'Staff Performance' : 'Product Performance'}
              </CardTitle>
              <CardDescription>Detailed breakdown of individual performers</CardDescription>
            </CardHeader>
            <CardContent>
              {businessProfile.type === 'services' ? (
                <div className="space-y-4">
                  {staffPerformance.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-muted-foreground">{staff.appointments} appointments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{staff.revenue}</p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="h-3 w-3 fill-current" />
                          {staff.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{product.sales}</p>
                        <span className="text-sm text-green-600">{product.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm font-bold">{source.value}%</span>
                    </div>
                    <Progress value={source.value} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>How visitors access your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${device.color}/10`}>
                      <device.icon className={`h-5 w-5 ${device.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{device.device}</span>
                        <span className="font-bold">{device.value}%</span>
                      </div>
                      <Progress value={device.value} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Smart insights to improve your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge 
                          variant={rec.impact === 'high' ? 'default' : 'secondary'}
                          className={rec.impact === 'high' ? 'bg-green-500' : ''}
                        >
                          {rec.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}