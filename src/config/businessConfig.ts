import { 
  Store, Package, ShoppingCart, Calendar, Users, Wallet, 
  TrendingUp, Palette, Settings, Smartphone, Code, Zap,
  FileText, BookOpen, Download, Truck, LayoutGrid, Receipt,
  UserCheck, Gift, Mail, MessageSquare, BarChart3, Boxes, Key
} from 'lucide-react';

export type PlanType = 'free' | 'pro' | 'enterprise';

export type BusinessType = 'physical' | 'digital' | 'service' | 'dropship' | null;

export interface MenuItem {
  title: string;
  url?: string;
  icon?: any;
  children?: MenuItem[];
  requiresPlan?: PlanType[];
  requiresBusinessTypes?: BusinessType[];
}

export interface BusinessConfig {
  type: BusinessType;
  plan: PlanType;
  features: {
    storefront: boolean;
    services: boolean;
    orders: boolean;
    bookings: boolean;
    delivery: boolean;
    pos: boolean;
    apiAccess: boolean;
    advancedAnalytics: boolean;
    teamCollaboration: boolean;
    whiteLabel: boolean;
    customDomain: boolean;
    advancedAutomation: boolean;
  };
  sidebar: MenuItem[];
  limits: {
    products: number;
    teamMembers: number;
    storageGB: number;
  };
}

export const PLAN_FEATURES = {
  free: {
    products: 100,
    teamMembers: 1,
    storageGB: 1,
    pos: false,
    apiAccess: false,
    advancedAnalytics: false,
    teamCollaboration: false,
    whiteLabel: false,
    customDomain: false,
    advancedAutomation: false,
  },
  pro: {
    products: 1000,
    teamMembers: 5,
    storageGB: 10,
    pos: false,
    apiAccess: false,
    advancedAnalytics: true,
    teamCollaboration: true,
    whiteLabel: false,
    customDomain: true,
    advancedAutomation: true,
  },
  enterprise: {
    products: -1, // unlimited
    teamMembers: -1, // unlimited
    storageGB: 100,
    pos: true,
    apiAccess: true,
    advancedAnalytics: true,
    teamCollaboration: true,
    whiteLabel: true,
    customDomain: true,
    advancedAutomation: true,
  },
};

