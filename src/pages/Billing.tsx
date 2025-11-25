import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PLAN_DETAILS, PlanType } from '@/types/plans';
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

const planOrder: PlanType[] = ['free', 'pro', 'enterprise'];

export default function Billing() {
  const { profile, updatePlan } = useAuth();
  const currentPlan = profile?.plan || 'free';
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = (planId: PlanType) => {
    setSelectedPlan(planId);
    setShowUpgradeDialog(true);
  };

  const handleDowngrade = (planId: PlanType) => {
    setSelectedPlan(planId);
    setShowDowngradeDialog(true);
  };

  const confirmUpgrade = async () => {
    if (selectedPlan) {
      setLoading(true);
      const { error } = await updatePlan(selectedPlan);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Plan upgraded!",
          description: `You've successfully upgraded to the ${PLAN_DETAILS[selectedPlan].name} plan.`,
        });
      }
      
      setShowUpgradeDialog(false);
      setSelectedPlan(null);
      setLoading(false);
    }
  };

  const confirmDowngrade = async () => {
    if (selectedPlan) {
      setLoading(true);
      const { error } = await updatePlan(selectedPlan);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Plan downgraded",
          description: `You've downgraded to the ${PLAN_DETAILS[selectedPlan].name} plan.`,
          variant: "destructive",
        });
      }
      
      setShowDowngradeDialog(false);
      setSelectedPlan(null);
      setLoading(false);
    }
  };

  const currentPlanIndex = planOrder.indexOf(currentPlan);
  const currentPlanDetails = PLAN_DETAILS[currentPlan];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
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
              <CardDescription className="text-sm md:text-base">
                You're currently on the {currentPlanDetails.name} plan
              </CardDescription>
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
              <p className="text-3xl md:text-4xl font-bold">
                {currentPlanDetails.price}
                <span className="text-lg md:text-xl text-muted-foreground">{currentPlanDetails.period}</span>
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                {currentPlan === 'free' ? 'No payment required' : 'Next billing date: January 1, 2025'}
              </p>
            </div>
            {currentPlan !== 'enterprise' && (
              <div className="flex flex-col sm:flex-row gap-2">
                {currentPlanIndex < planOrder.length - 1 && (
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleUpgrade(planOrder[currentPlanIndex + 1])}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                )}
                {currentPlanIndex > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => handleDowngrade(planOrder[currentPlanIndex - 1])}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {planOrder.map((planId) => {
            const plan = PLAN_DETAILS[planId];
            const isCurrentPlan = planId === currentPlan;
            const isPlanHigher = planOrder.indexOf(planId) > currentPlanIndex;

            return (
              <Card 
                key={planId} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'border-2 border-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground shadow-md">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                {isCurrentPlan && (
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
                  {!isCurrentPlan && (
                    <Button 
                      className="w-full"
                      variant={isPlanHigher ? 'default' : 'outline'}
                      onClick={() => isPlanHigher ? handleUpgrade(planId) : handleDowngrade(planId)}
                    >
                      {isPlanHigher ? 'Upgrade' : 'Downgrade'} to {plan.name}
                    </Button>
                  )}
                  {isCurrentPlan && (
                    <Button className="w-full" variant="secondary" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Upgrade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upgrade to the {selectedPlan && PLAN_DETAILS[selectedPlan].name} plan? 
              {selectedPlan && PLAN_DETAILS[selectedPlan].price !== 'Custom' && (
                <> Your new billing amount will be {PLAN_DETAILS[selectedPlan].price}{PLAN_DETAILS[selectedPlan].period}.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpgrade} disabled={loading}>
              {loading ? 'Upgrading...' : 'Confirm Upgrade'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Downgrade Dialog */}
      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Downgrade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to downgrade to the {selectedPlan && PLAN_DETAILS[selectedPlan].name} plan? 
              You may lose access to some features including team management, AI tools, and developer console.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDowngrade} disabled={loading}>
              {loading ? 'Downgrading...' : 'Confirm Downgrade'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
