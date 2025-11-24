import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Palette,
  Globe,
  Truck,
  CalendarIcon,
  FileText,
  Sparkles,
  Mail,
  MessageSquare,
  Image,
  DollarSign,
  Download,
  UsersRound,
  Briefcase,
  ShoppingBag,
  Warehouse,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Store,
  Zap,
  Gift,
  Link as LinkIcon,
  Receipt,
  Target,
  UserCircle,
  LogOut,
  Bell,
  Menu,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useState } from 'react';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  children?: MenuItem[];
}

export function NestedSidebar() {
  const { state } = useSidebar();
  const { businessProfile } = useBusinessContext();
  const collapsed = state === 'collapsed';
  const [openGroups, setOpenGroups] = useState<string[]>(['dashboard']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    );
  };

  const getMenuStructure = (): MenuItem[] => {
    const structure: MenuItem[] = [];

    // Dashboard Section
    structure.push({
      title: 'Dashboard',
      icon: LayoutDashboard,
      children: [
        { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Analytics', url: '/analytics', icon: BarChart3 },
      ],
    });

    // Products & Services Section
    const productsServices: MenuItem = {
      title: 'Products & Services',
      icon: Package,
      children: [],
    };

    if (businessProfile.type === 'digital' || businessProfile.subType === 'digital') {
      productsServices.children?.push({ title: 'Digital Products', url: '/digital-products', icon: Download });
    }

    if (businessProfile.type === 'ecommerce' && businessProfile.subType === 'physical') {
      productsServices.children?.push({ title: 'Physical Products', url: '/products', icon: Package });
      productsServices.children?.push({ title: 'Inventory', url: '/inventory', icon: Warehouse });
    }

    if (businessProfile.subType === 'dropshipping') {
      productsServices.children?.push({ title: 'Dropshipping', url: '/supplier-manager', icon: Truck });
    }

    if (businessProfile.type === 'services') {
      productsServices.children?.push({ title: 'Online Services', url: '/services', icon: Briefcase });
    }

    if (productsServices.children && productsServices.children.length > 0) {
      structure.push(productsServices);
    }

    // Orders & Bookings Section
    const ordersBookings: MenuItem = {
      title: 'Orders & Bookings',
      icon: ShoppingCart,
      children: [],
    };

    if (businessProfile.type === 'ecommerce' || businessProfile.type === 'digital') {
      ordersBookings.children?.push({ title: 'Orders', url: '/orders', icon: ShoppingCart });
    }

    if (businessProfile.type === 'services') {
      ordersBookings.children?.push({ title: 'Bookings', url: '/appointments', icon: CalendarIcon });
      ordersBookings.children?.push({ title: 'Calendar', url: '/calendar', icon: CalendarIcon });
    }

    ordersBookings.children?.push({ title: 'Clients', url: '/customers', icon: Users });

    if (ordersBookings.children && ordersBookings.children.length > 0) {
      structure.push(ordersBookings);
    }

    // Payments (YoPay) Section
    structure.push({
      title: 'Payments (YoPay)',
      icon: CreditCard,
      children: [
        { title: 'Transactions', url: '/payments', icon: CreditCard },
        { title: 'Payout Wallet', url: '/payments', icon: DollarSign },
        { title: 'Payment Links', url: '/payments', icon: LinkIcon },
        { title: 'Subscriptions', url: '/subscriptions', icon: Receipt },
      ],
    });

    // Marketing & Automation Section
    structure.push({
      title: 'Marketing & Automation',
      icon: Target,
      children: [
        { title: 'AI Tools', url: '/marketing-ai', icon: Sparkles },
        { title: 'Email Automation', url: '/email-campaigns', icon: Mail },
        { title: 'WhatsApp Automation', url: '/messaging', icon: MessageSquare },
        { title: 'SEO Tools', url: '/marketing-ai', icon: TrendingUp },
        { title: 'Campaigns', url: '/marketing-campaigns', icon: Target },
        { title: 'Affiliate Program', url: '/affiliate-program', icon: UsersRound },
      ],
    });

    // Store Design Section
    structure.push({
      title: 'Store Design',
      icon: Palette,
      children: [
        { title: 'Themes', url: '/theme', icon: Palette },
        { title: 'Sections', url: '/build', icon: Globe },
        { title: 'Custom Pages', url: '/pages', icon: FileText },
        { title: 'Media', url: '/media-library', icon: Image },
      ],
    });

    // Settings Section
    structure.push({
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'Store Settings', url: '/settings', icon: Settings },
        { title: 'Staff', url: '/team', icon: UsersRound },
        { title: 'Billing', url: '/billing', icon: CreditCard },
        { title: 'Branches', url: '/branches', icon: Store },
      ],
    });

    return structure;
  };

  const menuStructure = getMenuStructure();

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (item.children && item.children.length > 0) {
      return (
        <Collapsible
          key={item.title}
          open={openGroups.includes(item.title)}
          onOpenChange={() => toggleGroup(item.title)}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full group">
                <item.icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.title}</span>
                    {openGroups.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                  </>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {!collapsed && (
              <CollapsibleContent className="transition-all">
                <SidebarMenuSub>
                  {item.children.map(child => (
                    <SidebarMenuSubItem key={child.title}>
                      {child.url ? (
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={child.url}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                isActive
                                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                              }`
                            }
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      ) : (
                        renderMenuItem(child, depth + 1)
                      )}
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url || '#'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className={`${collapsed ? 'w-16' : 'w-64'} border-r border-sidebar-border bg-sidebar transition-all`}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3 bg-sidebar">
        {isMobile && (
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        )}
        {!collapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-bold bg-gradient-premium bg-clip-text text-transparent">
              NexusCreate
            </h2>
            <p className="text-xs text-muted-foreground">Business Platform</p>
          </div>
        )}
        {!isMobile && (
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
        )}
      </div>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 p-2">
              {menuStructure.map(item => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-2">
        <div className={`flex ${collapsed ? 'flex-col' : 'flex-row'} items-center gap-2 justify-center`}>
          <NotificationCenter />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
