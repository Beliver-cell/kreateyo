import { Card } from "@/components/ui/card";

interface Transaction {
  _id: string;
  amount: number;
  fees: {
    platform: number;
    flutterwave: number;
    total: number;
  };
  netAmount: number;
}

interface FeeBreakdownProps {
  transaction: Transaction;
  userTier: 'solo' | 'team' | 'enterprise';
}

const YopayConfig = {
  tieredFees: {
    solo: 3.5,
    team: 2.0,
    enterprise: 0.5
  },
  flutterwaveFees: {
    transaction: 1.4
  }
};

export const FeeBreakdown = ({ transaction, userTier }: FeeBreakdownProps) => {
  const fees = YopayConfig.tieredFees;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Fee Breakdown</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Transaction Amount</span>
          <span className="font-medium text-foreground">₦{transaction.amount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Flutterwave Fee ({YopayConfig.flutterwaveFees.transaction}%)
          </span>
          <span className="text-destructive">-₦{transaction.fees.flutterwave.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {userTier === 'solo' && 'Solo Platform Fee (3.5%)'}
            {userTier === 'team' && 'Team Platform Fee (2.0%)'}  
            {userTier === 'enterprise' && 'Enterprise Platform Fee (0.5%)'}
          </span>
          <span className="text-destructive">-₦{transaction.fees.platform.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-foreground">You Receive</span>
            <span className="text-green-600">₦{transaction.netAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Tier Comparison */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Fee by Plan</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-foreground">Solo</div>
            <div className="text-destructive">{fees.solo}%</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">Team</div>
            <div className="text-orange-600">{fees.team}%</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">Enterprise</div>
            <div className="text-green-600">{fees.enterprise}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
