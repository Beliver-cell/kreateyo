import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UpgradePromptProps {
  userTier: 'solo' | 'team' | 'enterprise';
}

export const UpgradePrompt = ({ userTier }: UpgradePromptProps) => {
  if (userTier === 'enterprise') return null;

  const nextTier = userTier === 'solo' ? 'team' : 'enterprise';
  const savings = userTier === 'solo' ? '1.5%' : '1.5%';
  const newRate = userTier === 'solo' ? '2%' : '0.5%';

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground mb-1">
            Upgrade to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
          </h4>
          <p className="text-sm text-muted-foreground">
            Save {savings} on every transaction - Only {newRate} platform fee
          </p>
        </div>
        <Button variant="default" size="sm">
          Upgrade Now
        </Button>
      </div>
    </Card>
  );
};
