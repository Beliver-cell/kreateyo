import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Globe, 
  MessageSquare, 
  Smartphone, 
  Truck, 
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Calendar,
  Zap,
  Check,
  PlayCircle,
  ArrowRight,
  Users,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '@/components/LandingNavbar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TYPING_PHRASES = [
  { text: 'AI Tools', color: '#FFB703' },
  { text: 'YoPay Payments', color: '#00A86B' },
  { text: 'WhatsApp Commerce', color: '#0A84FF' },
  { text: 'Offline POS', color: '#8A2BE2' },
];

export default function LandingPage() {
  const [typingText, setTypingText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isPriceAnnual, setIsPriceAnnual] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex].text;
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && typingText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && typingText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
      } else {
        setTypingText(
          isDeleting
            ? currentPhrase.substring(0, typingText.length - 1)
            : currentPhrase.substring(0, typingText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, phraseIndex]);

  return (
    <div className="light min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Build. Grow. Run your business — simply.
                  <br />
                  <span 
                    className="inline-block min-h-[1.2em]"
                    style={{ color: TYPING_PHRASES[phraseIndex].color }}
                  >
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  All-in-one platform for African businesses — payments, websites, bookings, and automation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg hover-scale" asChild>
                  <Link to="/signup">
                    Get Started (Free)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg hover-scale"
                  onClick={() => setShowVideo(true)}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl bg-card">
                <div className="absolute inset-0 bg-gradient-premium opacity-20" />
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 p-8">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="hover-lift">
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <CreditCard className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">Payments</p>
                        </CardContent>
                      </Card>
                      <Card className="hover-lift">
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <Globe className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">Builder</p>
                        </CardContent>
                      </Card>
                      <Card className="hover-lift">
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <Sparkles className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">AI</p>
                        </CardContent>
                      </Card>
                      <Card className="hover-lift">
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <Smartphone className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">POS</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Users className="mr-2 h-4 w-4" />
                10,000+ Merchants
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Trusted by thousands of African businesses — secure payments, local delivery tooling
            </p>
            <div className="flex gap-3">
              {['🇳🇬', '🇰🇪', '🇬🇭', '🇿🇦'].map((flag, i) => (
                <span key={i} className="text-2xl">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to build & scale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: 'YoPay (Payments)',
                description: 'Accept cards, USSD, mobile money, payouts & payroll.',
                color: 'text-green-600'
              },
              {
                icon: Globe,
                title: 'Website Builder',
                description: 'Drag-and-drop, AI sections, mobile-first themes.',
                color: 'text-blue-600'
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp Commerce',
                description: 'Sell & recover carts via WhatsApp.',
                color: 'text-emerald-600'
              },
              {
                icon: Smartphone,
                title: 'POS & Offline Mode',
                description: 'Mobile POS, syncs when online.',
                color: 'text-purple-600'
              },
              {
                icon: Truck,
                title: 'Dispatch Tools',
                description: 'Rider booking & tracking for stores (toolbox).',
                color: 'text-orange-600'
              },
              {
                icon: Sparkles,
                title: 'AI Marketing & SEO',
                description: 'Auto-descriptions, SEO metadata, ad creatives.',
                color: 'text-pink-600'
              }
            ].map((feature, i) => (
              <Card key={i} className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Launch in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Choose your business',
                description: 'Select e-commerce, services or creators.',
                icon: ShoppingBag
              },
              {
                step: '02',
                title: 'Auto-setup',
                description: 'Answer 4 quick questions → we generate your site, payments, and WhatsApp flows.',
                icon: Zap
              },
              {
                step: '03',
                title: 'Start selling',
                description: 'Accept payments with YoPay, manage orders, and scale with AI.',
                icon: TrendingUp
              }
            ].map((step, i) => (
              <Card key={i} className="text-center hover-scale">
                <CardHeader>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary/20 mb-2">{step.step}</div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-32">
          {/* Website Builder */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge>Website Builder</Badge>
              <h3 className="text-3xl md:text-4xl font-bold">
                Build stunning websites in minutes
              </h3>
              <ul className="space-y-4">
                {[
                  'Drag-and-drop editor with AI-powered sections',
                  'Mobile-first themes optimized for African networks',
                  'Live preview and instant publishing',
                  'SEO optimization built-in'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link to="/build">Try Builder</Link>
              </Button>
            </div>
            <Card className="p-8 bg-gradient-premium">
              <div className="aspect-video bg-background/90 rounded-lg flex items-center justify-center">
                <Globe className="h-24 w-24 text-primary" />
              </div>
            </Card>
          </div>

          {/* Payments & YoPay */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-gradient-premium order-2 lg:order-1">
              <div className="aspect-video bg-background/90 rounded-lg flex items-center justify-center">
                <CreditCard className="h-24 w-24 text-primary" />
              </div>
            </Card>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge>Payments & YoPay</Badge>
              <h3 className="text-3xl md:text-4xl font-bold">
                Accept payments instantly
              </h3>
              <ul className="space-y-4">
                {[
                  'One-click checkout with YoPay',
                  'Accept cards, USSD, mobile money',
                  'Instant payouts to your account',
                  'Staff payroll management'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link to="/payments">Open YoPay</Link>
              </Button>
            </div>
          </div>

          {/* Bookings & Services */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge>Bookings & Services</Badge>
              <h3 className="text-3xl md:text-4xl font-bold">
                Manage appointments effortlessly
              </h3>
              <ul className="space-y-4">
                {[
                  'Smart calendar with availability management',
                  'Staff scheduling and assignments',
                  'Automated SMS/WhatsApp reminders',
                  'Client booking portal'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link to="/calendar">Start Booking</Link>
              </Button>
            </div>
            <Card className="p-8 bg-gradient-premium">
              <div className="aspect-video bg-background/90 rounded-lg flex items-center justify-center">
                <Calendar className="h-24 w-24 text-primary" />
              </div>
            </Card>
          </div>

          {/* WhatsApp Commerce */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-gradient-premium order-2 lg:order-1">
              <div className="aspect-video bg-background/90 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-24 w-24 text-primary" />
              </div>
            </Card>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge>WhatsApp Commerce</Badge>
              <h3 className="text-3xl md:text-4xl font-bold">
                Sell directly on WhatsApp
              </h3>
              <ul className="space-y-4">
                {[
                  'Share products via WhatsApp',
                  'Recover abandoned carts automatically',
                  'Send payment links directly',
                  'Order updates via WhatsApp'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link to="/messaging">Connect WhatsApp</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by businesses across Africa
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Amara Okafor',
                role: 'Fashion Store Owner, Lagos',
                quote: "YoPay and WhatsApp integration helped us double our sales in 3 months. Game changer!",
                rating: 5
              },
              {
                name: 'David Mwangi',
                role: 'Consulting Services, Nairobi',
                quote: "The booking system and automated reminders saved us hours every week. Highly recommend!",
                rating: 5
              },
              {
                name: 'Fatima Hassan',
                role: 'Beauty Salon, Accra',
                quote: "Finally, a platform built for African businesses. The POS works offline perfectly!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i} className="hover-lift">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base mb-4">"{testimonial.quote}"</CardDescription>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple pricing — built for Africa
            </h2>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={!isPriceAnnual ? 'font-semibold' : 'text-muted-foreground'}>Monthly</span>
              <button
                onClick={() => setIsPriceAnnual(!isPriceAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
                aria-label="Toggle pricing"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isPriceAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={isPriceAnnual ? 'font-semibold' : 'text-muted-foreground'}>
                Annual <Badge variant="secondary" className="ml-2">Save 2 months</Badge>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription>For side-hustles</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${isPriceAnnual ? '3' : '4'}</span>
                  <span className="text-muted-foreground">/mo</span>
                  <p className="text-sm text-muted-foreground mt-2">~₦{isPriceAnnual ? '3,400' : '4,500'}/mo</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    '1 store',
                    '10 products',
                    'YoPay basic',
                    'Website builder',
                    'WhatsApp support',
                    'Community support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/signup">Start Free</Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">14-day trial</p>
              </CardContent>
            </Card>

            {/* Growth */}
            <Card className="hover-lift border-primary border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Growth</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${isPriceAnnual ? '21' : '25'}</span>
                  <span className="text-muted-foreground">/mo</span>
                  <p className="text-sm text-muted-foreground mt-2">~₦{isPriceAnnual ? '23,800' : '28,000'}/mo</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    '5 stores',
                    '1,000 products',
                    'POS & offline mode',
                    'Automated marketing',
                    'WhatsApp Commerce',
                    'Dispatch toolbox',
                    'Priority support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Business */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <CardDescription>For merchants & agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${isPriceAnnual ? '66' : '79'}</span>
                  <span className="text-muted-foreground">/mo</span>
                  <p className="text-sm text-muted-foreground mt-2">~₦{isPriceAnnual ? '74,800' : '89,000'}/mo</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    'Unlimited products',
                    'Multi-branch',
                    'Staff payroll',
                    'Priority support',
                    'YoPay advanced payouts',
                    'API access',
                    'White-label options'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link to="/signup">Talk to Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Prices shown in USD. Local billing supported via YoPay.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-lg">How quickly can I launch my store?</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Most users launch in under 30 minutes using our Smart Setup Wizard. We auto-configure website, YoPay, and WhatsApp flows.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-lg">Do I need a separate payment provider?</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  No — YoPay is built into the platform (powered by Flutterwave on the backend). You'll see only YoPay branding and can accept local payments instantly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-lg">Will this work on low-end phones and slow networks?</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Yes — the platform is mobile-first. The landing page uses lightweight animations, reduced particles on slow devices, and lazy loading to ensure a fast experience.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-premium text-white border-0 p-12 text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Start your free store today
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of African businesses growing with our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg">
                  Book a Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">NexusCreate</h3>
              <p className="text-sm text-muted-foreground">
                All-in-one platform for African businesses
              </p>
              <Badge variant="secondary">
                <CreditCard className="mr-2 h-4 w-4" />
                YoPay Trusted
              </Badge>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/build" className="text-muted-foreground hover:text-foreground">Website Builder</Link></li>
                <li><Link to="/payments" className="text-muted-foreground hover:text-foreground">Payments</Link></li>
                <li><Link to="/pos" className="text-muted-foreground hover:text-foreground">POS System</Link></li>
                <li><Link to="/messaging" className="text-muted-foreground hover:text-foreground">WhatsApp</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h4 className="font-semibold">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">E-commerce</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
                <li><Link to="/digital-products" className="text-muted-foreground hover:text-foreground">Digital Products</Link></li>
                <li><Link to="/memberships" className="text-muted-foreground hover:text-foreground">Creators</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><Link to="/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t pt-8 mb-8">
            <div className="max-w-md">
              <h4 className="font-semibold mb-4">Stay updated</h4>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <span>© 2024 NexusCreate. Built for Africa 🌍</span>
            </div>
            <div className="flex gap-4">
              <span>🇳🇬 Nigeria</span>
              <span>🇰🇪 Kenya</span>
              <span>🇬🇭 Ghana</span>
              <span>🇿🇦 South Africa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
