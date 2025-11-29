import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, ShoppingBag, Calendar, Gift, Shield, User,
  Menu, X, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerPortalLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/customer/dashboard', businessTypes: ['services', 'ecommerce'] },
  { label: 'My Orders', icon: ShoppingBag, path: '/customer/orders', businessTypes: ['ecommerce'] },
  { label: 'My Appointments', icon: Calendar, path: '/customer/appointments', businessTypes: ['services'] },
  { label: 'Referral Program', icon: Gift, path: '/customer/referral', businessTypes: ['services', 'ecommerce'] },
  { label: 'Disputes', icon: Shield, path: '/customer/disputes', businessTypes: ['services', 'ecommerce'] },
  { label: 'Profile', icon: User, path: '/customer/profile', businessTypes: ['services', 'ecommerce', 'digital', 'community'] },
];

export default function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const { customer, logout, isAuthenticated, isLoading } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter nav items based on business type
  const filteredNavItems = navItems.filter(
    item => item.businessTypes.includes(customer?.businessType || 'ecommerce')
  );

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/customer/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/customer/dashboard" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg hidden sm:inline">My Account</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {customer?.firstName?.[0]}{customer?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{customer?.firstName}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="hidden sm:flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {customer?.firstName?.[0]}{customer?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{customer?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                      {filteredNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg transition-colors",
                            isActive(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Logout */}
                    <div className="p-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {filteredNavItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 min-w-[60px]",
                isActive(item.path)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}