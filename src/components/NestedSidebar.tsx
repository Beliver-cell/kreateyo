import { NavLink } from 'react-router-dom';
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
  Code,
  Building2,
  Bot,
  MessageCircle,
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PLAN_FEATURES } from '@/types/plans';

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  children?: MenuItem[];
  requiresPlan?: 'pro' | 'enterprise';
}

export function NestedSidebar() {
  const { state } = useSidebar();
  const { businessProfile } = useBusinessContext();
  const currentPlan = businessProfile.plan || 'free';
  const planFeatures = PLAN_FEATURES[currentPlan];
  const collapsed = state === 'collapsed';
  const [openGroups, setOpenGroups] = useState<string[]>(['dashboard']);
  const isMobile = useIsMobile();

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
      ordersBookings.children?.push({ title: 'Client Chat', url: '/client-chat', icon: MessageSquare });
    }

    ordersBookings.children?.push({ title: 'Clients', url: '/customers', icon: Users });

    if (ordersBookings.children && ordersBookings.children.length > 0) {
      structure.push(ordersBookings);
    }

    // POS System (Enterprise Only)
    if (planFeatures.pos) {
      structure.push({
        title: 'POS System',
        icon: Store,
        url: '/pos',
        requiresPlan: 'enterprise',
      });
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

    // Marketing & Automation Section (Pro+ features)
    const marketingChildren: MenuItem[] = [];

    if (planFeatures.aiMarketer) {
      marketingChildren.push(
        { title: 'Lead Engine', url: '/lead-engine', icon: Zap, requiresPlan: 'pro' },
        { title: 'Lead History', url: '/lead-history', icon: Users, requiresPlan: 'pro' },
        { title: 'Social Hub', url: '/social-hub', icon: MessageSquare, requiresPlan: 'pro' },
        { title: 'Content Studio', url: '/content-studio', icon: Sparkles, requiresPlan: 'pro' },
        { title: 'AI Conversations', url: '/ai-conversations', icon: Bot, requiresPlan: 'pro' }
      );
    }

    // Client Chat for service businesses
    if (businessProfile.type === 'services') {
      marketingChildren.push(
        { title: 'Client Chat', url: '/client-chat', icon: MessageCircle, requiresPlan: 'pro' }
      );
    }

    if (marketingChildren.length > 0) {
      structure.push({
        title: 'Marketing & Automation',
        icon: Target,
        children: marketingChildren,
      });
    }

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

    // Developer Console (Pro+ Only)
    if (planFeatures.developerConsole) {
      structure.push({
        title: 'Developer',
        icon: Code,
        url: '/developer',
        requiresPlan: 'pro',
      });
    }

    // Multi-Business Manager (Enterprise Only)
    if (planFeatures.multiBusinessDashboard) {
      structure.push({
        title: 'Multi-Business',
        icon: Building2,
        url: '/multi-business',
        requiresPlan: 'enterprise',
      });
    }

    // Settings Section
    const settingsChildren: MenuItem[] = [
      { title: 'Store Settings', url: '/settings', icon: Settings },
      { title: 'Billing', url: '/billing', icon: CreditCard },
      { title: 'Branches', url: '/branches', icon: Store },
    ];

    // Team management (Pro+ Only)
    if (planFeatures.teamManagement) {
      settingsChildren.splice(1, 0, { title: 'Team', url: '/team', icon: UsersRound, requiresPlan: 'pro' });
    }

    structure.push({
      title: 'Settings',
      icon: Settings,
      children: settingsChildren,
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
        {!collapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-bold bg-gradient-premium bg-clip-text text-transparent">
              KreateYo
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

    </Sidebar>
  );
}
