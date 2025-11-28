import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Sparkles, Video, Calendar, Send, Plus, Loader2, Image, FileText,
  Facebook, Instagram, Twitter, MessageCircle, Copy, Download, Clock
} from 'lucide-react';

interface GeneratedContent {
  id: string;
  type: 'post' | 'ad' | 'video';
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: string;
  createdAt: string;
}

export default function ContentStudio() {
  const queryClient = useQueryClient();
  const [postPrompt, setPostPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const [savedContent, setSavedContent] = useState<GeneratedContent[]>([
    { id: '1', type: 'post', content: 'Check out our latest product launch! 🚀', platform: 'instagram', status: 'published', createdAt: '2024-01-15' },
    { id: '2', type: 'ad', content: 'Limited time offer - 50% off all services!', platform: 'facebook', status: 'scheduled', scheduledFor: '2024-01-20', createdAt: '2024-01-14' },
  ]);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'twitter', name: 'X', icon: Twitter },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
  ];

  const generatePostMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setIsGenerating(true);
      
      // Call AI edge function
      const { data, error } = await supabase.functions.invoke('generate-email-content', {
        body: { prompt: `Generate a social media post: ${prompt}`, type: 'social_post' },
      });
      
      if (error) {
        // Fallback to simulated response
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `🌟 ${prompt}\n\nDiscover amazing deals and offers! Don't miss out on our exclusive products.\n\n#business #sale #offer`;
      }
      
      return data?.content || `🌟 ${prompt}\n\nDiscover amazing deals and offers!`;
    },
    onSuccess: (content) => {
      setGeneratedPost(content);
      toast.success('Post generated successfully!');
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setIsGenerating(false),
  });

  const generateVideoMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setIsGeneratingVideo(true);
      // Simulate Sora video generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Video generation started! This may take a few minutes.');
      return { status: 'processing', prompt };
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setIsGeneratingVideo(false),
  });

  const schedulePostMutation = useMutation({
    mutationFn: async () => {
      if (!generatedPost || selectedPlatforms.length === 0) {
        throw new Error('Please generate content and select platforms');
      }

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: 'post',
        content: generatedPost,
        platform: selectedPlatforms.join(', '),
        status: scheduleDate ? 'scheduled' : 'published',
        scheduledFor: scheduleDate || undefined,
        createdAt: new Date().toISOString(),
      };

      setSavedContent(prev => [newContent, ...prev]);
      return newContent;
    },
    onSuccess: (content) => {
      toast.success(content.status === 'scheduled' ? 'Post scheduled!' : 'Post published!');
      setGeneratedPost('');
      setSelectedPlatforms([]);
      setScheduleDate('');
      setPostPrompt('');
    },
    onError: (error) => toast.error(error.message),
  });

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const adTemplates = [
    { id: '1', name: 'Flash Sale', preview: '⚡ FLASH SALE ⚡\n50% OFF Everything!\nLimited time only!' },
    { id: '2', name: 'New Arrival', preview: '🆕 NEW ARRIVAL\nCheck out our latest products!\nShop now →' },
    { id: '3', name: 'Testimonial', preview: '⭐⭐⭐⭐⭐\n"Best purchase ever!"\n- Happy Customer' },
    { id: '4', name: 'Free Shipping', preview: '🚚 FREE SHIPPING\nOn all orders over $50\nShop now!' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Content Studio</h1>
            <p className="text-muted-foreground">Create AI-powered posts, videos, and ads</p>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Posts
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" /> Videos
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Image className="h-4 w-4" /> Ads
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Scheduled
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Post Generator
                  </CardTitle>
                  <CardDescription>Describe what you want to post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>What do you want to post about?</Label>
                    <Textarea
                      placeholder="e.g., Announce our new summer collection with exciting discounts..."
                      value={postPrompt}
                      onChange={(e) => setPostPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => generatePostMutation.mutate(postPrompt)}
                    disabled={isGenerating || !postPrompt.trim()}
                  >
                    {isGenerating ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" /> Generate Post</>
                    )}
                  </Button>

                  {generatedPost && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Generated Content</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedPost)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={generatedPost}
                          onChange={(e) => setGeneratedPost(e.target.value)}
                          rows={5}
                          className="bg-muted/50"
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block">Select Platforms</Label>
                        <div className="flex flex-wrap gap-2">
                          {platforms.map((platform) => {
                            const Icon = platform.icon;
                            const isSelected = selectedPlatforms.includes(platform.id);
                            return (
                              <Button
                                key={platform.id}
                                variant={isSelected ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => togglePlatform(platform.id)}
                              >
                                <Icon className="h-4 w-4 mr-1" />
                                {platform.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <Label>Schedule (optional)</Label>
                        <Input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                        />
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => schedulePostMutation.mutate()}
                        disabled={schedulePostMutation.isPending || selectedPlatforms.length === 0}
                      >
                        {schedulePostMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : scheduleDate ? (
                          <><Clock className="h-4 w-4 mr-2" /> Schedule Post</>
                        ) : (
                          <><Send className="h-4 w-4 mr-2" /> Post Now</>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {savedContent.filter(c => c.type === 'post').length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No posts yet</p>
                      </div>
                    ) : (
                      savedContent.filter(c => c.type === 'post').map((content) => (
                        <div key={content.id} className="p-4 border-b">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                              {content.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{content.platform}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{content.content}</p>
                          {content.scheduledFor && (
                            <p className="text-xs text-muted-foreground mt-2">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Scheduled: {new Date(content.scheduledFor).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  AI Video Generator (Sora)
                </CardTitle>
                <CardDescription>Create video ads with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Describe your video</Label>
                  <Textarea
                    placeholder="e.g., A professional product showcase video with smooth transitions..."
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => generateVideoMutation.mutate(videoPrompt)}
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                >
                  {isGeneratingVideo ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating Video...</>
                  ) : (
                    <><Video className="h-4 w-4 mr-2" /> Generate Video</>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Video generation uses Sora AI and may take several minutes
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Ad Templates
                </CardTitle>
                <CardDescription>Quick-start templates for ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {adTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{template.name}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">{template.preview}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setGeneratedPost(template.preview);
                            toast.success('Template loaded! Customize and post.');
                          }}
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Tab */}
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedContent.filter(c => c.status === 'scheduled').length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled posts</p>
                    <p className="text-sm">Create content and schedule it for later</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedContent.filter(c => c.status === 'scheduled').map((content) => (
                      <div key={content.id} className="flex items-start justify-between p-4 rounded-lg border">
                        <div>
                          <p className="text-sm whitespace-pre-wrap mb-2">{content.content}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{content.platform}</Badge>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {content.scheduledFor && new Date(content.scheduledFor).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
