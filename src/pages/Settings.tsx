import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your business settings and preferences</p>
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
          <Button className="w-full sm:w-auto">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of new orders</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">Tips and feature announcements</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
