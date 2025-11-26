import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, BookOpen, MessageSquare, Target, LineChart, Shield, ArrowRight } from 'lucide-react';

interface ConsultingProTemplateProps {
  businessId?: string;
}

export default function ConsultingProTemplate({ businessId }: ConsultingProTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-accent to-secondary text-foreground py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Expert Business Consulting Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Driving innovation and growth through strategic consulting partnerships
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven expertise in delivering transformative business solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Strategic Planning',
                desc: 'Data-driven strategies aligned with your business objectives',
              },
              {
                icon: LineChart,
                title: 'Growth Acceleration',
                desc: 'Proven methodologies to scale your business rapidly',
              },
              {
                icon: Shield,
                title: 'Risk Management',
                desc: 'Identify and mitigate risks before they impact your business',
              },
              {
                icon: BookOpen,
                title: 'Knowledge Transfer',
                desc: 'Upskill your team with industry best practices',
              },
              {
                icon: MessageSquare,
                title: 'Ongoing Support',
                desc: 'Continuous guidance throughout your transformation journey',
              },
              {
                icon: Target,
                title: 'Results Focused',
                desc: 'Measurable outcomes with clear ROI tracking',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
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
              A systematic approach to business transformation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Assess', desc: 'Comprehensive business analysis' },
              { step: '02', title: 'Plan', desc: 'Custom strategy development' },
              { step: '03', title: 'Implement', desc: 'Execute with precision' },
              { step: '04', title: 'Optimize', desc: 'Continuous improvement' },
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
            <h2 className="text-4xl font-bold mb-4">Consulting Packages</h2>
            <p className="text-xl text-muted-foreground">
              Tailored solutions for every stage of your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$1,500',
                period: 'per project',
                features: [
                  'Business diagnostic review',
                  '3 consulting sessions',
                  'Strategic roadmap',
                  '30-day email support',
                  'Implementation guide',
                ],
                popular: false,
              },
              {
                name: 'Professional',
                price: '$5,000',
                period: 'per month',
                features: [
                  'Weekly consulting sessions',
                  'Custom strategy development',
                  'Monthly progress reviews',
                  'Priority support access',
                  'Team workshops (2/month)',
                  'Performance analytics',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'tailored pricing',
                features: [
                  'Unlimited consulting access',
                  'Dedicated consultant team',
                  'On-demand support (24/7)',
                  'Custom workshop programs',
                  'Executive board advisory',
                  'Advanced analytics suite',
                  'Quarterly strategy summits',
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
                    Recommended
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/ {plan.period}</span>
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
                  {plan.price === 'Custom' ? 'Request Quote' : 'Choose Plan'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Client Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See what our clients have achieved
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "The strategic insights transformed our entire business model. Revenue increased by 150% in just 6 months.",
                author: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
              },
              {
                quote: "Professional, knowledgeable, and results-driven. Best consulting investment we've ever made.",
                author: "Michael Chen",
                role: "Founder, GrowthLab",
              },
              {
                quote: "Their expertise helped us navigate complex market challenges with confidence and clarity.",
                author: "Emily Rodriguez",
                role: "COO, InnovateCo",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
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
              Let's Build Your Success Story
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Schedule a consultation to discuss your business goals
            </p>
            <Button size="lg" variant="secondary">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Consulting Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
