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
  Gift,
  ShoppingBag,
  Warehouse,
  Bell,
  TrendingUp,
  Heart,
  ChevronDown,
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useState } from 'react';

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  children?: MenuItem[];
}

export function NestedSidebar() {
  const { state } = useSidebar();
  const { businessProfile, features } = useBusinessContext();
  const collapsed = state === 'collapsed';
  const [openGroups, setOpenGroups] = useState<string[]>(['management']);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    );
  };

  const getMenuStructure = (): MenuItem[] => {
    const structure: MenuItem[] = [
      { title: 'Home', url: '/dashboard', icon: LayoutDashboard },
    ];

    // My Business Section
    const business: MenuItem = {
      title: 'My Business',
      icon: Briefcase,
      children: [],
    };

    if (businessProfile.type === 'ecommerce') {
      business.children?.push({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });
      
      business.children?.push({
        title: 'Store',
        icon: ShoppingBag,
        children: [
          { title: 'Products', url: '/products', icon: Package },
          { title: 'Collections', url: '/collections', icon: ShoppingBag },
          { title: 'Orders', url: '/orders', icon: ShoppingCart },
        ],
      });

      if (features.inventory) {
        business.children?.push({
          title: 'Inventory',
          icon: Warehouse,
          children: [
            { title: 'Stock', url: '/inventory', icon: Warehouse },
            { title: 'Alerts', url: '/inventory', icon: Bell },
          ],
        });
      }

      if (features.pos) {
        business.children?.push({ title: 'POS', url: '/pos', icon: CreditCard });
      }

      if (features.dispatch) {
        business.children?.push({
          title: 'Delivery',
          icon: Truck,
          children: [
            { title: 'Dispatch', url: '/logistics', icon: Truck },
            { title: 'Tracking', url: '/logistics', icon: TrendingUp },
          ],
        });
      }
    }

    if (businessProfile.type === 'services') {
      business.children?.push({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });
      business.children?.push({ title: 'Services', url: '/services', icon: Briefcase });
      
      if (features.appointments) {
        business.children?.push({
          title: 'Appointments',
          icon: CalendarIcon,
          children: [
            { title: 'Calendar', url: '/calendar', icon: CalendarIcon },
            { title: 'Bookings', url: '/appointments', icon: CalendarIcon },
          ],
        });
      }
    }

    if (businessProfile.type === 'digital') {
      business.children?.push({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });
      business.children?.push({ title: 'Digital Products', url: '/digital-products', icon: Download });
      business.children?.push({ title: 'Orders', url: '/orders', icon: ShoppingCart });

      if (features.membership) {
        business.children?.push({ title: 'Members', url: '/memberships', icon: UsersRound });
      }
    }

    if (businessProfile.type === 'community') {
      business.children?.push({ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard });
      business.children?.push({ title: 'Members', url: '/customers', icon: Users });
      business.children?.push({ title: 'Donations', url: '/payments', icon: Heart });
      business.children?.push({ title: 'Events', url: '/calendar', icon: CalendarIcon });
    }

    structure.push(business);

    // Marketing Section
    const marketing: MenuItem = {
      title: 'Marketing',
      icon: Sparkles,
      children: [],
    };

    if (features.aiMarketing || features.aiSeo) {
      marketing.children?.push({ title: 'AI Marketing', url: '/marketing-ai', icon: Sparkles });
      marketing.children?.push({ title: 'Campaigns', url: '/marketing-campaigns', icon: TrendingUp });
      marketing.children?.push({ title: 'SEO Tools', url: '/marketing-ai', icon: TrendingUp });
    }

    marketing.children?.push(
      { title: 'Email', url: '/email-campaigns', icon: Mail },
      { title: 'WhatsApp/SMS', url: '/messaging', icon: MessageSquare },
    );

    structure.push(marketing);

    // Store Builder / Website Section
    structure.push({
      title: 'Store Builder',
      icon: Globe,
      children: [
        { title: 'Editor', url: '/build', icon: Palette },
        { title: 'Themes', url: '/theme', icon: Palette },
        { title: 'Pages', url: '/pages', icon: FileText },
        { title: 'Media', url: '/media-library', icon: Image },
      ],
    });

    // AI Tools Section
    if (features.aiContent) {
      structure.push({
        title: 'AI Tools',
        icon: Sparkles,
        children: [
          { title: 'Branding', url: '/ai-automation', icon: Sparkles },
          { title: 'Writing', url: '/ai-automation', icon: Sparkles },
          { title: 'Optimization', url: '/ai-automation', icon: Sparkles },
        ],
      });
    }

    // Finances Section
    const finances: MenuItem = {
      title: 'Finances',
      icon: DollarSign,
      children: [
        { title: 'YoPay', url: '/payments', icon: CreditCard },
      ],
    };

    if (features.invoicing) {
      finances.children?.push({ title: 'Invoices', url: '/invoices', icon: FileText });
    }

    if (features.payroll) {
      finances.children?.push({ title: 'Payroll', url: '/payroll', icon: DollarSign });
    }

    if (features.pos) {
      finances.children?.push({ title: 'POS', url: '/pos', icon: CreditCard });
    }

    finances.children?.push({ title: 'Reports', url: '/analytics', icon: BarChart3 });

    structure.push(finances);

    // Customers Section
    structure.push({
      title: 'Customers',
      icon: Users,
      children: [
        { title: 'CRM', url: '/customers', icon: Users },
        { title: 'Segments', url: '/customers', icon: Users },
        { title: 'Messages', url: '/chat-support', icon: MessageSquare },
      ],
    });

    // Analytics
    structure.push({ title: 'Analytics', url: '/analytics', icon: BarChart3 });

    // Settings
    structure.push({
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'Business', url: '/settings', icon: Settings },
        { title: 'Staff', url: '/team', icon: UsersRound },
        { title: 'Billing', url: '/billing', icon: CreditCard },
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
              <SidebarMenuButton className="w-full">
                <item.icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {openGroups.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {!collapsed && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children.map(child => (
                    <SidebarMenuSubItem key={child.title}>
                      {child.url ? (
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={child.url}
                            className={({ isActive }) =>
                              isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'hover:bg-sidebar-accent/50'
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
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
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
    <Sidebar collapsible="icon" className={collapsed ? 'w-16' : 'w-64'}>
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3 bg-gradient-to-r from-card to-muted">
        {!collapsed && (
          <div className="flex-1">
            <h2 className="text-lg font-bold bg-gradient-premium bg-clip-text text-transparent">
              NexusCreate
            </h2>
          </div>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{menuStructure.map(item => renderMenuItem(item))}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
