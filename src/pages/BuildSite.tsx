import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Layout } from 'lucide-react';

export default function BuildSite() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Build My Site</h1>
        <p className="text-muted-foreground mt-1">Create your perfect website with templates or AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Template Builder</CardTitle>
            <CardDescription>
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
                  <span className="text-muted-foreground text-sm">Template {i}</span>
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
            <CardTitle>AI Site Builder</CardTitle>
            <CardDescription>
              Describe your vision and let AI create a custom website in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Example: Create a modern sneaker store with black and green theme, hero section with product showcase, and minimalist design..."
              className="min-h-32 mb-4"
            />
            <Button className="w-full bg-gradient-accent hover:opacity-90">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Site with AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
