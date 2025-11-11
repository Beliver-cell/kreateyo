import { OnboardingModalEnhanced } from './OnboardingModalEnhanced';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useState, useEffect } from 'react';

export function OnboardingModalWrapper() {
  const { businessProfile } = useBusinessContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!businessProfile.onboarded) {
      setOpen(true);
    }
  }, [businessProfile.onboarded]);

  return <OnboardingModalEnhanced open={open} onOpenChange={setOpen} />;
}
