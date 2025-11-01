import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Bank-level encryption and PCI compliance'
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Receive payments directly to your account'
  },
  {
    icon: CreditCard,
    title: 'Multiple Methods',
    description: 'Accept cards, digital wallets, and more'
  }
];

const benefits = [
  'Zero setup fees',
  'Competitive transaction rates',
  'Automatic tax calculations',
  'Fraud protection included',
  'Real-time payment tracking',
  '24/7 customer support'
];

export default function Payments() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">Accept Payments Seamlessly</h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Connect your bank account to start receiving payments from customers worldwide
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl md:text-2xl">NexusPay Coming Soon</CardTitle>
            <CardDescription className="text-base">
              Our integrated payment solution is in development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">What's Included:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4 pt-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90" disabled>
                Set Up Payments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Join the waitlist to be notified when NexusPay launches
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Have questions? <Button variant="link" className="p-0 h-auto">Contact our payment specialists</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
