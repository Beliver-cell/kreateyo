import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LivePurchasePopup } from './LivePurchasePopup';
import { FlashSaleBanner } from './FlashSaleBanner';

interface FomoSettings {
  livePurchaseEnabled: boolean;
  livePurchaseFrequency: number;
  livePurchaseDuration: number;
  livePurchaseUseRealData: boolean;
  livePurchaseSimulatedNames: string[];
  livePurchaseSimulatedLocations: string[];
  viewerCountEnabled: boolean;
  viewerCountMinimum: number;
  viewerCountMultiplier: string;
  viewerCountShowOnProduct: boolean;
  viewerCountShowOnCart: boolean;
  stockUrgencyEnabled: boolean;
  stockUrgencyThreshold: number;
  stockUrgencyMessage: string;
  stockUrgencyColor: string;
  countdownEnabled: boolean;
  countdownEndDate: string | null;
  countdownMessage: string;
  countdownShowOnProducts: boolean;
  soldCounterEnabled: boolean;
  soldCounterTimeWindow: number;
  soldCounterMinimum: number;
  soldCounterMessage: string;
  flashSaleEnabled: boolean;
  flashSaleStartDate: string | null;
  flashSaleEndDate: string | null;
  flashSaleDiscount: number | null;
  flashSaleMessage: string;
  flashSaleBgColor: string;
  flashSaleTextColor: string;
  popupPosition: string;
  primaryColor: string;
}

interface FomoContextType {
  settings: FomoSettings | null;
  loading: boolean;
  trackEvent: (widgetType: string, eventType: 'impression' | 'click' | 'conversion') => void;
  businessId: string;
}

const defaultSettings: FomoSettings = {
  livePurchaseEnabled: true,
  livePurchaseFrequency: 30,
  livePurchaseDuration: 5,
  livePurchaseUseRealData: true,
  livePurchaseSimulatedNames: [],
  livePurchaseSimulatedLocations: [],
  viewerCountEnabled: true,
  viewerCountMinimum: 1,
  viewerCountMultiplier: '1.0',
  viewerCountShowOnProduct: true,
  viewerCountShowOnCart: false,
  stockUrgencyEnabled: true,
  stockUrgencyThreshold: 10,
  stockUrgencyMessage: 'Only {count} left - order soon!',
  stockUrgencyColor: '#ef4444',
  countdownEnabled: false,
  countdownEndDate: null,
  countdownMessage: 'Sale ends in',
  countdownShowOnProducts: true,
  soldCounterEnabled: true,
  soldCounterTimeWindow: 24,
  soldCounterMinimum: 5,
  soldCounterMessage: '{count} sold in the last {hours} hours',
  flashSaleEnabled: false,
  flashSaleStartDate: null,
  flashSaleEndDate: null,
  flashSaleDiscount: null,
  flashSaleMessage: 'Flash Sale - {discount}% off ends tonight!',
  flashSaleBgColor: '#dc2626',
  flashSaleTextColor: '#ffffff',
  popupPosition: 'bottom-left',
  primaryColor: '#10b981',
};

const FomoContext = createContext<FomoContextType>({
  settings: null,
  loading: true,
  trackEvent: () => {},
  businessId: '',
});

interface FomoProviderProps {
  children: ReactNode;
  businessId: string;
}

export function FomoProvider({ children, businessId }: FomoProviderProps) {
  const [settings, setSettings] = useState<FomoSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/fomo/settings/${businessId}`);
        if (response.ok) {
          const data = await response.json();
          setSettings({ ...defaultSettings, ...data });
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching FOMO settings:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessId]);

  const trackEvent = (widgetType: string, eventType: 'impression' | 'click' | 'conversion') => {
    if (!businessId) return;
    
    fetch(`/api/fomo/analytics/${businessId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgetType, eventType }),
    }).catch(err => console.error('Error tracking FOMO event:', err));
  };

  const fomoSettings = settings || defaultSettings;

  return (
    <FomoContext.Provider value={{ settings: fomoSettings, loading, trackEvent, businessId }}>
      {children}
      
      {fomoSettings.livePurchaseEnabled && (
        <LivePurchasePopup
          businessId={businessId}
          enabled={fomoSettings.livePurchaseEnabled}
          frequency={fomoSettings.livePurchaseFrequency}
          duration={fomoSettings.livePurchaseDuration}
          useRealData={fomoSettings.livePurchaseUseRealData}
          position={fomoSettings.popupPosition}
          primaryColor={fomoSettings.primaryColor}
          simulatedNames={fomoSettings.livePurchaseSimulatedNames}
          simulatedLocations={fomoSettings.livePurchaseSimulatedLocations}
        />
      )}
      
      {fomoSettings.flashSaleEnabled && (
        <FlashSaleBanner
          enabled={fomoSettings.flashSaleEnabled}
          startDate={fomoSettings.flashSaleStartDate}
          endDate={fomoSettings.flashSaleEndDate}
          discount={fomoSettings.flashSaleDiscount}
          message={fomoSettings.flashSaleMessage}
          bgColor={fomoSettings.flashSaleBgColor}
          textColor={fomoSettings.flashSaleTextColor}
        />
      )}
    </FomoContext.Provider>
  );
}

export function useFomo() {
  const context = useContext(FomoContext);
  if (!context) {
    throw new Error('useFomo must be used within a FomoProvider');
  }
  return context;
}
