import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowLeft, 
  Check, 
  Palette,
  Type,
  Sliders
} from 'lucide-react';
import EcommerceTemplate from '@/components/templates/EcommerceTemplate';
import BlogTemplate from '@/components/templates/BlogTemplate';
import ServiceTemplate from '@/components/templates/ServiceTemplate';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const colorThemes = [
  { name: 'Ocean Blue', primary: 'hsl(221, 83%, 53%)', accent: 'hsl(187, 100%, 42%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Forest Green', primary: 'hsl(142, 76%, 36%)', accent: 'hsl(142, 77%, 73%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Sunset Orange', primary: 'hsl(31, 97%, 48%)', accent: 'hsl(31, 95%, 70%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Royal Purple', primary: 'hsl(258, 90%, 66%)', accent: 'hsl(258, 90%, 77%)', background: 'hsl(0, 0%, 100%)' },
  { name: 'Cherry Red', primary: 'hsl(0, 84%, 60%)', accent: 'hsl(0, 91%, 71%)', background: 'hsl(0, 0%, 100%)' },
];

const fontPairings = [
  { name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
  { name: 'Classic Serif', heading: 'Playfair Display', body: 'Source Sans Pro' },
  { name: 'Tech Mono', heading: 'Space Mono', body: 'Roboto Mono' },
  { name: 'Elegant', heading: 'Cormorant', body: 'Lato' },
];

export default function TemplatePreview() {
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<'ecommerce' | 'blog' | 'service'>(
    businessProfile.type === 'ecommerce' ? 'ecommerce' : 
    businessProfile.type === 'blog' ? 'blog' : 'service'
  );
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedColor, setSelectedColor] = useState(colorThemes[0]);
  const [selectedFont, setSelectedFont] = useState(fontPairings[0]);
  const [spacing, setSpacing] = useState([16]);
  const [cornerRadius, setCornerRadius] = useState([8]);

  const viewModeWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  };

  const templates = {
    ecommerce: {
      name: 'E-Commerce Store',
      component: EcommerceTemplate,
      features: [
        'Product grid layout',
        'Shopping cart functionality',
        'Customer reviews',
        'Wishlist & favorites',
        'Payment-ready design',
        'Mobile-optimized checkout'
      ]
    },
    blog: {
      name: 'Blogging Platform',
      component: BlogTemplate,
      features: [
        'Clean article layout',
        'Category navigation',
        'Author profiles',
        'Newsletter signup',
        'Social sharing',
        'Reading time estimates'
      ]
    },
    service: {
      name: 'Service Business',
      component: ServiceTemplate,
      features: [
        'Service showcase',
        'Booking forms',
        'Team profiles',
        'Client testimonials',
        'Pricing packages',
        'Contact integration'
      ]
    }
  };

  const CurrentTemplate = templates[selectedTemplate].component;

  const handleApplyTemplate = () => {
    toast({
      title: "Template Applied!",
      description: `${templates[selectedTemplate].name} has been applied with your customizations.`,
    });
    // In a real app, this would save the template selection and customizations
    navigate('/build');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/build')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Template Preview</h1>
                <p className="text-sm text-muted-foreground">Customize and preview your site</p>
              </div>
            </div>
            <Button onClick={handleApplyTemplate} size="lg">
              <Check className="w-4 h-4 mr-2" />
              Apply Template
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar Controls */}
          <Card className="h-fit sticky top-24">
            <CardContent className="p-6">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="templates" className="text-xs">
                    <Monitor className="w-3 h-3 mr-1" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Sliders className="w-3 h-3 mr-1" />
                    Spacing
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Choose Template</Label>
                    <div className="space-y-2">
                      {Object.entries(templates).map(([key, template]) => (
                        <Card 
                          key={key}
                          className={`cursor-pointer transition-all ${
                            selectedTemplate === key 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedTemplate(key as typeof selectedTemplate)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{template.name}</h4>
                              {selectedTemplate === key && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="space-y-1">
                              {template.features.slice(0, 3).map((feature, idx) => (
                                <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Color Theme</Label>
                    <div className="space-y-2">
                      {colorThemes.map((theme) => (
                        <Card 
                          key={theme.name}
                          className={`cursor-pointer transition-all ${
                            selectedColor.name === theme.name 
                              ? 'ring-2 ring-primary' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedColor(theme)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.accent }} />
                                <span className="text-xs font-medium">{theme.name}</span>
                              </div>
                              {selectedColor.name === theme.name && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      <Type className="w-4 h-4 inline mr-1" />
                      Font Pairing
                    </Label>
                    <div className="space-y-2">
                      {fontPairings.map((pairing) => (
                        <Card 
                          key={pairing.name}
                          className={`cursor-pointer transition-all ${
                            selectedFont.name === pairing.name 
                              ? 'ring-2 ring-primary' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedFont(pairing)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{pairing.name}</span>
                              {selectedFont.name === pairing.name && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Spacing: {spacing[0]}px
                    </Label>
                    <Slider
                      value={spacing}
                      onValueChange={setSpacing}
                      min={8}
                      max={32}
                      step={4}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Corner Radius: {cornerRadius[0]}px
                    </Label>
                    <Slider
                      value={cornerRadius}
                      onValueChange={setCornerRadius}
                      min={0}
                      max={24}
                      step={4}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <div className="space-y-4">
            {/* View Mode Selector */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{templates[selectedTemplate].name}</Badge>
                    <span className="text-sm text-muted-foreground">Live Preview</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'desktop' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('desktop')}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'tablet' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('tablet')}
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'mobile' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('mobile')}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card className="overflow-hidden">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className={viewModeWidths[viewMode]}>
                  <CurrentTemplate 
                    colors={selectedColor}
                    fonts={selectedFont}
                  />
                </div>
              </ScrollArea>
            </Card>

            {/* Features List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Template Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {templates[selectedTemplate].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
