import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Instagram, Linkedin, Sparkles, Image as ImageIcon, Video, BarChart3, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SocialMediaManager = () => {
  const { toast } = useToast();
  const [postTopic, setPostTopic] = useState("");
  const [postTone, setPostTone] = useState("professional");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, connected: true },
    { id: "twitter", name: "Twitter/X", icon: Twitter, connected: true },
    { id: "instagram", name: "Instagram", icon: Instagram, connected: true },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, connected: false },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContent = async () => {
    if (!postTopic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your post",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-social-content', {
        body: {
          topic: postTopic,
          tone: postTone,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ["all"]
        }
      });

      if (error) throw error;
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated",
        description: "AI has created social media content for you",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Manager</h1>
          <p className="text-muted-foreground">
            Manage your social media presence with AI-powered content
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your social media connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  platform.connected ? "bg-accent/50" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <platform.icon className="h-6 w-6" />
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {platform.connected ? "Connected" : "Not Connected"}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant={platform.connected ? "outline" : "default"}>
                  {platform.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Content Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Creator
          </CardTitle>
          <CardDescription>
            Generate engaging social media content with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Write Post</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ImageIcon className="h-5 w-5" />
              <span>Create Image</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Video className="h-5 w-5" />
              <span>Make Video</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Analyze Performance</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="What would you like to post about?"
                value={postTopic}
                onChange={(e) => setPostTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={postTone} onValueChange={setPostTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.filter(p => p.connected).map((platform) => (
                  <div key={platform.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <label htmlFor={platform.id} className="text-sm cursor-pointer">
                      {platform.name}
                    </label>
                  </div>
                ))}
                <div className="flex items-center gap-2 p-2 border rounded-lg">
                  <Checkbox
                    id="all"
                    checked={selectedPlatforms.length === 0}
                    onCheckedChange={() => setSelectedPlatforms([])}
                  />
                  <label htmlFor="all" className="text-sm cursor-pointer">
                    All
                  </label>
                </div>
              </div>
            </div>

            <Button onClick={generateContent} disabled={isGenerating} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>

            {generatedContent && (
              <div className="space-y-2">
                <Label>Generated Content</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={generateContent} variant="outline" disabled={isGenerating}>
                    Regenerate
                  </Button>
                  <Button variant="outline">Edit</Button>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                  <Button>Post Now</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Posts</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-green-500 mt-1">+23% from last month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Engagement</p>
              <p className="text-2xl font-bold">12.4K</p>
              <p className="text-sm text-green-500 mt-1">+18% from last month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Engagement Rate</p>
              <p className="text-2xl font-bold">8.7%</p>
              <p className="text-sm text-green-500 mt-1">+2.3% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaManager;
