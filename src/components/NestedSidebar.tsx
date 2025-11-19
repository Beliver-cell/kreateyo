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
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    ];

    // Management Section
    const management: MenuItem = {
      title: 'Management',
      icon: Briefcase,
      children: [],
    };

    if (businessProfile.type === 'ecommerce') {
      management.children?.push(
        {
          title: 'Products',
          icon: Package,
          children: [
            { title: 'All Products', url: '/products', icon: Package },
            { title: 'Collections', url: '/collections', icon: ShoppingBag },
            { title: 'Inventory', url: '/inventory', icon: Warehouse },
          ],
        },
        { title: 'Orders', url: '/orders', icon: ShoppingCart },
      );

      if (features.pos) {
        management.children?.push({ title: 'POS System', url: '/pos', icon: CreditCard });
      }
    }

    if (businessProfile.type === 'services') {
      management.children?.push(
        { title: 'Services', url: '/services', icon: Briefcase },
        {
          title: 'Appointments',
          icon: CalendarIcon,
          children: [
            { title: 'Calendar', url: '/calendar', icon: CalendarIcon },
            { title: 'Bookings', url: '/appointments', icon: CalendarIcon },
          ],
        },
      );
    }

    if (businessProfile.type === 'digital') {
      management.children?.push(
        { title: 'Digital Products', url: '/digital-products', icon: Download },
        { title: 'Orders', url: '/orders', icon: ShoppingCart },
      );

      if (features.membership) {
        management.children?.push({ title: 'Memberships', url: '/memberships', icon: UsersRound });
      }
    }

    if (businessProfile.type === 'community') {
      management.children?.push(
        { title: 'Members', url: '/members', icon: Users },
        { title: 'Donations', url: '/donations', icon: Heart },
        { title: 'Events', url: '/events', icon: CalendarIcon },
      );
    }

    structure.push(management);

    // Operations Section (if applicable)
    if (features.dispatch || features.invoicing || features.payroll) {
      const operations: MenuItem = {
        title: 'Operations',
        icon: Truck,
        children: [],
      };

      if (features.dispatch) {
        operations.children?.push({
          title: 'Logistics',
          icon: Truck,
          children: [
            { title: 'Dispatch', url: '/logistics', icon: Truck },
            { title: 'Tracking', url: '/tracking', icon: TrendingUp },
          ],
        });
      }

      if (features.invoicing) {
        operations.children?.push({ title: 'Invoices', url: '/invoices', icon: FileText });
      }

      if (features.payroll) {
        operations.children?.push({ title: 'Payroll', url: '/payroll', icon: DollarSign });
      }

      if (features.multiStore) {
        operations.children?.push({ title: 'Multi-Branch', url: '/branches', icon: ShoppingBag });
      }

      structure.push(operations);
    }

    // Customers Section
    const customers: MenuItem = {
      title: 'Customers',
      icon: Users,
      children: [
        { title: 'CRM', url: '/customers', icon: Users },
      ],
    };

    if (features.subscriptions) {
      customers.children?.push({ title: 'Subscriptions', url: '/subscriptions', icon: Gift });
    }

    structure.push(customers);

    // Marketing Section
    if (features.aiMarketing || features.aiSeo) {
      const marketing: MenuItem = {
        title: 'Marketing',
        icon: Sparkles,
        children: [],
      };

      if (features.aiMarketing) {
        marketing.children?.push(
          { title: 'AI Marketing', url: '/marketing-ai', icon: Sparkles },
          { title: 'Campaigns', url: '/marketing-campaigns', icon: TrendingUp },
        );
      }

      if (features.aiSeo) {
        marketing.children?.push({ title: 'AI SEO Tools', url: '/ai-seo', icon: TrendingUp });
      }

      marketing.children?.push(
        { title: 'Email Campaigns', url: '/email-campaigns', icon: Mail },
        { title: 'WhatsApp/SMS', url: '/messaging', icon: MessageSquare },
      );

      structure.push(marketing);
    }

    // AI Automation Section
    if (features.aiContent) {
      structure.push({
        title: 'AI Automation',
        icon: Sparkles,
        children: [
          { title: 'AI Assistant', url: '/ai-automation', icon: Sparkles },
          { title: 'Chatbot', url: '/chatbot-manager', icon: MessageSquare },
        ],
      });
    }

    // Website Section
    structure.push({
      title: 'Website',
      icon: Globe,
      children: [
        { title: 'Editor', url: '/build', icon: Palette },
        { title: 'Theme', url: '/theme', icon: Palette },
      ],
    });

    // Payments Section
    structure.push({
      title: 'Payments',
      icon: CreditCard,
      children: [
        { title: 'YoPay', url: '/payments', icon: CreditCard },
      ],
    });

    // Analytics
    structure.push({ title: 'Analytics', url: '/analytics', icon: BarChart3 });

    // Media Library
    if (features.mediaLibrary) {
      structure.push({ title: 'Media Library', url: '/media-library', icon: Image });
    }

    // Settings
    structure.push({ title: 'Settings', url: '/settings', icon: Settings });

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
