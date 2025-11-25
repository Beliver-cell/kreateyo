export type PlanType = 'starter' | 'growth' | 'business';

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
  starter: {
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
  growth: {
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
    pos: true,
    multiBusinessDashboard: false,
    unlimitedTeam: false,
    dedicatedSupport: false,
  },
  business: {
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
  starter: {
    name: 'Starter',
    price: '$4',
    period: '/month',
    features: [
      '1 store',
      '10 products',
      'YoPay basic',
      'Website builder',
      'WhatsApp support',
      'Community support',
    ],
  },
  growth: {
    name: 'Growth',
    price: '$25',
    period: '/month',
    features: [
      '5 stores',
      '1,000 products',
      'POS & offline mode',
      'Automated marketing',
      'WhatsApp Commerce',
      'Dispatch toolbox',
      'Priority support',
    ],
    popular: true,
  },
  business: {
    name: 'Business',
    price: '$79',
    period: '/month',
    features: [
      'Unlimited products',
      'Multi-branch',
      'Staff payroll',
      'Priority support',
      'YoPay advanced payouts',
      'API access',
      'White-label options',
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
