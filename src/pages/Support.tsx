import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageSquare, BookOpen, Video, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const queryClient = useQueryClient();

  const createTicketMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject,
          message,
          priority
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast({
        title: "Support ticket created",
        description: "We'll respond to your request soon"
      });
      setSubject('');
      setMessage('');
      setPriority('normal');
    }
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get help and learn how to use KreateYo</p>
      </div>

      <Tabs defaultValue="help" className="space-y-4">
        <TabsList>
          <TabsTrigger value="help">
            <HelpCircle className="w-4 h-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="tutorials">
            <Video className="w-4 h-4 mr-2" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn the basics of KreateYo</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Managing Products</CardTitle>
                <CardDescription>Add and organize your products</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Order Fulfillment</CardTitle>
                <CardDescription>Process and ship orders</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Blog & Content</CardTitle>
                <CardDescription>Create engaging content</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Booking Services</CardTitle>
                <CardDescription>Manage appointments and bookings</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="w-8 h-8 mb-2 text-primary" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Track your business metrics</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium">How to add your first product</p>
                <span className="text-sm text-muted-foreground">5 min read</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium">Setting up payment processing</p>
                <span className="text-sm text-muted-foreground">8 min read</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium">Customizing your site design</p>
                <span className="text-sm text-muted-foreground">10 min read</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle>KreateYo Overview</CardTitle>
                <CardDescription>Complete walkthrough of all features</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle>Setting Up Your Store</CardTitle>
                <CardDescription>Step-by-step store setup guide</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle>Marketing Your Business</CardTitle>
                <CardDescription>Tips for growing your audience</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>Power user tips and tricks</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="normal">Normal - Need assistance</SelectItem>
                    <SelectItem value="high">High - Critical issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide as much detail as possible..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button 
                onClick={() => createTicketMutation.mutate()}
                disabled={!subject || !message || createTicketMutation.isPending}
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Get Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-1">Community Forum</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Connect with other KreateYo users
                </p>
                <Button variant="outline" size="sm">Visit Forum</Button>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-1">Status Page</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Check system status and uptime
                </p>
                <Button variant="outline" size="sm">View Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
