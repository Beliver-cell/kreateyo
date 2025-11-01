import { Calendar, Menu, Check, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import sarahImg from '@/assets/team/sarah.jpg';
import michaelImg from '@/assets/team/michael.jpg';
import emilyImg from '@/assets/team/emily.jpg';

interface TemplateProps {
  colors?: {
    primary: string;
    accent: string;
    background: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
}

export default function ServiceTemplate({ colors, fonts }: TemplateProps) {
  const primaryColor = colors?.primary || 'hsl(var(--primary))';
  const accentColor = colors?.accent || 'hsl(var(--accent))';

  const services = [
    {
      id: 1,
      name: 'Consultation',
      price: '$150/hr',
      features: ['One-on-one session', 'Personalized strategy', 'Follow-up support', 'Resources included'],
      icon: '💼'
    },
    {
      id: 2,
      name: 'Premium Package',
      price: '$500/mo',
      features: ['Weekly sessions', 'Priority support', 'Custom solutions', 'Quarterly reviews'],
      icon: '⭐',
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited sessions', '24/7 support', 'Dedicated team', 'Full customization'],
      icon: '🚀'
    },
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Lead Consultant', experience: '15+ years', image: sarahImg },
    { name: 'Michael Chen', role: 'Senior Advisor', experience: '10+ years', image: michaelImg },
    { name: 'Emily Rodriguez', role: 'Strategy Expert', experience: '8+ years', image: emilyImg },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>ProServices</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#services" className="text-sm hover:text-primary transition-colors">Services</a>
                <a href="#team" className="text-sm hover:text-primary transition-colors">Team</a>
                <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Reviews</a>
                <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button style={{ backgroundColor: primaryColor }}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Professional Services</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Business with Expert Guidance
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Over 15 years of experience helping businesses achieve their goals. Trusted by 500+ clients worldwide.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" style={{ backgroundColor: primaryColor }}>
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>500+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: primaryColor }}>98%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan that fits your needs. All packages include our satisfaction guarantee.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`relative ${service.popular ? 'ring-2 shadow-xl scale-105' : ''}`}
                style={service.popular ? { borderColor: primaryColor } : {}}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" style={{ backgroundColor: primaryColor }}>
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h4 className="text-2xl font-bold mb-2">{service.name}</h4>
                  <div className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                    {service.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={service.popular ? "default" : "outline"}
                    style={service.popular ? { backgroundColor: primaryColor } : {}}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold mb-2">{member.name}</h4>
                    <p className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{member.experience}</p>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Client Success Stories</h3>
            <p className="text-muted-foreground">See what our clients say about working with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm mb-4">
                    "Working with this team transformed our business. Their expertise and dedication are unmatched."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold" style={{ color: primaryColor }}>
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Alex Thompson</div>
                      <div className="text-xs text-muted-foreground">CEO, TechCorp</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h3>
              <p className="text-muted-foreground">Ready to start your journey? Book a free consultation today.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <Input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea placeholder="Tell us about your needs..." rows={4} />
                    </div>
                    <Button className="w-full" style={{ backgroundColor: primaryColor }}>
                      Send Message <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">hello@proservices.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <div className="font-medium">Office</div>
                        <div className="text-sm text-muted-foreground">123 Business St, Suite 100<br/>New York, NY 10001</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Card style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15)` }}>
                  <CardContent className="p-6">
                    <h5 className="font-semibold mb-2">Book a Free Consultation</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      Schedule a 30-minute call to discuss your needs and see how we can help.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Available Times
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4" style={{ color: primaryColor }}>ProServices</h4>
              <p className="text-sm text-muted-foreground">Professional services for business growth.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Consultation</div>
                <div>Strategy</div>
                <div>Implementation</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
