import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Calendar, Award, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface FosteConsultingTemplateProps {
  businessId?: string;
}

export default function FosteConsultingTemplate({ businessId }: FosteConsultingTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Business Through Expert Consulting
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Strategic guidance and proven methodologies to accelerate your growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Consultation
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10">
                View Services
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
              { value: '15+', label: 'Years Experience' },
              { value: '300+', label: 'Clients Helped' },
              { value: '95%', label: 'Success Rate' },
              { value: '$10M+', label: 'Revenue Impact' },
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
            <h2 className="text-4xl font-bold mb-4">Our Consulting Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: 'Business Strategy',
                desc: 'Develop winning strategies for sustainable growth and market leadership',
              },
              {
                icon: Users,
                title: 'Leadership Coaching',
                desc: 'Empower your leaders with skills to drive organizational excellence',
              },
              {
                icon: Award,
                title: 'Performance Optimization',
                desc: 'Maximize efficiency and effectiveness across all business operations',
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

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Flexible Pricing Plans</h2>
            <p className="text-xl text-muted-foreground">
              Choose the package that fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Initial Consultation',
                price: '$500',
                period: 'per session',
                features: [
                  '2-hour strategy session',
                  'Business assessment',
                  'Action plan document',
                  'Email support (7 days)',
                ],
                popular: false,
              },
              {
                name: 'Monthly Retainer',
                price: '$2,500',
                period: 'per month',
                features: [
                  '4 consulting sessions',
                  'Quarterly strategy review',
                  'Priority email support',
                  'Resource library access',
                  'Team training sessions',
                ],
                popular: true,
              },
              {
                name: 'Enterprise Package',
                price: 'Custom',
                period: 'contact us',
                features: [
                  'Unlimited consulting hours',
                  'Dedicated account manager',
                  'On-site visits included',
                  'Custom strategy workshops',
                  'Executive coaching',
                  '24/7 priority support',
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
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">/ {plan.period}</span>
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
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Schedule your free 30-minute consultation today
            </p>
            <Button size="lg" variant="secondary">
              <Calendar className="w-5 h-5 mr-2" />
              Book Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Foste Consulting. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
