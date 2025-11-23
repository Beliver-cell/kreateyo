import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { MenuItem, canAccessRoute } from '@/config/businessConfig';
import { Badge } from '@/components/ui/badge';

export function NestedSidebar() {
  const location = useLocation();
  const { businessConfig } = useBusinessContext();
  const { state: sidebarState } = useSidebar();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const collapsed = sidebarState === 'collapsed';

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isGroupActive = (item: MenuItem): boolean => {
    if (item.url && location.pathname === item.url) return true;
    if (item.children) {
      return item.children.some(child => isGroupActive(child));
    }
    return false;
  };

  const shouldShowItem = (item: MenuItem): boolean => {
    // Check if item requires specific plan
    if (item.requiresPlan && !item.requiresPlan.includes(businessConfig.plan)) {
      return false;
    }

    // Check if item requires specific business type
    if (item.requiresBusinessTypes && !item.requiresBusinessTypes.includes(businessConfig.type)) {
      return false;
    }

    // Check route access
    if (item.url && !canAccessRoute(item.url, businessConfig)) {
      return false;
    }

    return true;
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    if (!shouldShowItem(item)) return null;

    const isActive = isGroupActive(item);
    const isOpen = openGroups[item.title] ?? isActive;
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isLocked = item.requiresPlan && !item.requiresPlan.includes(businessConfig.plan);

    if (hasChildren) {
      return (
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={() => toggleGroup(item.title)}
        >
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="w-full group/label hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                <div className="flex items-center justify-between w-full px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.children?.map(child => renderMenuItem(child, depth + 1))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    }

    if (item.url) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`
              }
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                }
              }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm">{item.title}</span>
                  {isLocked && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      {item.requiresPlan?.[0]}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    return null;
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NexusCommerce
          </h2>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        {businessConfig.sidebar.map(item => renderMenuItem(item))}
      </SidebarContent>
    </Sidebar>
  );
}
