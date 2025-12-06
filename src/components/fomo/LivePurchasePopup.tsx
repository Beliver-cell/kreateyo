import { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';

interface PurchaseData {
  customerName: string;
  customerLocation: string;
  productName: string;
  createdAt: string;
}

interface LivePurchasePopupProps {
  businessId: string;
  enabled: boolean;
  frequency: number;
  duration: number;
  useRealData: boolean;
  position: string;
  primaryColor: string;
  simulatedNames?: string[];
  simulatedLocations?: string[];
}

const defaultNames = ['Sarah', 'John', 'Emma', 'Michael', 'Olivia', 'David', 'Sophia', 'James', 'Ava', 'Daniel'];
const defaultLocations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Accra', 'Nairobi', 'London', 'New York', 'Dubai'];

export function LivePurchasePopup({
  businessId,
  enabled,
  frequency,
  duration,
  useRealData,
  position,
  primaryColor,
  simulatedNames = defaultNames,
  simulatedLocations = defaultLocations,
}: LivePurchasePopupProps) {
  const [visible, setVisible] = useState(false);
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const showPopup = async () => {
      if (dismissed) return;

      let purchaseData: PurchaseData;

      if (useRealData) {
        try {
          const response = await fetch(`/api/fomo/recent-purchases/${businessId}?limit=10`);
          const purchases = await response.json();
          if (purchases.length > 0) {
            const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
            purchaseData = randomPurchase;
          } else {
            purchaseData = generateSimulatedPurchase();
          }
        } catch {
          purchaseData = generateSimulatedPurchase();
        }
      } else {
        purchaseData = generateSimulatedPurchase();
      }

      setPurchase(purchaseData);
      setVisible(true);

      fetch(`/api/fomo/analytics/${businessId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetType: 'live_purchase_popup', eventType: 'impression' }),
      }).catch(() => {});

      setTimeout(() => {
        setVisible(false);
      }, duration * 1000);
    };

    const generateSimulatedPurchase = (): PurchaseData => {
      const names = simulatedNames.length > 0 ? simulatedNames : defaultNames;
      const locations = simulatedLocations.length > 0 ? simulatedLocations : defaultLocations;
      const products = ['Premium Sneakers', 'Designer Bag', 'Smart Watch', 'Wireless Headphones', 'Running Shoes'];
      
      return {
        customerName: names[Math.floor(Math.random() * names.length)],
        customerLocation: locations[Math.floor(Math.random() * locations.length)],
        productName: products[Math.floor(Math.random() * products.length)],
        createdAt: new Date().toISOString(),
      };
    };

    const timer = setInterval(showPopup, frequency * 1000);
    
    const initialDelay = setTimeout(showPopup, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(initialDelay);
    };
  }, [enabled, frequency, duration, useRealData, businessId, dismissed, simulatedNames, simulatedLocations]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${diffHours > 24 ? 's' : ''} ago`;
  };

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  };

  if (!enabled || !visible || !purchase) return null;

  return (
    <div 
      className={`fixed ${positionClasses[position as keyof typeof positionClasses] || 'bottom-4 left-4'} z-50 animate-in slide-in-from-bottom-5 fade-in duration-300`}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-4 max-w-xs border-l-4 flex items-start gap-3"
        style={{ borderLeftColor: primaryColor }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${primaryColor}20` }}
        >
          <ShoppingBag className="w-5 h-5" style={{ color: primaryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {purchase.customerName} from {purchase.customerLocation}
          </p>
          <p className="text-xs text-gray-600 truncate">
            just purchased <span className="font-medium">{purchase.productName}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: primaryColor }}>
            {getTimeAgo(purchase.createdAt)}
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
