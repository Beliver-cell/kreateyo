import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Store, Briefcase, Package, Download, Truck, Megaphone, Palette, Briefcase as Operations, FileText, Users, ArrowLeft, Sparkles, Heart, Loader2, Instagram, Facebook, Twitter, Globe, Clock } from 'lucide-react';
import { BusinessType, EcommerceSubType, ServicesSubType } from '@/types/business';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface BrandingData {
  name: string;
  logo: string;
  brandColor: string;
  secondaryColor: string;
  description: string;
  activeHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

const defaultHours = {
  monday: { open: '09:00', close: '17:00', closed: false },
  tuesday: { open: '09:00', close: '17:00', closed: false },
  wednesday: { open: '09:00', close: '17:00', closed: false },
  thursday: { open: '09:00', close: '17:00', closed: false },
  friday: { open: '09:00', close: '17:00', closed: false },
  saturday: { open: '09:00', close: '17:00', closed: true },
  sunday: { open: '09:00', close: '17:00', closed: true },
};

export function OnboardingModalEnhanced({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<'main' | 'ecommerce' | 'services' | 'branding' | 'hours' | 'social'>('main');
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<EcommerceSubType | ServicesSubType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandingData, setBrandingData] = useState<BrandingData>({
    name: '',
    logo: '',
    brandColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    description: '',
    activeHours: defaultHours,
    socialLinks: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });
  const { setBusinessType, setBusinessSubType, completeOnboarding } = useBusinessContext();
  const navigate = useNavigate();

  const mainBusinessTypes = [
    { id: 'ecommerce', icon: Store, title: 'E-commerce Store', description: 'Sell products online' },
    { id: 'services', icon: Briefcase, title: 'Services Business', description: 'Offer professional services' },
    { id: 'digital', icon: Sparkles, title: 'Digital/Creators', description: 'Courses, ebooks, templates & more' },
    { id: 'community', icon: Heart, title: 'Communities', description: 'NGOs, churches, clubs & associations' }
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
    setSelectedType(type);
    if (type === 'ecommerce') {
      setStep('ecommerce');
    } else if (type === 'services') {
      setStep('services');
    } else {
      setStep('branding');
    }
  };

  const handleSubTypeSelection = (subType: EcommerceSubType | ServicesSubType) => {
    setSelectedSubType(subType);
    setStep('branding');
  };

  const handleBrandingNext = () => {
    if (!brandingData.name.trim()) {
      toast.error('Please enter your business name');
      return;
    }
    setStep('hours');
  };

  const handleHoursNext = () => {
    setStep('social');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/businesses', {
        name: brandingData.name,
        logo: brandingData.logo || null,
        brandColor: brandingData.brandColor,
        secondaryColor: brandingData.secondaryColor,
        description: brandingData.description || null,
        category: selectedType,
        activeHours: brandingData.activeHours,
        socialLinks: brandingData.socialLinks,
      });

      if (selectedType) {
        setBusinessType(selectedType);
      }
      if (selectedSubType) {
        setBusinessSubType(selectedSubType);
      }
      completeOnboarding();
      toast.success('Business created successfully!');
      navigate('/dashboard');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'social') {
      setStep('hours');
    } else if (step === 'hours') {
      setStep('branding');
    } else if (step === 'branding') {
      if (selectedSubType) {
        if (selectedType === 'ecommerce') {
          setStep('ecommerce');
        } else if (selectedType === 'services') {
          setStep('services');
        } else {
          setStep('main');
        }
        setSelectedSubType(null);
      } else {
        setStep('main');
        setSelectedType(null);
      }
    } else {
      setStep('main');
      setSelectedType(null);
      setSelectedSubType(null);
    }
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setBrandingData(prev => ({
      ...prev,
      activeHours: {
        ...prev.activeHours,
        [day]: {
          ...prev.activeHours[day as keyof typeof prev.activeHours],
          [field]: value,
        },
      },
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setBrandingData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            {step === 'main' && 'Welcome! What type of business are you building?'}
            {step === 'ecommerce' && 'What will you be selling?'}
            {step === 'services' && "What's your service specialty?"}
            {step === 'branding' && 'Set up your brand'}
            {step === 'hours' && 'Set your business hours'}
            {step === 'social' && 'Connect your social profiles'}
          </DialogTitle>
        </DialogHeader>

        {step !== 'main' && (
          <Button variant="ghost" onClick={handleBack} className="w-fit mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {step === 'main' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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

        {step === 'branding' && (
          <div className="space-y-6 mt-4">
            <p className="text-center text-muted-foreground">
              Tell us about your business so we can personalize your experience.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={brandingData.name}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo URL (optional)</Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={brandingData.logo}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, logo: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brandColor">Primary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      id="brandColor"
                      value={brandingData.brandColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, brandColor: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={brandingData.brandColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, brandColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers what your business is about..."
                  value={brandingData.description}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  background: `linear-gradient(135deg, ${brandingData.brandColor}20, ${brandingData.secondaryColor}20)`,
                  borderColor: brandingData.brandColor 
                }}
              >
                <p className="text-sm font-medium mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  {brandingData.logo ? (
                    <img 
                      src={brandingData.logo} 
                      alt="Logo preview" 
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
                      style={{ backgroundColor: brandingData.brandColor }}
                    >
                      {brandingData.name.charAt(0).toUpperCase() || 'B'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold" style={{ color: brandingData.brandColor }}>
                      {brandingData.name || 'Your Business Name'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {brandingData.description || 'Your business description'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleBrandingNext} 
              className="w-full"
              disabled={!brandingData.name.trim()}
              style={{ backgroundColor: brandingData.brandColor }}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'hours' && (
          <div className="space-y-6 mt-4">
            <p className="text-center text-muted-foreground">
              Set your business hours so customers know when you're available.
            </p>

            <div className="space-y-3">
              {days.map((day) => {
                const dayHours = brandingData.activeHours[day as keyof typeof brandingData.activeHours];
                return (
                  <div key={day} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="w-24">
                      <span className="capitalize font-medium">{day}</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!dayHours.closed}
                        onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Open</span>
                    </label>
                    {!dayHours.closed && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={dayHours.open}
                            onChange={(e) => updateHours(day, 'open', e.target.value)}
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={dayHours.close}
                            onChange={(e) => updateHours(day, 'close', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      </>
                    )}
                    {dayHours.closed && (
                      <span className="text-muted-foreground text-sm">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleHoursNext} 
                className="flex-1"
                style={{ backgroundColor: brandingData.brandColor }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'social' && (
          <div className="space-y-6 mt-4">
            <p className="text-center text-muted-foreground">
              Connect your social profiles to help customers find you everywhere. (Optional)
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="https://yourwebsite.com"
                  value={brandingData.socialLinks.website}
                  onChange={(e) => updateSocialLink('website', e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="@yourbusiness"
                  value={brandingData.socialLinks.instagram}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="facebook.com/yourbusiness"
                  value={brandingData.socialLinks.facebook}
                  onChange={(e) => updateSocialLink('facebook', e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="@yourbusiness"
                  value={brandingData.socialLinks.twitter}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleFinalSubmit} 
                className="flex-1"
                disabled={isSubmitting}
                style={{ backgroundColor: brandingData.brandColor }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating your business...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
