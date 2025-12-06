import { useState, useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';

interface SoldCounterProps {
  businessId: string;
  productId?: string;
  enabled: boolean;
  timeWindow: number;
  minimum: number;
  message: string;
  primaryColor: string;
}

export function SoldCounter({
  businessId,
  productId,
  enabled,
  timeWindow,
  minimum,
  message,
  primaryColor,
}: SoldCounterProps) {
  const [soldCount, setSoldCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchSoldCount = async () => {
      try {
        if (productId) {
          const response = await fetch(`/api/fomo/sold-count/${businessId}/${productId}?hours=${timeWindow}`);
          const data = await response.json();
          setSoldCount(data.count || 0);
        } else {
          const response = await fetch(`/api/fomo/activity/${businessId}?hours=${timeWindow}`);
          const activities = await response.json();
          const purchases = activities.filter((a: any) => a.activityType === 'purchase');
          const totalSold = purchases.reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
          setSoldCount(totalSold);
        }
      } catch (error) {
        console.error('Error fetching sold count:', error);
        setSoldCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldCount();
    
    const interval = setInterval(fetchSoldCount, 60000);
    return () => clearInterval(interval);
  }, [enabled, businessId, productId, timeWindow]);

  useEffect(() => {
    if (!trackedRef.current && enabled && soldCount !== null && soldCount >= minimum) {
      trackedRef.current = true;
      fetch(`/api/fomo/analytics/${businessId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetType: 'sold_counter', eventType: 'impression' }),
      }).catch(() => {});
    }
  }, [enabled, soldCount, minimum, businessId]);

  if (!enabled || loading || soldCount === null || soldCount < minimum) return null;

  const displayMessage = message
    .replace('{count}', soldCount.toString())
    .replace('{hours}', timeWindow.toString());

  return (
    <div 
      className="flex items-center gap-2 text-sm font-medium"
      style={{ color: primaryColor }}
    >
      <TrendingUp className="w-4 h-4" />
      <span>{displayMessage}</span>
    </div>
  );
}
