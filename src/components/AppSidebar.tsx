import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Wrench,
  CreditCard,
  Settings,
  Calendar,
  Briefcase,
  FileEdit,
  FolderKanban,
  Mail,
  Image,
  Menu,
  X,
  Shield,
  Code,
  Eye,
  HelpCircle,
  Globe,
  UsersRound,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export function AppSidebar() {
  const { state } = useSidebar();
  const { businessProfile } = useBusinessContext();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const collapsed = state === 'collapsed';

  const getMenuItems = () => {
    const baseItems = [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Build My Site', url: '/build', icon: Palette },
    ];

    let specificItems = [];
    if (businessProfile.type === 'ecommerce') {
      specificItems = [
        { title: 'Products', url: '/products', icon: Package },
        { title: 'Collections', url: '/collections', icon: FolderOpen },
        { title: 'Orders', url: '/orders', icon: ShoppingCart },
        { title: 'Customers', url: '/customers', icon: Users },
      ];
    } else if (businessProfile.type === 'services') {
      specificItems = [
        { title: 'Services', url: '/services', icon: Briefcase },
        { title: 'Calendar', url: '/calendar', icon: Calendar },
        { title: 'Clients', url: '/clients', icon: Users },
      ];
    } else if (businessProfile.type === 'blog') {
      specificItems = [
        { title: 'Posts', url: '/posts', icon: FileEdit },
        { title: 'Pages', url: '/pages', icon: FolderKanban },
        { title: 'Subscribers', url: '/subscribers', icon: Mail },
      ];
    }

    // Team features only visible for team accounts
    const advancedItems = businessProfile.accountType === 'team' ? [
      { title: 'Team', url: '/team', icon: UsersRound },
      { title: 'Security', url: '/security', icon: Shield },
      { title: 'Developer', url: '/developer', icon: Code },
      { title: 'Accessibility', url: '/accessibility', icon: Eye },
      { title: 'International', url: '/internationalization', icon: Globe },
    ] : [];

    const endItems = [
      { title: 'Tools', url: '/tools', icon: Wrench },
      { title: 'Payment Gateway', url: '/payments', icon: CreditCard },
      { title: 'Media Library', url: '/media', icon: Image },
      { title: 'Support', url: '/support', icon: HelpCircle },
      { title: 'Settings', url: '/settings', icon: Settings },
    ];

    return [...baseItems, ...specificItems, ...advancedItems, ...endItems];
  };

  const menuItems = getMenuItems();

  // Mobile menu
  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 lg:hidden hover:bg-accent hover:scale-110 transition-all duration-300 shadow-md hover:shadow-xl backdrop-blur-sm bg-card/80 border border-border"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r border-border backdrop-blur-xl bg-card/95">
            <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-card to-muted">
              <h2 className="text-lg font-bold bg-gradient-premium bg-clip-text text-transparent">NexusCreate</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-73px)]">
              <div className="p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                          isActive
                            ? 'bg-gradient-primary text-primary-foreground font-medium shadow-md'
                            : 'hover:bg-accent/80 hover:shadow-sm'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3 bg-gradient-to-r from-card to-muted">
        {!collapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-bold bg-gradient-premium bg-clip-text text-transparent">NexusCreate</h2>
          </div>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `transition-all duration-300 hover:scale-[1.02] ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm'
                            : 'hover:bg-sidebar-accent/80'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
