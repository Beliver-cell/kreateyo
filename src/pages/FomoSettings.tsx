import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Zap, 
  Eye, 
  Clock, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Bell,
  Palette,
  Save
} from 'lucide-react';

interface FomoSettingsData {
  id?: string;
  businessId?: string;
  livePurchaseEnabled: boolean;
  livePurchaseFrequency: number;
  livePurchaseDuration: number;
  livePurchaseUseRealData: boolean;
  livePurchaseSimulatedNames: string[];
  livePurchaseSimulatedLocations: string[];
  viewerCountEnabled: boolean;
  viewerCountMinimum: number;
  viewerCountMultiplier: string;
  viewerCountShowOnProduct: boolean;
  viewerCountShowOnCart: boolean;
  stockUrgencyEnabled: boolean;
  stockUrgencyThreshold: number;
  stockUrgencyMessage: string;
  stockUrgencyColor: string;
  countdownEnabled: boolean;
  countdownEndDate: string | null;
  countdownMessage: string;
  countdownShowOnProducts: boolean;
  soldCounterEnabled: boolean;
  soldCounterTimeWindow: number;
  soldCounterMinimum: number;
  soldCounterMessage: string;
  cartAbandonmentEnabled: boolean;
  cartAbandonmentDelay: number;
  cartAbandonmentMessage: string;
  flashSaleEnabled: boolean;
  flashSaleStartDate: string | null;
  flashSaleEndDate: string | null;
  flashSaleDiscount: number | null;
  flashSaleMessage: string;
  flashSaleBgColor: string;
  flashSaleTextColor: string;
  popupPosition: string;
  primaryColor: string;
}

const defaultSettings: FomoSettingsData = {
  livePurchaseEnabled: true,
  livePurchaseFrequency: 30,
  livePurchaseDuration: 5,
  livePurchaseUseRealData: true,
  livePurchaseSimulatedNames: [],
  livePurchaseSimulatedLocations: [],
  viewerCountEnabled: true,
  viewerCountMinimum: 1,
  viewerCountMultiplier: '1.0',
  viewerCountShowOnProduct: true,
  viewerCountShowOnCart: false,
  stockUrgencyEnabled: true,
  stockUrgencyThreshold: 10,
  stockUrgencyMessage: 'Only {count} left - order soon!',
  stockUrgencyColor: '#ef4444',
  countdownEnabled: false,
  countdownEndDate: null,
  countdownMessage: 'Sale ends in',
  countdownShowOnProducts: true,
  soldCounterEnabled: true,
  soldCounterTimeWindow: 24,
  soldCounterMinimum: 5,
  soldCounterMessage: '{count} sold in the last {hours} hours',
  cartAbandonmentEnabled: false,
  cartAbandonmentDelay: 60,
  cartAbandonmentMessage: 'Your cart is waiting!',
  flashSaleEnabled: false,
  flashSaleStartDate: null,
  flashSaleEndDate: null,
  flashSaleDiscount: null,
  flashSaleMessage: 'Flash Sale - {discount}% off ends tonight!',
  flashSaleBgColor: '#dc2626',
  flashSaleTextColor: '#ffffff',
  popupPosition: 'bottom-left',
  primaryColor: '#10b981',
};

