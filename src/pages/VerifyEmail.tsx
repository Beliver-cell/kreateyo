import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      toast({
        title: "Email verified!",
        description: "Your account has been successfully verified.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter all 6 digits.",
        variant: "destructive",
      });
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We sent a 6-digit code to email@example.com
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg font-bold"
              />
            ))}
          </div>

          <Button onClick={handleVerify} className="w-full">
            Verify Email
          </Button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Didn't receive code? Resend
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Didn't receive code? Resend ({timer}s)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
