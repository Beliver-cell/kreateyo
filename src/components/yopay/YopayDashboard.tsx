import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { StatCard } from './StatCard';
import { UpgradePrompt } from './UpgradePrompt';
import { FeeBreakdown } from './FeeBreakdown';
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ui/error-message";

interface YopayDashboardProps {
  businessId: string;
  userTier: 'solo' | 'team' | 'enterprise';
}

const YopayConfig = {
  tieredFees: {
    solo: 3.5,
    team: 2.0,
    enterprise: 0.5
  }
};

export const YopayDashboard = ({ businessId, userTier }: YopayDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [businessId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/businesses/${businessId}/yopay/dashboard`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('An error occurred while loading dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header with Tier Info */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Yopay</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {userTier === 'solo' && 'Solo Plan - 3.5% platform fee'}
                {userTier === 'team' && 'Team Plan - 2.0% platform fee'}  
                {userTier === 'enterprise' && 'Enterprise Plan - 0.5% platform fee'}
              </p>
            </div>
            <UpgradePrompt userTier={userTier} />
          </div>
        </div>

        {/* Revenue Summary with Fee Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Revenue"
            value={`₦${dashboardData?.revenue?.total || '0'}`}
            subtitle="All payments received"
            trend="neutral"
          />
          <StatCard
            title="Platform Fees"
            value={`₦${dashboardData?.revenue?.platformFees || '0'}`}
            subtitle={`${YopayConfig.tieredFees[userTier]}% of revenue`}
            trend="negative"
          />
          <StatCard
            title="Flutterwave Fees"
            value={`₦${dashboardData?.revenue?.flutterwaveFees || '0'}`}
            subtitle="1.4% per transaction"
            trend="negative"
          />
          <StatCard
            title="Net Revenue"
            value={`₦${dashboardData?.revenue?.net || '0'}`}
            subtitle="After all fees"
            trend="positive"
          />
          <StatCard
            title="Success Rate"
            value={`${dashboardData?.analytics?.successRate || '0'}%`}
            subtitle="Payment success"
            trend="positive"
          />
        </div>

        {/* Recent Transactions with Fee Breakdown */}
        <Card className="p-4 md:p-6">
          <div className="border-b border-border pb-3 md:pb-4 mb-3 md:mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentTransactions?.length > 0 ? (
              dashboardData.recentTransactions.map((transaction: any) => (
                <div key={transaction._id} className="border border-border rounded-lg p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₦{transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.status === 'successful' ? (
                          <span className="text-green-600">Successful</span>
                        ) : (
                          <span className="text-orange-600">{transaction.status}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {transaction.status === 'successful' && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Platform Fee:</span>
                          <span className="ml-2 font-medium text-destructive">
                            -₦{transaction.fees.platform.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Flutterwave:</span>
                          <span className="ml-2 font-medium text-destructive">
                            -₦{transaction.fees.flutterwave.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">You Received:</span>
                          <span className="ml-2 font-medium text-green-600">
                            ₦{transaction.netAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
