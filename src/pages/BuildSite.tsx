import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Layout, Palette, Maximize2 } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Build My Site</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Create your perfect website with templates or AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg md:text-xl">Template Builder</CardTitle>
            <CardDescription className="text-sm">
              Choose from professionally designed templates and customize with drag-and-drop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg bg-gradient-subtle border border-border p-4 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <span className="text-muted-foreground text-xs md:text-sm">Template {i}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" variant="outline">
              Browse Templates
            </Button>
          </CardContent>
        </Card>

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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Palette className="w-6 h-6" />
              Visual Design System
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Customize your site's look and feel with global style controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="fonts">Fonts</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-4 mt-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Color Themes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {colorThemes.map((theme) => (
                      <Card key={theme.name} className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                        <CardContent className="p-3">
                          <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.primary }} />
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.accent }} />
                            <div className="w-8 h-8 rounded border" style={{ backgroundColor: theme.bg }} />
                          </div>
                          <div className="text-sm font-medium">{theme.name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fonts" className="space-y-4 mt-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Font Pairings</Label>
                  <div className="space-y-3">
                    {fontPairings.map((pairing) => (
                      <Card key={pairing.name} className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-muted-foreground">{pairing.name}</div>
                              <div className="text-lg font-bold" style={{ fontFamily: pairing.heading }}>
                                Heading Style
                              </div>
                              <div className="text-sm" style={{ fontFamily: pairing.body }}>
                                Body text example for this pairing
                              </div>
                            </div>
                            <Button size="sm" variant="outline">Apply</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="spacing" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
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
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Compact (8px)</span>
                      <span>Comfortable (16px)</span>
                      <span>Spacious (32px)</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
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
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Sharp (0px)</span>
                      <span>Rounded (8px)</span>
                      <span>Very Rounded (24px)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-3">Preview</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className="h-20 bg-primary"
                        style={{ borderRadius: `${cornerRadius[0]}px` }}
                      />
                      <div 
                        className="h-20 bg-accent"
                        style={{ borderRadius: `${cornerRadius[0]}px` }}
                      />
                      <div 
                        className="h-20 bg-secondary"
                        style={{ borderRadius: `${cornerRadius[0]}px` }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4 mt-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Switch Template</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your content will be automatically mapped to the new template
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Layout className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <CardContent className="p-4">
                          <div className="font-semibold mb-1">Template {i}</div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Modern design with hero section
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            Apply Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
