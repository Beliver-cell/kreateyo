import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Rocket } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button variant="ghost" size="sm">
          <Tablet className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          Build My Site
        </Button>
        <Button size="sm" className="bg-gradient-accent hover:opacity-90">
          <Rocket className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </header>
  );
}
