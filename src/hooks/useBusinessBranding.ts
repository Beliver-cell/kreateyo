import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface BusinessBranding {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  brandColor: string;
  secondaryColor: string;
  description: string | null;
  category: string | null;
}

interface UseBusinessBrandingResult {
  branding: BusinessBranding | null;
  isLoading: boolean;
  error: string | null;
}

function getBusinessIdentifierFromUrl(): string | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  const storeMatch = pathname.match(/^\/store\/([^/]+)/);
  if (storeMatch) {
    return storeMatch[1];
  }
  
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }
  
  const params = new URLSearchParams(window.location.search);
  const businessId = params.get('business') || params.get('businessId');
  if (businessId) {
    return businessId;
  }
  
  return null;
}

export function useBusinessBranding(businessIdentifier?: string): UseBusinessBrandingResult {
  const [branding, setBranding] = useState<BusinessBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const identifier = businessIdentifier || getBusinessIdentifierFromUrl();
    
    if (!identifier) {
      setIsLoading(false);
      return;
    }

    async function fetchBranding() {
      try {
        const response = await api.get<{ business: BusinessBranding }>(
          `/businesses/branding/${identifier}`
        );
        setBranding(response.business);
      } catch (err: any) {
        setError(err.message || 'Failed to load business branding');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranding();
  }, [businessIdentifier]);

  return { branding, isLoading, error };
}

export function getBusinessIdentifier(): string | null {
  return getBusinessIdentifierFromUrl();
}
