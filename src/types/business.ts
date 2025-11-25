import { PlanType } from './plans';

export type BusinessType = 'ecommerce' | 'services' | 'digital' | 'community' | null;
export type AccountType = 'solo' | 'team' | null;

export type EcommerceSubType = 'physical' | 'digital' | 'dropshipping' | null;
export type ServicesSubType = 
  | 'coaching'
  | 'consulting' 
  | 'marketing'
  | 'repairs'
  | 'beauty'
  | 'healthcare'
  | null;

export type DigitalSubType = 
  | 'courses'
  | 'ebooks'
  | 'templates'
  | 'music'
  | 'software'
  | null;

export type CommunitySubType =
  | 'ngo'
  | 'church'
  | 'club'
  | 'association'
  | null;

export interface BusinessProfile {
  type: BusinessType;
  accountType: AccountType;
  subType?: EcommerceSubType | ServicesSubType | DigitalSubType | CommunitySubType;
  name?: string;
  onboarded: boolean;
  plan?: PlanType;
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

export const getBusinessFeatures = (type: BusinessType, subType?: string): BusinessFeatures => {
  switch (type) {
    case 'ecommerce':
      return {
        pos: true,
        dispatch: true,
        inventory: true,
        crm: true,
        aiMarketing: true,
        aiSeo: true,
        aiContent: true,
        digitalDelivery: subType === 'digital',
        multiStore: true,
        payroll: true,
        invoicing: true,
        mediaLibrary: true,
        offlineMode: true,
      };
    
    case 'services':
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
    
    case 'community':
      return {
        membership: true,
        donations: true,
        crm: true,
        aiMarketing: true,
        aiSeo: true,
        mediaLibrary: true,
      };
    
    default:
      return {};
  }
};
