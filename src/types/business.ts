export type BusinessType = 'physical' | 'digital' | 'service' | 'dropship' | null;
export type AccountType = 'solo' | 'team' | null;
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface BusinessProfile {
  type: BusinessType;
  accountType: AccountType;
  plan: PlanType;
  name?: string;
  onboarded: boolean;
}

// Feature flags for each business type
export interface BusinessFeatures {
  pos?: boolean;
  dispatch?: boolean;
  inventory?: boolean;
  appointments?: boolean;
  subscriptions?: boolean;
  digitalDelivery?: boolean;
  membership?: boolean;
  donations?: boolean;
  multiStore?: boolean;
  payroll?: boolean;
  invoicing?: boolean;
  crm?: boolean;
  aiMarketing?: boolean;
  aiSeo?: boolean;
  aiContent?: boolean;
  mediaLibrary?: boolean;
  offlineMode?: boolean;
}

export const getBusinessFeatures = (type: BusinessType): BusinessFeatures => {
  switch (type) {
    case 'physical':
    case 'dropship':
      return {
        pos: true,
        dispatch: true,
        inventory: true,
        crm: true,
        aiMarketing: true,
        aiSeo: true,
        aiContent: true,
        subscriptions: true,
        multiStore: true,
        payroll: true,
        invoicing: true,
        mediaLibrary: true,
        offlineMode: true,
      };
    
    case 'service':
      return {
        appointments: true,
        crm: true,
        aiMarketing: true,
        aiSeo: true,
        aiContent: true,
        subscriptions: true,
        invoicing: true,
        multiStore: true,
        payroll: true,
        mediaLibrary: true,
      };
    
    case 'digital':
      return {
        digitalDelivery: true,
        subscriptions: true,
        membership: true,
        crm: true,
        aiMarketing: true,
        aiSeo: true,
        aiContent: true,
        invoicing: true,
        mediaLibrary: true,
      };
    
    default:
      return {};
  }
};