const generateSidebarForBusinessType = (
  type: BusinessType,
  plan: PlanType
): MenuItem[] => {
  const planFeatures = PLAN_FEATURES[plan];
  const isPhysical = type === 'physical';
  const isDigital = type === 'digital';
  const isService = type === 'service';
  const isDropship = type === 'dropship';

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutGrid,
      children: [
        { title: 'Overview', url: '/dashboard', icon: BarChart3 },
        { title: 'Analytics', url: '/analytics', icon: TrendingUp },
      ],
    },
  ];

  // Products & Services
  const productsChildren: MenuItem[] = [];
  
  if (isPhysical || isDropship) {
    productsChildren.push(
      { title: 'Products', url: '/products', icon: Package },
      { title: 'Collections', url: '/collections', icon: LayoutGrid },
      { title: 'Inventory', url: '/inventory', icon: Boxes }
    );
  }

  if (isDigital) {
    productsChildren.push(
      { title: 'Digital Products', url: '/digital-products', icon: Download },
      { title: 'License Keys', url: '/products', icon: Key }
    );
  }

  if (isService) {
    productsChildren.push(
      { title: 'Services', url: '/services', icon: Store },
      { title: 'Service Builder', url: '/service-builder', icon: Code }
    );
  }

  if (isDropship) {
    productsChildren.push(
      { title: 'Suppliers', url: '/suppliers', icon: Truck }
    );
  }

  if (productsChildren.length > 0) {
    menuItems.push({
      title: 'Products & Services',
      icon: Package,
      children: productsChildren,
    });
  }

  // Orders & Bookings
  const ordersChildren: MenuItem[] = [];

  if (isPhysical || isDigital || isDropship) {
    ordersChildren.push(
      { title: 'Orders', url: '/orders', icon: ShoppingCart },
      { title: 'Customers', url: '/customers', icon: Users }
    );
  }

  if (isService) {
    ordersChildren.push(
      { title: 'Bookings', url: '/appointments', icon: Calendar },
      { title: 'Booking Calendar', url: '/booking-calendar', icon: Calendar },
      { title: 'Clients', url: '/clients', icon: UserCheck }
    );
  }

  if (ordersChildren.length > 0) {
    menuItems.push({
      title: 'Orders & Bookings',
      icon: ShoppingCart,
      children: ordersChildren,
    });
  }

  // Payments (YoPay)
  menuItems.push({
    title: 'Payments (YoPay)',
    icon: Wallet,
    children: [
      { title: 'Transactions', url: '/payments', icon: Receipt },
      { title: 'Invoices', url: '/invoices', icon: FileText },
    ],
  });

  // Marketing & Automation
  const marketingChildren: MenuItem[] = [
    { title: 'AI Marketing', url: '/marketing-ai', icon: Zap },
    { title: 'Email Campaigns', url: '/email-campaigns', icon: Mail },
  ];

  if (planFeatures.advancedAutomation) {
    marketingChildren.push(
      { title: 'WhatsApp Automation', url: '/messaging', icon: MessageSquare },
      { title: 'Marketing Campaigns', url: '/marketing-campaigns', icon: TrendingUp }
    );
  }

  marketingChildren.push(
    { title: 'Discounts', url: '/discounts', icon: Gift },
    { title: 'Upsells', url: '/upsells', icon: TrendingUp },
    { title: 'Affiliates', url: '/affiliates', icon: Users }
  );

  menuItems.push({
    title: 'Marketing & Automation',
    icon: TrendingUp,
    children: marketingChildren,
  });

  // Store Design
  menuItems.push({
    title: 'Store Design',
    icon: Palette,
    children: [
      { title: 'Theme', url: '/theme', icon: Palette },
      { title: 'Pages', url: '/pages', icon: FileText },
      { title: 'Media Library', url: '/media', icon: LayoutGrid },
    ],
  });

  // POS (Enterprise only)
  if (planFeatures.pos) {
    menuItems.push({
      title: 'Point of Sale',
      icon: Smartphone,
      requiresPlan: ['enterprise'],
      children: [
        { title: 'POS Terminal', url: '/pos', icon: Smartphone },
        { title: 'Receipts', url: '/invoices', icon: Receipt },
      ],
    });
  }

  // Developer Tools (Enterprise only)
  if (planFeatures.apiAccess) {
    menuItems.push({
      title: 'Developer',
      icon: Code,
      requiresPlan: ['enterprise'],
      children: [
        { title: 'API Keys', url: '/developer', icon: Key },
        { title: 'Webhooks', url: '/developer', icon: Zap },
      ],
    });
  }

  // Settings
  const settingsChildren: MenuItem[] = [
    { title: 'Store Settings', url: '/settings', icon: Settings },
    { title: 'Billing & Plans', url: '/billing', icon: Wallet },
  ];

  if (planFeatures.teamCollaboration) {
    settingsChildren.splice(1, 0, { title: 'Team', url: '/team', icon: Users });
  }

  menuItems.push({
    title: 'Settings',
    icon: Settings,
    children: settingsChildren,
  });

  return menuItems;
};

export const getBusinessConfig = (
  type: BusinessType,
  plan: PlanType = 'free'
): BusinessConfig => {
  const planFeatures = PLAN_FEATURES[plan];

  return {
    type,
    plan,
    features: {
      storefront: type === 'physical' || type === 'digital' || type === 'dropship',
      services: type === 'service',
      orders: type === 'physical' || type === 'digital' || type === 'dropship',
      bookings: type === 'service',
      delivery: type === 'physical' || type === 'dropship',
      pos: planFeatures.pos,
      apiAccess: planFeatures.apiAccess,
      advancedAnalytics: planFeatures.advancedAnalytics,
      teamCollaboration: planFeatures.teamCollaboration,
      whiteLabel: planFeatures.whiteLabel,
      customDomain: planFeatures.customDomain,
      advancedAutomation: planFeatures.advancedAutomation,
    },
    sidebar: generateSidebarForBusinessType(type, plan),
    limits: {
      products: planFeatures.products,
      teamMembers: planFeatures.teamMembers,
      storageGB: planFeatures.storageGB,
    },
  };
};

export const canAccessFeature = (
  feature: keyof BusinessConfig['features'],
  config: BusinessConfig
): boolean => {
  return config.features[feature];
};

export const canAccessRoute = (
  route: string,
  config: BusinessConfig
): boolean => {
  // POS routes require enterprise
  if (route.includes('/pos') && !config.features.pos) {
    return false;
  }

  // Developer routes require enterprise
  if (route.includes('/developer') && !config.features.apiAccess) {
    return false;
  }

  // Team routes require pro or enterprise
  if (route.includes('/team') && !config.features.teamCollaboration) {
    return false;
  }

  return true;
};
