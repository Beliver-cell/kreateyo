import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { customerAuth } from '@/services/customerApi';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useBusinessBranding, getBusinessIdentifier } from '@/hooks/useBusinessBranding';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function CustomerLogin() {
  const { toast } = useToast();
  const { login } = useCustomerAuth();
  const { branding, isLoading: brandingLoading, error: brandingError } = useBusinessBranding();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessId: '',
  });

  useEffect(() => {
    if (branding?.id) {
      setFormData(prev => ({ ...prev, businessId: branding.id }));
    } else {
      const identifier = getBusinessIdentifier();
      if (identifier) {
        setFormData(prev => ({ ...prev, businessId: identifier }));
      }
    }
  }, [branding]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await customerAuth.login(formData);
      login(response.token, response.customer);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (brandingLoading && getBusinessIdentifier()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (brandingError && getBusinessIdentifier()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold">Business Not Found</h1>
          <p className="text-muted-foreground">We couldn't find this business. Please check the link and try again.</p>
        </div>
      </div>
    );
  }

  const brandColorStyle = branding?.brandColor ? { '--brand-color': branding.brandColor } as React.CSSProperties : {};

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4"
      style={brandColorStyle}
    >
      <div className="w-full max-w-md space-y-6 bg-card p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {branding?.logo ? (
              <img 
                src={branding.logo} 
                alt={branding.name} 
                className="h-12 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <Sparkles 
                className="h-10 w-10 sm:h-12 sm:w-12" 
                style={{ color: branding?.brandColor || 'hsl(var(--primary))' }}
              />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {branding?.name ? `Welcome to ${branding.name}` : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5 h-11"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1.5 h-11"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/customer/forgot-password"
              className="text-sm text-primary hover:underline inline-block py-2"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">New here?</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/customer/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
