import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface StockUrgencyProps {
  enabled: boolean;
  threshold: number;
  message: string;
  color: string;
  currentStock: number;
  businessId?: string;
}

export function StockUrgency({
  enabled,
  threshold,
  message,
  color,
  currentStock,
  businessId,
}: StockUrgencyProps) {
  const trackedRef = useRef(false);
  const shouldShow = enabled && currentStock < threshold && currentStock > 0;

  useEffect(() => {
    if (!trackedRef.current && shouldShow && businessId) {
      trackedRef.current = true;
      fetch(`/api/fomo/analytics/${businessId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetType: 'stock_urgency', eventType: 'impression' }),
      }).catch(() => {});
    }
  }, [shouldShow, businessId]);

  if (!shouldShow) return null;

  const displayMessage = message.replace('{count}', currentStock.toString());

  return (
    <div 
      className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium animate-pulse"
      style={{ 
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <AlertTriangle className="w-4 h-4" />
      <span>{displayMessage}</span>
    </div>
  );
}
