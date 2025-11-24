import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Globe, Menu, Building, Image as ImageIcon, Users, User, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { WorkspaceUpgradeDialog } from '@/components/WorkspaceUpgradeDialog';
import { useToast } from '@/hooks/use-toast';

export default function SettingsEnhanced() {
  const { businessProfile, setAccountType } = useBusinessContext();
  const { toast } = useToast();
  const [scaleMode, setScaleMode] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const colorThemes = [
    { name: 'Blue & White', primary: 'hsl(217 91% 60%)', secondary: 'hsl(220 14% 96%)' },
    { name: 'Purple', primary: 'hsl(262 83% 58%)', secondary: 'hsl(262 83% 96%)' },
    { name: 'Green', primary: 'hsl(142 76% 36%)', secondary: 'hsl(142 76% 96%)' },
    { name: 'Orange', primary: 'hsl(24 95% 53%)', secondary: 'hsl(24 95% 96%)' },
  ];

  const fonts = [
    'Inter', 'Poppins', 'DM Sans', 'Space Grotesk', 'IBM Plex Sans'
  ];

  const handleWorkspaceSwitch = () => {
    const newType = businessProfile.accountType === 'solo' ? 'team' : 'solo';
    setAccountType(newType);
    setUpgradeDialogOpen(false);
    
    toast({
      title: newType === 'team' ? 'Upgraded to Team Workspace!' : 'Switched to Solo Workspace',
      description: newType === 'team' 
        ? 'You can now invite team members and access enterprise features.'
        : 'Team features have been hidden from your dashboard.',
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your business settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="style">
            <Palette className="w-4 h-4 mr-2" />
            Style
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Menu className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building className="w-4 h-4 mr-2" />
            Business
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" placeholder="My Awesome Site" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input id="site-description" placeholder="A brief description of your site" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>USD - $</option>
                    <option>EUR - €</option>
                    <option>GBP - £</option>
                    <option>JPY - ¥</option>
                  </select>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favicon</CardTitle>
              <CardDescription>Upload your site favicon (32x32px recommended)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg border-2 bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <input type="file" id="favicon" className="hidden" accept="image/*" />
                  <label htmlFor="favicon">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Favicon</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">PNG, ICO or SVG (max 1MB)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Type</CardTitle>
              <CardDescription>Manage your workspace configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6 p-6 rounded-lg border-2 bg-gradient-subtle">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                  businessProfile.accountType === 'team' ? 'bg-gradient-primary' : 'bg-muted'
                }`}>
                  {businessProfile.accountType === 'team' ? (
                    <Users className="w-8 h-8 text-white" />
                  ) : (
                    <User className="w-8 h-8 text-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      Current Plan: {businessProfile.accountType === 'team' ? 'Team Workspace' : 'Solo Workspace'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {businessProfile.accountType === 'team' 
                        ? 'You have access to all enterprise and collaboration features.'
                        : 'You have access to all core business features.'}
                    </p>
                  </div>

                  {businessProfile.accountType === 'solo' ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Benefits you'll get by upgrading:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUpCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Team member invitations and management</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUpCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Role-based permissions and access control</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUpCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Team activity tracking and audit logs</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUpCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Advanced collaboration tools</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUpCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Developer tools and API access</span>
                        </li>
                      </ul>
                      <Button 
                        onClick={() => setUpgradeDialogOpen(true)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Upgrade to Team Workspace
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">What will change if you switch to Solo:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive">✗</span>
                          <span>Team features will be hidden from dashboard</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive">✗</span>
                          <span>Team member access will be removed</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-destructive">✗</span>
                          <span>Developer tools will be hidden</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="text-success">✓</span>
                          <span>All your business data will be preserved</span>
                        </li>
                      </ul>
                      <Button 
                        onClick={() => setUpgradeDialogOpen(true)}
                        variant="outline"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Switch to Solo Workspace
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Theme</CardTitle>
              <CardDescription>Choose a color scheme for your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.name}
                    className="p-4 rounded-lg border-2 hover:border-primary transition-all"
                  >
                    <div className="flex gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>
                    <p className="text-sm font-medium">{theme.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Select your site's font family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {fonts.map((font) => (
                  <button
                    key={font}
                    className="w-full p-4 rounded-lg border-2 hover:border-primary transition-all text-left"
                  >
                    <p style={{ fontFamily: font }} className="text-lg font-semibold">
                      {font}
                    </p>
                    <p style={{ fontFamily: font }} className="text-sm text-muted-foreground">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Upload your brand logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 rounded-lg border-2 bg-muted flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <input type="file" id="logo" className="hidden" accept="image/*" />
                    <label htmlFor="logo">
                      <Button type="button" variant="outline" asChild>
                        <span>Upload Logo</span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">PNG or SVG recommended (max 2MB)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-size">Logo Size</Label>
                    <select 
                      id="logo-size"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Builder</CardTitle>
              <CardDescription>Customize your site navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg border-2 border-dashed bg-muted/30">
                <p className="text-sm text-muted-foreground text-center">
                  Drag and drop menu items to reorder them
                </p>
              </div>
              <div className="space-y-2">
                {['Home', 'Products', 'About', 'Contact'].map((item) => (
                  <div key={item} className="p-3 rounded-lg border bg-card flex items-center justify-between cursor-move hover:border-primary transition-colors">
                    <span className="font-medium">{item}</span>
                    <Menu className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                + Add Menu Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mobile Menu</CardTitle>
              <CardDescription>Configure mobile navigation behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label htmlFor="mobile-menu">Hamburger Menu</Label>
                  <p className="text-sm text-muted-foreground">Show menu icon on mobile devices</p>
                </div>
                <Switch id="mobile-menu" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Info Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Phone</Label>
                  <Input id="business-phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-tax">Tax ID</Label>
                  <Input id="business-tax" placeholder="XX-XXXXXXX" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Link your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform.toLowerCase()}>{platform}</Label>
                  <Input 
                    id={platform.toLowerCase()} 
                    placeholder={`https://${platform.toLowerCase()}.com/yourprofile`} 
                  />
                </div>
              ))}
              <Button>Save Links</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium w-24">{day}</span>
                  <div className="flex items-center gap-2">
                    <Input type="time" className="w-32" defaultValue="09:00" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="time" className="w-32" defaultValue="17:00" />
                  </div>
                  <Switch defaultChecked={day !== 'Sunday'} />
                </div>
              ))}
              <Button>Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <WorkspaceUpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentType={businessProfile.accountType || 'solo'}
        onConfirm={handleWorkspaceSwitch}
      />
    </div>
  );
}
