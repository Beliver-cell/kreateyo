import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { canAccessRoute, PlanType } from '@/types/plans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPlan?: 'growth' | 'business';
  route?: string;
}

export function ProtectedRoute({ children, requiredPlan, route }: ProtectedRouteProps) {
  const { businessProfile } = useBusinessContext();
  const currentPlan = businessProfile.plan || 'starter';

  // Check route-specific access
  if (route && !canAccessRoute(currentPlan, route)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle>Upgrade Required</CardTitle>
            <CardDescription>
              This feature requires a {requiredPlan || 'higher'} plan to access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/billing">
                Upgrade to {requiredPlan === 'business' ? 'Business' : 'Growth'}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check plan hierarchy
  if (requiredPlan) {
    const planHierarchy: Record<PlanType, number> = { starter: 0, growth: 1, business: 2 };
    if (planHierarchy[currentPlan] < planHierarchy[requiredPlan]) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Lock className="h-8 w-8" />
              </div>
              <CardTitle>Upgrade Required</CardTitle>
              <CardDescription>
                This feature requires a {requiredPlan} plan or higher.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/billing">
                  Upgrade to {requiredPlan === 'business' ? 'Business' : 'Growth'}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
}
