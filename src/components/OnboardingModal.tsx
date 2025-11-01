import { useState } from 'react';
import { ShoppingBag, Calendar, FileText, Layout, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

const templates = {
  ecommerce: [
    {
      id: 'ecom-modern',
      name: 'Modern Minimalist',
      description: 'Clean design with large product imagery',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      popular: true
    },
    {
      id: 'ecom-vibrant',
      name: 'Vibrant Store',
      description: 'Bold colors perfect for fashion and lifestyle',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
    },
    {
      id: 'ecom-luxury',
      name: 'Luxury Boutique',
      description: 'Elegant design for premium products',
      gradient: 'from-amber-900 via-yellow-600 to-amber-900',
    }
  ],
  services: [
    {
      id: 'serv-professional',
      name: 'Professional Services',
      description: 'Trust-building design for consultants',
      gradient: 'from-blue-900 via-blue-700 to-cyan-900',
      popular: true
    },
    {
      id: 'serv-wellness',
      name: 'Wellness & Health',
      description: 'Calming design for yoga and wellness',
      gradient: 'from-green-800 via-teal-600 to-green-800',
    },
    {
      id: 'serv-creative',
      name: 'Creative Studio',
      description: 'Bold layout for designers and artists',
      gradient: 'from-purple-900 via-pink-800 to-purple-900',
    }
  ],
  blog: [
    {
      id: 'blog-magazine',
      name: 'Digital Magazine',
      description: 'Editorial layout with featured stories',
      gradient: 'from-indigo-900 via-blue-800 to-indigo-900',
      popular: true
    },
    {
      id: 'blog-minimal',
      name: 'Minimal Blog',
      description: 'Distraction-free reading experience',
      gradient: 'from-gray-800 via-gray-700 to-gray-900',
    },
    {
      id: 'blog-lifestyle',
      name: 'Lifestyle Blog',
      description: 'Instagram-style layout for lifestyle content',
      gradient: 'from-rose-500 via-orange-500 to-yellow-500',
    }
  ]
};

export function OnboardingModal() {
  const { businessProfile, setBusinessType, completeOnboarding } = useBusinessContext();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<BusinessType>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentTemplates = selectedType ? templates[selectedType as keyof typeof templates] : [];

  const handleContinue = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && selectedTemplate) {
      setBusinessType(selectedType);
      completeOnboarding();
      navigate('/build');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedTemplate(null);
    }
  };

  const handleSkipTemplate = () => {
    if (selectedType) {
      setBusinessType(selectedType);
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  return (
    <Dialog open={!businessProfile.onboarded} modal>
      <DialogContent className="max-w-4xl p-0 gap-0 max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-center">
            {step === 1 ? 'What will you build?' : 'Choose your starting template'}
          </DialogTitle>
          <p className="text-muted-foreground text-center mt-2">
            {step === 1 
              ? 'Choose the business type that fits your needs' 
              : 'Pick a template to get started quickly (you can customize it later)'}
          </p>
        </DialogHeader>

        <div className="p-8 pt-4">
          {step === 1 && (
            <>
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
                  Continue to Templates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {currentTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className={`aspect-video bg-gradient-to-br ${template.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <Layout className="w-12 h-12 text-white/20" />
                      {template.popular && (
                        <Badge className="absolute top-3 right-3 bg-primary">
                          Popular
                        </Badge>
                      )}
                      {selectedTemplate === template.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleSkipTemplate}
                  >
                    Skip for now
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!selectedTemplate}
                    className="px-8 bg-gradient-primary hover:opacity-90"
                  >
                    Start Building
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
