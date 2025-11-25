export type PlanType = 'free' | 'pro' | 'enterprise';

export interface PlanFeatures {
  // Team limits
  maxTeamMembers: number;
  
  // Core features
  basicDashboard: boolean;
  basicStoreManagement: boolean;
  orders: boolean;
  simpleAnalytics: boolean;
  messages: boolean;
  basicSettings: boolean;
  
  // Pro features
  teamManagement: boolean;
  aiMarketer: boolean;
  developerConsole: boolean;
  apiKeys: boolean;
  webhooks: boolean;
  automation: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  
  // Enterprise features
  pos: boolean;
  multiBusinessDashboard: boolean;
  unlimitedTeam: boolean;
  dedicatedSupport: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    maxTeamMembers: 0,
    basicDashboard: true,
    basicStoreManagement: true,
    orders: true,
    simpleAnalytics: true,
    messages: true,
    basicSettings: true,
    teamManagement: false,
    aiMarketer: false,
    developerConsole: false,
    apiKeys: false,
    webhooks: false,
    automation: false,
    advancedAnalytics: false,
    prioritySupport: false,
    pos: false,
    multiBusinessDashboard: false,
    unlimitedTeam: false,
    dedicatedSupport: false,
  },
  pro: {
    maxTeamMembers: 10,
    basicDashboard: true,
    basicStoreManagement: true,
    orders: true,
    simpleAnalytics: true,
    messages: true,
    basicSettings: true,
    teamManagement: true,
    aiMarketer: true,
    developerConsole: true,
    apiKeys: true,
    webhooks: true,
    automation: true,
    advancedAnalytics: true,
    prioritySupport: true,
    pos: false,
    multiBusinessDashboard: false,
    unlimitedTeam: false,
    dedicatedSupport: false,
  },
  enterprise: {
    maxTeamMembers: -1, // unlimited
    basicDashboard: true,
    basicStoreManagement: true,
    orders: true,
    simpleAnalytics: true,
    messages: true,
    basicSettings: true,
    teamManagement: true,
    aiMarketer: true,
    developerConsole: true,
    apiKeys: true,
    webhooks: true,
    automation: true,
    advancedAnalytics: true,
    prioritySupport: true,
    pos: true,
    multiBusinessDashboard: true,
    unlimitedTeam: true,
    dedicatedSupport: true,
  },
};

interface PlanDetail {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export const PLAN_DETAILS: Record<PlanType, PlanDetail> = {
  free: {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Basic dashboard',
      'Basic storefront/service management',
      'Basic product/service tools',
      'Basic orders/bookings',
      'Simple analytics',
      'Messages/inbox',
      'Basic settings',
      'No team members',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Free',
      'Team management (max 10 members)',
      'AI Marketer',
      'Developer console + API keys',
      'Webhooks',
      'Automation tools',
      'Advanced analytics',
      'Priority support',
    ],
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'POS system',
      'Multi-business dashboard',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
    ],
  },
};

export function canAccessFeature(plan: PlanType, feature: keyof PlanFeatures): boolean {
  return PLAN_FEATURES[plan][feature] === true || PLAN_FEATURES[plan][feature] === -1;
}

export function getTeamLimit(plan: PlanType): number {
  return PLAN_FEATURES[plan].maxTeamMembers;
}

export function canAccessRoute(plan: PlanType, route: string): boolean {
  const features = PLAN_FEATURES[plan];
  
  // Team routes
  if (route === '/team' && !features.teamManagement) return false;
  
  // Developer routes
  if (route === '/developer' && !features.developerConsole) return false;
  
  // POS routes
  if (route === '/pos' && !features.pos) return false;
  
  // Multi-business routes
  if (route === '/multi-business' && !features.multiBusinessDashboard) return false;
  
  // AI Marketer routes
  if (route === '/marketing-ai' && !features.aiMarketer) return false;
  
  // Automation routes
  if ((route === '/email-campaigns' || route === '/messaging') && !features.automation) return false;
  
  return true;
}
