import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PlanType = 'free' | 'pro' | 'enterprise';

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Up to 100 products',
      'Basic analytics',
      '1 team member',
      '1GB storage',
      'Community support',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: [
      'Up to 1,000 products',
      'Advanced analytics',
      '5 team members',
      '10GB storage',
      'Email support',
      'Custom domain',
      'Advanced automation'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    features: [
      'Unlimited products',
      'Advanced analytics + AI',
      'Unlimited team members',
      '100GB storage',
      'Priority support',
      'API access',
      'POS system',
      'White-label',
      'SLA guarantee'
    ]
  }
];

export default function Billing() {
  const { businessProfile, setPlan } = useBusinessContext();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const { toast } = useToast();

  const currentPlan = businessProfile.plan;

  const handleUpgrade = (planId: PlanType) => {
    setSelectedPlan(planId);
    setShowUpgradeDialog(true);
  };

  const handleDowngrade = (planId: PlanType) => {
    setSelectedPlan(planId);
    setShowDowngradeDialog(true);
  };

  const confirmUpgrade = () => {
    if (selectedPlan) {
      setPlan(selectedPlan);
      toast({
        title: "Plan upgraded!",
        description: `You've successfully upgraded to the ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      setShowUpgradeDialog(false);
      setSelectedPlan(null);
    }
  };

  const confirmDowngrade = () => {
    if (selectedPlan) {
      setPlan(selectedPlan);
      toast({
        title: "Plan downgraded",
        description: `You've downgraded to the ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      setShowDowngradeDialog(false);
      setSelectedPlan(null);
    }
  };

  const handleInviteTeamMember = () => {
    if (!newMemberEmail) return;
    
    toast({
      title: "Team member invited",
      description: `Invitation sent to ${newMemberEmail}`,
    });
    setNewMemberEmail('');
  };

  const canInviteTeam = currentPlan === 'pro' || currentPlan === 'enterprise';

  const currentPlanIndex = plans.findIndex(p => p.id === currentPlan);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Billing & Team</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your subscription, billing, and team members</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Plans & Billing</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Current Plan Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Current Plan</CardTitle>
              <CardDescription className="text-sm md:text-base">You're currently on the {plans[currentPlanIndex].name} plan</CardDescription>
            </div>
            <Badge className="w-fit bg-primary text-primary-foreground">
              <CreditCard className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-3xl md:text-4xl font-bold">{plans[currentPlanIndex].price}<span className="text-lg md:text-xl text-muted-foreground">{plans[currentPlanIndex].period}</span></p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                {currentPlan === 'free' ? 'No payment required' : 'Next billing date: January 1, 2025'}
              </p>
            </div>
            {currentPlan !== 'enterprise' && (
              <div className="flex flex-col sm:flex-row gap-2">
                {currentPlanIndex < plans.length - 1 && (
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleUpgrade(plans[currentPlanIndex + 1].id)}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                )}
                {currentPlanIndex > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => handleDowngrade(plans[currentPlanIndex - 1].id)}
                  >
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Downgrade
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Plans */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">All Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.id === currentPlan ? 'border-2 border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-md">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              {plan.id === currentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white shadow-md">
                    Current
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-2xl md:text-3xl font-bold text-foreground">
                  {plan.price}<span className="text-sm md:text-base text-muted-foreground">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs md:text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.id !== currentPlan && (
                  <Button 
                    className="w-full"
                    variant={plan.id > currentPlan ? 'default' : 'outline'}
                    onClick={() => plan.id > currentPlan ? handleUpgrade(plan.id) : handleDowngrade(plan.id)}
                  >
                    {plan.id > currentPlan ? 'Upgrade' : 'Downgrade'} to {plan.name}
                  </Button>
                )}
                {plan.id === currentPlan && (
                  <Button className="w-full" variant="secondary" disabled>
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Upgrade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upgrade to the {selectedPlan && plans.find(p => p.id === selectedPlan)?.name} plan? 
              {selectedPlan && plans.find(p => p.id === selectedPlan)?.price !== 'Custom' && (
                <> Your new billing amount will be {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpgrade}>Confirm Upgrade</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Downgrade Dialog */}
      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Downgrade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to downgrade to the {selectedPlan && plans.find(p => p.id === selectedPlan)?.name} plan? 
              You may lose access to some features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDowngrade}>Confirm Downgrade</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </TabsContent>

      <TabsContent value="team" className="space-y-6">
        {!canInviteTeam && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Collaboration
              </CardTitle>
              <CardDescription>
                Upgrade to Pro or Enterprise to collaborate with team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleUpgrade('pro')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        )}

        {canInviteTeam && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Invite Team Member
                </CardTitle>
                <CardDescription>Add team members to collaborate on your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="team@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleInviteTeamMember} disabled={!newMemberEmail}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {currentPlan === 'pro' ? '5 team members max' : 'Unlimited team members'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">You (Owner)</p>
                      <p className="text-sm text-muted-foreground">admin@store.com</p>
                    </div>
                    <Badge>Owner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No team members yet. Invite your first team member above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>
      </Tabs>
    </div>
  );
}
