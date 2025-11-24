import { DashboardLayout } from "@/components/DashboardLayout";
import { YopayDashboard } from "@/components/yopay/YopayDashboard";
import { YopayOnboarding } from "@/components/yopay/YopayOnboarding";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [hasYopayAccount, setHasYopayAccount] = useState(false);
  const [businessId] = useState('demo-business-id'); // Replace with actual business ID from context
  const { toast } = useToast();

  useEffect(() => {
    checkYopayAccount();
  }, []);

  const checkYopayAccount = async () => {
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

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {hasYopayAccount ? (
          <YopayDashboard businessId={businessId} userTier="solo" />
        ) : (
          <YopayOnboarding businessId={businessId} onComplete={handleOnboardingComplete} />
        )}
      </div>
    </DashboardLayout>
  );
}

