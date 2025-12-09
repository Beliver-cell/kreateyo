import { DashboardLayout } from "@/components/DashboardLayout";
import { YopayDashboard } from "@/components/yopay/YopayDashboard";
import { YopayOnboarding } from "@/components/yopay/YopayOnboarding";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useBusinessContext } from '@/contexts/BusinessContext';

const mapPlanToTier = (plan: string | undefined): 'free' | 'pro' | 'enterprise' => {
  switch (plan) {
    case 'pro':
    case 'team':
      return 'pro';
    case 'enterprise':
      return 'enterprise';
    case 'free':
    case 'solo':
    default:
      return 'free';
  }
};

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [hasYopayAccount, setHasYopayAccount] = useState(false);
  const { toast } = useToast();
  const { businessProfile } = useBusinessContext();
  
  const businessId = businessProfile.id;
  const userTier = mapPlanToTier(businessProfile.plan);

  useEffect(() => {
    if (businessId) {
      checkYopayAccount();
    } else {
      setLoading(false);
    }
  }, [businessId]);

  const checkYopayAccount = async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get(`/yopay/${businessId}/account`);
      setHasYopayAccount(response.data.success);
    } catch (error) {
      setHasYopayAccount(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setHasYopayAccount(true);
    toast({
      title: 'Success!',
      description: 'Yopay has been activated successfully'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!businessId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">No business profile found. Please complete your business setup first.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {hasYopayAccount ? (
          <YopayDashboard businessId={businessId} userTier={userTier} />
        ) : (
          <YopayOnboarding businessId={businessId} onComplete={handleOnboardingComplete} />
        )}
      </div>
    </DashboardLayout>
  );
}
