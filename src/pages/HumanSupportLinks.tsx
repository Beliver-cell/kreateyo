import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Phone, Facebook, Instagram, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HumanSupportLinks = () => {
  const { toast } = useToast();
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [phoneEnabled, setPhoneEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [autoResponseMessage, setAutoResponseMessage] = useState("Thanks for messaging! We'll respond within 2 hours during business hours.");

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your support channel settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Human Support Links</h1>
        <p className="text-muted-foreground">
          Connect your support channels for seamless customer handoff
        </p>
      </div>

      {/* WhatsApp Business */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                WhatsApp Business
              </CardTitle>
              <CardDescription>
                Let customers chat with you directly on WhatsApp
              </CardDescription>
            </div>
            <Switch
              checked={whatsappEnabled}
              onCheckedChange={setWhatsappEnabled}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              placeholder="+1 (555) 123-4567"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              disabled={!whatsappEnabled}
            />
            <p className="text-sm text-muted-foreground">
              Include country code (e.g., +1 for US)
            </p>
          </div>
          {whatsappEnabled && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Customers will see: "Chat on WhatsApp" button
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Email Support
              </CardTitle>
              <CardDescription>
                Provide email support for detailed inquiries
              </CardDescription>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Support Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="support@yourbusiness.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={!emailEnabled}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!emailEnabled}>Connect Gmail</Button>
            <Button variant="outline" disabled={!emailEnabled}>Other Email</Button>
          </div>
        </CardContent>
      </Card>

      {/* Phone Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-500" />
                Phone Support
              </CardTitle>
              <CardDescription>
                Enable phone support for urgent matters
              </CardDescription>
            </div>
            <Switch
              checked={phoneEnabled}
              onCheckedChange={setPhoneEnabled}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!phoneEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Messaging */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Messaging</CardTitle>
          <CardDescription>
            Connect your social media accounts for direct messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Connect Facebook Messenger
            </Button>
            <Button variant="outline" className="justify-start">
              <Instagram className="h-4 w-4 mr-2 text-pink-600" />
              Connect Instagram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Automated Response Message */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Response Message</CardTitle>
          <CardDescription>
            Message shown when customers are connected to your support channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Thanks for messaging! We'll respond within..."
            value={autoResponseMessage}
            onChange={(e) => setAutoResponseMessage(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Smart Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Smart Escalation Rules
          </CardTitle>
          <CardDescription>
            Automatically connect customers to human support when needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Customer says "human" or "agent"</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Complex technical issue detected</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Refund or return request</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">After 3 bot interactions</span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="mt-4 p-4 bg-accent/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Escalation Message:</p>
            <p className="text-sm text-muted-foreground italic">
              "Let me connect you with our support team for better help! You can reach us via:"
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default HumanSupportLinks;
