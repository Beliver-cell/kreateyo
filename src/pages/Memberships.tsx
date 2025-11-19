import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Crown, Shield, Star } from "lucide-react";

export default function Memberships() {
  const tiers = [
    {
      id: 1,
      name: "Free Member",
      icon: Users,
      members: 234,
      benefits: ["Basic access", "Community forums"],
      color: "bg-gray-500",
    },
    {
      id: 2,
      name: "Pro Member",
      icon: Star,
      members: 89,
      benefits: ["All Free benefits", "Priority support", "Monthly webinars"],
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "VIP Member",
      icon: Crown,
      members: 23,
      benefits: ["All Pro benefits", "1-on-1 sessions", "Exclusive content"],
      color: "bg-amber-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Membership Tiers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your community membership levels
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Tier
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(tier => (
            <Card key={tier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`${tier.color} p-3 rounded-full`}>
                    <tier.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {tier.members} members
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Benefits:</p>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <Shield className="h-3 w-3 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Tier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Members
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
