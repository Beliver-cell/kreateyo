import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Store, Briefcase, BookOpen, Package, Download, Truck, Megaphone, Palette, Briefcase as Operations, FileText, Users, ArrowLeft } from 'lucide-react';
import { BusinessType, EcommerceSubType, ServicesSubType } from '@/types/business';

export function OnboardingModalEnhanced({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<'main' | 'ecommerce' | 'services'>('main');
  const { setBusinessType, setBusinessSubType, completeOnboarding } = useBusinessContext();
  const navigate = useNavigate();

  const mainBusinessTypes = [
    { id: 'ecommerce', icon: Store, title: 'E-commerce Store', description: 'Sell products online' },
    { id: 'services', icon: Briefcase, title: 'Services Business', description: 'Offer professional services' },
    { id: 'blog', icon: BookOpen, title: 'Blog/Content Site', description: 'Share content and stories' }
  ];

  const ecommerceSubTypes = [
    { id: 'physical', icon: Package, title: 'Physical Products', description: 'Tangible goods with shipping' },
    { id: 'digital', icon: Download, title: 'Digital Products', description: 'Downloadable content & files' },
    { id: 'dropshipping', icon: Truck, title: 'Dropshipping', description: 'Sell without holding inventory' }
  ];

  const servicesSubTypes = [
    { id: 'marketing', icon: Megaphone, title: 'Marketing & Sales', description: 'Campaigns, ads, lead generation' },
    { id: 'design', icon: Palette, title: 'Design & Development', description: 'Creative & technical projects' },
    { id: 'operations', icon: Operations, title: 'Business Operations', description: 'Process & workflow management' },
    { id: 'writing', icon: FileText, title: 'Writing & Content', description: 'Articles, copy, documentation' },
    { id: 'coaching', icon: Users, title: 'Coaching & Consulting', description: 'Guidance & expert advice' }
  ];

  const handleMainSelection = (type: BusinessType) => {
    if (type === 'blog') {
      setBusinessType(type);
      completeOnboarding();
      navigate('/dashboard');
      onOpenChange(false);
    } else if (type === 'ecommerce') {
      setBusinessType(type);
      setStep('ecommerce');
    } else if (type === 'services') {
      setBusinessType(type);
      setStep('services');
    }
  };

  const handleSubTypeSelection = (subType: EcommerceSubType | ServicesSubType) => {
    setBusinessSubType(subType);
    completeOnboarding();
    navigate('/dashboard');
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('main');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            {step === 'main' && 'Welcome! What type of business are you building?'}
            {step === 'ecommerce' && 'What will you be selling?'}
            {step === 'services' && "What's your service specialty?"}
          </DialogTitle>
        </DialogHeader>

        {step !== 'main' && (
          <Button variant="ghost" onClick={handleBack} className="w-fit mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {step === 'main' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {mainBusinessTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleMainSelection(type.id as BusinessType)}
                className="p-8 border-2 border-border rounded-xl hover:border-primary hover:bg-accent/50 transition-all group text-left"
              >
                <type.icon className="h-12 w-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </button>
            ))}
          </div>
        )}

        {step === 'ecommerce' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {ecommerceSubTypes.map((subType) => (
              <button
                key={subType.id}
                onClick={() => handleSubTypeSelection(subType.id as EcommerceSubType)}
                className="p-8 border-2 border-border rounded-xl hover:border-primary hover:bg-accent/50 transition-all group text-left"
              >
                <subType.icon className="h-12 w-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{subType.title}</h3>
                <p className="text-sm text-muted-foreground">{subType.description}</p>
              </button>
            ))}
          </div>
        )}

        {step === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {servicesSubTypes.map((subType) => (
              <button
                key={subType.id}
                onClick={() => handleSubTypeSelection(subType.id as ServicesSubType)}
                className="p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-accent/50 transition-all group text-left"
              >
                <subType.icon className="h-10 w-10 mb-3 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{subType.title}</h3>
                <p className="text-sm text-muted-foreground">{subType.description}</p>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
