import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Sparkles, Send, Clock, Users, TrendingUp, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailCampaigns = () => {
  const { toast } = useToast();
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceAgreed, setComplianceAgreed] = useState(false);
  const [emailService, setEmailService] = useState<string | null>(null);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleServiceConnect = (service: string) => {
    setEmailService(service);
    setShowCompliance(true);
  };

  const handleComplianceAgree = () => {
    setComplianceAgreed(true);
    setShowCompliance(false);
    toast({
      title: "Email Service Connected",
      description: "You can now create and send email campaigns",
    });
  };

  const generateSubjectLine = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email-content', {
        body: {
          type: 'subject',
          tone: selectedTone,
          context: campaignContent
        }
      });

      if (error) throw error;
      setCampaignSubject(data.content);
      toast({
        title: "Subject Line Generated",
        description: "AI has created a compelling subject line",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate subject line. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email-content', {
        body: {
          type: 'content',
          tone: selectedTone,
          subject: campaignSubject
        }
      });

      if (error) throw error;
      setCampaignContent(data.content);
      toast({
        title: "Content Generated",
        description: "AI has created email content for your campaign",
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

  if (!complianceAgreed) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage email marketing campaigns
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connect Your Email Service</CardTitle>
            <CardDescription>
              Before we begin, you need to connect an email provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleServiceConnect("gmail")}
              >
                <Mail className="h-6 w-6" />
                <span>Connect Gmail/Google Workspace</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleServiceConnect("outlook")}
              >
                <Mail className="h-6 w-6" />
                <span>Connect Outlook/Office 365</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleServiceConnect("smtp")}
              >
                <Mail className="h-6 w-6" />
                <span>Connect SMTP Server</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => handleServiceConnect("ses")}
              >
                <Mail className="h-6 w-6" />
                <span>Connect Amazon SES</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showCompliance} onOpenChange={setShowCompliance}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>📝 Email Compliance Agreement</DialogTitle>
              <DialogDescription>
                To send email campaigns, you must agree to our compliance requirements
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <Checkbox id="permission" defaultChecked disabled />
                <label htmlFor="permission" className="text-sm">
                  I have permission to email all recipients
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="unsubscribe" defaultChecked disabled />
                <label htmlFor="unsubscribe" className="text-sm">
                  I include unsubscribe links in every email
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="honor" defaultChecked disabled />
                <label htmlFor="honor" className="text-sm">
                  I honor unsubscribe requests within 24 hours
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="address" defaultChecked disabled />
                <label htmlFor="address" className="text-sm">
                  I include my physical business address
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="spam" defaultChecked disabled />
                <label htmlFor="spam" className="text-sm">
                  I will not send spam or purchased lists
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="understand" defaultChecked disabled />
                <label htmlFor="understand" className="text-sm">
                  I understand email sending limits and best practices
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCompliance(false)}>
                Cancel
              </Button>
              <Button onClick={handleComplianceAgree}>
                I Agree & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create AI-powered email campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">12,847</span>
              <span className="text-sm text-green-500">+15%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">42.3%</span>
              <span className="text-sm text-green-500">+5.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">18.7%</span>
              <span className="text-sm text-green-500">+3.1%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">8,423</span>
              <span className="text-sm text-green-500">+122</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Email Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Email Assistant
          </CardTitle>
          <CardDescription>
            Let AI help you create compelling email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={generateSubjectLine}>
              <Sparkles className="h-5 w-5" />
              <span>AI Subject Line Generator</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={generateContent}>
              <Sparkles className="h-5 w-5" />
              <span>AI Content Writer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Clock className="h-5 w-5" />
              <span>AI Send Time Optimizer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span>AI Audience Segmenter</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Tone</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="subject">Subject Line</Label>
                <Button size="sm" variant="ghost" onClick={generateSubjectLine} disabled={isGenerating}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
              <Input
                id="subject"
                placeholder="Enter subject line or generate with AI"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Email Content</Label>
                <Button size="sm" variant="ghost" onClick={generateContent} disabled={isGenerating}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
              <Textarea
                id="content"
                placeholder="Write your email content or generate with AI"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
                rows={10}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Campaign
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Predictor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Performance Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Predicted Open Rate</span>
              <span className="font-bold text-green-600">38-45%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Predicted Click Rate</span>
              <span className="font-bold text-green-600">15-20%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Spam Score</span>
              <span className="font-bold text-green-600">Low (2/10)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCampaigns;
