import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Users, Package, TrendingUp } from "lucide-react";

export default function Branches() {
  const branches = [
    {
      id: 1,
      name: "Lagos Main",
      address: "Victoria Island, Lagos",
      manager: "John Doe",
      staff: 12,
      revenue: 1250000,
      status: "active",
    },
    {
      id: 2,
      name: "Abuja Branch",
      address: "Wuse 2, Abuja",
      manager: "Jane Smith",
      staff: 8,
      revenue: 850000,
      status: "active",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Multi-Branch Management</h1>
            <p className="text-muted-foreground mt-1">Manage all your business locations</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {branch.address}
                    </div>
                  </div>
                  <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                    {branch.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manager
                    </span>
                    <span className="font-medium">{branch.manager}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Staff
                    </span>
                    <span className="font-medium">{branch.staff} employees</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Revenue
                    </span>
                    <span className="font-medium text-green-600">
                      ₦{branch.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage
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
