import { useState } from 'react';
import { ShoppingBag, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BusinessType } from '@/types/business';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  {
    type: 'ecommerce' as BusinessType,
    icon: ShoppingBag,
    title: 'E-commerce',
    description: 'Sell products online with built-in inventory and payments',
  },
  {
    type: 'services' as BusinessType,
    icon: Calendar,
    title: 'Services',
    description: 'Book clients and manage appointments with integrated scheduling',
  },
  {
    type: 'blog' as BusinessType,
    icon: FileText,
    title: 'Blog',
    description: 'Publish content and grow your audience with subscription tools',
  },
];

export function OnboardingModal() {
  const { businessProfile, setBusinessType, completeOnboarding } = useBusinessContext();
  const [selectedType, setSelectedType] = useState<BusinessType>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedType) {
      setBusinessType(selectedType);
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  return (
    <Dialog open={!businessProfile.onboarded} modal>
      <DialogContent className="max-w-4xl p-0 gap-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-3xl font-bold text-center">What will you build?</DialogTitle>
          <p className="text-muted-foreground text-center mt-2">
            Choose the business type that fits your needs. You can always customize later.
          </p>
        </DialogHeader>

        <div className="p-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {businessTypes.map(({ type, icon: Icon, title, description }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  p-6 rounded-xl border-2 text-left transition-all
                  hover:shadow-lg hover:scale-[1.02]
                  ${
                    selectedType === type
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }
                `}
              >
                <div
                  className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mb-4
                  ${selectedType === type ? 'bg-gradient-primary' : 'bg-muted'}
                `}
                >
                  <Icon className={`w-6 h-6 ${selectedType === type ? 'text-white' : 'text-foreground'}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedType}
              className="px-8 bg-gradient-primary hover:opacity-90"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
