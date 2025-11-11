import { DashboardLayout } from '@/components/DashboardLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { EcommercePhysicalDashboard } from '@/components/dashboards/EcommercePhysicalDashboard';
import { EcommerceDigitalDashboard } from '@/components/dashboards/EcommerceDigitalDashboard';
import { EcommerceDropshippingDashboard } from '@/components/dashboards/EcommerceDropshippingDashboard';
import { ServicesBaseDashboard } from '@/components/dashboards/ServicesBaseDashboard';
import { Card } from '@/components/ui/card';
import { BarChart3, Target, Lightbulb, FileCheck, MessageSquare, CheckCircle, BookOpen, Calendar } from 'lucide-react';

export default function DashboardEnhanced() {
  const { businessProfile } = useBusinessContext();

  const renderDashboard = () => {
    if (businessProfile.type === 'ecommerce') {
      switch (businessProfile.subType) {
        case 'physical':
          return <EcommercePhysicalDashboard />;
        case 'digital':
          return <EcommerceDigitalDashboard />;
        case 'dropshipping':
          return <EcommerceDropshippingDashboard />;
        default:
          return <EcommercePhysicalDashboard />;
      }
    }

    if (businessProfile.type === 'services') {
      const categoryWidgets: Record<string, React.ReactNode> = {
        marketing: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Campaign Performance</h3>
              <p className="text-xs text-muted-foreground">Track ROI & conversions</p>
            </Card>
            <Card className="p-4">
              <Target className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Lead Tracker</h3>
              <p className="text-xs text-muted-foreground">Monitor conversion rates</p>
            </Card>
            <Card className="p-4">
              <Lightbulb className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">A/B Testing</h3>
              <p className="text-xs text-muted-foreground">Optimize campaigns</p>
            </Card>
          </div>
        ),
        design: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <CheckCircle className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Project Milestones</h3>
              <p className="text-xs text-muted-foreground">Track progress & deadlines</p>
            </Card>
            <Card className="p-4">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Client Feedback</h3>
              <p className="text-xs text-muted-foreground">Gather & manage reviews</p>
            </Card>
            <Card className="p-4">
              <FileCheck className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Approval Workflow</h3>
              <p className="text-xs text-muted-foreground">Streamline approvals</p>
            </Card>
          </div>
        ),
        operations: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <BookOpen className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">SOPs</h3>
              <p className="text-xs text-muted-foreground">Standard procedures</p>
            </Card>
            <Card className="p-4">
              <CheckCircle className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Compliance</h3>
              <p className="text-xs text-muted-foreground">Checklists & audits</p>
            </Card>
            <Card className="p-4">
              <Target className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Automation</h3>
              <p className="text-xs text-muted-foreground">Workflow optimization</p>
            </Card>
          </div>
        ),
        writing: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Content Calendar</h3>
              <p className="text-xs text-muted-foreground">Plan & schedule content</p>
            </Card>
            <Card className="p-4">
              <FileCheck className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Editorial Workflow</h3>
              <p className="text-xs text-muted-foreground">Manage revisions</p>
            </Card>
            <Card className="p-4">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Performance</h3>
              <p className="text-xs text-muted-foreground">Content analytics</p>
            </Card>
          </div>
        ),
        coaching: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Session Scheduler</h3>
              <p className="text-xs text-muted-foreground">Book & manage sessions</p>
            </Card>
            <Card className="p-4">
              <Target className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Progress Tracker</h3>
              <p className="text-xs text-muted-foreground">Client goals & milestones</p>
            </Card>
            <Card className="p-4">
              <BookOpen className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Resource Library</h3>
              <p className="text-xs text-muted-foreground">Share materials</p>
            </Card>
          </div>
        )
      };

      const titles: Record<string, string> = {
        marketing: 'Marketing & Sales Dashboard',
        design: 'Design & Development Dashboard',
        operations: 'Business Operations Dashboard',
        writing: 'Writing & Content Dashboard',
        coaching: 'Coaching & Consulting Dashboard'
      };

      const descriptions: Record<string, string> = {
        marketing: 'Manage campaigns, leads, and client reporting',
        design: 'Track projects, feedback, and approvals',
        operations: 'Optimize processes and workflows',
        writing: 'Plan content and track performance',
        coaching: 'Schedule sessions and track client progress'
      };

      const subType = businessProfile.subType || 'marketing';
      return (
        <ServicesBaseDashboard
          title={titles[subType] || 'Services Dashboard'}
          description={descriptions[subType] || 'Manage your service business'}
          categorySpecificWidgets={categoryWidgets[subType]}
        />
      );
    }

    // Blog dashboard - use existing dashboard logic
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and engage with your audience</p>
        </div>
      </div>
    );
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
