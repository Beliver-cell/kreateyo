import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Package, Zap, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { BusinessType } from '@/types/business';

export function OnboardingModalEnhanced({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { setBusinessType, setPlan, completeOnboarding } = useBusinessContext();
  const [step, setStep] = useState<'businessType' | 'plan'>('businessType');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType>(null);

  const businessTypes = [
    {
      id: 'physical' as BusinessType,
      title: 'Physical Products',
      description: 'Sell tangible goods with inventory management',
      icon: Package,
      features: ['Inventory tracking', 'Shipping management', 'POS system'],
    },
    {
      id: 'digital' as BusinessType,
      title: 'Digital Products',
      description: 'Sell digital downloads, courses, or licenses',
      icon: Zap,
      features: ['Instant delivery', 'License management', 'Download tracking'],
    },
    {
      id: 'service' as BusinessType,
      title: 'Services',
      description: 'Offer bookings, consultations, or appointments',
      icon: Users,
      features: ['Booking calendar', 'Client CRM', 'Automated reminders'],
    },
    {
      id: 'dropship' as BusinessType,
      title: 'Dropshipping',
      description: 'Sell products without holding inventory',
      icon: Store,
      features: ['Supplier management', 'Auto-fulfillment', 'Product sync'],
    },
  ];

  const plans = [
    {
      id: 'free',
      title: 'Free',
      price: '$0/mo',
      description: 'Perfect for getting started',
      features: ['100 products', '1 team member', '1GB storage', 'Basic analytics'],
    },
    {
      id: 'pro',
      title: 'Pro',
      price: '$49/mo',
      description: 'For growing businesses',
      features: ['1,000 products', '5 team members', '10GB storage', 'Advanced automation'],
      popular: true,
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      price: '$299/mo',
      description: 'For established businesses',
      features: ['Unlimited products', 'Unlimited team', '100GB storage', 'POS + API access'],
    },
  ];

  const handleBusinessSelect = (type: BusinessType) => {
    setSelectedBusiness(type);
    setBusinessType(type);
    setStep('plan');
  };

  const handlePlanSelect = (plan: 'free' | 'pro' | 'enterprise') => {
    setPlan(plan);
    completeOnboarding();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'businessType' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Welcome! What will you be selling?
              </DialogTitle>
              <DialogDescription className="text-base">
                Choose your business model to customize your dashboard
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {businessTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                    onClick={() => handleBusinessSelect(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{type.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {type.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {step === 'plan' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
              <DialogDescription className="text-base">
                Start free, upgrade anytime as you grow
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer hover:border-primary hover:shadow-lg transition-all ${
                    plan.popular ? 'border-primary border-2 relative' : ''
                  }`}
                  onClick={() => handlePlanSelect(plan.id as any)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                    <div className="text-3xl font-bold text-primary">{plan.price}</div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant={plan.popular ? 'default' : 'outline'}>
                      Choose {plan.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" onClick={() => setStep('businessType')} className="w-full">
              Back to Business Type
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
