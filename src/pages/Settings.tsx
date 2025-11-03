import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [scaleMode, setScaleMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  const handleSaveChanges = () => {
    toast({ 
      title: "Settings saved", 
      description: "Your changes have been successfully saved." 
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" placeholder="Your Business" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email">Email</Label>
              <Input id="business-email" type="email" placeholder="contact@business.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-address">Address</Label>
            <Input id="business-address" placeholder="123 Business Street" />
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Order Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of new orders</p>
            </div>
            <Switch 
              checked={orderAlerts}
              onCheckedChange={setOrderAlerts}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">Tips and feature announcements</p>
            </div>
            <Switch 
              checked={marketingUpdates}
              onCheckedChange={setMarketingUpdates}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>Unlock powerful tools for scaling</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="scale-mode" className="cursor-pointer font-semibold">
                  Scale Mode
                </Label>
                {scaleMode && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {scaleMode 
                  ? 'Advanced features enabled: A/B testing, API access, custom CSS, and more'
                  : 'Enable to unlock A/B testing, API access, custom CSS, and advanced analytics'}
              </p>
            </div>
            <Switch
              id="scale-mode"
              checked={scaleMode}
              onCheckedChange={setScaleMode}
              className="ml-4"
            />
          </div>

          {scaleMode && (
            <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Available Advanced Features
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  A/B Testing for pages and campaigns
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  API Access with webhooks
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Custom CSS editor
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Advanced analytics dashboards
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  White-label options
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
