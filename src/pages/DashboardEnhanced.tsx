import { useBusinessContext } from '@/contexts/BusinessContext';
import { EcommercePhysicalDashboard } from '@/components/dashboards/EcommercePhysicalDashboard';
import { EcommerceDigitalDashboard } from '@/components/dashboards/EcommerceDigitalDashboard';
import { EcommerceDropshippingDashboard } from '@/components/dashboards/EcommerceDropshippingDashboard';
import { ServicesBaseDashboard } from '@/components/dashboards/ServicesBaseDashboard';

export default function DashboardEnhanced() {
  const { businessProfile } = useBusinessContext();

  const renderDashboard = () => {
    // Physical products
    if (businessProfile.type === 'physical') {
      return <EcommercePhysicalDashboard />;
    }

    // Digital products
    if (businessProfile.type === 'digital') {
      return <EcommerceDigitalDashboard />;
    }

    // Dropshipping
    if (businessProfile.type === 'dropship') {
      return <EcommerceDropshippingDashboard />;
    }

    // Services
    if (businessProfile.type === 'service') {
      return (
        <ServicesBaseDashboard
          title="Services Dashboard"
          description="Manage your service bookings, clients, and projects"
        />
      );
    }

    // Default fallback
    return <EcommercePhysicalDashboard />;
  };

  return renderDashboard();
}
