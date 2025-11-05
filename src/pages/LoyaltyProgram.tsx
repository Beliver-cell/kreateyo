import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Award, Gift, Users, TrendingUp, Star } from "lucide-react";

const LoyaltyProgram = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
        <p className="text-muted-foreground">
          Reward your customers and build lasting relationships
        </p>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-xs text-green-500 mt-1">+234 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Points Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1.2M</p>
            <p className="text-xs text-muted-foreground mt-1">Total points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards Redeemed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">487</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">68%</p>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Points Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Points System</CardTitle>
          <CardDescription>
            Configure how customers earn and redeem points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="earn-rate">Points per Dollar Spent</Label>
            <Input id="earn-rate" type="number" defaultValue="10" />
            <p className="text-sm text-muted-foreground">
              Customers earn 10 points for every $1 spent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redeem-rate">Redemption Value</Label>
            <Input id="redeem-rate" type="number" defaultValue="100" />
            <p className="text-sm text-muted-foreground">
              100 points = $1 discount
            </p>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Birthday Bonus</p>
              <p className="text-sm text-muted-foreground">Give bonus points on customer birthdays</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Referral Rewards</p>
              <p className="text-sm text-muted-foreground">Reward customers for referring friends</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* VIP Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            VIP Tiers
          </CardTitle>
          <CardDescription>
            Create exclusive tiers for your best customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold">Silver</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">$0 - $500 spent</p>
              <ul className="text-sm space-y-1">
                <li>✓ 10 points per $1</li>
                <li>✓ Birthday bonus</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                <h3 className="font-bold">Gold</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">$500 - $2,000 spent</p>
              <ul className="text-sm space-y-1">
                <li>✓ 15 points per $1</li>
                <li>✓ Birthday bonus</li>
                <li>✓ Free shipping</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-purple-600 fill-purple-600" />
                <h3 className="font-bold">Platinum</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">$2,000+ spent</p>
              <ul className="text-sm space-y-1">
                <li>✓ 20 points per $1</li>
                <li>✓ Birthday bonus</li>
                <li>✓ Free shipping</li>
                <li>✓ Exclusive offers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>
            Turn your customers into brand ambassadors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <Label>Referrer Reward</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input type="number" defaultValue="500" className="flex-1" />
                <span className="text-sm">points</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <Label>Referee Reward</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input type="number" defaultValue="250" className="flex-1" />
                <span className="text-sm">points</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Referral Stats</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">234</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold">187</p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
              <div>
                <p className="text-2xl font-bold">80%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyProgram;
