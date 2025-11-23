import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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

type PlanType = 'free' | 'starter' | 'professional' | 'enterprise';

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
      'Community support',
      'Basic templates'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: [
      'Up to 1,000 products',
      'Advanced analytics',
      '5 team members',
      'Email support',
      'Premium templates',
      'Custom domain'
    ],
    popular: true
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    period: '/month',
    features: [
      'Unlimited products',
      'Advanced analytics + AI insights',
      '20 team members',
      'Priority support',
      'All templates',
      'Custom domain',
      'API access',
      'White-label options'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'Custom development'
    ]
  }
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const { toast } = useToast();

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
      setCurrentPlan(selectedPlan);
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
      setCurrentPlan(selectedPlan);
      toast({
        title: "Plan downgraded",
        description: `You've downgraded to the ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      setShowDowngradeDialog(false);
      setSelectedPlan(null);
    }
  };

  const currentPlanIndex = plans.findIndex(p => p.id === currentPlan);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your subscription and billing details</p>
      </div>

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
    </div>
  );
}
