import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Receipt, Plus, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TaxesManager = () => {
  const { toast } = useToast();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [taxInPrice, setTaxInPrice] = useState(true);
  const [taxOnShipping, setTaxOnShipping] = useState(true);
  const [digitalTaxable, setDigitalTaxable] = useState(true);

  const taxRegions = [
    { region: "California, USA", rate: "7.25%" },
    { region: "New York, USA", rate: "8.875%" },
    { region: "Texas, USA", rate: "6.25%" },
  ];

  const handleSaveSetup = () => {
    toast({
      title: "Tax Setup Saved",
      description: "Your tax configuration has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taxes Manager</h1>
        <p className="text-muted-foreground">
          Configure and manage tax calculations for your business
        </p>
      </div>

      {/* Tax Setup Wizard */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Setup Wizard</CardTitle>
          <CardDescription>
            Configure your business location and tax rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Region</Label>
            <Input
              id="state"
              placeholder="Enter your state or region"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <Button onClick={handleSaveSetup} className="w-full">
            Save Location & Calculate Rates
          </Button>
        </CardContent>
      </Card>

      {/* Your Tax Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tax Rates</CardTitle>
          <CardDescription>
            Auto-calculated based on your business location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Sales Tax Rate</p>
                <p className="text-sm text-muted-foreground">For US-based sales</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">8.5%</p>
                <p className="text-xs text-muted-foreground">Auto-calculated</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">VAT Rate</p>
                <p className="text-sm text-muted-foreground">For EU-based sales</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground">Auto-detected</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">GST Rate</p>
                <p className="text-sm text-muted-foreground">For applicable regions</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">0%</p>
                <p className="text-xs text-muted-foreground">Auto-detected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Rules</CardTitle>
          <CardDescription>
            Configure how taxes are applied
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Tax included in prices</p>
              <p className="text-sm text-muted-foreground">Display prices with tax included</p>
            </div>
            <Switch checked={taxInPrice} onCheckedChange={setTaxInPrice} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Charge tax on shipping</p>
              <p className="text-sm text-muted-foreground">Apply tax to shipping costs</p>
            </div>
            <Switch checked={taxOnShipping} onCheckedChange={setTaxOnShipping} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Digital products taxable</p>
              <p className="text-sm text-muted-foreground">Apply tax to digital goods</p>
            </div>
            <Switch checked={digitalTaxable} onCheckedChange={setDigitalTaxable} />
          </div>
        </CardContent>
      </Card>

      {/* Tax Regions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tax Regions Where You Collect</CardTitle>
              <CardDescription>
                Manage tax collection by region
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Region
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {taxRegions.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{region.region}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{region.rate}</span>
                  <Button size="sm" variant="ghost">Edit</Button>
                  <Button size="sm" variant="ghost">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tax Reports
          </CardTitle>
          <CardDescription>
            Download tax reports for accounting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Quarterly Tax Report (Q4 2024)
              </span>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Annual Tax Summary (2024)
              </span>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Taxable vs Non-taxable Sales
              </span>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Collected (Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$2,847.50</p>
            <p className="text-xs text-muted-foreground mt-1">+$342 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Collected (Quarter)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$8,234.75</p>
            <p className="text-xs text-muted-foreground mt-1">Q4 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Collected (Year)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$31,842.25</p>
            <p className="text-xs text-muted-foreground mt-1">2024 total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxesManager;
