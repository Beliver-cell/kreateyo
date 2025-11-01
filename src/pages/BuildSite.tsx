import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Layout, Palette, Maximize2, Check } from 'lucide-react';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const templates = {
  ecommerce: [
    {
      id: 'ecom-modern',
      name: 'Modern Minimalist',
      description: 'Clean design with large product imagery and smooth animations',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      features: ['Hero slider', 'Quick view', 'Instagram feed'],
      popular: true
    },
    {
      id: 'ecom-vibrant',
      name: 'Vibrant Store',
      description: 'Bold colors and dynamic layouts perfect for fashion and lifestyle',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
      features: ['Mega menu', 'Video sections', 'Collection filters']
    },
    {
      id: 'ecom-luxury',
      name: 'Luxury Boutique',
      description: 'Elegant and sophisticated design for premium products',
      gradient: 'from-amber-900 via-yellow-600 to-amber-900',
      features: ['Parallax effects', 'Lookbook', 'Size guide']
    }
  ],
  services: [
    {
      id: 'serv-professional',
      name: 'Professional Services',
      description: 'Trust-building design ideal for consultants and agencies',
      gradient: 'from-blue-900 via-blue-700 to-cyan-900',
      features: ['Team showcase', 'Case studies', 'Testimonials'],
      popular: true
    },
    {
      id: 'serv-wellness',
      name: 'Wellness & Health',
      description: 'Calming design perfect for yoga, spa, and wellness businesses',
      gradient: 'from-green-800 via-teal-600 to-green-800',
      features: ['Class schedule', 'Instructor bios', 'Pricing tables']
    },
    {
      id: 'serv-creative',
      name: 'Creative Studio',
      description: 'Bold and artistic layout for designers and photographers',
      gradient: 'from-purple-900 via-pink-800 to-purple-900',
      features: ['Portfolio grid', 'Project showcase', 'Client logos']
    }
  ],
  blog: [
    {
      id: 'blog-magazine',
      name: 'Digital Magazine',
      description: 'Editorial layout with featured stories and categories',
      gradient: 'from-indigo-900 via-blue-800 to-indigo-900',
      features: ['Featured posts', 'Author boxes', 'Related articles'],
      popular: true
    },
    {
      id: 'blog-minimal',
      name: 'Minimal Blog',
      description: 'Distraction-free reading experience with clean typography',
      gradient: 'from-gray-800 via-gray-700 to-gray-900',
      features: ['Reading time', 'Table of contents', 'Dark mode']
    },
    {
      id: 'blog-lifestyle',
      name: 'Lifestyle Blog',
      description: 'Instagram-style layout perfect for lifestyle and travel content',
      gradient: 'from-rose-500 via-orange-500 to-yellow-500',
      features: ['Image galleries', 'Social sharing', 'Newsletter popup']
    }
  ]
};

const colorThemes = [
  { name: 'Ocean Blue', primary: '#0EA5E9', accent: '#06B6D4', bg: '#F0F9FF' },
  { name: 'Forest Green', primary: '#10B981', accent: '#34D399', bg: '#F0FDF4' },
  { name: 'Sunset Orange', primary: '#F59E0B', accent: '#FB923C', bg: '#FFF7ED' },
  { name: 'Royal Purple', primary: '#8B5CF6', accent: '#A78BFA', bg: '#FAF5FF' },
  { name: 'Cherry Red', primary: '#EF4444', accent: '#F87171', bg: '#FEF2F2' },
];

const fontPairings = [
  { name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
  { name: 'Classic Serif', heading: 'Playfair Display', body: 'Source Sans Pro' },
  { name: 'Tech Mono', heading: 'Space Mono', body: 'Roboto Mono' },
  { name: 'Elegant', heading: 'Cormorant', body: 'Lato' },
];

export default function BuildSite() {
  const [spacing, setSpacing] = useState([16]);
  const [cornerRadius, setCornerRadius] = useState([8]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const businessType = businessProfile.type || 'ecommerce';
  const currentTemplates = templates[businessType as keyof typeof templates] || templates.ecommerce;

  const handleApplyTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected!",
      description: `${templateName} selected. Click to preview and customize.`,
    });
  };

  const handlePreviewTemplate = () => {
    navigate('/template-preview');
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Build My Site</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Create your perfect website with templates or AI
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl">Choose Your Template</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Start with a professionally designed template for your {businessType} business
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handlePreviewTemplate}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Preview All Templates
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`group cursor-pointer transition-all hover:shadow-xl ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => handleApplyTemplate(template.id, template.name)}
                >
                  <div className={`aspect-video bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <Layout className="w-16 h-16 text-white/20" />
                    {template.popular && (
                      <Badge className="absolute top-3 right-3 bg-primary">
                        Popular
                      </Badge>
                    )}
                    {selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase">
                        Includes:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg md:text-xl">AI Site Builder</CardTitle>
              <CardDescription className="text-sm">
                Describe your vision and let AI create a custom website in seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Example: Create a modern sneaker store with black and green theme, hero section with product showcase, and minimalist design..."
                className="min-h-32 mb-4 text-sm"
              />
              <Button className="w-full bg-gradient-accent hover:opacity-90">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Site with AI
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Palette className="w-6 h-6" />
                Visual Design System
              </CardTitle>
              <CardDescription className="text-sm">
                Customize your site's look and feel with global style controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="fonts">Fonts</TabsTrigger>
                  <TabsTrigger value="spacing">Spacing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Color Themes</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {colorThemes.slice(0, 4).map((theme) => (
                        <Card key={theme.name} className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                          <CardContent className="p-3">
                            <div className="flex gap-2 mb-2">
                              <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
                              <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.accent }} />
                              <div className="w-6 h-6 rounded border" style={{ backgroundColor: theme.bg }} />
                            </div>
                            <div className="text-xs font-medium">{theme.name}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fonts" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Font Pairings</Label>
                    <div className="space-y-2">
                      {fontPairings.slice(0, 2).map((pairing) => (
                        <Card key={pairing.name} className="cursor-pointer hover:shadow-md transition-all">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-muted-foreground">{pairing.name}</div>
                                <div className="text-sm font-bold">Heading</div>
                              </div>
                              <Button size="sm" variant="outline">Apply</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="spacing" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" />
                        Global Spacing: {spacing[0]}px
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
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