export default function FomoSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<FomoSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const businessId = user?.id;

  useEffect(() => {
    if (businessId) {
      fetchSettings();
    }
  }, [businessId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/fomo/settings/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (error) {
      console.error('Error fetching FOMO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/fomo/settings/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        toast.success('FOMO settings saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save FOMO settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof FomoSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">FOMO Settings</h1>
          <p className="text-muted-foreground">
            Configure urgency and social proof widgets to boost conversions
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="purchase" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="purchase" className="text-xs md:text-sm">
            <ShoppingCart className="w-4 h-4 mr-1 hidden md:inline" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="viewers" className="text-xs md:text-sm">
            <Eye className="w-4 h-4 mr-1 hidden md:inline" />
            Viewers
          </TabsTrigger>
          <TabsTrigger value="stock" className="text-xs md:text-sm">
            <TrendingUp className="w-4 h-4 mr-1 hidden md:inline" />
            Stock
          </TabsTrigger>
          <TabsTrigger value="countdown" className="text-xs md:text-sm">
            <Clock className="w-4 h-4 mr-1 hidden md:inline" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="sold" className="text-xs md:text-sm">
            <Users className="w-4 h-4 mr-1 hidden md:inline" />
            Sold
          </TabsTrigger>
          <TabsTrigger value="flash" className="text-xs md:text-sm">
            <Zap className="w-4 h-4 mr-1 hidden md:inline" />
            Flash
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs md:text-sm">
            <Palette className="w-4 h-4 mr-1 hidden md:inline" />
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchase">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Live Purchase Popups
                  </CardTitle>
                  <CardDescription>
                    Show notifications when customers make purchases
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.livePurchaseEnabled}
                  onCheckedChange={(v) => updateSetting('livePurchaseEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Popup Frequency (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.livePurchaseFrequency]}
                      onValueChange={([v]) => updateSetting('livePurchaseFrequency', v)}
                      min={10}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{settings.livePurchaseFrequency}s</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Display Duration (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.livePurchaseDuration]}
                      onValueChange={([v]) => updateSetting('livePurchaseDuration', v)}
                      min={3}
                      max={15}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{settings.livePurchaseDuration}s</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Use Real Purchase Data</Label>
                    <p className="text-sm text-muted-foreground">Show actual recent purchases</p>
                  </div>
                  <Switch
                    checked={settings.livePurchaseUseRealData}
                    onCheckedChange={(v) => updateSetting('livePurchaseUseRealData', v)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Viewer Count
                  </CardTitle>
                  <CardDescription>
                    Display how many people are viewing products
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.viewerCountEnabled}
                  onCheckedChange={(v) => updateSetting('viewerCountEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Minimum viewers to display</Label>
                  <Input
                    type="number"
                    value={settings.viewerCountMinimum}
                    onChange={(e) => updateSetting('viewerCountMinimum', parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Viewer Multiplier</Label>
                  <Select
                    value={settings.viewerCountMultiplier}
                    onValueChange={(v) => updateSetting('viewerCountMultiplier', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1x (Actual count)</SelectItem>
                      <SelectItem value="1.5">1.5x (Moderate boost)</SelectItem>
                      <SelectItem value="2.0">2x (Double)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Show on Product Pages</Label>
                  </div>
                  <Switch
                    checked={settings.viewerCountShowOnProduct}
                    onCheckedChange={(v) => updateSetting('viewerCountShowOnProduct', v)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Show on Cart Page</Label>
                  </div>
                  <Switch
                    checked={settings.viewerCountShowOnCart}
                    onCheckedChange={(v) => updateSetting('viewerCountShowOnCart', v)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Stock Urgency
                  </CardTitle>
                  <CardDescription>
                    Show low stock warnings to create urgency
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.stockUrgencyEnabled}
                  onCheckedChange={(v) => updateSetting('stockUrgencyEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Show when stock is below</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.stockUrgencyThreshold]}
                      onValueChange={([v]) => updateSetting('stockUrgencyThreshold', v)}
                      min={1}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{settings.stockUrgencyThreshold}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message Template</Label>
                  <Input
                    value={settings.stockUrgencyMessage}
                    onChange={(e) => updateSetting('stockUrgencyMessage', e.target.value)}
                    placeholder="Only {count} left - order soon!"
                  />
                  <p className="text-xs text-muted-foreground">Use {'{count}'} for stock number</p>
                </div>

                <div className="space-y-2">
                  <Label>Warning Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.stockUrgencyColor}
                      onChange={(e) => updateSetting('stockUrgencyColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.stockUrgencyColor}
                      onChange={(e) => updateSetting('stockUrgencyColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countdown">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Countdown Timer
                  </CardTitle>
                  <CardDescription>
                    Add urgency with time-limited offers
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.countdownEnabled}
                  onCheckedChange={(v) => updateSetting('countdownEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Sale End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={settings.countdownEndDate || ''}
                    onChange={(e) => updateSetting('countdownEndDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Countdown Message</Label>
                  <Input
                    value={settings.countdownMessage}
                    onChange={(e) => updateSetting('countdownMessage', e.target.value)}
                    placeholder="Sale ends in"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Show on Product Pages</Label>
                  </div>
                  <Switch
                    checked={settings.countdownShowOnProducts}
                    onCheckedChange={(v) => updateSetting('countdownShowOnProducts', v)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sold">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Sold Counter
                  </CardTitle>
                  <CardDescription>
                    Show how many items sold recently
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.soldCounterEnabled}
                  onCheckedChange={(v) => updateSetting('soldCounterEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Time Window (hours)</Label>
                  <Select
                    value={settings.soldCounterTimeWindow.toString()}
                    onValueChange={(v) => updateSetting('soldCounterTimeWindow', parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Last 6 hours</SelectItem>
                      <SelectItem value="12">Last 12 hours</SelectItem>
                      <SelectItem value="24">Last 24 hours</SelectItem>
                      <SelectItem value="48">Last 48 hours</SelectItem>
                      <SelectItem value="168">Last 7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum sales to display</Label>
                  <Input
                    type="number"
                    value={settings.soldCounterMinimum}
                    onChange={(e) => updateSetting('soldCounterMinimum', parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message Template</Label>
                  <Input
                    value={settings.soldCounterMessage}
                    onChange={(e) => updateSetting('soldCounterMessage', e.target.value)}
                    placeholder="{count} sold in the last {hours} hours"
                  />
                  <p className="text-xs text-muted-foreground">Use {'{count}'} for sales, {'{hours}'} for time window</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flash">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Flash Sale Banner
                  </CardTitle>
                  <CardDescription>
                    Display a prominent sale announcement
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.flashSaleEnabled}
                  onCheckedChange={(v) => updateSetting('flashSaleEnabled', v)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="datetime-local"
                      value={settings.flashSaleStartDate || ''}
                      onChange={(e) => updateSetting('flashSaleStartDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="datetime-local"
                      value={settings.flashSaleEndDate || ''}
                      onChange={(e) => updateSetting('flashSaleEndDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    value={settings.flashSaleDiscount || ''}
                    onChange={(e) => updateSetting('flashSaleDiscount', parseInt(e.target.value) || null)}
                    placeholder="20"
                    min={1}
                    max={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Banner Message</Label>
                  <Input
                    value={settings.flashSaleMessage}
                    onChange={(e) => updateSetting('flashSaleMessage', e.target.value)}
                    placeholder="Flash Sale - {discount}% off ends tonight!"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.flashSaleBgColor}
                        onChange={(e) => updateSetting('flashSaleBgColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={settings.flashSaleBgColor}
                        onChange={(e) => updateSetting('flashSaleBgColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.flashSaleTextColor}
                        onChange={(e) => updateSetting('flashSaleTextColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={settings.flashSaleTextColor}
                        onChange={(e) => updateSetting('flashSaleTextColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-lg text-center font-semibold"
                  style={{ 
                    backgroundColor: settings.flashSaleBgColor, 
                    color: settings.flashSaleTextColor 
                  }}
                >
                  {settings.flashSaleMessage.replace('{discount}', settings.flashSaleDiscount?.toString() || '20')}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Global Styling
              </CardTitle>
              <CardDescription>
                Customize the appearance of all FOMO widgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Popup Position</Label>
                  <Select
                    value={settings.popupPosition}
                    onValueChange={(v) => updateSetting('popupPosition', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Primary Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed rounded-lg">
                  <h4 className="font-medium mb-4">Preview</h4>
                  <div 
                    className={`
                      p-4 rounded-lg shadow-lg max-w-xs
                      ${settings.popupPosition.includes('right') ? 'ml-auto' : ''}
                    `}
                    style={{ backgroundColor: settings.primaryColor + '15', borderLeft: `4px solid ${settings.primaryColor}` }}
                  >
                    <p className="text-sm font-medium">Sarah from Lagos just purchased</p>
                    <p className="text-xs text-muted-foreground">Premium Running Shoes</p>
                    <p className="text-xs mt-1" style={{ color: settings.primaryColor }}>2 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
