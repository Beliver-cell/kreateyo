import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe, Languages, DollarSign, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Internationalization() {
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [multiCurrency, setMultiCurrency] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your internationalization preferences have been updated"
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Internationalization</h1>
        <p className="text-muted-foreground">Configure multi-language and regional settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Manage available languages for your site</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="auto-detect" className="cursor-pointer font-semibold">
                Auto-detect Language
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically show content in visitor's browser language
              </p>
            </div>
            <Switch
              id="auto-detect"
              checked={autoDetectLanguage}
              onCheckedChange={setAutoDetectLanguage}
            />
          </div>

          <div className="space-y-2">
            <Label>Default Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Active Languages</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">🇺🇸 English</span>
                <Button variant="outline" size="sm">Primary</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">🇪🇸 Spanish</span>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            </div>
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Configure pricing and currency display</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="multi-currency" className="cursor-pointer font-semibold">
                Enable Multi-Currency
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to view prices in their local currency
              </p>
            </div>
            <Switch
              id="multi-currency"
              checked={multiCurrency}
              onCheckedChange={setMultiCurrency}
            />
          </div>

          <div className="space-y-2">
            <Label>Base Currency</Label>
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {multiCurrency && (
            <div className="space-y-2">
              <Label>Additional Currencies</Label>
              <div className="flex gap-2">
                <Input placeholder="Add currency code (e.g., EUR)" />
                <Button>Add</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Regional Formats</CardTitle>
              <CardDescription>Date, time, and number formatting</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select defaultValue="auto">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Measurement System</Label>
            <Select defaultValue="metric">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm, L)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, in, gal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Manage tax rates and collection rules</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Business Location</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="State/Region" />
              <Input placeholder="City" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tax Rates</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Sales Tax</p>
                <p className="text-2xl font-bold">8.5%</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-calculated</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">VAT Rate</p>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-detected</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">GST Rate</p>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-detected</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tax Rules</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Tax included in prices</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Charge tax on shipping</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Digital products taxable</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} size="lg">
        Save International Settings
      </Button>
    </div>
  );
}
