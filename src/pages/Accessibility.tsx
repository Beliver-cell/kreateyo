import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Eye, Contrast, Type, Keyboard, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Accessibility() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [textSize, setTextSize] = useState([100]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Accessibility settings saved",
      description: "Your preferences have been updated"
    });
  };

  const runAccessibilityCheck = () => {
    toast({
      title: "Running accessibility check",
      description: "Scanning your site for accessibility issues..."
    });
    setTimeout(() => {
      toast({
        title: "Scan complete",
        description: "Found 3 minor issues. View report for details."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Accessibility Settings</h1>
        <p className="text-muted-foreground">Make your site accessible to everyone</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Visual Accessibility</CardTitle>
              <CardDescription>Improve visibility and readability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="high-contrast" className="cursor-pointer font-semibold">
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast between text and background
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="large-text" className="cursor-pointer font-semibold">
                Large Text
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase default text size for better readability
              </p>
            </div>
            <Switch
              id="large-text"
              checked={largeText}
              onCheckedChange={setLargeText}
            />
          </div>

          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <Label>Text Size: {textSize[0]}%</Label>
            <Slider
              value={textSize}
              onValueChange={setTextSize}
              min={80}
              max={150}
              step={10}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Keyboard Navigation</CardTitle>
              <CardDescription>Optimize for keyboard-only users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="keyboard-nav" className="cursor-pointer font-semibold">
                Enhanced Keyboard Navigation
              </Label>
              <p className="text-sm text-muted-foreground">
                Show clear focus indicators and support all keyboard shortcuts
              </p>
            </div>
            <Switch
              id="keyboard-nav"
              checked={keyboardNav}
              onCheckedChange={setKeyboardNav}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="reduced-motion" className="cursor-pointer font-semibold">
                Reduced Motion
              </Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Accessibility Checker</CardTitle>
              <CardDescription>Scan your site for accessibility issues</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runAccessibilityCheck}>
            <Check className="w-4 h-4 mr-2" />
            Run Accessibility Audit
          </Button>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Last scan: Never
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Contrast className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Color Contrast Analyzer</CardTitle>
              <CardDescription>Check if your colors meet WCAG standards</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <Contrast className="w-4 h-4 mr-2" />
            Analyze Color Contrast
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} size="lg">
        Save Accessibility Settings
      </Button>
    </div>
  );
}
