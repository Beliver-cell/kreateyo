import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Layers, Store, Briefcase, TrendingUp, Users, Globe, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Build your website in minutes, not days' },
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-level security for your business data' },
    { icon: Layers, title: 'All-in-One Platform', description: 'Everything you need in one powerful dashboard' },
    { icon: Globe, title: 'Mobile Optimized', description: 'Perfect on any device, anywhere in Africa' },
    { icon: TrendingUp, title: 'Growth Tools', description: 'Analytics and insights to scale your business' },
    { icon: Users, title: 'Customer Support', description: '24/7 support from our expert team' },
  ];

  const benefits = [
    'No technical skills required',
    'Start selling in under 10 minutes',
    'Accept payments instantly',
    'Beautiful, professional templates',
    'Grow with powerful tools',
    'Trusted by thousands of businesses',
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft"></span>
            <span className="text-sm font-medium text-primary">Trusted by 10,000+ African Businesses</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-premium bg-clip-text text-transparent">
              Build Your Dream
            </span>
            <br />
            <span className="text-foreground">Business Online</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create stunning websites, sell products, manage services, and grow your business—all from one powerful platform built for African entrepreneurs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="xl" 
              variant="gradient"
              onClick={() => navigate('/signup')}
              className="group"
            >
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Perfect for Every Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you sell products or offer services, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">E-commerce</h3>
            <p className="text-muted-foreground mb-6">
              Sell physical products, digital downloads, or run a dropshipping business with ease
            </p>
            <ul className="space-y-2">
              {['Product management', 'Inventory tracking', 'Secure payments', 'Shipping integration'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Services</h3>
            <p className="text-muted-foreground mb-6">
              Book appointments, manage clients, and deliver professional services seamlessly
            </p>
            <ul className="space-y-2">
              {['Booking calendar', 'Client management', 'Project tracking', 'Invoice generation'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed specifically for African businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose Kreateyo?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-accent/5 transition-colors animate-slide-left"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-premium relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of African entrepreneurs building successful businesses online
            </p>
            <Button 
              size="xl" 
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="group shadow-2xl"
            >
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
