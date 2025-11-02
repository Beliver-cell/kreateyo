import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [scaleMode, setScaleMode] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3">
        <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Manage your business settings and preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 max-w-5xl">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Business Information</CardTitle>
              <CardDescription className="text-xs">Update your business details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="business-name" className="text-xs">Business Name</Label>
                  <Input id="business-name" placeholder="Your Business" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="business-email" className="text-xs">Email</Label>
                  <Input id="business-email" type="email" placeholder="contact@business.com" className="h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="business-address" className="text-xs">Address</Label>
                <Input id="business-address" placeholder="123 Business Street" className="h-9" />
              </div>
              <Button className="w-full sm:w-auto h-9" size="sm">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Notifications</CardTitle>
              <CardDescription className="text-xs">Configure how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">Email Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">Order Alerts</Label>
                  <p className="text-[10px] text-muted-foreground">Get notified of new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">Marketing Updates</Label>
                  <p className="text-[10px] text-muted-foreground">Tips and feature announcements</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Advanced Features</CardTitle>
                  <CardDescription className="text-xs">Unlock powerful tools for scaling</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-3 pt-0">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="scale-mode" className="text-xs font-semibold cursor-pointer">
                      Scale Mode
                    </Label>
                    {scaleMode && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {scaleMode 
                      ? 'Advanced features enabled: A/B testing, API access, custom CSS, and more'
                      : 'Enable to unlock A/B testing, API access, custom CSS, and advanced analytics'}
                  </p>
                </div>
                <Switch
                  id="scale-mode"
                  checked={scaleMode}
                  onCheckedChange={setScaleMode}
                  className="ml-3"
                />
              </div>

              {scaleMode && (
                <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-xs font-semibold flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" />
                    Available Advanced Features
                  </h4>
                  <ul className="space-y-1.5 text-[10px] text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      A/B Testing for pages and campaigns
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      API Access with webhooks
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      Custom CSS editor
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      Advanced analytics dashboards
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      White-label options
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
