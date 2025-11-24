import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
}

interface YopayOnboardingProps {
  businessId: string;
  onComplete: () => void;
}

export const YopayOnboarding = ({ businessId, onComplete }: YopayOnboardingProps) => {
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('business_verification');
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [banks, setBanks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    startOnboarding();
    fetchBanks();
  }, []);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/yopay/${businessId}/onboarding/start`, {
        country: 'NG'
      });
      
      if (response.data.success) {
        setSessionId(response.data.data.sessionId);
        setSteps(response.data.data.steps);
        setCurrentStep(response.data.data.currentStep);
        setProgress(response.data.data.progress);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to start onboarding',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await api.get('/yopay/banks?country=NG');
      if (response.data.success) {
        setBanks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    }
  };

  const handleNext = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await api.post(`/yopay/onboarding/${sessionId}/step`, {
        stepId: currentStep,
        answers: formData
      });

      if (response.data.success) {
        if (response.data.data.completed) {
          toast({
            title: 'Success!',
            description: 'Yopay has been activated successfully'
          });
          onComplete();
        } else {
          setCurrentStep(response.data.data.currentStep);
          setProgress(response.data.data.progress);
          setFormData({});
          toast({
            title: 'Step completed',
            description: 'Moving to next step'
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to process step',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'business_verification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name || ''}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <Label htmlFor="business_email">Business Email</Label>
              <Input
                id="business_email"
                type="email"
                value={formData.business_email || ''}
                onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                placeholder="business@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name || ''}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="business_phone">Business Phone</Label>
              <Input
                id="business_phone"
                value={formData.business_phone || ''}
                onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
        );

      case 'bvn_verification':
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground">
                Your BVN is required for account verification. This information is securely encrypted and only used for identity verification.
              </p>
            </div>
            <div>
              <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
              <Input
                id="bvn"
                value={formData.bvn || ''}
                onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
                placeholder="Enter 11-digit BVN"
                maxLength={11}
              />
            </div>
          </div>
        );

      case 'bank_account':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank_code">Bank</Label>
              <Select
                value={formData.bank_code || ''}
                onValueChange={(value) => {
                  const bank = banks.find(b => b.code === value);
                  setFormData({
                    ...formData,
                    bank_code: value,
                    bank_name: bank?.name || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={formData.account_number || ''}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                placeholder="0123456789"
                maxLength={10}
              />
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                This is where you'll receive your payments. Make sure the account belongs to your business.
              </p>
            </div>
          </div>
        );

      case 'kyc_verification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="id_type">ID Type</Label>
              <Select
                value={formData.id_type || ''}
                onValueChange={(value) => setFormData({ ...formData, id_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="passport">International Passport</SelectItem>
                  <SelectItem value="voters_card">Voter's Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                value={formData.id_number || ''}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                placeholder="Enter your ID number"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps.find(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background py-4 md:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Set Up Yopay</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Complete your onboarding to start accepting payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Steps Overview */}
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    step.id === currentStep
                      ? 'bg-primary/10 border border-primary'
                      : step.completed
                      ? 'bg-muted'
                      : 'bg-background border'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        step.id === currentStep ? 'border-primary' : 'border-muted'
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Step Form */}
            {currentStepData && (
              <Card>
                <CardHeader>
                  <CardTitle>{currentStepData.title}</CardTitle>
                  <CardDescription>{currentStepData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderStepContent()}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button onClick={handleNext} disabled={loading} size="lg" className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
