import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessType, 
  AccountType, 
  BusinessProfile,
  PlanType
} from '@/types/business';
import { getBusinessConfig, BusinessConfig } from '@/config/businessConfig';

interface BusinessContextType {
  businessProfile: BusinessProfile;
  businessConfig: BusinessConfig;
  setBusinessType: (type: BusinessType) => void;
  setAccountType: (type: AccountType) => void;
  setPlan: (plan: PlanType) => void;
  completeOnboarding: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const stored = localStorage.getItem('nexus-business-profile');
    return stored ? JSON.parse(stored) : { type: null, accountType: null, plan: 'free', onboarded: false };
  });

  const businessConfig = getBusinessConfig(businessProfile.type, businessProfile.plan);

  useEffect(() => {
    localStorage.setItem('nexus-business-profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  const setBusinessType = (type: BusinessType) => {
    setBusinessProfile(prev => ({ ...prev, type }));
  };

  const setAccountType = (accountType: AccountType) => {
    setBusinessProfile(prev => ({ ...prev, accountType }));
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
      businessConfig,
      setBusinessType, 
      setAccountType,
      setPlan,
      completeOnboarding
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
