import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, TrendingUp, Users, Target, Award, BarChart3, Zap, Check } from 'lucide-react';

interface PriximaTemplateProps {
  businessId?: string;
}

export default function PriximaTemplate({ businessId }: PriximaTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Business with Data-Driven Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              We help ambitious companies grow through strategic digital marketing and sales optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '500+', label: 'Clients Served' },
              { value: '250%', label: 'Avg ROI Increase' },
              { value: '50M+', label: 'Revenue Generated' },
              { value: '98%', label: 'Client Satisfaction' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive marketing and sales solutions tailored to your business goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: 'Growth Marketing',
                desc: 'Scale your business with proven growth strategies and optimization',
              },
              {
                icon: Users,
                title: 'Lead Generation',
                desc: 'Fill your pipeline with qualified leads ready to convert',
              },
              {
                icon: Target,
                title: 'Sales Optimization',
                desc: 'Maximize conversion rates and close more deals efficiently',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Insights',
                desc: 'Make data-driven decisions with comprehensive reporting',
              },
              {
                icon: Zap,
                title: 'Marketing Automation',
                desc: 'Streamline campaigns and nurture leads automatically',
              },
              {
                icon: Award,
                title: 'Brand Strategy',
                desc: 'Build a compelling brand that resonates with your audience',
              },
            ].map((service, idx) => (
              <Card key={idx} className="p-8 hover:shadow-xl transition-all group cursor-pointer border-2 hover:border-primary">
                <service.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.desc}</p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Proven Process</h2>
            <p className="text-xl text-muted-foreground">
              Four simple steps to transform your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Discovery', desc: 'We analyze your business and market' },
              { step: '02', title: 'Strategy', desc: 'Custom roadmap for growth and success' },
              { step: '03', title: 'Execute', desc: 'Implementation and optimization' },
              { step: '04', title: 'Scale', desc: 'Continuous improvement and growth' },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {idx < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 text-primary/30 w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Marketing & Sales Packages</h2>
            <p className="text-xl text-muted-foreground">
              Flexible plans to match your growth ambitions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$999',
                period: 'per month',
                features: [
                  '2 campaign channels',
                  'Monthly strategy review',
                  'Performance reporting',
                  'Email support',
                  'Lead generation tools',
                ],
                popular: false,
              },
              {
                name: 'Growth',
                price: '$2,999',
                period: 'per month',
                features: [
                  '5 campaign channels',
                  'Bi-weekly strategy calls',
                  'Advanced analytics',
                  'Priority support',
                  'A/B testing & optimization',
                  'CRM integration',
                  'Content creation (10/month)',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'tailored to you',
                features: [
                  'Unlimited campaigns',
                  'Dedicated account team',
                  'Custom reporting dashboard',
                  '24/7 support',
                  'Full marketing automation',
                  'White-label solutions',
                  'Unlimited content',
                  'Strategic consulting',
                ],
                popular: false,
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 relative ${
                  plan.popular ? 'border-2 border-primary shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-muted-foreground">/ {plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Start Growing'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join hundreds of companies that trust us with their marketing and sales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground text-foreground h-12"
              />
              <Button size="lg" variant="secondary" className="whitespace-nowrap">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Prixima Marketing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
