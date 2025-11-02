import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Rocket, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="h-14 md:h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Tablet className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Smartphone className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="sm:hidden">
          <Monitor className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex"
          onClick={() => navigate('/build')}
        >
          <Palette className="w-4 h-4 mr-2" />
          Build My Site
        </Button>
        <Button size="sm" className="bg-gradient-accent hover:opacity-90">
          <Rocket className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Publish</span>
          <span className="sm:hidden">Go</span>
        </Button>
      </div>
    </header>
  );
}
