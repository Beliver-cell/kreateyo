import { useState } from 'react';
import { Sparkles, Facebook, Instagram, Mail, MessageSquare, TrendingUp, Calendar, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const MarketingAI = () => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent('🎉 New arrival alert! Check out our latest collection of premium products. Limited stock available - shop now and enjoy 20% off your first purchase! #NewArrivals #ShopNow #ExclusiveDeals');
      setIsGenerating(false);
    }, 2000);
  };

  const marketingTips = [
    { tip: 'Post consistently at 9 AM and 6 PM for maximum engagement', icon: TrendingUp },
    { tip: 'Use 3-5 relevant hashtags per post', icon: MessageSquare },
    { tip: 'Include a clear call-to-action in every post', icon: Sparkles },
    { tip: 'Engage with your audience within the first hour', icon: Calendar }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">AI Marketing Center</h1>
            <p className="text-muted-foreground">Generate powerful marketing content with AI</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Powered
          </Badge>
        </div>

        {/* Daily Tips */}
        <Card className="bg-gradient-premium border-0 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Marketing Tips of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marketingTips.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur">
                  <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{item.tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="social" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="social" className="gap-2">
              <Facebook className="h-4 w-4" />
              <span className="hidden md:inline">Social Posts</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden md:inline">Ad Creatives</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Social Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select defaultValue="both">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Post Type</Label>
                    <Select defaultValue="promotion">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Topic / Product</Label>
                    <Input placeholder="What should we post about?" />
                  </div>

                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select defaultValue="friendly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="excited">Excited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    placeholder="Your AI-generated content will appear here..."
                    rows={10}
                    className="resize-none"
                  />
                  
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Facebook className="mr-2 h-4 w-4" />
                        Post to Facebook
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Instagram className="mr-2 h-4 w-4" />
                        Post to Instagram
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Email Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="welcome">Welcome Email</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject Line</Label>
                    <Input placeholder="Email subject..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Purpose</Label>
                  <Textarea
                    placeholder="Describe what you want to communicate..."
                    rows={4}
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Message Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Message Purpose</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
                      <SelectItem value="shipping">Shipping Update</SelectItem>
                      <SelectItem value="appointment">Appointment Reminder</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Details</Label>
                  <Textarea
                    placeholder="Any specific details to include?"
                    rows={3}
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Creative Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook Ads</SelectItem>
                        <SelectItem value="instagram">Instagram Ads</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ad Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image Ad</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="video">Video Ad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product/Service</Label>
                  <Input placeholder="What are you advertising?" />
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input placeholder="Who is your target audience?" />
                </div>

                <div className="space-y-2">
                  <Label>Key Message</Label>
                  <Textarea
                    placeholder="What's the main message or offer?"
                    rows={3}
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Ad Copy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Reach</p>
                <p className="text-2xl font-bold text-foreground">12.5K</p>
                <p className="text-xs text-success mt-1">+15% vs last week</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Engagement</p>
                <p className="text-2xl font-bold text-foreground">3.2K</p>
                <p className="text-xs text-success mt-1">+22% vs last week</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Clicks</p>
                <p className="text-2xl font-bold text-foreground">856</p>
                <p className="text-xs text-success mt-1">+8% vs last week</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                <p className="text-2xl font-bold text-foreground">124</p>
                <p className="text-xs text-success mt-1">+18% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default MarketingAI;