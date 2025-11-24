import { useState } from 'react';
import { Palette, Type, Layout, Sparkles, Save, RotateCcw, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ThemeCustomizer = () => {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [darkMode, setDarkMode] = useState(false);
  const [fontFamily, setFontFamily] = useState('inter');
  const [borderRadius, setBorderRadius] = useState([12]);
  const [spacing, setSpacing] = useState([16]);

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#3b82f6', accent: '#06b6d4' },
    { name: 'Purple Dream', primary: '#8b5cf6', accent: '#a855f7' },
    { name: 'Fresh Green', primary: '#10b981', accent: '#059669' },
    { name: 'Sunset Orange', primary: '#f59e0b', accent: '#ef4444' },
    { name: 'Royal Purple', primary: '#7c3aed', accent: '#db2777' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Theme Customizer</h1>
            <p className="text-muted-foreground">Design your website's look and feel</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
            <Button size="lg" className="shadow-lg">
              <Save className="mr-2 h-5 w-5" />
              Save Theme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="colors" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4 mr-2" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <Layout className="h-4 w-4 mr-2" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Presets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-3">
                          <Input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-20 h-12 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-3">
                          <Input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-20 h-12 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable dark theme</p>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter (Modern)</SelectItem>
                          <SelectItem value="poppins">Poppins (Friendly)</SelectItem>
                          <SelectItem value="roboto">Roboto (Clean)</SelectItem>
                          <SelectItem value="montserrat">Montserrat (Bold)</SelectItem>
                          <SelectItem value="lato">Lato (Professional)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label>Heading 1</Label>
                        <h1 className="text-4xl font-bold mt-2" style={{ fontFamily }}>
                          The quick brown fox jumps
                        </h1>
                      </div>
                      <div>
                        <Label>Heading 2</Label>
                        <h2 className="text-3xl font-semibold mt-2" style={{ fontFamily }}>
                          The quick brown fox jumps
                        </h2>
                      </div>
                      <div>
                        <Label>Body Text</Label>
                        <p className="text-base mt-2" style={{ fontFamily }}>
                          The quick brown fox jumps over the lazy dog. This is how your body text will look.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>Border Radius: {borderRadius}px</Label>
                        <Slider
                          value={borderRadius}
                          onValueChange={setBorderRadius}
                          max={32}
                          step={2}
                          className="w-full"
                        />
                        <div className="flex gap-3">
                          <div
                            className="flex-1 h-20 bg-primary"
                            style={{ borderRadius: `${borderRadius}px` }}
                          />
                          <div
                            className="flex-1 h-20 bg-accent"
                            style={{ borderRadius: `${borderRadius}px` }}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Spacing: {spacing}px</Label>
                        <Slider
                          value={spacing}
                          onValueChange={setSpacing}
                          max={32}
                          step={4}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Presets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setPrimaryColor(preset.primary);
                            setAccentColor(preset.accent);
                          }}
                          className="p-4 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all text-left group"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-12 h-12 rounded-lg"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-12 h-12 rounded-lg"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <p className="font-semibold">{preset.name}</p>
                          <p className="text-sm text-muted-foreground">Click to apply</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: `${borderRadius}px`,
                    borderColor: accentColor
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily }}>
                    Sample Header
                  </h3>
                  <p className="text-white/90 text-sm" style={{ fontFamily }}>
                    This is how your theme will look
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>

                <div
                  className="p-4 bg-muted rounded-lg"
                  style={{ borderRadius: `${borderRadius}px` }}
                >
                  <p className="text-sm" style={{ fontFamily }}>
                    Sample card content with your chosen typography and spacing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default ThemeCustomizer;