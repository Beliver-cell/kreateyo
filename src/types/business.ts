export type BusinessType = 'ecommerce' | 'services' | 'blog' | null;

export interface BusinessProfile {
  type: BusinessType;
  name?: string;
  onboarded: boolean;
}
