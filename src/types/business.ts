export type BusinessType = 'ecommerce' | 'services' | 'blog' | null;
export type AccountType = 'solo' | 'team' | null;
export type EcommerceSubType = 'physical' | 'digital' | 'dropshipping' | null;
export type ServicesSubType = 'marketing' | 'design' | 'operations' | 'writing' | 'coaching' | null;

export interface BusinessProfile {
  type: BusinessType;
  accountType: AccountType;
  subType?: EcommerceSubType | ServicesSubType;
  name?: string;
  onboarded: boolean;
}
