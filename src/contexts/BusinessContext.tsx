import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessType, 
  AccountType, 
  BusinessProfile, 
  EcommerceSubType, 
  ServicesSubType,
  DigitalSubType,
  CommunitySubType,
  getBusinessFeatures 
} from '@/types/business';
import { PlanType } from '@/types/plans';

interface BusinessContextType {
  businessProfile: BusinessProfile;
  setBusinessType: (type: BusinessType) => void;
  setAccountType: (type: AccountType) => void;
  setBusinessSubType: (subType: EcommerceSubType | ServicesSubType | DigitalSubType | CommunitySubType) => void;
  setPlan: (plan: PlanType) => void;
  completeOnboarding: () => void;
  features: ReturnType<typeof getBusinessFeatures>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const stored = localStorage.getItem('nexus-business-profile');
    return stored ? JSON.parse(stored) : { type: null, accountType: null, onboarded: false, plan: 'free' };
  });

  const features = getBusinessFeatures(businessProfile.type, businessProfile.subType || undefined);

  useEffect(() => {
    localStorage.setItem('nexus-business-profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  const setBusinessType = (type: BusinessType) => {
    setBusinessProfile(prev => ({ ...prev, type }));
  };

  const setAccountType = (accountType: AccountType) => {
    setBusinessProfile(prev => ({ ...prev, accountType }));
  };

  const setBusinessSubType = (subType: EcommerceSubType | ServicesSubType | DigitalSubType | CommunitySubType) => {
    setBusinessProfile(prev => ({ ...prev, subType }));
  };

  const setPlan = (plan: PlanType) => {
    setBusinessProfile(prev => ({ ...prev, plan }));
  };

  const completeOnboarding = () => {
    setBusinessProfile(prev => ({ ...prev, onboarded: true }));
  };

  return (
    <BusinessContext.Provider value={{ 
      businessProfile, 
      setBusinessType, 
      setAccountType, 
      setBusinessSubType, 
      setPlan,
      completeOnboarding,
      features 
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within BusinessProvider');
  }
  return context;
}
