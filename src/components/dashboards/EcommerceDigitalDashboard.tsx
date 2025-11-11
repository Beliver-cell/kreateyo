import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, DollarSign, Key, Shield, Clock, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EcommerceDigitalDashboard() {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Total Revenue', value: '$18,920', change: '+18.2%', icon: DollarSign, trending: 'up' as const },
    { title: 'Downloads', value: '1,234', change: '+25.4%', icon: Download, trending: 'up' as const },
    { title: 'Active Licenses', value: '456', change: '+12.1%', icon: Key, trending: 'up' as const },
    { title: 'Protected Files', value: '89', change: 'All secure', icon: Shield, trending: 'neutral' as const }
  ];

  const recentActivity = [
    { text: 'New download - "Premium eBook Bundle"', time: '2 minutes ago', type: 'download' },
    { text: 'License key generated for Order #5678', time: '15 minutes ago', type: 'license' },
    { text: 'Access expired for user@example.com', time: '1 hour ago', type: 'access' },
    { text: 'New digital product uploaded', time: '2 hours ago', type: 'product' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Products Dashboard</h1>
        <p className="text-muted-foreground">Manage your downloadable products and licenses</p>
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
          <h2 className="text-xl font-semibold mb-4">Digital Product Tools</h2>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => navigate('/products')} className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Upload Digital Product
            </Button>
            <Button onClick={() => navigate('/orders')} className="w-full justify-start" variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Generate License Keys
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Limits
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Access Expiration
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Content Protection
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
