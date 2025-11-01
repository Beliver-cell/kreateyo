import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessType, BusinessProfile } from '@/types/business';

interface BusinessContextType {
  businessProfile: BusinessProfile;
  setBusinessType: (type: BusinessType) => void;
  completeOnboarding: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const stored = localStorage.getItem('nexus-business-profile');
    return stored ? JSON.parse(stored) : { type: null, onboarded: false };
  });

  useEffect(() => {
    localStorage.setItem('nexus-business-profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  const setBusinessType = (type: BusinessType) => {
    setBusinessProfile(prev => ({ ...prev, type }));
  };

  const completeOnboarding = () => {
    setBusinessProfile(prev => ({ ...prev, onboarded: true }));
  };

  return (
    <BusinessContext.Provider value={{ businessProfile, setBusinessType, completeOnboarding }}>
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
