import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Search, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

interface AiCustomerCareTemplateProps {
  businessId?: string;
}

export default function AiCustomerCareTemplate({ businessId }: AiCustomerCareTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Customer Support
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Get instant answers and 24/7 support with our intelligent customer care platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-primary-foreground/20 hover:bg-primary-foreground/10">
                Browse Help Center
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: 'Account & Billing', desc: 'Manage your account and payments' },
              { icon: MessageCircle, title: 'Technical Support', desc: 'Get help with technical issues' },
              { icon: CheckCircle, title: 'Getting Started', desc: 'Learn the basics and setup' },
            ].map((category, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <category.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground">{category.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Still Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <Mail className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get a response within 24 hours
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </Card>
              <Card className="p-8">
                <Phone className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Mon-Fri, 9AM-6PM
                </p>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full h-16 w-16 shadow-2xl">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Available 24/7</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Customer Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
