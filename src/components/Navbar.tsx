import { Search, Bell, User, Settings, CreditCard, Users, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-6 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-background border-border hover:border-ring transition-all duration-300 focus:shadow-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs shadow-md"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover/95 backdrop-blur-xl z-50 border border-border shadow-xl">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => navigate('/orders')}
            >
              <p className="text-sm font-medium">New order received</p>
              <p className="text-xs text-muted-foreground">Order #1842 - $234.99 • 5 minutes ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => navigate('/products')}
            >
              <p className="text-sm font-medium">Low stock alert</p>
              <p className="text-xs text-muted-foreground">Running Shoes - Only 3 left • 1 hour ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => navigate('/customers')}
            >
              <p className="text-sm font-medium">New customer signup</p>
              <p className="text-xs text-muted-foreground">3 new customers joined • 2 hours ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center justify-center cursor-pointer text-primary hover:bg-accent/80 transition-all duration-300"
              onClick={() => toast({ title: "View all notifications", description: "Coming soon!" })}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:scale-110 transition-all duration-300">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-xl z-50 border border-border shadow-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => navigate('/payments')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent/80 transition-all duration-300"
              onClick={() => toast({ title: "Team", description: "Team management coming soon!" })}
            >
              <Users className="w-4 h-4 mr-2" />
              Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer hover:bg-destructive/10 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
