import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Smartphone, History, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requireStrongPassword, setRequireStrongPassword] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const handleSaveSecurity = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved"
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and authentication</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="2fa" className="cursor-pointer font-semibold">
                Enable 2FA
              </Label>
              <p className="text-sm text-muted-foreground">
                Require authentication code from your phone when signing in
              </p>
            </div>
            <Switch
              id="2fa"
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          {twoFactorEnabled && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Button>
                <Smartphone className="w-4 h-4 mr-2" />
                Setup Authenticator App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Password Policies</CardTitle>
              <CardDescription>Set password requirements for your team</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="strong-password" className="cursor-pointer font-semibold">
                Require Strong Passwords
              </Label>
              <p className="text-sm text-muted-foreground">
                Minimum 12 characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>
            <Switch
              id="strong-password"
              checked={requireStrongPassword}
              onCheckedChange={setRequireStrongPassword}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="session-timeout" className="cursor-pointer font-semibold">
                Automatic Session Timeout
              </Label>
              <p className="text-sm text-muted-foreground">
                Sign out users after 30 minutes of inactivity
              </p>
            </div>
            <Switch
              id="session-timeout"
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your active sessions across devices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Last active: Just now</p>
              </div>
              <Button variant="outline" size="sm">Active</Button>
            </div>
            <Button variant="destructive" size="sm">
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Login History</CardTitle>
              <CardDescription>Review recent login attempts to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Successful login</p>
                <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
              </div>
              <span className="text-sm text-green-600">✓ Success</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Successful login</p>
                <p className="text-sm text-muted-foreground">Yesterday at 3:45 PM</p>
              </div>
              <span className="text-sm text-green-600">✓ Success</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSecurity} size="lg">
        Save Security Settings
      </Button>
    </div>
  );
}
