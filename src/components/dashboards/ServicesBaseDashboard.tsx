import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, DollarSign, TrendingUp, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ServicesBaseDashboardProps {
  title: string;
  description: string;
  categorySpecificWidgets?: ReactNode;
}

export function ServicesBaseDashboard({ title, description, categorySpecificWidgets }: ServicesBaseDashboardProps) {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Active Clients', value: '24', change: '+3 this month', icon: Users, trending: 'up' as const },
    { title: 'Upcoming Bookings', value: '12', change: '3 today', icon: Calendar, trending: 'neutral' as const },
    { title: 'Revenue', value: '$8,450', change: '+15.2%', icon: DollarSign, trending: 'up' as const },
    { title: 'Projects', value: '18', change: '+2 this week', icon: TrendingUp, trending: 'up' as const }
  ];

  const recentActivity = [
    { text: 'New booking from Sarah Johnson', time: '10 minutes ago', type: 'booking' },
    { text: 'Contract signed - Project Alpha', time: '1 hour ago', type: 'contract' },
    { text: 'Payment received - $850', time: '2 hours ago', type: 'payment' },
    { text: 'New client inquiry received', time: '3 hours ago', type: 'inquiry' }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{description}</p>
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

      {categorySpecificWidgets && (
        <div className="mb-4 md:mb-6">
          {categorySpecificWidgets}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
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

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            <Button onClick={() => navigate('/clients')} className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
            <Button onClick={() => navigate('/appointments')} className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Booking
            </Button>
            <Button onClick={() => navigate('/clients')} className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View All Clients
            </Button>
            <Button onClick={() => navigate('/analytics')} className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
