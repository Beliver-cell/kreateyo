import { DashboardLayout } from "@/components/DashboardLayout";
import { YopayDashboard } from "@/components/yopay/YopayDashboard";

export default function Payments() {
  // Mock data - replace with actual API calls
  const userTier = 'solo' as 'solo' | 'team' | 'enterprise';
  const businessId = '123';

  return (
    <DashboardLayout>
      <YopayDashboard businessId={businessId} userTier={userTier} />
    </DashboardLayout>
  );
}

