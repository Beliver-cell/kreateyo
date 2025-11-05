export type BusinessType = 'ecommerce' | 'services' | 'blog' | null;
export type AccountType = 'solo' | 'team' | null;

export interface BusinessProfile {
  type: BusinessType;
  accountType: AccountType;
  name?: string;
  onboarded: boolean;
}
