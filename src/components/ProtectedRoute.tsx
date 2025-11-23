import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { canAccessRoute } from '@/config/businessConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  route: string;
}

export function ProtectedRoute({ children, route }: ProtectedRouteProps) {
  const { businessConfig, setPlan } = useBusinessContext();

  if (!canAccessRoute(route, businessConfig)) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-md border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>Feature Locked</CardTitle>
            </div>
            <CardDescription>
              This feature requires a higher plan to access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {route.includes('/pos') && (
                <>
                  <p className="text-sm">
                    <strong>Point of Sale (POS)</strong> is available on the Enterprise plan.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>In-person sales terminal</li>
                    <li>Receipt printing</li>
                    <li>Inventory sync</li>
                    <li>Multi-cashier support</li>
                  </ul>
                </>
              )}
              {route.includes('/developer') && (
                <>
                  <p className="text-sm">
                    <strong>Developer Tools</strong> are available on the Enterprise plan.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>API access</li>
                    <li>Webhooks</li>
                    <li>Custom integrations</li>
                    <li>SDK access</li>
                  </ul>
                </>
              )}
              {route.includes('/team') && (
                <>
                  <p className="text-sm">
                    <strong>Team Collaboration</strong> is available on Pro and Enterprise plans.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Add team members</li>
                    <li>Role-based permissions</li>
                    <li>Collaborative workflows</li>
                  </ul>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/billing'} className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
