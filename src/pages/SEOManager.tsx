import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Search, TrendingUp, Globe, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SEOManager = () => {
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const isTeamAccount = businessProfile.accountType === 'team';
  const [selectedRegion, setSelectedRegion] = useState("us");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["us"]);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const regions = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "es", label: "Spain" },
    { value: "it", label: "Italy" },
  ];

  const toggleRegion = (regionValue: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionValue)
        ? prev.filter(r => r !== regionValue)
        : [...prev, regionValue]
    );
  };

  const handleAutoOptimize = () => {
    toast({
      title: "Optimization Started",
      description: "AI is optimizing your meta data for better search visibility",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Manager</h1>
        <p className="text-muted-foreground">
          Optimize your website for search engines with AI assistance
        </p>
      </div>

      {/* Business Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Business Visibility Settings
          </CardTitle>
          <CardDescription>
            Configure your target regions and business details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>📍 Target Region{isTeamAccount ? "s" : ""}</Label>
            {isTeamAccount ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {regions.map((region) => (
                  <div key={region.value} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Checkbox
                      id={region.value}
                      checked={selectedRegions.includes(region.value)}
                      onCheckedChange={() => toggleRegion(region.value)}
                    />
                    <label htmlFor={region.value} className="text-sm cursor-pointer">
                      {region.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              placeholder="Your business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              placeholder="Brief description of your business"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
            />
          </div>

          <Button onClick={handleAutoOptimize} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            AUTO-OPTIMIZE MY META DATA
          </Button>
        </CardContent>
      </Card>

      {/* SEO Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Performance
          </CardTitle>
          <CardDescription>
            Your website's search engine rankings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">"your business name"</p>
                <p className="text-sm text-muted-foreground">Main keyword</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">#1</p>
                <p className="text-xs text-muted-foreground">Position</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">"your city + service"</p>
                <p className="text-sm text-muted-foreground">Local keyword</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">#3</p>
                <p className="text-xs text-muted-foreground">Position</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">"main keyword"</p>
                <p className="text-sm text-muted-foreground">Industry keyword</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">#8</p>
                <p className="text-xs text-muted-foreground">Position</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Search Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">45</p>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">1,234</p>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">+234 from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Click-Through Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">3.6%</p>
              <Progress value={36} className="h-2" />
              <p className="text-xs text-muted-foreground">+0.4% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI SEO Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI SEO Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Search className="h-5 w-5" />
              <span>Keyword Research</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Content Optimization</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Competitor Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Globe className="h-5 w-5" />
              <span>Backlink Opportunities</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
