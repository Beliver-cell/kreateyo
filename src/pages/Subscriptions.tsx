import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function Subscriptions() {
  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      price: 5000,
      interval: "monthly",
      subscribers: 45,
      revenue: 225000,
      status: "active",
    },
    {
      id: 2,
      name: "Premium Plan",
      price: 15000,
      interval: "monthly",
      subscribers: 23,
      revenue: 345000,
      status: "active",
    },
  ];

  const stats = [
    { title: "Active Subscribers", value: "68", icon: Users, trend: "+8%" },
    { title: "Monthly Revenue", value: "₦570,000", icon: DollarSign, trend: "+15%" },
    { title: "Renewal Rate", value: "92%", icon: TrendingUp, trend: "+3%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Billing</h1>
            <p className="text-muted-foreground mt-1">
              Manage recurring payments via YoPay
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Subscribers
                    </span>
                    <span className="font-medium">{plan.subscribers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Revenue
                    </span>
                    <span className="font-medium text-green-600">
                      ₦{plan.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Billing Cycle
                    </span>
                    <span className="font-medium capitalize">{plan.interval}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Plan
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Subscribers
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
