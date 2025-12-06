import { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';

interface FlashSaleBannerProps {
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
  discount: number | null;
  message: string;
  bgColor: string;
  textColor: string;
}

export function FlashSaleBanner({
  enabled,
  startDate,
  endDate,
  discount,
  message,
  bgColor,
  textColor,
}: FlashSaleBannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      return;
    }

    const checkActive = () => {
      const now = new Date();
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      
      setIsActive(now >= start && now <= end);
    };

    checkActive();
    const interval = setInterval(checkActive, 60000);
    return () => clearInterval(interval);
  }, [enabled, startDate, endDate]);

  if (!enabled || !isActive || dismissed) return null;

  const displayMessage = message.replace('{discount}', (discount || 0).toString());

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 py-2 px-4 flex items-center justify-center gap-2"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Zap className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-semibold">{displayMessage}</span>
      <button 
        onClick={() => setDismissed(true)}
        className="absolute right-4 opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
